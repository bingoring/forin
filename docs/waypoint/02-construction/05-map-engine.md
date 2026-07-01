---
phase: 02-construction
stage: 05-map-engine
status: IN_PROGRESS
updated: 2026-06-11
---

# [Stage 2-5] 맵 / 탐험 엔진 (품질 축)

## 목적

타일 기반 캠퍼스/인테리어 엔진 — 자연스러운 이동·충돌·룸마스크·맵 간 전환, 캐릭터/Face SVG.
forin 품질 3대 축 중 하나(자연스러운 탐험).

## 입력 (Inputs)

- 맵 엔진: [`../inputs/design-handoff_v10/05_MAP_AND_INTERIORS.md`](../inputs/design-handoff_v10/05_MAP_AND_INTERIORS.md)
- 캐릭터: [`../inputs/design-handoff_v10/03_CHARACTERS.md`](../inputs/design-handoff_v10/03_CHARACTERS.md)
- **캐릭터 모션(신규 2026-06-12):** [`../inputs/design-handoff_v10/06_CHARACTER_MOTION.md`](../inputs/design-handoff_v10/06_CHARACTER_MOTION.md)

## 체크리스트

- [ ] 타일 렌더러(ITILE 16·ZOOM 2), 바닥 프리베이크/가시 오브젝트 렌더(성능)
- [ ] **충돌맵**(저작 레이어) + 이동(D-pad + 탭-투-패스, reanimated)
- [ ] 룸마스크("한 방만 밝게") + 리전 전환 오버레이, 카메라 팔로우
- [ ] 캐릭터 `Sprite`/`Face`(react-native-svg) + 결정적 외형 해시
- [ ] 인테리어 오브젝트 카탈로그 포팅, 핫스팟 → 브리핑 진입, fast-travel
- [ ] **캐릭터 모션(06):** 방향 전환(dir front/back/left/right) · 걷기(다리/팔 스윙+bob) · 아이들(호흡·깜빡임) ·
      앰비언트 NPC 엔진(patrol/wander·이모트·`useGridMover`) · **이동 정체성 고정 `seed`**

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 목표·범위

핸드오프 `05_MAP_AND_INTERIORS` 타일 엔진을 RN으로 포팅. forin 품질 3대 축 "탐험". 인테리어부터
(캐릭터 모션 5c → 캠퍼스 야외 맵 5d/후속). `react-native-svg` 추가.

### 1. 타일 엔진 (`src/map/`)

- 좌표계: `ITILE=16`, `ZOOM=2` → 화면 32px/타일. 오브젝트는 `left:x*32, top:y*32`.
- `TileFloor`: 부서 팔레트 2색 체커보드(성능: 바닥은 단일 프리베이크 레이어/단순 View 그리드, 가시 영역만).
- `InteriorScreen` 셸: TopBar(부서·HP) · 미션 배너 · 스크롤 뷰포트(바닥+오브젝트+player+RoomMask) ·
  리전 전환 오버레이("➜ 트라우마 룸") · 리전 배지 · HUD(ZONE·D-pad·A·빠른이동) · 빠른이동 모달.

### 2. 이동·충돌·카메라

- player `pos{x,y}`(타일). **D-pad**로 이동(경계+충돌 클램프) + **탭-투-패스**(reanimated). 스텝 bob.
- **충돌**: 인테리어 콘텐츠에 **저작 collision 레이어**(blocked 타일/사각형) 추가 — 1-3 결정. 엔진은 blocked 집합으로 판정.
  → Interior 콘텐츠에 `collision`(jsonb) 필드 추가(서버 마이그·시드 ER 갱신).
- **카메라**: ScrollView/Animated가 player 중심 추적.
- **룸마스크**: 현재 `region` 밖을 어둡게(4 패널) — 핸드오프 핵심 감성, 유지.
- 핫스팟 타일 진입 → **브리핑/시나리오 진입**(브리핑 화면은 2-6; 5에선 라우트로 네비게이트).

### 3. 캐릭터 (`src/characters/`, react-native-svg)

- `Sprite`(전신 ~40–52px) + `Face`(초상 ~80px) — "Derp 스무스" 스타일(03_CHARACTERS), outline `#3A2E26`.
- 역할 프리셋(player/nurse/doctor/patient…) + **12 표정** + **결정적 외형 해시**(hash(x,y,salt)).
- 5b에서 SVG 패스 본격 포팅; 5a는 단순화된 Sprite로 파이프라인 확립.

### 4. 인테리어 오브젝트

`interior-shared`/부서별 오브젝트(bed·monitor·IV·reception 등)를 react-native-svg로 포팅(2.5D 평면 fill).
5b에서 카탈로그 확장; 5a는 몇 개로 시작.

### 5. 구현 증분

- **5a — ✅ 엔진 코어**(2026-06-11): 타일 렌더러·뷰포트·카메라 팔로우 · D-pad/탭-투-워크(BFS)+충돌 · 룸마스크 ·
  리전 전환 배너 · HUD(ZONE·D-pad·A) · 빠른이동 모달 · 핫스팟→시나리오 네비. 서버 콘텐츠 `collision`(jsonb)
  필드 추가(마이그 000008 + sqlc 수동 갱신 + ER 시드: 외벽·트리아지↔트라우마 분리벽·룸/복도 도어웨이·오브젝트 타일).
  player/오브젝트는 **단순 View+이모지**(SVG·`react-native-svg`는 실제 사용처인 5b로 이연), 카메라/스텝은 plain state
  (reanimated 워클릿은 성능 패스에서). **검증: 순수 로직 jest 14/14**(coords·collision[BFS·도어웨이·미도달]·regions),
  **tsc 0 · expo-doctor 21/21 · 서버 `go build` 0**. ⚠️ collision **jsonb 라이브 왕복**은 Docker 미가동으로 미검증
  (동일 jsonb 패턴 기검증 + 빌드 통과 → 신뢰 높음). walkable·룸마스크·핫스팟 네비 **시각 확인은 사용자 `npx expo start`**.
