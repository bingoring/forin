---
build-spec: departments/rehab
stage: 02-construction / 05-map-engine (5g-x · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-x · Rehabilitation PT/OT Gym 대형 재활치료실

| | |
|---|---|
| interior id | `INT-REHAB-00001` (deptId `DEPT-REHAB-00001`) |
| fixture | `mobile/src/map/fixtures/rehab.ts` (`REHAB_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-rehab.jsx` + `interior-objects-rehab2.jsx` |
| 그리드 | 28×44 · floorTheme `peds` · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (재활 접수, ← 엘리베이터 문 앞) |

> **Phase 4 · ONCO 완결 부서.** 다구획이 아닌 **하나의 큰 개방형 치료 gym** — 재활 접수·평가 → 보행 훈련존(평행봉·트레드밀) · 매트 치료존 → 유산소·근력 존 · OT ADL 훈련 코너.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────── 재활 접수 · 평가 ────────┐  (y1-8)
├ 보행 훈련존 (평행봉·트레드밀) ┬ 매트 치료존 (치료매트) ┤  (y10-25, x13 부분벽)
├ 유산소·근력 존 (트레드밀·짐볼) ┬ OT ADL 훈련 (ADL키친) ┤  (y27-42, open)
└────────────────────────────┴────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역(개방형) | `fixtures/rehab.ts` → `FIXTURES` |
| 카탈로그 rehab2 5종(ParallelBars·TherapyMat·Treadmill·ShoulderPulley·GymBallRack) | `objects/rehabEquipment.tsx` + `RehabObjectView`(Psych 뒤) |
| 재사용 | adlkitchen(hospice)·walkerrack(surg)·compcart·ibed·imonitor·ireception·ichair·iplant·baylabel |
| 엘리베이터 | ONCO **1F**(재활치료실 PT/OT), entry `{1,8}` |
| 테스트 | `map/rehab-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ONCO 1F(lobby) 단일 배선. **ONCO 건물 완비**(1F rehab·2F psych·3F onco·4F hospice+geri).
- **Q2 개방형 gym** → 다구획 대신 넓은 개구부(접수↔gym 4칸 threshold)·부분 divider로 open-gym 느낌. gait\|mat 세로벽이 y26 lower threshold와 겹쳐(핸드오프 1칸 초과) → h8→h7 트림.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y9 wide·gait\|mat x13 부분·y26 gym divider)
- [x] threshold 4 · door · 신규 5종 · NPC 10 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ONCO 1F · `rehab-fixture.test.ts`(6)
- [x] tsc/jest(184/184) + 시뮬레이터(보행 훈련존 ParallelBars/Treadmill/WalkerRack·ADL 코너 ADLKitchen/GymBallRack) 화면단위 확인

## §5. 편차
- scale 0.9 · 신규 footprint props(treadmill/therapymat/gymballrack 2×1, parallelbars/shoulderpulley 비충돌) · gait\|mat 세로벽 h8→h7 트림(핸드오프 겹침) · 시나리오 라벨만.
