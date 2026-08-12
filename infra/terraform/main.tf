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

  depends_on = [google_project_service.required]
}
