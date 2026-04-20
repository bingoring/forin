ALTER TABLE curriculum_modules
  ADD COLUMN floor_order   INT  NOT NULL DEFAULT 1,
  ADD COLUMN floor_label   TEXT NOT NULL DEFAULT '',
  ADD COLUMN floor_icon    TEXT NOT NULL DEFAULT 'triage',
  ADD COLUMN map_asset_key TEXT NOT NULL DEFAULT '';
