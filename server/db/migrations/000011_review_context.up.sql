-- Review cards remember the CONTEXT they were captured in, so the learner can
-- recall what situation/dialogue prompted the correction.
ALTER TABLE review_cards ADD COLUMN scenario_id text NOT NULL DEFAULT '';
ALTER TABLE review_cards ADD COLUMN context jsonb NOT NULL DEFAULT '{}';
