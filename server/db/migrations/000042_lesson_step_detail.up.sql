-- v45: STEP 1 에서 틀린 단어를 STEP 2 로 넘긴다("틀린 단어는 STEP 2 문장에 다시 나와요").
-- 앱 안에서만 넘기면 앱을 껐다 켜면 사라지므로 기록에 둔다. 모양은 코드 쪽이 정한다
-- ({"missed": [wordId]}) — CHECK 없음.
ALTER TABLE lesson_step_clears ADD COLUMN detail jsonb NOT NULL DEFAULT '{}';
