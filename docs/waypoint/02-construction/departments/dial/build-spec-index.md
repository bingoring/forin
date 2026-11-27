---
build-spec: departments/dial
stage: 02-construction / 05-map-engine (5g-r · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-r · Hemodialysis Unit 인공신장실

| | |
|---|---|
| interior id | `INT-DIAL-00001` (deptId `DEPT-DIAL-00001`) |
| fixture | `mobile/src/map/fixtures/dial.ts` (`DIAL_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-dial.jsx` + `interior-objects-dial2.jsx` |
| 그리드 | 28×44 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (접수, ← 엘리베이터 문 앞) |

> Phase 3 · DX. DX 3F **sub-선택** 두 번째 부서(외래 주사센터와 병존). 접수·체중 측정 → 오픈 투석 치료실(체어+투석기 열, 중앙 간호 아일랜드) → RO 수처리실 · 격리 투석 스테이션(B형간염).

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────────── 접수 · 체중 측정 ────────────┐  (y1-8)
├──── 투석 치료실 (체어+투석기 열 · 중앙 간호 아일랜드) ────┤  (y10-33)
├──── RO 수처리실 ──┬── 격리 투석 스테이션 (B형간염) ────┤  (y35-42, x13)
└──────────────────┴────────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×44 4구역 | `fixtures/dial.ts` → `FIXTURES` |
| 카탈로그 dial2 3종(DialysisMachine·DialysisChair·ROWaterUnit) | `objects/dialEquipment.tsx` + `DialObjectView`(Endo 뒤) |
| 재사용 | nursestation·compcart·sinkor·stadiometer·wastebin·imonitor·ireception·ichair·iplant·baylabel |
| 엘리베이터 | DX **3F sub-선택** 두 번째 방(인공신장실 Dialysis → INT-DIAL), entry `{1,8}` |
| 테스트 | `map/dial-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → DX 3F sub-picker의 두 번째 방을 준비 중 → **INT-DIAL로 정식 배선**(엘리베이터 rooms[] sub-선택). 외래 주사센터(INT-INFUSION)와 3F 공유.
- **Q2 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 4 / rooms 4 / collision(외벽·좌측문·y9·y34·water\|iso x13)
- [x] threshold 3 · door · 신규 3종(체어 6·투석기 6·RO 1) · NPC 7 · 핫스팟 4
- [x] 디스패치 + FIXTURES + 엘리베이터 DX 3F rooms[1] · `dial-fixture.test.ts`(6)
- [x] tsc/jest(148/148) + 시뮬레이터(투석 치료실 체어+투석기 · RO 수처리실) 확인

## §5. 편차
- scale 0.9 · 신규 footprint props(체어 2×2·투석기 1×1·RO 2×2) · DX 3F sub-선택 배선 · 시나리오 라벨만.
