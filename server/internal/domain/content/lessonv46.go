package content

import (
	"fmt"
	"strings"
	"unicode"
	"unicode/utf8"
)

// ---- v46 (lesson-fidelity-v46 §D): optional fields the handoff's STEP 2 screens draw ----
//
// The Python verifier (server/content/tools/verify_lesson_content.py, V18·V19 and the V14
// additions) applies the same rules. One asymmetry is unavoidable: these fields are
// `omitempty` strings, so Go cannot tell `why: ""` from no `why` at all and only catches
// whitespace-only values; Python sees the key and also rejects the empty string.

// MaxTagRunes bounds a sheet's header tag. The tag shares one no-wrap row with the prompt
// type label and "n / N"; the handoff's tags are 2–5 characters ("환자 안심", "대화 흐름").
const MaxTagRunes = 10

// OrderLines is how many lines an order card has — the handoff's 4-step flow.
const OrderLines = 4

// BlankOptions is the blank prompt's 2×2.
const BlankOptions = 4

func blank(s string) bool { return strings.TrimSpace(s) == "" }

func isWordRune(r rune) bool { return unicode.IsLetter(r) || unicode.IsDigit(r) || r == '\'' }

// CountWordOccurrences counts where `part` occurs in `text` with no word character
// (letter, digit, apostrophe) touching either end — "petit" is not in "repetitive", "it"
// is in "it feels it." twice. Case-sensitive; callers normalise when they want otherwise.
// Python's `count_word_occurrences` is the same rule.
func CountWordOccurrences(text, part string) int {
	if part == "" {
		return 0
	}
	n := 0
	for i := 0; i+len(part) <= len(text); {
		j := strings.Index(text[i:], part)
		if j < 0 {
			break
		}
		at := i + j
		end := at + len(part)
		before, _ := utf8.DecodeLastRuneInString(text[:at])
		after, _ := utf8.DecodeRuneInString(text[end:])
		if (at == 0 || !isWordRune(before)) && (end == len(text) || !isWordRune(after)) {
			n++
		}
		_, w := utf8.DecodeRuneInString(text[at:])
		i = at + w
	}
	return n
}

// ValidateSentenceV46 checks V18 on one sentence: each v46 field that is present has the
// shape its prompt needs. A sentence with none of them passes — the screen falls back.
func ValidateSentenceV46(i int, s Sentence) []error {
	var errs []error
	bad := func(format string, a ...any) {
		errs = append(errs, fmt.Errorf("sentence %d: V18 %s", i, fmt.Sprintf(format, a...)))
	}
	if s.Tag != "" {
		if blank(s.Tag) {
			bad("tag is blank")
		} else if n := utf8.RuneCountInString(strings.TrimSpace(s.Tag)); n > MaxTagRunes {
			bad("tag %q has %d characters, want ≤%d", s.Tag, n, MaxTagRunes)
		}
	}
	if s.Icon != "" && blank(s.Icon) {
		bad("icon is blank")
	}
	if s.Why != "" && blank(s.Why) {
		bad("why is blank")
	}
	if s.Decoy != "" {
		d := normText(s.Decoy)
		switch {
		case d == "":
			bad("decoy is blank")
		case CountWordOccurrences(normText(s.En), d) > 0:
			bad("decoy %q is part of the sentence — it would build a right answer", s.Decoy)
		default:
			for _, c := range s.Chunks {
				if normText(c) == d {
					bad("decoy %q is one of the sentence's own chunks", s.Decoy)
				}
			}
		}
	}
	if s.DistractorsKo != nil {
		if len(s.DistractorsKo) != 2 {
			bad("distractorsKo has %d, want 2", len(s.DistractorsKo))
		}
		seen := map[string]bool{normText(s.Ko): true}
		for _, o := range s.DistractorsKo {
			n := normText(o)
			switch {
			case n == "":
				bad("distractorsKo has a blank option")
			case n == normText(s.Ko):
				bad("distractorsKo option %q is the sentence's own ko", o)
			case seen[n]:
				bad("distractorsKo option %q repeats", o)
			}
			seen[n] = true
		}
	}
	if b := s.Blank; b != nil {
		switch c := CountWordOccurrences(s.En, b.Answer); {
		case blank(b.Answer):
			bad("blank answer is empty")
		case c == 0:
			bad("blank answer %q is not a whole word or phrase of en %q", b.Answer, s.En)
		case c > 1:
			bad("blank answer %q occurs %d times in en — the blank would be ambiguous", b.Answer, c)
		}
		if len(b.Options) != BlankOptions {
			bad("blank has %d options, want %d", len(b.Options), BlankOptions)
		}
		offered := false
		seen := map[string]bool{}
		for _, o := range b.Options {
			n := normText(o.En)
			if n == "" {
				bad("blank has an empty option")
				continue
			}
			if seen[n] {
				bad("blank option %q repeats", o.En)
			}
			seen[n] = true
			if o.En == b.Answer {
				offered = true
			}
			if blank(o.Icon) {
				bad("blank option %q has no icon", o.En)
			}
		}
		if !offered {
			bad("blank answer %q is not one of the options", b.Answer)
		}
	}
	return errs
}

// ValidateOrder checks V19 on a situation's order card. nil passes — the sheet skips it.
func ValidateOrder(scenario string, o *SentenceOrder) []error {
	if o == nil {
		return nil
	}
	var errs []error
	bad := func(format string, a ...any) {
		errs = append(errs, fmt.Errorf("scenario %s: order: V19 %s", scenario, fmt.Sprintf(format, a...)))
	}
	if blank(o.Ko) {
		bad("ko is empty — the card's header line")
	}
	if blank(o.Why) {
		bad("why is empty — the note after the answer")
	}
	if o.Tag != "" {
		if blank(o.Tag) {
			bad("tag is blank")
		} else if n := utf8.RuneCountInString(strings.TrimSpace(o.Tag)); n > MaxTagRunes {
			bad("tag %q has %d characters, want ≤%d", o.Tag, n, MaxTagRunes)
		}
	}
	if o.Icon != "" && blank(o.Icon) {
		bad("icon is blank")
	}
	if len(o.Lines) != OrderLines {
		bad("has %d lines, want %d", len(o.Lines), OrderLines)
	}
	seen := map[string]bool{}
	for i, l := range o.Lines {
		if blank(l.En) {
			bad("line %d has no en", i)
		} else if n := normText(l.En); seen[n] {
			bad("line %d %q repeats another line", i, l.En)
		} else {
			seen[n] = true
		}
		if blank(l.Icon) {
			bad("line %d has no icon", i)
		}
		if l.Ko != "" && blank(l.Ko) {
			bad("line %d ko is blank", i)
		}
		if l.Note != "" && blank(l.Note) {
			bad("line %d note is blank", i)
		}
	}
	return errs
}

// validateNuanceV46 is the V14 part for the v46 Ko field (and context's Word with it).
func validateNuanceV46(n Nuance) []string {
	var out []string
	switch n.Kind {
	case NuanceContext:
		hasWord, hasKo := !blank(n.Word), !blank(n.Ko)
		if n.Ko != "" && !hasKo {
			out = append(out, "context ko is blank")
		}
		if hasWord != hasKo {
			out = append(out, "context needs word and ko together — the C5 title draws the word, its memo the Korean")
		}
	case NuanceSwap:
		if n.Ko != "" && blank(n.Ko) {
			out = append(out, "swap ko is blank")
		}
	}
	return out
}
