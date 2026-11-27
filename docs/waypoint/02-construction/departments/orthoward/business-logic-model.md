---
artifact: business-logic-model
build-spec: departments/orthoward
updated: 2026-07-14
---

# Ortho Ward — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 타워 6F** — `ELEVATOR_BUILDINGS.tower`의 기존 6F("정형외과 병동")에 `interior: 'INT-ORTHOWARD-00001'`, `entry: {1,15}` 추가. 이로써 타워 병동 3개 완비: **8F 내과 · 7F 외과 · 6F 정형**.
- entry `{1,15}` = 좌측 ← 캠퍼스 문 안쪽(스테이션 복도), 내과/외과 병동과 동일한 좌측-문 흐름.

## 이동 / 스폰
- playerStart `{4,15}`. fixture-first 로딩(`FIXTURES['INT-ORTHOWARD-00001']` 동기), 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙으로 각 방 정확 해석.

## 마커 (라벨만)
- 10개 standalone 핫스팟. 대표: PT 스케줄 콜(urgent, 스테이션), CMS 사정 5P(urgent, Bed C 구획증후군 — missionUrgent), 화이버글래스 깁스(quest, 석고실), 견인 추·줄 사정(quest, Bed A), 탈구 방지 교육(quest, 고관절실).
- `scenarioId` 미연결 — ortho 시나리오 콘텐츠 후 연결. 후보: CMS(5P) 구획증후군 사정(Bed C·위급), 골격 견인 관리(Bed A), 화이버글래스 캐스팅(석고실), 고관절 탈구 방지 교육(고관절실).

## 5g 병동 완결
- 내과(5g-f)·외과(5g-g)·정형(5g-h) 3병동 모두 v14/v15 기준 구현 완료. 세 병동은 동일 레이아웃 골격(28×52·좌측 문·서비스 스트립→스테이션→4인실→특수실)에 부서별 카탈로그(ward2/surg2/ortho2)만 교체.