- **5b — 캐릭터·오브젝트 SVG** (진행 중):
  - **5b-i ✅ 캐릭터 스프라이트**(2026-06-11): `react-native-svg` 설치 + `src/characters/Sprite.tsx` —
    레퍼런스 `forin-npcs-smooth.jsx`를 **1:1 포팅**(SmoothSprite, 헤어/모자 스타일, 역할 10종 ROLES,
    결정적 외형 해시, **12 표정**). `PlayerSprite`/`RoleSprite` export. InteriorScreen의 이모지 플레이어를
    실제 치비로 교체 + 시드 오브젝트에서 **NPC 파생**(reception→nurse, 점유 침대→patient). tsc 0·jest 14/14·doctor 21/21.
  - **5b-ii 인테리어 구조·오브젝트 ✅**(2026-06-11): **벽 가시화** — `Walls.tsx`가 collision(구조 벽)을 레퍼런스 `IWall`
    스타일 청키 벽으로 렌더, `TileFloor` 바닥 팔레트를 레퍼런스 IP 색(clinical `#E8E5D4`/`#DAD6C2` 등)으로 교정.
    **오브젝트 SVG**(`src/map/objects/`) — IBed(2×3, 환자 포함)·EKG 모니터·IReception·IDoor를 react-native-svg로 1:1 포팅,
    이모지 대체. **설계: 충돌=구조 벽만(collision 필드), 오브젝트는 타입별 footprint로 엔진이 차단**(`objectCollision`),
    **문은 type:'door' 오브젝트(충돌 없음=통행)** → 서버 스키마 변경 0(기존 objects/collision 필드 재사용). bed는 자체 occupant를
    그리므로 침대→환자 NPC 파생 제거(리셉션→간호사만). ER 시드/픽스처 갱신. **jest 18/18**(ER 레이아웃 도달성 4건 추가:
    트리아지/트라우마 도달·문 통행·footprint 차단). tsc 0·doctor 21/21·서버 go build 0.
  - **5b-iii Face 초상 ✅**(2026-06-11): `forin-faces.jsx` → `src/characters/Face.tsx` 1:1 포팅 — 비주얼노블 스케일
    초상(viewBox -1 -4 18 22), HairPlate 10종·**12 표정**·마스크·역할 프리셋(`RoleFace`/`FacePlayer`). Sprite와 동일
    identity 어휘(Expression/HairStyle/RoleKind 타입 공유). 시나리오 브리핑 스텁에 환자 초상(pain) 미리보기 배선
    (전체 대화 UI는 2-6). tsc 0·jest 18/18·doctor 21/21.
  - **5b 캐릭터 머리 시스템 v6 갱신**(2026-06-18, handoff v6): hairStyle에 `ponytail`(높은 빨간끈+S꼬리)·`balding`(휑한 정수리·귀위 패치) 추가. 정면/측면/후면을 **각각 별도 플레이트**로 — **`hairSide()` 신규**(스타일별 측면 머리: 귀 노출+뒤로 스윕), `backHead()`를 공통 돔→**스타일별**로 교체, hairBack은 정면(dir=down)만. 렌더: 측면=`hatSide`|`hairSide`. ROLES 자동배정은 불변(두 스타일은 명시 사용 시 노출). tsc 0·jest 25/25·doctor 21/21.
  - **5b 전체 완료.**
