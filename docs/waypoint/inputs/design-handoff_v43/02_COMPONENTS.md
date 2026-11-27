# 02 · Components (reusable UI primitives)

Source: `reference/forin-ui.jsx`. Every primitive is documented with its props
and a React Native porting note. All use the pixel aesthetic (chunky ink
borders, hard offset shadows, square corners, pixel fonts).

> **Pixel shadow reminder**: web uses `box-shadow: Xpx Ypx 0 0 color` (no blur).
> In RN render a solid offset View behind the element — see `01_DESIGN_TOKENS.md`.

---

## PixelBox
Card / panel container.

Props: `bg=cream`, `border=ink`, `shadow=ink`, `p=12` (padding), `style`, `onClick`.
Look: `3px solid border`, `4px 4px 0 0 shadow`, square corners.

## PixelButton  ⭐ (has interactive states)
Primary button. **Two variants** via `variant`:
- `hud` (default): single solid offset shadow (`4px 4px 0 0 shadow`).
- `block`: four stacked 1px shadows fuse into a thick 4px "side wall" (3-D
  extruded block look).

Props: `bg=mint`, `color=ink`, `shadow=mintShadow`, `size='sm'|'md'|'lg'`,
`full` (bool, full width), `variant`, `onClick`, `disabled`.

Padding by size: sm `7×14`, md `11×20`, lg `14×26`. Font sizes 11/13/16.

**Bevel + press behavior (important):**
- A **top highlight strip** (3px, `bg` mixed 45% white) sits just inside the
  top border, and a **bottom shadow strip** (3px, `bg` mixed 30% ink) inside
  the bottom — together they make the cap look raised, lit from above.
- On **hover** (web): shadow grows (`6px 6px`).
- On **press/active**: the outer drop-shadow disappears (`box-shadow: none`) AND
  the two bevel strips **swap** (top becomes dark, bottom becomes light) — so a
  raised cap visually becomes a pressed-in recess. Light source stays "above."
- RN: implement with `Pressable` — track `pressed` state, swap the two strip
  colors and hide the offset shadow layer. ~70–80ms.

## PixelChip
Inline tag/pill. Props: `bg=yellow`, `color=ink`, `style`.
Look: `2px solid ink`, `padding 2×8`, font 10, no shadow (or tiny).

## StatBar
HP/EXP-style progress bar. Props: `label`, `value`, `max=100`, `color=mint`, `w=120`.
Look: white track, `2px ink` border, colored fill (`transition width .3s`), a
faint vertical-stripe overlay, and a `value/max` numeric label on the right.

## PixelHeart / PixelStar
SVG icons. Heart props: `size=12`, `filled=true`, `color='#EF4444'`. Star props:
`size=14`, `color=yellowDeep`. Both crisp pixel paths — port to `react-native-svg`.

## Flags (FlagUS / FlagKR / FlagJP / FlagDE) + PixelFlag
Small SVG pixel flags for the language/destination picker. `size` prop.
`PixelFlag` takes a `stripes` array for custom flags. Port to RN SVG.

## StatBar
HP/EXP-style progress bar. Props: `label`, `value`, `max=100`, `color=mint`, `w=120`,
`labelW`, `showPct`. Two readouts: `value/max` (default) or `NN%` when `showPct`
(with a fixed-width `labelW` label column — this replaced the old `RepRow`).
Look: cream track, `2px ink` border, colored fill (`transition width .3s`).

## StatTile / MiniStat / BadgeTile (data display)
- **StatTile** — large metric block: `label` (small), big `value`, `sub`, and a
  top-right `color` accent square. Used in Daily Growth Report.
- **MiniStat** — compact metric: big `value`, small `label`, a left `color`
  accent bar. Used in Review Lab stats.
- **BadgeTile** — collectible square (career badge / sticker slot). Props:
  `emoji`, `label`, `got` (earned, else faded+grayscale), `special` (yellow
  highlight), `tag` (corner ribbon e.g. "NEW").

## Highlight (marker pen)
Marker-pen text emphasis. Props: `color` (default yellow; mint etc.), `raised`
(adds a hard ink shadow). Wrap any inline text: `<Highlight>5명</Highlight>`.

## Badge
Small square status pill. Props: `bg`, `color`, `border`. Used for `! 3`,
`HERE`, `🔒 LOCKED`, `복습`, tag chips, `NEW`, etc. (8px DungGeunMo).

## Pips
n-of-m filled squares (difficulty / mastery meter). Props: `filled`, `total=3`,
`color`, `label`, `size=9`. Difficulty stars and Review-Lab mastery both use it.

