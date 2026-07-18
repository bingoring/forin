-- Quiz content = the actual playable payload (context, sentence template with
-- blanks, word bank, answers, hints) rendered by the quiz screens. jsonb so
-- each quiz type extends without further migrations. Optional: '{}' for quizzes
-- authored before playable content (no regression).
ALTER TABLE quizzes ADD COLUMN content jsonb NOT NULL DEFAULT '{}';
