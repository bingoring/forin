---
artifact: business-logic-model
build-spec: departments/onco
updated: 2026-07-18
---

# Oncology / BMT — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ONCO(암센터) 3F** — `interior:'INT-ONCO-00001'` + entry `{1,15}`. depts `['종양학 병동','조혈모세포 이식실 BMT']`.
- 좌측 문(y14-16) → 중앙 스테이션 복도 `{1,15}` 스폰.

## 이동 / 스폰
- playerStart `{4,15}`(스테이션 복도 = 입구 관문). fixture-first(`FIXTURES['INT-ONCO-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 무균 BMT 동선: 항암 주입 베이 → 전실(양압 게이트 `{4,34}` sterile) → 에어록(`{8,37}` sterile) → BMT 이식실. `regionAt` 최소면적. [[reference-sim-verification]]로 주입 베이·BMT 확인.

## 봉인 방 도달성 보정 (핸드오프 버그)
- 핸드오프가 ① 전실 진입 Th를 x8(ante\|bmt 경계 열)에 두어 anteroom 봉인, ② BMT 이식실 2를 유리로 완전 봉인.
- 임상 무균 동선에 맞춰 **전실 게이트를 ante 폭(x4)으로 이동** + **BMT room1↔room2 유리에 sterile 도어(y43) 신설**. reachability 원칙 우선(nursery 선례).

## 마커 (라벨만)
- 6개. 대표: 주입 속도·부작용 관찰(quest, 항암 주입 베이 — missionText), 항암제 이중 확인(quest, 조제 확인), 이식·생착 모니터(info, BMT).
- `scenarioId` 미연결 — 종양/이식 시나리오 후 연결. 후보: 항암제 이중확인·투여(조제확인/주입베이), 무균 방호·양압 관리(전실), 조혈모세포 이식 생착 모니터(BMT), 가족 완화 상담(상담실).
