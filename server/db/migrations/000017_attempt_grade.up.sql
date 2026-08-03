-- AI-graded scenario completion: persist the 0..100 grade alongside the attempt.
-- Nullable so legacy/direct attempts (no grade) and existing rows are unaffected;
-- all existing consumers key on state='cleared' and ignore this column.
ALTER TABLE scenario_attempts ADD COLUMN grade int;
