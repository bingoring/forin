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
    { for e in local.envs : "${e}-db" => { env = e, secret = "db-password-${e}" } },
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

  # A unix socket, so the database needs no public IP.
  db_url = { for e in local.envs :
    e => "postgres://forin_${e}:${random_password.db[e].result}@/forin_${e}?host=/cloudsql/${google_sql_database_instance.pg[local.sql_owner[e]].connection_name}"
  }

  # Production leaves min_instances at 1 so the day's first learner does not pay
  # for a cold start; staging scales to zero because only the smoke test calls it.
  min_instances = { staging = 0, prod = 1 }
}

resource "google_cloud_run_v2_service" "api" {
  for_each = toset(local.envs)
  name     = "forin-api-${each.value}"
  location = var.region

  # Deployments are driven by the CI pipeline; Terraform owns the shape of the
  # service, not which image revision is live.
  lifecycle {
    ignore_changes = [template[0].containers[0].image, client, client_version]
  }

  template {
    service_account = google_service_account.runtime[each.value].email
    scaling {
      min_instance_count = local.min_instances[each.value]
      max_instance_count = 4
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.pg[local.sql_owner[each.value]].connection_name]
      }
    }

    containers {
      image = "${local.image}:bootstrap"
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
      env {
        name  = "DATABASE_URL"
        value = local.db_url[each.value]
      }
      dynamic "env" {
        for_each = {
          REDIS_URL         = "redis-url-${each.value}"
          JWT_SIGNING_KEY   = "jwt-signing-key"
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

  depends_on = [google_secret_manager_secret_version.redis_url]
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
        image   = "${local.image}:bootstrap"
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
        env {
          name  = "DATABASE_URL"
          value = local.db_url[each.value.env]
        }
      }
    }
  }
}
