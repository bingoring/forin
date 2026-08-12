.PHONY: bootstrap init plan apply secrets
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

secrets:   ## push secret VALUES that Terraform must not hold. usage: make secrets ANTHROPIC_KEY=... OPENAI_KEY=... AZURE_SPEECH_KEY=...
	@test -n "$(ANTHROPIC_KEY)" || (echo "ANTHROPIC_KEY is required"; exit 1)
	@printf '%s' '$(ANTHROPIC_KEY)'    | gcloud secrets versions add forin-anthropic-key    --project=$(PROJECT) --data-file=-
	@printf '%s' '$(OPENAI_KEY)'       | gcloud secrets versions add forin-openai-key       --project=$(PROJECT) --data-file=-
	@printf '%s' '$(AZURE_SPEECH_KEY)' | gcloud secrets versions add forin-azure-speech-key --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-jwt-signing-key        --project=$(PROJECT) --data-file=-
	@openssl rand -hex 32 | gcloud secrets versions add forin-dev-auth-secret-staging --project=$(PROJECT) --data-file=-
	@echo "pushed. JWT signing key and staging dev-auth secret were generated here — they are never printed."
