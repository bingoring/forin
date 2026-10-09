package http

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"

	"github.com/bingoring/forin/server/internal/platform/httpx"
)

// rateLimit applies a per-client-IP token bucket (foundation-grade).
//
// trustedProxyHops is how many proxies in front of this process append to
// X-Forwarded-For (config.TrustedProxyHops). 0 keys on RemoteAddr.
func rateLimit(rps rate.Limit, burst, trustedProxyHops int) middleware {
	return rateLimitWith(rateLimitConfig{rps: rps, burst: burst, trustedHops: trustedProxyHops})
}

type rateLimitConfig struct {
	rps         rate.Limit
	burst       int
	trustedHops int
	// idleTTL: an entry unseen this long is dropped. Dropping loses nothing — a bucket
	// refills in burst/rps (about 2s at the production 40/20) — so any TTL above that is
	// equivalent to keeping the entry; 10 minutes just keeps the sweep cheap.
	idleTTL time.Duration
	// sweepEvery: at most one O(n) sweep per interval, run lazily inside a request (no
	// background goroutine to leak or to stop in tests).
	sweepEvery time.Duration
	now        func() time.Time // injectable for tests
}

func (c rateLimitConfig) withDefaults() rateLimitConfig {
	if c.idleTTL <= 0 {
		c.idleTTL = 10 * time.Minute
	}
	if c.sweepEvery <= 0 {
		c.sweepEvery = time.Minute
	}
	if c.now == nil {
		c.now = time.Now
	}
	return c
}

func rateLimitWith(cfg rateLimitConfig) middleware {
	cfg = cfg.withDefaults()
	limiters := newIPLimiters(cfg)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !limiters.allow(clientIP(r, cfg.trustedHops)) {
				httpx.Error(w, http.StatusTooManyRequests, "rate limit exceeded")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

type ipEntry struct {
	lim      *rate.Limiter
	lastSeen time.Time
}

// ipLimiters is the per-IP bucket map. Entries are swept when idle so a stream of
// distinct addresses (scanners, IPv6 rotation) cannot grow it forever.
type ipLimiters struct {
	cfg       rateLimitConfig
	mu        sync.Mutex
	m         map[string]*ipEntry
	lastSweep time.Time
}

func newIPLimiters(cfg rateLimitConfig) *ipLimiters {
	cfg = cfg.withDefaults()
	return &ipLimiters{cfg: cfg, m: map[string]*ipEntry{}, lastSweep: cfg.now()}
}

func (s *ipLimiters) allow(ip string) bool {
	now := s.cfg.now()
	s.mu.Lock()
	if now.Sub(s.lastSweep) >= s.cfg.sweepEvery {
		for k, e := range s.m {
			if now.Sub(e.lastSeen) > s.cfg.idleTTL {
				delete(s.m, k)
			}
		}
		s.lastSweep = now
	}
	e, ok := s.m[ip]
	if !ok {
		e = &ipEntry{lim: rate.NewLimiter(s.cfg.rps, s.cfg.burst)}
		s.m[ip] = e
	}
	e.lastSeen = now
	lim := e.lim
	s.mu.Unlock()
	return lim.Allow()
}

func (s *ipLimiters) size() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.m)
}

// clientIP is the address a request is rate-limited as.
//
// Behind Cloud Run the TCP peer (RemoteAddr) is Google's front end, not the caller, so
// keying on it puts every user in one bucket. The Google Front End APPENDS the
// connecting client's address to X-Forwarded-For; whatever the client itself sent is
// to the left of it and is forgeable. So the trustworthy entry is counted from the
// RIGHT: hops=1 is the entry the GFE added (direct *.run.app), hops=2 skips one more
// proxy (a Google Cloud load balancer in front, which adds its own entry after the
// client's). Reading the leftmost entry would let any caller pick their own bucket.
//
// hops=0, a missing/short header, or an entry that is not an IP all fall back to
// RemoteAddr — i.e. when the expected proxy chain is absent, X-Forwarded-For is not believed.
func clientIP(r *http.Request, hops int) string {
	if hops > 0 {
		var parts []string
		for _, v := range r.Header.Values("X-Forwarded-For") {
			for _, p := range strings.Split(v, ",") {
				if p = strings.TrimSpace(p); p != "" {
					parts = append(parts, p)
				}
			}
		}
		if len(parts) >= hops {
			cand := parts[len(parts)-hops]
			if ip := net.ParseIP(cand); ip != nil {
				return ip.String()
			}
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
