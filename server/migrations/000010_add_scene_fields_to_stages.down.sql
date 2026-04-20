ALTER TABLE stages
  DROP COLUMN IF EXISTS scene_opener_md,
  DROP COLUMN IF EXISTS scene_ending_md,
  DROP COLUMN IF EXISTS scene_npc_key;
