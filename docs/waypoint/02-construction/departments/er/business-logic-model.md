---
artifact: business-logic-model
build-spec: departments/er
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Logic Model — 5g-a ER (흐름)

> 진입·이동·상호작용의 실행 모델. 데이터는 [`domain-entities.md`](domain-entities.md), 렌더는 [`frontend-components.md`](frontend-components.md).

## 1. 워크플로

### 진입 (엘리베이터 / 캠퍼스)
1. 타워 1F 버튼 또는 캠퍼스 "응급실 입장" → interior `INT-ER-00001` 로드(`FIXTURES` fallback).
2. `entry:{x:20,y:11}`(정문 안쪽 로비)에서 스폰. 딥링크 `?ex&ey`가 있으면 playerStart 오버라이드.

### 상호작용 (마커 → 시나리오)
1. `InteriorScreen`이 오브젝트/NPC의 `marker` 속성을 모아 `HotspotMarker` 렌더(§C.3 배선).
2. 플레이어가 인접 + A(액션) → `scenarioId` 있으면 시나리오 진입, 없으면 라벨 정보.

## 2. 알고리즘 (공통 엔진 — [README](../README.md) §렌더 참조)
- 이동: D-pad/탭 → `canEnter`(collision+objectCollision) 검사 → 스텝 bob.
- 카메라: player 중심 오프셋(reanimated), scale 0.85.
- RoomMask: 현재 region 밖 옅게(0.2).

## 3. 시나리오 배선 (마커 → scenarioId)
| 엔티티 | 마커 | scenarioId |
|---|---|---|
| 트리아지 접수(2,8) | quest "KTAS 분류" | `er-hopkins-pain` |
| 소생실 Bay1 베드(3,18) | urgent "CODE" | `er-anaphylaxis` |
| exam1 베드(34,20) | quest "복통 문진" | `er-chest-pain` |
| Dr. Patel NPC(18,27) | urgent "Dr. Patel" | `er-mental-health` |

라벨만(시나리오 후속): 앰뷸 SBAR · 원무 접수 · 감염 관리 · 봉합 처치 · 부목 고정 · 1:1 관찰 · 가족 상담 · 제염 처치.

## 4. 상태 전이
- 마커 소비: 시나리오 완료 시 해당 마커 dismiss(콘텐츠 워크스트림 연동 — 후속).

## 5. 통합 지점
- `api.interior(id)` → 없으면 `FIXTURES[id]` fallback(오프라인/서버부재). 시나리오는 `content/scenarios.ts`.
