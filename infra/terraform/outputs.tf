output "image_repo" {
  description = "Artifact Registry image path (tag with the commit sha)"
  value       = local.image
}

output "wif_provider" {
  description = "google-github-actions/auth workload_identity_provider value"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "deployer_sa" {
  description = "google-github-actions/auth service_account value"
  value       = google_service_account.deployer.email
}

output "service_urls" {
  description = "Cloud Run URLs per environment"
  value       = { for e in local.envs : e => google_cloud_run_v2_service.api[e].uri }
}

output "sql_connection_names" {
  value = { for e in local.envs : e => google_sql_database_instance.pg[local.sql_owner[e]].connection_name }
}
