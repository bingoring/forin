package http

import "crypto/subtle"

// devAccessAllowed decides whether the dev-login bypass may be used.
//
// Local development needs no ceremony. Anywhere else the caller must present a
// secret that was deliberately configured for that environment. Production is
// refused unconditionally below — the route is also never registered there
// (router.go), but that is deployment discipline, not a security control, so
// this function does not rely on it. An empty secret matches nothing:
// otherwise a misconfigured staging would accept a missing header.
func devAccessAllowed(env, secret, header string) bool {
	// Production never allows the bypass, no matter what leaks into the
	// environment. Encoding it here means a stray DEV_AUTH_SECRET in a prod
	// env block cannot open the route — configuration discipline is not a
	// security control.
	if env == "prod" {
		return false
	}
	if env == "dev" {
		return true
	}
	if secret == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(secret), []byte(header)) == 1
}
