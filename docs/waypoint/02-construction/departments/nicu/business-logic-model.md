---
artifact: business-logic-model
build-spec: departments/nicu
updated: 2026-07-18
---

# NICU — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 WOMEN 4F** — `interior:'INT-NICU-00001'` + entry `{1,6}`. 4F depts `['신생아 중환자실 NICU','소아 중환자실 PICU']`(NICU 선두).
- **층당 복수부서**: 4F는 PICU도 포함. 현재 NICU 단독 배선, PICU는 FIXTURES/딥링크(`INT-PICU-00001`). 층당 sub-dept 선택 도입 시 정식 배선 — [v16 계획 Q3](../v16-new-departments-plan.md).
- 좌측 문(y5-6) → 전실 `{1,6}` 스폰 → sterile 스크럽 게이트 통과 후 스테이션/소생/포드.

## 이동 / 스폰
- playerStart `{4,7}`(전실). fixture-first(`FIXTURES['INT-NICU-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 저조도 tint(포드 위) — NICU 특유 환경. `regionAt` 최소면적. [[reference-sim-verification]] 확인.

## 마커 (라벨만)
- 5개. 대표: 온·습도·활력 확인(quest, A 포드 — missionText), 미숙아 소생·기도(**urgent**, 소생 베이), 손위생·가운 착용(quest, 전실).
- `scenarioId` 미연결 — NICU 시나리오 후 연결. 후보: 인큐베이터 온·습도·미숙아 활력(A포드), 미숙아 소생·기도확보(소생 베이), 캥거루 케어 교육(B포드).
