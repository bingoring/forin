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
