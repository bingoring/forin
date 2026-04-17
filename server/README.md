# forin Server

의료 전문가를 위한 게이미피케이션 영어 학습 앱의 백엔드 API 서버입니다.

## 기술 스택

- **언어**: Go 1.25
- **프레임워크**: Gin
- **ORM**: GORM (PostgreSQL)
- **캐시**: Redis 7
- **인증**: JWT (access + refresh token)
- **로깅**: zap (구조화 로깅)
- **마이그레이션**: golang-migrate

## 프로젝트 구조

```
server/
├── cmd/api/main.go                 # 서버 진입점 (DI 와이어링, graceful shutdown)
├── internal/
│   ├── ai/                         # Claude API 클라이언트
│   ├── apperror/                   # 통합 에러 타입 (AppError)
│   ├── cache/                      # Redis 클라이언트 래퍼
│   ├── config/                     # Viper 기반 설정 로딩 + 검증
│   ├── database/                   # GORM PostgreSQL 연결 설정
│   ├── dto/                        # 요청/응답 데이터 전송 객체
│   ├── evaluator/                  # 문제 유형별 평가 엔진 (Strategy Pattern)
│   ├── handler/                    # HTTP 핸들러 (Controller 계층)
│   ├── logger/                     # zap 로거 초기화
│   ├── middleware/                  # 미들웨어 (auth, cors, rate_limiter 등)
│   ├── model/                      # GORM 모델 (DB 엔티티)
│   ├── repository/                 # 데이터 접근 계층
│   ├── router/                     # Gin 라우터 설정
│   ├── service/                    # 비즈니스 로직 계층
│   └── testutil/                   # 테스트 헬퍼 (mock, DB setup)
├── migrations/                     # SQL 마이그레이션 파일
├── scripts/                        # 시드 스크립트 등
├── docker-compose.yml              # PostgreSQL + Redis 컨테이너
├── Makefile                        # 빌드/실행/테스트 명령
├── .env.example                    # 환경변수 템플릿
└── .air.toml                       # 핫 리로드 설정
```

## 아키텍처

계층 구조 기반 설계로, 각 계층은 인터페이스를 통해 결합됩니다:

```
Handler (HTTP) → Service (비즈니스 로직) → Repository (데이터 접근)
    ↑                    ↑                        ↑
 인터페이스 정의       인터페이스 정의          GORM 구현체
(handler/interfaces.go) (service/interfaces.go) (repository/*.go)
```

**핵심 설계 원칙:**
- **인터페이스 기반 DI**: 소비자 패키지에 인터페이스를 정의 (Go 관례: "accept interfaces, return structs")
- **순환 참조 방지**: handler → service, service → repository 단방향 의존
- **통합 에러 처리**: `apperror.AppError`를 통해 모든 계층에서 일관된 에러 응답
- **테스트 용이성**: 인터페이스 기반으로 mock 교체 가능

## 시작하기

### 사전 요구사항

- Go 1.25+
- Docker & Docker Compose
- golang-migrate CLI (`brew install golang-migrate`)

### 설정

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값을 설정

# 2. Docker 컨테이너 시작 (PostgreSQL + Redis)
make docker-up

# 3. 데이터베이스 마이그레이션
make migrate-up

# 4. 초기 데이터 삽입
make seed

