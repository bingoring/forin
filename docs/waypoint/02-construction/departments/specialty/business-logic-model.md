---
artifact: business-logic-model
build-spec: departments/specialty
updated: 2026-07-18
---

# Specialty OPD — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 DX 2F** — `interior:'INT-SPECIALTY-00001'` + entry `{1,10}`. depts `['안과 · 이비인후과 · 비뇨 · 신경과']`(4개 전문과 통합 한 층).
- 좌측 문(y9-11) → 통합 접수 `{1,10}` 스폰.

## 이동 / 스폰
- playerStart `{4,10}`(통합 접수). fixture-first(`FIXTURES['INT-SPECIALTY-00001']`) → 재진입 안정([[project-elevator-transition]]).
- `regionAt` 최소면적. [[reference-sim-verification]]로 안과·ENT 진료실 확인.

## 마커 (라벨만)
- 5개. 대표: 세극등 검사 준비(quest, 안과 — missionText), 신경학적 사정 GCS·반사(quest, 신경과), 방광 초음파(info, 비뇨).
- `scenarioId` 미연결 — 전문외래 시나리오 후 연결. 후보: 세극등 검사·시력 측정(안과), 이경 처치·청력(이비인후과), 방광 초음파·요검사(비뇨), 신경학적 사정 GCS(신경과).
