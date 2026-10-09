// Package redis implements the RefreshStore (and provides the shared client).
package redis

import (
	"context"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

// New parses a redis URL and returns a connected client.
func New(ctx context.Context, url string) (*redis.Client, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	client := redis.NewClient(opt)
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := client.Ping(pingCtx).Err(); err != nil {
		_ = client.Close()
		return nil, err
	}
	return client, nil
}

// RefreshStore stores hashed refresh tokens as keys with TTL: refresh:{userID}:{hash}.
type RefreshStore struct{ c *redis.Client }

func NewRefreshStore(c *redis.Client) *RefreshStore { return &RefreshStore{c: c} }

func key(userID, hash string) string { return "refresh:" + userID + ":" + hash }

func (s *RefreshStore) Save(ctx context.Context, userID, tokenHash string, ttl time.Duration) error {
	return s.c.Set(ctx, key(userID, tokenHash), "1", ttl).Err()
}

// Consume deletes the key and reports whether it existed (atomic via DEL count).
func (s *RefreshStore) Consume(ctx context.Context, userID, tokenHash string) (bool, error) {
	n, err := s.c.Del(ctx, key(userID, tokenHash)).Result()
	return n > 0, err
}

func (s *RefreshStore) DeleteAll(ctx context.Context, userID string) error {
	iter := s.c.Scan(ctx, 0, "refresh:"+userID+":*", 100).Iterator()
	for iter.Next(ctx) {
		if err := s.c.Del(ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}

// WardStore tracks live-ward presence in a sorted set: member=userID, score=last-seen unix
// seconds. There is no avatar cache here — the roster reads avatars from the profile store
// at read time, for the ≤10 ids it actually shows, so what a stranger sees is always the
// authoritative face and a client cannot spoof its own.
type WardStore struct{ c *redis.Client }

func NewWardStore(c *redis.Client) *WardStore { return &WardStore{c: c} }

const wardKey = "ward:live"

// Touch marks userID present at `at` (the heartbeat, and the read on the home screen).
func (s *WardStore) Touch(ctx context.Context, userID string, at time.Time) error {
	return s.c.ZAdd(ctx, wardKey, redis.Z{Score: float64(at.Unix()), Member: userID}).Err()
}

// Leave removes userID immediately — the app was backgrounded or closed.
func (s *WardStore) Leave(ctx context.Context, userID string) error {
	return s.c.ZRem(ctx, wardKey, userID).Err()
}

// Recent evicts everyone last seen before `cutoff`, then returns up to `limit` user ids,
// most-recently-seen first. The eviction is what keeps the set from growing without bound
// when a client dies without a Leave.
func (s *WardStore) Recent(ctx context.Context, cutoff time.Time, limit int64) ([]string, error) {
	min := strconv.FormatInt(cutoff.Unix(), 10)
	if err := s.c.ZRemRangeByScore(ctx, wardKey, "-inf", "("+min).Err(); err != nil {
		return nil, err
	}
	return s.c.ZRevRangeByScore(ctx, wardKey, &redis.ZRangeBy{
		Min: min, Max: "+inf", Offset: 0, Count: limit,
	}).Result()
}

// ReferenceLimiter is the per-user DAILY cap on speech-reference generation
// (cross-review I4): one counter per user per UTC day, key
// speechref:gen:{userID}:{YYYYMMDD}, incremented on each real generation.
// limit <= 0 disables the cap.
type ReferenceLimiter struct {
	c     *redis.Client
	limit int
	now   func() time.Time
}

func NewReferenceLimiter(c *redis.Client, limit int) *ReferenceLimiter {
	return &ReferenceLimiter{c: c, limit: limit, now: time.Now}
}

func (l *ReferenceLimiter) key(userID string, at time.Time) string {
	return "speechref:gen:" + userID + ":" + at.UTC().Format("20060102")
}

// Allow counts one generation and reports whether it is within the limit.
// Refused attempts are counted too (the counter just keeps climbing), which is
// harmless: the key is per-day and expires. The TTL is set in the same
// transaction as the INCR so a crash can never leave an immortal counter; 48h
// covers the whole UTC day plus clock slack.
func (l *ReferenceLimiter) Allow(ctx context.Context, userID string) (bool, error) {
	if l.limit <= 0 {
		return true, nil
	}
	k := l.key(userID, l.now())
	var incr *redis.IntCmd
	_, err := l.c.TxPipelined(ctx, func(p redis.Pipeliner) error {
		incr = p.Incr(ctx, k)
		p.Expire(ctx, k, 48*time.Hour)
		return nil
	})
	if err != nil {
		return false, err
	}
	return incr.Val() <= int64(l.limit), nil
}