# 5. 서버 실행
make run      # 일반 실행
make dev      # 핫 리로드 (air)
```

### 환경변수

| 변수 | 필수 | 설명 | 기본값 |
|------|------|------|--------|
| `SERVER_PORT` | O | 서버 포트 | `8080` |
| `ENV` | - | 환경 (development/production) | `development` |
| `DATABASE_DSN` | O | PostgreSQL 연결 문자열 | - |
| `REDIS_ADDR` | O | Redis 주소 | `localhost:6379` |
| `JWT_SECRET` | O | JWT 서명 키 (32자 이상) | - |
| `JWT_REFRESH_SECRET` | O | JWT 리프레시 서명 키 (32자 이상) | - |
| `JWT_ACCESS_EXPIRY` | - | 액세스 토큰 만료 시간 | `15m` |
| `JWT_REFRESH_EXPIRY` | - | 리프레시 토큰 만료 시간 | `168h` |

## API 엔드포인트

### 인증

| 메서드 | 경로 | 인증 | Rate Limit | 설명 |
|--------|------|------|------------|------|
| `GET` | `/v1/health` | - | - | 헬스 체크 |
| `POST` | `/v1/auth/register` | - | 3/min/IP | 회원가입 |
| `POST` | `/v1/auth/login` | - | 5/min/IP | 로그인 |
| `POST` | `/v1/auth/refresh` | - | - | 토큰 갱신 |
| `POST` | `/v1/auth/logout` | Bearer | 100/min/user | 로그아웃 |

### 온보딩

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| `GET` | `/v1/onboarding/professions` | - | 직업 목록 |
| `GET` | `/v1/onboarding/countries` | - | 국가 목록 (?profession_slug=nurse) |
| `POST` | `/v1/onboarding/assessment/submit` | Bearer | 레벨 평가 퀴즈 제출 |

### 사용자 프로필

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| `GET` | `/v1/users/me` | Bearer | 프로필 조회 (XP, 레벨, 하트, 스트릭 포함) |
| `PATCH` | `/v1/users/me` | Bearer | 프로필 수정 |
| `PUT` | `/v1/users/me/cat/equip` | Bearer | 고양이 아이템 장착/해제 |

### 커리큘럼

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| `GET` | `/v1/curriculum` | Bearer | 모듈/유닛/스테이지 목록 + 진행도 |
| `GET` | `/v1/curriculum/stages/:stageId` | Bearer | 스테이지 상세 + 문제 목록 |

### 학습 (Core Loop)

| 메서드 | 경로 | 인증 | Rate Limit | 설명 |
|--------|------|------|------------|------|
| `POST` | `/v1/learning/stages/:stageId/start` | Bearer | 100/min | 스테이지 시작 (하트 확인) |
| `POST` | `/v1/learning/attempts/:attemptId/exercises/:exerciseId/submit` | Bearer | 60/min | 문제 답안 제출 + 평가 |
| `POST` | `/v1/learning/attempts/:attemptId/complete` | Bearer | 100/min | 스테이지 완료 (XP/레벨/스트릭/업적) |
| `GET` | `/v1/learning/history` | Bearer | 100/min | 학습 기록 (페이지네이션) |

### 게이미피케이션

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| `GET` | `/v1/gamification/inventory` | Bearer | 인벤토리 조회 |
| `GET` | `/v1/gamification/gift-boxes/pending` | Bearer | 미개봉 선물 상자 목록 |
| `POST` | `/v1/gamification/gift-boxes/:boxId/open` | Bearer | 선물 상자 개봉 (드롭율 적용) |
| `GET` | `/v1/gamification/shop` | Bearer | 상점 아이템 목록 |
| `POST` | `/v1/gamification/shop/purchase` | Bearer | 아이템 구매 (Catnip) |
| `GET` | `/v1/gamification/achievements` | Bearer | 업적 목록 + 달성 상태 |

### 응답 형식

**성공:**
```json
{
  "success": true,
  "data": { ... }
}
```

**에러:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**에러 코드:**

| 코드 | HTTP | 설명 |
|------|------|------|
| `VALIDATION_ERROR` | 422 | 입력값 검증 실패 |
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `RATE_LIMITED` | 429 | 요청 제한 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

## 테스트

```bash
make test              # 전체 테스트 (unit + integration)
make test-unit         # 유닛 테스트만 (DB 불필요)
make test-integration  # 통합 테스트만 (PostgreSQL 필요)
make test-coverage     # 커버리지 리포트
```

### 테스트 전략

| 계층 | 방식 | 외부 의존 |
|------|------|-----------|
| `apperror` | 유닛 테스트 | 없음 |
| `config` | 유닛 테스트 | 없음 |
| `service` | Mock Repository 주입 | 없음 |
| `handler` | Mock Service 주입 + httptest | 없음 |
| `middleware` | Mock TokenValidator + httptest | 없음 |
| `repository` | 트랜잭션 롤백 패턴 | PostgreSQL |

- **유닛 테스트**: 인터페이스 mock을 사용하여 외부 의존 없이 실행
- **통합 테스트**: 실제 PostgreSQL에 연결하되, 각 테스트를 트랜잭션으로 감싸고 롤백하여 DB를 깨끗하게 유지
- PostgreSQL이 없으면 통합 테스트는 자동 스킵

### Mock 구조

`internal/testutil/` 패키지에 hand-written mock이 준비되어 있습니다:

- `MockUserRepository` — `service.UserRepository` 인터페이스 구현
- `MockAuthService` — `handler.AuthService` 인터페이스 구현

각 메서드를 함수 필드로 주입하여 테스트별로 동작을 커스터마이즈합니다.

## 미들웨어 스택

요청 처리 순서:

1. **Recovery** — panic 복구 + 구조화 로깅
2. **RequestID** — UUID 생성, `X-Request-ID` 헤더 + context 설정
3. **Logger** — 요청별 구조화 로깅 (method, path, status, latency)
4. **CORS** — Cross-Origin 설정 (dev: 전체 허용)
5. **RateLimiter** — Redis 기반 요율 제한 (엔드포인트별 설정)
6. **Auth** — JWT Bearer 토큰 검증 (인증 필요 라우트만)

## 데이터베이스

### 마이그레이션

```bash
make migrate-up        # 모든 마이그레이션 적용
make migrate-down      # 마지막 마이그레이션 1개 롤백
make migrate-create    # 새 마이그레이션 파일 생성
```

마이그레이션 파일은 `migrations/` 디렉토리에 순번(000001, 000002, ...)으로 관리됩니다. GORM AutoMigrate는 사용하지 않으며, golang-migrate가 스키마의 단일 진실 공급원입니다.

### 시드 데이터

```bash
make seed  # 멱등성 보장 (ON CONFLICT DO NOTHING)
```

초기 데이터:
- Professions: Registered Nurse, Doctor, Pharmacist
- Achievements: first_steps, week_warrior, perfect_unit, conversation_starter, night_shift_hero

## 개발 가이드

### 새 기능 추가 패턴

Phase 1 이후 새 도메인(예: curriculum)을 추가할 때:

1. `repository/curriculum_repo.go` — 데이터 접근 구현체
2. `service/interfaces.go` — `CurriculumRepository` 인터페이스 추가
3. `service/curriculum_service.go` — 비즈니스 로직
4. `handler/interfaces.go` — `CurriculumService` 인터페이스 추가
5. `handler/curriculum_handler.go` — HTTP 핸들러
6. `router/router.go` — `protected` 그룹에 라우트 추가
7. `cmd/api/main.go` — DI 와이어링 추가

### Makefile 명령 요약

| 명령 | 설명 |
|------|------|
| `make build` | 바이너리 빌드 (`bin/forin-server`) |
| `make run` | 서버 실행 |
| `make dev` | 핫 리로드 실행 (air) |
| `make docker-up` | PostgreSQL + Redis 시작 |
| `make docker-down` | 컨테이너 중지 |
| `make migrate-up` | 마이그레이션 적용 |
| `make migrate-down` | 마이그레이션 롤백 (1개) |
| `make migrate-create` | 새 마이그레이션 생성 |
| `make seed` | 초기 데이터 삽입 |
| `make test` | 전체 테스트 |
| `make test-unit` | 유닛 테스트 |
| `make test-integration` | 통합 테스트 |
| `make test-coverage` | 커버리지 리포트 |
| `make tidy` | go mod tidy |
