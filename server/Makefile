BINARY=forin-server
MAIN=./cmd/api/main.go
MIGRATE=migrate -path ./migrations -database "postgres://forin:forin@localhost:5432/forin?sslmode=disable"

.PHONY: build run dev docker-up docker-down migrate-up migrate-down migrate-create seed tidy test test-unit test-integration test-coverage

build:
	go build -o bin/$(BINARY) $(MAIN)

run:
	go run $(MAIN)

dev:
	air

docker-up:
	docker compose up -d
	@echo "Waiting for postgres..."
	@sleep 3

docker-down:
	docker compose down

migrate-up:
	$(MIGRATE) up

migrate-down:
	$(MIGRATE) down 1

migrate-create:
	@read -p "Migration name: " name; \
	migrate create -ext sql -dir ./migrations -seq $$name

seed:
	go run ./scripts/seed.go

test:
	go test ./... -count=1

test-unit:
	go test ./internal/apperror/... ./internal/config/... ./internal/handler/... ./internal/middleware/... ./internal/service/... -count=1

test-integration:
	go test ./internal/repository/... -count=1

test-coverage:
	go test ./... -count=1 -coverprofile=coverage.out
	go tool cover -func=coverage.out

tidy:
	go mod tidy
