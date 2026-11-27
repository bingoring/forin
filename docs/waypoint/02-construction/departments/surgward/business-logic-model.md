---
artifact: business-logic-model
build-spec: departments/surgward
updated: 2026-07-14
---

# Surgery Ward — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 타워 7F 신설** — `ELEVATOR_BUILDINGS.tower`에 `{ f:'7F', depts:['일반 외과 병동','수술 후 회복'], icon:'🩹', interior:'INT-SURGWARD-00001', entry:{1,15} }`. (층 재편: 8F=내과, **7F=외과**, 6F=정형(예정).)
- entry `{1,15}` = 좌측 ← 캠퍼스 문 안쪽(스테이션 복도). 도착 즉시 간호 스테이션 진입(내과 병동 v14와 동일한 좌측-문 흐름).

## 이동 / 스폰
- playerStart `{4,15}`. fixture-first 로딩(`FIXTURES['INT-SURGWARD-00001']` 동기), 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙으로 각 방 정확 해석.

## 마커 (라벨만)
- 10개 standalone 핫스팟. 대표: OR 인계 콜(urgent, 스테이션), 심호흡·기침 교육(quest, Bed A — missionText), 복부 드레싱 교체(quest, 처치실), 배액관 개통성 확인(quest, 중증실).
- `scenarioId` 미연결 — surg 시나리오 콘텐츠 후 연결. 후보: PCA 통증 사정+심호흡 교육(Bed A), 복부 드레싱 교체(처치실), JP/Hemovac 배액량(Bed B·중증실), NG-흡인 관리(중증실).

## 후속 (5g-h)
- **정형 병동**(`interior-orthoward.jsx`+`interior-objects-ortho2.jsx`)은 ward2+surg2(공유 가능한 것)+shared 재사용, 엘리베이터 6F 연결 예정.
