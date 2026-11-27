---
build-spec: departments/hospice
stage: 02-construction / 05-map-engine (5g-u · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-u · Hospice / Palliative 완화의료·호스피스

| | |
|---|---|
| interior id | `INT-HOSPICE-00001` (deptId `DEPT-HOSPICE-00001`) |
| fixture | `mobile/src/map/fixtures/hospice.ts` (`HOSPICE_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-hospice.jsx` + `interior-objects-hospice2.jsx` (+ rehab2 ADLKitchen) |
| 그리드 | 28×44 · floorTheme `peds`(warm) · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (가족 라운지, ← 엘리베이터 문 앞) |

> Phase 4 · ONCO. **임상 병동이 아닌 가정형·존엄 케어 공간.** ONCO 4F sub-선택 첫 번째 방(노인성 질환 병동과 병존). 가족 라운지·키친 → 완화 케어 스테이션 · 명상/추모실 → 가정형 1인 완화 병실 A · 정원뷰 선룸 병실 B.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────── 가족 라운지 · 키친 (ADL키친·냉장고·소파) ────────┐  (y1-8)
├ 완화 케어 스테이션 ┬ 명상 · 추모실 (저조도) ┤  (y10-21, x13)
├ 완화 병실 A (가정형·지속주입) ┬ 정원뷰 선룸 병실 B (유리·식물) ┤  (y23-42, x13)
└──────────────────────────┴──────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/hospice.ts` → `FIXTURES` |
| 카탈로그 hospice2 3종(HospiceBed·ComfortCart·SyringeDriver) + ADLKitchen(rehab2) | `objects/hospiceEquipment.tsx` + `HospiceObjectView`(Onco 뒤) |
| 재사용 | reclinerdaybed(picu)·fridge(onco)·watercooler/sofa/coffeetable/framedpic(er)·nursestation·deskphone·chartbinder·imonitor·glass·tint·iplant·baylabel |
| 엘리베이터 | ONCO **4F sub-선택** 첫 방(완화의료·호스피스 → INT-HOSPICE), entry `{1,8}` |
| 테스트 | `map/hospice-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ONCO 4F sub-picker 첫 번째 방 배선(노인성 질환 병동=geri는 준비 중, 다음).
- **Q2 ADLKitchen 소스** → rehab2(재활 훈련 주방). hospiceEquipment에 포함, rehab이 공유.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y9·station\|reflection x13·y22·roomA\|sunroom x13)
- [x] threshold 5 · door · 신규 4종 · 저조도 tint 2(명상실·선룸) · 정원뷰 glass · NPC 9 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ONCO 4F sub-선택 · `hospice-fixture.test.ts`(6)
- [x] tsc/jest(166/166) + 시뮬레이터(완화 병실 A HospiceBed/SyringeDriver·라운지 ADLKitchen/Fridge) 화면단위 확인

## §5. 편차
- scale 0.9 · 신규 footprint props(hospicebed 2×3·adlkitchen 3×1·comfortcart/syringedriver 1×1) · ONCO 4F sub-선택 배선 · 시나리오 라벨만.
