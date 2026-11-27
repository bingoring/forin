---
artifact: business-logic-model
build-spec: departments/picu
updated: 2026-07-18
---

# PICU — Business Logic (진입 · 이동 · 마커)

## 진입
- **WOMEN 4F는 NICU가 선점** — PICU는 현재 엘리베이터 미배선. `FIXTURES['INT-PICU-00001']`로 등록되어 딥링크(`exp://…/interior/INT-PICU-00001`)로 접근 가능.
- **정식 배선 대기**: 4F(NICU+PICU)·DX 3F(infusion+dialysis)·ONCO 4F(hospice+geri) 등 **층당 복수부서**는 ElevFloor의 sub-dept 선택 UI가 필요. 이 기능 도입 시 PICU를 4F 두 번째 항목으로 정식 배선 — [v16 계획 Q3](../v16-new-departments-plan.md), 사용자 결정 대기.
- 좌측 문(y5-6) → 전실 `{1,6}` 스폰 예정. 현재 playerStart `{4,6}`.

## 이동 / 스폰
- playerStart `{4,6}`(전실). fixture-first(`FIXTURES['INT-PICU-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 저조도 tint(방 위). 유리 격실은 슬라이딩 도어(x3/x12/x21)로 진입. `regionAt` 최소면적. [[reference-sim-verification]] 확인.

## 마커 (라벨만)
- 5개. 대표: 소아 vent·진정 사정(quest, PICU 1 — missionText), 3-방 활력 감시(quest, 허브), 가족 상주 지지(info, PICU 3).
- `scenarioId` 미연결 — PICU 시나리오 후 연결. 후보: 소아 인공호흡기 설정·진정 사정(PICU 1), 3-방 원격 활력 감시(허브), 가족 상주 지지·설명(PICU 3).
