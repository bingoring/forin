---
build-spec: departments/sim
stage: 02-construction / 05-map-engine (5g-y · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-y · Sim Lab / Nursing Admin 간호부·감염관리·시뮬레이션 랩

| | |
|---|---|
| interior id | `INT-SIM-00001` (deptId `DEPT-SIM-00001`) |
| fixture | `mobile/src/map/fixtures/sim.ts` (`SIM_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-sim.jsx` + `interior-objects-sim2.jsx` |
| 그리드 | 28×42 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y7-9) |
| playerStart | `{4,8}` (간호부 사무실, ← 엘리베이터 문 앞) |

> **Phase 5(ADMIN 지원동) 착수.** 행정+교육 back-of-house. 간호부 총괄 사무실 → 감염관리실(PPE 착탈의)·디브리핑 강의실 → 시뮬레이션 랩(마네킹)·원웨이 미러 제어실.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌──────── 간호부 총괄 사무실 (오피스 데스크·인사 캐비닛) ────────┐  (y1-10)
├ 감염관리실 (PPE 보드·착탈의) ┬ 디브리핑 강의실 (세미나·WallTV) ┤  (y12-23, x13)
├ 시뮬레이션 랩 (마네킹·크래시카트) ╎원웨이미러╎ 제어실 (콘솔) ┤  (y25-40, x18)
└────────────────────────────┴────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×42 5구역 | `fixtures/sim.ts` → `FIXTURES` |
| 카탈로그 sim2 4종(SimManikin·ControlBooth·OfficeDesk·PPEBoard) | `objects/simEquipment.tsx` + `SimObjectView`(Rehab 뒤) |
| 재사용 | icabinet(supply)·shelflabel·watercooler·gownbox·scrubdispenser·waste·walltv·coffeetable·ichair·imonitor·crashcart·ivpump·ventilator·iplant·baylabel |
| 엘리베이터 | ADMIN **3F**(간호부·감염관리·시뮬랩), entry `{1,8}` |
| 테스트 | `map/sim-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → ADMIN 3F 단일 배선.
- **Q2 봉인 제어실(핸드오프 버그)** → 제어실이 원웨이 미러 벽(x18)+y24 벽으로 완전 봉인 → **x18 벽에 staff 도어(y37) 신설**(관찰 미러 옆 진입). reachability 원칙.
- **Q3 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·y11·infection\|debrief x13·y24·sim\|booth x18+staff도어)
- [x] threshold 4(감염관리·강의실·시뮬랩·제어실) · door · 신규 4종 · NPC 10 · 핫스팟 5
- [x] 디스패치 + FIXTURES + 엘리베이터 ADMIN 3F · `sim-fixture.test.ts`(6)
- [x] tsc/jest(190/190) + 시뮬레이터(시뮬랩 SimManikin·간호부 OfficeDesk·감염관리 PPEBoard) 화면단위 확인

## §5. 편차
- scale 0.9 · PPEBoard SVG text(단계 번호)→shape · 제어실 staff 도어 신설(봉인 보정) · 신규 footprint props(simmanikin 2×3·officedesk 2×1, ppeboard/controlbooth 비충돌) · 시나리오 라벨만.
