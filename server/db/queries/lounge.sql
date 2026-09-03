-- name: CreateLoungePost :one
INSERT INTO lounge_posts (author_id, kind, body, tags, scenario_id, snippet)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- name: LoungeFeed :many
-- One page of the feed, newest first, with the author's display name and the
-- reader's own cheer state joined in.
--
-- `cheered` is per-reader, so it cannot be cached on the row: two people looking
-- at the same post see different buttons. The count CAN be cached (posts.cheers)
-- and is, because a feed page would otherwise count rows per post.
SELECT p.id, p.author_id, p.kind, p.body, p.tags, p.scenario_id, p.snippet,
       p.cheers, p.created_at,
       COALESCE(pr.display_name, '')                      AS author_name,
       COALESCE(pr.destination, '')                       AS author_destination,
       COALESCE(pr.job, '')                               AS author_job,
       COALESCE(g.level, 0)::int                          AS author_level,
       pr.avatar                                          AS author_avatar,
       (c.user_id IS NOT NULL)::bool                      AS cheered
  FROM lounge_posts p
  LEFT JOIN profiles pr     ON pr.user_id = p.author_id
  LEFT JOIN user_progress g ON g.user_id = p.author_id
  LEFT JOIN lounge_post_cheers c ON c.post_id = p.id AND c.user_id = $1
 WHERE p.deleted_at IS NULL
   AND (sqlc.narg('before')::timestamptz IS NULL OR p.created_at < sqlc.narg('before')::timestamptz)
 ORDER BY p.created_at DESC
 LIMIT $2;

-- name: LoungePostAuthor :one
SELECT author_id FROM lounge_posts WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteLoungePost :exec
-- Only the author's own post. The row stays: a deleted post is still evidence
-- for a report filed against it.
UPDATE lounge_posts SET deleted_at = now()
 WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL;

-- name: CheerLoungePost :execrows
-- ON CONFLICT DO NOTHING makes this idempotent: a double tap is one cheer, and
-- the affected-rows count is what tells the caller whether to bump the counter.
INSERT INTO lounge_post_cheers (post_id, user_id) VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: UncheerLoungePost :execrows
DELETE FROM lounge_post_cheers WHERE post_id = $1 AND user_id = $2;

-- name: BumpLoungeCheers :exec
-- GREATEST(0, …) so a race that decrements twice cannot leave a negative count
-- on screen; the cheer rows remain the truth either way.
UPDATE lounge_posts SET cheers = GREATEST(0, cheers + sqlc.arg('delta')::int) WHERE id = sqlc.arg('id');

-- name: ReportLoungePost :exec
INSERT INTO lounge_reports (post_id, user_id, reason) VALUES ($1, $2, $3)
ON CONFLICT DO NOTHING;

-- name: LoungePostsToday :one
-- How many posts this author has made in the last 24h — the rate limit reads it.
SELECT count(*)::int FROM lounge_posts
 WHERE author_id = $1 AND created_at > now() - interval '24 hours';
