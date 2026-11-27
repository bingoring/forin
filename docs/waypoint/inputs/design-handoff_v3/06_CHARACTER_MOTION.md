# 06 · Character Motion & Liveliness

This doc covers the **animation / directional / ambient-life layer** added on
top of the static character system in `03_CHARACTERS.md`. Read 03 first for the
sprite anatomy (roles, hair, expressions, the deterministic identity hash).

Everything here is implemented in `reference/forin-npcs-smooth.jsx` (the sprite
engine) and `reference/screens-explore-v2.jsx` (the campus ambient-NPC engine).
It applies to the **map/interior sprites**, not the dialogue Faces.

> Scope note: lazy-mount / viewport changes in `design-canvas.jsx` were a
> prototype-only fix for opening the heavy review canvas — **ignore those**,
> they are not product behavior.

---

## 1. Directional facing (front / back / left / right)

`SmoothSprite` (and every role preset + player) takes a **`dir`** prop:
`'down' | 'up' | 'left' | 'right'` (default `'down'`).

| dir | What's drawn |
|---|---|
| `down` | Front view — full face (eyes, mouth, expression), chest mark/cross. |
| `up` | **Back of head** — hair fills the crown, no face; hats render their back; a little nape hair. Chest mark/cross is hidden. |
| `left` / `right` | **3/4 side view** — one visible eye + a small nose bump at the head's front edge; minimal mouth. **Hat** uses a side-profile variant (`hatSide()`): visor/brim points toward the front, and the nurse cross / police badge sits at the front of the cap (never center). **Body** is a narrower side torso with back-edge shading; the chest mark/cross is hidden, and **a single arm** is tucked along the torso (not two front-facing arms). **Legs overlap into a single centered leg** (true side silhouette). `left` is the `right` drawing mirrored (`scale(-1,1)`). |

Implementation details to preserve when porting:
- The whole sprite is wrapped in a group that flips horizontally for `left`
  (`transform="translate(64,0) scale(-1,1)"` in the 64-wide viewBox).
- Back view swaps the face group for a `backHead()` group (hair/hat only).
- Side view swaps in a `sideFace()` group (single eye + nose).
- Side view draws a **single centered leg** AND a **single arm** tucked along
  the narrow torso (both legs and both arms overlap in profile); front/back draw
  two legs + two arms. The walking swing pivots that one leg + one arm around
  the body center for side view.
- These are three separate draw paths keyed off `dir` — in RN, branch the
  `<Svg>` children the same way.

**Driving `dir` from movement**: whoever owns position sets `dir` from the
movement delta — right→`right`, left→`left`, up→`up`, down→`down`. The player
does this on D-pad input; ambient NPCs do it from their step direction.

## 2. Walking animation

`SmoothSprite` takes **`walking`** (bool). When true:
- **Legs** swing alternately (SVG `animateTransform` rotate, ±10° around the
  hip, 0.5s loop) — the two legs are 180° out of phase.
- **Arms** swing opposite to the legs (±8°).
- **Whole body** does a subtle vertical bob (`forinWalkBob`, 0.5s).

In RN: drive these with `react-native-reanimated` (or `Animated`) — a shared
clock with two legs/arms interpolating opposite rotations, plus a small
translateY. Toggle on while a move tween is in flight.

**Player movement pattern** (campus + interiors): on each step, set
`dir` + `walking=true`, then clear `walking` after ~320ms (one step). Position
tweens between tiles with a CSS `transition` (RN: a timing animation on
left/top, ~0.3–0.55s linear).

## 3. Idle motion (ambient liveliness, always-on when standing)

When **not** walking, every sprite is subtly alive — desynced per instance via
a per-sprite random `seed` so a crowd doesn't pulse in unison:

- **Breathing** — gentle vertical bob + ~1% vertical scale (`forinIdleBreath`,
  3.2s, randomized negative delay).
- **Blinking** — skin-colored eyelid caps briefly cover the dot eyes
  (`forinBlink`, ~5.5s cycle, randomized delay). Front-facing only; omitted on
  side/back views.

In RN: a looping breathing transform per sprite (random phase offset), and a
blink driven by a randomized timer that toggles two small skin-colored
`<Rect>` caps over the eyes for ~120ms.

## 4. Ambient NPC behaviors (campus)

The campus runs a small **ambient-life engine** (`PatrolNPCs` in
`screens-explore-v2.jsx`) — isolated in its own component so its timer only
re-renders the moving NPCs, never the whole map. Two behavior modes:

### `patrol` — fixed waypoint route
An agent follows an explicit `path` of tile points, ping-ponging end to end.
Direction is derived from each step's delta.

### `wander` — free roam within a bound
An agent steps one tile in a random cardinal direction, **clamped to a
rectangular `bound`** so it never leaves its area / enters a building. Good for
patients/parents/kids loitering in a plaza.

### Pauses + emotes (both modes)
On any tick an agent may **stop and emote** (~22% chance): it stands still for
2–3 ticks and pops a **speech-bubble emoji** above its head (💬 😄 🤔 ☕ 👍 ✨
😮 🩺 📋 ❤️). The bubble is a small white rounded box with an ink border, a
little tail, and a pop-in animation (`forinEmotePop`).

### Cadence
The engine ticks every **1.8s** (calm, readable — not frantic). Tune per taste.

### Stable identity while moving — IMPORTANT
A moving NPC must keep its **same skin/hair/outfit** every frame. The sprite's
identity is normally hashed from its `(x,y)` tile — which **changes as it
moves**, causing a color-flicker bug. The fix: pass a **stable `seed` prop**
to the role component; when present, identity is hashed from `seed` instead of
position. Always give moving/ambient NPCs a fixed `seed`.

```jsx
// stable color while wandering:
<DerpNurse seed={11} dir={dir} walking={walking}/>
// static decorative NPC can omit seed (defaults to its spawn tile):
<DerpNurse x={3} y={6}/>
```

In RN: give each ambient agent a constant `seed` in its definition; never
derive identity from live position.

## 5. RN implementation checklist

- [ ] `Sprite` accepts `dir` + `walking` + `seed`; render three view variants
      (front/back/side, side mirrored for left).
- [ ] Walking = opposite-phase leg/arm rotations + body bob, gated on `walking`.
- [ ] Idle = per-instance breathing + randomized blink when `!walking`.
- [ ] A reusable `useGridMover({ mode, path|bound, tickMs, emoteChance })` hook
      that yields `{x, y, dir, walking, emote}` for ambient NPCs, with the
      pause/emote logic and bound-clamping.
- [ ] Player movement sets `dir`+`walking` from input and tweens position.
- [ ] Ambient agents carry a constant `seed`; never identity-by-position.
- [ ] Keep the ambient engine isolated from the heavy map render (its own
      component / state) so per-tick updates stay cheap.
