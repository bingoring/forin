---
artifact: business-logic-model
build-spec: departments/hospice
updated: 2026-07-18
---

# Hospice / Palliative — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 ONCO 4F sub-선택** — 4F는 완화의료·호스피스(INT-HOSPICE) + 노인성 질환 병동(INT-GERI, 다음) 병존. `ElevFloor.rooms[]` 첫 번째 방을 INT-HOSPICE로 배선, entry `{1,8}`. 두 번째 방(geri)은 현재 준비 중 → geri 구현 시 채움.
- 좌측 문(y7-9) → 가족 라운지 `{1,8}` 스폰.

## 이동 / 스폰
- playerStart `{4,8}`(가족 라운지). fixture-first(`FIXTURES['INT-HOSPICE-00001']`) → 재진입 안정([[project-elevator-transition]]).
- 가정형 따뜻한 톤(peds floor). 명상실·선룸 저조도/정원 tint. `regionAt` 최소면적. [[reference-sim-verification]]로 병실 확인.

## 마커 (라벨만)
- 5개. 대표: 지속주입 통증 조절(quest, 완화 병실 A — missionText), 통증·증상 관리(info, 케어 스테이션), 임종 돌봄·존엄 케어(info, 선룸 B).
- `scenarioId` 미연결 — 완화의료 시나리오 후 연결. 후보: 지속 피하주입 통증 조절(병실 A), 가족 정서 지지·상담(라운지/명상실), 임종 존엄 케어(선룸 B).
