locals {
  envs = ["staging", "prod"]
}

resource "google_project_service" "required" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "iamcredentials.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "sts.googleapis.com", # token exchange for Workload Identity Federation (wif.tf)
  ])
  service = each.value
  # Keep the APIs on if this config is ever destroyed — turning them off would
  # break anything else in the project that uses them.
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "forin" {
  location      = var.region
  repository_id = "forin"
  format        = "DOCKER"
  description   = "forin server images (one image, three entrypoints)"

  # Every deploy pushes a new ~80MB image tagged with its commit SHA and never
  # deletes the old one (spec §3.3 called Artifact Registry "+$0", which is
  # only true short-term). Without a cleanup policy this grows unbounded.
  # `staging-verified-<sha>` tags are this pipeline's highest-stakes safety
  # mechanism (promote.yml resolves only that tag — see spec §3's promotion
  # paragraph), so KEEP is evaluated first and protects anything carrying that
  # prefix indefinitely; DELETE then removes anything else (an unverified or
  # never-promoted SHA) once it's 30 days old.
  cleanup_policies {
    id     = "keep-staging-verified"
    action = "KEEP"
    condition {
      tag_prefixes = ["staging-verified-"]
    }
  }

  cleanup_policies {
    id     = "delete-unverified-after-30d"
    action = "DELETE"
    condition {
      tag_state  = "ANY"
      older_than = "2592000s" # 30 days
    }
  }

  depends_on = [google_project_service.required]
}
