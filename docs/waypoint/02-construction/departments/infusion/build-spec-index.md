---
build-spec: departments/infusion
stage: 02-construction / 05-map-engine (5g-j · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-j · Outpatient Infusion Center 외래 주사센터

| | |
|---|---|
| interior id | `INT-INFUSION-00001` (deptId `DEPT-INFUSION-00001`) |
| fixture | `mobile/src/map/fixtures/infusion.ts` (`INFUSION_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-infusion.jsx` (+ 오브젝트는 `interior-objects-onco2.jsx`·`interior-icu.jsx` 재사용, 전용 objects2 **없음**) |
| 그리드 | 28 cols × 40 rows · floorTheme `clinical` · scale **0.9** · **좌측 엘리베이터 문**(y5-6) |
| playerStart | `{4,7}` (접수 통로, ← 엘리베이터 문 앞) |

> v16 신규 20종 중 **Phase 1(재사용 quick-win)** 첫 부서. 외래 항암/수액 데이케어. 전용 objects2가 없어 **종양내과 카탈로그(onco2)** 3종 + ICU CoffeeMachine 1종만 신규 포팅, 나머지는 ER/ICU/pharma/shared 재사용. → 재사용 파이프라인 검증 인스턴스.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌──────── 접수 · 조제 전달 (접수·공압튜브·당일약품·약품냉장·손소독) ────────┐  (y1-7)
├─ 오픈 주입 베이 (리클라이너×8 + 스마트펌프×8) ──┬─ 격리 주입실(과민반응) ─┤  (y9-27, x19 divider)
├──── 간이 휴게·다과 (정수기·커피머신·테이블) ──┬── 주입 간호 스테이션 ────┤  (y29-38, x13 divider)
└──────────────────────────────────────────────────────────────────┘
```
- **외래 데이케어**: 접수·약품 대조 → 오픈 베이 항암/수액 주입(속도·부작용) → 격리실 과민반응 관찰(아나필락시스) → 다과·차팅.

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×40 레이아웃·엔티티·NPC | `fixtures/infusion.ts` (신규) → `FIXTURES` |
| Infusion 카탈로그 | onco2 3(InfusionChair·SmartInfusionPump·PPEStation) + icu CoffeeMachine 1 | `objects/infusionEquipment.tsx` (신규) + `InfusionObjectView` |
| 재사용 | pneumatictube(pharma)·medfridge/handsanitizer/crashcart/compcart/watercooler/coffeetable(er)·nursestation/deskphone(er/ward)·ireception·icabinet(drug)·imonitor·ichair·iplant·baylabel | 기존 |
| 디스패치 | `InfusionObjectView` 체인 추가(Derm 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | DX(외래·진단) **3F**(외래 주사센터), entry `{1,6}`(좌측 문) | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·footprint | `map/infusion-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → 엘리베이터 **DX 3F**. 3F는 depts 2개(외래 주사센터 + 인공신장실 Dialysis) → 현재 **infusion으로 배선**(depts[0]=외래 주사센터 선두), entry `{1,6}`. Dialysis 구현 시 **층당 복수부서 sub-선택** 도입 예정.
- **Q2 전용 objects2 부재** → onco2(InfusionChair·SmartInfusionPump·PPEStation) + icu(CoffeeMachine) 포팅으로 해소. onco 병동 구현 시 동일 컴포넌트 공유.
- **Q3 시나리오** → 라벨만.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y8 divider·bay\|private x19·y28 divider·nourish\|station x13)
- [x] threshold 3(→베이 x6-7 · →격리 x19-20 sterile · →휴게 x6-7) · door(← 엘리베이터, 좌측)
- [x] 신규 `infusionEquipment.tsx`(4종: InfusionChair·SmartInfusionPump·PPEStation·CoffeeMachine)
- [x] NPC 캐스트 8 + 마커(핫스팟 5)
- [x] `InfusionObjectView` 디스패치 + `FIXTURES` + 엘리베이터 DX 3F
- [x] `infusion-fixture.test.ts`(6)
- [x] tsc/jest(100/100) + 시뮬레이터 5구역(접수·베이·격리·다과·스테이션) 확인

## §5. 편차
- scale 0.9 · SVG `<text>` 글리프(커피 ☕) → shape 블록 · InfusionChair footprint `2×2`(시각 2.6×3.4보다 축소, 휠체어 통로 확보) · 3F 라벨 순서 변경(외래 주사센터 선두) · 시나리오 라벨만.
