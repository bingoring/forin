variable "project_id" {
  description = "GCP project id"
  type        = string
  default     = "forin-504711"
}

variable "region" {
  description = "GCP region. Seoul keeps the non-AI round trips short for Korean users."
  type        = string
  default     = "asia-northeast3"
}

variable "sql_tier" {
  description = "Cloud SQL machine tier. Shared-core is cheapest but carries no SLA."
  type        = string
  default     = "db-f1-micro"
}

# One instance holds forin_staging and forin_prod: the fixed cost is the
# instance, so a second database is nearly free. What stays shared is compute,
# connection limits, backup granularity and maintenance windows — flip this when
# real traffic makes that unacceptable.
variable "split_sql_instances" {
  description = "Give each environment its own Cloud SQL instance"
  type        = bool
  default     = false
}

variable "upstash_email" {
  description = "Upstash account email (manual signup)"
  type        = string
}

variable "upstash_api_key" {
  description = "Upstash API key (manual creation in the Upstash console)"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "owner/name of the repo allowed to deploy via Workload Identity Federation"
  type        = string
  default     = "bingoring/forin"
}
