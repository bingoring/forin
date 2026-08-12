# Containers only — values are pushed by `make -C infra secrets` (gcloud), never
# by Terraform, so no secret material lands in state.
#
# Social client IDs are deliberately absent: they are public identifiers that
# already ship inside the app binary.
locals {
  shared_secrets = [
    "jwt-signing-key",
    "anthropic-key",
    "openai-key",
    "azure-speech-key",
  ]
  per_env_secrets = flatten([
    for e in local.envs : ["db-password-${e}", "redis-url-${e}"]
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

# The DB password and Redis URL are generated/known here, so Terraform can fill
# these two in. The LLM and Azure keys come from a human via `make secrets`.
resource "google_secret_manager_secret_version" "db_password" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["db-password-${each.value}"].id
  secret_data = random_password.db[each.value].result
}

resource "google_secret_manager_secret_version" "redis_url" {
  for_each    = toset(local.envs)
  secret      = google_secret_manager_secret.app["redis-url-${each.value}"].id
  secret_data = "rediss://default:${upstash_redis_database.cache[each.value].password}@${upstash_redis_database.cache[each.value].endpoint}:${upstash_redis_database.cache[each.value].port}"
}