- **5c — 캐릭터 모션 & 생명력**(신규, `06_CHARACTER_MOTION` 반영): §9 참조. 5d 캠퍼스가 소비하므로 5c→5d 순서.
  - **5c-i ✅ 방향 전환 + 안정 seed + 그리드무버**(2026-06-15): `Sprite`에 `dir`(front/back/side, **left는 SVG 그룹 내부
    미러** `translate(64,0) scale(-1,1)` — 5a 크래시 회피)·`seed`·`walking` prop 추가, v2 `forin-npcs-smooth` 구조로 포팅
    (backHead/sideFace, dir별 게이팅). `RoleSprite`는 seed로 안정 해시. `useMovement`가 `dir`(facing)·`walking` 노출,
    플레이어가 이동 방향을 바라봄. **`gridmover.ts`(순수 patrol 핑퐁/wander 경계클램프) + `useGridMover` 훅(이모트·케이던스)**.
    **jest 24/24**(gridmover 6건 추가: patrol 핑퐁·길이1·wander 경계이탈 전수). tsc 0·doctor 21/21. 애니는 5c-ii.
    - **v3 측면 프로필 보강**(2026-06-15, handoff v3): 측면 뷰가 제대로 된 실루엣 — 측면 모자 `hatSide`(챙·간호 십자/배지가
      앞쪽), 좁은 측면 몸통+뒷면 음영, **가슴마크 숨김**, **팔 1개**(몸통에 붙임), **다리 1개**(겹쳐 중앙). `facingSide`로 분기. tsc 0·jest 24/24.
  - **5c-ii ✅ 모션 애니**(2026-06-15, reanimated): react-native-svg는 SMIL 미지원이라 **reanimated `useAnimatedProps`로
    SVG 그룹 애니**. `SwingLimb`(AnimatedG, 힙/어깨 피벗 회전, walking 게이트)로 다리 ±10°/팔 ±8° 교차 스윙(측면은 단일
    팔·다리 ±12°), `Animated.View`로 몸통 walk-bob + 아이들 호흡(translateY+scaleY), **깜빡임**(눈꺼풀 Rect opacity 펄스,
    정면 한정), 모두 인스턴스별 랜덤 `phase`로 desync. babel: `babel-preset-expo`가 worklets 플러그인 자동 주입(확인). tsc 0·
    jest 24/24·doctor 21/21. ⚠️ **애니는 시각 전용 — 디바이스 검증 필요**(여러 라운드 예상).
  - **5c 피드백 반영 R1**(2026-06-16, handoff v4): ① **이동 속도** 과도 → `useMovement` 케이던스 110→330ms(한 보폭),
    walking 유지 460ms. ② **좌우 미러**를 문자열 transform(`scale(-1,1)`)→**origin-aware `originX=32`/`scaleX`**로 교체
    (react-native-svg 문자열 파싱 차이가 우측=좌향 의심 원인). ③ **측면 다리(v4)**: 단일 다리 → **중앙 2다리 ±22° 반대위상
    교차**(먼 다리 어둡게) + 측면 팔(±20°)을 몸통 위로 분리 — `forin-npcs-smooth` v4 반영. tsc 0·jest 24/24·doctor 21/21.
    ⚠️ ②는 기하상 기존도 맞아야 해 **디바이스 재확인 필요**(여전히 반대면 `flip` 조건 반전).
  - **5c 피드백 반영 R2**(2026-06-16): 근본 원인 = **칸 이동이 글라이드가 아니라 즉시 점프**(레퍼런스는 left/top에
    CSS `transition .3s`). ① **위치 글라이드**: InteriorScreen이 플레이어 픽셀 위치 + 카메라를 reanimated `withTiming`
    300ms로 트윈(즉시 점프 제거) → 부드럽게 '이동'. ② 글라이드 동안 `walking`=true라 **사지 스윙이 실제로 보임**(기존엔
    점프라 거의 안 켜짐). ③ **호흡**: 클럭을 연속 선형(0.5s/3.2s) + `gate`로 walk/idle 선택하도록 정리 → 정지 중 **상시
    연속 호흡**(이전엔 잠깐만·속도 꼬임). 케이던스 STEP_MS 300·WALK 360. tsc 0·jest 24/24·doctor 21/21.
    ⚠️ 사지 스윙은 reanimated `useAnimatedProps` 회전 — 여전히 안 보이면 animatedProps 회전 미작동이므로 transform 방식으로 교체.
  - **5c 피드백 R3 — 애니 정지 버그**(2026-06-16): 원인 = **`withRepeat(withTiming(1), -1, false)`는 ramp를 루프하지
    않고 1에 고착**(이후 1→1=정지) → 호흡·스윙이 한 사이클 후 멈춤. **`reverse=true`(핑퐁 0↔1)** 로 교체해 연속화.
    호흡 진폭 1px→**2.5px+scaleY 0.02**(70px 스프라이트에서 보이도록), 정지 중 상시. `SwingLimb`는 핑퐁 클럭에 맞춰
    `dirSign`(anti-phase)으로 회전. tsc 0·jest 24/24·doctor 21/21. ⚠️ 이번 라운드로 호흡(View 애니)은 확실히 연속될 것.
    **확인됨(호흡O·스윙X): `G`의 회전 animatedProps 미작동** → R4에서 limb 회전을 **transform 배열**(translate→rotate→translate)로 교체.
  - **5c 피드백 R5 — 스텝 동기 보행**(2026-06-16): 핸드오프 `forinWalkBob`(0.5s에 -1.5px **2번**=두 걸음)처럼, 한 칸
    이동이 **정확히 2개의 포물선 hop + 2걸음(다리 교차)** 이 되도록 모션을 **스텝 진행도에 동기화**. InteriorScreen이
    `walkClock`(0→1, 스텝마다 재발화)을 소유해 플레이어에 전달 → Sprite의 hop(`-|sin(step·2π)|·hopH`)·다리 스윙
    (`sin(step·2π)`)이 이동과 맞물림. 자유 클럭(비동기) 제거. hop 높이는 크기 비례(width·0.05). 속도 300→**240ms**(요청).
    Sprite `walkClock` prop은 NPC(useGridMover)도 쓸 엔진 인터페이스. tsc 0·jest 24/24·doctor 21/21.
    - **팔 백스윙**(2026-06-16, `feat/arm-backswing`→master 머지): 팔 스윙에 `backRatio`(앞=풀, 뒤=0.45) 추가 +
      진폭↑(정면 15°·측면 26°) → 앞·뒤 양방향(뒤는 약간). 다리는 대칭 유지. 사용자 확인 후 머지.
  - **옆모습 입 위치**(2026-06-16, handoff v5): 측면 입을 얼굴 중앙→**앞쪽 가장자리(코 아래)** 로 이동(부자연 교정). sideFace 입 경로만 변경.
  - **5c 전체 완료(애니 디바이스 튜닝 반복 중).**
