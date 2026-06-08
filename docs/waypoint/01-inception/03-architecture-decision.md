---
phase: 01-inception
stage: 03-architecture-decision
status: AI_PROPOSED
updated: 2026-06-08
---

# [Stage 1-3] Architecture Decision ⚠️

> 비가역 게이트. 승인 전 `_templates/gate-template.md`의 추가 체크리스트를 반드시 확인한다.

## 목적

도메인 모델을 실제로 구현할 시스템 아키텍처를 확정한다. `prd-tech.md`의
**게이트 승인 대상** 항목을 모두 결정하고, Construction 스테이지를 정의한다.

## 입력 (Inputs)

- 이전 스테이지: [`02-domain-model.md`](02-domain-model.md)
- 기술 방향: [`../prd-tech.md`](../prd-tech.md)

## 결정 대상 (prd-tech.md 게이트 항목)

> 서버 프레임워크(stdlib 확정)·콘텐츠 전달(서버 fetch)·오디오 MVP 포함 등 방향은
> `prd-tech.md`에서 사용자 확정. 본 게이트는 그 **세부 구현·제공자·비용**을 비준한다.

- [ ] 서버: stdlib `net/http` 위에 도입할 전문 라이브러리 선별(검증/미들웨어/라우팅 보강)
- [ ] 데이터베이스: 쿼리 전략(sqlc/pgx 등)·마이그레이션 도구 + Redis 도입 범위
- [ ] 인증·토큰 전략: 시중 사례 조사 → roll-own vs 매니지드(Clerk/Supabase/Auth0) 확정
- [ ] 콘텐츠 전달: 서버 fetch + axios 래퍼 클라이언트, 상황판 일일 갱신·캐시 메커니즘
- [ ] 호스팅: Docker 기반 dev=prod, 플랫폼 확정(Fly.io/Render vs ECS Fargate) + Cloudflare CDN
- [ ] CI/CD: 모노레포 경로 필터, 코드젠 검증
- [ ] 이벤트 전달: 메인 루트 + 일일 풀 + 보상형 광고 모델 확정, 300+ 작성 워크스트림 계획
- [ ] **AI 레이어(MVP 핵심)**: LLM 대화·교정 모델 티어링·제공자, STT/TTS, **포트·어댑터 추상화**, 비용·지연·가드레일·캐싱
- [ ] **대화 엔진 설계**: 시나리오 가드레일 ↔ LLM 자유 대화 ↔ 교정 파이프라인 경계·상태·확장성 패턴
- [ ] 계약/코드젠 파이프라인 구체화 (swag → openapi.yaml → openapi-typescript)
- [ ] Construction 스테이지 분해 및 STATUS.md 갱신

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.
> 권고안 + 대안·탈락 이유 + 외부 의존성/비용 + 번복 영향. ⚠️ 표시는 **사용자 확인을 특히 권장**하는 큰 갈림길.

### 결정 요약 (Decision Summary)

| 영역 | 결정 | 대안(탈락) |
|---|---|---|
| 서버 아키텍처 | Go stdlib `net/http` + **헥사고날(포트/어댑터)** 레이어링 | 프레임워크(Echo/chi) — 사용자 stdlib 결정 |
| DB 접근 | **PostgreSQL + pgx + sqlc**(타입세이프), 마이그레이션 **golang-migrate** | GORM/ent(ORM) — 제어·확장성 위배로 탈락 |
| 캐시/상태 | **Redis**(일일 이벤트·00:00 리셋·레이트리밋·LLM 캐시) | DB-only — 리셋/캐시 부담 |
| 인증 ⚠️ | **자체 발급**(Go) — 네이티브 provider 로그인 → ID토큰 검증 → 자체 JWT+refresh | Clerk(매니지드) — Kakao 1급 미지원 + 과금/락인 |
| API 계약 | Go-first: swag → openapi.yaml → openapi-typescript | 수기 동기화 — 드리프트 |
| 콘텐츠 전달 | 서버 fetch(axios 래퍼) + Redis/ETag 캐시, 추후 Cloudflare CDN | 번들 — 갱신 경직 |
| LLM ⚠️ | **Claude** 티어링: 대화=Sonnet, 교정=Haiku (포트로 교체 가능) | OpenAI 등 — 어댑터로 대체 가능 |
| STT | 대화 입력=**온디바이스**(`expo-speech-recognition`, 무과금) | 클라우드 STT — 비용↑(필요시 어댑터) |
| 발음 평가 ⚠️ | **Azure Pronunciation Assessment**(점수·운율) | 온디바이스 STT는 점수 불가 |
| TTS | **expo-speech**(온디바이스, MVP) → 포트로 클라우드 업그레이드 | ElevenLabs 즉시 도입 — 비용·과잉 |
| 호스팅 ⚠️ | **Docker** + **Fly.io**(관리형 PG/Redis), 앞단 Cloudflare. 모바일 **EAS** | ECS Fargate — 솔로 운영부담↑ |
| CI/CD | GitHub Actions, 모노레포 경로 필터 + 코드젠 검증 | — |

