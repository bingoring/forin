---
build-spec: departments/womenkids-opd
stage: 02-construction / 05-map-engine (5g-l · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-l · Women & Kids OPD 소아·산부인과 외래 + 키즈광장

| | |
|---|---|
| interior id | `INT-WOMENKIDS-OPD-00001` (deptId `DEPT-WOMENKIDS-OPD-00001`) |
| fixture | `mobile/src/map/fixtures/womenkids.ts` (`WOMENKIDS_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-womenkids-opd.jsx` (신규 오브젝트는 FetalMonitor 1종=`interior-objects-ld2.jsx`, 나머지 재사용) |
| 그리드 | 28 cols × 40 rows · floorTheme `peds` · scale **0.9** · **상단 캠퍼스 문**(x12-14) |
| playerStart | `{4,8}` (로비, ↓ 캠퍼스/엘리베이터 문 앞) |

> v16 신규 20종 중 **Phase 1(재사용 quick-win)** 세 번째·완결. **기존 monolithic peds 센터(외래+병동+NICU)의 1F 외래 부분을 대체**(v16이 peds를 층별 분리: OPD→1F, 병동→2F, NICU→4F). 산부인과 외래 + 초음파실을 새로 추가. 신규 오브젝트 FetalMonitor 1종뿐 — 최다 재사용.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌──────── 로비 · 접수 · 계측 (clinic접수·아기저울·신장계·정수기·대기의자) ────────┐  (y1-8)
├─ 키즈 놀이광장 (놀이매트·미끄럼틀·목마·블록·완구함·벽화) ─┬─ 소아청소년과 외래 ─┤  (y10-23, x13 divider)
├──── 산부인과 외래 (산전 진찰 베드·태아모니터) ─┬── 초음파실 (초음파 카트) ──────┤  (y25-38, x14 divider)
└──────────────────────────────────────────────────────────────────┘
```
- **여성소아 외래**: 접수·성장 계측 → 놀이 대기 → 소아 진찰/성장상담 → 산전 진찰·태아 초음파.

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×40 레이아웃·엔티티·NPC | `fixtures/womenkids.ts` (신규) → `FIXTURES` |
| 카탈로그 | FetalMonitor 1(ld2) | `objects/womenkidsEquipment.tsx` (신규) + `WomenKidsObjectView` |
| 재사용 | clinicReception(clinic)·ultrasound(clinic)·babyscale/stadiometer/tonguejar/stickerroll/smallslide/rockinghorse/toychest/blocks/mural/playmat(peds)·watercooler(er)·ibed/ireception/ichair/imonitor/iplant/baylabel | 기존 |
| 디스패치 | `WomenKidsObjectView` 체인 추가(Nursery 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | WOMEN **1F**을 `INT-PEDS`→`INT-WOMENKIDS-OPD`로 **교체**, entry `{13,1}`(상단 문) | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·footprint | `map/womenkids-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 peds 교체** → 사용자 지시("핸드오프상 peds를 대체하는 게 womenkids-opd면 대체"). v16 핸드오프가 monolithic peds 센터를 층별 분리(OPD/병동/NICU)하므로 **WOMEN 1F = womenkids-opd**로 교체. `INT-PEDS`는 FIXTURES 잔존(병동→2F·NICU→4F가 Phase 2에서 정식화될 때까지 딥링크 가능). 피부과 2F 교체 선례.
- **Q2 신규 오브젝트** → FetalMonitor 1종만 신규(ld2), 나머지 peds/clinic/shared 재사용.
- **Q3 시나리오** → 라벨만.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·상단문·y9 divider(2 th)·x13·y24 divider(2 th)·x14)
- [x] threshold 4(→놀이·→소아외래·→산부인과·→초음파) · door(↓ 캠퍼스, 상단)
- [x] 신규 `womenkidsEquipment.tsx`(1종: FetalMonitor)
- [x] NPC 캐스트 12 + 마커(핫스팟 5)
- [x] `WomenKidsObjectView` 디스패치 + `FIXTURES` + 엘리베이터 WOMEN 1F 교체
- [x] `womenkids-fixture.test.ts`(6)
- [x] tsc/jest(112/112) + 시뮬레이터 5구역(로비·놀이·소아외래·산부인과·초음파) 확인

## §5. 편차
- scale 0.9 · SVG text(FHR "142")→shape · FetalMonitor footprint 2×2 · WOMEN 1F 인테리어 교체(peds→womenkids-opd, peds ward/NICU는 Phase 2 2F/4F에서 복원) · 시나리오 라벨만.
