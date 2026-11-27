---
artifact: business-logic-model
build-spec: departments/morgue
updated: 2026-07-18
---

# Morgue & Autopsy — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ADMIN(지원동) B1** — `interior:'INT-MORGUE-00001'` + entry `{1,6}`. depts `['영안실 · 부검실','시설팀 기계실']`. B1 지하층(lobby 아님).
- 좌측 문(y5-6) → 접수·인수인계 `{1,6}` 스폰. ADMIN 건물 완결(1F spd · 2F lounge · 3F sim · **B1 morgue**).

## 이동 / 스폰
- playerStart `{4,7}`(접수). fixture-first(`FIXTURES['INT-MORGUE-00001']`) → 재진입 안정([[project-elevator-transition]]).
- **동선**: 접수 → (냉장실 Th `{6,8}`) 냉장 보관실 → (참관실 Th `{6,25}`) 유족 참관실 / 접수 → (부검실 Th `{13,8}`) 부검실 → (기계실 Th `{14,25}`) 시설팀 기계실. 전면 저조도 Tint. `regionAt` 최소면적. [[reference-sim-verification]]로 5개 방 확인.

## 마커 (라벨만)
- 5개. 대표: 고인 신원 확인(quest, 접수 — missionText "접수 · 고인 신원 확인 후 냉장 안치 인수인계"), 검안·부검 기록(quest, 부검실), 안치·라벨 대조/고별 참관/설비 점검(info).
- `scenarioId` 미연결 — 영안·인수인계·부검 동선 시나리오 후 연결. 후보: 고인 인수인계·신원 확인 커뮤니케이션, 유족 응대·고별 안내(공감 표현), 검체·검안 기록.
