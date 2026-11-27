---
build-spec: departments/rad
stage: 02-construction / 05-map-engine (5g-p · v16 신규)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-18
---

# Build Spec — 5g-p · Radiology 영상의학과

| | |
|---|---|
| interior id | `INT-RAD-00001` (deptId `DEPT-RAD-00001`) |
| fixture | `mobile/src/map/fixtures/rad.ts` (`RAD_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v16` `interior-rad.jsx` + `interior-objects-rad2.jsx` |
| 그리드 | 28×48 · floorTheme `clinical` · scale **0.9** · 좌측 엘리베이터 문(y13-15) · 판독실 저조도 |
| playerStart | `{4,14}` (중앙 복도, ← 엘리베이터 문 앞) |

> **Phase 3(DX 진단동) 착수.** 중앙 복도에서 촬영실이 갈라지는 구조. 접수·대기 + 어두운 PACS 판독실 → CT·MRI 촬영실(각 차폐 유리 제어 부스) → X-ray 촬영실.

## §2. 아티팩트 매니페스트
| [domain-entities](domain-entities.md) · [business-rules](business-rules.md) · [business-logic-model](business-logic-model.md) · [frontend-components](frontend-components.md) |
|---|

## §0. 개요
```
┌ 접수·대기 ┬ 판독실 (PACS, 저조도) ┐   (y1-9)
├──────── 중앙 복도 · 안내 ─────────┤   (입구, y11-16)
├ CT 촬영실 ╎유리제어 ┬ MRI 촬영실 ╎유리제어 ┤  (y18-27, x13)
├──────── X-ray 촬영실 ╎유리제어 ──────┤   (y29-46)
└──────────────────────────────────┘
```

## §1. 분해
| 단위 | 파일 |
|---|---|
| 픽스처 28×48 6구역 | `fixtures/rad.ts` → `FIXTURES` |
| 카탈로그 rad2 5종(CTScanner·MRIScanner·XrayUnit·ControlConsole·LeadApronRack) | `objects/radEquipment.tsx` + `RadObjectView`(Picu 뒤) |
| 재사용 | pacsviewer(ortho)·waitingdisplay/vitals(er)·handrail(ward)·ibed·imonitor·ireception·ichair·glass·tint·iplant·baylabel |
| 엘리베이터 | DX **1F**(영상의학과 lobby), entry `{1,14}` |
| 테스트 | `map/rad-fixture.test.ts`(6) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → DX 1F(lobby). 1F depts 3(영상의학과·진단검사·혈액은행) 중 rad만 구현 → 단일 interior 배선(진단검사/혈액은행은 후속; 필요 시 rooms[] sub-선택 전환).
- **Q2 시나리오** → 라벨만.

## §4. 체크리스트
- [x] regions 6 / rooms 5 / collision(외벽·좌측문·y10·checkin\|reading x13·y17·CT\|MRI x13·y28) · 판독실 tint
- [x] threshold 6 · door · glass 제어부스 3 · 신규 5종 · NPC 11 · 핫스팟 6
- [x] 디스패치 + FIXTURES + 엘리베이터 DX 1F · `rad-fixture.test.ts`(6)
- [x] tsc/jest(136/136) + 시뮬레이터(CT 갠트리·MRI 보어·X-ray·제어콘솔·납방호복) 확인

## §5. 편차
- scale 0.9 · SVG text(⚠ MAGNET ON)→shape · 스캐너 footprint props(CT 3×3·MRI 4×3·Xray 2×2·console 2×1) · DX 1F 단일 배선 · 시나리오 라벨만.
