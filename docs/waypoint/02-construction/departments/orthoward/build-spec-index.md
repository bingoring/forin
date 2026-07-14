---
build-spec: departments/orthoward
stage: 02-construction / 05-map-engine (5g-h)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-14
---

# Build Spec — 5g-h · Orthopedics Ward 정형외과 병동

| | |
|---|---|
| interior id | `INT-ORTHOWARD-00001` (deptId `DEPT-ORTHOWARD-00001`) |
| fixture | `mobile/src/map/fixtures/ortho.ts` (`ORTHO_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v15` `interior-orthoward.jsx` + `interior-objects-ortho2.jsx` |
| 그리드 | 28 cols × 52 rows · floorTheme `ortho`(bone) · scale **0.9** |
| playerStart | `{4,15}` (좌측 ← 캠퍼스 문 앞 스테이션 복도) |

> 내과·외과 병동([ward/](../ward/build-spec-index.md)·[surgward/](../surgward/build-spec-index.md))과 동형(세로 흐름·좌측 문). ward2/surg2/shared 대거 재사용 — 신규는 ortho2 + CMSChart.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌ PT 연계 통로(워커랙·휠체어·핸드레일) ┬ 석고실·소처치(석고싱크·롤·절단기) ┐  (y1-9)
├──────── 중앙 간호 스테이션 · 보조기 베이 (PACS·CMS·BraceRack·워커) ────┤  (y11-19)
├──────── 4인용 골절/견인 병실 A·B·C·D (견인·CPM·구획증후군·석고) ────────┤  (y21-34, 커튼)
├──────── 1인용 고령 고관절 골절 병실 (외전베개·낙상경보·변기가드) ────────┤  (y36-50)
└────────────────────────────────────────────────────────────────────┘
```
- **거동제약 간호**: 골격 견인, CPM(지속수동운동), 캐스팅, CMS(신경혈관) 사정, 고관절 탈구 방지.

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×52 레이아웃·엔티티·NPC | `fixtures/ortho.ts` (신규) → `FIXTURES` |
| Ortho 카탈로그 | ortho2 10 + CMSChart | `objects/orthoEquipment.tsx` (신규) + `OrthoObjectView` |
| 재사용 | ward2(handrail·deskphone·fallrisksign) + surg2(**walker**(신규 추가)·walkerrack) + shared(ibed or/ward·nursestation·icurtain·ichair·iiv·imonitor·sofa·iplant) + ER(dressing·wheelchair·baylabel) | 기존 |
| 디스패치 | `OrthoObjectView` 체인 추가(Surg 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | 타워 **6F**(정형외과 병동) 연결, entry `{1,15}` | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·커튼·footprint | `map/ortho-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → 엘리베이터 타워 **6F**(기존 "정형외과 병동" 라벨). 8F=내과·7F=외과·**6F=정형** 3병동 완비. entry `{1,15}`.
- **Q2 시나리오** → 라벨만.
- **Q3 Walker** → surg2 정의였으나 외과 병동 render 미사용으로 스킵했던 것 → 정형 병동 스테이션에서 사용 → `surgEquipment.tsx`에 추가(type `walker`).

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·서비스 y10·세로 x9·스테이션 y20 광폭·고관절 y35)
- [x] threshold 7 · door(← 캠퍼스) · 커튼 3
- [x] 신규 `orthoEquipment.tsx`(11종: TractionFrame·CPMMachine·PlasterTrapSink·CastCutter·CastRollShelf·BraceRack·AbductionPillow·ElevatedToiletGuard·BedAlarm·PACSViewer·CMSChart) + surgEquipment에 Walker 추가
- [x] NPC 캐스트 11 + 마커(핫스팟 10)
- [x] `OrthoObjectView` 디스패치 + `FIXTURES` + 엘리베이터 6F
- [x] `ortho-fixture.test.ts`(6)
- [x] tsc/jest + 시뮬레이터

## §5. 검증 결과
- `tsc` 0 · `jest` **88/88**(ortho 6: playerStart · 좌측문/하단벽 · 5 room 도달 · threshold · 커튼 차단+4 베이 · 병상/석고싱크/CPM footprint).
- **시뮬레이터**(2026-07-14): PT통로(워커랙·휠체어), 석고실(석고싱크·롤선반·절단기·처치베드), 스테이션(PACS·CMS차트·BraceRack·워커·ㄷ데스크), 4인 골절(견인 프레임·CPM·낙상표지·커튼), 고관절실(외전베개·낙상경보·모니터) 렌더 정상.

## §7. 편차 로그
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.9 | 28폭 뷰포트(ward 동일) |
| IBed label | 생략 | 공용 dispatch 미지원(전 병동 동일) |
| SVG `<text>`(90°/TRAP/CMS) | shape/생략 | 카탈로그 규약 |
| BedAlarm 점멸등 애니 | 정적 | 애니 후속 |
| deptCode 8F | 엘리베이터 6F | 엘리베이터 라벨(6F=정형)에 맞춤. 병동 층 배정: 내과 8F·외과 7F·정형 6F |
| 시나리오 마커 | 라벨만 | ortho 시나리오 후속 |
나머지 좌표·오브젝트·NPC는 v15 `interior-orthoward.jsx`와 1:1.
