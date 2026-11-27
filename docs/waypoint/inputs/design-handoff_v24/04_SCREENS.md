# 04 · Screens

Each screen below maps to an artboard in one of the **four review pages**
(a single page rendering every artboard froze the design canvas, so the app is
split by section):

| Page | Sections | Canvas app |
|---|---|---|
| `reference/forin Home.html` | ①b Home, ①c Colleagues | `app-home.jsx` |
| `reference/forin Onboarding.html` | ① Onboarding, ② Campus/Board/Elevator, ②b Campus Hub | `app-onboard.jsx` |
| `reference/forin Interiors.html` | ③ Department Interiors (33 floors) | `app-interiors.jsx` |
| `reference/forin Flow.html` | ④ Briefing, ⑤ Dialogue, ⑰ Growth (Profile · Review Lab · 11b Speak List · 11c Model Answer List) | `app-flow.jsx` |
| `reference/forin Pronunciation.html` | ⑤b 발음·스피킹 피드백 (연습 대기 · 녹음 중 · 채점 결과 · 취약 음소 드릴) | `app-pron.jsx` |
| `reference/forin Quizzes.html` | ⑥–⑯ all department quizzes | `app-quizzes.jsx` |

Screen sizes are designed at **402 × 874** (iPhone-ish). All use the global
conventions in `README.md` / `01_DESIGN_TOKENS.md`.

Numbering matches the prototype's design-canvas sections.

---

## ① Onboarding

### 1. Splash  (`screens-onboarding.jsx` → ScreenSplash)
- **Purpose**: brand entry; single CTA into the app.
- **Background**: vertical gradient peach→mint.
- **Decor (animated)**:
  - **Sun** — friendly pixel sun (rays + face) top-right, SVG (`PixelSun`).
  - **Clouds** (`Cloud`) — drift left↔right continuously (`forinDrift`, ~7s/size).
  - **Airplane** (`PixelPlane`) — idle **gentle float** (up-down + slight side,
    `forinPlaneFloat`, 3.2s loop).
- **Logo**: "forin" DungGeunMo 64px, yellow drop-shadow. Tagline below
  (Galmuri11 13): "해외 이직, 언어로 막막할 때 / 가장 따뜻한 현장 시뮬레이션".
- **CTA**: full-width lg yellow `PixelButton` reading **"✈  여정 시작하기"**.
  (No "이미 계정이 있다면 · 로그인" line — login handles both new & returning.)
- **Splash & Login are ONE continuous screen** (single component, two-panel
  camera pan; NOT two routes). On CTA press:
  1. The **CTA button** fades out + drops first (`.3s`).
  2. The **whole world is a 2-panel filmstrip** (track `width:200%`) that pans
     left by one screen (`translateX(0 → -50%)`, ~1.15s): Panel A (sky decor +
     center forin logo/tagline) slides off-screen left, Panel B (login buttons +
     forin logo) enters from the right — same background continues across both.
  3. The **airplane is positioned OUTSIDE the track, fixed near screen center**
     (translateX -50%), so it stays put as the camera focus while everything
     else flows left → reads as the camera following the plane forward.
  In RN: one screen; a horizontal `Animated`/reanimated track translated −50%,
  plane as a fixed overlay (no navigation between splash and login).

### 2. Login  (ScreenLogin) — the "arrived" end-state of the splash
- **Purpose**: one-tap social sign-in. Same flow for new & returning users
  (auto-register if new). Korean-optimized.
- **NOT a separate screen in the product** — it is the splash's `arrived` phase
  (same `peach→mint` background, same drifting clouds + sun, same centered
  forin logo + tagline). The standalone `login` artboard just shows this
  end-state on its own for review.
- **Provider buttons** (stacked, `OneTapButton`, full width, bottom ~44px up):
  1. **Google로 계속하기** — white bg, ink text, `GoogleGlyph`.
  2. **Apple로 계속하기** — black bg, white text, `AppleGlyph`.
  3. **카카오로 시작하기** — `#FEE500` bg, `#3C1E1E` text, `KakaoGlyph`.
