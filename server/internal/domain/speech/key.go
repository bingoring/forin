// Package speech records spoken attempts and the history they accumulate.
// Scoring itself stays in domain/pronunciation; this package owns persistence.
package speech

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

// SentenceKey identifies "the same sentence" across attempts without a sentence
// table, so utterances that have no review card (drills, minimal pairs) still
// group. Normalizing case and whitespace keeps one sentence from splitting into
// several histories over a stray capital (business-rules R8).
func SentenceKey(text, locale string) string {
	n := strings.ToLower(strings.Join(strings.Fields(text), " "))
	sum := sha256.Sum256([]byte(n + "|" + locale))
	return hex.EncodeToString(sum[:])[:32]
}
