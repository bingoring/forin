---
build-spec: departments/or
stage: 02-construction / 05-map-engine (5g-b)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-01
---

# Build Spec — 5g-b · OR 수술실 + PACU

| | |
|---|---|
| interior id | `INT-OR-00001` (deptId `DEPT-OR-00001`) |
| fixture | `mobile/src/map/fixtures/or.ts` (`OR_INTERIOR`) |
| SoT(핸드오프) | `design-handoff_v13` `interior-or.jsx` + `interior-objects-or2.jsx`·`interior-shared.jsx` (**v13**) |
| 그리드 | 40 cols × 52 rows · floorTheme `sterile` · scale **0.85** |
| playerStart | `{7,40}` (OR1 open floor) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 아티팩트별 파일은 아래 매니페스트.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위 — 3단계 청정 존
```
┌──────── 비제한 (y0-14) ────────┐
│ 보호자 대기실     │ 탈의실·락커룸   │   x0-19 | x19-40 (gap y6-8)
├────── 준제한 (y14-31) ─────────┤   divider y14
│ Pre-Op   │ Clean │              │
│ Holding  ├───────┤  PACU 회복실  │   preop x0-13 | util x13-20 | pacu x20-40
│          │ Dirty │              │   clean|dirty y22
├──── 제한·양압 (y31-51, STERILE) ─┤   divider y31 (sterile threshold)
│  OR 1    │ Scrub │   OR 2       │   or1 x0-15 | scrub x15-23 | or2 x23-40
│ 일반/정형 │       │ 복강경/로봇   │
└──────────┴───────┴──────────────┘
```
- **규약**: 청정도 상승(y14→y31)일수록 제한. 제한(OR) 진입 = **`tone:'sterile'`(파란) threshold**. OR1/OR2 바닥 초록 `tint`=양압.

## §1. 분해
fixtures/or.ts · objects/orEquipment.tsx · sharedEquipment.tsx · ElevatorScreen(3F) · or-fixture.test.ts.

## §4. 구현 체크리스트
- [x] 3단계 존 regions/collision · [x] sterile threshold · [x] 오브젝트 배치 · [x] NPC 23 · [x] 카탈로그 · [x] hotspots 시나리오 · [x] 엘리베이터 · [x] 테스트

## §5. 검증
- `tsc` 0 · `jest`(or-fixture: room 도달·sterile threshold 통행·양압존 footprint) · `expo export` OK.
- **화면 단위 핸드오프 대조 (2026-07-01, 재검증):** 핸드오프 렌더 하네스(README §검증 프로토콜 4-b)로 OR ground truth 렌더 →
  iOS 시뮬레이터에서 **전 8구역**(family·locker·preop·clean/dirty·PACU·OR1·OR2·scrub) 딥링크 스폰·캡처·대조.
  **결과: 오브젝트 1:1 포팅·좌표·NPC·마커·바닥 팔레트(sterile #D6E4EC) 모두 핸드오프와 일치.** 편차 없음.
  - 유일한 의도적 편차: 수술등 70% 크기(사용자 요청 유지, §7).

## §7. 편차 로그
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.85 | 뷰포트 맞춤 |
| — | 상호작용 = `hotspots[]`(14) | ER/ICU 엔티티-마커 미이관, 후속 후보 |

나머지 좌표·오브젝트·NPC는 `interior-or.jsx`와 1:1.