- **Footer**: 약관/개인정보 동의 안내 (Galmuri11 10).
- **Note**: a native Google/Apple One-Tap OS dialog would appear over this in
  production — not custom-designed (OS-controlled). The base screen is what we own.

### 3. Language & Destination  (ScreenLocale)
- TopBar "LANGUAGE", step "1/4".
- "어디서 오셨나요?" → 2×2 grid of `LocaleCard` (flag + name + sub):
  한국어/日本語/English/Deutsch. Selected card = mint bg + mint shadow.
- "⇨ 어디로 가시나요?" → grid: 미국 / 독일.
- Bottom: full lg yellow button "다음 ▶".

### 4. Job select  (ScreenJob)
- Choose profession. **Nurse only** is enabled (MVP); others shown locked/coming.

### 5. Level diagnosis  (ScreenLevel)
- Short placement quiz / self-assessment to set starting level (B1, etc.).

---

## ①b Home  (`screen-home.jsx`)

The app's **first screen after launch** and the left-most tab. It exists because
the Campus tab opens straight into lists (curriculum, buildings, situations),
which reads as pressure the moment you open the app. Home inverts that:

- **One thing, not a list.** The biggest element is a single "오늘의 한 가지"
  hero — the next curriculum step with a `▶ 시작하기` button. No choosing.
- **Achievement before assignment.** Greeting → shift badge → streak strip come
  first; tasks follow.
- **Everything else is a shallow door.** 둘러보기 / 오늘의 상황 are two small
  cards that hand off to the Campus tab rather than duplicating it.

### Home-only modules (deliberately not on any other tab)
| Module | What it does |
|---|---|
| `ShiftBadge` | Today's shift (DAY/EVENING), assigned department, weather — daily world-flavour |
| `MentorNote` | A senior-nurse NPC (sprite + name) leaves one line of advice each day |
| `PhraseOfDay` | One field expression on a flip card (tap to reveal the meaning) |
| `NextBadge` | Milestone-proximity bar ("2 more scenarios to earn it") |
| `PeerTicker` | Activity feed of learners preparing for the same destination |

Other pieces: `Greeting` (date + the player's own `SmoothSprite`), `StreakStrip`
(streak count + 7-day rhythm blocks), `TodayOne` (the hero), `Doors`, `OneReview`
(one missed expression from yesterday, ~1 min).

### States
| Screen | State |
|---|---|
| `ScreenHome` | Default — today's one thing is pending |
| `ScreenHomeDone` | Goal met — the hero is replaced by a 🌙 rest card ("여기서 멈춰도 괜찮아요") with an optional `+ 한 판 더 하기`; never nags |

Bottom nav is `active="home"`.

---

## ①c Colleagues  (`screen-colleagues.jsx`)

Invite-code based peer relationships, so the anonymous "same goal" ticker
becomes a lasting connection: see each other's study status and send 응원.

**Ownership:** the **Profile (나) tab owns colleague management** — Home only
shows today's activity and links in (`전체 ›` / `+ 추가` → profile's 동료 card).

| Screen | Contents |
|---|---|
| `ScreenColleagues` | Invite-code banner (K7-N4XQ · 공유 / + 추가), 응원 인박스, colleague rows (sprite, flag, relation tag, online dot, current scenario, streak, 👏 quick-cheer) |
| `ScreenColleagueAdd` | My code card (복사 / 공유) + code-entry slots, matched-person preview, 동료 요청 보내기, visibility note |
| `ScreenColleagueDetail` | Profile hero (Lv/연속/클리어), live "지금 학습 중", weekly study graph vs. mine, 주고받은 응원 log, 응원 보내기 / 대결 |
| `ScreenCheerCompose` | Bottom sheet — 4 preset cheers + a 60-char message |

