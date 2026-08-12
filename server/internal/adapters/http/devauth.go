package http

import "crypto/subtle"

// devAccessAllowed decides whether the dev-login bypass may be used.
//
// Local development needs no ceremony. Anywhere else the caller must present a
// secret that was deliberately configured for that environment — production
// leaves DEV_AUTH_SECRET unset, so the route is never even registered and this
// function would refuse anyway. An empty secret matches nothing: otherwise a
// misconfigured staging would accept a missing header.
func devAccessAllowed(env, secret, header string) bool {
	if env == "dev" {
		return true
	}
	if secret == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(secret), []byte(header)) == 1
}
