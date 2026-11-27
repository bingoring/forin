---
build-spec: departments/picu
stage: 02-construction / 05-map-engine (5g-o · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-o · PICU 소아 중환자실

| | |
|---|---|
| interior id | `INT-PICU-00001` (deptId `DEPT-PICU-00001`) |
| fixture | `mobile/src/map/fixtures/picu.ts` (`PICU_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-picu.jsx` + `interior-objects-picu2.jsx` (+ hospice2 ReclinerDaybed) |
| 그리드 | 28×44 · floorTheme `peds` · scale **0.9** · 좌측 엘리베이터 문(y5-6) · **저조도 tint** |
| playerStart | `{4,6}` (전실, ← 엘리베이터 문 앞) |

> Phase 2 · WOMEN 건물. 소아 단일환자 **유리벽 격리 격실 3개** + 중앙 모니터 허브 + 가족 상주(부모 침상 곁 상주). 유리 전면 + 슬라이딩 도어 구조.

## §2. 아티팩트 매니페스트
| domain-entities | [`domain-entities.md`](domain-entities.md) · business-rules | [`business-rules.md`](business-rules.md) · business-logic-model | [`business-logic-model.md`](business-logic-model.md) · frontend-components | [`frontend-components.md`](frontend-components.md) |
|---|

## §0. 개요
```
┌──────── 전실 · 손위생 (sterile 게이트) ────────┐  (y1-6)
├──────── 중앙 모니터 허브 (3-방 감시) ──────────┤  (y8-16)
├ PICU 1(vent·진정) ╎유리╎ PICU 2(감시) ╎유리╎ PICU 3(가족 상주) ┤  (y18-43, 유리전면+슬라이딩도어)
└─────────────────────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/picu.ts` → `FIXTURES` |
| 카탈로그 picu2 3종(PICUBed·PedVentilator·BroselowCart) + hospice2 ReclinerDaybed | `objects/picuEquipment.tsx` + `PicuObjectView`(Nicu 뒤) |
| 재사용 | bankofmonitors·crashcart·iiv·imonitor·ireception·gownbox·handsanitizer·sinkor·nursestation·deskphone·glass·door·tint·iplant·baylabel |
| 엘리베이터 | WOMEN 4F는 NICU 선점 → **FIXTURES/딥링크**(sub-선택 도입 시 정식) |
| 테스트 | `map/picu-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 4F 복수부서** → 4F=NICU+PICU, NICU 선점. PICU는 현재 `FIXTURES['INT-PICU-00001']` 딥링크로만 접근. **층당 sub-dept 선택 UI 도입 시 정식 배선**(사용자 결정 필요). deptCode 핸드오프 "5F" → 앱 4F 매핑.
- **Q2 ReclinerDaybed 소스** → picu2에 없어 hospice2에서 포팅(picuEquipment에 포함, hospice 구현 시 공유).
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y7 sterile 게이트) + y17 유리전면·슬라이딩도어·방 유리 divider(오브젝트) · tint 저조도
- [x] threshold 1 + door 3(슬라이딩) · glass 8 · 신규 4종 · NPC 6 · 핫스팟 5
- [x] 디스패치 + FIXTURES · `picu-fixture.test.ts`(6)
- [x] tsc/jest(130/130) + 시뮬레이터(PICU 1 베드·vent·broselow·유리) 확인

## §5. 편차
- scale 0.9 · PICUBed footprint 2×3·PedVent/Broselow 1×1·ReclinerDaybed 2×2 · 4F 미배선(딥링크; sub-선택 대기) · ReclinerDaybed hospice2 차용 · 시나리오 라벨만.
