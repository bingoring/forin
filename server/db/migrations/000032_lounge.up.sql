-- 스태프 라운지 — 같은 직업으로 해외로 가는 사람들의 게시판 (핸드오프 v29~v31 07).
--
-- 이 테이블이 앱의 첫 사용자 생성 콘텐츠다. 그래서 두 가지가 스키마에 박혀 있다:
--
--  1. `deleted_at` — 지운 글은 즉시 사라지지만 행은 남는다. 신고된 글을 나중에
--     들여다볼 수 있어야 하고, 작성자가 지웠다는 사실 자체가 신고 처리의 근거다.
--  2. `lounge_reports` — 스토어 심사(Apple 1.2)는 UGC가 있는 앱에 신고 경로를
--     요구한다. 신고를 받아 적을 곳이 없으면 신고 버튼도 만들 수 없다.
--
-- kind/tag 류에 CHECK를 두지 않는 것은 이 저장소의 규칙이다(internal/domain/lounge가
-- 허용 집합을 소유한다) — 글 종류를 하나 더 만드는 데 마이그레이션이 필요해선 안 된다.

CREATE TABLE lounge_posts (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    kind        text        NOT NULL DEFAULT 'talk',
    body        text        NOT NULL,
    tags        text[]      NOT NULL DEFAULT '{}',
    -- 대화 공유 글이 인용한 시나리오와 그 연속 턴들. 스니펫은 JSONB로 둔다:
    -- 턴의 모양은 대화 모델을 따라가고, 그때마다 컬럼을 늘릴 이유가 없다.
    scenario_id text        NOT NULL DEFAULT '',
    snippet     jsonb,
    cheers      int         NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    deleted_at  timestamptz
);
-- 피드는 최신순 한 방향으로만 읽는다. 지운 글은 인덱스에서도 빠진다.
CREATE INDEX idx_lounge_posts_feed ON lounge_posts (created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_lounge_posts_author ON lounge_posts (author_id, created_at DESC) WHERE deleted_at IS NULL;

-- 응원은 1인 1회. 카운터는 lounge_posts.cheers에 캐시하되, 진실은 이 테이블이다.
CREATE TABLE lounge_post_cheers (
    post_id    uuid        NOT NULL REFERENCES lounge_posts (id) ON DELETE CASCADE,
    user_id    uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE lounge_reports (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id    uuid        NOT NULL REFERENCES lounge_posts (id) ON DELETE CASCADE,
    user_id    uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reason     text        NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);
-- 같은 사람이 같은 글을 두 번 신고해도 한 건이다.
CREATE UNIQUE INDEX idx_lounge_reports_once ON lounge_reports (post_id, user_id);
