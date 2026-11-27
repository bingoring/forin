---
build-spec: departments/specialty
stage: 02-construction / 05-map-engine (5g-s · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-s · Specialty OPD 전문 외래 (안·이비인후·비뇨·신경)

| | |
|---|---|
| interior id | `INT-SPECIALTY-00001` (deptId `DEPT-SPECIALTY-00001`) |
| fixture | `mobile/src/map/fixtures/specialty.ts` (`SPECIALTY_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-specialty.jsx` + **`interior-objects-eye2.jsx`** |
| 그리드 | 28×44 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y9-11) |
| playerStart | `{4,10}` (통합 접수, ← 엘리베이터 문 앞) |

> **Phase 3 · DX 완결 부서.** 통합 접수에서 4개 전문 진료실이 갈라짐 — 안과(세극등·검안·시력) · 이비인후과(ENT 타워·이경) · 비뇨(초음파·요검사) · 신경과(EEG·신경학 검사). objects2가 부서명(eye2)과 달라 유의.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────────── 통합 접수 · 대기 ────────────┐  (y1-10)
├ 안과 (세극등·포롭터·시력표) ┬ 이비인후과 (ENT 타워·이경) ┤  (y12-22, x13)
├ 비뇨의학과 (초음파·요검사) ┬ 신경과 (EEG·신경학) ────────┤  (y24-44, x13)
└────────────────────────┴──────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/specialty.ts` → `FIXTURES` |
| 카탈로그 eye2 4종(SlitLamp·PhoropterStand·ENTTowerChair·VisionChart) | `objects/specialtyEquipment.tsx` + `SpecialtyObjectView`(Dial 뒤) |
| 재사용 | otoscope(er)·clinicReception·ultrasound(clinic)·waitingdisplay·compcart(er)·ibed·imonitor·ireception·ichair·icabinet(supply/equipment)·iplant·baylabel |
| 엘리베이터 | DX **2F**(전문 외래), entry `{1,10}` |
| 테스트 | `map/specialty-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → DX 2F 단일 배선(4개 진료실이 한 인테리어에 통합).
- **Q2 objects2 부서명 불일치** → 안과·ENT 기어가 `interior-objects-eye2.jsx`. 확인 후 포팅.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y11·eye\|ent x13·y23·uro\|neuro x13)
- [x] threshold 4 · door · 신규 4종 · NPC 11 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 DX 2F · `specialty-fixture.test.ts`(6)
- [x] tsc/jest(154/154) + 시뮬레이터(안과 SlitLamp/Phoropter/VisionChart · ENT ENTTowerChair/Otoscope) 화면단위 확인

## §5. 편차
- scale 0.9 · VisionChart SVG `<text>` 눈금표 → 감소형 shape 바 · ultrasound footprint props{1,1} 부여 · 신규 footprint props · 시나리오 라벨만.
