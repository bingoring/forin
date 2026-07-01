---
phase: 02-construction
stage: 05-map-engine / 5g-departments
status: LIVING
updated: 2026-07-01
---

# 5g · 부서 인테리어 구현 스펙 (handoff-driven)

각 층/부서 인테리어를 **핸드오프 기준으로 구체적으로 계획한 뒤 그대로 구현**하기 위한 문서 모음.
"handoff를 확실히 따른다"가 최우선 — 임의 단순화·창작 금지. (2-5 §5g의 상세 하위 문서)

> 이 폴더는 waypoint **구현 스펙(Build Spec)** 메커니즘(`FRAMEWORK.md` "구현 스펙" · `_templates/build-spec/`)의
> **콘텐츠-시리즈 압축형** 실사례다. Build Spec의 네 아티팩트를 부서당 1문서에 맵 도메인 섹션으로 접어 넣은 형태.

> **프로세스:** 부서 하나당 ① 이 폴더에 스펙 문서(레이아웃·오브젝트·NPC·마커를 핸드오프 라인 단위로 명시)를 먼저 쓰고 →
> ② **스펙대로** 구현 → ③ 검증(§검증 프로토콜) → ④ 스펙 문서에 "구현 결과/편차" 기록. ER 문서가 상세도의 기준선.

## 인덱스

| 부서 | 문서 | 상태 | interior id | 핸드오프 소스 |
|---|---|---|---|---|
| ER 응급의료센터 | [er.md](er.md) | ✅ 구현 (**참고 기준**) | `INT-ER-00001` | `interior-er.jsx` + `interior-objects-er{,2,3}.jsx` |
| OR 수술실+PACU | [or.md](or.md) | ✅ 구현 | `INT-OR-00001` | `interior-or.jsx` + `interior-objects-or2.jsx` |
| ICU 중환자실 | [icu.md](icu.md) | ✅ 구현 | `INT-ICU-00001` | `interior-icu.jsx` + `interior-objects-icu2.jsx` |
| Peds+NICU 소아 | peds.md | ⬜ 예정 (다음) | `INT-PEDS-00001` | `interior-peds.jsx` + `interior-objects-peds2.jsx` |
| Pharmacy 약국 | pharma.md | ⬜ 예정 | `INT-PHARMA-00001` | `interior-pharma.jsx` + `interior-objects-pharma2.jsx` |
| 내과 병동 | ward.md | ⬜ 예정 | `INT-WARD-00001` | `interior-ward.jsx` + `interior-objects-ward2.jsx` |
| 외과 병동 | surgward.md | ⬜ 예정 | `INT-SURGWARD-00001` | `interior-surgward.jsx` + `interior-objects-surg2.jsx` |
| 정형 병동 | orthoward.md | ⬜ 예정 | `INT-ORTHOWARD-00001` | `interior-orthoward.jsx` + `interior-objects-ortho2.jsx` |
| 피부과 센터 | dermcenter.md | ⬜ 예정 | `INT-DERM-00001` | `interior-dermcenter.jsx` + `interior-objects-derm2.jsx` |

핸드오프 경로: `../../inputs/design-handoff_v10/reference/`.

---

## 공통 규약 (모든 부서 공유)

### 좌표·엔진 모델
- 타일 좌표계. `ITILE=16`(핸드오프 원본 px), 렌더는 `TILE = 16*ZOOM = 32` screen px. 컴포넌트는 ITILE px로 그려 `S = TILE/16`로 스케일.
- `Interior` 데이터 모델(`@engine` `types.ts`): `{ id, deptId, cols, rows, floorTheme, scale?, playerStart, regions[], rooms[], objects[], hotspots[], collision[], npcs[] }`.
- **`scale` < 1** 로 방 하나가 뷰포트에 들어오게 함(부서 폭 14~34칸). ER/OR/ICU = **0.85**. (1.0이면 넓은 방이 잘려 "오브젝트 누락"처럼 보임.)

### 구획·벽·통로
- **regions**: 방 판정(첫 매치). bounds는 분리벽과 1칸 겹치게 둬 플레이어가 항상 어떤 region에 속하게 함(핸드오프 그대로).
- **collision**(정적 벽): 핸드오프 `IWall`을 `{x,y,w,h}` 직사각형으로. **문/통로 자리는 gap**(collision에 넣지 않음).
- **threshold**(검은 열린 통로, `IThreshold`): `type:'threshold'`, `props:{w,h,label?,tone?}`. `tone:'sterile'`=파란(가운 필요) 통로.
  세로/가로 자동(`h>w`). collision의 gap과 **정확히 같은 좌표**로. 라벨은 다음 방 이름(`→ 소생실`).
- **door**(외부 auto 도어): `type:'door'`, `props:{w,kind:'auto',label?}`. 캠퍼스/엘리베이터 진입구·외부 연결에만.
- **glass**(`IGlass`, 투명 유리벽): `type:'glass'`, `props:{w,h}`. **objectCollision으로 차단**(정적 collision에 안 넣어도 막힘). ICU 4인실 벽 등.
- **tint**(`Tint`, 반투명 바닥 오버레이, 비차단): `type:'tint'`, `props:{w,h,color,op}`. 특수실 조도(정신/임종/제염/OR sterile/ICU dim).

### 오브젝트 렌더 파이프라인
- 디스패치(`objects/index.tsx` `InteriorObjectView`): `bed/monitor/reception/door/building/tree/landmark/threshold/glass` 특수 처리,
  나머지 default → **`ErObjectView ?? OrObjectView ?? IcuObjectView ?? SharedObjectView ?? ClinicObjectView`**.
