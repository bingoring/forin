---
artifact: business-logic-model
build-spec: departments/dermcenter
updated: 2026-07-15
---

# Derm Center — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 타워 2F** — `ELEVATOR_BUILDINGS.tower`의 2F를 경량 클리닉엔진 `CLINIC-IM-00001`에서 **`INT-DERM-00001`(피부과 센터 정식 인테리어)로 교체**. depts 라벨 "피부과 센터 · 피부 병변·광선·레이저", entry `{14,1}`.
- **상단 캠퍼스 문**(x13-15 y0, "↓ 캠퍼스로") — 병동(좌측 문)과 달리 상단. 엘리베이터 도착 시 로비 상단(문 안쪽 `{14,1}`)에 스폰 → 아래로 진료실/광선/레이저.

## 이동 / 스폰
- playerStart `{14,11}`(로비). fixture-first 로딩(`FIXTURES['INT-DERM-00001']` 동기), 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙으로 각 방 정확 해석.

## 마커 (라벨만)
- 6개 standalone 핫스팟. 대표: 점 ABCD 사정(quest, 제1진료실 — missionText), UV 강도·시간 세팅(quest, 광선치료실), 펀치 생검 처치(quest, 레이저 처치실), 발진 히스토리 문진(quest, 접수).
- `scenarioId` 미연결 — derm 시나리오 콘텐츠 후 연결. 후보: 병변 ABCD 분류(제1진료실), UVB 광선 조사량 세팅(광선치료), 펀치 생검 처치 보조(레이저).

## 외래 클리닉 정리
- 기존 경량 `CLINIC-IM/GS/OS/DM`(외래 클리닉 엔진, v8 redundant 판정)은 FIXTURES에 잔존하나 엘리베이터에서 미노출. 피부과는 본 센터로 정식화. 내과/외과/정형 외래는 필요 시 후속 정식 인테리어화.
