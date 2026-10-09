package http

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"golang.org/x/time/rate"
)

func reqFrom(remote string, xff ...string) *http.Request {
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	r.RemoteAddr = remote
	for _, v := range xff {
		r.Header.Add("X-Forwarded-For", v)
	}
	return r
}

func TestClientIP(t *testing.T) {
	cases := []struct {
		name string
		r    *http.Request
		hops int
		want string
	}{
		{"hops 0 ignores XFF entirely", reqFrom("10.0.0.1:5000", "6.6.6.6"), 0, "10.0.0.1"},
		{"hops 1 takes the rightmost (appended by the trusted proxy)", reqFrom("10.0.0.1:5000", "203.0.113.7"), 1, "203.0.113.7"},
		{"a client-forged leading entry is ignored", reqFrom("10.0.0.1:5000", "6.6.6.6, 203.0.113.7"), 1, "203.0.113.7"},
		{"hops 2 skips the load balancer's own entry", reqFrom("10.0.0.1:5000", "203.0.113.7, 34.1.2.3"), 2, "203.0.113.7"},
		{"split across several header lines", reqFrom("10.0.0.1:5000", "6.6.6.6", "203.0.113.7"), 1, "203.0.113.7"},
		{"no XFF falls back to RemoteAddr", reqFrom("10.0.0.1:5000"), 1, "10.0.0.1"},
		{"fewer entries than hops falls back to RemoteAddr", reqFrom("10.0.0.1:5000", "203.0.113.7"), 2, "10.0.0.1"},
		{"garbage entry falls back to RemoteAddr", reqFrom("10.0.0.1:5000", "not-an-ip"), 1, "10.0.0.1"},
		{"IPv6 is accepted", reqFrom("10.0.0.1:5000", "2001:db8::1"), 1, "2001:db8::1"},
		{"RemoteAddr without a port still works", reqFrom("10.0.0.1"), 0, "10.0.0.1"},
	}
	for _, c := range cases {
		if got := clientIP(c.r, c.hops); got != c.want {
			t.Errorf("%s: got %q, want %q", c.name, got, c.want)
		}
	}
}

// Behind a proxy every request shares RemoteAddr; keyed on it, one noisy client would
// exhaust everyone's budget. Keyed on the forwarded client, they are independent.
func TestRateLimitSeparatesClientsBehindAProxy(t *testing.T) {
	ok := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	h := rateLimitWith(rateLimitConfig{rps: rate.Limit(0.0001), burst: 2, trustedHops: 1})(ok)

	do := func(client string) int {
		w := httptest.NewRecorder()
		h.ServeHTTP(w, reqFrom("10.0.0.1:5000", client))
		return w.Code
	}
	for i := 0; i < 2; i++ {
		if c := do("203.0.113.7"); c != http.StatusOK {
			t.Fatalf("request %d within burst: %d", i, c)
		}
	}
	if c := do("203.0.113.7"); c != http.StatusTooManyRequests {
		t.Fatalf("third request from the same client should be limited, got %d", c)
	}
	if c := do("198.51.100.9"); c != http.StatusOK {
		t.Fatalf("a different client behind the same proxy must have its own bucket, got %d", c)
	}
}

// A forged X-Forwarded-For must not let a client mint fresh buckets when it is not the
// trusted (rightmost) entry.
func TestRateLimitIgnoresForgedLeadingEntries(t *testing.T) {
	ok := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) })
	h := rateLimitWith(rateLimitConfig{rps: rate.Limit(0.0001), burst: 1, trustedHops: 1})(ok)
	codes := []int{}
	for _, forged := range []string{"1.1.1.1", "2.2.2.2", "3.3.3.3"} {
		w := httptest.NewRecorder()
		h.ServeHTTP(w, reqFrom("10.0.0.1:5000", forged+", 203.0.113.7"))
		codes = append(codes, w.Code)
	}
	if codes[0] != http.StatusOK || codes[1] != http.StatusTooManyRequests || codes[2] != http.StatusTooManyRequests {
		t.Fatalf("forged leading entries must not evade the limit: %v", codes)
	}
}

// The per-IP map must not grow without bound: idle entries are swept.
func TestIPLimitersSweepIdleEntries(t *testing.T) {
	now := time.Unix(1_000_000, 0)
	s := newIPLimiters(rateLimitConfig{rps: 10, burst: 10, idleTTL: 10 * time.Minute, sweepEvery: time.Minute, now: func() time.Time { return now }})

	for _, ip := range []string{"1.1.1.1", "2.2.2.2", "3.3.3.3"} {
		s.allow(ip)
	}
	if s.size() != 3 {
		t.Fatalf("size = %d, want 3", s.size())
	}

	// 5 minutes later one client is still active; the others are not yet idle long enough.
	now = now.Add(5 * time.Minute)
	s.allow("1.1.1.1")
	if s.size() != 3 {
		t.Fatalf("size after 5min = %d, want 3 (nobody idle past the TTL yet)", s.size())
	}

	// 11 minutes after the first burst: 2.2.2.2 and 3.3.3.3 are idle past the TTL, 1.1.1.1 is not.
	now = now.Add(6 * time.Minute)
	s.allow("1.1.1.1")
	if s.size() != 1 {
		t.Fatalf("size after sweep = %d, want 1 (only the active client)", s.size())
	}
}

// Evicting an idle entry loses nothing: its bucket would have refilled anyway.
func TestIPLimitersEvictedClientStartsFresh(t *testing.T) {
	now := time.Unix(1_000_000, 0)
	s := newIPLimiters(rateLimitConfig{rps: rate.Limit(0.0001), burst: 1, idleTTL: time.Minute, sweepEvery: time.Second, now: func() time.Time { return now }})
	if !s.allow("1.1.1.1") || s.allow("1.1.1.1") {
		t.Fatal("burst of 1 should allow exactly one request")
	}
	now = now.Add(2 * time.Minute)
	s.allow("9.9.9.9") // triggers the sweep
	if s.size() != 1 {
		t.Fatalf("size = %d, want 1", s.size())
	}
}
