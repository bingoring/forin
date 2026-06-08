---
phase: 02-construction
stage: 01-server-foundation
status: HUMAN_APPROVED
updated: 2026-06-08
---

# [Stage 2-1] 서버 기반 (Go stdlib · 헥사고날)

## 목적

`forin-server`(`/server`)의 기반을 구축한다 — Go stdlib `net/http` 헥사고날 스켈레톤, 설정,
PostgreSQL + 마이그레이션, Redis, **자체 발급 인증**(provider 검증 → JWT+refresh), 헬스/로깅,
Docker(dev=prod), 로컬 컴포즈. 이후 도메인·API(2-2)·AI(2-3)가 얹힐 토대를 만든다.

## 입력 (Inputs)

- 아키텍처: [`../01-inception/03-architecture-decision.md`](../01-inception/03-architecture-decision.md) (§A·B·C·G·H)
- 도메인: [`../01-inception/02-domain-model.md`](../01-inception/02-domain-model.md) (User·AuthIdentity·Profile)
- 기술 방향: [`../prd-tech.md`](../prd-tech.md)

## 체크리스트

- [ ] 헥사고날 디렉토리 구조 + `cmd/api` 엔트리포인트, graceful shutdown
- [ ] 설정 로딩(env, `.env.example`), 환경 분리(dev/staging/prod)
- [ ] PostgreSQL: `pgx` 풀 + `golang-migrate` + 초기 마이그레이션(users·auth_identities·profiles)
- [ ] `sqlc` 셋업(쿼리 → 타입세이프 Go)
- [ ] Redis 연결(어댑터, 헬스 포함)
- [ ] 인증: Apple/Google OIDC(JWKS) + Kakao 토큰 검증 → 자체 access JWT(~15m) + refresh 회전
- [ ] 미들웨어: 인증·요청로깅·리커버·CORS·레이트리밋(net/http 래핑)
- [ ] 구조적 로깅 `slog`, 요청 검증 `validator`
- [ ] 헬스 엔드포인트(`/healthz` `/readyz`: DB·Redis 체크)
- [ ] Dockerfile(멀티스테이지) + `docker-compose`(api·postgres·redis) + Makefile/Taskfile
- [ ] GitHub Actions: `server/**` 경로 필터 — lint·test·build
- [ ] 인증 핵심 경로 테스트(토큰 검증·발급·회전)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 디렉토리 구조 (`/server`)

```
server/
├── cmd/api/main.go            # 엔트리포인트: config 로드 → 의존성 조립 → http 서버 → graceful shutdown
├── internal/
│   ├── config/                # env 파싱·검증(환경 분리)
│   ├── domain/                # 엔티티·유스케이스(순수, 의존성 없음)
│   │   ├── user/              #   User·Profile 유스케이스
│   │   └── auth/              #   토큰 발급·회전 정책
│   ├── ports/                 # 인터페이스: UserRepo, TokenStore, IdentityVerifier ...
│   ├── adapters/
│   │   ├── http/              # net/http 라우터·핸들러·미들웨어·DTO
│   │   ├── postgres/          # pgx + sqlc 생성 코드 + repo 구현
│   │   ├── redis/             # 캐시·refresh 저장·레이트리밋
│   │   └── auth/              # Apple/Google OIDC(JWKS)·Kakao verifier
│   └── platform/              # slog 로거·http 서버 래퍼·헬스
├── db/migrations/             # golang-migrate (NNN_*.up/down.sql)
├── db/queries/                # sqlc 입력 .sql
├── sqlc.yaml  Dockerfile  docker-compose.yml  Makefile  .env.example
```

### 핵심 결정·구현 노트

- **라우팅:** `net/http.ServeMux`(1.22+ `METHOD /path/{id}`). 프레임워크 없음.
- **미들웨어:** `func(http.Handler) http.Handler` 체인(직접). 인증·로깅·recover·rate-limit·CORS.
- **DB:** `pgxpool` + `sqlc`(쿼리는 `db/queries/*.sql`, 생성 코드는 `adapters/postgres`). 마이그레이션 `golang-migrate`.
- **인증 플로우:** 디바이스 네이티브 로그인 → provider ID 토큰 → `POST /auth/social`
  → verifier가 provider별 검증(JWKS/Kakao API) → `User`/`AuthIdentity` upsert
  → access JWT(~15m, 서명) + refresh(랜덤·해시 저장·회전) 발급. `POST /auth/refresh`로 회전, `POST /auth/logout`로 폐기.
  refresh는 Redis(또는 PG) 저장 + 디바이스는 `expo-secure-store`.
- **시크릿/키:** JWT 서명키·provider 클라이언트 정보는 env(서버). 로컬은 `.env`, 배포는 Fly secrets.
- **초기 마이그레이션:** `users`(uuid, status, created_at), `auth_identities`(user_id, provider, subject_id, uniq), `profiles`(user_id, job, native_lang, destination, en_level).

### 초기 엔드포인트(이 스테이지)

`POST /auth/social` · `POST /auth/refresh` · `POST /auth/logout` · `GET /me`(인증) · `GET /healthz` · `GET /readyz`.
(도메인·콘텐츠 API는 2-2.)

### 빌드 순서

1. 구조 + config + `main.go` + 헬스 → 2. Postgres/pgx/마이그레이션/sqlc → 3. Redis 어댑터
→ 4. auth 도메인·verifier·핸들러·미들웨어 → 5. Docker/compose/Makefile → 6. CI(server) → 7. 인증 경로 테스트.

### 범위 밖(후속)

도메인·콘텐츠 API·코드젠(2-2), AI/대화(2-3), 모바일(2-4+). 본 스테이지는 인증·헬스까지만.

## 검토 게이트 (Human Gate)

- [ ] 구조·라이브러리·인증 플로우가 1-3 결정과 일치하는가?
- [ ] 다음 스테이지(도메인·API)가 얹힐 토대로 충분한가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 2-1 `HUMAN_APPROVED` → `02-domain-content-api.md`
