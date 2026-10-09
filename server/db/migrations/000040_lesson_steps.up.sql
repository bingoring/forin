-- 상황 학습 4단계 (v44). 시드 번들에는 이미 문장과 단어 은행이 실려 있지만, 런타임은
-- 시나리오를 DB에서 읽으므로 두 가지가 DB까지 오지 않으면 STEP 1·2는 영원히 빈 화면이다.
--
-- 문장은 상황에 딸린 값이라 시나리오 행에 둔다. 단어 은행은 주제 단위로 공유되는 값이라
-- (한 주제의 상황 약 21건이 같은 단어를 쓴다) 시나리오마다 복사하지 않고 따로 둔다.
ALTER TABLE scenarios ADD COLUMN sentences jsonb NOT NULL DEFAULT '[]';

CREATE TABLE lexicons (
    theme text  PRIMARY KEY,   -- themes.yaml 의 키. 주제 키는 카탈로그 전체에서 유일하다
    words jsonb NOT NULL DEFAULT '[]'
);

-- STEP 1(단어)·STEP 2(문장)를 끝낸 기록. STEP 3·4는 대화 회차라 scenario_attempts 가 이미
-- 기록한다 — 여기에 두 번 적지 않는다.
--
-- step 에 CHECK 제약을 걸지 않는다: 허용 집합은 코드 쪽(learning.LessonStepKinds)이다.
CREATE TABLE lesson_step_clears (
    user_id     uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    scenario_id text        NOT NULL,
    step        text        NOT NULL,
    cleared_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, scenario_id, step)
);
