# Multi-stage build → small static image (dev=prod parity via Docker).
#
# One image, three entrypoints: the Cloud Run service runs /api and Cloud Run
# Jobs run /migrate and /seed from the SAME digest, so a schema and the code
# that needs it can never drift apart.
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/api     ./cmd/api  && \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/migrate ./cmd/migrate && \
    CGO_ENABLED=0 GOOS=linux go build -trimpath -o /out/seed    ./cmd/seed

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api     /api
COPY --from=build /out/migrate /migrate
COPY --from=build /out/seed    /seed
# Authored content travels with the image so the seed Job has no checkout.
COPY --from=build /src/content /content
ENV CONTENT_DIR=/content
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/api"]
