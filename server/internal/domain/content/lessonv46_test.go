package content

import "testing"

// v46 (lesson-fidelity-v46 §D): optional sentence fields, the per-situation order set,
// and the Korean line on context/swap nuance. Every field is optional — content without
// them must keep passing — but a field that IS there must have the shape the screen needs.

// The handoff's own data (forin-notebook-lesson-sent-live.jsx SENTS), in our chunk style.
func v46Sentence() Sentence {
	return Sentence{
		En: "I know it feels repetitive.", Ko: "반복처럼 느껴지시는 거 알아요",
		Chunks: []string{"I know", "it feels", "repetitive", "."}, Words: []string{"w-pain"}, Goal: 1,
		Tag: "공감", Icon: "faceAngry", Why: `"I know…"로 시작하면 지시가 아니라 공감으로 들려요.`,
		Decoy: "for the doctor", DistractorsKo: []string{"지금 약을 드릴게요", "차트에 기록했어요"},
		Blank: &SentenceBlank{Answer: "repetitive", Options: []BlankOption{
			{En: "repetitive", Icon: "compass"}, {En: "important", Icon: "star"},
			{En: "annoying", Icon: "faceAngry"}, {En: "quick", Icon: "chartup"},
		}},
	}
}

func v46Order() *SentenceOrder {
	return &SentenceOrder{
		Tag: "대화 흐름", Icon: "compass", Ko: "불만 환자 응대 4문장 순서",
		Why: "공감이 먼저. 이유를 설명한 뒤 확인을 요청하고, 마지막에 이름을 불러 감사하면 관계가 닫혀요.",
		Lines: []OrderLine{
			{En: "I know it feels repetitive.", Icon: "faceAngry", Ko: "반복처럼 느껴지시는 거 알아요", Note: "공감"},
			{En: "It's for your safety.", Icon: "shield", Ko: "안전을 위한 거예요", Note: "이유"},
			{En: "Can you tell me your name and date of birth?", Icon: "board", Ko: "성함과 생년월일을 말씀해 주시겠어요?", Note: "확인"},
			{En: "Thank you, Mr. Alvarez.", Icon: "star", Ko: "감사해요, 알바레즈 씨", Note: "감사"},
		},
	}
}

func TestValidateSentenceV46_passes(t *testing.T) {
	if errs := ValidateSentenceV46(0, v46Sentence()); len(errs) != 0 {
		t.Fatalf("handoff sentence: %v", errs)
	}
	// v44/v45 content carries none of these — it must pass untouched.
	bare := Sentence{En: "a pain", Ko: "k", Chunks: []string{"a", "pain"}, Words: []string{"w-pain"}, Goal: 1}
	if errs := ValidateSentenceV46(0, bare); len(errs) != 0 {
		t.Fatalf("sentence without v46 fields: %v", errs)
	}
}

func TestValidateSentenceV46_rejects(t *testing.T) {
	for name, mut := range map[string]func(*Sentence){
		"blank tag":               func(s *Sentence) { s.Tag = "  " },
		"long tag":                func(s *Sentence) { s.Tag = "환자에게 반복 신원확인 이유를 설명" },
		"blank icon":              func(s *Sentence) { s.Icon = " " },
		"blank why":               func(s *Sentence) { s.Why = "\t" },
		"blank decoy":             func(s *Sentence) { s.Decoy = " " },
		"decoy is a chunk":        func(s *Sentence) { s.Decoy = "It Feels" },
		"decoy is inside the en":  func(s *Sentence) { s.Decoy = "know it" },
		"one ko distractor":       func(s *Sentence) { s.DistractorsKo = s.DistractorsKo[:1] },
		"ko distractor is the ko": func(s *Sentence) { s.DistractorsKo[0] = s.Ko },
		"ko distractors repeat":   func(s *Sentence) { s.DistractorsKo[1] = s.DistractorsKo[0] },
		"ko distractor blank":     func(s *Sentence) { s.DistractorsKo[1] = " " },
		"blank answer empty":      func(s *Sentence) { s.Blank.Answer = "" },
		"blank answer not in en":  func(s *Sentence) { s.Blank.Answer = "boring"; s.Blank.Options[0].En = "boring" },
		"blank answer mid-word":   func(s *Sentence) { s.Blank.Answer = "petit"; s.Blank.Options[0].En = "petit" },
		"blank answer twice in en": func(s *Sentence) {
			s.En, s.Chunks = "it feels it.", []string{"it feels", "it", "."}
			s.Blank.Answer = "it"
			s.Blank.Options[0].En = "it"
		},
		"blank three options":      func(s *Sentence) { s.Blank.Options = s.Blank.Options[:3] },
		"blank answer not offered": func(s *Sentence) { s.Blank.Options[0].En = "boring" },
		"blank options repeat":     func(s *Sentence) { s.Blank.Options[2].En = "Important" },
		"blank option empty":       func(s *Sentence) { s.Blank.Options[3].En = " " },
	} {
		s := v46Sentence()
		s.DistractorsKo = append([]string(nil), s.DistractorsKo...)
		b := *s.Blank
		b.Options = append([]BlankOption(nil), b.Options...)
		s.Blank = &b
		mut(&s)
		if errs := ValidateSentenceV46(0, s); !hasErr(errs, "V18") {
			t.Errorf("%s: want V18, got %v", name, errs)
		}
	}
}

