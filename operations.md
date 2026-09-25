# Operations runbook

## Health checks

| Endpoint | Meaning |
| --- | --- |
| `GET /api/health` (both apps) | Process is serving requests. Used by load balancer and container probes. |
| `GET /api/health?deep=1` (website) | Database and object storage reachable. Returns 503 when degraded. |
| `GET /api/health?deep=1` (console) | Database reachable. |
| Console → System status | Database, storage, email and website checks plus environment details. |

## Logs

Both apps write one JSON object per line with `time`, `level`, `msg`, `service` and context fields. No personal data is logged; leads are identified by reference.

- **AWS:** CloudWatch Logs groups `/ecs/tekko-production/web`, `/admin` and `/jobs`. Example Logs Insights query:
  `fields @timestamp, msg, error.message | filter level = "error" | sort @timestamp desc`
- **Azure:** Log Analytics table `ContainerAppConsoleLogs_CL`. Filter on `ContainerAppName_s` and parse `Log_s` as JSON.

## Common tasks

### Deploy a new version

Run the deploy workflow for the target cloud and approve the environment. Migrations run before the new version starts. To roll back, re-run the workflow from the previous commit. Migrations are additive, so older code keeps working with a newer schema.

### Add a schema change

1. Edit `packages/db/src/schema.ts`.
2. Run `npm run db:generate -- --name short_description` and commit the SQL.
3. Keep changes backwards-compatible for one release: add columns as nullable or with defaults, and drop old columns in a later release.

### Refresh website content immediately

Console → System status → **Refresh now**. Otherwise every replica refreshes within two minutes.

### Reset a user's password or two-factor

- Lost password: the user uses **Forgot password** on the sign-in page. An administrator can also send a new set-password link from **Team**.
- Lost authenticator: the user signs in with a backup code, then turns two-factor off and on again. If no backup codes remain, an owner removes and re-invites the account.

### Remove someone's access immediately

Team → person → **Disable access**. Their sessions end at once and the action is recorded in the audit log.

### Handle a data-subject request

- **Access or export:** open the enquiry in the console and share its details, or filter Enquiries by email and export CSV.
- **Deletion:** open the enquiry and **Delete enquiry** (requires the delete permission). The audit log keeps only that a deletion happened.
- Closed enquiries are anonymised automatically after `LEAD_RETENTION_DAYS` (730 by default).

## Backups and restore

| Data | AWS | Azure |
| --- | --- | --- |
| Database | Automated snapshots (14 days) and point-in-time restore; final snapshot on deletion | Automated backups (14 days) and point-in-time restore |
| Media | S3 versioning (90 days for old versions) | Blob versioning and 30-day soft delete |
| Configuration | Terraform state (versioned S3 bucket) | Bicep templates in Git; deployment history in the resource group |

**Restore test (quarterly):** restore the database to a new instance, point a staging deployment at it, and confirm sign-in, content and enquiries.

## Secret rotation

| Secret | Rotation | Effect |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yearly or on suspected exposure | Signs everyone out |
| `REVALIDATE_SECRET` | Yearly | Update both apps together; refresh fails between the two restarts |
| `ORIGIN_VERIFY_SECRET` | Yearly | Update the CDN rule and apps in the same deployment |
| Database password | Yearly | Update the database, then the `DATABASE_URL` secret, then restart both apps |
| SMTP / Resend keys | Per provider policy | Restart both apps |

On AWS, update the secret in Secrets Manager (and the RDS password for the database), then force a new deployment of both services. On Azure, update Key Vault and restart both app revisions.

## Incident checklist

1. Check System status in the console and the cloud alarm that fired.
2. For website 5xx errors, look for `level":"error"` in the web logs; check the database health and recent deployments.
3. If a deploy caused it, roll back by redeploying the previous commit.
4. If the database is down, the website keeps serving seed content. Tell the team that enquiries may fail and to use email meanwhile.
5. Record the timeline, cause and follow-up actions.
