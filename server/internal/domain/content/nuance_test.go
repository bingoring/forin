package content

import (
	"strings"
	"testing"
)

// ---- JoinChips (spec §11-2: fragments inside a word join, words join with one space) ----

func TestJoinChips(t *testing.T) {
	for _, c := range []struct {
		chips [][]string
		want  string
	}{
		{[][]string{{"hypo", "tens", "ive"}}, "hypotensive"},
		{[][]string{{"en"}, {"route"}}, "en route"},
		{[][]string{{"mech", "a", "nism"}, {"of"}, {"in", "ju", "ry"}}, "mechanism of injury"},
		{nil, ""},
	} {
		if got := JoinChips(c.chips); got != c.want {
			t.Errorf("JoinChips(%v) = %q, want %q", c.chips, got, c.want)
		}
	}
}

func v45Word() Word {
	return Word{
		ID: "w-hypotensive", En: "hypotensive", Ko: "저혈압의", IPA: "/x/", Icon: "monitor",
		Example: "Patient is hypotensive.", ExKo: "저혈압이에요.", Cue: "혈압이 낮은 상태", Tag: "바이탈",
		DistractorsEn: []string{"hypertensive", "hypoxic"}, DistractorsKo: []string{"고혈압의", "저산소의"},
		Chips: [][]string{{"hypo", "tens", "ive"}}, DecoyChips: []string{"hyper"},
	}
}

func hasErr(errs []error, sub string) bool {
	for _, e := range errs {
		if strings.Contains(e.Error(), sub) {
			return true
		}
	}
	return false
}

// ---- ValidateWordV45 (V12, V13) ----

func TestValidateWordV45_passesOnGoodWord(t *testing.T) {
	if errs := ValidateWordV45(v45Word()); len(errs) != 0 {
		t.Fatalf("unexpected: %v", errs)
	}
}

func TestValidateWordV45_rejects(t *testing.T) {
	for name, c := range map[string]struct {
		mut  func(*Word)
		want string
	}{
		"missing cue":            {func(w *Word) { w.Cue = "" }, "V12"},
		"missing exKo":           {func(w *Word) { w.ExKo = "" }, "V12"},
		"missing tag":            {func(w *Word) { w.Tag = "" }, "V12"},
		"one en distractor":      {func(w *Word) { w.DistractorsEn = []string{"x"} }, "V12"},
		"three ko distractors":   {func(w *Word) { w.DistractorsKo = []string{"a", "b", "c"} }, "V12"},
		"no decoy chips":         {func(w *Word) { w.DecoyChips = nil }, "V12"},
		"chips do not join":      {func(w *Word) { w.Chips = [][]string{{"hypo"}, {"tensive"}} }, "V12"},
		"en distractor = answer": {func(w *Word) { w.DistractorsEn = []string{"Hypotensive ", "hypoxic"} }, "V13"},
		"ko distractor = answer": {func(w *Word) { w.DistractorsKo = []string{"저혈압의", "저산소의"} }, "V13"},
		"duplicate distractors":  {func(w *Word) { w.DistractorsEn = []string{"hypoxic", "Hypoxic"} }, "V13"},
		"decoy is a real chip":   {func(w *Word) { w.DecoyChips = []string{"tens"} }, "V13"},
		"cue gives the answer":   {func(w *Word) { w.Cue = "Hypotensive — 혈압이 낮은" }, "V13"},
	} {
		w := v45Word()
		c.mut(&w)
		if errs := ValidateWordV45(w); !hasErr(errs, c.want) {
			t.Errorf("%s: want %s, got %v", name, c.want, errs)
		}
	}
}

func TestIsV45Word(t *testing.T) {
	if IsV45Word(Word{ID: "w", En: "x", Ko: "y"}) {
		t.Fatal("a v44 word is not v45")
	}
	if !IsV45Word(Word{ID: "w", Cue: "c"}) {
		t.Fatal("any v45 field makes it v45 — and then all are required")
	}
}

// ---- ValidateNuance (V14, V15) ----

