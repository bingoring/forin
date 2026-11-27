---
artifact: business-logic-model
build-spec: departments/rehab
updated: 2026-07-18
---

# Rehabilitation PT/OT — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ONCO 1F** — `interior:'INT-REHAB-00001'` + entry `{1,8}`, lobby 층. depts `['대형 재활치료실 PT/OT Gym']`. → **ONCO 건물 완비**(1F rehab·2F psych·3F onco·4F hospice+geri).
- 좌측 문(y7-9) → 재활 접수 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(재활 접수). fixture-first(`FIXTURES['INT-REHAB-00001']`) → 재진입 안정([[project-elevator-transition]]).
- **개방형 gym**: 넓은 개구부·부분 divider로 존 간 자유 이동(다구획 아님). `regionAt` 최소면적. [[reference-sim-verification]]로 보행존·ADL 확인.

## 마커 (라벨만)
- 5개. 대표: 평행봉 보행 보조(quest, 보행 훈련존 — missionText), 초기 기능 평가(quest, 접수), 부엌 일상동작 훈련(quest, OT ADL).
- `scenarioId` 미연결 — 재활 시나리오 후 연결. 후보: 뇌졸중 평행봉 보행 보조(보행존), 초기 기능·ROM 평가(접수/매트), 작업치료 ADL 부엌 훈련(OT 코너), 지구력 트레드밀 훈련(유산소).
