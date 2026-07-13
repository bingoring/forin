---
build-spec: departments/pharma
stage: 02-construction / 05-map-engine (5g-e)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-12
---

# Build Spec — 5g-e · Central Pharmacy 중앙 약제부

| | |
|---|---|
| interior id | `INT-PHARMA-00001` (deptId `DEPT-PHARMA-00001`) |
| fixture | `mobile/src/map/fixtures/pharma.ts` (`PHARMA_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v13` `interior-pharma.jsx` + `interior-objects-pharma2.jsx` (**v13 2.5D + 접지 그림자**) |
| 그리드 | 36 cols × 42 rows · floorTheme `pharma`(웜 베이지) · scale **0.8** |
| playerStart | `{9,9}` (수령 창구 로비 — 핸드오프 그대로) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 아티팩트별 파일은 아래 매니페스트.
> **v13 2.5D 장비 규약**(README §)을 신규 오브젝트에 적용 — 통합 실루엣+상단면+seam+viewer-facing 전면+**접지 그림자 타원**.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) — regions·rooms·오브젝트 배치·NPC |
| business-rules | [`business-rules.md`](business-rules.md) — collision·통행·footprint·유리벽 |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) — 진입(엘리베이터 P1 + ER 포털)·이동·마커 |
| frontend-components | [`frontend-components.md`](frontend-components.md) — pharma2 카탈로그·렌더·디스패치 |

## §0. 개요 & 범위
```
┌──────── 수령 창구 · 기송관 허브 (y0-11) ─────────────────────┐  상단 전폭
│ 픽업 카운터+약장(좌 x1-11)  기송관(중)   약장+냉장고(우)      │
├── 조제실 MAIN DISPENSING ─┬── 무균 전실 ANTEROOM (y13-18) ──┤  y12 divider(STAFF/무균전실 threshold)
│ ATC·LASA·약장 A~D·검수대   │ 싱크·가운·스크럽·택키매트         │
│ (x0-20)                   ├── (유리벽 y19 + 에어샤워) ───────┤
├── 마약류 보관고 VAULT ─────┤ 무균 조제실 CLEANROOM (y20-40)   │  x21 divider(y20+)
│ 이중잠금 금고(x0-12)       │ BSC×2·차압계·유출키트·원심·프린터 │
└───────────────────────────┴─────────────────────────────────┘
```
- **동선 원칙**(핸드오프): 공공 수령창구(밝음) → 조제실/마약류(임상·보안) → **무균 전실→에어샤워→무균 조제실**(항암/TPN, 안쪽일수록 청정). 유리벽 + sterile threshold로 청정 단계 구분.
- 진입 2경로(사용자 확정): **엘리베이터 타워 P1층 신설** + **ER 약품실(PYXIS)에서 포털 문**(둘 다).

## §1. 분해 (Decomposition)
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 36×42 레이아웃·엔티티·NPC | `fixtures/pharma.ts` (신규) → `FIXTURES` 등록 |
| Pharma 카탈로그 | pharma 전용 오브젝트 21종 렌더 | `objects/pharmaEquipment.tsx` (신규) + `PharmaObjectView` |
| 공용 프리미티브 | baylabel·ireception(검수대)·imonitor·icabinet(pharma)·sinkor·scrubdispenser·gownbox·sanitizer·chartbinder·iplant | 기존 `er/or/icu/sharedEquipment` 재사용 |
| 디스패치 | `PharmaObjectView`를 체인에 추가 | `objects/index.tsx` |
| 엘리베이터 | 타워 P1층 신설(entry `{16,40}`) | `map/ElevatorScreen.tsx` |
| ER 포털 | `portal` 핫스팟(ER PYXIS `{18,20}`) → `interior/[id]` 라우트 처리 | `fixtures/er.ts` + `app/interior/[id].tsx` + `engine/types.ts` |
| 테스트 | 도달성·통행·차단·유리벽 가드 | `map/pharma-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입 경로** → **둘 다**(사용자 확정). 엘리베이터 타워 **P1층 신설** + ER 약품실에서 **portal 문**. `Hotspot`에 `target`/`entry` 추가, 라우트에 `kind:'portal'` 분기(=`router.push` 목적지 인테리어, 뒤로가면 ER 복귀).
- **Q2 시나리오 배선** → **라벨만**(peds와 동일). 마커 라벨만, scenarioId는 약제 시나리오 콘텐츠 후 연결.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 7 / collision(외벽·간호사문·캠퍼스문·y12 divider·x21 divider·마약류 alcove)
- [x] threshold(STAFF/무균전실/에어샤워/마약류) · door(간호사·캠퍼스) · glass(카운터 배리어·전실 유리벽)
- [x] 오브젝트 배치(수령창구·조제실·마약류·전실·무균조제실)
- [x] 신규 카탈로그 `pharmaEquipment.tsx`(21종) + footprint(skip 9종 + props{w,h} 블로커)
- [x] NPC 캐스트 9 + 마커(오브젝트 속성 3 + 핫스팟 2)
- [x] `PharmaObjectView` 디스패치 + `FIXTURES` 등록 + 엘리베이터 P1 + ER portal
- [x] `pharma-fixture.test.ts`(7)
- [x] tsc/jest + 시뮬레이터 렌더 확인

## §5. 검증 결과
- `tsc` 0 · `jest` **69/69**(pharma-fixture 7: playerStart open · 엘리베이터 도착타일 · 7 room 도달 · threshold 통행 · 전실 유리벽 차단+에어샤워 통행 · 카운터/배리어 차단 · 금고/ATC footprint).
- **시뮬레이터**(2026-07-12, 종료 후 재기동): 수령창구(카운터·약사·PICK-UP/DROP-OFF·바코드·반납함·약장), 대기 간호사, MAIN DISPENSING(ATC·LASA·약장 A~D·검수대·카트), 무균 조제실(유리벽·에어샤워·BSC×2·차압계·유출키트·벽전화 ♪♫·원심분리기·라벨프린터·외과의) 렌더 정상. 엘리베이터 타워 **P1층** + ER 약품실 옆 **portal 마커(초록 →)** 확인.

## §7. 편차 로그 (SoT 대비)
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.8 | 36폭 방 뷰포트 맞춤(ER/OR/ICU/Peds 일관) |
| `IWall x21 y13 h28`(y13-40) | **x21 y20 h21(y20-40)** | 핸드오프대로면 무균 전실(x22-34 y13-18)이 밀봉되어 진입 불가(전실 입구 threshold x20-21 y12 아래를 x21 벽이 막음). x21을 조제실\|무균조제실 경계(y20+)로만 두어 전실을 허브 threshold에 연결. **오브젝트 좌표·NPC는 1:1 유지, 충돌만 보정**(peds 놀이방 선례와 동일 성격) |
| SVG `<text>` 라벨(NARCOTICS/HEPA/4°/SPIN 등) | shape 블록/생략 | 기존 장비 카탈로그 규약(react-native-svg text 미사용)과 일관. DIV 라벨(CounterSign/ShelfLabel/FloorTape/WallPhone)은 RN View+Text로 1:1 재현 |
| 미사용 helper(Kiosk/QueueRope/CountingBench/CSSafe/LaminarHood) | 미구현 | 핸드오프 render에서 미배치(정의만 존재) → 스킵 |
| Centrifuge `forinSpin`·WallPhone `forinShake` 애니 | 정적 | 애니 후속 |
| 시나리오 마커 | 라벨만(scenarioId 없음) | pharma 시나리오 콘텐츠 후속(Q2) |
나머지 좌표·오브젝트·NPC는 `interior-pharma.jsx`와 1:1.
