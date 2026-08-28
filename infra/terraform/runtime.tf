# Runtime identity is per-environment so staging can never read production's
# secrets, and a leaked staging identity cannot reach the production database.
resource "google_service_account" "runtime" {
  for_each     = toset(local.envs)
  account_id   = "forin-api-${each.value}"
  display_name = "forin ${each.value} runtime"
}

resource "google_project_iam_member" "runtime_sql" {
  for_each = toset(local.envs)
  project  = var.project_id
  role     = "roles/cloudsql.client"
  member   = "serviceAccount:${google_service_account.runtime[each.value].email}"
}

# Secret access is granted per secret, not project-wide: staging is bound only
# to the secrets whose names end in -staging plus the shared keys.
locals {
  secret_bindings = merge(
    { for pair in setproduct(local.envs, local.shared_secrets) :
    "${pair[0]}-${pair[1]}" => { env = pair[0], secret = pair[1] } },
    { for e in local.envs : "${e}-jwt" => { env = e, secret = "jwt-signing-key-${e}" } },
    { for e in local.envs : "${e}-db" => { env = e, secret = "database-url-${e}" } },
    { for e in local.envs : "${e}-redis" => { env = e, secret = "redis-url-${e}" } },
    { "staging-devauth" = { env = "staging", secret = "dev-auth-secret-staging" } },
  )
}

resource "google_secret_manager_secret_iam_member" "runtime" {
  for_each  = local.secret_bindings
  secret_id = google_secret_manager_secret.app[each.value.secret].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime[each.value.env].email}"
}

locals {
  image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.forin.repository_id}/api"

  # Cloud Run's create call waits for the revision to become Ready, so the
  # very first apply — before CI has ever pushed anything to `local.image` —
  # needs a pullable image or apply fails outright. Google's own hello-world
  # image is that placeholder. lifecycle.ignore_changes on the image field
  # (below) means CI's first real digest sticks and this placeholder is never
  # applied again; Terraform owns the service's shape, not its revision.
  bootstrap_image = "us-docker.pkg.dev/cloudrun/container/hello"

  # Both environments scale to zero. A warm production instance is a second
  # standing cost next to Cloud SQL, and the cold start it buys away is worth
  # less than that cost at this stage.
  #
  # DECIDED, not pending. This block used to say "raise prod to 1 when real
  # testers arrive". Testers have arrived — TestFlight internal testing is
  # running — and the answer was to stay at 0 and keep the saving. Do not read
  # this as an open task.
  #
  # What made that affordable is that the cold start no longer breaks anything.
  # It used to: the app treated a refresh request that failed against a starting
  # instance as a rejected token, cleared the session in memory only, and then
  # rendered every tab empty until the app was force-quit (mobile/src/api/session.ts
  # carries the full account). Now a transport failure leaves the session alone,
  # idempotent reads retry with backoff, and the launch screen says it is waking
  # the server. A cold start costs a few seconds, which is a price; it is no
  # longer a broken app, which was not.
  #
  # If it ever becomes worth paying: editing this map is the whole change, and a
  # Terraform-only template change lands on a revision with 0% traffic, so it
  # reaches production on the next promote.
  min_instances = { staging = 0, prod = 0 }

  # §3.2 of the deployment spec promises a low, fixed connection-pool ceiling
  # as the mitigation for sharing one Cloud SQL instance across environments —
  # the shared instance's max_connections is small (db-f1-micro is ~25), and
  # without a cap staging scaling out under load could starve prod's
  # connections (or vice versa). Read by pool.go via DB_MAX_CONNS; prod gets a
  # slightly larger share since it carries real traffic.
  db_max_conns = { staging = 2, prod = 4 }
}

