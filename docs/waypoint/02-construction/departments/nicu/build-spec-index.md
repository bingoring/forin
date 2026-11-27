---
build-spec: departments/nicu
stage: 02-construction / 05-map-engine (5g-n · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-n · NICU 신생아 중환자실

| | |
|---|---|
| interior id | `INT-NICU-00001` (deptId `DEPT-NICU-00001`) |
| fixture | `mobile/src/map/fixtures/nicu.ts` (`NICU_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-nicu.jsx` + `interior-objects-nicu2.jsx` |
| 그리드 | 28×44 · floorTheme `peds` · scale **0.9** · 좌측 엘리베이터 문(y5-6) · **저조도 tint** |
| playerStart | `{4,7}` (전실, ← 엘리베이터 문 앞) |

> Phase 2 · WOMEN 건물. 개방형 Nursery와 달리 **폐쇄형 인큐베이터 집중치료**. 전실 스크럽 게이트(엄격 감염관리) → 중앙 모니터 스테이션 · 신생아 소생 베이 → A 포드(인큐베이터) · B 포드(캥거루 케어, 유리 분리).

## §2. 아티팩트 매니페스트
| domain-entities | [`domain-entities.md`](domain-entities.md) · business-rules | [`business-rules.md`](business-rules.md) · business-logic-model | [`business-logic-model.md`](business-logic-model.md) · frontend-components | [`frontend-components.md`](frontend-components.md) |
|---|

## §0. 개요
```
┌──────── NICU 전실 · 스크럽 (sterile 게이트) ────────┐  (y1-7)
├──── 중앙 모니터 스테이션 ──┬── 신생아 소생 베이 ────┤  (y9-20, x13)
├─ A 포드 (인큐베이터·CPAP·광선) ╎유리╎ B 포드 (캥거루) ┤  (y22-43, x13 glass, 저조도)
└────────────────────────────┴───────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/nicu.ts` → `FIXTURES` |
| 카탈로그 nicu2 4종(NICUIsolette·GiraffeWarmer·CPAPUnit·PhototherapyLED) | `objects/nicuEquipment.tsx` + `NicuObjectView`(Ld 뒤) |
| 재사용 | bankofmonitors·crashcart·milkfridge·nursingrecliner·gownbox·scrubdispenser·handsanitizer·sinkor·nursestation·deskphone·imonitor·glass·tint·iplant·baylabel |
| 엘리베이터 | WOMEN **4F**(NICU 선두 배선), entry `{1,6}` |
| 테스트 | `map/nicu-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 4F 복수부서** → 4F=NICU+PICU. NICU 선두 배선(entry {1,6}); PICU는 FIXTURES/딥링크(층당 sub-선택 도입 시 정식). deptCode 핸드오프 "6F"는 앱 엘리베이터 4F에 매핑.
- **Q2 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y8 sterile 게이트·station\|resus x13+threshold·y21 pods·pod glass) · tint 저조도
- [x] threshold 4 · door · glass 포드 divider · 신규 4종 · NPC 8 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 4F · `nicu-fixture.test.ts`(6)
- [x] tsc/jest(130/130) + 시뮬레이터(A포드 인큐베이터·소생 베이 기린워머) 확인

## §5. 편차
- scale 0.9 · SVG text(온·습도)→shape · NICUIsolette/GiraffeWarmer footprint 2×2·CPAP 1×1 · PhototherapyLED 오버헤드(비충돌) · 4F NICU 단독 배선(PICU 딥링크) · 시나리오 라벨만.
