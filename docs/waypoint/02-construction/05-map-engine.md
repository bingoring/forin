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

- 맵 엔진: [`../inputs/design-handoff/05_MAP_AND_INTERIORS.md`](../inputs/design-handoff/05_MAP_AND_INTERIORS.md)
- 캐릭터: [`../inputs/design-handoff/03_CHARACTERS.md`](../inputs/design-handoff/03_CHARACTERS.md)
- **캐릭터 모션(신규 2026-06-12):** [`../inputs/design-handoff/06_CHARACTER_MOTION.md`](../inputs/design-handoff/06_CHARACTER_MOTION.md)

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
(캠퍼스 야외 맵은 5c/후속). `react-native-svg` 추가.

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
  - **5b 전체 완료.**
- **5c — 캐릭터 모션 & 생명력**(신규, `06_CHARACTER_MOTION` 반영 — 미착수): §9 참조. 방향 전환·걷기·아이들·
  앰비언트 NPC 엔진. 5d 캠퍼스가 이를 소비하므로 5c→5d 순서.
- **5d — 캠퍼스 야외 맵 + 앰비언트 NPC 엔진**(후속, 기존 5c): 건물·prop + `useGridMover` patrol/wander NPC(5c 모션 사용).

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
- `down` 정면(현재 face), `up` 뒤통수(`backHead()` — 머리/모자 뒤, 얼굴·가슴마크 없음), `left`/`right` 3/4 측면
  (`sideFace()` — 한쪽 눈 + 코 범프). `left`=`right`를 **SVG 그룹 내부에서 미러**(`translate(64,0) scale(-1,1)`).
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