func okNuance() []Nuance {
	yes, no := true, false
	zero := 0
	return []Nuance{
		{Kind: NuanceSlider, Words: []string{"w-pain"}, Cue: "c", Scale: []string{"discomfort", "pain", "agony"}, AnswerAt: &zero, Why: "w"},
		{Kind: NuancePair, Words: []string{"w-pain"}, Pairs: [][]string{{"a", "b"}, {"c", "d"}}, Decoys: []string{"e"}, Why: "w"},
		{Kind: NuanceReel, Words: []string{"w-pain"}, Word: "pain", Scenes: []NuanceScene{{Who: "a", En: "1"}, {Who: "b", En: "2"}, {Who: "c", En: "3"}, {Who: "d", En: "4"}}},
		{Kind: NuanceContext, Words: []string{"w-pain"}, Scenes: []NuanceScene{{Who: "a", En: "1", OK: &yes}, {Who: "b", En: "2", OK: &no, Fix: "f"}, {Who: "c", En: "3", OK: &yes}}, Why: "w"},
		{Kind: NuanceSwap, Words: []string{"w-pain"}, Before: []string{"a ", "died", " b"}, Options: []string{"x", "y", "z"}, Answer: "x",
			Notes: map[string]string{"x": "1", "y": "2", "z": "3"}, Why: "w"},
	}
}

var used = map[string]bool{"w-pain": true}

func TestValidateNuance_passes(t *testing.T) {
	if errs := ValidateNuance("s", used, okNuance(), true); len(errs) != 0 {
		t.Fatalf("unexpected: %v", errs)
	}
}

func TestValidateNuance_minimumsOnlyWhenRequired(t *testing.T) {
	// A v44 situation (bank without v45 fields) may have no nuance at all.
	if errs := ValidateNuance("s", used, nil, false); len(errs) != 0 {
		t.Fatalf("v44: %v", errs)
	}
	// A v45 one needs ≥1 STEP 1 item and ≥1 STEP 2 item.
	if errs := ValidateNuance("s", used, nil, true); !hasErr(errs, "V14") {
		t.Fatalf("v45 with none: %v", errs)
	}
	onlyStep1 := okNuance()[:2]
	if errs := ValidateNuance("s", used, onlyStep1, true); !hasErr(errs, "STEP 2") {
		t.Fatalf("no STEP 2 item: %v", errs)
	}
	onlyStep2 := okNuance()[3:]
	if errs := ValidateNuance("s", used, onlyStep2, true); !hasErr(errs, "STEP 1") {
		t.Fatalf("no STEP 1 item: %v", errs)
	}
}

func TestValidateNuance_shapes(t *testing.T) {
	yes := true
	one := 3
	for name, c := range map[string]struct {
		i   int
		mut func(*Nuance)
	}{
		"unknown kind":             {0, func(n *Nuance) { n.Kind = "quiz" }},
		"slider scale of 2":        {0, func(n *Nuance) { n.Scale = n.Scale[:2] }},
		"slider answer out":        {0, func(n *Nuance) { n.AnswerAt = &one }},
		"slider no answer":         {0, func(n *Nuance) { n.AnswerAt = nil }},
		"pair of one":              {1, func(n *Nuance) { n.Pairs = n.Pairs[:1] }},
		"pair no decoy":            {1, func(n *Nuance) { n.Decoys = nil }},
		"pair lopsided":            {1, func(n *Nuance) { n.Pairs[0] = []string{"a"} }},
		"reel of 3":                {2, func(n *Nuance) { n.Scenes = n.Scenes[:3] }},
		"context all ok":           {3, func(n *Nuance) { n.Scenes[1].OK = &yes }},
		"context wrong one no fix": {3, func(n *Nuance) { n.Scenes[1].Fix = "" }},
		"context of 2":             {3, func(n *Nuance) { n.Scenes = n.Scenes[:2] }},
		"swap answer not option":   {4, func(n *Nuance) { n.Answer = "q" }},
		"swap note missing":        {4, func(n *Nuance) { delete(n.Notes, "z") }},
		"swap before of 2":         {4, func(n *Nuance) { n.Before = n.Before[:2] }},
		"swap nothing to swap":     {4, func(n *Nuance) { n.Before[1] = " " }},
		"swap target is answer":    {4, func(n *Nuance) { n.Before[1] = "x" }},
		"pair decoy is an answer":  {1, func(n *Nuance) { n.Decoys = []string{"b"} }},
		"pair left twice":          {1, func(n *Nuance) { n.Pairs[1][0] = "a" }},
	} {
		items := okNuance()
		c.mut(&items[c.i])
		if errs := ValidateNuance("s", used, items, true); !hasErr(errs, "V14") {
			t.Errorf("%s: want V14, got %v", name, errs)
		}
	}
}

