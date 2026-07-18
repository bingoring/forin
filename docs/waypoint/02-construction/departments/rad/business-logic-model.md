---
artifact: business-logic-model
build-spec: departments/rad
updated: 2026-07-18
---

# Radiology — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 DX(외래·진단 지원동) 1F** — `interior:'INT-RAD-00001'` + entry `{1,14}`, lobby 층. depts `['영상의학과','진단검사의학과','혈액은행']`.
- **1F 복수부서**: 진단검사의학과·혈액은행 미구현 → 현재 rad 단일 배선. 후속 구현 시 `rooms[]` sub-선택으로 전환(PACS/검사실/혈액은행) — [엘리베이터 sub-선택 DECISIONS 참조].
- 좌측 문(y13-15) → 중앙 복도 `{1,14}` 스폰.

## 이동 / 스폰
- playerStart `{4,14}`(중앙 복도 = 입구 관문). fixture-first(`FIXTURES['INT-RAD-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 판독실 저조도 tint(어두운 판독 환경). `regionAt` 최소면적. [[reference-sim-verification]]로 CT/MRI 구역 확인.

## 마커 (라벨만)
- 6개. 대표: 조영제·포지셔닝(quest, CT — missionText), 영상 판독 Read(quest, 판독실), 흉부 촬영 포지셔닝(quest, X-ray).
- `scenarioId` 미연결 — 영상의학 시나리오 후 연결. 후보: CT 조영제 주입·포지셔닝(CT), PACS 영상 판독(판독실), 흉부 X-ray 포지셔닝(X-ray), MRI 금속 안전 체크(MRI).
