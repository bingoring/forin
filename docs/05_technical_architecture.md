# forin — 기술 아키텍처

**버전**: 1.1.0 | **작성일**: 2026-04-17 | **변경**: 백엔드 NestJS → Go

---

## 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│  ┌───────────────────────┐     ┌───────────────────────────────┐   │
│  │      iOS App          │     │        Android App            │   │
│  │  (React Native/Expo)  │     │    (React Native/Expo)        │   │
│  └──────────┬────────────┘     └──────────────┬────────────────┘   │
└─────────────┼──────────────────────────────────┼───────────────────┘
              │              HTTPS/TLS            │
              ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Go / Gin)                          │
│         JWT 인증 / Rate Limiting / 응답 캐싱 / 요청 라우팅           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ auth         │   │ learning         │   │ gamification     │
│ handler      │   │ handler          │   │ handler          │
│              │   │                  │   │                  │
│ JWT 발급     │   │ 커리큘럼 조회    │   │ XP/레벨          │
│ Google OAuth │   │ 문제 채점        │   │ 선물 상자        │
│ 토큰 갱신    │   │ 진도 관리        │   │ 인벤토리         │
└──────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
       │                    │                      │
       └──────────────┬─────┘──────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                                 │
│              Primary (쓰기) + Read Replica (읽기)                    │
└─────────────────────────────────────────────────────────────────────┘
       ┌──────────────┬──────────────────┬────────────────────┐
       ▼              ▼                  ▼                    ▼
┌────────────┐ ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│   Redis    │ │  S3 / CDN       │ │  AI Service  │ │  FCM / APNs  │
│            │ │                 │ │              │ │              │
│ 세션 캐시  │ │ 오디오 파일     │ │ 대화 채점    │ │ 푸시 알림    │
│ Rate limit │ │ 고양이 아이템   │ │ (Claude API) │ │              │
│ XP 집계    │ │ 스테이지 미디어 │ │              │ │              │
└────────────┘ └─────────────────┘ └──────────────┘ └──────────────┘
```

### 확장 경로 (서비스 규모 증가 시)

MVP 단계에서는 단일 Go 서버 (모놀리식)로 시작한다. 직업군·언어 트랙·AI 기능이 늘어나는 시점에 도메인별로 gRPC 마이크로서비스로 점진 분리한다.

```
Phase 2+ 분리 후보:
  forin-api        (현재 모놀리스 → API Gateway 역할 유지)
  forin-learning   (커리큘럼, 문제 채점)
  forin-ai         (LLM 호출, 응답 평가, 프롬프트 관리)
  forin-notify     (푸시 알림, 스케줄러)
  forin-content    (콘텐츠 관리 CMS)