- **5d — 캠퍼스 야외 맵 + 앰비언트 NPC 엔진 + 인테리어 확장**:
  - **5d-i patrol 속도 버그 수정**(2026-06-16): patrol이 웨이포인트를 "한 스텝"으로 점프(멀리 떨어진 점 사이를 한 틱에 글라이드 → 미친 속도) → **목표 웨이포인트로 한 칸씩** 이동하도록 수정(wander와 동일 속도). jest로 "한 틱=한 칸·ping-pong" 검증(25/25).
- **5d-i ✅ 앰비언트 NPC 엔진 + 이모트**(2026-06-16): `useGridMover`를 **`AmbientNpc`** 컴포넌트로 화면에 연결 —
    patrol/wander NPC가 실제 이동(5c 보행: 글라이드+스텝 hop+사지 스윙)하고 **`EmoteBubble`**(머리 위 감정 이모지 pop)을 띄움.
    NPC는 인스턴스별 격리(자체 mover/timer), 안정 `seed`로 외형 고정. Interior에 `npcs?` 필드 추가 → InteriorScreen 렌더.
    **ER에 doctor patrol + patient wander**(즉시 확인), **캠퍼스 fixture 신설**(`grass` 바닥·건물 collision placeholder·
    nurse/visitor/patient/child/doctor) + 캠퍼스 탭 "🗺 캠퍼스 둘러보기" 진입. ⚠️ NPC는 현재 **클라이언트 fixture**(서버
    interior `npcs` 필드는 후속) · 건물 **placeholder 블록**(아트 5d-ii) · wander는 `bound`만 따름(open bound로 배치).
    tsc 0·jest 24/24·doctor 21/21. 시각 = 디바이스.
  - **5d-ii ✅ 캠퍼스 아트**(2026-06-18): `screens-explore-v2.jsx`의 **Building**(지붕 top-face+벽+창+문+레드크로스·어닝, 파라메트릭 w/h/roof/label)·**Tree**(2.5D 캐노피)를 오브젝트로 포팅. 캠퍼스 fixture 재작성 — 종합병원/외래클리닉/약국 건물 + 나무 5그루(잔디 위), placeholder 블록 제거. **오브젝트 footprint를 props.w/h로**(건물 가변크기) 차단, `collision`은 외곽선만. 나무는 trunk(1×1)만 차단·캐노피 오버행. tsc 0·jest 25/25·doctor 21/21. ⚠️ 경로/플라자 바닥·prop(벤치 등) 추가·y-깊이정렬은 후속.
    - **v7 플래그십 랜드마크**(2026-06-18, handoff v7): 캠퍼스에 4종 대표 건물 — **본관(MedCenter)·외래(MedCenterH)·의과대학(MedCenterV 돔)·암병원(MedCenterC 곡면유리+접시조형)** + `Building`에 `arch`(pitched/flat/tower/glass) 추가. 현재는 **경량 반영**(범용 Building에 이름/지붕/엠블럼·🎓🎗🩺로 4동 명명), Building에 `emblem` prop 추가. **베스포크 랜드마크 아트(그라데이션/글로우/다중타워·곡면유리)는 전용 캠퍼스 화면 증분으로 정식 포팅**(아래 5d-v). tsc 0·jest 25/25·doctor 21/21.
  - **5d-iii ✅ 외래 클리닉 엔진**(2026-06-18): `interior-clinics.jsx`의 `ClinicInterior`를 **config 기반 `clinicInterior(cfg): Interior` 생성기**로 포팅(`src/map/clinic.ts`) — 표준 평면(접수+대기 → 진료실 3 → 처치실)을 데이터로 생성, **부서 추가 = config 1개**. 4과(내과/외과/정형외과/피부과) 생성·FIXTURES 등록·캠퍼스 탭 진입 버튼. **신규 바닥 테마** internal/surgery/ortho/derm. **장비 13종**(`objects/clinicEquipment.tsx`): UltrasoundCart·XrayViewbox·CastCart·Crutches·DermLamp·LaserUnit·ExamStool·SkincareShelf·BoneModel·ClinicReception·Cabinet·Chair·Plant. 방마다 진입문(x3/x10/x17)으로 도달성 확보. **jest 28/28**(클리닉 도달성 3건). tsc 0·doctor 21/21. ⚠️ NPC는 클라이언트 fixture·정적(**`mode:'idle'` 정면 고정** — 2026-06-19 수정, 기존 1×1 wander는 facing이 계속 바뀌던 문제), 시나리오 연결은 placeholder id.
  - **5d-iv ✅ 화면별 줌/스케일**(2026-06-18): `Interior`에 **`scale?: number`**(기본 1) 추가. `InteriorScreen`의 월드 컨테이너에
    `transform`에 `{scale}` 추가 + **`transformOrigin:'top left'`** 로 월드→스크린 매핑을 선형화(`screen = translate + scale·world`).
    카메라 클램프를 **스케일드 px**(worldW·scale 등)로 계산해 플레이어가 화면 중앙에 유지되도록 보정. 캠퍼스는 `scale:0.7`(멀리서·사물
    작게), 인테리어/클리닉/ER은 기본 1. **탭 좌표(locationX/Y)는 월드의 비변환 로컬 공간** 이므로 `÷TILE` 그대로(스케일 무관). tsc 0·jest
    30/30·doctor 21/21. ⚠️ 변환된 Pressable의 locationX 좌표계는 플랫폼별 차이 가능 → 스케일<1에서 탭 정합은 디바이스 확인 필요.
  - **5d-v ✅ 플래그십 랜드마크 베스포크 아트**(2026-06-18, handoff v7): `screens-explore-v2`의 4종 랜드마크를 RN으로 포팅(`src/map/objects/landmarks.tsx`). **신규 오브젝트 타입 `landmark`** — `props.landmark`로 파사드 디스패치: `default`=**본관 MedCenter**(다크글래스+앰버 아트리움+화이트스톤 3타워+연결브리지+포디움), `victorian`=**의과대학 MedCenterV**(벽돌 `Pattern`+슬레이트 맨사드+도머창+모서리 터릿+구리 돔+랜턴, react-native-svg 직접 포팅), `curved`=**암병원 MedCenterC**(볼록 곡면유리 타워+지붕 접시 조형물+그린글래스 포디움), `horizontal`=**외래 MedCenterH**(다크글래스 리본창+화이트 차양핀 5층+옥상 파라펫+필로티). **그라데이션/글로우는 솔리드+레이어 근사**(MedCenter/H/C는 View 기반, MedCenterV만 SVG `Pattern`/`Path`로 직접 포팅). 파사드는 풋프린트 위로 솟음(overflow visible), **차단은 `props.w/h` 풋프린트만**. 캠퍼스 4동을 범용 Building→landmark로 교체. **jest 30/30**(캠퍼스 풋프린트 비중첩+회랑 도달성 2건 추가). tsc 0·doctor 21/21. ⚠️ CSS 선형그라데이션·box-shadow 글로우는 RN 미지원 → 솔리드 근사(시각 충실도 일부 손실), 추후 `expo-linear-gradient` 도입 시 고도화 가능.
  - **참고:** 캠퍼스 화면은 현재 인테리어 엔진(`InteriorScreen`) 재사용한 **통합/검증용**이며 전용 캠퍼스 화면 chrome은 본격 화면 개발(2-6/전용)에서.
    Building 지붕은 **`roofPattern`(solid/grid…) 확장형**(추후 무늬·지붕 오브젝트 추가 가능), 모든 지붕 grid 강제 안 함.
