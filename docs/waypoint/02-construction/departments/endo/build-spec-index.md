---
build-spec: departments/endo
stage: 02-construction / 05-map-engine (5g-q · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-q · Endoscopy Suite 내시경실

| | |
|---|---|
| interior id | `INT-ENDO-00001` (deptId `DEPT-ENDO-00001`) |
| fixture | `mobile/src/map/fixtures/endo.ts` (`ENDO_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-endo.jsx` + `interior-objects-endo2.jsx` |
| 그리드 | 28×44 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (접수, ← 엘리베이터 문 앞) |

> Phase 3 · DX. 접수·대기 → 전처치·회복 베이 · 세척·재처리실(AER) → 내시경 시술실 1(상부)·2(대장).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────────── 접수 · 대기 (금식 확인) ────────────┐  (y1-8)
├ 전처치·회복 베이 (진정·모니터) ┬ 세척·재처리실 (AER) ┤  (y10-25, x13)
├ 내시경 시술실 1 (상부) ┬ 내시경 시술실 2 (대장) ─────┤  (y27-43, x13)
└──────────────────────┴──────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/endo.ts` → `FIXTURES` |
| 카탈로그 endo2 4종(EndoTower·ScopeWasher·ScopeCabinet·ProcedureBed) | `objects/endoEquipment.tsx` + `EndoObjectView`(Rad 뒤) |
| 재사용 | oxygen·suction(er)·sinkor·wastebin·ibed·imonitor·iiv·ireception·ichair·icurtain·iplant·baylabel |
| 엘리베이터 | DX **4F**(내시경실), entry `{1,8}` |
| 테스트 | `map/endo-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → DX 4F. 4F depts 3(내시경실·Cath·IR) 중 endo만 구현 → 단일 interior 배선(Cath/IR 후속 rooms[] 전환 여지).
- **Q2 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y9·prep\|reproc x13·y26·proc1\|proc2 x13)
- [x] threshold 4 · door · 신규 4종 · NPC 9 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 DX 4F · `endo-fixture.test.ts`(6)
- [x] tsc/jest(142/142) + 시뮬레이터(시술실 EndoTower/ProcedureBed · 재처리실 ScopeWasher/ScopeCabinet) 확인

## §5. 편차
- scale 0.9 · SVG text(CO₂)→shape · 신규 footprint props(procedurebed 3×1·endotower/scopewasher/scopecabinet 2×1) · DX 4F 단일 배선 · 시나리오 라벨만.
