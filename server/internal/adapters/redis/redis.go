// Package redis implements the RefreshStore (and provides the shared client).
package redis

import (
	"context"
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
