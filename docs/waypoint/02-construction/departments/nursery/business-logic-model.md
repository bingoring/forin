---
artifact: business-logic-model
build-spec: departments/nursery
updated: 2026-07-18
---

# Nursery — Business Logic (진입 · 이동 · 마커)

## 진입
- **엘리베이터 WOMEN(여성소아 센터) 3F** — `ELEVATOR_BUILDINGS.women`의 3F에 `interior:'INT-NURSERY-00001'` + entry `{1,6}` 배선. depts는 `['신생아실','가족 분만실 L&D','산후 병동']`(신생아실 선두 → 티커/딥링크 정합).
- **좌측 엘리베이터 문**(x0 y5-6). 도착 시 문 안쪽 `{1,6}` 스폰 → 손위생 게이트(sterile) 통과 후 배시넷/워머/수유/관람창.
- **층당 복수부서**: 3F는 L&D·산후 병동도 포함. 현재 nursery 단독 배선. L&D(`INT-LD-00001`)·산후(`INT-POSTPARTUM-00001`) 구현(Phase 2) 시 ElevFloor sub-dept 선택 도입 — [v16 계획 Q3](../v16-new-departments-plan.md).

## 이동 / 스폰
- playerStart `{4,7}`(손위생 입구). fixture-first 로딩(`FIXTURES['INT-NURSERY-00001']` 동기) → 엘리베이터 재진입 안정([[project-elevator-transition]]).
- 룸 포커스 마스크: `regionAt` 최소면적 규칙. [[reference-sim-verification]]로 5구역 확인.

## 봉인 방 도달성 보정 (핸드오프 버그)
- 핸드오프 `interior-nursery.jsx`는 admit(x18 divider)·viewing(x13 divider)을 **개구부 없이** 그려 두 방이 물리적으로 봉인 → 플레이 불가.
- 임상 동선에 맞춰 **doorway 2개 신설**: nursery↔admit(신생아 입원 사정 이동, th `{18,17}`) · feeding↔viewing(가족 관람 진입, th `{13,34}`). 봉인 유지는 명백한 버그이므로 reachability 원칙 우선.

## 마커 (라벨만)
- 5개 standalone 핫스팟. 대표: 신생아 활력징후(quest, 배시넷존 — missionText), 손위생 3분·가운(quest, 입구), 입원 사정·계측(info, 워머).
- `scenarioId` 미연결 — 신생아 케어 시나리오 콘텐츠 후 연결. 후보: 신생아 활력징후·계측(배시넷/워머), 출입 손위생·가운 착의(입구), 모유 수유 교육(수유실).
