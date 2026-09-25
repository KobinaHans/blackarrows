# Deploying to AWS

Region: `af-south-1` (Cape Town) by default. Opt the account into the region first, because it is disabled by default.

## What gets created

- VPC across three availability zones, with public, private and database subnets, a NAT gateway, VPC endpoints (S3, ECR, CloudWatch Logs, Secrets Manager) and flow logs
- ECR repositories (`web`, `admin`, `migrator`) with immutable tags, KMS encryption and scan on push
- RDS PostgreSQL 17: Multi-AZ, gp3 storage with autoscaling, KMS encryption, forced TLS, 14-day backups, Performance Insights, deletion protection
- S3 media bucket with public access blocked, versioning, SSE-KMS and a TLS-only policy; a log bucket for ALB access logs
- Secrets Manager entries for the database URL, RDS CA bundle, auth secret, revalidation secret, IP hash salt and origin-verify secret; placeholders for SMTP, Resend and Microsoft SSO
- ECS Fargate cluster with Container Insights, Service Connect (`http://web:3000`), web and console services (circuit breaker with rollback), CPU autoscaling for the website, and migrate and retention task definitions
- Application Load Balancer with TLS 1.3 policy. It is reachable only from CloudFront's managed prefix list and forwards only requests carrying the origin-verify header
- Two CloudFront distributions (website, console) with managed caching for static assets and media, and WAF web ACLs: IP reputation, common rule set, known bad inputs, per-IP rate limiting, and an optional console IP allowlist
- ACM certificates (regional and us-east-1), with Route 53 records when the zone is hosted there
- EventBridge Scheduler running the retention task daily at 02:30 Africa/Accra
- SNS alerts, CloudWatch alarms (5xx, unhealthy hosts, ECS CPU, RDS CPU/storage/connections) and a dashboard
- An optional GitHub OIDC deploy role with least-privilege ECR and ECS permissions

## Prerequisites

1. An S3 bucket and KMS key for Terraform state, then copy `backend.hcl.example` to `backend.hcl`.
2. Terraform 1.9 or newer, and AWS credentials with administrator rights for the first apply.
3. The domain `tekkoengineering.com`, ideally in Route 53. If DNS is elsewhere, see the two-phase apply below.
4. An email sender: SES SMTP credentials (verify the domain and request production access) or a Resend API key.

## First deployment

```bash
cd infra/aws
cp terraform.tfvars.example terraform.tfvars   # edit values
terraform init -backend-config=backend.hcl
```

Images must exist before the services start. Create the repositories first, then push images tagged with the same `image_tag`:

```bash
terraform apply -target=aws_ecr_repository.app
```

From the repository root, build and push the three images (replace the account and tag):

```bash
aws ecr get-login-password --region af-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.af-south-1.amazonaws.com
```

```bash
for t in web admin; do docker build --target runner --build-arg APP=$t -t 123456789012.dkr.ecr.af-south-1.amazonaws.com/tekko-production/$t:TAG . && docker push 123456789012.dkr.ecr.af-south-1.amazonaws.com/tekko-production/$t:TAG; done
```

```bash
docker build --target migrator -t 123456789012.dkr.ecr.af-south-1.amazonaws.com/tekko-production/migrator:TAG . && docker push 123456789012.dkr.ecr.af-south-1.amazonaws.com/tekko-production/migrator:TAG
```

Then apply everything:

```bash
terraform apply
```

### DNS outside Route 53 (two-phase apply)

1. `terraform apply -target=aws_acm_certificate.regional -target=aws_acm_certificate.cloudfront`
2. Create the records from `terraform output certificate_validation_records` at your DNS provider and wait until both certificates show **Issued**.
3. `terraform apply`
4. Create CNAMEs: website and apex hosts to `website_cloudfront_domain`, the console host to `console_cloudfront_domain`, and `origin_domain` to `origin_alb_dns_name`.

## After the first apply

1. Set the placeholder secrets you use in Secrets Manager (`tekko-production/SMTP_PASSWORD`, `…/RESEND_API_KEY`, `…/MICROSOFT_CLIENT_SECRET`), then force a new deployment of both services.
2. Run the migrate task once:

```bash
aws ecs run-task --cluster tekko-production --launch-type FARGATE --task-definition tekko-production-migrate --network-configuration "awsvpcConfiguration={subnets=[subnet-a,subnet-b],securityGroups=[sg-tasks],assignPublicIp=DISABLED}"
```

3. Create the first owner by running the migrate task definition with a command override:

```bash
aws ecs run-task --cluster tekko-production --launch-type FARGATE --task-definition tekko-production-migrate --network-configuration "awsvpcConfiguration={subnets=[subnet-a,subnet-b],securityGroups=[sg-tasks],assignPublicIp=DISABLED}" --overrides '{"containerOverrides":[{"name":"migrate","command":["npm","run","admin:create-owner","--","--email","owner@tekkoengineering.com","--name","Owner Name"]}]}'
```

The one-time password appears in the `/ecs/tekko-production/jobs` log group. Sign in, change it and enrol two-factor authentication.

4. Confirm the SNS email subscription.

## Continuous deployment

Configure a GitHub environment named `production` with required reviewers and these variables (from `terraform output`): `AWS_REGION`, `AWS_DEPLOY_ROLE_ARN`, `ECS_CLUSTER`, `ECR_REGISTRY`, `NAME_PREFIX`, `TASK_SUBNETS`, `TASK_SECURITY_GROUP`.

Run **Deploy to AWS** from the Actions tab. It pushes SHA-tagged images, runs migrations, registers new task definitions and waits for the services to become stable. A failed health check rolls back automatically.

## Cost notes

The largest items are RDS Multi-AZ, the NAT gateway and Fargate tasks (two per app). For a staging environment, set `db_multi_az = false`, `web_min_count = 1`, `admin_count = 1` and `enable_deletion_protection = false`.
