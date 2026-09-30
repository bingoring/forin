package content

import (
	"fmt"
	"strings"
)

// ---- v45: recall material on words, nuance items on situations (build-spec §11) ----

// Nuance kinds. The allowed set lives here, in code — not as a DB CHECK.
const (
	NuanceSlider  = "slider"  // STEP 1: where a word sits on a weak → strong scale of synonyms
	NuancePair    = "pair"    // STEP 1: collocations — which word goes with which
	NuanceReel    = "reel"    // STEP 2 warm-up: one word across several scenes
	NuanceContext = "context" // STEP 2: same meaning, three scenes, one of them wrong
	NuanceSwap    = "swap"    // STEP 2: swap one word for the right temperature
)

// NuanceKinds is the allowed set, and NuanceStep says which step shows each kind.
var NuanceKinds = map[string]int{
	NuanceSlider: 1, NuancePair: 1,
	NuanceReel: 2, NuanceContext: 2, NuanceSwap: 2,
}

// Nuance is one nuance item. The kinds share one struct because they are authored
// side by side in the same YAML list; which fields apply is by Kind (ValidateNuance).
type Nuance struct {
	Kind string `yaml:"kind" json:"kind"`
	// Words are the bank word ids this item is about. They must be words this
	// situation's sentences use (V15) — the same "the link is data" rule as sentences,
	// and what lets a word missed in STEP 1 come back in STEP 2.
	Words []string `yaml:"words" json:"words"`
	Why   string   `yaml:"why,omitempty" json:"why,omitempty"` // the explanation (Korean)

	// slider
	Cue      string   `yaml:"cue,omitempty" json:"cue,omitempty"`
	Scale    []string `yaml:"scale,omitempty" json:"scale,omitempty"` // weak → strong, ≥3
	AnswerAt *int     `yaml:"answerAt,omitempty" json:"answerAt,omitempty"`
	Example  string   `yaml:"example,omitempty" json:"example,omitempty"`
	ExKo     string   `yaml:"exKo,omitempty" json:"exKo,omitempty"`

	// pair
	Pairs  [][]string `yaml:"pairs,omitempty" json:"pairs,omitempty"` // [left, right], ≥2
	Decoys []string   `yaml:"decoys,omitempty" json:"decoys,omitempty"`

	// reel · context
	Word   string        `yaml:"word,omitempty" json:"word,omitempty"`
	Scenes []NuanceScene `yaml:"scenes,omitempty" json:"scenes,omitempty"`

	// swap
	Who     string            `yaml:"who,omitempty" json:"who,omitempty"`
	Icon    string            `yaml:"icon,omitempty" json:"icon,omitempty"`
	Before  []string          `yaml:"before,omitempty" json:"before,omitempty"` // before · the word to swap · after
	Options []string          `yaml:"options,omitempty" json:"options,omitempty"`
	Answer  string            `yaml:"answer,omitempty" json:"answer,omitempty"`
	Notes   map[string]string `yaml:"notes,omitempty" json:"notes,omitempty"` // one per option
}

// NuanceScene is one scene of a reel or a context item.
type NuanceScene struct {
	Who  string `yaml:"who" json:"who"`
	Icon string `yaml:"icon,omitempty" json:"icon,omitempty"`
	En   string `yaml:"en" json:"en"`
	Ko   string `yaml:"ko,omitempty" json:"ko,omitempty"`
	Tone string `yaml:"tone,omitempty" json:"tone,omitempty"`
	Swap bool   `yaml:"swap,omitempty" json:"swap,omitempty"` // reel: the "say it this way instead" card
	OK   *bool  `yaml:"ok,omitempty" json:"ok,omitempty"`     // context: does it fit this scene
	Fix  string `yaml:"fix,omitempty" json:"fix,omitempty"`   // context: the rewrite, on the one that does not
}