resource "google_cloud_run_v2_service" "api" {
  for_each = toset(local.envs)
  name     = "forin-api-${each.value}"
  location = var.region

  # Deployments are driven by the CI pipeline; Terraform owns the shape of the
  # service, not which image revision is live. `traffic` is ignored for the
  # same reason: promote.yml and the rollback path both pin traffic to a
  # specific revision with `--to-revisions=<REV>=100`, which is gcloud writing
  # directly to the service's traffic split outside Terraform. Without this,
  # `google_cloud_run_v2_service` defaults an unset `traffic` block to "100%
  # to LATEST" — so an unrelated `terraform apply` run right after a rollback
  # (traffic pinned to PREV) or a promotion that left a rejected candidate
  # behind would silently re-advance traffic to LATEST, undoing the rollback
  # or promoting a candidate that failed verification. That bypasses every
  # gate in spec §4/§8, so Terraform must never touch this field.
  lifecycle {
    ignore_changes = [template[0].containers[0].image, client, client_version, traffic]
  }

  template {
    service_account = google_service_account.runtime[each.value].email
    scaling {
      min_instance_count = local.min_instances[each.value]
      max_instance_count = 4
    }
    # KNOWN PERPETUAL DIFF (first real deploy, google provider 6.50): every
    # `plan` proposes removing `manual_instance_count` and `min_instance_count`
    # from this block (`0 -> null`). The API always reports 0 for
    # manual_instance_count, but the service-level `scaling` schema does not
    # accept it, and `ignore_changes` cannot reach that nested path either. The
    # two escapes are both worse: ignoring `template[0].scaling` wholesale would
    # silently disable the documented "raise prod to 1" step, and applying the
    # diff is a no-op that the API immediately re-reports. So Terraform keeps
    # ownership and this diff is expected — it is NOT a pending change. Anything
    # else appearing in a service plan is real and worth reading.

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.pg[local.sql_owner[each.value]].connection_name]
      }
    }

    containers {
      image = local.bootstrap_image
      ports { container_port = 8080 }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      # ENV=prod is what keeps POST /auth/dev unregistered in production.
      env {
        name  = "ENV"
        value = each.value
      }
      # Social client IDs are public identifiers (already inside the app
      # binary), not secrets — plain env is correct here, unlike DATABASE_URL.
      env {
        name  = "GOOGLE_CLIENT_ID"
        value = var.google_client_ids
      }
      env {
        name  = "APPLE_CLIENT_ID"
        value = var.apple_client_ids
      }
      env {
        name  = "KAKAO_CLIENT_ID"
        value = var.kakao_client_ids
      }
      # Empty is a graceful degrade (config.go disables /pronunciation), unlike
      # an empty client-id list which is fail-closed for login.
      env {
        name  = "AZURE_SPEECH_REGION"
        value = var.azure_speech_region
      }
      # Not a secret — see local.db_max_conns above for why this is capped.
      env {
        name  = "DB_MAX_CONNS"
        value = tostring(local.db_max_conns[each.value])
      }
      dynamic "env" {
        for_each = {
          DATABASE_URL      = "database-url-${each.value}"
          REDIS_URL         = "redis-url-${each.value}"
          JWT_SIGNING_KEY   = "jwt-signing-key-${each.value}"
          ANTHROPIC_API_KEY = "anthropic-key"
          OPENAI_API_KEY    = "openai-key"
          AZURE_SPEECH_KEY  = "azure-speech-key"
        }
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.app[env.value].secret_id
              version = "latest"
            }
          }
        }
      }
      # Only staging carries the smoke-test bypass secret.
      dynamic "env" {
        for_each = each.value == "staging" ? [1] : []
        content {
          name = "DEV_AUTH_SECRET"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.app["dev-auth-secret-staging"].secret_id
              version = "latest"
            }
          }
        }
      }

      startup_probe {
        http_get { path = "/readyz" }
        initial_delay_seconds = 5
        period_seconds        = 5
        failure_threshold     = 12
      }
      liveness_probe {
        http_get { path = "/healthz" }
        period_seconds = 30
      }
    }
  }

  # Both versions are Terraform-authored (secrets.tf); the service must not try
  # to read "latest" on either secret before that version exists. Cloud Run
  # also refuses to create a revision whose service account cannot yet read a
  # secret it references, so the secretAccessor grants must land before the
  # revision does too — without this, Terraform is free to create the service
  # and the IAM binding in either order (or concurrently), and a first apply
  # can race and fail.
  depends_on = [
    google_secret_manager_secret_version.redis_url,
    google_secret_manager_secret_version.database_url,
    google_secret_manager_secret_iam_member.runtime,
  ]
}

# Public: the mobile app calls these directly and does its own auth.
resource "google_cloud_run_v2_service_iam_member" "public" {
  for_each = toset(local.envs)
  name     = google_cloud_run_v2_service.api[each.value].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Jobs run /migrate and /seed from the same image digest as the service.
locals {
  jobs = merge(
    { for e in local.envs : "migrate-${e}" => { env = e, cmd = "/migrate", args = ["up"] } },
    { for e in local.envs : "seed-${e}" => { env = e, cmd = "/seed", args = [] } },
  )
}

resource "google_cloud_run_v2_job" "ops" {
  for_each = local.jobs
  name     = "forin-${each.key}"
  location = var.region

  lifecycle {
    ignore_changes = [template[0].template[0].containers[0].image, client, client_version]
  }

  template {
    template {
      service_account = google_service_account.runtime[each.value.env].email
      max_retries     = 0 # a failed migration must stop, not retry onto a dirty schema

      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [google_sql_database_instance.pg[local.sql_owner[each.value.env]].connection_name]
        }
      }

      containers {
        image   = local.bootstrap_image
        command = [each.value.cmd]
        args    = each.value.args

        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }

        env {
          name  = "ENV"
          value = each.value.env
        }
        # Same secret the service reads (database-url-${env}) — the job
        # connects to the same database, so it must not carry the password in
        # plain env either.
        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.app["database-url-${each.value.env}"].secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  # Same ordering requirement as the service above: the runtime SA's
  # secretAccessor grant must exist before the job's revision is created, or
  # Cloud Run can reject the revision on a first apply.
  depends_on = [
    google_secret_manager_secret_version.database_url,
    google_secret_manager_secret_iam_member.runtime,
  ]
}