## FilterTab
Pill tab with optional count badge. Props: `label`, `count`, `active`, `color`,
`onClick`. Active = `color` bg + ink text + shadow. Used by the Review Lab
category filter. (NOTE: the Event Board's `DeptTab` is a **specialized variant**
— icon + inverted white-on-dept-color active state for dark department colors —
kept separate; the Event Board summary `Counter` is also its own compact form.)

## PixelDropdown
Pixel select. Props: `label`, `value`, `items = []`, `open`, `width = 200`,
`placeholder = '선택하세요'`. The affordance is deliberate — a divider-separated
**arrow button** on the right holding a stepped pixel triangle ▼, so it reads
unmistakably as "tap to expand". When `open`: the arrow flips (`scaleY(-1)`) and
its cell turns yellow, the trigger loses its shadow and shifts 1px (pressed
state), and the item panel is butted **flush** to the trigger
(`top:100%`, no gap, `border-top: none`). Selected row = mint bg + ✓; unselected
rows keep a transparent ✓ so labels stay aligned. Empty `value` shows the
placeholder in `textFaint`.

Note for layout: the open panel is `position: absolute` and contributes no flow
height, so reserve space in the parent (the DS catalog section reserves ~330px)
or an `overflow: hidden` card will clip it.

## PathStepper
Horizontal step tracker. Props: `steps = [{ label, done, here }]`. Done steps =
mint ✓, current = `here` (yellow shadow + "● HERE"), future = numbered. Used by
the Profile career path; reuse for any multi-stage flow.

## ForinTopBar
In-screen top app bar. Props: `title`, `left`, `right`, `bg=cream`.
Look: sticky, `borderBottom: 3px ink`, **52px top padding** (status-bar space —
in RN use `SafeAreaView` / `useSafeAreaInsets` instead of the hardcoded 52),
title centered (DungGeunMo 15), `left`/`right` slots ~32px wide.

## ForinBottomNav
Persistent 4-tab nav. Tabs: `캠퍼스 🏥 / 상황판 📋 / 리뷰랩 📓 / 나 👤`.
Prop: `active='campus'|'board'|'lab'|'me'`. Active tab gets a mint background.
Look: `borderTop: 3px ink`, `paddingBottom: 28` (home-indicator space → use
safe-area inset in RN), icon 18px over a 11px label.
**In RN: replace with the bottom tab navigator** (expo-router tabs / react-
navigation) styled to match, rather than a static component.

## PixelDPad
On-screen directional pad used in interiors (up/down/left/right). Props:
`onMove(dir)`, `size=72`, `bg=peach`, `color=ink`. Each arrow is a pixel button
with the same press bevel behavior. Center is empty.

## Icon buttons (HUD)
The interior HUD has square action buttons: a yellow **빠른이동** (fast-travel,
🗺) button and a mint **A** action button — both 52×52, `3px ink`, `4px` shadow,
with the same press-into-shadow behavior as PixelButton.

## MissionBanner (in InteriorScreen)
Quest banner at top of interiors. Two states via `missionUrgent`:
- normal: `yellow` bg, `yellowShadow` shadow, "INSIDE · DEPT"
- urgent: `#FEE2E2` bg, `#EF4444` shadow + red `!` chip, "URGENT · DEPT"
Contains a `!` square chip + dept label + mission text (Galmuri11 12).

## Social login buttons (`OneTapButton`)
Row buttons on the Login screen. Props: `bg`, `color`, `shadow`, `icon` (SVG
glyph), `label`. Provider glyphs included in `screens-onboarding.jsx`:
`GoogleGlyph`, `AppleGlyph`, `KakaoGlyph`, `NaverGlyph`, `MailGlyph` — all SVG,
port to RN SVG. Brand colors: Google `#fff`/ink, Apple `#000`/white,
Kakao `#FEE500`/`#3C1E1E`.

---

## Provider-color reference (login)
| Provider | bg | text | shadow |
|---|---|---|---|
| Google | `#fff` | ink | `ink @ 55%` |
| Apple  | `#000` | `#fff` | `#000` |
| Kakao  | `#FEE500` | `#3C1E1E` | `#CCB800` |

## FIcon — forin 아이콘 시스템 (forin-pixel-icons.jsx)

앱 전역의 이모지·기성 아이콘을 대체하는 forin 전용 픽셀 아이콘 시스템.
**픽셀 디자인이 확정 방향** — forin Modern(모던 시안)은 탐색용으로 보관만 하고, 이후 개발은 기존 픽셀 디자인 기준.

