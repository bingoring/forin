-- Reverse of 000001_init_schema.up.sql
-- Drop tables in reverse dependency order.

DROP TABLE IF EXISTS notification_log CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS daily_activity_log CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS gift_box_openings CASCADE;
DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS cat_items CASCADE;
DROP TABLE IF EXISTS user_module_progress CASCADE;
DROP TABLE IF EXISTS exercise_responses CASCADE;
DROP TABLE IF EXISTS stage_attempts CASCADE;
DROP TABLE IF EXISTS user_stage_progress CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS stages CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS curriculum_modules CASCADE;
DROP TABLE IF EXISTS user_oauth_providers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS professions CASCADE;
