---
build-spec: departments/surgward
stage: 02-construction / 05-map-engine (5g-g)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-14
---

# Build Spec — 5g-g · General Surgery Ward 일반 외과 병동

| | |
|---|---|
| interior id | `INT-SURGWARD-00001` (deptId `DEPT-SURGWARD-00001`) |
| fixture | `mobile/src/map/fixtures/surgward.ts` (`SURGWARD_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v15` `interior-surgward.jsx` + `interior-objects-surg2.jsx` (v15 2.5D + 접지 그림자) |
| 그리드 | 28 cols × 52 rows · floorTheme `surgery`(steel) · scale **0.9** |
| playerStart | `{4,15}` (좌측 ← 캠퍼스 문 앞 스테이션 복도) |

> 구조는 내과 병동([ward/](../ward/build-spec-index.md))과 동형(세로 흐름, 좌측 문). **ward2 카탈로그 + shared/OR/ER 프리미티브를 대거 재사용** — 신규는 surg2(수술간호)뿐.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌ 린넨·배식 ┬ 중앙 처치/드레싱룸 (멸균 처치 베드+수술등) ┐  서비스+처치 (y1-9)
├──────── 중앙 간호 스테이션 · 보행 복도 (y11-19) ───────┤  OP 스케줄 보드 + 워커랙
├──────── 4인용 수술 후 병실 A·B·C·D (y21-34) ──────────┤  PCA·JP배액·가스배출·퇴원 (커튼)
├──────── 1인용 대수술 후 중증실 (y36-50) ──────────────┤  NG흡인·Hemovac·SCD
└────────────────────────────────────────────────────┘
```
- **주변수술기 간호**(perioperative): 수술 후 회복(PCA 통증), 배액관(JP/Hemovac), NG-흡인, 드레싱 교체, 조기 보행(ambulation).

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×52 레이아웃·엔티티·NPC | `fixtures/surgward.ts` (신규) → `FIXTURES` |
| Surg 카탈로그 | surg2 신규 8종 | `objects/surgEquipment.tsx` (신규) + `SurgObjectView` |
| 재사용 | ward2(mealcart·npoboard·ivstoragecart·supplybasketshelf·handrail·deskphone·sharpsbin·linenhamper·sluicesink) + shared(ibed or/ward·icurtain·icabinet sterile·nursestation·vitals·sofa 등) + OR(surgicallight·instrumenttray) + ER(dressing=DressingCart·suction·wastebin·baylabel) | 기존 |
| 디스패치 | `SurgObjectView` 체인 추가(Ward 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | 타워 **7F**(일반 외과 병동) 신설, entry `{1,15}` | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·커튼·footprint | `map/surgward-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → 엘리베이터 타워 **7F 신설**(핸드오프 deptCode 7F). 8F=내과, 7F=외과, 6F=정형(예정). entry `{1,15}`(좌측 문).
- **Q2 시나리오** → 라벨만.
- **Q3 미배치 helper** → surg2의 `Walker`·`AbdoBinder`는 핸드오프 render에서 미사용 → 스킵.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·좌측문·서비스 y10·세로 x9·스테이션 y20·중증실 y35)
- [x] threshold 7 · door(← 캠퍼스) · 커튼 3
- [x] 신규 `surgEquipment.tsx`(8종: PCAPump·JPDrain·Hemovac·NGSuction·SCDDevice·WalkerRack·OPScheduleBoard·StapleRemover)
- [x] NPC 캐스트 14 + 마커(핫스팟 10)
- [x] `SurgObjectView` 디스패치 + `FIXTURES` + 엘리베이터 7F
- [x] `surgward-fixture.test.ts`(6)
- [x] tsc/jest + 시뮬레이터

## §5. 검증 결과
- `tsc` 0 · `jest` **82/82**(surgward 6: playerStart · 좌측문/하단벽 · 5 room 도달 · threshold · 커튼 차단+4 베이 · 병상/PCA/SCD footprint).
- **시뮬레이터**(2026-07-14): 스테이션(OP 보드·ㄷ데스크·PCA·워커랙·핸드레일), 처치실(수술등·처치베드·드레싱카트), 4인 수술후(PCA·JP·커튼), 대수술 중증실(NG흡인·Hemovac×2·SCD·suction) 렌더 정상.

## §7. 편차 로그
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.9 | 28폭 뷰포트 맞춤(ward와 동일) |
| IBed label(A·OP DAY 등) | 생략 | 공용 dispatch label 미지원(ward/peds와 동일) |
| SVG `<text>`(LOW 등) | shape/생략 | 카탈로그 규약 |
| `Walker`·`AbdoBinder` | 미구현 | 핸드오프 render 미배치(정의만) |
| 시나리오 마커 | 라벨만 | surg 시나리오 후속 |
나머지 좌표·오브젝트·NPC는 v15 `interior-surgward.jsx`와 1:1(NPC 소수 좌표 반올림: parent y17.5→18 등 시각 동일).
