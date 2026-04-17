# Exercise Redesign — Design Spec

- **ID**: Sub-project 3 of 3 in the redesign initiative
- **Date**: 2026-04-17
- **Status**: Approved design, pending implementation plan
- **Depends on**: [Sub-project 1 — i18n Foundation](./2026-04-17-i18n-foundation-design.md), [Sub-project 2 — Spatial UX Foundation](./2026-04-17-spatial-ux-foundation-design.md)
- **Master plan**: see [2026-04-17-redesign-master-plan.md](./2026-04-17-redesign-master-plan.md)

## 1. Purpose

Replace the weakly-themed "list of exercises" feel with **stage-as-scenario** gameplay: each stage is one place, one NPC (or one NPC plus supporting cast), framed by an opening scene and a closing beat. Introduce a new `synonym_match` exercise type that anchors target-language vocabulary in the user's native language, deprioritise the `sentence_arrangement` type, and make difficulty progression feel human — NPC mood and situational tension — rather than merely "longer sentences."

The product value stated by the owner: learners should feel they are experiencing real workplace communication (with patients, peers, and doctors), not doing grammar drills.

## 2. Non-goals

- Deleting `sentence_arrangement`. The type is retained as a dormant, reusable code path for Phase 2+ experiments.
- Generating scenarios with an LLM at runtime. MVP scenarios are hand-authored.
- Voice / speech recognition in `conversation` exercises. Text-based evaluation stays.
- Expanding the NPC roster beyond the six defined in Sub-project 2.
- Database-backed NPC profiles. MVP keeps NPCs as a client-side constant set.
- Roguelike branching inside a stage (Phase 2+ extension hook is reserved).

## 3. Scope decisions (traceability)

| # | Decision | Chosen |
|---|---|---|
| Q1 | Stage ↔ exercise coupling | **C** — Hybrid: scene opener + connected exercises + scene ending |
| Q2 | NPC cast + stage subject mix | **A** — 6 NPCs across Patient / Peer / Doctor; stage split ~Patient 10 / Peer 6 / Doctor 4 of 20 |
| Q3 | Difficulty progression model | **B** — Three orthogonal axes: language difficulty, tension level, NPC mood |
| Q4 | `synonym_match` UI mode | **B** — 4-pair two-column tap-pair; schema reserves a `mode` field for future variants |

## 4. Exercise type inventory

| Type | MVP state | Role in new content mix |
|---|---|---|
| `sentence_arrangement` | Dormant — no new content authored; code path intact | Phase 2+ variants |
| `word_puzzle` | Active | Clinical dialogue fill-in-the-blank |
| `meaning_match` | Active | Jargon ↔ plain-language flipcard |
| `conversation` | Active | LLM-evaluated free response; used for scene closers |
| **`synonym_match`** | **New, MVP core** | Native ↔ target vocabulary anchoring via pair-match |

A stage typically uses 3–5 exercises; the last exercise is preferably a `conversation` beat so the scene closes with natural language production.

## 5. Stage structure

### 5.1 Flow

```
StageScreen
 ├─ SceneOpener   (markdown blurb + NPC avatar + location chip)
 ├─ Exercise 1    (warmup — synonym_match or meaning_match)
 ├─ Exercise 2    (core — word_puzzle or synonym_match)
 ├─ Exercise 3    (core — word_puzzle or meaning_match)
 ├─ Exercise 4    (application — conversation)
 └─ SceneEnding   (1–2 sentences of closure + mascot reaction)
```

### 5.2 Scene conventions

- **SceneOpener** — 2–4 sentences of markdown. Sets location, time, NPC entry. Short enough to read once. Example: `Mr. Johnson, 68, just returned from the OR. He looks groggy and presses the call button.`
- **SceneEnding** — 1–2 sentences that land the scene's result, referencing how the learner's answers shifted the situation. Example: `You explained the post-op pain plan clearly; Mr. Johnson relaxes and thanks you.`
- Both fields are nullable so existing stages without scenes keep rendering.

## 6. Data model changes

### 6.1 `stages` — add columns

```sql
ALTER TABLE stages
  ADD COLUMN scene_opener_md TEXT,
  ADD COLUMN scene_ending_md TEXT,
  ADD COLUMN scene_npc_key   TEXT,                     -- 'patient.johnson' | 'peer.sarah' | 'doctor.brown'
  ADD COLUMN tension_level   TEXT NOT NULL DEFAULT 'calm',
  ADD COLUMN npc_mood        TEXT[] NOT NULL DEFAULT '{}';
```

