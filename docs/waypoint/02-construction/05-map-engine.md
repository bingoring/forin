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

- 맵 엔진: [`../inputs/design-handoff_v7/05_MAP_AND_INTERIORS.md`](../inputs/design-handoff_v7/05_MAP_AND_INTERIORS.md)
- 캐릭터: [`../inputs/design-handoff_v7/03_CHARACTERS.md`](../inputs/design-handoff_v7/03_CHARACTERS.md)
- **캐릭터 모션(신규 2026-06-12):** [`../inputs/design-handoff_v7/06_CHARACTER_MOTION.md`](../inputs/design-handoff_v7/06_CHARACTER_MOTION.md)

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
  - **5d-iii ✅ 외래 클리닉 엔진**(2026-06-18): `interior-clinics.jsx`의 `ClinicInterior`를 **config 기반 `clinicInterior(cfg): Interior` 생성기**로 포팅(`src/map/clinic.ts`) — 표준 평면(접수+대기 → 진료실 3 → 처치실)을 데이터로 생성, **부서 추가 = config 1개**. 4과(내과/외과/정형외과/피부과) 생성·FIXTURES 등록·캠퍼스 탭 진입 버튼. **신규 바닥 테마** internal/surgery/ortho/derm. **장비 13종**(`objects/clinicEquipment.tsx`): UltrasoundCart·XrayViewbox·CastCart·Crutches·DermLamp·LaserUnit·ExamStool·SkincareShelf·BoneModel·ClinicReception·Cabinet·Chair·Plant. 방마다 진입문(x3/x10/x17)으로 도달성 확보. **jest 28/28**(클리닉 도달성 3건). tsc 0·doctor 21/21. ⚠️ NPC는 클라이언트 fixture·정적(1×1 wander), 시나리오 연결은 placeholder id.
  - **5d-iv 화면별 줌/스케일**(계획, 사용자 요청 2026-06-18): 디자인상 **캠퍼스는 더 축소(멀리서, 사물 작게)**, 인테리어/대화는 더
    가깝게 본다. 현재 엔진은 모든 화면이 동일 TILE(32px) → **엔진에 화면별 스케일 파라미터** 추가(월드 컨테이너 transform scale,
    카메라 보정 포함). 본격 화면 개발 시 화면마다 스케일 지정(캠퍼스 작게). 별도 증분으로 구현(지금 미구현).
  - **5d-v ✅ 플래그십 랜드마크 베스포크 아트**(2026-06-18, handoff v7): `screens-explore-v2`의 4종 랜드마크를 RN으로 포팅(`src/map/objects/landmarks.tsx`). **신규 오브젝트 타입 `landmark`** — `props.landmark`로 파사드 디스패치: `default`=**본관 MedCenter**(다크글래스+앰버 아트리움+화이트스톤 3타워+연결브리지+포디움), `victorian`=**의과대학 MedCenterV**(벽돌 `Pattern`+슬레이트 맨사드+도머창+모서리 터릿+구리 돔+랜턴, react-native-svg 직접 포팅), `curved`=**암병원 MedCenterC**(볼록 곡면유리 타워+지붕 접시 조형물+그린글래스 포디움), `horizontal`=**외래 MedCenterH**(다크글래스 리본창+화이트 차양핀 5층+옥상 파라펫+필로티). **그라데이션/글로우는 솔리드+레이어 근사**(MedCenter/H/C는 View 기반, MedCenterV만 SVG `Pattern`/`Path`로 직접 포팅). 파사드는 풋프린트 위로 솟음(overflow visible), **차단은 `props.w/h` 풋프린트만**. 캠퍼스 4동을 범용 Building→landmark로 교체. **jest 30/30**(캠퍼스 풋프린트 비중첩+회랑 도달성 2건 추가). tsc 0·doctor 21/21. ⚠️ CSS 선형그라데이션·box-shadow 글로우는 RN 미지원 → 솔리드 근사(시각 충실도 일부 손실), 추후 `expo-linear-gradient` 도입 시 고도화 가능.
  - **참고:** 캠퍼스 화면은 현재 인테리어 엔진(`InteriorScreen`) 재사용한 **통합/검증용**이며 전용 캠퍼스 화면 chrome은 본격 화면 개발(2-6/전용)에서.
    Building 지붕은 **`roofPattern`(solid/grid…) 확장형**(추후 무늬·지붕 오브젝트 추가 가능), 모든 지붕 grid 강제 안 함.
- **5e — 재사용 픽셀 게임 엔진 추출**(계획, 사용자 요청 2026-06-16): `src/map`(타일·충돌·이동·카메라·gridmover)+`src/characters`
  (스프라이트·모션)를 forin 도메인과 분리해 **재사용 가능한 RN 픽셀게임 엔진 패키지**(예: `packages/pixel-engine`)로 추출.
  다른 프로젝트에서도 쓸 수 있게 의존성 역전(콘텐츠 스키마·아트는 주입). 맵/모션이 안정화된 뒤(5d 후) 착수. 순수 모듈
  (coords/collision/regions/gridmover)은 이미 forin 비의존이라 이전 쉬움. 인터페이스: `walkClock`/`dir`/`seed` 등 이미 엔진 지향.

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
