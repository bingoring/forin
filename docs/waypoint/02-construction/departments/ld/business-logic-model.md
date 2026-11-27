---
artifact: business-logic-model
build-spec: departments/ld
updated: 2026-07-18
---

# L&D — Business Logic (진입 · 이동 · 마커)

## 진입 · 3F 통합
- **엘리베이터 WOMEN(여성소아 센터) 3F** — `ELEVATOR_BUILDINGS.women` 3F의 `interior`를 (Phase 1 임시) `INT-NURSERY-00001` → **`INT-LD-00001`로 교체**, entry `{1,15}`(좌측 문). depts `['가족 분만실 L&D','산후 병동','신생아실']`.
- **근거**: `interior-ld.jsx`가 3F 전체 산과 층(L&D+산후+신생아)을 한 인테리어로 통합 → 엘리베이터 3F 라벨과 정확히 일치. Phase 1의 nursery-on-3F는 임시였고, ld가 nursery 존을 포함하므로 정식 교체.
- **잔존**: `INT-NURSERY-00001`(standalone) + (미구현 시) postpartum standalone은 FIXTURES/딥링크로만 접근. 3F의 정식 경험은 INT-LD.
- **좌측 엘리베이터 문**(x0 y14-16). 도착 시 문 안쪽 `{1,15}`(중앙 스테이션 복도) 스폰.

## 이동 / 스폰
- playerStart `{4,15}`(스테이션 복도). fixture-first 로딩(`FIXTURES['INT-LD-00001']` 동기) → 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙. [[reference-sim-verification]]로 6구역 확인.

## 마커 (라벨만)
- 8개 standalone 핫스팟. 대표: 태아 심박(CTG) (quest, LDR 1 — missionText), 분만 임박 콜(**urgent**, 스테이션), 자궁수축·태동 사정(quest, OB Triage), 모유수유 교육(quest, 산후).
- `scenarioId` 미연결 — 산과 시나리오 콘텐츠 후 연결. 후보: OB 분류·CTG 판독(triage/LDR), 분만 임박 SBAR 콜(스테이션), 모유수유 교육(산후), 신생아 아프가·보온(워머).
