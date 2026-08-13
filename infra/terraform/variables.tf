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

# No defaults on the three client-id variables below, on purpose: config.go's
# audienceAllowed treats an empty allow-list as accepting nothing, so a missing
# value means that login provider is dead in prod. Failing `terraform apply`
# on a missing tfvar is far cheaper than shipping a production API with zero
# working login paths. Comma-separated because the server parses each with
# splitList (config.go) — a provider needs more than one client ID when it
# issues a distinct one per platform (Google: iOS/Android/Web).
variable "google_client_ids" {
  description = "Comma-separated Google OAuth client IDs accepted as token audience"
  type        = string
}

variable "apple_client_ids" {
  description = "Comma-separated Apple Sign-In client IDs accepted as token audience"
  type        = string
}

variable "kakao_client_ids" {
  description = "Comma-separated Kakao OAuth client IDs accepted as token audience"
  type        = string
}

# Unlike the client IDs above, an empty region is a graceful degrade, not a
# fail-closed condition: config.go leaves the /pronunciation endpoint disabled
# when AZURE_SPEECH_REGION is empty rather than rejecting all logins.
variable "azure_speech_region" {
  description = "Azure Speech resource region (e.g. \"eastus\"); empty disables pronunciation assessment"
  type        = string
  default     = ""
}
