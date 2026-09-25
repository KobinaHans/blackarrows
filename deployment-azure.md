# Deploying to Azure

> For a pilot or demo on the Azure free tier — one resource group, no Front Door or WAF, scale to zero — see [deployment-azure-free.md](deployment-azure-free.md).

Region: `southafricanorth` (Johannesburg) by default. It supports availability zones for Container Apps, PostgreSQL high availability and zone-redundant storage.

## What gets created

- Log Analytics workspace and Application Insights
- Virtual network with delegated subnets for Container Apps and PostgreSQL
- User-assigned managed identities for the website, console and jobs. There are no registry or storage keys: RBAC grants AcrPull, Key Vault Secrets User and Storage Blob Data Reader (website) or Contributor (console)
- Azure Container Registry (admin user disabled)
- Storage account: zone-redundant, shared-key access disabled, no public blobs, TLS 1.2, versioning and 30-day soft delete; a `media` container
- Key Vault: RBAC mode, purge protection, holding the database URL, auth secret, revalidation secret, IP hash salt and origin-verify secret, plus placeholders for SMTP, Resend and Microsoft SSO
- PostgreSQL Flexible Server: private VNet access only, zone-redundant HA, 14-day backups, TLS required, diagnostics to Log Analytics
- Container Apps environment (zone redundant, VNet integrated):
  - web app, 2–8 replicas
  - console app, 2–4 replicas
  - manual migrate job
  - scheduled retention job (02:30 UTC daily)
- Front Door Premium: endpoints for website and console, managed TLS certificates for custom domains, static-asset caching, a rule adding `x-origin-verify`, and WAF policies (Default Rule Set 2.1, Bot Manager, rate limiting, optional console IP allowlist)
- Action group and alerts: app 5xx and restarts, database CPU and storage, Front Door origin health

## Prerequisites

1. Azure CLI 2.60 or newer (includes Bicep), and Owner rights on the subscription for the first deployment (role assignments).
2. A resource group:

```bash
az group create --name rg-tekko-production --location southafricanorth
```

3. Generate secrets once and store them as GitHub environment secrets and in your password manager:

```bash
for s in POSTGRES_ADMIN_PASSWORD BETTER_AUTH_SECRET REVALIDATE_SECRET IP_HASH_SALT ORIGIN_VERIFY_SECRET; do echo "$s=$(openssl rand -hex 32)"; done
```

4. Copy `infra/azure/main.bicepparam.example` to `infra/azure/main.bicepparam` and set host names and alert email.

## First deployment

Container Apps need their images in the registry before they can start, and the registry is created by the same template. The first deployment therefore runs twice.

1. Run the full template once to create the registry, identities and data services. The container apps will report image pull failures until step 2 is done.

```bash
az deployment group create -g rg-tekko-production -f infra/azure/main.bicep -p infra/azure/main.bicepparam -p imageTag=initial
```

2. Build and push images to the registry shown in the `registryLoginServer` output:

```bash
az acr login --name <registry-name>
```

```bash
for t in web admin; do docker build --target runner --build-arg APP=$t -t <registry>.azurecr.io/tekko-$t:initial . && docker push <registry>.azurecr.io/tekko-$t:initial; done
```

```bash
docker build --target migrator -t <registry>.azurecr.io/tekko-migrator:initial . && docker push <registry>.azurecr.io/tekko-migrator:initial
```

3. Re-run the deployment command from step 1. The apps now start.

4. Run migrations:

```bash
az containerapp job start --name caj-tekko-production-migrate --resource-group rg-tekko-production
```

5. Create the first owner with a one-off execution of the migrate job:

```bash
az containerapp job start --name caj-tekko-production-migrate --resource-group rg-tekko-production --command "npm" --args "run admin:create-owner -- --email owner@tekkoengineering.com --name Owner"
```

The one-time password appears in the job's console logs in Log Analytics.

## Custom domains

The `customDomainValidation` output lists, for each host, the CNAME target and a `_dnsauth` TXT record. Create both at your DNS provider. Front Door validates the domain and issues managed certificates automatically. For the apex domain, use an ALIAS/ANAME record, or Azure DNS with an alias record set.

## After deployment

1. Set the placeholder secrets you use in Key Vault (`SMTP-PASSWORD`, `RESEND-API-KEY`, `MICROSOFT-CLIENT-SECRET`), then restart the app revisions.
2. For Azure Communication Services email, connect a verified domain and create SMTP credentials (an Entra app registration); set `smtpUser` in the parameters.

## Continuous deployment

Create a Microsoft Entra app registration with a federated credential for `repo:<owner>/<repo>:environment:production`. Grant it Contributor and User Access Administrator on the resource group, and AcrPush on the registry.

Configure the GitHub environment:

- Variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `ACR_NAME`, `MIGRATE_JOB_NAME`
- Secrets: the five generated secrets

Run **Deploy to Azure**. It pushes SHA-tagged images, previews changes with `what-if`, deploys a new revision and runs the migrate job.

## Notes

- PostgreSQL defaults to version 16 on Azure (set `version` in `modules/postgres.bicep` to `17` once your API version supports it). The application supports both.
- Container Apps ingress is public, but the apps reject requests without the Front Door origin-verify header. For full network isolation, switch the environment to `internal: true` and use Front Door Premium Private Link origins.
