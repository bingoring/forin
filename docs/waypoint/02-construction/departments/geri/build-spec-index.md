---
build-spec: departments/geri
stage: 02-construction / 05-map-engine (5g-v · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-v · Geriatric / Dementia 치매·노인성 질환 병동

| | |
|---|---|
| interior id | `INT-GERI-00001` (deptId `DEPT-GERI-00001`) |
| fixture | `mobile/src/map/fixtures/geri.ts` (`GERI_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-geri.jsx` + `interior-objects-geri2.jsx` |
| 그리드 | 28×44 · floorTheme `peds`(warm) · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (데이 커먼, ← 엘리베이터 문 앞) |

> Phase 4 · ONCO. **치매 친화(dementia-friendly).** ONCO 4F sub-선택 두 번째 방(완화의료·호스피스와 병존). 데이 커먼 배회 안전존(연속 손잡이·현실 인식 게시판) → 노인 간호 스테이션(시야 확보)·회상 라운지 → 치매 병실 A·B(초저상 침대·회상 상자).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌── 데이 커먼 · 배회 안전존 (연속 손잡이·현실인식 게시판·리클라이너) ──┐  (y1-8)
├ 노인 간호 스테이션 ┬ 회상 라운지 ┤  (y10-21, x13)
├ 치매 병실 A (초저상·회상상자) ┬ 치매 병실 B (낙상 방지) ┤  (y23-42, x13)
└──────────────────────────┴──────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 5구역 | `fixtures/geri.ts` → `FIXTURES` |
| 카탈로그 geri2 5종(LowBed·MemoryBox·OrientationBoard·GeriReclineChair·HandrailWall) | `objects/geriEquipment.tsx` + `GeriObjectView`(Hospice 뒤) |
| 재사용 | comfortcart(hospice)·coffeetable/framedpic/vitals/walltv(er)·nursestation·deskphone·chartbinder·sofa·iplant·baylabel |
| 엘리베이터 | ONCO **4F sub-선택** 두 번째 방(노인성 질환 병동 → INT-GERI), entry `{1,8}` |
| 테스트 | `map/geri-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ONCO 4F sub-picker 두 번째 방 배선(hospice 다음). 4F 완비.
- **Q2 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y9·station\|reminis x13·y22·roomA\|roomB x13)
- [x] threshold 5 · door · 신규 5종 · NPC 10 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ONCO 4F sub-선택 · `geri-fixture.test.ts`(6)
- [x] tsc/jest(172/172) + 시뮬레이터(데이 커먼 HandrailWall/OrientationBoard·치매 병실 LowBed) 화면단위 확인

## §5. 편차
- scale 0.9 · OrientationBoard SVG text(날짜)→shape · 신규 footprint props(lowbed 2×3·gerireclinechair 2×2, handrailwall/orientationboard/memorybox 비충돌) · ONCO 4F sub-선택 배선 · 시나리오 라벨만.
