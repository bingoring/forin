ALTER TABLE units
  ADD COLUMN location_type          TEXT NOT NULL DEFAULT 'generic',
  ADD COLUMN map_x                  NUMERIC(5,2) NOT NULL DEFAULT 50.0,
  ADD COLUMN map_y                  NUMERIC(5,2) NOT NULL DEFAULT 50.0,
  ADD COLUMN hotspot_label_override TEXT;
