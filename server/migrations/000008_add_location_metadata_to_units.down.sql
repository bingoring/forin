ALTER TABLE units
  DROP COLUMN IF EXISTS location_type,
  DROP COLUMN IF EXISTS map_x,
  DROP COLUMN IF EXISTS map_y,
  DROP COLUMN IF EXISTS hotspot_label_override;
