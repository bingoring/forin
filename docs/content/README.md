# forin content authoring

This directory is where scene content lives — one YAML file per stage.
The importer reads every `stages/*.yaml` file and upserts scene metadata
and synonym-match exercises on the matching stage.

## Workflow

1. Pick a stage by its `(floor_order, unit_order_index, stage_order_index)`
   triple. Floors/units/stages are defined by the curriculum seed; check
   the DB or `server/migrations/000002_seed_curriculum.up.sql` if you are
   unsure what the triple is for your target stage.
2. Copy `stages/floor-1-unit-1-stage-1.yaml` to a new file named after
   the triple — e.g. `stages/floor-2-unit-1-stage-1.yaml`.
3. Edit the `scene` block (all fields optional — unset fields stay as
   they were in the DB) and the `exercises` list.
4. Run `cd server && make content-import`. The command is idempotent;
   you can re-run it after every edit.

## YAML schema

```yaml
locate:
  floor_order: 1            # required — matches curriculum_modules.floor_order
  unit_order_index: 1       # required — matches units.order_index within the module
  stage_order_index: 1      # required — matches stages.order_index within the unit

scene:                       # optional block; any subset of fields accepted
  opener_md: |               # markdown, 2–4 sentences, sets location/NPC entry
    ...
  ending_md: |               # markdown, 1–2 sentences, closes the scene
    ...
  npc_key: patient.johnson   # one of the keys in mobile/src/data/npcs.ts
  tension_level: calm        # calm | tense | crisis (config/scene.go)
  npc_mood:                  # any subset of the 9 moods in config/scene.go
    - grateful
    - anxious

exercises:                   # optional — currently only synonym_match is supported
  - type: synonym_match
    direction: native_to_target   # or target_to_native
    order_index: 99               # optional; defaults to 99 so it runs last
    pairs:                         # 2–6 entries; each must be a canonical_en
      - pain                       # in the `vocabulary` table (see Sub-project 1
      - wound                      # seed). Missing words fail the import.
      - fever
      - bleeding
```

## What the importer does NOT do

- Re-create stages that don't already exist. The triple must resolve to
  an existing row.
- Translate or author exercise types other than `synonym_match`. Other
  types are still authored via SQL migrations.
- Clear `scene` fields that you omit. If you want to blank an opener,
  set `opener_md: ""` explicitly.

## Relationship with `make seed`

`make seed` runs the bootstrap seeder (`server/scripts/seed_scenes.go`),
which writes minimal placeholder scene content on a brand-new DB. Once a
YAML file exists for a stage, running `make content-import` overwrites
the bootstrap content. Writers should generally only need
`make content-import`.
