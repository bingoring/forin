package config

import "testing"

func TestSplitList(t *testing.T) {
	cases := []struct {
		name string
		in   string
		want []string
	}{
		{"empty", "", nil},
		{"blank", "   ", nil},
		{"single", "abc.apps.googleusercontent.com", []string{"abc.apps.googleusercontent.com"}},
		{"multiple", "ios.id,android.id,web.id", []string{"ios.id", "android.id", "web.id"}},
		{"trims spaces", " ios.id , android.id ", []string{"ios.id", "android.id"}},
		{"drops empty entries", "ios.id,,android.id,", []string{"ios.id", "android.id"}},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := splitList(tc.in)
			if len(got) != len(tc.want) {
				t.Fatalf("splitList(%q) = %v, want %v", tc.in, got, tc.want)
			}
			for i := range got {
				if got[i] != tc.want[i] {
					t.Fatalf("splitList(%q) = %v, want %v", tc.in, got, tc.want)
				}
			}
		})
	}
}

func TestLoadReadsDevAuthSecret(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	t.Setenv("DEV_AUTH_SECRET", "staging-only")
	c, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if c.DevAuthSecret != "staging-only" {
		t.Fatalf("DevAuthSecret = %q, want %q", c.DevAuthSecret, "staging-only")
	}
}

// Production must not carry the bypass secret.
func TestLoadDevAuthSecretDefaultsEmpty(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	t.Setenv("DEV_AUTH_SECRET", "")
	c, err := Load()
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if c.DevAuthSecret != "" {
		t.Fatalf("DevAuthSecret = %q, want empty", c.DevAuthSecret)
	}
}

func TestSpeechReferenceDailyLimit(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	for _, tc := range []struct {
		env  string
		want int
	}{
		{"", 200}, {"50", 50}, {"0", 0}, {"-5", 200}, {"lots", 200},
	} {
		t.Setenv("SPEECH_REFERENCE_DAILY_LIMIT", tc.env)
		c, err := Load()
		if err != nil {
			t.Fatal(err)
		}
		if c.SpeechReferenceDailyLimit != tc.want {
			t.Errorf("env %q -> %d, want %d", tc.env, c.SpeechReferenceDailyLimit, tc.want)
		}
	}
}

// TRUSTED_PROXY_HOPS: how many proxies in front of the app append to X-Forwarded-For.
// Default depends on ENV — 1 behind Cloud Run's Google Front End, 0 locally (where the
// header is client-controlled and must not be believed).
func TestTrustedProxyHops(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://x/y")
	t.Setenv("REDIS_URL", "redis://localhost:6379/0")
	t.Setenv("JWT_SIGNING_KEY", "0123456789abcdef")
	for _, tc := range []struct {
		appEnv, hops string
		want         int
	}{
		{"dev", "", 0}, {"", "", 0}, {"staging", "", 1}, {"prod", "", 1},
		{"prod", "0", 0}, {"prod", "2", 2}, {"dev", "1", 1},
		{"prod", "-1", 1}, {"prod", "many", 1},
	} {
		t.Setenv("ENV", tc.appEnv)
		t.Setenv("TRUSTED_PROXY_HOPS", tc.hops)
		c, err := Load()
		if err != nil {
			t.Fatal(err)
		}
		if c.TrustedProxyHops != tc.want {
			t.Errorf("ENV=%q TRUSTED_PROXY_HOPS=%q -> %d, want %d", tc.appEnv, tc.hops, c.TrustedProxyHops, tc.want)
		}
	}
}
