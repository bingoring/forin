# forin Redesign — Master Plan

- **Date**: 2026-04-17
- **Initiator**: product owner feedback after first signup and stage clear
- **Status**: Specs written, pending per-sub-project implementation plans

## 1. Why redesign now

After the first successful stage completion on the iOS simulator, the product owner surfaced three structural gaps:

1. **The sentence-arrangement exercise type is the wrong kind of fun.** Learners assemble word blocks into target sentences — it's solvable by grammar pattern-matching and doesn't simulate the communication problems that healthcare workers actually face.
2. **Multilingual support is missing.** Nationality and native language are not tracked; the app treats every learner as if English is their only reference.
3. **The visual language feels clinical-corporate, not friendly.** Emojis stand in for iconography, the palette is indigo-on-white, and there is no mascot-led navigation metaphor. The owner wants a Duolingo-grade "cute" feel anchored in a hospital world learners can move through.

Layered on top: the owner wants difficulty progression to come from *character unreasonableness + situational intensity* — not merely longer sentences — and wants the workplace to include nurse↔nurse and nurse↔doctor communication, not just patients.

## 2. What we're building (in one line each)

- **Sub-project 1 — i18n Foundation**: Give every user a native language. Add a vocabulary domain with per-locale translations. Wire the mobile UI through an `i18n-js` layer.
- **Sub-project 2 — Spatial UX Foundation**: Replace list navigation with a 2D storybook hospital map. Repalette and reicon the app. Introduce a mascot (`Moro`) based on the owner's cat.
- **Sub-project 3 — Exercise Redesign**: Deprioritise `sentence_arrangement`. Introduce `synonym_match` (pair-match on native ↔ target vocabulary). Frame each stage as a scene with an opener, an NPC (patient / peer / doctor), tension level, and mood tags.

## 3. Sequencing and why

```
Sub-project 1 (i18n)
      ↓
Sub-project 2 (Spatial UX)
      ↓
Sub-project 3 (Exercise Redesign)
      ↓
Resume: Phase 2+ from docs/09_development_roadmap.md
```

Each sub-project is a dependency of the next:

1. i18n ships `native_language`, the `vocabulary` + `vocabulary_translations` tables, and the mobile `t()` infrastructure. Without these, the `synonym_match` exercise has no home and the UI refresh has to smuggle translation plumbing in.
2. Spatial UX ships the palette, icon components, mascot, map screen, and the six human NPC avatars. Without these, exercise scenes have no visual vocabulary and floor/location metadata has nowhere to render.
3. Exercise Redesign ships the scene structure, `synonym_match`, the difficulty triaxis, and 20 authored seed stages. It uses artefacts from (1) and (2) directly.

Roguelike stage branching, LLM-authored scenarios, a Doctor/Pharmacist profession map, and database-backed NPC profiles are explicitly **out of this initiative** and filed as Phase 2+ extensions.

## 4. Specs

| # | Spec | Key outputs |
|---|---|---|
| 1 | [i18n Foundation](./2026-04-17-i18n-foundation-design.md) | `users.native_language`; `vocabulary` + `vocabulary_translations`; `i18n-js` + `expo-localization`; `LanguageSelectScreen` |
| 2 | [Spatial UX Foundation](./2026-04-17-spatial-ux-foundation-design.md) | Warm Cozy palette; Flaticon/Phosphor icon component; `Moro` mascot with 8 poses; hospital `MapScreen` + hotspots; floor-unlock flow; 6 NPC avatars |
| 3 | [Exercise Redesign](./2026-04-17-exercise-redesign-design.md) | Scene opener/ending on stages; `scene_npc_key`; three-axis difficulty (`difficulty`, `tension_level`, `npc_mood`); `synonym_match` pair-match; 20 reseeded stages |

## 5. Shared principles (apply across all three)

- **Extensibility over constraints.** New NPC mood tags, new locales, new exercise variants, new floors — each should be a content or code-only addition, never a migration if avoidable. Every enum-like field (locale, tension level, mood, NPC category, icon name) lives as a Go slice or TypeScript union, not as a DB `CHECK`.
- **Keep gameplay continuity.** The cat-item / gift-box / shop / inventory / achievement systems remain intact. The cat becomes `Moro` (visual refresh), not a new entity.
- **The scene is the unit of experience.** A stage ships with an opener, an NPC, a mood, and a closing beat. Exercises exist to move that scene forward.
- **Target-language text is sacred.** We translate UI chrome and vocabulary pairs into the user's native language. We do not translate the English scenarios themselves — that would undo the product's purpose.
- **No emoji in product surfaces.** Every user-visible symbol comes from the icon system (hero via Flaticon, util via Phosphor). Existing emoji usages are audited out during Sub-project 2.

## 6. Timeline expectation

Each sub-project gets its own implementation plan (via the `writing-plans` skill) before any code is written. A reasonable shape for the full initiative:

- Sub-project 1: 1–1.5 weeks (backend-light; mobile adds a dependency and a screen).
- Sub-project 2: 2–3 weeks, most of it paced by art delivery (floor illustrations, mascot, NPC avatars). Code is ready to ship the moment assets land.
- Sub-project 3: 1.5–2 weeks of code + a content authoring sprint for 20 stages.

Total: about 5–7 weeks of focused work, compatible with the broader 10-week MVP window recorded in `docs/09_development_roadmap.md`.

## 7. What happens after

Once all three sub-projects ship, development rejoins the existing roadmap: Phase 2+ adds Doctor and Pharmacist professions (each getting its own map + NPC set), additional target countries, premium subscription, voice input, cohort features, and the parked roguelike mechanic. Those items do not need to be re-litigated here — the redesign is meant to make the foundation strong enough that they can be built on it.
