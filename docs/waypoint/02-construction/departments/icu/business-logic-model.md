---
artifact: business-logic-model
build-spec: departments/icu
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Logic Model — 5g-c ICU (흐름)

## 1. 진입
- 타워 4F `interior:'INT-ICU-00001'`, `entry:{x:7,y:42}`(캠퍼스 문 안쪽).

## 2. 이동·카메라
- 공통 엔진([README](../README.md) §렌더) — scale 0.85·컬링 off·RoomMask 옅게. 유리벽 너머 환자 감시(투명 렌더).

## 3. 시나리오 배선 (마커=엔티티 속성, `hotspots: []`)
| 엔티티 | 마커 | scenarioId |
|---|---|---|
| R1 간호사(4,11) | quest "승압제 적정" | `icu-park-vent` |
| R3 간호사(18,11) | quest "동공·GCS 사정" | `icu-psychosis` |
| 허브 간호사(8,25) | quest "SBAR/ABGA" | `icu-monitor-alarm` |
| CODE BLUE 크래시카트(24,22) | urgent "CODE BLUE" | `icu-code-blue` |
| 면회 방문객(6,37) | info "면회 대기" | `icu-eol-family` |

라벨만: 필터 압력 · 떨림 감시 · RT·VENT 설정 · 투약 준비.
