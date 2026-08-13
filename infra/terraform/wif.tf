# CI deploys without a key. A service-account JSON key would have no expiry and
# no way to know when it leaked; a federated token is minted per workflow run and
# is only issuable by this one repository.
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions"

  depends_on = [google_project_service.required]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }
  # Without this condition ANY GitHub repository could mint tokens for this pool.
  attribute_condition = "assertion.repository == \"${var.github_repo}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "deployer" {
  account_id   = "forin-deployer"
  display_name = "forin CI deployer"
}

resource "google_service_account_iam_member" "deployer_wif" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}

resource "google_project_iam_member" "deployer" {
  for_each = toset([
    "roles/run.developer",           # deploy revisions, execute jobs
    "roles/artifactregistry.writer", # push images
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}

# roles/iam.serviceAccountUser is scoped to the two runtime service accounts,
# not the project. Combined with the project-wide roles/run.developer above,
# a project-wide serviceAccountUser would let this externally-triggerable CI
# identity deploy Cloud Run as ANY service account in the project — including
# the default compute SA, which commonly carries roles/editor. "Deploy the
# API" must not become "act as project editor".
resource "google_service_account_iam_member" "deployer_runtime_sa" {
  for_each           = toset(local.envs)
  service_account_id = google_service_account.runtime[each.value].name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.deployer.email}"
}

# roles/secretmanager.secretAccessor is scoped to the one secret the deploy
# pipeline actually needs to read (the staging smoke-test bypass), not every
# secret in the project — the project-wide role would also hand this CI
# identity every JWT signing key and every DATABASE_URL.
resource "google_secret_manager_secret_iam_member" "deployer_devauth" {
  secret_id = google_secret_manager_secret.app["dev-auth-secret-staging"].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.deployer.email}"
}