- **5e ✅ 재사용 픽셀 게임 엔진 추출**(2026-06-18): 제네릭 커널을 **`mobile/src/engine/`** 로 추출(`@engine` alias). 이전 모듈: 순수
  로직 `coords/collision/regions/gridmover/footprint` + 데이터 `types` + 훅 `useMovement/useGridMover` + 캐릭터 `Sprite/Face` +
  무상태 레이어 `TileFloor/Walls/RoomMask/AmbientNpc/EmoteBubble`. **forin 콘텐츠는 앱 잔류**: 오브젝트 렌더러(`objects/*` 침대·
  클리닉장비·랜드마크), 픽스처(`fixtures/*`,`clinic.ts`), 화면 chrome(`HUD`,`FastTravelModal`), 화면 합성(`InteriorScreen`). **의존성
  역전은 합성(composition) 방식** — 엔진은 forin을 전혀 import하지 않고(검증: `src/engine`에 `@/`·상위상대 import 0), 앱이 엔진
  프리미티브 위에 자기 콘텐츠를 얹음. 디커플 2건: `useMovement`가 `objects` 배럴 대신 `footprint` 직접 참조, `EmoteBubble`가 앱 토큰
  대신 로컬 INK 상수. 배럴 `index.ts`(`export *`, 이름충돌 0) + 단위테스트는 deep import(`@engine/coords` 등, RN 컴포넌트 비적재).
  **검증: tsc 0·jest 30/30·`expo export`(Metro 번들 1601모듈 성공)·doctor 21/21.**
  - **위치 결정(`src/engine` vs `packages/`):** 레포에 루트 워크스페이스가 없고 `node_modules`가 `mobile/`에 단 하나라, 런타임 패키지를
    앱 루트 밖에 두면 tsc·Metro가 `react`/`react-native`를 해소 못 함(워크스페이스 툴링 필요). `packages/contract`는 **type-only
    aliased source**라 무료지만 엔진은 런타임 코드. → `src/engine`에 두어 무설정으로 동일한 forin-디커플·배럴 경계를 확보. `packages/
    pixel-engine`으로의 물리 승격은 npm workspaces + 루트 node_modules가 필요한 **인프라 후속**(별도). 상세는 `src/engine/README.md`.

### 5v. v8 재설계 — 2-5 재오픈 (HUMAN_APPROVED 2026-06-27, 5f-i ✅; 다음 5f-ii)

> 핸드오프 v8(맵/화면 대규모 재설계) 반영 계획. 사용자 결정: **계획 먼저 수립→승인 후 빌드**, **클리닉 엔진(5d-iii)은
> 보존·후일 은퇴**(bespoke 병동/센터가 대체하면 해당 캠퍼스 버튼/화면만 제거). 기존 5a~5e 엔진 코어는 유효 — 아래는 v8이
> 추가/대체하는 부분. 적응형 깊이: 엔진 기반(5f) 상세, 반복적 인테리어(5g) 부서당 1증분으로 목록화(빌드 시 각 심화).

