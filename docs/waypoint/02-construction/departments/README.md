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
> 실사례다. **부서마다 디렉토리**를 만들고 네 아티팩트(+인덱스)를 **각각 별도 파일**로 둔다(템플릿을 맵 도메인으로 인스턴스화).

> **프로세스:** 부서 하나당 ① 이 폴더에 `<dept>/` 디렉토리를 만들고 **Build Spec 4 아티팩트 파일**(+ 인덱스)을
> 핸드오프에서 유도해 먼저 쓰고 → ② **스펙대로** 구현 → ③ 검증(§검증 프로토콜) → ④ 인덱스에 "구현 결과/편차" 기록.
> **`er/`가 상세도의 기준 인스턴스.**

## 인덱스
> 각 부서 = 디렉토리(`<dept>/build-spec-index.md` + `domain-entities.md`·`business-rules.md`·`business-logic-model.md`·`frontend-components.md`).

| 부서 | 스펙 | 상태 | interior id | 핸드오프 소스 |
|---|---|---|---|---|
| ER 응급의료센터 | [er/](er/build-spec-index.md) | ✅ 구현 (**참고 기준**) | `INT-ER-00001` | `interior-er.jsx` + `interior-objects-er{,2,3}.jsx` |
| OR 수술실+PACU | [or/](or/build-spec-index.md) | ✅ 구현 | `INT-OR-00001` | `interior-or.jsx` + `interior-objects-or2.jsx` |
| ICU 중환자실 | [icu/](icu/build-spec-index.md) | ✅ 구현 | `INT-ICU-00001` | `interior-icu.jsx` + `interior-objects-icu2.jsx` |
| Peds+NICU 소아 | [peds/](peds/build-spec-index.md) | ✅ 구현 (v13) | `INT-PEDS-00001` | `interior-peds.jsx` + `interior-objects-peds2.jsx` |
| Pharmacy 약국 | [pharma/](pharma/build-spec-index.md) | ✅ 구현 (v13) | `INT-PHARMA-00001` | `interior-pharma.jsx` + `interior-objects-pharma2.jsx` |
| 내과 병동 | [ward/](ward/build-spec-index.md) | ✅ 구현 (v13) | `INT-WARD-00001` | `interior-ward.jsx` + `interior-objects-ward2.jsx` |
| 외과 병동 | [surgward/](surgward/build-spec-index.md) | ✅ 구현 (v15) | `INT-SURGWARD-00001` | `interior-surgward.jsx` + `interior-objects-surg2.jsx` |
| 정형 병동 | [orthoward/](orthoward/build-spec-index.md) | ✅ 구현 (v15) | `INT-ORTHOWARD-00001` | `interior-orthoward.jsx` + `interior-objects-ortho2.jsx` |
| 피부과 센터 | [dermcenter/](dermcenter/build-spec-index.md) | ✅ 구현 (v15) | `INT-DERM-00001` | `interior-dermcenter.jsx` + `interior-objects-derm2.jsx` |

핸드오프 경로: `../../inputs/design-handoff_v16/reference/` (**현행 v16**). 이력: v10→v11 장비 2.5D화 · v11→v12 변화없음(캠퍼스 건물만) · v12→v13 장비 접지 그림자 추가 · v13→v14 병동 3종 방배치 정정 · v14→v15 PneumaticTube 그림자 · v15→v16 **병동 3종 rows 압축(46/46/44)·특수실 상향·커튼 h6·derm rows50 + 신규 부서 20종 추가**.

> **v16 신규 부서 20종** 반영 계획: [v16-new-departments-plan.md](v16-new-departments-plan.md) (WOMEN·DX·ONCO·ADMIN 4개 건물 빈 층 채움).

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

