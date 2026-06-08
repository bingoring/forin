// Command devtoken mints a short-lived access JWT for a user id — DEV ONLY,
// for exercising authenticated endpoints locally. Uses the same signing key as the API.
//
//	JWT_SIGNING_KEY=... go run ./cmd/devtoken <userID>
package main

import (
	"fmt"
	"os"
	"time"

	"github.com/bingoring/forin/server/internal/domain/auth"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: devtoken <userID>")
		os.Exit(1)
	}
	key := os.Getenv("JWT_SIGNING_KEY")
	if len(key) < 16 {
		fmt.Fprintln(os.Stderr, "JWT_SIGNING_KEY (>=16 bytes) required")
		os.Exit(1)
	}
	issuer := os.Getenv("JWT_ISSUER")
	if issuer == "" {
		issuer = "forin"
	}
	tok, _, err := auth.NewTokenService([]byte(key), issuer, 15*time.Minute).IssueAccess(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println(tok)
}
