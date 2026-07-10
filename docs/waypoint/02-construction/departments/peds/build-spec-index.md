---
build-spec: departments/peds
stage: 02-construction / 05-map-engine (5g-d)
status: DRAFT
depth: comprehensive
updated: 2026-07-10
---

# Build Spec — 5g-d · Peds + NICU 소아청소년 센터

| | |
|---|---|
| interior id | `INT-PEDS-00001` (deptId `DEPT-PEDS-00001`) |
| fixture | `mobile/src/map/fixtures/peds.ts` (`PEDS_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v13` `interior-peds.jsx` + `interior-objects-peds2.jsx`·`interior-shared.jsx` (**v13 2.5D + 접지 그림자**) |
| 그리드 | 34 cols × 48 rows · floorTheme `peds` · scale **0.85** |
| playerStart | `{18,20}` (병동 입구 앞 — 핸드오프 그대로) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 아티팩트별 파일은 아래 매니페스트.
> **v13 2.5D 장비 규약**(README §)을 신규 오브젝트에 적용 — 통합 실루엣+상단면+seam+viewer-facing+**접지 그림자 타원**.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) — regions·rooms·오브젝트 배치·NPC |
| business-rules | [`business-rules.md`](business-rules.md) — collision·통행·footprint |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) — 진입·이동·시나리오 배선 |
| frontend-components | [`frontend-components.md`](frontend-components.md) — peds2 카탈로그·놀이방 오브젝트·렌더 |

## §0. 개요 & 범위
```
┌──────── 외래 · 대기 · 놀이 · 계측 · 접수 (y0-14) ────────┐  상단 전폭
│ 계측(좌)      접수(중)              놀이방 PLAY(우)        │
├── 소아 진료실 ─┬──────── 소아 병동 (4-bed) ──────────────┤  y14 divider
│ (x0-11)       │ (x11-34): PEDS STATION + 크립2 + 병상2   │
├── NICU 전실 ──╎──────── NICU 인큐베이터 존 ──────────────┤  y29 divider
│ 세척(x0-9)    ┃(x9-34): 광선치료 3 + 인큐베이터 3 + 모유고 │  유리벽 x9 + sterile 스크럽 통로
└───────────────┴──────────────────────────────────────────┘
```
- **동선 원칙**(핸드오프): 외래·놀이(밝고 친근) → 진료실/병동(임상) → **NICU(무균, 유리벽+3분 스크럽 전실 경유)**. 안쪽일수록 청정.
- NICU 존 저조도 `tint`(#1E2A40 op0.15). NICU 진입 = **유리벽(x9) + sterile threshold(y34-36 "스크럽 후 입장")**.

## §1. 분해 (Decomposition)
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 34×48 레이아웃·엔티티·NPC | `fixtures/peds.ts` (신규) → `FIXTURES` 등록 |
| Peds 카탈로그 | peds2 오브젝트 + 놀이방 오브젝트 렌더 | `objects/pedsEquipment.tsx` (신규) + `PedsObjectView` |
| 공용 프리미티브 | ibed(peds)·imonitor·ireception·ichair·iplant·sinkor·scrubdispenser·gownbox·nursedeski·ivpump·bpcuff·sanitizer·clinicreception | `objects/sharedEquipment.tsx` (기존, 필요 시 peds 변형 확인) |
| 디스패치 | `PedsObjectView`를 체인에 추가 | `objects/index.tsx` |
| 엘리베이터 | 타워 4F(또는 신규 층) 진입 배선 | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·차단·유리벽 가드 | `map/peds-fixture.test.ts` (신규) |

## §3. 미해결 질문 (구현 착수 전 해소)
- [ ] **Q1 시나리오 배선:** peds 시나리오 id가 `content/scenarios.ts`에 아직 없음. 마커 라벨(성장 문진·투약 소분·위관영양 등)만 우선 배치하고 scenarioId는 콘텐츠 준비 후 연결? (제안: 라벨만, scenarioId 후속)
- [ ] **Q2 엘리베이터 층:** Peds는 몇 층에 배치? (ER 1F·OR 3F·ICU 4F 사용 중 → Peds 5F 신설? 또는 기존 층 재배치?) 타워 `ELEVATOR_BUILDINGS` 확인 필요.
- [ ] **Q3 `ibed` peds 변형:** 핸드오프 `<IBed variant="peds">`(주황 프레임·핑크 매트리스, `PedsBed`)가 sharedEquipment `IBed`에 이미 있는지 확인 → 없으면 추가 vs pedsEquipment에 별도 `PedsBed`.

## §4. 구현 체크리스트
- [ ] regions/rooms/collision(외벽·divider·exam|ward·NICU 유리벽)
- [ ] threshold(진료실/병동/NICU전실/스크럽) · door(캠퍼스) · glass(x9) · tint(NICU)
- [ ] 오브젝트 배치(외래·진료·병동·전실·NICU) — domain-entities §
- [ ] 신규 카탈로그 `pedsEquipment.tsx`(peds2 10 + 놀이방 7) + footprint
- [ ] NPC 캐스트 + 마커
- [ ] `PedsObjectView` 디스패치 + fixture 등록 + 엘리베이터
- [ ] `peds-fixture.test.ts`
- [ ] tsc/jest/expo + **시뮬레이터 구역별 v13 대조**

## §5. 검증 계획
- `tsc` 0 · `jest`(peds-fixture: playerStart open · 5 room 도달 · threshold 통행 · NICU 유리벽 차단 · 인큐베이터/크립 footprint) · `expo export`.
- **화면 단위 v13 대조**(README §4): 하네스 `#PEDS` ground truth ↔ 시뮬레이터 구역(외래·놀이·진료·병동·전실·NICU) 대조.

## §7. 편차 로그 (구현 후 기록)
| SoT | 실제 | 사유 |
|---|---|---|
| (구현 후) | | |
