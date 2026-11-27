---
artifact: business-logic-model
build-spec: departments/dial
updated: 2026-07-18
---

# Hemodialysis — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 DX 3F sub-선택** — 3F는 외래 주사센터(INT-INFUSION) + 인공신장실(INT-DIAL) 병존. `ElevFloor.rooms[]`의 두 번째 방을 준비 중 → **`INT-DIAL-00001`로 정식 배선**, entry `{1,8}`. 층 선택 후 부서 sub-picker에서 "인공신장실 Dialysis" 선택.
- 좌측 문(y7-9) → 접수 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(접수). fixture-first(`FIXTURES['INT-DIAL-00001']`) → 재진입 안정([[project-elevator-transition]]).
- `regionAt` 최소면적. [[reference-sim-verification]]로 투석 치료실·RO 수처리실 확인.

## 마커 (라벨만)
- 4개. 대표: 바이탈·천자(AVF) 확인(quest, 투석 치료실 — missionText), 투석 전 체중 측정(quest, 접수), 역삼투 수질 점검(info, RO 수처리실).
- `scenarioId` 미연결 — 투석 시나리오 후 연결. 후보: 투석 전 체중·바이탈·AVF 천자(치료실), 투석 전후 체중 측정(접수), RO 수질 관리(수처리실), B형간염 격리 투석(격리).