**Extensibility:** relation types live in a `REL` map — `peer`(🤝) is active
today, `mentor`(⭐) and `mentee`(🌱) are already supported (a local RN mentor,
Emma, ships as an example row). Growing into local-nurse mentor–mentee needs
only new data, not new screens. Mentor rows drop the `Lv.` prefix.

---

## ② Hospital Campus & Event Board

### Campus (outdoor map)  (`screens-explore-v2.jsx` → ScreenExplore)
See `05_MAP_AND_INTERIORS.md` for the full tile engine. Summary:
- A **top-down campus** (TILE 16px). Hand-painted `MAP` rows of
  ground tiles (grass/path/plaza/road/sidewalk/garden).
- **Landmark buildings** are **2.5D** — drawn with a **front face + a flat
  rectangular TOP face** (high-angle/"slightly-from-above" view), matching the
  2.5D object convention below. The campus now uses five landmark pavilions
  (`screens-explore-v2.jsx`): **본관 메인 메디컬 타워** (`MedCenter` — base block
  + 3 stacked towers black/yellow/ivory, EMERGENCY sign, helipad), **여성소아
  센터** (`MedCenterWomen` — rounded warm pastel block), **암센터·특수 재활관**
  (`MedCenterOnco`), **외래·진단 지원동** (`MedCenterDx`), **행정·백스테이지
  윙** (`MedCenterAdmin`), plus a central **시계탑** (`ClockTower2D`) in the
  healing garden. Tapping a pavilion opens the **Elevator** (below).
- **Props/decor** (reused 2.5D objects): trees, benches, streetlamps,
  cars, hydrants, trash cans, hedges. All SVG.
- **Player + NPCs** are Derp sprites (`PlayerSprite`, `NPC`). NPCs may show a
  bobbing `!` (quest) marker.
- **Camera**: scroll view centers on the player; movement via D-pad updates
  `pos {x,y}` (tile coords) and smooth-scrolls.

> **2.5D drawing convention** — the whole app reads as a camera tilted ~70°
> (looking down-and-forward), so every object shows **its front AND a top
> face**, never a flat side-on or pure top-down silhouette. Furniture
> (`IReception` desk, `IChair` with per-facing front/back/side draws), landmark
> buildings, and the clock tower all follow this. Building TOP faces are
> **rectangles** (not trapezoids) sized generously for the high viewpoint, and
> their width is kept flush with the front face.

### Event Board  (`screen-event-board.jsx` → ScreenEventBoard)
- **Purpose**: daily auto-refreshed list of active scenarios; fast-travel in.
- TopBar "오늘의 상황판" + date.
- **Summary card** (mint): "현장 상황 N건 발생" + refresh time + 4 `Counter`s
  (URGENT / QUEST / 완료 / 남은).
- **Dept filter tabs** (`DeptTab`, horizontally scrollable): 전체 / ER / ICU /
  OR / PEDS / PHARMA, each with a count badge; active tab = dept color bg.
- **Sections by dept**: each lists `EventCard`s.
  - `EventCard`: urgency tag (URGENT red / QUEST yellow / INFO), room
    name+icon, difficulty pips, title, NPC name+sub, italic tagline, up to 2
    skill chips + time, and footer buttons **"📍 위치 보기"** + **"▶ 진행하기"**
    (disabled "🔒 조건 미달" if requirements unmet).
- Data: `window.getTodaysActiveScenarios(date)` picks 6 from
  `window.SCENARIOS` (see `scenarios-data.jsx`). Daily rotation at midnight.
- BottomNav active = "board".

---

## ③ Department Interiors
See `05_MAP_AND_INTERIORS.md`. Interiors are larger tile maps with regions/
rooms, walls/doors/glass, 2.5D furniture + equipment, NPCs, and `!` hotspots
that launch scenarios.

