package auth

import "testing"

// Google issues a distinct OAuth client ID per platform (iOS / Android / Web),
// and the id_token's `aud` is whichever client requested it. So the server has to
// accept a set of audiences, not a single one.
func TestAudienceAllowed(t *testing.T) {
	allowed := []string{"ios.id", "android.id", "web.id"}
	cases := []struct {
		name    string
		aud     []string
		allowed []string
		want    bool
	}{
		{"ios token", []string{"ios.id"}, allowed, true},
		{"android token", []string{"android.id"}, allowed, true},
		{"web token", []string{"web.id"}, allowed, true},
		{"foreign token rejected", []string{"someone.else.id"}, allowed, false},
		{"no audience rejected", nil, allowed, false},
		{"nothing configured rejects everything", []string{"ios.id"}, nil, false},
		{"multi-aud token matches on any entry", []string{"other.id", "web.id"}, allowed, true},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := audienceAllowed(tc.aud, tc.allowed); got != tc.want {
				t.Fatalf("audienceAllowed(%v, %v) = %v, want %v", tc.aud, tc.allowed, got, tc.want)
			}
		})
	}
}

func TestVerifierForRejectsUnconfiguredProvider(t *testing.T) {
	v := NewOIDCVerifier(nil)
	if _, err := v.Verify(t.Context(), "google", "any.token"); err == nil {
		t.Fatal("expected an error for an unconfigured provider, got nil")
	}
}
