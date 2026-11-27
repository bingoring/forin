---
artifact: business-logic-model
build-spec: departments/spd
updated: 2026-07-18
---

# SPD / Nutrition / Loading Dock — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ADMIN(지원동) 1F** — `interior:'INT-SPD-00001'` + entry `{1,8}`, lobby 층. depts `['중앙공급실 SPD','영양팀 · 배식실','하역장']`(한 인테리어에 통합).
- 좌측 문(y7-9) → 오염 세척 구역 `{1,8}` 스폰. 우측 하역장 게이트(door)는 외부 물류(장식·향후 캠퍼스 연계).

## 이동 / 스폰
- playerStart `{4,8}`(오염 세척). fixture-first(`FIXTURES['INT-SPD-00001']`) → 재진입 안정([[project-elevator-transition]]).
- **감염관리 동선**: 오염(soiled) → 세척→멸균 sterile pass-through(`{14,5}`) → 멸균(sterile). 하역장 저조도 tint. `regionAt` 최소면적. [[reference-sim-verification]]로 멸균·하역장 확인.

## 마커 (라벨만)
- 4개. 대표: 오토클레이브·팩 검수(quest, 멸균·보관 — missionText), 기구 세척·소독 사이클(quest, 오염 세척), 물류 입·출고 검수(info, 하역장).
- `scenarioId` 미연결 — 공급·영양·물류 시나리오 후 연결. 후보: 기구 재처리 감염관리 사이클(세척/멸균), 치료식 트레이 준비·검수(영양), 물류 입출고 관리(하역장).
