---
build-spec: departments/morgue
stage: 02-construction / 05-map-engine (5g-ab · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-ab · Morgue & Autopsy 영안실·부검실

| | |
|---|---|
| interior id | `INT-MORGUE-00001` (deptId `DEPT-MORGUE-00001`) |
| fixture | `mobile/src/map/fixtures/morgue.ts` (`MORGUE_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-morgue.jsx` + `interior-objects-morgue2.jsx` |
| 그리드 | 28×40 · floorTheme `clinical` · 좌측 엘리베이터 문(y5-6) · **전면 저조도 Tint**(#1E2530 op0.14) |
| playerStart | `{4,7}` (접수·인수인계, ← 엘리베이터 문 앞) |

> Phase 5 · ADMIN **B1**. 통제 구역 지하. 접수·인수인계 → 시신 냉장 보관실(CadaverFridge 뱅크) → 부검실(AutopsyTable·SinkOR·InstrumentTray) → 유족 참관실(ViewingBier·고별) → 시설팀 기계실(Autoclave·설비). **v16 20개 신규 부서의 마지막 · Phase 5·전체 완결.**

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌ 접수·인수인계 (영안실 접수·고인 확인) ───────────────────────┐  (y1-7)
├ 시신 냉장 보관실 (CadaverFridge×3·Gurney) ╎ 부검실 (AutopsyTable·SinkOR·Tray) ┤  (y9-24, x13 divider)
├ 유족 참관실 (ViewingBier·좌석·고별) ╎ 시설팀 기계실 (Autoclave·설비 캐비닛) ┤  (y26-38, x14 divider)
└──────────────────────────────────────────── 저조도 지하 Tint ──┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×40 5구역 | `fixtures/morgue.ts` → `FIXTURES` |
| 카탈로그 morgue2 3종(CadaverFridge·AutopsyTable·ViewingBier) | `objects/morgueEquipment.tsx` + `MorgueObjectView`(Spd 뒤) |
| 재사용 | Gurney(er)·Autoclave(spd)·InstrumentTray/SinkOR(or)·reception/chartbinder/deskphone/handsanitizer/monitor/wastebin/icabinet/chair/plant/baylabel/tint |
| 엘리베이터 | ADMIN **B1**(영안실·부검실·기계실), entry `{1,6}` |
| 테스트 | `map/morgue-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ADMIN **B1**(지하) 단일 배선. **ADMIN 건물 완결**(1F spd·2F lounge·3F sim·B1 morgue).
- **Q2 톤** → 전면 저조도 Tint(#1E2530)로 지하·통제 구역 무드. clinical 바닥.
- **Q3 시나리오** → 라벨만(고인 신원 확인·검안·부검 기록 등).

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y8 divider·cold\|autopsy x13·y25 divider·viewing\|mech x14) · 전면 tint
- [x] threshold 4(냉장실·부검실·참관실·기계실) · door 1(엘리베이터) · 신규 3종 · NPC 8 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ADMIN B1 · `morgue-fixture.test.ts`(6)
- [x] tsc/jest(208/208) + 시뮬레이터 5개 방(접수·냉장보관·부검실·참관실·기계실) 화면단위 대조 확인

## §5. 편차
- 전면 Tint(지하 무드) · 신규 footprint props(cadaverfridge 4×2·autopsytable 3×2·viewingbier 2×1) · icabinet variant equipment(비충돌 벽 부착) · 시나리오 라벨만.
