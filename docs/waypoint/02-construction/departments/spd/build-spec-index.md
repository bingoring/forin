---
build-spec: departments/spd
stage: 02-construction / 05-map-engine (5g-aa · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-aa · SPD/CSD · Nutrition · Loading Dock 중앙공급실·영양·하역

| | |
|---|---|
| interior id | `INT-SPD-00001` (deptId `DEPT-SPD-00001`) |
| fixture | `mobile/src/map/fixtures/spd.ts` (`SPD_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-spd.jsx` + `interior-objects-spd2.jsx` |
| 그리드 | **30**×44 (와이드) · floorTheme `pharma` · scale **0.9** · 좌측 엘리베이터 문(y7-9) + **우측 하역장 게이트**(y31-36) |
| playerStart | `{4,8}` (오염 세척 구역, ← 엘리베이터 문 앞) |

> Phase 5 · ADMIN. 산업형 back-of-house. 오염 세척(Decon, 세척→멸균 통과형) → 멸균·보관(Autoclave·SPD) → 영양팀 배식실(트레이 라인) → 화물 하역장(파렛트·트럭).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌ 오염 세척 (Decon·세척기) ╎세척→멸균╎ 멸균·보관 (Autoclave·랙) ┐  (y1-10, x14 barrier)
├──────── 영양팀 · 배식실 (ADL키친·트레이 카트·식단검수) ────────┤  (y12-24)
├──────── 화물 하역장 (파렛트·카고트럭·안전선) ─────[하역 게이트]┤  (y26-42, 저조도)
└───────────────────────────────────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 30×44 4구역 | `fixtures/spd.ts` → `FIXTURES` |
| 카탈로그 spd2 6종(Autoclave·SterileRack·WasherDisinfector·FoodCartColumn·PalletStack·CargoTruck) | `objects/spdEquipment.tsx` + `SpdObjectView`(Lounge 뒤) |
| 재사용 | adlkitchen(hospice)·fridge(onco)·medcart/floortape/shelflabel(pharma)·soiledcart(or)·sinkor·waste·icabinet·ireception·tint·baylabel |
| 엘리베이터 | ADMIN **1F**(중앙공급실·영양·하역), entry `{1,8}` |
| 테스트 | `map/spd-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ADMIN 1F(lobby) 단일 배선. **ADMIN 건물 3/4층 배선**(1F spd·2F lounge·3F sim; B1 morgue 예정).
- **Q2 30-와이드 그리드** → 산업 라인이 넓어 cols=30. 세척→멸균 sterile pass-through(x14 barrier), 우측 하역장 롤업 게이트(door).
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 4 / rooms 4 / collision(외벽·좌측문·우측 하역게이트·y11·soiled\|sterile x14 barrier·y25) · 하역장 tint
- [x] threshold 4(배식×2·세척→멸균·하역장) · door 2(엘리베이터·하역게이트) · 신규 6종 · NPC 6 · 핫스팟 4
- [x] 디스패치 + FIXTURES + 엘리베이터 ADMIN 1F · `spd-fixture.test.ts`(6)
- [x] tsc/jest(202/202) + 시뮬레이터(멸균 Autoclave/SterileRack·배식 FoodCartColumn·하역장 PalletStack/FloorTape) 화면단위 확인

## §5. 편차
- scale 0.9 · cols 30(와이드) · icabinet kind→variant supply · 신규 footprint props(sterilerack 비충돌·나머지 props{w,h}) · 시나리오 라벨만.
