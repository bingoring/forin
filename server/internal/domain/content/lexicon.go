package content

import "fmt"

// JoinChunks reproduces a Sentence's `En` from its ordered `Chunks` — the ONE
// spacing rule every producer and checker of chunks must agree on (build-spec-index
// §2-1, check A4). It is defined here, in code, rather than left as a convention,
// because "the generator's chunks happen to join right" is not a fact anyone can
// check if the rule lives only in someone's head. The Python content generator and
// verifier (server/content/tools/gen_sentences.py, verify_lesson_content.py) are
// told in their own comments to reproduce EXACTLY this rule, so a Go-loaded
// scenario and a Python-checked seed agree on what "joins correctly" means.
//
// Rule:
//  1. Fragments join with exactly one space between them, by default.
//  2. A fragment that STARTS with one of the four sentence-punctuation characters
//     `,` `.` `?` `!` attaches directly to the PRECEDING fragment with NO space —
//     English never puts a space before these.
//
// So `["Let me check your wristband", "?"]` joins to "Let me check your
// wristband?", and `["wristband", ", right", "?"]` joins to "wristband, right?".
// An empty or single-fragment list never gets a separator inserted.
func JoinChunks(chunks []string) string {
	joined := make([]byte, 0, 64)
	for i, c := range chunks {
		if i > 0 && !startsWithSentencePunct(c) {
			joined = append(joined, ' ')
		}
		joined = append(joined, c...)
	}
	return string(joined)
}

// startsWithSentencePunct reports whether s's first byte is one of the four
// characters JoinChunks never puts a space before.
func startsWithSentencePunct(s string) bool {
	if s == "" {
		return false
	}
	switch s[0] {
	case ',', '.', '?', '!':
		return true
	}
	return false
}

// FindLexiconTheme looks up one theme's word bank within a department's loaded
// lexicon file. The department partitions FILES (content/nurse/lexicon/<dept>.yaml,
// loaded by cmd/gencontent's loadLexicon); this partitions ENTRIES within one —
// together they are the "(dept, theme)" lookup build-spec-index.md §2-1 asks for.
func FindLexiconTheme(bank []Lexicon, theme string) (Lexicon, bool) {
	for _, l := range bank {
		if l.Theme == theme {
			return l, true
		}
	}
	return Lexicon{}, false
}

// ValidateLexicon checks A2: a theme's word bank has no duplicate ids. Uniqueness
// is scoped to the bank on purpose (see Word.ID) — this does not check across banks.
func ValidateLexicon(bank Lexicon) []error {
	var errs []error
	seen := map[string]bool{}
	for _, w := range bank.Words {
		switch {
		case w.ID == "":
			errs = append(errs, fmt.Errorf("lexicon %q: word has empty id", bank.Theme))
		case seen[w.ID]:
			errs = append(errs, fmt.Errorf("lexicon %q: duplicate word id %q", bank.Theme, w.ID))
		default:
			seen[w.ID] = true
		}
	}
	return errs
}

// ValidateSentences checks A1, A3, and A4 for one situation's authored sentences
// against its theme's word bank (`bank`, as found by FindLexiconTheme — pass a
// zero Lexicon{Theme: theme} when the theme has no bank at all, which then fails
// every word reference as A1 does for any other unknown id) and its own goal count
// (`goalCount`, the seed's own `len(Goals)`).
//
// An empty `sentences` always passes without looking at the bank — most seeds have
// none yet (this task ships the schema; content lands department by department
// later), and a seed with no sentences makes no claim about the bank at all.
func ValidateSentences(theme string, bank Lexicon, goalCount int, sentences []Sentence) []error {
	if len(sentences) == 0 {
		return nil
	}
	var errs []error
	bankIDs := map[string]bool{}
	for _, w := range bank.Words {
		bankIDs[w.ID] = true
	}
	for i, s := range sentences {
		for _, wid := range s.Words {
			if !bankIDs[wid] {
				errs = append(errs, fmt.Errorf("theme %q: sentence %d references unknown word id %q", theme, i, wid))
			}
		}
		if s.Goal < 1 || s.Goal > goalCount {
			errs = append(errs, fmt.Errorf("theme %q: sentence %d: goal %d out of range 1..%d", theme, i, s.Goal, goalCount))
		}
		if joined := JoinChunks(s.Chunks); joined != s.En {
			errs = append(errs, fmt.Errorf("theme %q: sentence %d: chunks join to %q, want %q", theme, i, joined, s.En))
		}
	}
	return errs
}
