# 04 · Screens

Each screen below maps to an artboard in `reference/forin App Design.html`
(open it to see the live design). Screen sizes are designed at **402 × 874**
(iPhone-ish). All use the global conventions in `README.md` / `01_DESIGN_TOKENS.md`.

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

## ② Hospital Campus & Event Board

### Campus (outdoor map)  (`screens-explore-v2.jsx` → ScreenExplore)
See `05_MAP_AND_INTERIORS.md` for the full tile engine. Summary:
- A **26 × 60 tile** top-down campus (TILE 16px). Hand-painted `MAP` rows of
  ground tiles (grass/path/plaza/road/sidewalk/garden).
- **Buildings** (`Building`) are 2.5D (roof top face + front wall + door/
  windows + roof emblem/red-cross + sign plaque). Each maps to a department:
  본관, ER, 소아과, OR, 약국, ICU, 재활, 연구동, 카페테리아, etc. Tapping a
  department building enters its interior.
- **Props/decor**: trees, benches, streetlamps, fountain, ambulance, parked
  cars, hedges, bus stop, statue, vending machine, picnic tables, helipad,
  bball court, pond + lily pads. All SVG (`05_…` lists them).
- **Player + NPCs** are Derp sprites (`PlayerSprite`, `NPC`). NPCs may show a
  bobbing `!` (quest) marker.
- **Camera**: scroll view centers on the player; movement via D-pad updates
  `pos {x,y}` (tile coords) and smooth-scrolls.

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
See `05_MAP_AND_INTERIORS.md`. Five interiors: **ER, OR, ICU, Pediatrics,
Pharmacy**. Each is a larger tile map with regions/rooms, walls/doors/glass,
furniture + equipment, NPCs, and `!` hotspots that launch scenarios. Includes a
**mission banner**, a **HUD** (zone label, D-pad, A button, 빠른이동/fast-travel),
and a **Fast-Travel modal** (room grid; tap to teleport).

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
  (star + 참잘했어요), a **REWARDS** card (XP / 환자 만족도 / 동료 신뢰도 / 자격증
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

## ⑨ Growth & Career  (`screens-progress.jsx`)
### Daily Growth Report (ScreenGrowth)
- End-of-day report: stats, phrases learned, encouragement.
### Profile · Career · Review Lab (ScreenProfile)
- Player profile: job/level, badges, certification progress, sticker board,
  career track. The **리뷰랩 (Review Lab)** bottom-nav tab links here / to a
  saved-mistakes review (full Review Lab screen not yet designed — product TODO).