// The link is data (spec §11-3): an item points at words this situation's sentences use.
func TestValidateNuance_V15_wordsMustBeUsedBySentences(t *testing.T) {
	items := okNuance()
	items[0].Words = []string{"w-elsewhere"}
	if errs := ValidateNuance("s", used, items, true); !hasErr(errs, "V15") {
		t.Fatalf("unused word: %v", errs)
	}
	items = okNuance()
	items[1].Words = nil
	if errs := ValidateNuance("s", used, items, true); !hasErr(errs, "V15") {
		t.Fatalf("no words: %v", errs)
	}
}

// ---- bundle-level: a v45 bank requires v45 on every word and nuance on its situations ----

func TestValidateBundleLessons_v45(t *testing.T) {
	sent := Sentence{En: "a pain", Ko: "k", Chunks: []string{"a", "pain"}, Words: []string{"w-pain"}, Goal: 1}
	pain := v45Word()
	pain.ID, pain.En, pain.Chips, pain.DistractorsEn = "w-pain", "pain", [][]string{{"pa", "in"}}, []string{"ache", "hurt"}
	pain.Cue = "아픔"
	b := &Bundle{
		Lexicons:  []Lexicon{{Theme: "t", Words: []Word{pain}}},
		Scenarios: []Scenario{{ID: "S1", Theme: "t", Goals: []string{"g"}, Sentences: []Sentence{sent}, Nuance: okNuance()}},
	}
	if errs := ValidateBundleLessons(b); len(errs) != 0 {
		t.Fatalf("good v45 bundle: %v", errs)
	}

	// A bank that went half v45 is broken: once one word has the fields, all need them.
	half := *b
	half.Lexicons = []Lexicon{{Theme: "t", Words: []Word{pain, {ID: "w-other", En: "other", Ko: "o"}}}}
	if errs := ValidateBundleLessons(&half); !hasErr(errs, "V12") {
		t.Fatalf("half-v45 bank: %v", errs)
	}

	// A v45 bank's situation with no nuance fails V14.
	bare := *b
	bare.Scenarios = []Scenario{{ID: "S1", Theme: "t", Goals: []string{"g"}, Sentences: []Sentence{sent}}}
	if errs := ValidateBundleLessons(&bare); !hasErr(errs, "V14") {
		t.Fatalf("v45 situation without nuance: %v", errs)
	}

	// A v44 bank (no v45 fields) with no nuance is fine — ER·ICU·OR before the backfill.
	v44 := &Bundle{
		Lexicons:  []Lexicon{{Theme: "t", Words: []Word{{ID: "w-pain", En: "pain", Ko: "통증"}}}},
		Scenarios: []Scenario{{ID: "S1", Theme: "t", Goals: []string{"g"}, Sentences: []Sentence{sent}}},
	}
	if errs := ValidateBundleLessons(v44); len(errs) != 0 {
		t.Fatalf("v44 bundle: %v", errs)
	}
}

func TestValidateNuance_atMostOneReel(t *testing.T) {
	items := append(okNuance(), okNuance()[2])
	if errs := ValidateNuance("s", used, items, true); !hasErr(errs, "reels") {
		t.Fatalf("two reels: %v", errs)
	}
}