func TestValidateOrder_passes(t *testing.T) {
	if errs := ValidateOrder("s", v46Order()); len(errs) != 0 {
		t.Fatalf("handoff order: %v", errs)
	}
	if errs := ValidateOrder("s", nil); len(errs) != 0 {
		t.Fatalf("no order is fine (R3 skips the card): %v", errs)
	}
	// tag, icon, and a line's ko/note are optional — the reference draws a line as en+icon.
	o := v46Order()
	o.Tag, o.Icon = "", ""
	for i := range o.Lines {
		o.Lines[i].Ko, o.Lines[i].Note = "", ""
	}
	if errs := ValidateOrder("s", o); len(errs) != 0 {
		t.Fatalf("order without the optional fields: %v", errs)
	}
}

func TestValidateOrder_rejects(t *testing.T) {
	for name, mut := range map[string]func(*SentenceOrder){
		"three lines":       func(o *SentenceOrder) { o.Lines = o.Lines[:3] },
		"five lines":        func(o *SentenceOrder) { o.Lines = append(o.Lines, o.Lines[0]) },
		"no ko":             func(o *SentenceOrder) { o.Ko = " " },
		"no why":            func(o *SentenceOrder) { o.Why = "" },
		"blank tag":         func(o *SentenceOrder) { o.Tag = " " },
		"long tag":          func(o *SentenceOrder) { o.Tag = "불만 환자 응대의 대화 흐름 순서" },
		"blank icon":        func(o *SentenceOrder) { o.Icon = " " },
		"line without en":   func(o *SentenceOrder) { o.Lines[2].En = " " },
		"line without icon": func(o *SentenceOrder) { o.Lines[1].Icon = "" },
		"line blank ko":     func(o *SentenceOrder) { o.Lines[1].Ko = " " },
		"line blank note":   func(o *SentenceOrder) { o.Lines[1].Note = " " },
		"lines repeat":      func(o *SentenceOrder) { o.Lines[3].En = "it's for your  safety." },
	} {
		o := v46Order()
		mut(o)
		if errs := ValidateOrder("s", o); !hasErr(errs, "V19") {
			t.Errorf("%s: want V19, got %v", name, errs)
		}
	}
}

// context's head (C5 "deteriorate가 어색한 장면은?" + memo “악화되다”) needs the word and
// its Korean together; swap's Korean line is optional but never blank.
func TestValidateNuance_v46Fields(t *testing.T) {
	ok := okNuance()
	ok[3].Word, ok[3].Ko = "deteriorate", "악화되다"
	ok[4].Ko = "어젯밤 어머니가 돌아가셨어요"
	if errs := ValidateNuance("s", used, ok, true); len(errs) != 0 {
		t.Fatalf("v46 nuance: %v", errs)
	}
	for name, c := range map[string]struct {
		i   int
		mut func(*Nuance)
	}{
		"context ko without word": {3, func(n *Nuance) { n.Word = "" }},
		"context word without ko": {3, func(n *Nuance) { n.Ko = "" }},
		"context blank ko":        {3, func(n *Nuance) { n.Ko = " " }},
		"swap blank ko":           {4, func(n *Nuance) { n.Ko = " " }},
	} {
		items := okNuance()
		items[3].Word, items[3].Ko = "deteriorate", "악화되다"
		items[4].Ko = "어젯밤 어머니가 돌아가셨어요"
		c.mut(&items[c.i])
		if errs := ValidateNuance("s", used, items, true); !hasErr(errs, "V14") {
			t.Errorf("%s: want V14, got %v", name, errs)
		}
	}
}

func TestValidateBundleLessons_v46(t *testing.T) {
	sent := v46Sentence()
	b := &Bundle{
		Lexicons:  []Lexicon{{Theme: "t", Words: []Word{{ID: "w-pain", En: "pain", Ko: "통증"}}}},
		Scenarios: []Scenario{{ID: "S1", Theme: "t", Goals: []string{"g"}, Sentences: []Sentence{sent}, Order: v46Order()}},
	}
	if errs := ValidateBundleLessons(b); len(errs) != 0 {
		t.Fatalf("good v46 bundle: %v", errs)
	}
	bad := *b
	o := v46Order()
	o.Lines = o.Lines[:2]
	sent.Decoy = "repetitive"
	bad.Scenarios = []Scenario{{ID: "S1", Theme: "t", Goals: []string{"g"}, Sentences: []Sentence{sent}, Order: o}}
	errs := ValidateBundleLessons(&bad)
	if !hasErr(errs, "V18") || !hasErr(errs, "V19") {
		t.Fatalf("bundle must run V18 and V19: %v", errs)
	}
	// An order set with no sentences has no STEP 2 to sit in.
	orphan := &Bundle{Scenarios: []Scenario{{ID: "S1", Theme: "t", Order: v46Order()}}}
	if errs := ValidateBundleLessons(orphan); !hasErr(errs, "V19") {
		t.Fatalf("order without sentences: %v", errs)
	}
}

// T8 user decision: blank options carry no icon — the sheet draws them as pick rows.
func TestBlankOptionsNeedNoIcon(t *testing.T) {
	s := v46Sentence()
	b := *s.Blank
	b.Options = append([]BlankOption(nil), b.Options...)
	for i := range b.Options {
		b.Options[i].Icon = ""
	}
	s.Blank = &b
	if errs := ValidateSentenceV46(0, s); len(errs) != 0 {
		t.Fatalf("icon-less options rejected: %v", errs)
	}
}
