ALTER TABLE profiles RENAME COLUMN target_level TO en_level;
ALTER TABLE profiles DROP COLUMN IF EXISTS target_lang;