### v13 2.5D 장비 규약 (필수 — 신규 부서는 그대로 따름)
핸드오프 v11에서 장비를 **평면 2D → RPG-Maker 2.5D**로, v13에서 **접지 그림자**를 추가함. 장비 포팅 규약:
- **통합 실루엣**: 몸체를 둥근 모서리(`Q` 커브) `Path` 하나로 fill → 마지막에 같은 `d`로 재-stroke(외곽선).
- **명시적 TOP 면**: 상단을 더 밝은 색 별도 `Path`로(예 몸체 #8A929B / 상단 #A6ADB5), 상단↔전면 경계에 **seam** `Line`.
- **viewer-facing 전면 패널**: 화면·노브·드로어를 전면에. 바퀴는 어두운 `#2C3239` Ellipse.
- **접지 그림자 (v13)**: **바닥형** 오브젝트마다 `<Svg>` **첫 자식**으로 `<Ellipse cx cy rx ry fill="rgba(0,0,0,0.16)"/>`(밑면). 벽걸이/천장(캐비닛·보드·모니터뱅크·수술등·커튼·얇은 IV/의자)은 **미추가**.
- `shapeRendering`는 RN 기본값. CSS `drop-shadow` filter는 **생략**(RN 미지원 — v13에서 핸드오프도 이걸 제거하고 접지 타원으로 대체).
- 구현 완료(ER/OR/ICU/shared): 4개 파일이 v11 2.5D + v13 접지 그림자까지 반영됨. 예시 = `sharedEquipment.tsx` CrashCart/Ventilator/Pyxis/SinkOR, `icuEquipment.tsx` CRRT/TTM.

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
4. **화면 단위 핸드오프 대조**(핵심):
   - **4-a 앱 캡처:** Metro(`expo start`, 8081) + `xcrun simctl openurl booted "exp://127.0.0.1:8081/--/interior/<INT-ID>?ex=<t>&ey=<t>"`로 방마다 스폰 → `xcrun simctl io booted screenshot` → 크롭. 전 구역을 커버. (딥링크 반복 시 Expo Go가 홈으로 튕김 → `openurl exp://127.0.0.1:8081`로 클린 리로드 후 재시도.)
   - **4-b 핸드오프 ground truth 렌더:** `inputs/design-handoff_v13/reference/_hoff-harness.html`(재사용) — 디자인 JSX를 Chrome headless로 전체 바닥 flat-render. `python3 -m http.server 8770` (현행 v13 reference dir) 후
     `"Google Chrome" --headless=new --window-size=<cols*32>,<rows*32> --virtual-time-budget=15000 --screenshot=/tmp/hoff-<x>.png "http://localhost:8770/_hoff-harness.html#<DEPT>"` (해시=OR/ICU/PEDS…). 부서 추가 시 하네스 `<script>` 목록에 해당 `interior-*.jsx`·`interior-objects-*2.jsx` 추가.
   - **4-c 대조:** 4-a ↔ 4-b를 구역별로 비교, 오브젝트·좌표·NPC·마커·팔레트 일치 확인 후 편차만 §편차에 기록.
   - (web export는 react-native-svg가 깨져 부정확 — 시뮬레이터/네이티브만 신뢰.)
5. `DECISIONS.md` provenance + 이 부서 문서 "구현 결과/편차" 갱신 + 커밋(Co-Authored-By 없음).

---

## 부서 디렉토리 구조 (`<dept>/` — Build Spec 4 아티팩트 + 인덱스)
> 부서마다 아래 5파일. 각 아티팩트 템플릿은 `_templates/build-spec/`. `er/`가 기준 인스턴스.
```
<dept>/
├── build-spec-index.md      — 메타 표(id·fixture·SoT·그리드·scale·playerStart) · 개요/존 다이어그램 ·
│                              아티팩트 매니페스트 · 분해 · 미해결질문 · 체크리스트 · 검증 · 편차
├── domain-entities.md       — regions[]·rooms[] · 오브젝트 배치(SoT 컴포넌트→type→좌표/props) · NPC 캐스트 · allowed-set
├── business-rules.md        — collision(벽·gap) · threshold/door/glass/tint 통행 규칙 · footprint(솔리드 차단) · 엣지케이스
├── business-logic-model.md  — 엘리베이터/진입(entry) · 이동/카메라(공통 참조) · 시나리오 배선(마커→scenarioId 표)
└── frontend-components.md   — <dept>Equipment.tsx 카탈로그 · 공용 프리미티브 · 렌더 z-order(OVERHEAD/CEILING/마커)
```
> 맵 도메인 매핑: 공통 규칙/파이프라인은 `er/`를 참조하고 부서 고유만 각 파일에 상세.
