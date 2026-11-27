---
build-spec: departments/ld
stage: 02-construction / 05-map-engine (5g-m · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-m · Labor & Delivery (여성소아 3F 통합 산과 층)

| | |
|---|---|
| interior id | `INT-LD-00001` (deptId `DEPT-LD-00001`) |
| fixture | `mobile/src/map/fixtures/ld.ts` (`LD_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-ld.jsx` + `interior-objects-ld2.jsx` |
| 그리드 | 28 cols × 50 rows · floorTheme `peds` · scale **0.9** · **좌측 엘리베이터 문**(y14-16) |
| playerStart | `{4,15}` (중앙 스테이션 복도, ← 엘리베이터 문 앞) |

> **Phase 2(WOMEN 건물) 착수.** `interior-ld.jsx`는 3F 전체 산과 층을 **하나의 인테리어로 통합**(OB 분류 · 무통 준비 · 중앙 스테이션 · LDR 분만실 · 산후 모아동실 · 유리 신생아실) — 엘리베이터 3F 라벨("가족 분만실 L&D · 산후 병동 · 신생아실")과 정확히 일치. 따라서 **ld = 3F**이며 standalone postpartum/nursery는 이 층에서 subsume됨.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌ OB 분류(Triage) ┬ 무통·마취 준비 ┐            (서비스 스트립, y1-9)
├──────── 중앙 간호 스테이션 · 복도 ─────┤       (입구 관문, y11-19)
├ LDR 1(분만) ┬ LDR 2(분만) ┬ 신생아 워머 ┤     (y21-34, 커튼 분할)
├──── 산후 모아동실 ──╎유리╎── 신생아실 ────┤   (y36-48, x14 glass)
└─────────────────────┴──────────────────┘
```
- **가족 분만 흐름**: OB 분류(자궁수축·CTG) → 무통 준비 → 스테이션 조율 → LDR 진통·분만 → 산후 모아동실(모유수유) → 유리 신생아실.

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×50 6구역·엔티티·NPC | `fixtures/ld.ts` (신규) → `FIXTURES` |
| L&D 카탈로그 | ld2 잔여 2종(BirthingBed·DeliveryCart) | `objects/ldEquipment.tsx` (신규) + `LdObjectView` |
| 재사용(ld2) | Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet(nursery)·FetalMonitor(womenkids) | 기존 |
| 재사용(교차) | vitals·chartbinder·compcart(er)·handrail(ward)·nursestation·deskphone·icabinet·ireception·iiv·imonitor·ibed·icurtain·glass·sinkor·iplant·baylabel | 기존 |
| 디스패치 | `LdObjectView` 체인 추가(WomenKids 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | WOMEN **3F**을 `INT-NURSERY`(임시)→`INT-LD`로 교체, entry `{1,15}` | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·유리 차단·footprint | `map/ld-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 3F 인테리어** → `interior-ld.jsx`(통합 산과 층)를 3F로 배선. Phase 1에서 임시로 3F에 걸었던 `INT-NURSERY`를 **INT-LD로 교체**(ld가 nursery 존을 포함). `INT-NURSERY`는 standalone으로 FIXTURES 잔존(딥링크).
- **Q2 postpartum/nursery 중복** → ld.jsx가 두 존을 이미 포함하므로 standalone postpartum은 3F에서 **미배선**(subsumed). 필요 시 별도 층/딥링크로 후속.
- **Q3 시나리오** → 라벨만.

## §4. 구현 체크리스트
- [x] regions 6 / rooms 6 / collision(외벽·좌측문·y10 서비스·triage\|anes x13·y20 station\|ldr·y35 ldr\|lower·x14 wall+glass)
- [x] threshold 7(복도×2·triage·ldr×2·산후·신생아실 sterile) · door(← 엘리베이터) · glass 신생아실 divider
- [x] 신규 `ldEquipment.tsx`(2종: BirthingBed·DeliveryCart)
- [x] NPC 캐스트 13 + 마커(핫스팟 8)
- [x] `LdObjectView` 디스패치 + `FIXTURES` + 엘리베이터 WOMEN 3F 교체
- [x] `ld-fixture.test.ts`(6)
- [x] tsc/jest(118/118) + 시뮬레이터 6구역(분류·마취·스테이션·LDR·산후·신생아) 확인

## §5. 편차
- scale 0.9 · BirthingBed footprint 3×2 · DeliveryCart 2×1 · 3F INT-NURSERY→INT-LD 교체(nursery는 standalone 잔존) · standalone postpartum 미배선(ld 존이 대체) · 시나리오 라벨만.
