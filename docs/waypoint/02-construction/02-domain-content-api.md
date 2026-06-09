---
phase: 02-construction
stage: 02-domain-content-api
status: HUMAN_APPROVED
updated: 2026-06-09
---

# [Stage 2-2] 도메인·콘텐츠 API + 계약

## 목적

도메인 엔티티·유스케이스를 구현하고 콘텐츠/진행 API를 노출하며, Go-first 계약 코드젠
(swag → openapi.yaml → openapi-typescript)을 확립한다.

## 입력 (Inputs)

- [`01-server-foundation.md`](01-server-foundation.md)
- 도메인 모델: [`../01-inception/02-domain-model.md`](../01-inception/02-domain-model.md)
- 이벤트 카탈로그: [`../events-catalog.md`](../events-catalog.md)

## 체크리스트

- [ ] 콘텐츠 적재: 버전드 파일(YAML/JSON) → 마이그레이션/시드 → Postgres
- [ ] 콘텐츠 API: departments·interiors·events·scenarios·quizzes 조회(서버 fetch, ETag/Redis 캐시)
- [ ] 진행/성장 API: progress·attempts·reputation·certs·stickers·streak
- [ ] enum류 코드측 허용집합 구현
- [ ] swag 어노테이션 → `packages/contract/openapi.yaml` → openapi-typescript 클라이언트
- [ ] CI 코드젠 최신성 검증 게이트

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 목표

도메인·콘텐츠·진행 API + Go-first 계약 코드젠을 구축하고, **콘텐츠 포맷·로더를 확정**한다.
포맷이 굳으면 **콘텐츠 워크스트림(300+/1000+)이 착수**된다(이 스테이지의 가장 중요한 산출).

### 1. 콘텐츠 시스템 (확장성·유지보수 중심 재설계 — 사용자 질문 반영)

**원칙: 포맷이 본질이 아니라 "스키마 + 검증 + 깨끗한 적재 이음새"가 본질.** 특정 도구·포맷에 결혼하지 않는다.

- **형식 SoT = 콘텐츠 스키마.** 각 콘텐츠 타입을 **JSON Schema(+ Go 타입)**로 정의하고, 시드·CI에서
  **구조·참조 무결성·enum**을 검증한다. (YAML이냐 JSON이냐는 부차적 — *스키마 준수*가 본질.)
- **저작 = git 버전드 파일**(MVP). 이유: ① AI 대량 생성에 최적 ② **git이 곧 버전 관리**(이력·diff·리뷰·롤백·브랜치 무료) ③ 인프라 0. 포맷은 가독성·diff 위해 YAML(또는 JSON), 스키마로 검증.
- **(질문: 웹 CMS) → 나중에 끼우는 추가물로 설계.** 런타임은 **항상 Postgres의 안정적 모델**에서 읽는다.
  행이 파일-시드에서 왔든 어드민 웹에서 왔든 무관. 따라서 **콘텐츠 관리 웹페이지/헤드리스 CMS는
  후속 패치에서 같은 DB·스키마에 얹기만** 하면 됨(재작업 없음). 지금은 솔로·MVP라 파일+git, 웹 어드민은 Patch.
- **(질문: 직업군 확장) → 직군 네임스페이스 디렉토리.**
  ```
  content/
    manifest.yaml                 # version·checksum + 직군별 버전
    schema/                       # JSON Schema (콘텐츠 계약)
    common/                       # 직군 공통(범용 병원 상황 등)
    nurse/{departments,interiors,events,scenarios,quizzes,phrases}/
    doctor/...  pharmacist/...     # 직군 추가 = 디렉토리 추가
  ```
  직군별 독립 버전·독립 배포 가능(온보딩 직군 선택과 직결). 콘텐츠 행에 `profession` 또는 `common` scope.
- **(질문: 다양한 표현/효과) → 콘텐츠는 텍스트만이 아니다.** 시나리오를 **타입 있는 스텝의 시퀀스/그래프**로
  일반화: `dialogue` · `quiz` · `effect` · `branch`. 연출은 **선언적 디렉티브** `{type, payload}`로 기술하고,
  클라이언트의 **이펙트 레지스트리**(코드측 허용집합)가 해석한다. 예: 화재 → `{type:"screen_effect",effect:"fire"}`
  + `{type:"sound",cue:"alarm"}` + `{type:"haptic"}`. **새 연출 = 디렉티브 타입 + 클라 핸들러 추가**(스키마·엔진 불변)
  — 포트/어댑터 철학을 콘텐츠 연출에도 적용.
- **(질문: 버전 관리) 종합:** git(이력·롤백·브랜치) + `manifest.contentVersion`(런타임 핀·ETag·캐시) +
  **스키마 버전**(호환성). 사용자 진행도는 참조한 버전을 기록. 직군별로 버저닝.
- **로더/시더:** `cmd/seed`가 파일 → 스키마·참조 무결성·enum·ID(≥5자리) 검증 → Postgres upsert. `content/`는 `go:embed`.

### 2. DB 스키마 (마이그레이션 000002)

- **콘텐츠:** departments, interiors(+regions, rooms, map_objects, hotspots), events(+ event_relations),
  scenarios, **scenario_steps**(type: dialogue/quiz/effect/branch — 기존 dialogue_nodes를 일반화),
  quizzes, quiz_items, phrases. 모든 콘텐츠 행에 **`profession`/`scope`** 컬럼(직군 네임스페이스).
  가변 구조(step payload·**effect 디렉티브**·branches·rewards·requirements)는 **jsonb**.
- **진행/성장:** user_progress, reputation, certifications, stickers, streaks, scenario_attempts,
  quiz_attempts, review_cards, review_schedules, daily_event_sets, main_route_progress, user_titles, hidden_mission_progress.
