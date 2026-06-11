-- Authored collision layer for interiors (blocked tile rectangles).
ALTER TABLE interiors ADD COLUMN collision jsonb NOT NULL DEFAULT '[]';
