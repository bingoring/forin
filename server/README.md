# forin-server

forin의 Go API 서버. **stdlib `net/http` + 헥사고날(포트·어댑터)** 구조로, 인증·진행도·콘텐츠·
이벤트·AI 오케스트레이션을 담당한다. 처음 보는 사람도 "어디서 무엇을 하는지" 알 수 있도록
아래 지도를 먼저 읽으면 된다.

## 빠른 시작

```bash
cp .env.example .env          # 값 채우기 (JWT_SIGNING_KEY 등)
make docker-up                # postgres + redis + api 기동
make migrate-up               # 스키마 적용 (golang-migrate CLI 필요)
# 헬스 확인
curl localhost:8080/healthz   # 라이브니스
curl localhost:8080/readyz    # DB·Redis 준비 상태
```

개발 루프: `make run` (로컬 실행) · `make test` · `make vet` · `make build`.

## 아키텍처 — 의존성은 항상 안쪽(도메인)을 향한다

```
        HTTP 요청
          │
   adapters/httpapi      ← 라우팅·미들웨어·핸들러 (net/http)
          │ 호출
     domain/*            ← 유스케이스·엔티티 (순수: 프레임워크·DB 모름)
          │ 의존
        ports            ← 인터페이스 (UserRepo, RefreshStore, IdentityVerifier)
          ▲ 구현
   adapters/{postgres,redis,oidc}   ← 인프라 어댑터
```

**핵심 규칙:** 도메인은 `ports`(인터페이스)에만 의존하고, 구체 구현(어댑터)은 `main.go`에서
주입한다. 그래서 **제공자/인프라 교체가 국소적**이다 — 새 어댑터를 끼우면 끝.

## 디렉토리 지도 (역할 한 줄)

| 경로 | 역할 |
|---|---|
| `cmd/api/main.go` | 엔트리포인트 = **조립 지점**(config→의존성 주입→서버), graceful shutdown |
| `internal/config` | 환경변수 로딩·검증 |
| `internal/domain/user` | User·AuthIdentity·Profile 엔티티 + provider 허용집합(코드측) |
| `internal/domain/auth` | `TokenService`(JWT 발급·검증·refresh 회전) + `Service`(소셜 로그인 유스케이스) |
| `internal/ports` | 도메인이 의존하는 **인터페이스** (어댑터가 구현) |
| `internal/adapters/httpapi` | HTTP 어댑터: 라우터·미들웨어(recover/log/CORS/rate-limit/auth)·핸들러 |
| `internal/adapters/postgres` | `UserRepo` (pgx). 2-2에서 sqlc 생성 코드로 이전 |
| `internal/adapters/redis` | `RefreshStore` (refresh 토큰 해시 저장) |
| `internal/adapters/oidc` | `IdentityVerifier` — Apple/Google/Kakao OIDC 검증 |
| `internal/platform/{log,httpx}` | 횡단 유틸: slog 로거, JSON 응답·요청 디코딩 |
| `db/migrations` | golang-migrate SQL (enum류는 CHECK 없이 코드측 허용집합) |
| `db/queries` · `sqlc.yaml` | sqlc 입력 (2-2에서 채움) |

## 요청 흐름 예: 소셜 로그인

`POST /auth/social` → `httpapi.authHandler` → `domain/auth.Service.SocialLogin`
→ `ports.IdentityVerifier`(=`oidc`)로 ID 토큰 검증 → `ports.UserRepo`(=`postgres`)로 유저 upsert
→ `TokenService`가 access JWT + refresh 발급 → `ports.RefreshStore`(=`redis`)에 refresh 해시 저장.

## 어떻게 확장하나 (자주 하는 작업)

- **엔드포인트 추가:** `adapters/httpapi`에 핸들러 + `router.go`에 라우트. 비즈니스 로직은 `domain/*`에.
- **새 인증 제공자:** OIDC면 `oidc`의 `issuers` 맵에 추가. 비-OIDC면 `ports.IdentityVerifier`를
  구현하는 새 어댑터를 만들고 `main.go`에서 주입.
- **저장소/캐시 교체:** `ports`의 인터페이스를 구현하는 어댑터를 새로 작성 → `main.go` 주입만 변경.
  도메인 코드는 안 바뀐다.
- **AI/STT/TTS 등 (2-3):** 같은 패턴 — `ports`에 인터페이스, `adapters`에 제공자별 구현, `main`에서 주입.
- **enum 값 추가:** DB가 아니라 도메인의 허용집합(예: `user.AllowedProviders`)에 추가.

## 테스트

순수 도메인은 단위 테스트(예: `domain/auth/token_test.go`). 인프라 어댑터는 통합 테스트로
(2-2 이후 docker 기반) 검증한다. `make test`.
