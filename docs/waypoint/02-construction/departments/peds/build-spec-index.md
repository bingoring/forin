---
build-spec: departments/peds
stage: 02-construction / 05-map-engine (5g-d)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-10
---

# Build Spec — 5g-d · Peds + NICU 소아청소년 센터

| | |
|---|---|
| interior id | `INT-PEDS-00001` (deptId `DEPT-PEDS-00001`) |
| fixture | `mobile/src/map/fixtures/peds.ts` (`PEDS_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v13` `interior-peds.jsx` + `interior-objects-peds2.jsx`·`interior-shared.jsx` (**v13 2.5D + 접지 그림자**) |
| 그리드 | 34 cols × 48 rows · floorTheme `peds` · scale **0.85** |
| playerStart | `{18,20}` (병동 입구 앞 — 핸드오프 그대로) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 아티팩트별 파일은 아래 매니페스트.
> **v13 2.5D 장비 규약**(README §)을 신규 오브젝트에 적용 — 통합 실루엣+상단면+seam+viewer-facing+**접지 그림자 타원**.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) — regions·rooms·오브젝트 배치·NPC |
| business-rules | [`business-rules.md`](business-rules.md) — collision·통행·footprint |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) — 진입·이동·시나리오 배선 |
| frontend-components | [`frontend-components.md`](frontend-components.md) — peds2 카탈로그·놀이방 오브젝트·렌더 |

## §0. 개요 & 범위
```
┌──────── 외래 · 대기 · 놀이 · 계측 · 접수 (y0-14) ────────┐  상단 전폭
│ 계측(좌)      접수(중)              놀이방 PLAY(우)        │
├── 소아 진료실 ─┬──────── 소아 병동 (4-bed) ──────────────┤  y14 divider
│ (x0-11)       │ (x11-34): PEDS STATION + 크립2 + 병상2   │
├── NICU 전실 ──╎──────── NICU 인큐베이터 존 ──────────────┤  y29 divider
│ 세척(x0-9)    ┃(x9-34): 광선치료 3 + 인큐베이터 3 + 모유고 │  유리벽 x9 + sterile 스크럽 통로
└───────────────┴──────────────────────────────────────────┘
```
- **동선 원칙**(핸드오프): 외래·놀이(밝고 친근) → 진료실/병동(임상) → **NICU(무균, 유리벽+3분 스크럽 전실 경유)**. 안쪽일수록 청정.
- NICU 존 저조도 `tint`(#1E2A40 op0.15). NICU 진입 = **유리벽(x9) + sterile threshold(y34-36 "스크럽 후 입장")**.

## §1. 분해 (Decomposition)
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 34×48 레이아웃·엔티티·NPC | `fixtures/peds.ts` (신규) → `FIXTURES` 등록 |
| Peds 카탈로그 | peds2 오브젝트 + 놀이방 오브젝트 렌더 | `objects/pedsEquipment.tsx` (신규) + `PedsObjectView` |
| 공용 프리미티브 | ibed(peds)·imonitor·ireception·ichair·iplant·sinkor·scrubdispenser·gownbox·nursedeski·ivpump·bpcuff·sanitizer·clinicreception | `objects/sharedEquipment.tsx` (기존, 필요 시 peds 변형 확인) |
| 디스패치 | `PedsObjectView`를 체인에 추가 | `objects/index.tsx` |
| 엘리베이터 | 타워 4F(또는 신규 층) 진입 배선 | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·차단·유리벽 가드 | `map/peds-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 시나리오 배선** → **라벨만**(사용자 확정). 마커 라벨만 배치, scenarioId는 콘텐츠 준비 후 연결(business-logic-model §3).
- **Q2 엘리베이터 층** → **타워 5F 신설**(사용자 확정). `ELEVATOR_BUILDINGS.tower`에 5F 추가, entry `{16,1}`.
- **Q3 ibed peds 변형** → 해결: sharedEquipment `IBed`에 이미 `peds` 변형(주황 프레임·핑크 시트·초록 담요) 존재 → `ibed variant='peds'` 사용(별도 PedsBed 불필요).

## §4. 구현 체크리스트
- [x] regions/rooms/collision(외벽·divider·exam|ward·NICU 유리벽)
- [x] threshold(진료실/병동/NICU전실/스크럽) · door(캠퍼스) · glass(x9) · tint(NICU)
- [x] 오브젝트 배치(외래·진료·병동·전실·NICU)
- [x] 신규 카탈로그 `pedsEquipment.tsx`(16종: peds2 10 + 놀이방 6) + footprint
- [x] NPC 캐스트 22 + 마커(오브젝트 속성)
- [x] `PedsObjectView` 디스패치 + `FIXTURES` 등록 + 엘리베이터 5F
- [x] `peds-fixture.test.ts`
- [x] tsc/jest + 시뮬레이터 렌더 확인

## §5. 검증 결과
- `tsc` 0 · `jest` **61/61**(peds-fixture 5: playerStart open · 5 room 도달 · threshold 통행 · NICU 유리벽 차단 · 인큐베이터/크립 footprint).
- **시뮬레이터**(2026-07-10, 종료 후 재기동): welcome/play·ward·NICU 렌더 확인 — peds 바닥테마·접수·놀이방(풍선/벽화/장난감)·베이비스케일·크립·인큐베이터·광선치료기(OVERHEAD)·마커 정상.

## §7. 편차 로그 (SoT 대비)
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.85 | 34폭 방 뷰포트 맞춤(ER/OR/ICU 일관) |
| ~~Mural clipPath 언덕 → 평면 밴드~~ | **SVG Path 굴곡 언덕으로 수정(2026-07-12)** | RN View clipPath 미지원 → mural을 react-native-svg로 전환(초원 곡선 복원). 위치는 x20,y1(놀이방 좌상단)=핸드오프 그대로 |
| RockingHorse·Balloon `forinBob` | 정적 | 애니 후속(bob) |
| 시나리오 마커 | 라벨만(scenarioId 없음) | peds 시나리오 콘텐츠 후속(Q1) |
나머지 좌표·오브젝트·NPC는 `interior-peds.jsx`와 1:1.

**사용자 피드백 반영(2026-07-10):** ① 접수대 미렌더 → type `clinicreception`→`clinicReception`(dispatch camelCase 불일치) 수정. ② 놀이매트 반투명 tint → **불투명 `#FED7AA` + 점선 테두리** 전용 `playmat` 오브젝트(핸드오프 그대로, CEILING 저-z로 놀이기구 뒤). ③ 캠퍼스 문(x15 w3)·진료실 NPC(의사+아이+부모, 아이 작은 스프라이트)는 핸드오프와 이미 일치 확인(문이 이상해 보인 건 접수대 누락, exam '여분 어른'은 딥링크로 방에 선 플레이어(간호사)였음).

**사용자 피드백 2차(2026-07-12):** **놀이방 접근 불가**가 실제 버그 — `playmat`이 `props{w:12,h:8}`를 가져 objectCollision이 놀이존 12×8 전체를 벽으로 막았음. `playmat`+`dosingchart`+`mural`+`phototherapy`를 objectCollision **skip 목록**에 추가(바닥오버레이/벽/천장은 비충돌). 이 벽 때문에 "진입구가 y14 통로(≈12칸 아래)로만 보임 + 오른쪽 벽처럼 치우침" 인상이 생겼던 것. 캠퍼스 문은 y0 최상단(정상)·놀이매트 x20-32(핸드오프 우측 1/3)로 좌표는 이미 정확. 수정 후 놀이방 자유 통행(플레이어가 놀이존 내부 스폰 확인).