Departments rebuilt to **master blueprints**: ER, OR (& PACU), ICU, Pediatrics
(& NICU), Pharmacy, plus inpatient **wards** — 일반 내과 병동 (`interior-ward`),
일반 외과 병동 (`interior-surgward`), 정형외과 병동 (`interior-orthoward`) — and
the 피부과 센터 (Derm). The earlier data-driven outpatient-clinic duplicates
(내과/외과/정형외과/피부과 클리닉 엔진 화면) were **removed** as redundant.

Every interior includes a **mission banner**, a **HUD** (zone label, D-pad, A
button, **🛗 엘리베이터** button, **🗺 빠른이동** button), a **Fast-Travel
modal** (room grid → teleport within the dept), and an **Elevator overlay**
(🛗 → the floor selector over the dept; ‹ 돌아가기 or picking a floor closes
it). Both are in-screen overlays in the shared `InteriorScreen` — no routing.

### Elevator  (`screen-elevator.jsx` → ScreenElevator)
- **Purpose**: building entry. Tapping a campus pavilion (or the in-dept 🛗
  button) opens this floor selector; you pick a floor to ride to its dept.
- **Building tabs**: 5 pavilions (본관/여성소아/암센터/외래진단/행정).
- **Pixel cab**: digital floor read-out (target floor + ▲/▼ direction vs. the
  cab's current floor) and sliding doors that animate ("탑승 중…") on ride.
- **Floor directory**: each floor button shows floor no., its departments, and
  a **live situation chip** — 🔴긴급 N / 🟡진행 N / 🟢정상 — read from
  `getTodaysActiveScenarios()` (the **same source** as the 상황판, so elevator/
  board/interiors always agree). Floors with no tracked dept show no chip.
- **GO bar**: pinned above the bottom nav; label shows target floor + direction
  arrow (▲ up / ▼ down / "현재 위치" when same).
- Per-building floor map lives in `ELEVATOR_BUILDINGS` (matches the 5-building
  vertical master plan: tower 1F ER/Pharmacy … 8F wards, etc.).

---

## ②b Campus Hub — 캐팜스 탭 개편  (`screen-campus-hub.jsx`)

The campus tab was reworked to be **mobile-first** rather than
walk-the-tilemap-first. Some users enjoy roaming the map, many don't, so the
game-style walking is demoted to an opt-in mode and everything is reachable
from ordinary mobile lists.

Three tab states, each exported as its own screen:
`ScreenCampusCurriculum` / `ScreenCampusBuildings` / `ScreenCampusDept`.
Shared chrome: a fixed 112px header (title + Lv chip + streak, then a
**2-way** segmented tab strip — 커리퀆럼 / 건물·층; header and tabs use
`box-sizing: border-box` so the tab underline meets the buttons), an
absolutely-bounded scroll body, the `ExploreDock` card, and
`ForinBottomNav active="campus"`.

### A. 커리퀆럼 (default tab) — the main line
- **이어하기 hero** (mint): `CHAPTER n · dept`, chapter title, progress bar
  (`done/total`), next-step label, and a `▶ 이어하기` button. One tap resumes.
- **Chapter timeline** — the pedagogical core: dialogue stages are
  **interleaved with events** so a learner never faces a long unbroken run of
  conversation. Step kinds (`STEP_META`): `💬 대화` · `📝 퀵즈` ·
  `⚡ 돌발 이벤트` · `🏁 촜턴 시험`. Per-step state `done` (✓) /
  `now` (NOW badge, tinted by kind) / `lock` (🔒, dimmed), on a dotted rail.
- **전체 로드맵** — all chapters with done/now/lock states; following it end to
  end is the promise that the learner meets **every case they'd hit abroad**.
- Data: `CURRICULUM` (chapter > steps). Ch.1 done, Ch.2 in progress, Ch.3–5 locked.

### B. 건물·층 — browse without walking
- Five building cards (accent + icon) as **accordions**; the open one lists its
  floors. Each floor row: floor chip (`1F`, `5-8F`, `B1`…), department text,
  optional 🔴`긴급` badge, a `N건` situation-count chip, and a `›` affordance.
- Data: `BLD`, mirroring `ELEVATOR_BUILDINGS` (본관 / 여성소아 / 암센터·재활 /
  외래·진단 / 행정·지원동).

### C. 부서 상세 시트 — what a floor tap opens
Tapping a floor does **not** jump into the interior and does **not** show the
board. It opens a bottom sheet for that department (`ScreenCampusDept`), which
is the single place where place → learning is resolved:
- **Header**: dept icon/accent, name, `본관 · 1F · English name`, close ×.
- **3 stat tiles**: 권장 레벨 / 해결한 상황 (7/12) / 커리퀆럼 (CH.2).
- **이 부서의 커리퀆럼** — the chapter that lives here, with progress + 이어하기.
  (This is the join between the place axis and the curriculum axis.)
- **이 부서의 상황** — dept-scoped situation cards (긴급/신궜/완료, room name,
  Lv + minutes, 시작/복습). Dept-scoped on purpose: the hospital-wide feed is
  the 상황판's job.
- **Sticky footer**: `▶ 다음 상황 시작` (primary) + `🎮 걸어보기` (secondary —
  walks that floor's interior).

### Why the old "오늘의 상황" tab was removed
It duplicated the 상황판 tab. Now the two axes never overlap:

| | 캐팜스 탭 | 상황판 탭 |
|---|---|---|
| Axis | **장소 · 커리퀆럼** — "어떼서 무엇을 배울까" | **시간 · 전원 피드** — "지금 무슨 일이" |
| Grouping | building → floor → dept | chronological / urgency, cross-dept |
| Entry | curriculum resume, dept sheet | today's live events |

The 건물·층 tab carries a 🧭 blue helper card stating this split, and floor rows
show **learning inventory** chips (`CH.n`, `상황 N`) rather than live event
counts — so a floor row can never be mistaken for a board entry.

### Extensibility
A new department = one floor row in `BLD` + one `DEPT` entry. A new live event =
added to the 상황판 feed only. Nothing is authored in two places.

### Explore mode (secondary)
- `ExploreDock`: a single lilac card pinned above the bottom nav on all three
  tabs — `🎮 추팜스 탐험 모드 · 직접 걸어다니며 NPC 만나기 · 선택 기능` with an
  `입장 ›` button → opens the tilemap campus (`ScreenExplore`). Deliberately not
  the default path.


---

## ④ Scenario Briefing  (`screen-briefing.jsx` → ScreenBriefing variant)
- **Purpose**: pre-scenario modal shown when stepping on a `!` hotspot.
- A paper-card modal over a dimmed/scanlined interior. Variants: `er`, `or`,
  `police` (locked example).
- **Contents**: dept ribbon, "❗ NEW SCENARIO" + title + italic tagline,
  **character portrait** (Derp Face, expression reflects mood — e.g. patient
  `pain`, officer `focused`), difficulty stars + time, **SITUATION** brief box,
  연습할 스킬 chips, 완료 시 보상 list (XP/만족도/진척), 입장 조건 (met ✓ /
  unmet ✗), footer **"나중에 하기"** + **"▶ 지금 진행 (+XP)"**.

---

## ⑤ Visual Novel Dialogue  (`screens-dialogue.jsx`)
### Dialogue (ScreenDialogue, prop `hintOn`)
- **Purpose**: the core gameplay — free-form spoken/typed English conversation
  with an NPC, with optional hints.
- **Background**: simple peach→cream room split (no clutter props).
- **Top overlay**: ✕ 나가기 + mission tracker chip ("🎯 MISSION 1/3" + objective).
- **Portraits**: patient on left (Derp Face, e.g. `pain` + 💧 shake), player on
  right (Derp Face `focused`). `PortraitFrame` = chunky framed badge + name tag
  + optional status chip (e.g. "Pain 7/10").
- **Quick-info dock** (horizontal row below portraits in the cream area):
  "QUICK INFO" label + 📋 차트 / 💊 약물 / 🩺 활력 buttons.
- **Dialogue box**: speaker tab + cream box with the line (key phrases
  highlighted), a translate/vocabulary row, and a blinking ▼ next-arrow.
- **Two modes**:
  - **Free (hintOn=false)**: a mic input field "마이크 버튼을 누르고 자유롭게
    답해보세요" + animated sound-wave bars.
  - **Hint (hintOn=true)**: 3 `ChoiceRow` suggested replies (one ★AI추천, one
    ⚠위험), revealed with a slide-up.
- **Bottom rail**: 🎤 직접 말하기 / 💡 힌트 / ⏸.

### Scenario Clear (ScreenDialogueResult)
- Celebration screen. "참 잘했어요!" big title, a rotated **sticker badge**
  (FIcon thumb 엄지척 + 참잘했어요), a **REWARDS** card (XP / 환자 만족도 / 동료 신뢰도 / 자격증
  진척), and **confetti** that bursts once on mount from the sticker, then
  **bursts again wherever the user taps** the background (parabolic particles).
  Buttons: 📓 리뷰랩에 저장 / 다음 시나리오 ▶.
  - RN: confetti via reanimated — each particle a parabola through
    (0,0)→peak→fall; spawn a burst at the tap location.

---

## ⑥–⑧ Mid-Dialogue Quizzes
Interspersed mini-games. All share a `QuizCard` shell (`screens-quiz.jsx`):
zone label, title, sub, mission N/total, timer, and a footer with retry/submit.

| Quiz | File | Interaction |
|---|---|---|
| **ER · 문장 완성** | screens-quiz | Build a sentence from word tiles |
| **ER · 통증 표현 매칭** | screens-quiz | Match Korean ↔ English pain terms |
| **ER · 바이탈 라벨링** | screens-quiz | Label vitals on a monitor |
| **ER · ESI 트리아지** | screens-quiz-triage | Pick triage level for a patient (Derp character) |
| **병동 · 신체 부위 라벨링** | screens-quiz-anatomy | Drag body-part word tiles onto dots on a full-body **Derp patient** figure; shows correct ✓ / wrong ✗ / hover / empty states. Dots are positioned as % over a 24×72 SVG body. |
| **ICU · SBAR 인계 순서** | screens-quiz-sbar | Order the S-B-A-R handoff steps |
| **약국 · 구두 처방 받아쓰기** | screens-quiz-listen | Listen & type a verbal prescription |
| **약국 · 약물 용량 계산** | screens-quiz-dosage | Dosage calculation input |

Each quiz documents its own exact layout in its source file. Recreate the
interaction; styling follows the shared QuizCard + token system.

---

## ⑨ Growth & Career  (`screens-progress.jsx`) + Review Lab (`screens-review-lab.jsx`)

### Bottom-nav IA (decided — Option A)
The bottom nav has 4 tabs: **캠퍼스 / 상황판 / 리뷰랩 / 나**.
- **나 (me) tab → Profile is the HOME** (`ScreenProfile`, `active="me"`). It is
  what appears first when the user taps 나.
- **Daily Growth Report (`ScreenGrowth`) is a PUSHED sub-view of the 나 tab** —
  NOT its own tab. Entered two ways: (a) tapping the mint **"오늘의 성장 리포트"**
  row on the Profile (📊 + "시나리오 N 완료 · +XP · 🔥 streak" + ▶), or
  (b) auto-shown when a day/scenario ends. Its TopBar **‹** returns to Profile.
  In the prototype this is a `view` state inside `ScreenProfile`
  (`'profile' | 'report'`); in RN use a stack push.
- **리뷰랩 (lab) tab → Review Lab** (`ScreenReviewLab`, `active="lab"`) is its
  own tab. The Profile also has a small "리뷰랩 열기 ▶" teaser that deep-links
  into the same Review Lab.

### Profile (ScreenProfile) — 나 tab home
Player ID card (Derp portrait, rank/level, XP bar, EN level chips), reputation
bars (환자 만족도/동료 신뢰도/응급 대응력), the "오늘의 성장 리포트" entry row,
**🤝 내 동료 card** (4 colleague sprite avatars + count, 전체 › link, and the
player's invite code with 공유 / + 추가 buttons — profile OWNS colleague
management), CAREER PATH stepper (Learner→Junior(here)→Senior→Head Nurse),
커리어 뱃지 grid, and a Review Lab teaser card.

### Daily Growth Report (ScreenGrowth) — pushed from Profile
End-of-day report: hero "오늘 N명의 환자에게 미소를 주었습니다" card, 이번 주
출석 streak (7-day grid), stat tiles (시나리오/새 표현/환자 만족/대화 시간),
칭찬 스티커 보드 (collectible grid → unlocks certs). `onBack` → Profile.

### Review Lab (ScreenReviewLab) — 리뷰랩 tab
The "오답노트 / speak-like-a-local" review system. AI-corrected sentences from
scenarios become spaced-repetition phrase cards.
- **Daily review hero** (lilac): "N개 카드 복습할 시간이에요" + **▶ 오늘의 복습
  시작** (enters a spaced-repetition session).
- **Stats**: 저장된 카드 / 마스터 / 복습 대기.
- **Category filter** (scrollable chips): 전체 / 복습 / 통증 / SBAR / 표현 /
  **말하기** / **모범답안**, each with a count badge.
- **PhraseCard** (the core unit): source dept + 복습/tag badges; ✕ original line
  (strikethrough) → ✓ corrected line (highlighted) + 🔊 TTS; a **"왜?"** note box
  explaining why the native phrasing is better; a 3-pip **mastery** meter; and
  actions **🎤 따라 말하기** (record & compare) + **★** favorite.
- RN: store cards from scenario corrections; schedule reviews (SM-2-style);
  🔊 via expo-speech / TTS, 🎤 via expo-av + pronunciation check.

### ▶ 직접 말하기 연습 · 시나리오 모범답안 (summary blocks in Review Lab)
Two blocks that receive what the player **spoke aloud** and what the scenario's
**model answer** was. Both are deliberately **summary-only** — at 100+ items a
full inline list would grow the page without bound:

| Block | Summary shown | Entry |
|---|---|---|
| 🎙 직접 말하기 연습 | Score-band distribution (60↓ / 60–79 / 80+) + "가장 급한 2문장" only | `🎯 약한 것부터 (10)` · `전체 128 ›` |
| 📄 시나리오 모범답안 | Completed-scenario count, most recent one expanded (내 답변 strikethrough vs 모범 + "왜?"), 3 collapsed rows + "+ N개 더" | `전체 ›` |

Scenario Clear (`ScreenDialogueResult`) feeds the first block: it lists the
sentences spoken in that scenario with per-sentence scores, an average badge,
and `🎯 낮은 점수 2문장 다시 연습하기`.

### Full-list screens — mobile-native, NOT web
`ScreenSpeakList` (11b) and `ScreenModelAnswerList` (11c) are where 100+ items
are actually browsed. Both follow **mobile** patterns, explicitly not web ones:

- **Infinite scroll**, never pagination — the list ends in a loading indicator
  (three pips + "불러오는 중…") and a soft count ("128문장 중 24개 표시").
- **Segmented sort** (`약한 순 / 최신` · `최신 / 개선 필요`) — no `▾` dropdowns.
- **Tappable toggle chips** for department (`✓ ER`), horizontally swipeable.
- **Bottom-sheet filter** behind a `⚙ 필터 N` button (N = applied count) for
  compound conditions; the sheet is the mobile stand-in for a filter bar.
- Sticky header at `height: 186` with `boxSizing: 'border-box'`; the scroller
  starts at `top: 186`. **Keep these two numbers equal** — a content-box header
  with `padding-top` silently grows past its declared height and paints over the
  first (highest-priority) row.
