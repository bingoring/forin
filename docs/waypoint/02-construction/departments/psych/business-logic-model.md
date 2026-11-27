---
artifact: business-logic-model
build-spec: departments/psych
updated: 2026-07-18
---

# Inpatient Psych — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ONCO 2F** — `interior:'INT-PSYCH-00001'` + entry `{1,6}`. depts `['정신과 폐쇄 병동','정신과 외래']`(폐쇄병동 선두, 외래는 후속).
- 좌측 문(y5-6) → 이중 통제문 `{1,6}` 스폰 → 통제문 게이트(카드, sterile Th)로 병동 진입.

## 이동 / 스폰
- playerStart `{4,7}`(이중 통제문 소지품 보관). fixture-first(`FIXTURES['INT-PSYCH-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 관찰 스테이션은 x13 유리 관찰창(ObsWindow)으로 데이룸을 상시 관찰; 실제 통행은 창 상하 gap(y11/y13). `regionAt` 최소면적. [[reference-sim-verification]]로 병실·안정실 확인.

## 마커 (라벨만)
- 5개. 대표: 반입 금지품 확인(quest, 이중 통제문 — missionText), CCTV 상시 관찰(**urgent**, 안정실), 상시 관찰·라운드(info, 스테이션).
- `scenarioId` 미연결 — 정신과 시나리오 후 연결. 후보: 반입 금지품·안전 점검(통제문), 자살/자해 위험 사정·1:1 관찰(안전 병실), 격리·진정 안전(안정실), 집단 치료 참여(데이룸).