- enum 컬럼(profession·step type·effect type 등)은 CHECK 없이 text(**코드측 허용집합** 검증).

### 3. 쿼리 — sqlc 전환

2-1의 hand-written `UserRepo` 포함 모든 쿼리를 `db/queries/*.sql` → `sqlc generate` → 타입세이프 Go로 이전. 리포지토리는 sqlc 코드를 감싸 `ports` 구현.

### 4. API

- **콘텐츠(read):** `GET /content/manifest` · `/departments` · `/interiors/{id}` · `/events` · `/events/{id}` · `/scenarios/{id}` · `/quizzes/{id}` · `/board/today`(일일 이벤트 세트). ETag(contentVersion) + Redis 캐시.
- **진행(read/write):** `GET /me/progress` · `POST /attempts`(클리어·점수 기록) · `GET /me/review`(due 카드) · `POST /me/review/{id}/grade`(SM-2) 등.
- 도메인 유스케이스는 `domain/*`, 핸들러는 `adapters/http`, 영속은 `adapters/postgres`(2-1 헥사고날 패턴 유지).

### 5. 계약 코드젠 (Go-first)

핸들러 `swag` 어노테이션 → `make contract`: `swag init`으로 `packages/contract/openapi.yaml` → `openapi-typescript`로 TS 클라이언트(`packages/contract/`). **CI에 최신성 검증 게이트**(생성물 diff 시 실패).

### 6. 빌드 순서

1 **콘텐츠 스키마(JSON Schema) + effect 디렉티브 레지스트리 계약** 정의 → 2 시더·검증 → 3 content
마이그레이션(직군 scope·scenario_steps) → 4 sqlc 전환 → 5 콘텐츠 API → 6 진행 API → 7 코드젠·CI 게이트
→ 8 **시드 세트(직군=nurse, 병동별 소량) 작성 + 콘텐츠 워크스트림 착수**.

### 범위 밖(후속)

AI 대화·교정·음성(2-3), 모바일(2-4+), 경제 수치 튜닝(2-7).

### 확인됨 (사용자 승인)

- ✅ **콘텐츠 시스템 방향**: 스키마 + git 버전드 파일(직군 네임스페이스) + DB 적재, 웹 CMS는 후속 패치 이음새.
- ✅ **이펙트/연출**: scenario_steps + 선언적 디렉티브 + 클라 이펙트 레지스트리(화재 등).
- ✅ **웹 CMS 시점**: MVP는 파일+git, 어드민 웹은 Patch.
- ✅ **시드 분량**: nurse 병동당 3~5개부터 시작 — **단, 후속에서 시드 분량을 반드시 대폭 증대**해야 함
  (300+ 목표, 콘텐츠 워크스트림의 필수 후속 작업).

## 구현 증분 (Implementation Increments)

큰 스테이지라 검증 가능한 증분으로 구현한다.

- **증분 1 — ✅ 완료·검증**(forin 커밋, 2026-06-08): 콘텐츠 도메인 스키마(Go) + 검증
  (참조 무결성·enum·슬러그, 단위테스트) + 마이그레이션 000002(content 테이블) + 파일 로더
  + `cmd/seed`(검증→upsert) + **nurse 시드(화재 이펙트 포함)** + 콘텐츠 read API
  (`/content/manifest`·`/events`·`/scenarios/{id}`·`/board/today`). docker로 마이그레이션·시드·조회까지
  실 검증(화재 디렉티브 end-to-end 확인). 콘텐츠는 `server/content/`(go:embed 대신 파일 로드 — CMS/외부 소스 유연성).
- **증분 2a — ✅ 계약 코드젠**(forin 커밋, 2026-06-08): Go 어노테이션 → `swag --v3.1`
  → `packages/contract/openapi.yaml`(OpenAPI 3.1) → `openapi-typescript` → `types.ts`. `make contract`
  타깃 + CI 드리프트 게이트(`.github/workflows/contract.yml`). 생성 파이프라인 동작 검증.
- **증분 2b — ✅ 진행/복습**(forin 커밋, 2026-06-08): 진행 테이블(000003) + 진행/성장 API
  (`/me/progress`·`/attempts`) + **SM-2 간격 반복**(`/me/review`·`/me/review/{id}/grade`, 단위테스트) +
  manifest 전체 저장. docker로 진행·공격·복습·채점 플로우 실 검증(xp·streak·SM-2 due 전진). `cmd/devtoken`으로 인증 경로 검증.
- **증분 2c — ✅ 인테리어**(forin 커밋, 2026-06-09): interiors 테이블(000004) + 콘텐츠 모델
  (Interior/Region/Room/MapObject/Hotspot) + 검증(deptId·hotspot→scenario 참조) + 로더 + nurse ER 인테리어 시드
  + API(`/departments`·`/interiors/{id}`). docker로 시드·조회 검증(타일맵·핫스팟→시나리오 연결).
- **증분 2d — ✅ sqlc 전환**(forin 커밋, 2026-06-09): user·content·progress 리포지토리를 sqlc 생성
  타입세이프 쿼리로 일괄 전환(`db/queries/*.sql`, `sqlc.yaml` 오버라이드: uuid→string·date→time.Time·int4→int·float4→float64).
  헥사고날 ports는 불변, 어댑터 내부만 교체. docker로 전 엔드포인트 재검증(streak upsert·조인·jsonb 정상).

**→ 2-2 구현 완료·런타임 검증 완료. 사용자 승인 시 `HUMAN_APPROVED`.**

## 검토 게이트 (Human Gate)

- [ ] API가 도메인 모델·핵심 루프를 충족하는가?
- [ ] 계약 코드젠이 드리프트 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `03-ai-layer.md`
