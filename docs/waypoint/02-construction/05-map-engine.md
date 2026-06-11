---
phase: 02-construction
stage: 05-map-engine
status: AI_PROPOSED
updated: 2026-06-10
---

# [Stage 2-5] 맵 / 탐험 엔진 (품질 축)

## 목적

타일 기반 캠퍼스/인테리어 엔진 — 자연스러운 이동·충돌·룸마스크·맵 간 전환, 캐릭터/Face SVG.
forin 품질 3대 축 중 하나(자연스러운 탐험).

## 입력 (Inputs)

- 맵 엔진: [`../inputs/design-handoff/05_MAP_AND_INTERIORS.md`](../inputs/design-handoff/05_MAP_AND_INTERIORS.md)
- 캐릭터: [`../inputs/design-handoff/03_CHARACTERS.md`](../inputs/design-handoff/03_CHARACTERS.md)

## 체크리스트

- [ ] 타일 렌더러(ITILE 16·ZOOM 2), 바닥 프리베이크/가시 오브젝트 렌더(성능)
- [ ] **충돌맵**(저작 레이어) + 이동(D-pad + 탭-투-패스, reanimated)
- [ ] 룸마스크("한 방만 밝게") + 리전 전환 오버레이, 카메라 팔로우
- [ ] 캐릭터 `Sprite`/`Face`(react-native-svg) + 결정적 외형 해시
- [ ] 인테리어 오브젝트 카탈로그 포팅, 핫스팟 → 브리핑 진입, fast-travel

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

- **5a — 엔진 코어**: react-native-svg 설치 · 타일 렌더러·뷰포트·카메라 · D-pad/탭 이동+충돌 · 룸마스크·리전 전환 ·
  HUD·빠른이동 모달 · 핫스팟→네비. 콘텐츠 `collision` 필드(서버) + ER 시드. **단순 player 스프라이트**로 walkable 확인.
- **5b — 캐릭터·오브젝트 SVG**: Derp Sprite/Face(역할·표정·해시) + 오브젝트 카탈로그 포팅.
- **5c — 캠퍼스 야외 맵**(후속): 건물·prop.

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

## 검토 게이트 (Human Gate)

- [ ] 이동·충돌·전환이 자연스럽고 성능이 충분한가?
- [ ] 비주얼이 핸드오프와 일치하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `06-screens-flows.md`
