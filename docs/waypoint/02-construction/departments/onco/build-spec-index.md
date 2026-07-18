---
build-spec: departments/onco
stage: 02-construction / 05-map-engine (5g-t · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-t · Oncology / BMT 종양학 · 조혈모세포 이식실

| | |
|---|---|
| interior id | `INT-ONCO-00001` (deptId `DEPT-ONCO-00001`) |
| fixture | `mobile/src/map/fixtures/onco.ts` (`ONCO_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-onco.jsx` + `interior-objects-onco2.jsx` |
| 그리드 | 28×50 · floorTheme `internal` · scale **0.9** · 좌측 엘리베이터 문(y14-16) |
| playerStart | `{4,15}` (중앙 스테이션 복도, ← 엘리베이터 문 앞) |

> **Phase 4(ONCO 암센터) 착수.** 약물 조제 확인 · 상담실 → 중앙 간호 스테이션 → 개방형 항암 주입 베이(리클라이너) → BMT 전실 · 양압 무균 이식실 2(유리 격리).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌ 약물 조제 확인 ┬ 상담실 (Quiet) ┐   (서비스, y1-9)
├──── 중앙 간호 스테이션 ─────────┤   (입구, y11-18)
├──── 항암 주입 베이 (리클라이너) ─┤   (개방형, y20-33)
├ BMT 전실 ╎유리·에어록╎ BMT 이식실 1·2 ┤ (양압 격리, y35-48)
└──────────┴────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×50 6구역 | `fixtures/onco.ts` → `FIXTURES` |
| 카탈로그 onco2 잔여 2종(BMTPod·ChemoHazardBin) + Fridge(peds) | `objects/oncoEquipment.tsx` + `OncoObjectView`(Specialty 뒤) |
| 재사용(onco2) | infusionchair·smartinfusionpump·ppestation(infusionEquipment) |
| 재사용(교차) | warmercabinet(nursery)·ichem er(chartbinder·compcart·deskphone·framedpic·sofa·coffeetable·watercooler·walltv·handsanitizer)·handrail(ward)·nursestation·sinkor·ibed·icabinet·imonitor·ireception·glass·iplant·baylabel |
| 엘리베이터 | ONCO **3F**(종양학·BMT), entry `{1,15}` |
| 테스트 | `map/onco-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ONCO 3F 단일 배선.
- **Q2 봉인 방(핸드오프 버그)** → ① 전실 진입 Th가 x8(ante\|bmt 경계 열)에 있어 anteroom 봉인 → **x4로 이동**(ante 폭 내). ② BMT 이식실 2가 유리로 완전 봉인 → **room1↔room2 유리에 sterile 도어 신설**(y43). reachability 원칙.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 6 / rooms 6 / collision(외벽·좌측문·y10·verify\|quiet x13·y19·y34 전실게이트·ante\|bmt 에어록)
- [x] threshold 7(복도×2·quiet·infusion×2·전실·에어록·bmt2 도어) · door · glass 3(에어록·room divider 2편) · 신규 3종 · NPC 11 · 핫스팟 6
- [x] 디스패치 + FIXTURES + 엘리베이터 ONCO 3F · `onco-fixture.test.ts`(6)
- [x] tsc/jest(160/160) + 시뮬레이터(주입 베이·BMT 이식실 HEPA헤더·조제확인 Fridge/ChemoHazardBin) 화면단위 확인

## §5. 편차
- scale 0.9 · SVG text(HEPA/CHEMO/VAX)→shape · **봉인 방 2건 도달성 보정**(전실 게이트 이동 + BMT2 도어) · BMTPod/ChemoHazardBin 비충돌·Fridge props · 시나리오 라벨만.
