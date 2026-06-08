.PHONY: run build test vet tidy sqlc contract migrate-up migrate-down docker-up docker-down

DATABASE_URL ?= postgres://forin:forin@localhost:5432/forin?sslmode=disable

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

sqlc:       ## generate type-safe queries (Stage 2-2; requires sqlc)
	sqlc generate

contract:   ## regenerate API contract: openapi.yaml + TS types (needs: swag v2, npx/node)
	## install swag: go install github.com/swaggo/swag/v2/cmd/swag@latest
	swag init -g cmd/api/main.go -d . -o ../packages/contract --ot yaml --parseInternal --parseDependency --v3.1
	cd ../packages/contract && mv -f swagger.yaml openapi.yaml && npx --yes openapi-typescript@latest openapi.yaml -o types.ts

migrate-up: ## apply migrations (requires golang-migrate CLI)
	migrate -path db/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path db/migrations -database "$(DATABASE_URL)" down 1

docker-up:
	docker compose up --build

docker-down:
	docker compose down
