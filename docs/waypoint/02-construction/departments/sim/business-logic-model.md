---
artifact: business-logic-model
build-spec: departments/sim
updated: 2026-07-18
---

# Sim Lab / Nursing Admin — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ADMIN(지원동) 3F** — `interior:'INT-SIM-00001'` + entry `{1,8}`. depts `['간호부 사무실','감염관리실','시뮬레이션 랩']`(한 인테리어에 통합).
- 좌측 문(y7-9) → 간호부 사무실 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(간호부 사무실). fixture-first(`FIXTURES['INT-SIM-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 제어실은 원웨이 미러 벽으로 시뮬랩을 관찰; 진입은 x18 벽 staff 도어(`{18,37}`). `regionAt` 최소면적. [[reference-sim-verification]]로 시뮬랩·감염관리 확인.

## 마커 (라벨만)
- 5개. 대표: 응급 시나리오 실습(quest, 시뮬레이션 랩 — missionText), PPE 착탈의 감사(quest, 감염관리실), 마네킹 시나리오 조작(info, 제어실).
- `scenarioId` 미연결 — 교육/감염관리 시나리오 후 연결. 후보: 마네킹 응급 시나리오·디브리핑(시뮬랩/디브리핑), PPE 착탈의 순서(감염관리), 근무 배치·인수인계(간호부 사무실).