```

---

## 백엔드: Go

### 프레임워크 선택: Gin

| 항목 | Gin | Echo | go-zero |
|------|-----|------|---------|
| 성숙도 | 매우 높음 | 높음 | 높음 |
| 성능 | 최상위권 | 최상위권 | 최상위권 |
| 생태계 | 가장 방대 | 방대 | 중간 |
| 마이크로서비스 전환 | 수동 분리 | 수동 분리 | 내장 지원 |
| 학습 곡선 | 낮음 | 낮음 | 중간 |
| 결론 | **MVP 선택** | — | Phase 2+ 재검토 |

Gin을 MVP 선택 이유: 가장 많은 레퍼런스, 낮은 학습 곡선, 필요할 때 gRPC/마이크로서비스로 자연스럽게 분리 가능.

### 핵심 패키지

| 목적 | 패키지 |
|------|-------|
| HTTP 프레임워크 | `github.com/gin-gonic/gin` |
| ORM | `gorm.io/gorm` + `gorm.io/driver/postgres` |
| DB 마이그레이션 | `github.com/golang-migrate/migrate/v4` |
| JWT | `github.com/golang-jwt/jwt/v5` |
| 비밀번호 해시 | `golang.org/x/crypto/bcrypt` |
| Redis 클라이언트 | `github.com/redis/go-redis/v9` |
| 설정 관리 | `github.com/spf13/viper` |
| 유효성 검사 | `github.com/go-playground/validator/v10` (Gin 내장) |
| UUID | `github.com/google/uuid` |
| AI SDK | `github.com/anthropics/anthropic-sdk-go` |
| S3 | `github.com/aws/aws-sdk-go-v2` |
| 로깅 | `go.uber.org/zap` |
| 테스트 | `github.com/stretchr/testify` |
| HTTP 목 | `github.com/jarcoal/httpmock` |
| API 문서 | `github.com/swaggo/gin-swagger` |
| 핫리로드 (개발) | `github.com/air-verse/air` |

### 프로젝트 디렉토리 구조

```
server/
├── cmd/
│   └── api/
│       └── main.go              # 엔트리포인트
│
├── internal/
│   ├── config/
│   │   └── config.go            # 환경변수 로드 (Viper)
│   │
│   ├── middleware/
│   │   ├── auth.go              # JWT 인증 미들웨어
│   │   ├── rate_limit.go        # Rate limiting
│   │   └── logger.go            # 요청 로깅
│   │
│   ├── handler/                 # HTTP 핸들러 (컨트롤러)
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── curriculum.go
│   │   ├── learning.go
│   │   ├── gamification.go
│   │   └── onboarding.go
│   │
│   ├── service/                 # 비즈니스 로직
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── curriculum_service.go
│   │   ├── learning_service.go
│   │   ├── evaluator/           # 문제 유형별 채점
│   │   │   ├── sentence_arrangement.go
│   │   │   ├── word_puzzle.go
│   │   │   ├── meaning_match.go
│   │   │   └── conversation.go  ← LLM 연동 핵심
│   │   ├── gamification_service.go
│   │   ├── gift_box_service.go  ← 드롭율 알고리즘
│   │   ├── xp_service.go
│   │   ├── streak_service.go
│   │   ├── achievement_service.go
│   │   └── notification_service.go
│   │
│   ├── repository/              # DB 접근 계층
│   │   ├── user_repo.go
│   │   ├── curriculum_repo.go
│   │   ├── learning_repo.go
│   │   └── gamification_repo.go
│   │
│   ├── model/                   # GORM 모델 (DB 엔티티)
│   │   ├── user.go
│   │   ├── curriculum.go
│   │   ├── exercise.go
│   │   ├── learning.go
│   │   └── gamification.go
│   │
│   ├── dto/                     # 요청/응답 구조체
│   │   ├── auth_dto.go
│   │   ├── curriculum_dto.go
│   │   ├── learning_dto.go
│   │   └── gamification_dto.go
│   │
│   ├── ai/                      # AI 서비스 연동
│   │   ├── client.go            # Claude API 클라이언트
│   │   ├── evaluator.go         # 대화 채점 로직
│   │   └── prompts/
│   │       └── conversation_eval.go
│   │
│   └── cache/                   # Redis 캐싱
│       └── redis.go
│
├── migrations/                  # SQL 마이그레이션 파일
│   ├── 000001_init_schema.up.sql
│   ├── 000001_init_schema.down.sql
│   └── ...
│
├── scripts/
│   └── seed.go                  # 초기 시드 데이터
│
├── go.mod
├── go.sum
├── .air.toml                    # 핫리로드 설정
└── Makefile
```

### 아키텍처 패턴: Handler → Service → Repository

```
HTTP Request
  │
  ▼
Handler (internal/handler/)
  - 요청 파싱 및 유효성 검사
  - 응답 직렬화
  │
  ▼
Service (internal/service/)
  - 비즈니스 로직
  - 트랜잭션 관리
  │
  ▼
Repository (internal/repository/)
  - GORM 쿼리
  - DB 추상화
  │
  ▼