- **공용 프리미티브** = `objects/sharedEquipment.tsx`(`i*` 타입: `ibed`(ward/or/peds) · `imonitor` · `iiv` · `ireception` · `ichair`(4방향) ·
  `iplant` · `icabinet`(7변형) · `icurtain` · `examstool` + 타부서 `surgicallight`/`instrumenttray`/`ventilator`/`crashcart`/`pyxis`/
  `bankofmonitors`/`xrayviewbox`/`castcart`/`sinkor`/`nursedeski`). **기존 clinic `bed/monitor/reception`과 충돌 안 나게 `i*` 접두.**
- **부서 전용 카탈로그** = `objects/<dept>Equipment.tsx`(예: `erEquipment.tsx`/`orEquipment.tsx`/`icuEquipment.tsx`), 해당 `interior-objects-<dept>*.jsx`를 요소 단위 1:1 포팅. `<text>` 글리프는 도형으로 대체(SVG Text 충돌 회피).
- **포팅 규약**: `Box` 헬퍼(`left:x*TILE+offX*S, w:w*S`)로 위치, `<Svg viewBox="0 0 W H">` 안에서 원본 좌표 그대로. div 기반 레퍼런스는 SVG rect로 재구성.
- **footprint**(`engine/footprint.ts` `OBJECT_FOOTPRINT`): 솔리드 오브젝트의 차단 타일. 벽/천장/탁상 부착물은 미등록(=통행).
  `objectCollision`은 `door/threshold/tint/icurtain/triageline/nursestation`을 skip(통행), `glass`/props.w+h/footprint는 차단.

### 마커(!/?)·상호작용
- **마커는 엔티티 속성** — 빈 바닥 좌표가 아니라 오브젝트/NPC에 붙임: object `props:{marker:'quest'|'urgent'|'info', markerLabel, scenarioId?}`,
  NpcSpec `{marker, markerLabel, scenarioId?}`. `InteriorScreen`이 이들을 모아 엔티티 위에 `HotspotMarker`(네모+!/?+bob) 렌더 + 액션 타깃.
  소스별 dy로 머리 위에 뜨게. `hotspots[]` 배열은 엘리베이터 등 특수 트리거에만 유지.
- 시나리오 연결: `scenarioId`는 `content/scenarios.ts`의 부서 시나리오 id(예 ICU: `icu-park-vent`/`icu-code-blue`…).

### 렌더 세부(공통 학습)
- **RoomMask**: 현재 방만 살짝 강조(DIM 0.2, 옅게). 무겁게 하면 옆방이 "빈 방"처럼 보임.
- **오브젝트 컬링 비활성**(전부 렌더) — 통로가 방 경계=뷰 가장자리라 컬링에 잘렸음. 부서당 ~100개라 성능 OK.
- **천장 조명(surgicallight)** = OVERHEAD z(8000, 오브젝트·스프라이트 위 / 마커·마스크 아래) — 필드 위에 뜸. 붐모니터/모니터뱅크는 배경(저 z).

### 엘리베이터/캠퍼스 진입
- `ElevatorScreen.tsx` `ELEVATOR_BUILDINGS`의 해당 층에 `interior:'<INT-ID>'` + `entry:{x,y}`(진입구 앞 타일) 추가.
- fixture는 `fixtures/<dept>.ts`에 `<DEPT>_INTERIOR` export → `fixtures/er.ts`의 `FIXTURES` 맵에 등록(오프라인/서버부재 fallback).

---

## 검증 프로토콜 (부서마다 필수)
1. `npx tsc --noEmit` = 0.
2. `npx jest` — 부서 fixture 도달성 테스트(`<dept>-fixture.test.ts`): playerStart open · 전 room 도달 · 전 threshold 통행 · 대표 솔리드/유리 차단.
3. `npx expo export -p ios` 성공(번들).
4. **iOS 시뮬레이터 시각 검증**(핵심): Metro(`expo start`, 8081) + `xcrun simctl openurl booted "exp://127.0.0.1:8081/--/interior/<INT-ID>?ex=<t>&ey=<t>"`로 방마다 스폰 → `xcrun simctl io booted screenshot` → 크롭 확인. 전 방·신규 장비·통로가 렌더되는지 눈으로 확인.
   (web export는 react-native-svg가 깨져 부정확 — 시뮬레이터/네이티브만 신뢰.)
5. `DECISIONS.md` provenance + 이 부서 문서 "구현 결과/편차" 갱신 + 커밋(Co-Authored-By 없음).

---

## 부서 문서 템플릿 (각 `<dept>.md` — Build Spec 4 아티팩트 압축형)
> 부서 맵은 콘텐츠 시리즈라 네 아티팩트를 **한 문서에 A/B/C/D 섹션**으로 접는다(`FRAMEWORK.md` "구현 스펙" 위치=압축).
> `er.md`가 기준 인스턴스.
```
---frontmatter: build-spec/stage/status/depth: compressed/updated---
# Build Spec — 5g-<x> · <부서명>   (메타 표: id·fixture·SoT·그리드·scale·playerStart)
## 개요 & 범위 (Index)      — 존 다이어그램(SoT 주석 그대로)·구획 원칙·깊이
## A. Domain & Entities      — regions[]·rooms[] · 오브젝트 배치(SoT 컴포넌트→type→좌표/props) · NPC 캐스트
## B. Business Rules         — collision(벽·gap) · threshold/door/glass/tint 통행 규칙 · footprint(솔리드 차단)
## C. Business Logic Model   — 엘리베이터/진입(entry) · 이동/카메라(공통 참조) · 시나리오 배선(마커→scenarioId 표)
## D. Frontend Components    — <dept>Equipment.tsx 카탈로그 · 공용 프리미티브 · 렌더 z-order(OVERHEAD/CEILING/마커)
## 검증 & 편차 (Index)       — tsc/jest/expo/시뮬 요약 · SoT 대비 의도적 편차
```