- `scene_npc_key` format: `<category>.<name>`. Category (`patient` / `peer` / `doctor`) is derived by splitting on `.`.
- `tension_level` and `npc_mood` values are validated in the application layer against `SupportedTensionLevels` and `SupportedNPCMoods` Go slices. No DB `CHECK`; adding a new mood stays a code-only change.
- `npc_mood` is an array because one scene can carry multiple simultaneous tags (e.g., `['demanding', 'confused']`).

### 6.2 `exercises.content` — `synonym_match` sub-schema

Defined in Sub-project 1 and reaffirmed here:

```jsonc
{
  "type": "synonym_match",
  "mode": "pair",                           // MVP-fixed; reserved for variants
  "direction": "native_to_target",          // or 'target_to_native'
  "pairs": ["<vocab-uuid>", ..., "<vocab-uuid>"]   // 2..6 UUIDs into vocabulary
}
```

Existing exercise types keep their current JSONB shapes.

### 6.3 NPC profiles — client-side constants (no DB)

```ts
// mobile/src/data/npcs.ts
export const NPC_CATEGORIES = ['patient', 'peer', 'doctor'] as const;
export type NPCCategory = typeof NPC_CATEGORIES[number];

export interface NPCProfile {
  key: string;                              // 'patient.johnson'
  category: NPCCategory;
  displayName: string;                      // 'Mr. Johnson'
  avatar: string;                           // file under mobile/assets/characters/
  defaultTone: 'calm' | 'anxious' | 'casual' | 'formal' | 'busy';
}

export const NPCS: Record<string, NPCProfile> = {
  'patient.johnson': { key: 'patient.johnson', category: 'patient', displayName: 'Mr. Johnson', avatar: 'patient-johnson.svg', defaultTone: 'calm' },
  'patient.lee':     { key: 'patient.lee',     category: 'patient', displayName: 'Ms. Lee',     avatar: 'patient-lee.svg',     defaultTone: 'anxious' },
  'peer.sarah':      { key: 'peer.sarah',      category: 'peer',    displayName: 'Sarah (senior)', avatar: 'peer-sarah.svg',  defaultTone: 'calm' },
  'peer.emma':       { key: 'peer.emma',       category: 'peer',    displayName: 'Emma (fellow)',  avatar: 'peer-emma.svg',   defaultTone: 'casual' },
  'doctor.brown':    { key: 'doctor.brown',    category: 'doctor',  displayName: 'Dr. Brown',  avatar: 'doctor-brown.svg',    defaultTone: 'formal' },
  'doctor.park':     { key: 'doctor.park',     category: 'doctor',  displayName: 'Dr. Park',   avatar: 'doctor-park.svg',     defaultTone: 'busy' },
};
```

Migration path if the cast grows beyond 10–15 NPCs: lift this to a `npcs` table with identical fields and rewrite the import — documented as an extension hook.

## 7. Difficulty progression (three-axis model)

| Axis | Field | Values |
|---|---|---|
| Language | `stages.difficulty` (existing) | `beginner` / `pre_intermediate` / `intermediate` / `upper_intermediate` |
| Tension | `stages.tension_level` (new) | `calm` / `tense` / `crisis` |
| NPC mood | `stages.npc_mood` (new, per-scene) | `calm / anxious / demanding / dismissive / confused / angry / distracted / grateful / apologetic` |

### 7.1 Seed curve for 20 MVP stages

| Stages | Language | Tension | Typical moods | Category mix |
|---|---|---|---|---|
| 1–6 | beginner | calm | calm, grateful, anxious | Patient ×4, Peer ×2 |
| 7–12 | pre_intermediate | calm / tense | anxious, confused, demanding | Patient ×4, Peer ×3, Doctor ×1 |
| 13–17 | intermediate | tense | demanding, distracted | Patient ×2, Peer ×2, Doctor ×3 |
| 18–20 | upper_intermediate | crisis | angry, dismissive | Patient ×2, Doctor ×1 |

Content authors may re-weight; this curve is the seed starting point and embodies the owner's instruction that difficulty grows along "character unreasonableness + situational intensity," not just sentence length.

### 7.2 Register conventions

