# Deploying to Azure on the free tier

A smaller, cheap-to-free version of the platform for a pilot, a client demo or the first months of
live use. Everything runs in one resource group and can be deleted in a single command.

For the production stack (WAF, private networking, high availability, Key Vault, alerts) see
[deployment-azure.md](deployment-azure.md). You can move to it later without changing the
application: the container images and the database are the same.

## What this costs

| Service                                                      | Free allowance                                                                                                        | After the allowance                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Container Apps (consumption)                                 | 180,000 vCPU-seconds, 360,000 GiB-seconds and 2 million requests per subscription per month, with no time limit       | Per second of use. With both apps scaling to zero, a low-traffic site stays inside the grant      |
| PostgreSQL Flexible Server                                   | 750 hours of B1ms plus 32 GB storage and 32 GB backup each month, for the first 12 months of a new Azure free account | Roughly the price of a small burstable server; check the Azure pricing calculator for your region |
| Container Registry                                           | One Standard registry with 100 GB, for the first 12 months                                                            | Standard registry pricing, or move the images to GitHub Container Registry                        |
| Blob Storage                                                 | Free allowance on a new free account; beyond it, a few cents per GB per month                                         | Pennies at this scale                                                                             |
| Log Analytics                                                | 5 GB of ingestion per month                                                                                           | Per GB; you can also create the environment with `--logs-destination none`                        |
| Managed TLS certificates, custom domains, managed identities | Always free                                                                                                           | —                                                                                                 |

Two things decide whether the bill is actually zero:

1. **Scale to zero.** Both apps are created with `--min-replicas 0`, so nothing is billed while the
   site is idle. The cost is a cold start: the first request after a quiet period waits a few
   seconds for a replica. If that is unacceptable, give the website `--min-replicas 1`; one small
   replica running all month is more vCPU-seconds than the monthly grant, so expect a small bill.
2. **The 12-month items.** The database and the registry are free only on a new Azure free account,
   and only for a year. Set a budget alert (below) so the anniversary does not surprise you.

## What you give up compared with the production stack

- No Front Door and no WAF. The apps are exposed directly on their Container Apps ingress, so there
  is no managed rule set, no bot protection and no edge rate limiting. The application's own
  database-backed rate limits still apply. Leave `ORIGIN_VERIFY_SECRET` unset: origin verification
  only makes sense when a CDN is adding the header.
- The database is reachable from Azure services rather than from a private subnet.
- No high availability, and backups are the service default rather than 14 days.
- Secrets live in Container Apps secrets rather than Key Vault, so rotation is manual.
- No alert rules; you get Log Analytics and the Container Apps console for troubleshooting.

This is a reasonable posture for a brochure site with a small console behind it. It is not the
posture to hold client data at scale.

## Before you start

