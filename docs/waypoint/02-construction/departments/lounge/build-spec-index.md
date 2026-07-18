---
build-spec: departments/lounge
stage: 02-construction / 05-map-engine (5g-z · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-z · Staff Lounge / Locker / Cafeteria 직원 락커·휴게실·식당

| | |
|---|---|
| interior id | `INT-LOUNGE-00001` (deptId `DEPT-LOUNGE-00001`) |
| fixture | `mobile/src/map/fixtures/lounge.ts` (`LOUNGE_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-lounge.jsx` + `interior-objects-lounge2.jsx` |
| 그리드 | 28×40 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y12-13) |
| playerStart | `{4,14}` (락커룸 A, ← 엘리베이터 문 앞) |

> Phase 5 · ADMIN. 직원 전용 amenity. 락커룸 A·B(사물함·벤치) → 의료진 휴게실(소파·자판기·당직 리클라이너) · 직원 식당(배식 라인·식탁).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌ 락커룸 A (사물함 뱅크) ┬ 락커룸 B (사물함·싱크) ┐  (y1-14, x13)
├ 의료진 휴게실 (소파·자판기·리클라이너) ╎ 직원 식당 (배식·식탁) ┤  (y16-38, x13 divider+doorway)
└──────────────────────┴──────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×40 4구역 | `fixtures/lounge.ts` → `FIXTURES` |
| 카탈로그 lounge2 4종(LockerBank·Vending·DiningTable·ServeryCounter) | `objects/loungeEquipment.tsx` + `LoungeObjectView`(Sim 뒤) |
| 재사용 | coffeemachine(infusion)·nursingrecliner(nursery)·sink(er/or)·coffeetable/sofa/walltv/watercooler/handsanitizer(er)·ichair·iplant·baylabel |
| 엘리베이터 | ADMIN **2F**(락커·휴게실·식당), entry `{1,13}` |
| 테스트 | `map/lounge-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ADMIN 2F 단일 배선.
- **Q2 분리된 반쪽(핸드오프 버그)** → lockerA\|B(x13)·lounge\|cafe(x13) 세로벽이 완전 봉쇄 → 엘리베이터 쪽(A+lounge)과 반대쪽(B+cafe)이 단절. **lounge↔cafe 도어(y27) 신설**로 전체 연결. reachability 원칙.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 4 / rooms 4 / collision(외벽·좌측문·y15·lockerA\|B x13·lounge\|cafe x13+도어)
- [x] threshold 3(휴게실·식당·lounge↔cafe 도어) · door · 신규 4종 · NPC 9 · 핫스팟 4
- [x] 디스패치 + FIXTURES + 엘리베이터 ADMIN 2F · `lounge-fixture.test.ts`(6)
- [x] tsc/jest(196/196) + 시뮬레이터(락커룸 LockerBank·휴게실 Vending·식당 DiningTable/ServeryCounter) 화면단위 확인

## §5. 편차
- scale 0.9 · lounge↔cafe 도어 신설(단절 보정) · ServeryCounter footprint props 부여 · 신규 footprint props(lockerbank 비충돌·나머지 props{w,h}) · 시나리오 라벨만.
