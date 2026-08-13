.PHONY: bootstrap init plan apply secrets-containers secrets
PROJECT ?= forin-504711
REGION  ?= asia-northeast3
BUCKET  ?= $(PROJECT)-tfstate

bootstrap:  ## create the GCS state bucket (the one thing Terraform cannot create for itself)
	gcloud storage buckets describe gs://$(BUCKET) --project=$(PROJECT) >/dev/null 2>&1 || \
	  gcloud storage buckets create gs://$(BUCKET) --project=$(PROJECT) --location=$(REGION) --uniform-bucket-level-access
	gcloud storage buckets update gs://$(BUCKET) --versioning

init:
	cd terraform && terraform init

plan:
	cd terraform && terraform plan

apply:
	cd terraform && terraform apply

secrets-containers:  ## create the Secret Manager containers only, so `make secrets` has somewhere to write.
	@# Cloud Run reads each secret's "latest" version on the very first apply of
	@# the service/job (runtime.tf). If the container exists but has zero
	@# versions, that apply fails on a missing version — so the containers must
	@# exist, and be filled by `make secrets`, BEFORE the full `make apply`.
	cd terraform && terraform apply -target=google_secret_manager_secret.app

secrets:   ## push secret VALUES that Terraform must not hold. usage: make secrets ANTHROPIC_KEY=... OPENAI_KEY=... AZURE_SPEECH_KEY=...
	@# Guard every key BEFORE pushing any of them: a partial invocation would
	@# overwrite a live secret with an empty version, and that failure only
	@# surfaces later as an auth error.
	@test -n "$(ANTHROPIC_KEY)"    || (echo "ANTHROPIC_KEY is required";    exit 1)
	@test -n "$(OPENAI_KEY)"       || (echo "OPENAI_KEY is required";       exit 1)
	@test -n "$(AZURE_SPEECH_KEY)" || (echo "AZURE_SPEECH_KEY is required"; exit 1)
	@printf '%s' '$(ANTHROPIC_KEY)'    | gcloud secrets versions add forin-anthropic-key    --project=$(PROJECT) --data-file=-
	@printf '%s' '$(OPENAI_KEY)'       | gcloud secrets versions add forin-openai-key       --project=$(PROJECT) --data-file=-
	@printf '%s' '$(AZURE_SPEECH_KEY)' | gcloud secrets versions add forin-azure-speech-key --project=$(PROJECT) --data-file=-
	@# Separate openssl calls, deliberately: one shared JWT key would erase the
	@# environment boundary (tokens carry no audience/env claim — see
	@# secrets.tf), so staging and prod must get two DIFFERENT random values,
	@# not the same value written twice.
	@openssl rand -hex 32 | gcloud secrets versions add forin-jwt-signing-key-staging --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-jwt-signing-key-prod    --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-dev-auth-secret-staging --project=$(PROJECT) --data-file=-
	@echo "pushed. JWT signing keys and staging dev-auth secret were generated here — they are never printed."
