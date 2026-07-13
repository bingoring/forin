---
artifact: business-logic-model
build-spec: departments/ward
updated: 2026-07-13
---

# Ward — Business Logic (진입 · 이동 · 마커)

## 진입 (Q2)
- **엘리베이터 타워 8F** — `ELEVATOR_BUILDINGS.tower`의 기존 8F("일반 내과 병동 · 외과 병동 · 정형외과 병동")에 `interior: 'INT-WARD-00001'`, `entry: {1,15}` 추가. (외과·정형은 후속 부서 — 8F는 당분간 내과 병동으로 진입.)
- **v14**: 캠퍼스 문이 좌측(x0 y14-16 "← 캠퍼스로")으로 이동 → **entry는 좌측 문 안쪽 `{1,15}`**(스테이션 복도). 도착 즉시 간호 스테이션에 진입(이전 하단 문 대비 자연스러움).

## 이동 / 스폰
- 기본 playerStart `{13,14}`(간호 스테이션). 엘리베이터 도착 `{12,50}`(1인실 하단).
- fixture-first 로딩(`FIXTURES['INT-WARD-00001']` 동기) — 서버 왕복 없음, 엘리베이터 재진입 안정([[project-elevator-transition]] StaticWorld+1프레임 지연 마운트).
- 룸 포커스 마스크: `regionAt` **최소면적 규칙**으로 서비스 스트립/1인실/격리 등 겹침 구역도 항상 실제 방으로 해석(순서 무관).

## 마커 (라벨만, Q3)
- 11개 standalone 핫스팟(`interior.hotspots`, kind quest/info/urgent). 대표: Critical Value 콜(urgent, 스테이션), 식전 혈당 BST(quest, Bed B — missionText), 가운·장갑 착용(quest, 격리 카트), 수액 라벨 출력(quest, clean utility).
- `scenarioId` 미연결 — A 눌러도 no-op(ward 시나리오 콘텐츠 후 연결). 후보: BST+투약(Bed B), 접촉격리 가운(VRE), 수액 준비/라벨(clean utility), Critical Value 보고(스테이션).

## 후속 (5g-g/h)
- **외과 병동**(`interior-surgward.jsx`+`interior-objects-surg2.jsx`) / **정형 병동**(`interior-orthoward.jsx`+`interior-objects-ortho2.jsx`)은 이 카탈로그(ward2)+shared 재사용. 엘리베이터 8F/6F에 각 interior 연결 예정.
