package http

import "testing"

func TestDevAccessAllowed(t *testing.T) {
	cases := []struct {
		name   string
		env    string
		secret string
		header string
		want   bool
	}{
		{"local dev needs nothing", "dev", "", "", true},
		{"prod without a secret is closed", "prod", "", "", false},
		{"prod ignores a guessed header when no secret is set", "prod", "", "anything", false},
		{"staging with the right secret", "staging", "s3cret", "s3cret", true},
		{"staging with the wrong secret", "staging", "s3cret", "nope", false},
		{"staging with no header", "staging", "s3cret", "", false},
		{"an empty secret never matches an empty header", "staging", "", "", false},
	}
	for _, c := range cases {
		if got := devAccessAllowed(c.env, c.secret, c.header); got != c.want {
			t.Errorf("%s: devAccessAllowed(%q,%q,%q) = %v, want %v", c.name, c.env, c.secret, c.header, got, c.want)
		}
	}
}
