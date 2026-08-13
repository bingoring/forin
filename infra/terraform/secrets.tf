# Containers only — values are pushed by `make -C infra secrets` (gcloud), never
# by Terraform, so no secret material lands in state.
#
# Social client IDs are deliberately absent: they are public identifiers that
# already ship inside the app binary.
locals {
  # jwt-signing-key is deliberately NOT shared: tokens carry no audience or
  # environment claim (ParseAccess checks only the HS256 signature and issuer,
  # and Terraform sets no JWT_ISSUER so both environments default to "forin").
  # A shared key means a token minted anywhere verifies everywhere. Since
  # staging's POST /auth/dev is intentionally open, a shared key would let
  # whoever holds it forge a production identity. The key is the only
  # environment boundary that exists, so it must be per-environment too.
  shared_secrets = [
    "anthropic-key",
    "openai-key",
    "azure-speech-key",
  ]
  per_env_secrets = flatten([
    for e in local.envs : ["jwt-signing-key-${e}", "database-url-${e}", "redis-url-${e}"]
  ])
  # Only staging gets the dev-login bypass secret. Production leaves it unset so
  # the route is never registered there.
  extra_secrets = ["dev-auth-secret-staging"]
}

resource "google_secret_manager_secret" "app" {
  for_each  = toset(concat(local.shared_secrets, local.per_env_secrets, local.extra_secrets))
  secret_id = "forin-${each.value}"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required]
}

# The full DATABASE_URL (not just the password) is generated/known here, so
# Terraform can fill it in. The app reads one DATABASE_URL env var either way,
# so storing the whole URL — instead of the bare password — removes the
# plaintext-in-Cloud-Run-config exposure without touching the app: anyone with
# roles/run.viewer can read a service's env values, and a bare password there
# would still leak the credential even though the *secret resource* looks
# unused. random_password itself still lands in Terraform state (unavoidable
# with this design), but the Cloud Run revision config no longer carries it.
# The LLM and Azure keys come from a human via `make secrets`.
resource "google_secret_manager_secret_version" "database_url" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["database-url-${each.value}"].id
  secret_data = local.db_url[each.value]
}

resource "google_secret_manager_secret_version" "redis_url" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["redis-url-${each.value}"].id
  secret_data = "rediss://default:${upstash_redis_database.cache[each.value].password}@${upstash_redis_database.cache[each.value].endpoint}:${upstash_redis_database.cache[each.value].port}"
}
