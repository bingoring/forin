# forin design system

forin's UI is anchored in two feelings: **Duolingo** (game, bright, high-contrast learning surfaces) and **Animal Crossing** (warm, cozy, wood/cream domestic surfaces). The design system encodes that split so a screen never has to decide its palette from first principles — it reaches for `color.primary` for a learning CTA, `color.wood` for a cozy room surface, and the shapes/shadows fall into place.

This document is the contract between the tokens and anything that draws pixels. If a value doesn't live here or under `mobile/src/theme/`, it's a local decision that won't survive a theme change — reconsider.

## Layers

```
┌──────────────────────────────────────────────────┐
│  Screens (src/screens)                           │
│    render content, compose UI primitives         │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│  UI primitives (src/ui)                          │
│    Button, Icon, Card, Badge, ProgressBar, …     │
│    each one owns its variants + size system      │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│  Theme tokens (src/theme/tokens.ts + text.ts)    │
│    palette, color, radius, spacing, elevation,   │
│    motion, fontFamily, fontSize, text variants   │
└──────────────────────────────────────────────────┘
```

Screens *only* import from `src/ui` and `src/theme`. Reaching into `react-native` for a raw `<Pressable>` or hard-coding a hex is a bug.

## Tokens

All tokens live in [`mobile/src/theme/tokens.ts`](../mobile/src/theme/tokens.ts) and [`text.ts`](../mobile/src/theme/text.ts), re-exported by [`index.ts`](../mobile/src/theme/index.ts).

### Palette

Two colour families — a bright learning set and a warm cozy set — feed a semantic layer screens actually use.

| Family   | Keys                                               | Role                                |
| -------- | -------------------------------------------------- | ----------------------------------- |
| Learning | `sky` / `coral` / `sun` / `mint` / `rose` / `lav`  | CTAs, hearts, XP, correctness tints |
| Cozy     | `cream` / `sand` / `wood` / `woodDeep` / `woodDark`| Profile, shop, room surfaces        |
| Neutrals | `ink` / `inkSoft` / `inkFaint` / `paper` / `hair`  | Text, borders, default backgrounds  |

Every learning family colour ships with matching `*Deep` (pushable shadow) and `*Light` (soft tint surface) variants.

Screens should use the **semantic** alias layer, not palette names directly:

```ts
import { color } from '../theme';
color.primary       // == palette.sky
color.accent        // == palette.coral
color.success       // == palette.mint
color.danger        // == palette.rose
color.xp            // == palette.sun
color.premium       // == palette.lav
color.cream         // == palette.cream
```

Renaming `palette.sky → palette.ocean` later doesn't cascade.

### Spacing

4pt grid, exported as `sp.s1..s10`:

```
s1 = 4    s2 = 8    s3 = 12   s4 = 16   s5 = 20
s6 = 24   s7 = 32   s8 = 40   s9 = 56   s10 = 72
```

Legacy screens still import the older `spacing.xs..xl` aliases during the design-system migration. Migrated screens use `sp`.

### Shape

```
radius.r1 = 10   radius.r2 = 16   radius.r3 = 20   radius.r4 = 28   radius.r5 = 36
radius.pill = 999
```

`r2` is the default for cards and inputs; `pill` for chips, badges, and toggle tracks.

### Pushable depth

The "Duolingo 3D press" is its own token system:

```
pushable.sm  { depth: 3, radius: 12 }
pushable.md  { depth: 4, radius: 14 }   ← default
pushable.lg  { depth: 5, radius: 16 }
pushable.xl  { depth: 6, radius: 18 }
```

The `Pushable` primitive (`src/ui/Pushable.tsx`) uses these to render a coloured shadow strip of height `depth` along the bottom edge, then translates the face by `depth − 1` on press so it lands on the shadow with a 1px residual (stops feeling dead).

### Motion

