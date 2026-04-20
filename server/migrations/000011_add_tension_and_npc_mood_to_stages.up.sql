ALTER TABLE stages
  ADD COLUMN tension_level TEXT   NOT NULL DEFAULT 'calm',
  ADD COLUMN npc_mood      TEXT[] NOT NULL DEFAULT '{}';
