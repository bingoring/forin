---
artifact: business-logic-model
build-spec: departments/geri
updated: 2026-07-18
---

# Geriatric / Dementia — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ONCO 4F sub-선택** — 4F는 완화의료·호스피스(INT-HOSPICE) + 노인성 질환 병동(INT-GERI) 병존. `ElevFloor.rooms[]` 두 번째 방을 INT-GERI로 배선(hospice 다음), entry `{1,8}`. → ONCO 4F 완비.
- 좌측 문(y7-9) → 데이 커먼 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(데이 커먼 = 배회 안전 루프). fixture-first(`FIXTURES['INT-GERI-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 치매 친화(연속 손잡이·현실 인식·회상 단서). `regionAt` 최소면적. [[reference-sim-verification]]로 병실 확인.

## 마커 (라벨만)
- 5개. 대표: 초저상 낙상 사정(quest, 치매 병실 A — missionText), 배회·낙상 관찰(info, 간호 스테이션), 추억 회상 요법(info, 회상 라운지).
- `scenarioId` 미연결 — 노인/치매 시나리오 후 연결. 후보: 초저상 침대 낙상 위험 사정(병실), 현실 인식 지지·배회 관리(데이커먼/스테이션), 회상 요법(회상 라운지).