```
duration.fast    = 120ms   // press transitions
duration.medium  = 200ms   // default ui transitions
duration.slow    = 320ms   // cross-fades
duration.slower  = 500ms   // celebration flourishes

easing.out     = [0.22, 1, 0.36, 1]    // ease-out, authored
easing.bounce  = [0.34, 1.56, 0.64, 1] // bounce-out for celebratory micro-interactions
```

### Typography

Nunito (brand) + Pretendard (Korean fallback) + system fallbacks. Font weights: 400 / 700 / 800 / 900.

```ts
import { text } from '../theme';
<Text style={text.display}>forin</Text>  // 32px, 900 black
<Text style={text.h1}>Welcome back</Text> // 24px, 800 extra-bold
<Text style={text.body}>...</Text>        // 15px, 400 regular
<Text style={text.micro}>BETA</Text>      // 11px, 800 uppercase caps
```

See `src/theme/text.ts` for the full set. Component-local text tweaks (one-off letter spacing, colour) belong in the component file, not here.

## Primitives

Everything in `mobile/src/ui/` is a Lego brick. Screens compose them; they don't decorate raw RN primitives.

| Primitive    | When                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `Button`     | Any tappable CTA with text. Nine variants × four sizes.                     |
| `Pushable`   | Only when Button doesn't fit — custom-shape tap targets (node pills, etc.). |
| `Icon`       | Named icon from the rounded set. Use `color` to tint.                        |
| `Card`       | Grouped content with the "coloured bottom border" silhouette.                |
| `Badge`      | Tiny uppercase pill for taxonomy / state (not tappable).                     |
| `ProgressBar`| Single-track horizontal metric (goal, level XP, mastery).                    |
| `XPBar`      | Segmented XP bar (5 segments by default).                                    |
| `Hearts`     | Row of filled/hollow hearts (lives, affection).                              |
| `CoinChip`   | Currency/count pill — gold / gem / heart tones.                              |

See [`DesignPlaygroundScreen`](../mobile/src/screens/dev/DesignPlaygroundScreen.tsx) for a live gallery — open it from `Profile → Open design playground` (shown only in `__DEV__`).

## Conventions

- **Colour** — reach for `color.*` semantic aliases first. Drop to `palette.*` only inside a primitive, never in a screen.
- **Spacing** — `sp.s4` over `16`. Raw numbers are a smell.
- **Fonts** — weight + size live in `text.*`. Don't set `fontWeight` directly on a `<Text>`.
- **Shadows** — use `Pushable` for press-able surfaces. Static shadows come from `elevation.*` (`sm`, `md`, `lg`, `pop`).
- **Icons** — `<Icon name="heart" />`. If the icon you need isn't in the set, extend `src/ui/Icon.tsx` — don't inline an `<Svg>`.
- **Animations** — driven by `Animated` + native driver. Bezier curves from `easing`; durations from `duration`.

## Migration status (2026-04-22)

Phase 1 (tokens + core primitives) is **in progress**. New DS lives under `src/ui/`; legacy components remain under `src/components/common/` until each screen is rebuilt.

| Phase | Scope                                   | Status  |
| ----- | --------------------------------------- | ------- |
| 1     | Tokens, Button, Icon, Card, Badge, progress family, playground | in progress |
| 2     | TextInput, Toggle, Tabs, Avatar, SectionHeader, ListRow, SpeechBubble, Toast, Divider, StageNode, OptionCard, Chip | planned |
| 3     | Hatto mascot (PNG-based), NPCAvatar swap                   | planned |
| 4     | Auth + onboarding screens rebuilt                          | planned |
| 5     | Learning loop screens rebuilt                              | planned |
| 6     | Profile + misc screens rebuilt; legacy tokens deleted      | planned |
| 7     | Cleanup, docs sweep, US locale scaffold                    | planned |

Each phase lands as its own PR. When the migration closes, `src/components/common/` goes away and `src/theme/colors.ts / typography.ts / spacing.ts` with it.
