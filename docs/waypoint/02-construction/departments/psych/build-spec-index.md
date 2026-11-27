---
build-spec: departments/psych
stage: 02-construction / 05-map-engine (5g-w · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-w · Inpatient Psych 정신과 폐쇄병동

| | |
|---|---|
| interior id | `INT-PSYCH-00001` (deptId `DEPT-PSYCH-00001`) |
| fixture | `mobile/src/map/fixtures/psych.ts` (`PSYCH_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-psych.jsx` + `interior-objects-psych2.jsx` |
| 그리드 | 28×44 · floorTheme `internal` · scale **0.9** · 좌측 엘리베이터 문(y5-6) |
| playerStart | `{4,7}` (이중 통제문 소지품 보관, ← 엘리베이터 문 앞) |

> Phase 4 · ONCO. 통제된 이중문 진입 → 상시 관찰 간호 스테이션(유리 ObsWindow로 데이룸 관찰)·데이룸 → 자해 방지 안전 병실·패딩 안정실.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──── 이중 통제문 · 소지품 보관 (금속탐지·락커) ────┐  (y1-7)
├ 관찰 간호 스테이션 ╎유리관찰창╎ 데이룸 (공동 활동) ┤  (y9-22, x13 gap y11-13)
├ 안전 병실 (볼트 SafeBed) ┬ 안정실 (패딩 seclusion) ┤  (y24-42, x13)
└────────────────────────┴────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/psych.ts` → `FIXTURES` |
| 카탈로그 psych2 3종(SafeBed·SeclusionPad·GroupTable) | `objects/psychEquipment.tsx` + `PsychObjectView`(Geri 뒤) |
| 재사용 | obswindow(nursery)·detector(MetalDetector, er)·icabinet(linen/drug)·nursestation·deskphone·chartbinder·compcart·walltv·ichair·watercooler·ireception·iplant·baylabel |
| 엘리베이터 | ONCO **2F**(정신과 폐쇄병동), entry `{1,6}` |
| 테스트 | `map/psych-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ONCO 2F 단일 배선(정신과 외래는 후속).
- **Q2 station\|dayroom 관찰창** → x13 divider에 ObsWindow(y12) + 통행 gap(y11/y13)로 스테이션↔데이룸 연결. 관찰창은 비충돌(장식), 개구부가 실제 동선.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y8 통제문·station\|dayroom x13 관찰 gap·y23·rooms\|seclusion x13)
- [x] threshold 4(통제문 sterile·병실·안정실 sterile) · door · ObsWindow 2 · 신규 3종 · NPC 10 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ONCO 2F · `psych-fixture.test.ts`(6)
- [x] tsc/jest(178/178) + 시뮬레이터(안전 병실 SafeBed·안정실 SeclusionPad/ObsWindow·데이룸 GroupTable) 화면단위 확인

## §5. 편차
- scale 0.9 · 신규 footprint props(safebed 2×3·grouptable 2×1, seclusionpad/obswindow 비충돌) · station\|dayroom 관찰 gap(장식 창+통행) · 시나리오 라벨만.
