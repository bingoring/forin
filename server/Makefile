.PHONY: run build test vet tidy sqlc sqlc-diff contract migrate-up migrate-down migrate-embed migrate-version docker-up docker-down

DATABASE_URL ?= postgres://forin:forin@localhost:5432/forin?sslmode=disable

# Pinned so a bare `sqlc generate` from whatever a dev/CI happens to have
# installed can't produce an unrelated diff again (it did once already: 1.31.1
# reordered/reshaped generated code across content/users/models.go). `go run
# module@version` resolves and caches the pinned binary WITHOUT touching this
# module's go.mod/go.sum — sqlc's own dependency tree (cobra, grpc, its vendored
# SQLite/pg_query parser, ...) is large, so pulling it in as a real `go.mod`
# tool dependency was tried and rejected: it added ~30 unrelated modules and
# 150+ lines to go.mod/go.sum for a dev-only code generator.
SQLC_VERSION ?= 1.31.1
SQLC := go run github.com/sqlc-dev/sqlc/cmd/sqlc@v$(SQLC_VERSION)

run:        ## run the API locally (needs postgres+redis)
	go run ./cmd/api

seed:       ## validate + load content/ into Postgres
	go run ./cmd/seed

build:
	go build -o bin/api ./cmd/api

test:
	go test ./...

vet:
	go vet ./...

tidy:
	go mod tidy

sqlc:       ## generate type-safe queries (Stage 2-2), pinned to SQLC_VERSION
	$(SQLC) generate

sqlc-diff:  ## fail if generated code is stale vs. the pinned sqlc version (CI drift gate)
	$(SQLC) generate
	git diff --exit-code -- internal/adapters/postgres/sqlc db/queries || \
	  (echo "generated sqlc code is out of date — run 'make sqlc' and commit the result" >&2; exit 1)

contract:   ## regenerate API contract: openapi.yaml + TS types (needs: swag v2, npx/node)
	## install swag: go install github.com/swaggo/swag/v2/cmd/swag@latest
	swag init -g cmd/api/main.go -d . -o ../packages/contract --ot yaml --parseInternal --parseDependency --v3.1
	cd ../packages/contract && mv -f swagger.yaml openapi.yaml && npx --yes openapi-typescript@latest openapi.yaml -o types.ts

migrate-up: ## apply migrations (requires golang-migrate CLI)
	migrate -path db/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path db/migrations -database "$(DATABASE_URL)" down 1

migrate-embed: ## apply migrations with the embedded runner (same code path as prod)
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate up

migrate-version: ## print current schema version + dirty flag
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate version

docker-up:
	docker compose up --build

docker-down:
	docker compose down
