-- 동료(colleague) 시스템 — 초대 코드로 맺는 관계, 응원, 프레즌스, 공개 범위.
-- Build Spec: projects/forin/02-construction/home-colleagues/domain-entities.md
--
-- relation/status 류는 DB CHECK를 두지 않는다. 허용 집합은 Go 코드측이 소유하고
-- (internal/domain/colleague), 멘토-멘티 확장 시 마이그레이션 없이 값만 늘린다.

-- 방향성 2행: A—B 연결은 (A,B)와 (B,A) 두 행. peer↔peer, mentor↔mentee.
CREATE TABLE colleague_links (
    owner_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    other_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    relation   text        NOT NULL DEFAULT 'peer',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (owner_id, other_id)
);
CREATE INDEX idx_colleague_links_owner ON colleague_links (owner_id, created_at DESC);

CREATE TABLE invite_codes (
    code       text        PRIMARY KEY,
    user_id    uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    relation   text        NOT NULL DEFAULT 'peer',
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    max_uses   int         NOT NULL DEFAULT 10,
    uses       int         NOT NULL DEFAULT 0,
    revoked_at timestamptz
);
-- 사용자당 활성 코드는 1개 (INV-5).
CREATE UNIQUE INDEX idx_invite_codes_active ON invite_codes (user_id) WHERE revoked_at IS NULL;

CREATE TABLE colleague_requests (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    to_user_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    relation     text        NOT NULL DEFAULT 'peer',
    code         text        NOT NULL DEFAULT '',
    status       text        NOT NULL DEFAULT 'pending',
    created_at   timestamptz NOT NULL DEFAULT now(),
    responded_at timestamptz
);
-- 대기 중 요청은 (from,to)당 1건 (R-5).
CREATE UNIQUE INDEX idx_colleague_requests_pending
    ON colleague_requests (from_user_id, to_user_id) WHERE status = 'pending';
CREATE INDEX idx_colleague_requests_inbox ON colleague_requests (to_user_id) WHERE status = 'pending';

CREATE TABLE cheers (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    to_user_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    preset       text        NOT NULL DEFAULT '',
    message      text        NOT NULL DEFAULT '',
    created_at   timestamptz NOT NULL DEFAULT now(),
    read_at      timestamptz
);
CREATE INDEX idx_cheers_inbox  ON cheers (to_user_id, created_at DESC);
CREATE INDEX idx_cheers_unread ON cheers (to_user_id) WHERE read_at IS NULL;
-- 1일 5건 제한(R-9) 조회용.
CREATE INDEX idx_cheers_pair_day ON cheers (from_user_id, to_user_id, created_at DESC);

CREATE TABLE user_presence (
    user_id      uuid        PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    scenario_id  text        NOT NULL DEFAULT '',
    label        text        NOT NULL DEFAULT '',
    updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE colleague_prefs (
    user_id      uuid        PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    share_status bool        NOT NULL DEFAULT true,
    share_weekly bool        NOT NULL DEFAULT true,
    updated_at   timestamptz NOT NULL DEFAULT now()
);
