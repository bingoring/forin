-- 프로필 변경 이력 (Build Spec learning-tracks P1b).
--
-- 학습 설정 화면(P1)이 트랙(P2)보다 먼저 나가므로, 그 사이에 직업이나 학습 언어를
-- 바꾼 사람의 진도는 "어느 트랙의 것인가"가 모호해진다 — 3주치 복습 카드가 간호사
-- 영어의 것인지 호텔 독일어의 것인지 행 안에 아무 근거가 없다.
--
-- 두 가지 해법 중 이것을 골랐다:
--
--  · 쓰기 시점에 각 행(시도·복습카드·발음)에 job/target_lang을 박는다 → 마이그레이션 3개 +
--    뜨거운 쓰기 경로 전부가 프로필을 알아야 하고, P2가 track_id를 넣으면 곧 중복이 된다.
--  · 변경 자체를 기록한다 → 테이블 1개 + insert 한 곳. 변경 시각으로 이력을 시간순
--    분할할 수 있다: 어떤 변경 이전의 행은 이전 주제의 것이다.
--
-- 이건 감사 로그이지 사용자 화면이 아니다. 노출 엔드포인트를 만들지 않는다 — 만들면
-- 남의 이력을 보여주지 않을 책임이 생긴다.
CREATE TABLE profile_changes (
    id          bigserial PRIMARY KEY,
    user_id     uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    -- 바뀐 것만 채운다. 목적지만 갈아탄 것(미국→호주)과 주제가 바뀐 것(간호사→호텔리어)은
    -- P2의 백필에서 전혀 다르게 취급되므로, 어느 축이 움직였는지가 행에 남아야 한다.
    from_job    text        NOT NULL DEFAULT '',
    to_job      text        NOT NULL DEFAULT '',
    from_lang   text        NOT NULL DEFAULT '',
    to_lang     text        NOT NULL DEFAULT '',
    from_dest   text        NOT NULL DEFAULT '',
    to_dest     text        NOT NULL DEFAULT '',
    changed_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_profile_changes_user ON profile_changes (user_id, changed_at DESC);