**5f — 캠퍼스·엔진 델타 (engine/map)**
- **5f-i ✅ 5-파빌리온 캠퍼스 + 2.5D 빌딩 top-face 규약**(2026-06-27): `buildings-v2.jsx`를 RN으로 포팅 — `landmarks.tsx`
  전면 재작성. 핵심 신규 = **`Block3D`**(front face + 직사각형 TOP face 압출 = 2.5D 규약). 5종 빌딩 + 시계탑: `main` 본관(다크글래스/
  화이트스톤/앰버아트리움 3타워+브리지+포디움) · `horizontal` 외래·진단(차양 리본 파사드+상단 루프) · `victorian` 여성소아(벽돌 SVG +
  평지붕 슬래브 + 저층 큐폴라, 첨탑→평탑) · `curved` 암센터(에코타워: 크림 파사드+세로 그린 가든 리본+유리베이+우드 베이스+루프가든) ·
  `admin` 행정(평탄 압출 블록) · `clock` 시계탑(목조 샤프트+덩굴+시계 헤드). **포팅 방식: 레퍼런스 px(TILE16)로 그리고 부모에서
  `transform:scale(TILE/16)`**(L() 산재 제거). 그라데이션/글로우는 솔리드+레이어 근사(기존 패턴 일관·무신규의존; expo-linear-gradient
  고도화는 후속 가능). 캠퍼스 fixture 40×28 재작성(본관 중앙·암센터 좌·여성소아 우·외래/행정 하단·시계탑 정원, scale 0.6). **jest 36/36**
  (campus.test 6 랜드마크 비중첩+회랑 도달성 갱신). tsc 0·expo export 번들·doctor 21/21. ⚠️ 시각 충실도(2.5D top-face·그라데이션
  근사·캠퍼스 배치)는 **디바이스 확인** 항목. 엘리베이터 진입은 5f-ii(현재 캠퍼스는 시각 탐험; 클리닉 버튼은 유지).
- **5f-ii ✅ 엘리베이터 진입 모델**(2026-06-27): 파빌리온 진입이 곧장 인테리어가 아니라 **엘리베이터**를 엶.
  `ElevatorScreen`(`src/map/ElevatorScreen.tsx`): 건물 탭 5 · 픽셀 cab(층 표시 + 방향 ▲▼ + reanimated 슬라이딩 도어) ·
  층 디렉터리(층별 부서 + **실시간 상황칩 🔴긴급/🟡진행/🟢정상**) · GO 바. **공유 시나리오 소스** `src/content/scenarios.ts`
  (`getTodaysActiveScenarios`: 날짜 시드 결정적 일일 회전, 쿼터 ER2/OR1/ICU1/PEDS1/PHARMA1 = 6/일; 28 시나리오 메타) —
  **상황판과 동일 소스**가 될 단일 진실원(현재는 칩 구동; 풍부 콘텐츠는 2-6). `ELEVATOR_BUILDINGS` 5건물 층맵(타워 1F ER/약국…
  8F 병동), 빌트 인테리어 있는 층만 `interior`(타워 1F→ER, 2F→내과외래), 나머지 GO→"준비 중". **라우팅으로 구현**(reference는
  in-screen overlay였으나 RN 관용상 route `app/elevator/[building]` + 캠퍼스 파빌리온 핫스팟(kind:'elevator')→push; 동작 동등).
  Hotspot 타입에 `building?` 추가. 캠퍼스 fixture에 5 파빌리온 엘리베이터 핫스팟. **jest 41/41**(+scenarios 4: 결정성·쿼터·deptCounts;
  +campus 1: 핫스팟 도달성). tsc 0·expo export 번들·doctor 21/21. ⚠️ 칩은 실제 today 기준(reference는 데모 고정일). 화면 시각 확인은 디바이스.
- **5f-iii ✅ 신규 프리미티브 + 대형맵 컬링**(2026-06-27): **가시 오브젝트 컬링**(`src/engine/cull.ts` 순수 `viewBounds`/`boxInView`)
  — InteriorScreen이 플레이어+뷰포트+scale로 가시 타일 윈도를 구하고 objects/hotspots/derived·ambient NPC를 그 안의 것만 렌더
  (tall 아트는 위로 솟는 `rise` 여유: landmark 16·기타 5타일; R-1 이연 컬링 회수, 40×60 대비). **구조 프리미티브**(`objects/structures.tsx`):
  `threshold`(IThreshold — 문짝 없는 어두운 통로, `tone:sterile` 파랑, **walkable**) · `glass`(IGlass — 유리벽, **차단**) ·
  `tint`(Tint — 반투명 바닥 오버레이, **non-blocking**, 바닥 위·오브젝트 아래 레이어). `objectCollision`이 door/threshold/tint
  skip, glass·footprint 오브젝트 차단. **jest 47/47**(+cull 4·footprint 2). tsc 0·expo export·doctor 21/21.
  ⚠️ **가구(NurseStationDesk/NurseDeskI/IReception 재정의)는 ER(5g-a) 등 첫 사용처에서 추가**(적응형 — 부서별 장비와 함께 포팅).
  컬링 pop-in/시각은 디바이스 확인.

