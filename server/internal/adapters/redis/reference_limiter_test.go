package redis

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	goredis "github.com/redis/go-redis/v9"
)

// testClient connects to the dev Redis (REDIS_URL, default localhost) and
// skips when none is reachable — same stance as the DB tests' TEST_DATABASE_URL.
func testClient(t *testing.T) *goredis.Client {
	t.Helper()
	url := os.Getenv("REDIS_URL")
	if url == "" {
		url = "redis://localhost:6379/0"
	}
	c, err := New(context.Background(), url)
	if err != nil {
		t.Skipf("redis unavailable: %v", err)
	}
	t.Cleanup(func() { _ = c.Close() })
	return c
}

func uniqueUser(t *testing.T) string {
	return fmt.Sprintf("test-%s-%d", t.Name(), time.Now().UnixNano())
}

func TestReferenceLimiterAllowsUpToTheLimitThenRefuses(t *testing.T) {
	c := testClient(t)
	l := NewReferenceLimiter(c, 3)
	u := uniqueUser(t)
	ctx := context.Background()
	for i := 1; i <= 3; i++ {
		ok, err := l.Allow(ctx, u)
		if err != nil || !ok {
			t.Fatalf("call %d: ok=%v err=%v, want allowed", i, ok, err)
		}
	}
	if ok, err := l.Allow(ctx, u); err != nil || ok {
		t.Fatalf("4th call: ok=%v err=%v, want refused", ok, err)
	}
	// Another user has their own budget.
	if ok, _ := l.Allow(ctx, uniqueUser(t)+"-other"); !ok {
		t.Fatal("a different user was refused")
	}
}

// The budget is per UTC day and the key expires on its own.
func TestReferenceLimiterResetsNextDayAndKeysExpire(t *testing.T) {
	c := testClient(t)
	l := NewReferenceLimiter(c, 1)
	now := time.Date(2026, 3, 1, 23, 59, 0, 0, time.UTC)
	l.now = func() time.Time { return now }
	u := uniqueUser(t)
	ctx := context.Background()

	if ok, _ := l.Allow(ctx, u); !ok {
		t.Fatal("first call refused")
	}
	if ok, _ := l.Allow(ctx, u); ok {
		t.Fatal("second call same day allowed")
	}
	now = now.Add(2 * time.Minute) // 00:01 next UTC day
	if ok, _ := l.Allow(ctx, u); !ok {
		t.Fatal("budget did not reset on the next day")
	}
	ttl, err := c.TTL(ctx, l.key(u, now)).Result()
	if err != nil || ttl <= 0 {
		t.Fatalf("counter key has no expiry (ttl=%v err=%v) — it would leak forever", ttl, err)
	}
	_ = c.Del(ctx, l.key(u, now), l.key(u, now.Add(-2*time.Minute)))
}

// A limit of 0 disables the cap (and never touches Redis).
func TestReferenceLimiterZeroMeansUnlimited(t *testing.T) {
	l := NewReferenceLimiter(nil, 0)
	for i := 0; i < 5; i++ {
		if ok, err := l.Allow(context.Background(), "u"); !ok || err != nil {
			t.Fatalf("ok=%v err=%v", ok, err)
		}
	}
}

// Redis failing is reported as an error (the caller fails open).
func TestReferenceLimiterReportsRedisErrors(t *testing.T) {
	c := goredis.NewClient(&goredis.Options{Addr: "127.0.0.1:1", DialTimeout: 200 * time.Millisecond, MaxRetries: -1})
	defer c.Close()
	if _, err := NewReferenceLimiter(c, 5).Allow(context.Background(), "u"); err == nil {
		t.Fatal("want an error from an unreachable redis")
	}
}