- 그림체: 16×16 그리드, 픽셀 계단 실루엣 + 잉크(#2A2522) 아웃라인 + 파스텔 팔레트(민트·피치·옐로·소프트블루·핑크) + 흰 하이라이트 1점. `shape-rendering: crispEdges`.
- 사용법 ①(컴포넌트): `<window.FIcon name="thumb" size={32}/>` — `.ficon-skip` 클래스로 자동 치환 제외 영역 지정 가능.
- 사용법 ②(자동 치환 엔진): `installFIconizer()`가 로드 시 자동 실행되어, 텍스트 노드의 매핑된 이모지(⭐🔥💊🚑📋💪⚔→ 등 100+)를 같은 크기 SVG로 치환. MutationObserver + 50/400/1000ms 재실행. 표정 이모지(😄 등)는 의도적으로 미매핑 = 원본 유지.
- 카탈로그: forin Design System.html → "FIcon · forin 아이콘 v2" 아트보드 (~85종).

주요 확정 아이콘 (사용자 피드백 반영 이력 포함):
| 이름 | 형태 | 비고 |
|---|---|---|
| thumb | 따봉 — 좌측 파란 소매 + 손바닥 + 위로 솟은 엄지(3px 폭·6px 길이) + 우측 손가락 마디 3개 | 시나리오 클리어 "참잘했어요" 스티커 중앙 (별 → 엄지척 확정) |
| handshake | 나란히 선 동료 2인 (앞 민트 셔츠 + 뒤 파랑 셔츠, 겹침) | 동료 신뢰도·응원 (🤝 매핑; 악수 형태 3회 시도 후 2인 실루엣으로 확정) |
| xp | 노란 배지 + "XP" 픽셀 레터링 | 별→보석→XP 배지로 최종 확정 (⭐🌟★ 매핑) |
| fire | 혀가 갈라진 불꽃 + 노랑 심지 | 홈 연속 학습 |
| muscle | 좌측 가는 팔뚝+주먹, 우측 낮은 돔 이두(음영은 돔 아래) | 응원 "오늘도 화이팅" |
| moon | 파란 베개 + Zz (음영·모서리 라운드) | 응원 "무리하지 말아요" |
| sword | 세로 픽셀 검 | 동료 "대결" 버튼 |
| compass | 원형 나침반 (픽셀 원 + 빨강/검정 바늘) | 홈 "둘러보기" |
| ambulance | 흰 박스 구급차 + 적십자 + 경광등 | 커리큘럼 돌발 이벤트 |
| stetho | 청진기 | 본관 (건물 → 상징물 아이콘으로 전환, 🩺) |
| baby | 아기 얼굴 (볼터치) | 여성소아 센터 (👶) |
| ivbag | 수액백 — 걸이+민트 수액+라인 | 암센터·재활관 (🧃 매핑, 리본 → 수액백 확정) |
| magnify | 원형 렌즈 돋보기 (픽셀 원 + 반사광 + 대각 손잡이) | 외래·진단 지원동 (🔎) |
| gear | 8치 톱니바퀴 (회색 몸통+축 구멍) | 행정·백스테이지 윙 (⚙) |
| scalpel / suture | 스칼펠(OR) / 드레싱(외과 병동) | 두 과 아이콘 분리 |
| bone | 관절구 4개 정석 뼈 | 정형외과 |
| scope | 핸들+굴곡 튜브+선단 광원 내시경 | 내시경실 |
| walker | 보행기 프레임 | 재활 |
| check / arrow | 픽셀 체크마크 / 픽셀 화살표 | ✓·→ 문자 대체 |

> **건물 아이콘 원칙:** 건물·층 목록에서는 건물 외형이 아니라 그 건물을 대표하는 **상징물(물건)** 아이콘을 쓴다. 건물형 아이콘(tower/women/onco/clinic/admin/dx)은 FICONS에 보존되어 있으나 목록에서는 미사용.

### 아이콘 개정 이력 요약 (2026-08 확정)
- xp: 별 → 보석 → **노란 XP 배지** (글자 정중앙, 배지 12×12 내부)
- handshake: 평행 악수 → V자 악수 → **나란히 선 2인** 확정
- thumb: 참잘했어요 스티커 — 첨부 레퍼런스 기반 따봉 (엄지 3px 폭 / 6px 길이)
- gear: 8치 정석 톱니바퀴 / magnify: 원형 렌즈 (네모 렌즈 폐기)
- ivbag: 암센터 상징 수액백 (리본 폐기) / 건물 목록은 상징물 아이콘 원칙
- muscle: 좌 팔뚝+주먹 / 우 낮은 돔 이두, 음영은 돔 아래
- moon(무리하지 말아요): 베개+Zz, 라운드 모서리 + 음영
- compass: 원형 다이얼 / fire: 갈라진 불꽃 / ambulance: 박스 차체+적십자+경광등
