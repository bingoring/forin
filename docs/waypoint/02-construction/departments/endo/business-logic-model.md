---
artifact: business-logic-model
build-spec: departments/endo
updated: 2026-07-18
---

# Endoscopy — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 DX 4F** — `interior:'INT-ENDO-00001'` + entry `{1,8}`. depts `['내시경실','심혈관 조영실 Cath','인터벤션 IR']`(내시경실 선두).
- **4F 복수부서**: Cath·IR 미구현 → 현재 endo 단일 배선. 후속 구현 시 `rooms[]` sub-선택 전환.
- 좌측 문(y7-9) → 접수 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(접수). fixture-first(`FIXTURES['INT-ENDO-00001']`) → 재진입 안정([[project-elevator-transition]]).
- `regionAt` 최소면적. [[reference-sim-verification]]로 시술실·재처리실 확인.

## 마커 (라벨만)
- 5개. 대표: 진정 모니터·스코프(quest, 시술실 1 — missionText), 금식(NPO) 확인(quest, 접수), 내시경 재처리 AER(info, 재처리실).
- `scenarioId` 미연결 — 내시경 시나리오 후 연결. 후보: 상부 위내시경 진정 모니터링(시술실 1), NPO 금식 확인(접수), 내시경 재처리 감염관리(재처리실).
