# Pixel fonts (required asset)

forin uses two free Korean pixel fonts (handoff 01_DESIGN_TOKENS). Drop the `.ttf`
files here, then wire `useFonts` in `src/app/_layout.tsx`:

- `DungGeunMo.ttf` — headings, labels, buttons, all-caps UI. Source: projectnoonnu.
- `Galmuri11.ttf` (400 + 700) — body, Korean sentences. Source: quiple/galmuri.

Until these are added, components fall back to the system font (family names are
defined in `src/theme/tokens.ts`). The build runs without them; only the visual
pixel typography is missing.
