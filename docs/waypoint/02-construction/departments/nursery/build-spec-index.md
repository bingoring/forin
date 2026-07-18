---
build-spec: departments/nursery
stage: 02-construction / 05-map-engine (5g-k · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-k · Well-Baby Nursery 신생아실

| | |
|---|---|
| interior id | `INT-NURSERY-00001` (deptId `DEPT-NURSERY-00001`) |
| fixture | `mobile/src/map/fixtures/nursery.ts` (`NURSERY_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-nursery.jsx` (오브젝트는 `interior-objects-ld2.jsx` + `interior-objects-psych2.jsx` 재사용, 전용 objects2 **없음**) |
| 그리드 | 28 cols × 42 rows · floorTheme `peds` · scale **0.9** · **좌측 엘리베이터 문**(y5-6) |
| playerStart | `{4,7}` (손위생 입구, ← 엘리베이터 문 앞) |

> v16 신규 20종 중 **Phase 1(재사용 quick-win)** 두 번째. NICU(중환자)와 구분되는 정상 신생아실. 전용 objects2 부재 → **L&D 카탈로그(ld2)** 4종 + psych ObsWindow 1종만 신규 포팅, 나머지는 peds/or/icu/er/shared 재사용.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌──────── 손위생 · 가운 착의 (싱크·스크럽·가운·워머캐비닛·데스크) ────────┐  (y1-7)
├─ 신생아실 배시넷 존 (배시넷×10 + 컴퓨터카트) ──┬─ 신생아 사정·워머 ─────┤  (y9-26, x18 divider·doorway)
├──── 수유·모유 수유실 (수유리클라이너×3·밀크냉장·커튼) ─┬─ 면회 관람창 ──┤  (y28-40, x13 divider·doorway, ObsWindow)
└──────────────────────────────────────────────────────────────────┘
```
- **정상 신생아 케어**: 손위생 게이트(sterile) → 배시넷 활력징후 라운드 → 입원 사정·계측(워머·저울·광선) → 모유 수유 + 가족 면회(관람창).

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×42 레이아웃·엔티티·NPC | `fixtures/nursery.ts` (신규) → `FIXTURES` |
| Nursery 카탈로그 | ld2 4(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet) + psych2 ObsWindow 1 | `objects/nurseryEquipment.tsx` (신규) + `NurseryObjectView` |
| 재사용 | sinkor(shared)·scrubdispenser(or)·gownbox(icu)·babyscale/phototherapy/milkfridge(peds)·compcart(er)·sofa/coffeetable·ireception·ichair·icurtain·iplant·baylabel | 기존 |
| 디스패치 | `NurseryObjectView` 체인 추가(Infusion 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | WOMEN(여성소아) **3F**(신생아실 선두), entry `{1,6}`(좌측 문) | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·ObsWindow 차단·footprint | `map/nursery-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → 엘리베이터 **WOMEN 3F**(신생아실 선두 배선, entry `{1,6}`); 3F는 L&D·산후·신생아실 3부서 → 현재 nursery 배선. L&D/산후 구현(Phase 2) 시 층당 sub-선택 도입.
- **Q2 전용 objects2 부재** → ld2(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet) + psych2(ObsWindow) 포팅. L&D 구현 시 동일 컴포넌트 공유.
- **Q3 봉인된 방(핸드오프 버그)** → admit(사정 워머)·viewing(관람창)이 핸드오프에서 **개구부 없이 완전 봉인**(x18·x13 divider 전벽) → 도달 불가. 임상 동선(신생아 nursery↔admit / 가족 feeding↔viewing)에 맞춰 **doorway 2개 추가**(reachability 원칙).
- **Q4 시나리오** → 라벨만.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y8 sterile게이트·x18 divider+doorway·y27 divider+ObsWindow·x13 divider+doorway)
- [x] threshold 4(손위생게이트 sterile·→수유실·→사정워머·→관람창) · door(← 엘리베이터)
- [x] 신규 `nurseryEquipment.tsx`(5종: Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet·ObsWindow)
- [x] NPC 캐스트 9 + 마커(핫스팟 5)
- [x] `NurseryObjectView` 디스패치 + `FIXTURES` + 엘리베이터 WOMEN 3F
- [x] `nursery-fixture.test.ts`(6)
- [x] tsc/jest(106/106) + 시뮬레이터 5구역(입구·배시넷·워머·수유·관람창) 확인

## §5. 편차
- scale 0.9 · **doorway 2개 추가**(핸드오프 봉인 방 도달성 확보 — §3 Q3) · Bassinet/InfantWarmer/NursingRecliner footprint `2×2`(시각보다 축소, 통로 확보) · 3F 라벨 순서 변경(신생아실 선두) · 시나리오 라벨만.
