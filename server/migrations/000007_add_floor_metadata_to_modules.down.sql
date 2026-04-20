ALTER TABLE curriculum_modules
  DROP COLUMN IF EXISTS floor_order,
  DROP COLUMN IF EXISTS floor_label,
  DROP COLUMN IF EXISTS floor_icon,
  DROP COLUMN IF EXISTS map_asset_key;
