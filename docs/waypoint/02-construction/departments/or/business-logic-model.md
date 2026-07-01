---
artifact: business-logic-model
build-spec: departments/or
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Logic Model — 5g-b OR (흐름)

## 1. 진입
- 타워 3F `interior:'INT-OR-00001'`, `entry:{x:18,y:1}`(캠퍼스 문 안쪽).

## 2. 이동·카메라
- 공통 엔진([README](../README.md) §렌더) — scale 0.85·컬링 off·RoomMask 옅게.

## 3. 시나리오 배선 — ⚠️ OR은 아직 **`hotspots[]` 배열**(엔티티 마커 미이관; ER/ICU와 다름)
| hotspot(좌표) | kind | scenarioId |
|---|---|---|
| 가족 대기(12,6) | info | `or-family-update` |
| 환자 확인·ID(3,17) | quest | `or-garcia-consent` |
| PACU 인계(22,17) | quest | `or-pacu-handoff` |
| OR1 기구 패스(7,37) | quest | `or-instrument-pass` |
| OR2 로봇 콘솔(33,43) | quest | `or-timeout` |

info(시나리오 없음): 수술복 착용·마취 면담·멸균 물품·기구 반출·오한 케어·PACU 데스크·카운트·5분 스크럽·복강경 화면.

## 4. 후속
- hotspots → 엔티티 마커(object/npc props) 이관 시 ER/ICU와 통일(business-rules 변화 없음, InteriorScreen 마커 수집만).