**5g — 부서 인테리어 마스터 블루프린트 (콘텐츠 시리즈, 부서당 1증분)**
각 증분 = 레이아웃(타일 블루프린트) + 부서 오브젝트 카탈로그 포팅 + NPC/핫스팟. 클리닉 엔진은 그대로 두고, bespoke가
해당 부서를 대체하면 캠퍼스/엘리베이터의 클리닉 버튼만 새 화면으로 전환.
> **📁 부서별 상세 구현 스펙** = [`departments/`](departments/README.md) (handoff 라인 단위 오브젝트·NPC·마커 표). 부서마다 ①스펙 먼저 →②스펙대로 구현 →③검증. **[ER 문서](departments/er.md)가 상세도 기준선.** 아래는 요약 목록.
- **5g-a ✅ ER 마스터 블루프린트**(2026-06-28): 40×60 fixture(`fixtures/er.ts` ER_INTERIOR 재작성) — **공공 로비**(상단 전폭:
  앰뷸런스/정문 auto 도어 + 보안검색 scanner/detector + 원무과 reception + KTAS 트리아지 vitals/triageline + 대기 sofa/display) +
  **3열×3밴드 룸 그리드**(소생실 / 너스스테이션+Pyxis / 제1진료실 // 음압격리 / 소처치·봉합 / 제2진료실 // 정신격리 / 가족·임종 /
  제염실). **내부 존 경계 = `threshold`**(음압/제염 입구 sterile tone), **외부만 auto `door`**. 정신/임종/제염에 `tint`(파랑/웜/wet).
  **장비 16종 컴팩트 포팅**(`objects/erEquipment.tsx`): VitalsCart·IVPump·DressingCart·MedFridge·SecurityScanner·MetalDetector·
  BoltedBed·DeconShower·Sofa·WaitingDisplay·WasteBin·PPEStand·FloorDrain·ChemDrum·TriageLine·**NurseStationDesk**. NPC(idle 의료진+
  배회 환자/방문객)·핫스팟 4(시나리오 연결: er-hopkins-pain 등). 캠퍼스 "응급실 입장"·엘리베이터 타워 1F→INT-ER-00001 진입. **jest
  48/48**(ER: 방 도달성·threshold 통행·footprint 차단). tsc 0·expo export·doctor 21/21. ⚠️ 소품 ~15종(TissueBox·DeskPhone·
  ChartBinder·FramedPicture·FloorLamp·CoffeeTable·WaterCooler·BrochureRack·TicketDispenser·PressureGauge·Otoscope·AnatomyPoster·
  BarcodePrinter·WallTV·CCTVCamera) + 음압 전실/본실 IGlass 분할 + 제염 외부문은 **폴리시 후속**(룸 정체성은 핵심 장비로 확보).
- **5g-b OR+PACU**(40×52, 3-stage 존: 비제한/준제한/제한·양압, sterile threshold) — `or2`.
- **5g-c ICU**(34×44, 유리벽 1인실 ×4 + 중앙 허브 + 면회/Dirty/Med) — `icu2`.
- **5g-d Peds+NICU**(34×48, 외래·놀이·계측 → 진료 → 병동 → gowning→NICU) — `peds2`.
- **5g-e Pharmacy**(36×42, 수령·기송관 → 조제실+마약금고 → gowning→무균 cleanroom) — `pharma2`.
- **5g-f 내과 병동 ward**(28×52, 서비스 strip + 중앙 스테이션 + 4-bed 만성 + 1인/격리) — `ward2`. *(내과 외래 클리닉 은퇴 후보)*
- **5g-g 외과 병동 surgward**(28×52, 드레싱룸 + 스테이션·보행로 + 4-bed 술후 + 대수술 1인) — `surg2`. *(외과 외래 은퇴 후보)*
- **5g-h 정형 병동 orthoward**(28×52, 석고실 + DME bay + 견인/CPM 4-bed + 고관절 1인) — `ortho2`. *(정형 외래 은퇴 후보)*
- **5g-i 피부과 센터 dermcenter**(28×52, 로비·접수 + 진료실 ×2 + 광선치료 + 레이저처치) — `derm2`. *(피부과 외래 은퇴 후보)*

> **스테이지 귀속:** 5f·5g는 맵/인테리어 엔진+콘텐츠라 2-5에 둠. 엘리베이터/인테리어가 소비하는 **상황판·시나리오 진입 UI 본체**는
> 2-6. 5g 각 부서의 시나리오 콘텐츠(대화/퀴즈)는 콘텐츠 워크스트림. 빌드 순서 제안: **5f-i → 5f-ii → 5f-iii → 5g-a..i**.

### 6. 컴포넌트/모듈 분해 (적응형 깊이)

| 모듈 | 책임 |
|---|---|
| `src/map/coords.ts` | 타일↔px 변환(ITILE·ZOOM), 경계 클램프 — **순수** |
| `src/map/collision.ts` | 인테리어 `collision`+경계로 blocked 타일 집합 구성, `canEnter(x,y)` — **순수** |
| `src/map/regions.ts` | 좌표→현재 region 판정(bounds 내) — **순수** |
| `src/map/useMovement.ts` | player pos 상태, D-pad/탭 핸들러, 스텝 bob, 카메라 오프셋(reanimated) |
| `src/map/TileFloor.tsx` | 부서 팔레트 체커보드(가시영역/프리베이크) |
| `src/map/RoomMask.tsx` | 현재 region 밖 4패널 어둡게 |
| `src/map/HUD.tsx` · `FastTravelModal.tsx` | ZONE·D-pad·A·빠른이동 / 방 그리드 텔레포트 |
| `src/map/InteriorScreen.tsx` | 위 조합 셸(인테리어 데이터 props) |
| `src/characters/Sprite.tsx`·`Face.tsx` | 캐릭터(5b) |

