---
artifact: business-logic-model
build-spec: departments/infusion
updated: 2026-07-18
---

# Infusion Center — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 DX(외래·진단 지원동) 3F** — `ELEVATOR_BUILDINGS.dx`의 3F에 `interior:'INT-INFUSION-00001'` + entry `{1,6}` 배선. depts는 `['외래 주사센터','인공신장실 Dialysis']`(주사센터 선두 → 티커/딥링크 dept 정합).
- **좌측 엘리베이터 문**(x0 y5-6, "← 엘리베이터") — 병동 3종과 동형(좌측 문). 도착 시 문 안쪽 `{1,6}` 스폰 → 우측/아래로 접수·베이·격리·스테이션.
- **층당 복수부서**: 3F는 인공신장실도 포함. 현재는 infusion 단독 배선. Dialysis(`INT-DIAL-00001`) 구현 시 ElevFloor에 sub-dept 선택(별도 interior id) 도입 — [v16 계획 Q3](../v16-new-departments-plan.md).

## 이동 / 스폰
- playerStart `{4,7}`(접수 통로). fixture-first 로딩(`FIXTURES['INT-INFUSION-00001']` 동기) → 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙으로 각 존 정확 해석([[reference-sim-verification]]로 5구역 확인).

## 마커 (라벨만)
- 5개 standalone 핫스팟. 대표: 주입 속도·부작용(quest, 오픈 베이 — missionText), 아나필락시스 관찰(**urgent**, 격리실), 예약·약품 대조(quest, 접수).
- `scenarioId` 미연결 — 항암/수액 시나리오 콘텐츠 후 연결. 후보: 항암 주입 속도·부작용 사정(오픈 베이), 아나필락시스 응급 대응(격리실), 당일 약품 예약 대조(접수).