// JoinChips reproduces a word's `En` from its chips (build-spec §11-2): fragments
// inside a word join with nothing between them, words join with one space. Not
// JoinChunks — that one spaces every fragment and would give "hypo tens ive".
func JoinChips(chips [][]string) string {
	words := make([]string, 0, len(chips))
	for _, frags := range chips {
		words = append(words, strings.Join(frags, ""))
	}
	return strings.Join(words, " ")
}

// IsV45Word reports whether a word carries any v45 field. A bank with one such word
// is a v45 bank, and then every word in it must carry all of them.
func IsV45Word(w Word) bool {
	return w.ExKo != "" || w.Cue != "" || w.Tag != "" || len(w.DistractorsEn) > 0 ||
		len(w.DistractorsKo) > 0 || len(w.Chips) > 0 || len(w.DecoyChips) > 0
}

// IsV45Bank reports whether any word in the bank carries v45 fields.
func IsV45Bank(bank Lexicon) bool {
	for _, w := range bank.Words {
		if IsV45Word(w) {
			return true
		}
	}
	return false
}

func normText(s string) string {
	return strings.Join(strings.Fields(strings.ToLower(s)), " ")
}

// ValidateWordV45 checks V12 (every v45 field present, chips join to `en`) and V13
// (no option equals the answer, options differ, decoys are not real fragments, the
// clue does not give the answer away).
func ValidateWordV45(w Word) []error {
	var errs []error
	bad := func(rule, format string, a ...any) {
		errs = append(errs, fmt.Errorf("word %q: %s %s", w.ID, rule, fmt.Sprintf(format, a...)))
	}
	if strings.TrimSpace(w.ExKo) == "" {
		bad("V12", "exKo is empty")
	}
	if strings.TrimSpace(w.Cue) == "" {
		bad("V12", "cue is empty")
	}
	if strings.TrimSpace(w.Tag) == "" {
		bad("V12", "tag is empty")
	}
	if len(w.DistractorsEn) != 2 {
		bad("V12", "distractorsEn has %d, want 2", len(w.DistractorsEn))
	}
	if len(w.DistractorsKo) != 2 {
		bad("V12", "distractorsKo has %d, want 2", len(w.DistractorsKo))
	}
	if len(w.DecoyChips) == 0 {
		bad("V12", "decoyChips is empty")
	}
	if joined := JoinChips(w.Chips); joined != w.En {
		bad("V12", "chips join to %q, want %q", joined, w.En)
	}

	distinct := func(field, answer string, opts []string) {
		seen := map[string]bool{normText(answer): true}
		for _, o := range opts {
			n := normText(o)
			switch {
			case n == normText(answer):
				bad("V13", "%s option %q is the answer", field, o)
			case seen[n]:
				bad("V13", "%s option %q repeats", field, o)
			}
			seen[n] = true
		}
	}
	distinct("distractorsEn", w.En, w.DistractorsEn)
	distinct("distractorsKo", w.Ko, w.DistractorsKo)
	real := map[string]bool{}
	for _, frags := range w.Chips {
		for _, f := range frags {
			real[normText(f)] = true
		}
	}
	for _, d := range w.DecoyChips {
		if real[normText(d)] {
			bad("V13", "decoy chip %q is one of the answer's own fragments", d)
		}
	}
	if w.En != "" && strings.Contains(strings.ToLower(w.Cue), strings.ToLower(w.En)) {
		bad("V13", "cue contains the answer %q", w.En)
	}
	return errs
}