PostgreSQL
```

---

## 모바일 플랫폼: React Native (Expo)

### 선택 근거

| 항목 | React Native/Expo | Flutter |
|------|-------------------|---------|
| 코드베이스 | 단일 (iOS+Android) | 단일 |
| OTA 업데이트 | Expo EAS Update (성숙) | Shorebird (초기 단계) |
| 생태계 | 방대 | 성장 중 |
| 애니메이션 | Reanimated 3 (충분) | 더 강력 |
| 결론 | **선택** | 스케일 시 재검토 |

### 핵심 라이브러리

| 목적 | 라이브러리 |
|------|----------|
| 네비게이션 | React Navigation 6 (stack + bottom tabs) |
| 애니메이션 | React Native Reanimated 3 + Lottie |
| 드래그앤드롭 (타일) | react-native-gesture-handler |
| 전역 상태 | Zustand |
| 서버 상태 / 캐싱 | TanStack Query (React Query) |
| 오디오 재생 | Expo AV |
| 푸시 알림 | Expo Notifications + FCM/APNs |
| 로컬 스토리지 | Expo SecureStore (토큰), MMKV (앱 상태) |
| 분석 | Mixpanel SDK |
| 에러 모니터링 | Sentry |

---

## 데이터베이스: PostgreSQL

### 설정
- 버전: PostgreSQL 16+
- ORM: GORM v2
- 마이그레이션: golang-migrate (SQL 파일 기반)
- 커넥션 풀: pgxpool (GORM 내장) + PgBouncer (프로덕션)

### 인덱스 전략
```sql
CREATE INDEX idx_user_stage_progress ON user_stage_progress(user_id, stage_id);
CREATE INDEX idx_stage_attempts_user ON stage_attempts(user_id, completed_at DESC);
CREATE INDEX idx_daily_activity_log ON daily_activity_log(user_id, activity_date DESC);
CREATE INDEX idx_exercises_stage ON exercises(stage_id, order_index);
```

---

## 캐싱: Redis

| 캐시 키 패턴 | TTL | 용도 |
|------------|-----|------|
| `user:{id}:profile` | 5분 | 홈 화면 사용자 프로필 |
| `user:{id}:curriculum` | 10분 | 커리큘럼 진도 |
| `curriculum:module:{id}` | 1시간 | 모듈 상세 (콘텐츠 불변) |
| `user:{id}:lives` | 실시간 | 목숨 수 |
| `rate:{ip}:api` | 1분 | Rate limiting |

---

## AI 서비스: 대화 채점

### 아키텍처
```
internal/service/evaluator/conversation.go
  │
  ├── 1. 사용자 입력 sanitize (프롬프트 인젝션 방지)
  ├── 2. Claude API 호출 (anthropic-sdk-go)
  │     Prompt: system_prompt + rubric + ideal_response + user_response
  │     Response: { vocabulary: int, tone: int, completeness: int, feedback: string }
  ├── 3. 응답 파싱 및 점수 계산
  ├── 4. DB 저장
  └── 폴백: API 실패 시 키워드 매칭 방식

Go 고루틴 활용:
  - LLM 호출을 goroutine으로 비동기 처리
  - context.WithTimeout(8초)로 타임아웃 관리
  - 타임아웃 시 즉시 폴백 + 백그라운드에서 결과 캐싱
```

### AI 확장 경로
```
MVP: Claude API 단일 호출 (대화 채점)
Phase 2: 
  - 콘텐츠 자동 생성 (새 직업군 스테이지 초안)
  - 개인화 난이도 조정 (사용자 패턴 분석)
Phase 3:
  - 실시간 AI 대화 파트너 (스트리밍 응답)
  - 다국어 번역 파이프라인
  → 이 시점에 forin-ai 서비스로 분리
```

---

## 파일 스토리지: S3 + CDN

### 디렉토리 구조
```
forin-assets/
├── audio/
│   ├── sentences/        # 문장 배열 정답 오디오
│   └── conversations/    # 대화 연습 AI 캐릭터 오디오
├── cat-items/
│   ├── hat/
│   ├── outfit/
│   ├── accessory/
│   ├── background/
│   └── expression/
└── animations/
    ├── gift-boxes/
    └── celebrations/
```

### 오디오 사양
- 포맷: MP3 (64kbps, mono)
- 길이: 문장당 2-8초
- CDN 캐시 헤더: `Cache-Control: public, max-age=31536000`

---

## 보안 설계

| 항목 | 방식 |
|------|------|
| 인증 | JWT (Access 15분, Refresh 7일) |
| 비밀번호 | bcrypt (cost factor 12, `golang.org/x/crypto`) |
| Rate Limiting | 로그인 5회/분, API 100회/분 (Redis 기반) |
| HTTPS | TLS 1.3 강제 |
| SQL Injection | GORM 파라미터 바인딩 |
| 프롬프트 인젝션 | 사용자 입력 → 시스템 프롬프트 완전 분리 |
| 민감 데이터 | 개인정보 최소 수집, 비밀번호 평문 저장 금지 |

---

## 환경 구성

### 환경 변수 (`.env`)
```bash
# Server
SERVER_PORT=8080
ENV=development

# Database
DATABASE_DSN=host=localhost user=forin password=forin dbname=forin port=5432 sslmode=disable

# Redis
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=

# Auth
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI
ANTHROPIC_API_KEY=...

# Storage
AWS_S3_BUCKET=forin-assets
AWS_REGION=ap-northeast-2
CLOUDFRONT_DOMAIN=cdn.forin.app

# Push
EXPO_PUSH_ACCESS_TOKEN=...
```

### 환경별 설정
| 환경 | DB | 캐시 | AI |
|------|----|----|-----|
| Development | 로컬 PostgreSQL (Docker) | 로컬 Redis (Docker) | 테스트 API 키 |
| Staging | 클라우드 PostgreSQL | 클라우드 Redis | 실제 키 (한도 제한) |
| Production | Primary + Replica | 클러스터 Redis | 실제 키 (풀 한도) |
