-- Generalize language fields so the app isn't English-only:
-- add explicit target language; rename en_level → target_level.
ALTER TABLE profiles ADD COLUMN target_lang text NOT NULL DEFAULT 'en';
ALTER TABLE profiles RENAME COLUMN en_level TO target_level;