- **Patient** scenes: plain English, empathy phrases, symptom description.
- **Peer** scenes: informal shorthand (`vitals`, `NPO`, `handover`, `I'll take five`).
- **Doctor** scenes: SBAR-style structured reports; formal address; concise clarifying questions.

## 8. `synonym_match` interaction

### 8.1 UX specification

1. Left column: 4 native-language word cards (for `direction="native_to_target"`).
2. Right column: 4 target-language word cards, shuffled.
3. Tap a left card → card gets a **golden amber** selected border.
4. Tap a right card:
   - Correct pair: a short amber connector line animates between the two cards, both cards get a check badge and are disabled.
   - Wrong pair: dusty-pink flash (200 ms × 3), `heart -1`, both cards re-enable.
5. When all four pairs are resolved, advance to the next exercise.
6. `direction="target_to_native"`: contents swap between columns; logic identical.
7. Pair count is driven by `content.pairs.length` (2–6); layout adapts vertically.

### 8.2 Accessibility

- Card tap area ≥ 44 × 44 pt.
- High-contrast mode: feedback uses outline weight rather than colour alone.
- Labels read by screen reader in `"<native word>, pairs with: choose from right column"` format.

### 8.3 Translation fallback

If `vocabulary_translations` has no row for the user's locale, the repository layer (Sub-project 1 §5.4) falls back to `canonical_en`. For `native_to_target` the card then shows English on both sides — the exercise UI renders a subtle warning in `__DEV__` and silently serves the fallback in production.

## 9. Migrations, seed, and content

### 9.1 New migrations

1. `<seq>_add_scene_fields_to_stages.up.sql` + `.down.sql`
2. `<seq>_add_tension_and_npc_mood_to_stages.up.sql` + `.down.sql`

### 9.2 Seed updates (`server/scripts/seed.go`)

- Fill `scene_opener_md`, `scene_ending_md`, `scene_npc_key`, `tension_level`, `npc_mood` for all 20 MVP stages.
- Create ~20 `synonym_match` exercise instances (one per stage on average), each referencing 4 vocabulary UUIDs seeded in Sub-project 1.
- **Zero** new `sentence_arrangement` instances.
- Seed is idempotent using the existing `ON CONFLICT` pattern.

### 9.3 Content authoring guidelines (for writers)

- Write the opener before selecting exercise UUIDs — the situation drives the vocab pick.
- Tag moods narrowly: every mood tag must be defended by a specific line in the scene.
- A peer scene ending should leave the learner with a short "what would you do next shift?" thought, echoed softly by Moro.

## 10. Testing

- **Unit (server)**: `synonym_match` repository path joins translations correctly and falls back when locale missing; `tension_level` / `npc_mood` validators reject unknown values.
- **Integration**: `GET /v1/curriculum/stages/:id` returns the new scene fields; submitting a `synonym_match` answer records pair-level correctness.
- **Mobile**: snapshot test for `SceneOpener`; interaction test for the pair-match component (tap-correct, tap-wrong, completion).

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Narrow NPC cast feels repetitive across 20 stages | Mood tags + tension level create ≥ 5 distinct "versions" per NPC; seed avoids reusing the exact mood tuple within 5 stages. |
| `synonym_match` feels similar to `meaning_match` | Interaction is mechanically different (two-column tap vs flipcard); palette cues differ; labels clarify the cross-lingual nature. |
| Over-aggressive mood tags come off as caricature | Content review rule: every `angry` or `dismissive` scene must include a recovery beat (resolution, apology, or learner-initiated escalation). |
| `sentence_arrangement` code rots while unused | Keep the existing tests green; schedule a Phase 2+ review before removing or resurrecting the type. |
| Writer confusion on mood vs tension axes | Author guide defines: tension = *environment*, mood = *this NPC, this scene*. Worked examples in `docs/04_content_architecture.md` updated when Sub-project 3 ships. |

## 12. Implementation checklist (preview)

Detailed plan produced separately via `writing-plans`. Sequence:

1. Migrations for new `stages` columns.
2. DTO / model / repo extensions for scene fields and synonym match.
3. Vocabulary lookup service (ties to Sub-project 1) used by the synonym repo.
4. Mobile: `SceneOpener` / `SceneEnding` components; `StageScreen` orchestration update.
5. Mobile: `SynonymMatch` component; register with exercise registry.
6. NPC constant set + avatar asset drop.
7. Seed authoring for 20 stages (iterative with content reviewer).
8. Tests (server unit + integration, mobile component + snapshot).