데이터: `api.interior(id)`(클라이언트 헬퍼 추가) → 콘텐츠. 충돌은 `interior.collision`.

### 7. NFR · 성능 목표

- **60fps** 이동/스크롤. 바닥은 **단일 프리베이크/단순 그리드 + 가시영역 컬링**(26×60 타일에 전 타일 View 금지).
- 카메라 팔로우·스텝 bob은 **reanimated worklet(UI 스레드)** — JS 브리지 왕복 회피.
- 결정적 외형/스프라이트는 **memoize**(리렌더 시 재셔플·재생성 금지).
- 입력 지연 체감 최소(탭-투-패스는 경로를 미리 계산해 프레임마다 1스텝).
- 의존성 추가는 `react-native-svg`만.

### 8. 테스트·검증 계획

- **순수 로직 단위테스트(CLI 검증 가능)**: `coords`(타일↔px·클램프), `collision`(blocked/경계로 canEnter),
  `regions`(point-in-bounds) → **jest-expo** 도입 + 단위테스트. 충돌은 시각으로 못 잡으니 *반드시 테스트*.
- **타입체크 + expo-doctor**: 컴파일·구성.
- **시각·체감(시뮬레이터/기기)**: walkable·룸마스크·리전 전환·핫스팟 네비·fps — `npx expo start`로 **사용자 확인**.
  → 5a 후 한 번 디바이스에서 walkable + 룸마스크 확인 권장(피드백 반영).

### 9. 캐릭터 모션 & 생명력 (5c — `06_CHARACTER_MOTION` 반영, 2026-06-12 신규)

> 적응형 깊이(복잡·신규 축). 맵/인테리어 스프라이트 한정(Face 제외). 레퍼런스: `forin-npcs-smooth.jsx`(스프라이트),
> `screens-explore-v2.jsx`(앰비언트 엔진). prototype 전용 lazy-mount/canvas 동작은 **무시**(명시됨).

**9.1 방향 전환(`dir`)** — `Sprite`에 `dir: 'down'|'up'|'left'|'right'`(기본 down) 추가. 3개 그리기 경로 분기:
- `down` 정면(현재 face), `up` 뒤통수(`backHead()` — 머리/모자 뒤, 얼굴·가슴마크 없음), `left`/`right` 3/4 측면.
  **측면(v3): 제대로 된 프로필** — `sideFace()`(한쪽 눈+코) + `hatSide()`(측면 모자, 챙·십자/배지 앞쪽) + 좁은 측면
  몸통(뒷면 음영) + **팔 1개·다리 1개**(겹침) + 가슴마크 숨김. `left`=`right`를 **SVG 그룹 내부에서 미러**(`translate(64,0) scale(-1,1)`).
- ⚠️ **5a의 좌우반전 크래시 교훈 반영**: 미러는 **부모 View의 음수 scaleX가 아니라 `<Svg>` 그룹 transform**으로(레퍼런스대로). 이러면 안전.
- `dir`은 이동 델타에서 결정(플레이어=D-pad 입력, NPC=스텝 방향).

**9.2 걷기(`walking`)** — 다리 교차 스윙(±10°, 0.5s, 180° 위상차) + 팔 반대 스윙(±8°) + 몸통 수직 bob.
RN: `react-native-reanimated` 공유 클럭. 한 스텝(~320ms) 동안 on, 위치는 타일 간 timing(~0.3–0.55s)으로 트윈.

**9.3 아이들(서 있을 때 상시)** — 인스턴스별 랜덤 `seed`로 **desync**(군중 동시 펄스 방지). 호흡(수직 bob+~1% scale, 3.2s,
랜덤 음수 delay) + 깜빡임(피부색 눈꺼풀 Rect 2개를 ~120ms 덮음, ~5.5s 랜덤; 정면 한정). `!walking`일 때.

**9.4 앰비언트 NPC 엔진(캠퍼스, 5d에서 소비)** — `useGridMover({ mode, path|bound, tickMs, emoteChance })` →
`{x,y,dir,walking,emote}`. `patrol`(웨이포인트 왕복) / `wander`(rect `bound` 내 랜덤 1타일, 이탈 금지). 틱마다 ~22% 멈춤+
**이모트 말풍선**(💬😄🤔☕👍✨😮🩺📋❤️, pop-in). 케이던스 **1.8s**. 엔진은 **별도 컴포넌트로 격리**(틱마다 전체 맵 리렌더 금지).

**9.5 이동 정체성 고정(중요)** — 외형 해시가 `(x,y)`에서 나오면 이동 시 색이 **깜빡이는 버그**. → 역할 컴포넌트에 **안정
`seed` prop** 추가, 있으면 위치 대신 `seed`로 해시. 이동/앰비언트 NPC엔 **항상 고정 `seed`**. (정적 장식 NPC는 생략 가능.)

**9.6 분해/검증**: `Sprite`에 dir/walking/seed 추가(3뷰 분기·애니), `useGridMover`(순수 로직→**jest** 가능: 경계 클램프·
patrol 왕복·wander 이탈금지·seed 안정성), 플레이어 이동이 dir+walking 구동, 앰비언트 엔진 격리. 애니/비주얼은 시뮬레이터 사용자 확인.

## 검토 게이트 (Human Gate)

- [ ] 이동·충돌·전환이 자연스럽고 성능이 충분한가?
- [ ] 비주얼이 핸드오프와 일치하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `06-screens-flows.md`
