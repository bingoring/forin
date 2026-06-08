---
phase: 02-construction
stage: 02-domain-content-api
status: AI_PROPOSED
updated: 2026-06-08
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

### 1. 콘텐츠 포맷 (⚠️ 게이팅 결정 — 워크스트림을 여는 열쇠)

- **저작 = YAML**(주석·가독성), 모노레포 루트 `content/` 디렉토리에 타입별로:
  ```
  content/
    manifest.yaml          # version, checksum (캐시 무효화·호환성)
    departments/*.yaml  interiors/*.yaml  events/*.yaml
    scenarios/*.yaml    quizzes/*.yaml    phrases/*.yaml
  ```
- ID는 슬러그 + **≥5자리 제로패딩**(1-2 규약). enum류는 **코드측 허용집합**으로 검증.
- **로더/시더:** 서버 `cmd/seed`(또는 `make seed`)가 YAML → **검증**(참조 무결성: prereq/follow_up·scenario·quiz 존재, enum 유효, ID 중복) → Postgres **upsert**. `content/`는 `go:embed`로 이미지에 포함.
- **버전:** `manifest.yaml`의 `contentVersion`을 응답 ETag·캐시 키에 사용.

### 2. DB 스키마 (마이그레이션 000002)

- **콘텐츠:** departments, interiors(+regions, rooms, map_objects, hotspots), events(+ event_relations), scenarios, dialogue_nodes, quizzes, quiz_items, phrases. 가변 구조(branches·payload·rewards·requirements)는 **jsonb**.
- **진행/성장:** user_progress, reputation, certifications, stickers, streaks, scenario_attempts, quiz_attempts, review_cards, review_schedules, daily_event_sets, main_route_progress, user_titles, hidden_mission_progress.
- enum 컬럼은 CHECK 없이 text(코드측 검증).

### 3. 쿼리 — sqlc 전환

2-1의 hand-written `UserRepo` 포함 모든 쿼리를 `db/queries/*.sql` → `sqlc generate` → 타입세이프 Go로 이전. 리포지토리는 sqlc 코드를 감싸 `ports` 구현.

### 4. API

- **콘텐츠(read):** `GET /content/manifest` · `/departments` · `/interiors/{id}` · `/events` · `/events/{id}` · `/scenarios/{id}` · `/quizzes/{id}` · `/board/today`(일일 이벤트 세트). ETag(contentVersion) + Redis 캐시.
- **진행(read/write):** `GET /me/progress` · `POST /attempts`(클리어·점수 기록) · `GET /me/review`(due 카드) · `POST /me/review/{id}/grade`(SM-2) 등.
- 도메인 유스케이스는 `domain/*`, 핸들러는 `adapters/http`, 영속은 `adapters/postgres`(2-1 헥사고날 패턴 유지).

### 5. 계약 코드젠 (Go-first)

핸들러 `swag` 어노테이션 → `make contract`: `swag init`으로 `packages/contract/openapi.yaml` → `openapi-typescript`로 TS 클라이언트(`packages/contract/`). **CI에 최신성 검증 게이트**(생성물 diff 시 실패).

### 6. 빌드 순서

1 콘텐츠 포맷·검증·시더 → 2 content 마이그레이션 → 3 sqlc 전환 → 4 콘텐츠 API → 5 진행 API
→ 6 코드젠·CI 게이트 → 7 **시드 세트(병동별 소량) 작성 + 콘텐츠 워크스트림 착수**.

### 범위 밖(후속)

AI 대화·교정·음성(2-3), 모바일(2-4+), 경제 수치 튜닝(2-7).

### ⚠️ 사용자 확인 권장

- 콘텐츠 포맷: **YAML + 루트 `content/` + go:embed 시더** 방향이 맞는지.
- 시드 세트 분량(예: 병동당 이벤트 3~5개)부터 시작 → 이후 스케일업.

## 검토 게이트 (Human Gate)

- [ ] API가 도메인 모델·핵심 루프를 충족하는가?
- [ ] 계약 코드젠이 드리프트 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `03-ai-layer.md`
