---
build-spec: departments/er
stage: 02-construction / 05-map-engine (5g-a)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-01
---

# Build Spec — 5g-a · ER 응급의료센터

| | |
|---|---|
| interior id | `INT-ER-00001` (deptId `DEPT-ER-00001`) |
| fixture | `mobile/src/map/fixtures/er.ts` (`ER_INTERIOR`) |
| SoT(핸드오프) | `inputs/design-handoff_v11/reference/interior-er.jsx` + `interior-objects-er{,2,3}.jsx`·`interior-shared.jsx` (**v11 2.5D**) |
| 그리드 | 40 cols × 60 rows · floorTheme `clinical` · scale **0.85** |
| playerStart | `{19,28}` (중앙 너스 스테이션 well) · 엘리베이터 진입 시 `?ex&ey` 오버라이드 |

> **이 폴더가 부서 Build Spec의 기준 인스턴스.** 네 아티팩트를 각각 별도 파일로 정의한다([템플릿](../../../../../_templates/build-spec/)).
> 다른 부서는 이 구조·밀도를 따른다.

## §2. 아티팩트 매니페스트
| 아티팩트 | 상태 | 파일 |
|---|---|---|
| domain-entities | ✅ | [`domain-entities.md`](domain-entities.md) — regions·rooms·오브젝트 배치·NPC |
| business-rules | ✅ | [`business-rules.md`](business-rules.md) — collision·통행·footprint |
| business-logic-model | ✅ | [`business-logic-model.md`](business-logic-model.md) — 진입·이동·시나리오 배선 |
| frontend-components | ✅ | [`frontend-components.md`](frontend-components.md) — 카탈로그·렌더 z-order |

## §0. 개요 & 범위
```
┌─────────────── 공공 로비 (y0-15) ───────────────┐
│  앰뷸런스 인계 · 보안검색 · 원무과 · KTAS 트리아지 · 대기  │  ← 상단 전폭
├──────────┬──────────────┬──────────────────────┤  y16 divider
│ 소생실    │ 중앙 너스      │ 제1진료실(내과)          │  밴드1 y16-32
│ (Resus)  │ 스테이션+약품실 │                        │
├──────────┼──────────────┼──────────────────────┤  y33 divider
│ 음압격리  │ 소처치·봉합실   │ 제2진료실(외상/정형)      │  밴드2 y33-48
├──────────┼──────────────┼──────────────────────┤  y49 divider
│ 정신과    │ 가족상담·임종실  │ 제염실 (외부 연결)        │  밴드3 y49-59
└──────────┴──────────────┴──────────────────────┘
   x0-13(좌열)   x13-26(중열)      x26-40(우열)
```
- **구획 원칙**: 내부 존 경계 = **`threshold`**(검은 열린 통로), 외부만 auto `door`. 컬럼 분리 = 세로 divider `x13`/`x26`.
- 특수실 `tint`: 정신(파랑) · 임종(웜) · 제염(wet). SoT 1:1 유도.

## §1. 분해 (Decomposition)
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 40×60 레이아웃·엔티티·NPC 데이터 | `fixtures/er.ts` |
| ER 카탈로그 | ER 전용 오브젝트 렌더 | `objects/erEquipment.tsx` |
| 공용 프리미티브 | i* 오브젝트·수술등 등 | `objects/sharedEquipment.tsx` |
| 엘리베이터 | 타워 1F 진입 배선 | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·차단 가드 | `map/er-fixture.test.ts` |

## §3. 미해결 질문
- (없음 — 구현 완료)

## §4. 구현 체크리스트
- [x] regions/rooms/collision · [x] threshold/door/glass/tint · [x] 오브젝트 배치 · [x] NPC · [x] 카탈로그 포팅 · [x] 마커/시나리오 배선 · [x] 엘리베이터 진입 · [x] 테스트

## §5. 검증
- `tsc` 0 · `jest`(er-fixture: playerStart open · 14 room 도달 · threshold 통행 · footprint/ㄷwell 차단) · `expo export` OK.
- **시뮬레이터**(2026-06-29~30): 전 방·통로 라벨·마커(머리 위)·수술등(overhead) 렌더 확인.

## §7. 편차 로그 (SoT 대비 의도적)
| SoT | 실제 구현 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.85 | 14폭 방이 뷰포트에 맞게 |
| 트리아지/대기 사이 없음 | 의자2+화분2 추가 | 동선 자연스럽게 (사용자 승인) |
| 노란 트리아지선 w1 | w2 | 정문 통로(x17-20) 중앙 정렬 |
| — | RoomMask 옅게(0.2) · 오브젝트 컬링 off | 옆방 가림/경계 통로 누락 방지 |

나머지 좌표·오브젝트·NPC는 `interior-er.jsx`와 1:1.