### A. 서버 아키텍처 (Go stdlib)

- `net/http` 1.22+ 패턴 라우팅. **헥사고날**: `domain`(엔티티·유스케이스) ↔ `ports`(인터페이스) ↔
  `adapters`(postgres·redis·llm·stt·tts·auth). LLM/STT/TTS/Auth 교체 가능성을 구조로 보장(1-2 합의).
- 선별 라이브러리: `pgx`/`sqlc`, `golang-migrate`, `go-playground/validator`, `swaggo/swag`, 구조적 로깅 `slog`(stdlib).
- **번복 영향:** 레이어 경계가 명확하므로 어댑터 교체는 국소적. 라우팅/프레임워크 변경은 `adapters/http`에 한정.

### B. 데이터·캐시

- **PostgreSQL** 단일 주 저장소. `pgx`(드라이버) + **`sqlc`**(SQL→타입세이프 Go) — ORM 없이 제어·성능·컴파일타임 안전.
- 마이그레이션 `golang-migrate`(버전드 SQL). 콘텐츠 `contentVersion`과 별개로 스키마 버전 관리.
- **Redis**(관리형): 일일 이벤트 세트·00:00 리셋, 레이트리밋, refresh/세션 보조, LLM 응답 캐시.
- 대안 GORM/ent 탈락: 리플렉션·추상화로 stdlib 철학·제어와 충돌.

### C. 인증 ⚠️ (사용자 위임 — 시중 사례 조사 결과)

- **권고: 자체 토큰 발급(Go 서버).** 디바이스에서 네이티브 로그인(`expo-apple-authentication`,
  `@react-native-google-signin`, **Kakao SDK**) → provider ID 토큰을 서버로 → OIDC/JWKS 검증 →
  서버가 **access JWT(~15분) + refresh(회전)** 발급. refresh는 `expo-secure-store` 저장.
- **이유:** ① **Kakao 1급 지원**(한국 간호사 핵심) — Clerk/Supabase는 Kakao 비표준. ② 이미 사용자
  데이터를 소유한 Go 백엔드가 세션을 발급해야 함(자연스러움). ③ **MAU 과금·벤더 락인 없음**. ④ 완전한 제어.
- **트레이드오프:** 보안 책임·plumbing 증가(솔로). 빠른 출시를 더 원하면 **Clerk**(Apple/Google만)로
  시작하고 Kakao만 커스텀하는 대안도 가능 — ⚠️ **사용자 확인 권장**.
- 외부 의존성: Apple Developer(필수, Sign in with Apple), Google OAuth, Kakao Developers. 비용: 무료(과금 없음).

### D. API 계약 / 코드젠

- Go 핸들러 `swag` 어노테이션 → `openapi.yaml`(`packages/contract`) → `openapi-typescript` TS 클라이언트.
- CI가 코드젠 산출물 최신성 검증(불일치 시 실패) → 드리프트 차단.

### E. 콘텐츠 전달 · 버전

- 저작 콘텐츠는 **버전드 파일(YAML/JSON, 레포)** → 마이그레이션/시드로 Postgres 적재 → API로 서버 fetch.
  (MVP는 CMS 없이 파일 기반; 저작 도구는 콘텐츠 워크스트림에서.) 캐시: Redis + HTTP ETag, 추후 Cloudflare CDN.
- 모바일은 **axios 래퍼 클라이언트**(교체 가능). `contentVersion` 헤더로 캐시 무효화·호환성 관리.

### F. AI 레이어 ⚠️ (forin 핵심)

- **LLM(포트):** 대화 = **Claude Sonnet**(자연스러움·비용 균형, 최상 품질 필요시 Opus), 교정 = **Claude Haiku**(저가).
  서버 오케스트레이션·**SSE 스트리밍**, 모델 티어링은 설정. 어댑터로 OpenAI 등 교체 가능. 키는 서버 보관.
- **대화 엔진:** Scenario(goals·guardrails·keyPhrases)를 시스템 프롬프트에 주입 → LLM 자유 대화 → `DialogueTurn`
  기록. 사용자 발화는 **교정 파이프라인**(Haiku) → `CorrectionResult` → `ReviewCard`.
- **STT:** 대화 입력은 **온디바이스 `@jamsch/expo-speech-recognition`**(무과금·저지연). 클라우드 STT는 어댑터로 옵션.
- **발음 평가 ⚠️:** 🎤 따라 말하기 점수는 온디바이스로 불가 → **Azure Speech Pronunciation Assessment**
  (정확도·유창성·운율). 사용 분량에 따라 과금 — 비용 모니터링 필요.
