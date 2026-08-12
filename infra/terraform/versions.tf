terraform {
  required_version = ">= 1.9"

  # State lives in GCS. The bucket is created by `make -C infra bootstrap`
  # before the first init — a remote backend cannot create its own bucket.
  backend "gcs" {
    bucket = "forin-504711-tfstate"
    prefix = "server"
  }

  required_providers {
    google  = { source = "hashicorp/google", version = "~> 6.0" }
    upstash = { source = "upstash/upstash", version = "~> 1.5" }
    random  = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Account signup and API-key creation are manual (Upstash has no IaC for those);
# everything after that is declared here.
provider "upstash" {
  email   = var.upstash_email
  api_key = var.upstash_api_key
}
