---
artifact: business-logic-model
build-spec: departments/peds
status: DRAFT
updated: 2026-07-10
---

# Business Logic Model — 5g-d Peds+NICU (흐름)

## 1. 진입 (엘리베이터/캠퍼스)
- interior `INT-PEDS-00001`, 캠퍼스 문 `x15 y0 w3` → `entry:{x:16,y:1}`(문 안쪽).
- ⚠️ **Q2(인덱스 §3): 엘리베이터 층 미정** — ER 1F·OR 3F·ICU 4F 사용 중. Peds 층 배치는 사용자 확인 후 `ELEVATOR_BUILDINGS`에 배선.
- fixture `FIXTURES['INT-PEDS-00001']` 등록.

## 2. 이동·카메라 (공통 — [README](../README.md) §렌더)
- scale 0.85 · 오브젝트 컬링 off · RoomMask 옅게. NICU 존은 tint로 저조도. 유리벽 너머 인큐베이터 감시(투명 렌더).
- 미션 배너: **"소아 병동 · 체중 기반 투약 소분 도와주기"**(missionText, non-urgent).

## 3. 시나리오 배선 (마커 → scenarioId)
> ⚠️ **Q1: peds 시나리오 id 미정**(`content/scenarios.ts` 부재). 우선 **라벨만** 배치, scenarioId는 콘텐츠 준비 후 연결.

| 엔티티(좌표) | 마커 | 라벨 | scenarioId |
|---|---|---|---|
| 계측 존(3,7) | info | 성장 계측 | (후속) |
| 놀이방(25,7) | info | 놀이방 | (후속) |
| 진료실 베드(3,17) | quest | 성장 문진 | (후속) |
| 병동 스테이션(14,19) | quest | 투약 소분 | (후속·핵심 미션) |
| 병동 병상(24,23) | info | 회진·촉진 | (후속) |
| NICU 전실(3,36) | info | 손 위생 3분 | (후속) |
| NICU 인큐베이터(12,35) | quest | 위관영양 | (후속) |
| NICU(22,40) | info | 바이탈 차팅 | (후속) |

- 마커는 **엔티티 속성**(가까운 오브젝트/NPC의 props.marker)으로 부착(ER/ICU 모델). `hotspots: []`.

## 4. 상태/전이
- 마커 소비: 시나리오 완료 시 dismiss(콘텐츠 워크스트림 연동).

## 5. 통합 지점
- `api.interior(id)` → `FIXTURES[id]` fallback. 시나리오는 `content/scenarios.ts`(peds 항목 후속).
