---
artifact: business-logic-model
build-spec: departments/lounge
updated: 2026-07-18
---

# Staff Lounge / Locker / Cafeteria — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ADMIN(지원동) 2F** — `interior:'INT-LOUNGE-00001'` + entry `{1,13}`. depts `['직원 락커룸','의료진 휴게실 · 식당']`.
- 좌측 문(y12-13) → 락커룸 A `{1,13}` 스폰.

## 이동 / 스폰
- playerStart `{4,14}`(락커룸 A). fixture-first(`FIXTURES['INT-LOUNGE-00001']`) → 재진입 안정([[project-elevator-transition]]).
- **연결 보정**: 핸드오프가 lockerA\|B·lounge\|cafe 세로벽을 전부 봉쇄해 엘리베이터 쪽(A+lounge)과 반대쪽(B+cafe)이 단절 → lounge↔cafe 도어(`{13,27}`) 신설로 전체 순환(A→lounge→cafe→B). `regionAt` 최소면적. [[reference-sim-verification]]로 락커·식당 확인.

## 마커 (라벨만)
- 4개. 대표: 근무복 환복(quest, 락커룸 A — missionText), 배식·식사(quest, 직원 식당), 교대 휴식(info, 휴게실).
- `scenarioId` 미연결 — 직원 amenity는 시나리오 후보 적음(주로 사회적 상호작용·인계 잡담). 필요 시 교대 인계/근무복 환복 절차 연결.
