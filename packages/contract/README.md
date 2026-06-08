# packages/contract

**Generated API contract — do not edit by hand.**

Go-first pipeline (see `server/Makefile` → `make contract`):

```
Go handlers (swag annotations) → swag --v3.1 → openapi.yaml → openapi-typescript → types.ts
```

- `openapi.yaml` — OpenAPI 3.1 spec, source = Go handler annotations.
- `types.ts` — TypeScript types for the mobile app (`paths`, `components`).

The mobile app imports `types.ts`; the server owns the contract. CI (`.github/workflows/contract.yml`)
regenerates and fails on drift, so the committed files always match the server code.

Regenerate locally:
```bash
cd server && make contract   # needs: go install github.com/swaggo/swag/v2/cmd/swag@latest, node/npx
```