- An [Azure free account](https://azure.microsoft.com/free/) (the 12-month items above need one).
- Azure CLI 2.60 or newer, signed in, with the Container Apps extension:

  ```bash
  az extension add --name containerapp --upgrade
  ```

- **No Docker needed.** Images are built in Azure by `az acr build` from the source in this
  repository.
- Run everything below from the repository root.

## 1. Sign in and choose a region

```bash
az login
az account set --subscription "<your-subscription-id>"
az provider register -n Microsoft.App --wait
az provider register -n Microsoft.OperationalInsights --wait
az provider register -n Microsoft.DBforPostgreSQL --wait
```

Container Apps is not in every region. Check which regions your subscription can use, and pick the
closest one to Ghana from the list:

```bash
az provider show -n Microsoft.App \
  --query "resourceTypes[?resourceType=='managedEnvironments'].locations | [0]" -o tsv
```

`southafricanorth` is closest if it appears. Otherwise `westeurope` is the usual choice for Ghana.

## 2. Set the variables for this deployment

```bash
RG=rg-tekko-free
LOC=westeurope                      # or southafricanorth, from the check above
SUFFIX=$RANDOM
ACR=tekkoacr$SUFFIX                 # lower-case letters and digits only, globally unique
STG=sttekko$SUFFIX                  # 3–24 lower-case letters and digits, globally unique
PG=psql-tekko-$SUFFIX
ENVNAME=cae-tekko
TAG=v1

PG_PASSWORD=$(openssl rand -hex 24)
AUTH_SECRET=$(openssl rand -hex 32)
REVALIDATE_SECRET=$(openssl rand -hex 32)
IP_HASH_SALT=$(openssl rand -hex 32)
PREVIEW_SECRET=$(openssl rand -hex 32)
```

Keep this shell open until the end, or write the generated values somewhere safe first — they are
not recoverable afterwards.

## 3. Resource group

```bash
az group create -n $RG -l $LOC
```

## 4. Container registry and images

```bash
az acr create -n $ACR -g $RG --sku Standard --admin-enabled true

az acr build -r $ACR -t tekko-web:$TAG      --build-arg APP=web   --target runner   .
az acr build -r $ACR -t tekko-admin:$TAG    --build-arg APP=admin --target runner   .
az acr build -r $ACR -t tekko-migrator:$TAG                       --target migrator .
```

Each build uploads the repository (minus `.dockerignore` entries) and builds in Azure. The three
images are environment-agnostic: every URL and secret is supplied at runtime, so the same tag can
be promoted between environments.

The admin user is enabled to keep this walkthrough short. To avoid registry passwords entirely,
create the apps with `--registry-identity system` instead, which requires permission to create role
assignments.

## 5. PostgreSQL

```bash
az postgres flexible-server create \
  -g $RG -n $PG -l $LOC \
  --tier Burstable --sku-name Standard_B1ms \
  --storage-size 32 \
  --admin-user tekko_app --admin-password "$PG_PASSWORD" \
  --database-name tekko \
  --public-access 0.0.0.0 \
  --yes
```

`--public-access 0.0.0.0` is the special value that allows other Azure services (your container
apps) to connect, without opening the server to the internet. Add `--version 17` if you want the
newer major version; the application supports both.

```bash
PG_HOST=$(az postgres flexible-server show -g $RG -n $PG --query fullyQualifiedDomainName -o tsv)
DATABASE_URL="postgres://tekko_app:$PG_PASSWORD@$PG_HOST:5432/tekko"
```

TLS is requested by the application through `DATABASE_SSL=require`, so the connection string does
not need `sslmode`.

## 6. Blob storage for uploads

```bash
az storage account create -n $STG -g $RG -l $LOC \
  --sku Standard_LRS --kind StorageV2 \
  --allow-blob-public-access false --min-tls-version TLS1_2

STORAGE_CONN=$(az storage account show-connection-string -n $STG -g $RG --query connectionString -o tsv)
az storage container create -n media --account-name $STG --connection-string "$STORAGE_CONN" --public-access off
```

Media is served through the apps at `/media/<key>`, never from a public blob URL, so the container
stays private.

## 7. Container Apps environment

```bash
az containerapp env create -n $ENVNAME -g $RG -l $LOC
```

This creates a Log Analytics workspace for the logs. Use `--logs-destination none` if you would
rather have no workspace at all.

## 8. The website and the console

```bash
ACR_SERVER=$(az acr show -n $ACR --query loginServer -o tsv)
ACR_USER=$(az acr credential show -n $ACR --query username -o tsv)
ACR_PASS=$(az acr credential show -n $ACR --query "passwords[0].value" -o tsv)

az containerapp create -n tekko-web -g $RG --environment $ENVNAME \
  --image $ACR_SERVER/tekko-web:$TAG \
  --registry-server $ACR_SERVER --registry-username $ACR_USER --registry-password "$ACR_PASS" \
  --ingress external --target-port 3000 --transport auto \
  --cpu 0.5 --memory 1.0Gi --min-replicas 0 --max-replicas 3 \
  --secrets database-url="$DATABASE_URL" revalidate-secret=$REVALIDATE_SECRET \
            ip-hash-salt=$IP_HASH_SALT preview-secret=$PREVIEW_SECRET storage-conn="$STORAGE_CONN" \
  --env-vars NODE_ENV=production SERVICE_NAME=tekko-web CLOUD_PROVIDER=azure \
             DATABASE_URL=secretref:database-url DATABASE_SSL=require DATABASE_POOL_MAX=5 \
             REVALIDATE_SECRET=secretref:revalidate-secret IP_HASH_SALT=secretref:ip-hash-salt \
             PREVIEW_SECRET=secretref:preview-secret \
             STORAGE_DRIVER=azure AZURE_STORAGE_CONNECTION_STRING=secretref:storage-conn \
             AZURE_STORAGE_CONTAINER=media \
             MAIL_DRIVER=console MAIL_FROM="TEKKO Engineering Group <noreply@tekkoengineering.com>"

az containerapp create -n tekko-admin -g $RG --environment $ENVNAME \
  --image $ACR_SERVER/tekko-admin:$TAG \
  --registry-server $ACR_SERVER --registry-username $ACR_USER --registry-password "$ACR_PASS" \
  --ingress external --target-port 3000 --transport auto \
  --cpu 0.5 --memory 1.0Gi --min-replicas 0 --max-replicas 2 \
  --secrets database-url="$DATABASE_URL" revalidate-secret=$REVALIDATE_SECRET \
            ip-hash-salt=$IP_HASH_SALT preview-secret=$PREVIEW_SECRET storage-conn="$STORAGE_CONN" \
            better-auth-secret=$AUTH_SECRET \
  --env-vars NODE_ENV=production SERVICE_NAME=tekko-admin CLOUD_PROVIDER=azure \
             DATABASE_URL=secretref:database-url DATABASE_SSL=require DATABASE_POOL_MAX=5 \
             REVALIDATE_SECRET=secretref:revalidate-secret IP_HASH_SALT=secretref:ip-hash-salt \
             PREVIEW_SECRET=secretref:preview-secret \
             BETTER_AUTH_SECRET=secretref:better-auth-secret \
             STORAGE_DRIVER=azure AZURE_STORAGE_CONNECTION_STRING=secretref:storage-conn \
             AZURE_STORAGE_CONTAINER=media \
             MAIL_DRIVER=console MAIL_FROM="TEKKO Engineering Group <noreply@tekkoengineering.com>" \
             ADMIN_REQUIRE_2FA=true LEAD_RETENTION_DAYS=730
```

Now that both apps exist, tell each one where the other lives:

```bash
WEB_FQDN=$(az containerapp show -n tekko-web   -g $RG --query properties.configuration.ingress.fqdn -o tsv)
ADMIN_FQDN=$(az containerapp show -n tekko-admin -g $RG --query properties.configuration.ingress.fqdn -o tsv)

az containerapp update -n tekko-web -g $RG --set-env-vars \
  NEXT_PUBLIC_SITE_URL=https://$WEB_FQDN ADMIN_URL=https://$ADMIN_FQDN \
  SERVER_ACTIONS_ALLOWED_ORIGINS=$WEB_FQDN,$ADMIN_FQDN

az containerapp update -n tekko-admin -g $RG --set-env-vars \
  NEXT_PUBLIC_SITE_URL=https://$WEB_FQDN ADMIN_URL=https://$ADMIN_FQDN \
  BETTER_AUTH_URL=https://$ADMIN_FQDN WEB_INTERNAL_URL=http://tekko-web \
  SERVER_ACTIONS_ALLOWED_ORIGINS=$WEB_FQDN,$ADMIN_FQDN
```

`WEB_INTERNAL_URL=http://tekko-web` lets the console reach the website inside the environment, so
cache refresh and preview links do not leave Azure.

## 9. Create the schema and load the content

```bash
az containerapp job create -n tekko-migrate -g $RG --environment $ENVNAME \
  --trigger-type Manual --replica-timeout 1800 \
  --image $ACR_SERVER/tekko-migrator:$TAG \
  --registry-server $ACR_SERVER --registry-username $ACR_USER --registry-password "$ACR_PASS" \
  --cpu 0.5 --memory 1.0Gi \
  --secrets database-url="$DATABASE_URL" better-auth-secret=$AUTH_SECRET \
  --env-vars DATABASE_URL=secretref:database-url DATABASE_SSL=require \
             BETTER_AUTH_SECRET=secretref:better-auth-secret \
             BETTER_AUTH_URL=https://$ADMIN_FQDN ADMIN_URL=https://$ADMIN_FQDN

az containerapp job start -n tekko-migrate -g $RG
az containerapp job execution list -n tekko-migrate -g $RG -o table
```

The job applies the migrations and seeds the content from the business description. It is
idempotent, so it is safe to run again after a deploy.

## 10. Create the first console user

```bash
az containerapp job start -n tekko-migrate -g $RG \
  --command "sh" "-c" "npm run admin:create-owner -- --email owner@tekkoengineering.com --name 'TEKKO Owner'"
```

The script prints a one-time password. Read it from the execution logs:

```bash
CONTAINER=$(az containerapp job show -n tekko-migrate -g $RG --query "properties.template.containers[0].name" -o tsv)
az containerapp job logs show -n tekko-migrate -g $RG --container $CONTAINER --tail 50
```

Sign in at `https://$ADMIN_FQDN`, change the password immediately, and enrol two-factor
authentication (`ADMIN_REQUIRE_2FA=true` above makes that mandatory before anything else opens).

## 11. Check it is working

```bash
curl -fsS https://$WEB_FQDN/api/health   && echo
curl -fsS https://$ADMIN_FQDN/api/health && echo
echo "Website: https://$WEB_FQDN"
echo "Console: https://$ADMIN_FQDN"
```

Then, in the console: open **System status** and confirm database, storage and website all report
healthy; publish a small content change and confirm it appears on the website within seconds.

Email is in console mode, which logs messages instead of sending them. To send enquiry
notifications, add a provider and update the apps, for example with Resend:

```bash
az containerapp update -n tekko-web -g $RG \
  --set-env-vars MAIL_DRIVER=resend RESEND_API_KEY=secretref:resend-key
```

(Add the secret first with `az containerapp secret set -n tekko-web -g $RG --secrets resend-key=...`,
and repeat for `tekko-admin`.)

## 12. Custom domains

Container Apps issues free managed certificates. For each host name:

```bash
az containerapp show -n tekko-web -g $RG --query properties.customDomainVerificationId -o tsv
```

At your DNS provider create, for a subdomain such as `www.tekkoengineering.com`:

| Record | Host        | Value                                         |
| ------ | ----------- | --------------------------------------------- |
| CNAME  | `www`       | the app's `*.azurecontainerapps.io` host name |
| TXT    | `asuid.www` | the verification id from the command above    |

For an apex domain use an `A` record pointing at `az containerapp env show -n $ENVNAME -g $RG --query properties.staticIp -o tsv`,
with the TXT record at `asuid`. Then bind:

```bash
az containerapp hostname add  --hostname www.tekkoengineering.com -g $RG -n tekko-web
az containerapp hostname bind --hostname www.tekkoengineering.com -g $RG -n tekko-web \
  --environment $ENVNAME --validation-method CNAME     # HTTP for an apex A record
```

Repeat for the console host name against `tekko-admin`. Afterwards update the URL variables:

```bash
az containerapp update -n tekko-web   -g $RG --set-env-vars NEXT_PUBLIC_SITE_URL=https://www.tekkoengineering.com \
  SERVER_ACTIONS_ALLOWED_ORIGINS=www.tekkoengineering.com,console.tekkoengineering.com
az containerapp update -n tekko-admin -g $RG --set-env-vars NEXT_PUBLIC_SITE_URL=https://www.tekkoengineering.com \
  ADMIN_URL=https://console.tekkoengineering.com BETTER_AUTH_URL=https://console.tekkoengineering.com \
  SERVER_ACTIONS_ALLOWED_ORIGINS=www.tekkoengineering.com,console.tekkoengineering.com
```

Renewal is automatic, but the certificate authority has to reach the app: scaling to zero is fine
(a request wakes it), stopping the app is not. If you add a CAA record, allow DigiCert with
`0 issue digicert.com`.

## 13. Nightly data retention (optional)

```bash
az containerapp job create -n tekko-retention -g $RG --environment $ENVNAME \
  --trigger-type Schedule --cron-expression "30 2 * * *" --replica-timeout 1800 \
  --image $ACR_SERVER/tekko-migrator:$TAG \
  --registry-server $ACR_SERVER --registry-username $ACR_USER --registry-password "$ACR_PASS" \
  --cpu 0.25 --memory 0.5Gi \
  --command "npm" "run" "db:retention" \
  --secrets database-url="$DATABASE_URL" \
  --env-vars DATABASE_URL=secretref:database-url DATABASE_SSL=require LEAD_RETENTION_DAYS=730
```

## 14. Deploying a change

```bash
TAG=v2
az acr build -r $ACR -t tekko-web:$TAG   --build-arg APP=web   --target runner   .
az acr build -r $ACR -t tekko-admin:$TAG --build-arg APP=admin --target runner   .
az acr build -r $ACR -t tekko-migrator:$TAG                    --target migrator .

az containerapp job update -n tekko-migrate -g $RG --image $ACR_SERVER/tekko-migrator:$TAG
az containerapp job start  -n tekko-migrate -g $RG        # migrations first

az containerapp update -n tekko-web   -g $RG --image $ACR_SERVER/tekko-web:$TAG
az containerapp update -n tekko-admin -g $RG --image $ACR_SERVER/tekko-admin:$TAG
```

Each update creates a new revision and shifts traffic to it once it passes its health probe.
`az containerapp revision list -n tekko-web -g $RG -o table` shows what is running, and
`az containerapp revision activate` rolls back.

## 15. Keeping it free

```bash
az consumption budget create --budget-name tekko-free --amount 5 --time-grain monthly \
  --category cost --start-date $(date +%Y-%m-01) --end-date $(date -v+1y +%Y-%m-01)
```

(Use `date -d "+1 year" +%Y-%m-01` on Linux. The portal's Cost Management → Budgets does the same
with email alerts.)

Other guardrails:

- Keep `--min-replicas 0` on both apps.
- Watch the database: it is the first thing to leave the free window, twelve months in.
- `az containerapp env list-usages -n $ENVNAME -g $RG` shows how much of the environment you use.

## Tearing it all down

```bash
az group delete -n $RG --yes --no-wait
```

That removes every resource created here, including the database and uploaded media. Export
anything you need first: enquiries from the console (**Export CSV**) and media files from the
storage account.

## Graduating to the production stack

Nothing in the application changes. Deploy `infra/azure/main.bicep` into a new resource group,
restore or re-seed the database, repoint DNS, and set `ORIGIN_VERIFY_SECRET` so the apps only accept
traffic that came through Front Door. The container images you built here can be imported with
`az acr import`.