// ValidateNuance checks V14 (allowed kind, the shape each kind needs, and — when
// `required` — the minimums: ≥1 STEP 1 item and ≥1 STEP 2 item) and V15 (every item
// names words, all of them used by this situation's sentences). `used` is the set of
// word ids the situation's sentences reference. `required` is true for a situation
// whose theme bank is v45; a v44 situation may carry no nuance at all.
func ValidateNuance(scenario string, used map[string]bool, items []Nuance, required bool) []error {
	var errs []error
	bad := func(i int, rule, format string, a ...any) {
		errs = append(errs, fmt.Errorf("scenario %s: nuance %d: %s %s", scenario, i, rule, fmt.Sprintf(format, a...)))
	}
	steps := map[int]int{}
	for i, n := range items {
		step, ok := NuanceKinds[n.Kind]
		if !ok {
			bad(i, "V14", "unknown kind %q", n.Kind)
			continue
		}
		steps[step]++
		if len(n.Words) == 0 {
			bad(i, "V15", "names no words")
		}
		for _, id := range n.Words {
			if !used[id] {
				bad(i, "V15", "word %q is not used by this situation's sentences", id)
			}
		}
		switch n.Kind {
		case NuanceSlider:
			if len(n.Scale) < 3 {
				bad(i, "V14", "slider scale has %d, want ≥3", len(n.Scale))
			}
			if n.AnswerAt == nil || *n.AnswerAt < 0 || *n.AnswerAt >= len(n.Scale) {
				bad(i, "V14", "slider answerAt out of range")
			}
		case NuancePair:
			if len(n.Pairs) < 2 {
				bad(i, "V14", "pair has %d pairs, want ≥2", len(n.Pairs))
			}
			for _, p := range n.Pairs {
				if len(p) != 2 {
					bad(i, "V14", "pair %v is not [left, right]", p)
				}
			}
			if len(n.Decoys) == 0 {
				bad(i, "V14", "pair has no decoys")
			}
			lefts, rights := map[string]bool{}, map[string]bool{}
			for _, p := range n.Pairs {
				if len(p) != 2 {
					continue
				}
				l, r := normText(p[0]), normText(p[1])
				if lefts[l] || rights[r] {
					bad(i, "V14", "pair: %q or %q appears twice on one side — the match must be unique", p[0], p[1])
				}
				lefts[l], rights[r] = true, true
			}
			for _, d := range n.Decoys {
				if rights[normText(d)] {
					bad(i, "V14", "pair decoy %q is also a right-hand answer", d)
				}
			}
		case NuanceReel:
			if len(n.Scenes) < 4 {
				bad(i, "V14", "reel has %d scenes, want ≥4", len(n.Scenes))
			}
		case NuanceContext:
			if len(n.Scenes) != 3 {
				bad(i, "V14", "context has %d scenes, want 3", len(n.Scenes))
			}
			wrong := 0
			for _, sc := range n.Scenes {
				if sc.OK != nil && !*sc.OK {
					wrong++
					if strings.TrimSpace(sc.Fix) == "" {
						bad(i, "V14", "context: the scene that does not fit has no fix")
					}
				}
			}
			if wrong != 1 {
				bad(i, "V14", "context has %d scenes that do not fit, want exactly 1", wrong)
			}
		case NuanceSwap:
			switch {
			case len(n.Before) != 3:
				bad(i, "V14", "swap before has %d parts, want 3", len(n.Before))
			case strings.TrimSpace(n.Before[1]) == "":
				bad(i, "V14", "swap: the word to swap (before[1]) is empty")
			case normText(n.Before[1]) == normText(n.Answer):
				bad(i, "V14", "swap: the word to swap is already the answer")
			}
			found := false
			for _, o := range n.Options {
				if o == n.Answer {
					found = true
				}
				if strings.TrimSpace(n.Notes[o]) == "" {
					bad(i, "V14", "swap option %q has no note", o)
				}
			}
			if !found {
				bad(i, "V14", "swap answer %q is not one of the options", n.Answer)
			}
		}
	}
	reels := 0
	for _, n := range items {
		if n.Kind == NuanceReel {
			reels++
		}
	}
	if reels > 1 {
		errs = append(errs, fmt.Errorf("scenario %s: V14 %d reels — a situation has at most one", scenario, reels))
	}
	if required {
		if steps[1] == 0 {
			errs = append(errs, fmt.Errorf("scenario %s: V14 no STEP 1 nuance (slider|pair)", scenario))
		}
		if steps[2] == 0 {
			errs = append(errs, fmt.Errorf("scenario %s: V14 no STEP 2 nuance (context|swap|reel)", scenario))
		}
	}
	return errs
}
