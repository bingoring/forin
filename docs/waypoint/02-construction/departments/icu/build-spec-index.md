---
build-spec: departments/icu
stage: 02-construction / 05-map-engine (5g-c)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-01
---

# Build Spec — 5g-c · ICU 중환자실

| | |
|---|---|
| interior id | `INT-ICU-00001` (deptId `DEPT-ICU-00001`) |
| fixture | `mobile/src/map/fixtures/icu.ts` (`ICU_INTERIOR`) |
| SoT(핸드오프) | `interior-icu.jsx` + `interior-objects-icu2.jsx`·`interior-shared.jsx` |
| 그리드 | 34 cols × 44 rows · floorTheme `ICU` · scale **0.85** |
| playerStart | `{16,26}` (허브 open floor; 16,23은 데스크라 회피) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 아티팩트별 파일은 아래 매니페스트.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위 — 유리벽 1인실 + 중앙 허브
```
┌ Room1 ┃ Room2 ┃ Room3 ┃ Room4 ┐   유리벽(glass) 1인실 y0-17
│ VENT  ┃ CRRT  ┃ EVD   ┃ TTM   │   x0-8 ┃ x8-16 ┃ x16-24 ┃ x24-34
├──────╂───────╂──────╂────────┤   y17 유리 경계 (각 방 auto door)
│      중앙 제어 허브 (텔레메트리)      │   station y17-30 전폭
├──────┬────────┬──────────────────┤   divider y30
│ 면회   │ Dirty  │  Med·장비 보관     │   family x0-13 | dirty x13-23 | equip x23-34
└───────┴────────┴───────────────────┘
```
- **규약**: 4개 1인실 = **투명 유리벽**(허브에서 전원 감시). 벽은 정적 collision이 아니라 **glass objectCollision으로 차단**. 방 위 어두운 tint=ICU 저조도.

## §1. 분해
fixtures/icu.ts · objects/icuEquipment.tsx · sharedEquipment.tsx · ElevatorScreen(4F) · icu-fixture.test.ts.

## §4. 구현 체크리스트
- [x] 유리벽 1인실 ×4 + auto door · [x] 중앙 허브 · [x] 지원 3실 · [x] 오브젝트 배치 · [x] NPC 11 · [x] 카탈로그(9 신규) · [x] 엔티티 마커 5 시나리오 · [x] 엘리베이터 · [x] 테스트

## §5. 검증
- `tsc` 0 · `jest`(icu-fixture: 유리벽 차단 x8,8 · auto door 통행 x4,17 · ibed footprint x2,4 · playerStart hub open · 8 room 도달·threshold 통행) · `expo export` OK.
- **화면 단위 핸드오프 대조 (2026-07-01, 재검증):** 핸드오프 렌더 하네스(README §검증 프로토콜 4-b)로 ICU ground truth 렌더 →
  iOS 시뮬레이터에서 **전 8구역**(Room1 VENT·Room2 CRRT·Room3 EVD·Room4 TTM·중앙 허브·면회·Dirty·MED) 딥링크 스폰·캡처·대조.
  **결과: 오브젝트 1:1 포팅(CRRT·IVPumpTower·Ventilator·EVDStand·ICPMonitor·TTMUnit 등)·좌표·NPC·마커·바닥 팔레트(icu #E1E4EC) 모두 핸드오프와 일치.** 편차 없음.

## §7. 편차 로그
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.85 | 뷰포트 맞춤 |
| playerStart 16,23 | 16,26 | 16,23은 데스크(차단) → 허브 open floor |
| — | RoomMask 옅게 · 컬링 off | 가림/누락 방지 |

마커는 엔티티 속성(ER과 동일). 나머지 좌표·오브젝트·NPC는 `interior-icu.jsx`와 1:1.