- **TTS:** MVP는 **expo-speech**(온디바이스·무료) → 품질 필요시 포트로 클라우드(OpenAI gpt-4o-mini-tts / Deepgram Aura) 교체.
- **비용 통제:** 모델 티어링, 교정 캐시, 대화 턴 상한, 스트리밍. 가드레일은 시나리오 주입 + 서버 검증.
- 외부 의존성/비용: **Anthropic**(LLM, 토큰 과금), **Azure Speech**(발음, 분당 과금), STT/TTS 온디바이스(무료).

### G. 호스팅 / 배포 ⚠️

- **Docker**로 dev=prod 동일. **권고: Fly.io**(Docker 네이티브·글로벌·관리형 Fly Postgres + Upstash Redis·낮은 운영부담),
  앞단 **Cloudflare**(DNS/CDN/엣지 캐시). 환경 분리 dev/staging/prod.
- 모바일 **EAS** Build/Submit + **EAS Update**(OTA). 대안 Render(유사), ECS Fargate(AWS 중심·운영부담↑).
- 비용: Fly.io 사용량제(소규모 저렴), Cloudflare 무료 티어 가능.

### H. CI/CD

- **GitHub Actions**, **모노레포 경로 필터**: `server/**`→Go 빌드·테스트·이미지·Fly 배포; `mobile/**`→EAS;
  `packages/contract`·계약 코드젠 **최신성 검증** 게이트.

### I. 맵 / 탐험 엔진 (품질 축)

- **충돌맵 = 저작**(인테리어별 collision 레이어; 벽·오브젝트 배치에서 파생) → 클라이언트 로드.
- 이동: D-pad + **탭-투-패스**(reanimated), 룸마스크 유지. 성능: 바닥 프리베이크(이미지)·가시 오브젝트만 렌더.
- 캐릭터/Face는 `react-native-svg`(03 핸드오프). 욕심 영역 → Construction에서 별도 스테이지로 집중.

### J. Level 진단 · K. 경제

- **Level 진단(MVP):** 짧은 자가진단 + 소수 배치 문항 → 시작 레벨(CEFR류) 규칙 기반 매핑. 정교화는 후속.
- **경제:** 보상 타입·효과는 **코드측 허용집합 + 설정 테이블**(하드코딩 금지)로 반복 튜닝. 평판→NPC 반응 가중,
  칭호/히든미션 환류(1-2 §7). 수치는 출시 후 데이터로 조정.

### L. 대규모 콘텐츠 워크스트림

- 이벤트 300+·퀴즈 1000+·시나리오 = **병행 콘텐츠 트랙**. **단계적**으로: MVP는 메인 루트 + 일일 풀에 필요한
  최소 세트부터, 임상 레퍼런스 조사·검수. 버전드 파일 + 저작 도구(후속). ⚠️ 일정·리소스가 출시의 실질 제약.

### M. Construction(Phase 2) 스테이지 분해 (제안)

1. **서버 기반** — Go stdlib 스켈레톤, 설정, DB/마이그레이션, **인증**, 헬스/로깅, 헥사고날 골격.
2. **도메인·콘텐츠 API + 계약** — 엔티티·유스케이스, swag→openapi→TS 코드젠.
3. **AI 레이어** — 대화 엔진·교정·STT/TTS/발음 포트·어댑터, 스트리밍 오케스트레이션.
4. **모바일 기반** — Expo·디자인 시스템·폰트·픽셀 컴포넌트·axios 클라이언트.
5. **맵/탐험 엔진** — 타일·충돌·이동·룸마스크·캐릭터/Face SVG.
6. **화면·플로우** — 온보딩→캠퍼스→인테리어→브리핑→다이얼로그→퀴즈→결과→상황판→프로필→리뷰랩.
7. **성장·경제·복습·이벤트 전달** — XP/평판/자격/스티커/칭호·SM-2·일일/광고.
8. **통합·E2E**. + **콘텐츠 워크스트림**(병행).

### 번복(lock-in) 평가

- 포트/어댑터 덕분에 **LLM·STT·TTS·Auth·DB 제공자 교체는 국소적**(어댑터 한정). 수용 가능.
- 가장 무거운 락인: **Azure 발음 평가**(대체 시 점수 체계 차이) → 포트로 격리. **Fly.io**(Docker라 이전 용이).
- **Postgres·Go stdlib·Expo**는 표준·장수 기술 → 락인 위험 낮음.

## 검토 게이트 (Human Gate) ⚠️ 비가역

기본 게이트:
- [ ] AI 제안이 PRD 요구사항과 일치하는가?
- [ ] Construction 진행에 필요한 결정이 모두 내려졌는가?

비가역성 확인:
- [ ] 결정 번복 시 영향받는 파일/레이어 목록을 작성했는가?
- [ ] 대안 접근법을 검토하고 탈락 이유를 문서화했는가?
- [ ] 외부 API 의존성 및 비용 구조(인증·STT·호스팅·DB)를 확인했는가?
- [ ] 잠기는(lock-in) 기술 스택이 수용 가능한가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-3 상태를 `HUMAN_APPROVED`로 + Construction 스테이지 확정
→ Phase 2 첫 스테이지로 이동
