package conversation

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// The intent language FOLLOWS the profile, both axes, and is hardcoded to neither Korean
// nor English — the app is multilingual and both can be changed in settings. A Japanese
// learner of German must get Japanese intents and a German model line.
func TestChoicesPromptFollowsBothLanguageAxes(t *testing.T) {
	sc := &content.Scenario{ID: "SCN-ER-00002", Title: "T", Tagline: "t"}
	lc := langContext{Native: "Japanese", Target: "German", Job: "nurse", Level: "B1"}
	p := buildChoicesPrompt(sc, lc)

	// The intent is asked for in the NATIVE language, the model line in the TARGET.
	if !strings.Contains(p, "written in Japanese in the FIRST PERSON") {
		t.Errorf("intent is not requested as a first-person native-language (Japanese) line:\n%s", p)
	}
	if !strings.Contains(p, "`text`   — in German") {
		t.Errorf("the model line is not requested in the target language (German):\n%s", p)
	}
	// And nothing hardcodes Korean or English into the guided prompt.
	if strings.Contains(p, "Korean") || strings.Contains(p, "English") {
		t.Errorf("the prompt hardcodes a language instead of following the profile:\n%s", p)
	}
}

// The learner's own name reaches BOTH prompts: the choices prompt so a self-introduction
// carries it, and the character prompt so the NPC can address them by it.
func TestTheLearnersNameReachesThePrompts(t *testing.T) {
	sc := levelScenario()
	named := langContext{Native: "Korean", Target: "English", Job: "nurse", Level: "B1", Name: "뚜공"}
	if !strings.Contains(buildChoicesPrompt(sc, named), "뚜공") {
		t.Error("the learner's name is missing from the choices prompt — self-introductions lose it")
	}
	if !strings.Contains(buildSystemPrompt(sc, named, ""), "뚜공") {
		t.Error("the character is never told the learner's name, so it cannot address them")
	}
	// An unnamed learner adds no name line — never an id standing in for a name.
	unnamed := named
	unnamed.Name = ""
	if strings.Contains(buildChoicesPrompt(sc, unnamed), "learner's name is") {
		t.Error("an unnamed learner still got a name line in the choices prompt")
	}
	if strings.Contains(buildSystemPrompt(sc, unnamed, ""), "name is 뚜공") {
		t.Error("an unnamed learner still got a name line in the character prompt")
	}
}

// The bug: a learner who keeps picking the same intent (e.g. re-introducing themselves)
// eventually gets offered THREE self-introduction variants and no way to progress the
// scenario's other goals — the mission that needed a different line becomes
// unclearable. The prompt cannot know mission state (it isn't persisted anywhere), so
// the fix is to hand the model the numbered goal list and make it respect the history
// it is given: NUMBER the goals, and require at least one choice to chase whichever one
// is still unaddressed, and forbid three choices that are just the same action restated.
func TestChoicesPromptNumbersGoalsAndRequiresProgressOnAnUnaddressedOne(t *testing.T) {
	sc := &content.Scenario{
		ID: "SCN-ER-00002", Title: "T", Tagline: "t",
		Goals: []string{"Confirm the patient's identity", "Explain the procedure"},
	}
	lc := langContext{Native: "Korean", Target: "English", Job: "nurse", Level: "B1"}
	p := buildChoicesPrompt(sc, lc)

	// The goals are numbered, the way missionInstruction numbers them for the dialogue
	// prompt — a list the model can index into rather than a loose sentence.
	if !strings.Contains(p, "1. Confirm the patient's identity") {
		t.Errorf("goal 1 is not numbered in the prompt:\n%s", p)
	}
	if !strings.Contains(p, "2. Explain the procedure") {
		t.Errorf("goal 2 is not numbered in the prompt:\n%s", p)
	}
	// The model is told to read the history itself and find what is still unaddressed —
	// this is the mitigation, since the server has no stored mission state to hand it.
	if !strings.Contains(p, "ALREADY addressed") || !strings.Contains(p, "UNADDRESSED") {
		t.Errorf("the prompt never asks the model to find the unaddressed goal from history:\n%s", p)
	}
	// At least one choice must be required to chase that unaddressed goal — otherwise
	// three "correct and safe" repeats of an already-met goal satisfy the prompt fine,
	// which is exactly how the mission became unclearable.
	if !strings.Contains(p, "At least ONE of the three choices below must move a goal that is still") {
		t.Errorf("the prompt does not require a choice to progress the unaddressed goal:\n%s", p)
	}
	// And the three must not be the same action said three ways — a rut with three
	// paraphrases is indistinguishable from three copies to a grader that only checks
	// "correct and safe".
	if !strings.Contains(p, "must NOT be three phrasings of the SAME action") {
		t.Errorf("the prompt does not forbid three variations of the same action:\n%s", p)
	}
}

// A scenario with no goals (or none passed) must not crash or print a dangling section —
// the numbered-goals block is conditional on sc.Goals, same as the rest of the situation
// block.
func TestChoicesPromptWithNoGoalsSkipsTheProgressSection(t *testing.T) {
	sc := &content.Scenario{ID: "SCN-X", Title: "T", Tagline: "t"}
	lc := langContext{Native: "Korean", Target: "English", Job: "nurse", Level: "B1"}
	p := buildChoicesPrompt(sc, lc)
	if strings.Contains(p, "UNADDRESSED") {
		t.Errorf("a goal-less scenario still got the unaddressed-goal instruction:\n%s", p)
	}
}

func TestParseChoicesSurvivesTheModelsEnvelope(t *testing.T) {
	// Models wrap JSON in prose more often than not. The choices are the point; the
	// packaging is not worth a failure.
	raw := "Sure! Here are three:\n```json\n" +
		`{"choices":[{"tier":"fair","intent":"곧 가겠다고 안심시키기","text":"I'll be right there.","why":"안전하지만 진전은 없어요"},` +
		`{"tier":"best","intent":"통증 위치를 물어보기","text":"Can you tell me where the pain is?","why":"통증 위치를 먼저 확보해요"},` +
		`{"tier":"strong","intent":"통증 유무를 확인하기","text":"Are you in pain right now?","why":"통증 유무는 확인하지만 양상은 남아요"}]}` +
		"\n```\nHope that helps!"
	got := parseChoices(raw)
	if len(got) != 3 {
		t.Fatalf("parsed %d choices, want 3: %+v", len(got), got)
	}
	// Ordered best-first whatever order the model answered in: the list is read top
	// down, and "these are ranked" only reads as true if they are.
	if got[0].Tier != TierBest || got[1].Tier != TierStrong || got[2].Tier != TierFair {
		t.Fatalf("order = %q/%q/%q", got[0].Tier, got[1].Tier, got[2].Tier)
	}
	if got[0].Why == "" {
		t.Fatal("the best choice lost its reason — the difference between the three IS the lesson")
	}
}

func TestParseChoicesDropsWhatCannotBeDrawn(t *testing.T) {
	raw := `{"choices":[
      {"tier":"best","intent":"통증 위치를 물어보기","text":"Where is the pain?","why":"확보"},
      {"tier":"best","intent":"중복","text":"A duplicate tier","why":"두 번째 best"},
      {"tier":"awful","intent":"알 수 없는 등급","text":"An unknown tier","why":"x"},
      {"tier":"strong","intent":"공백 텍스트","text":"   ","why":"공백뿐"},
      {"tier":"fair","intent":"곁에 있음을 알리기","text":"I'm here with you.","why":"안심"}
    ]}`
	got := parseChoices(raw)
	if len(got) != 2 {
		t.Fatalf("kept %d, want 2 (best + fair): %+v", len(got), got)
	}
	// A blank text is a blank button; a tier the app has no style for draws unstyled;
	// two "best" replies contradict the ranking the learner is being shown.
	for _, c := range got {
		if strings.TrimSpace(c.Text) == "" {
			t.Fatal("a blank choice survived")
		}
		if !validTier(c.Tier) {
			t.Fatalf("an undrawable tier survived: %q", c.Tier)
		}
	}
	if got[0].Tier == got[1].Tier {
		t.Fatal("two choices share a tier")
	}
}

func TestParseChoicesDropsAChoiceWithNoIntent(t *testing.T) {
	// The intent (native language) is the card's own label in the guided-turn redesign, so
	// a choice without one is a blank card — dropped for the same reason a choice with no
	// `text` always was. Here only the choice that carries an intent survives.
	raw := `{"choices":[
      {"tier":"best","intent":"","text":"Where is the pain?","why":"확보"},
      {"tier":"strong","intent":"통증 유무를 확인하기","text":"Are you in pain?","why":"확인"}
    ]}`
	got := parseChoices(raw)
	if len(got) != 1 || got[0].Tier != TierStrong {
		t.Fatalf("kept %d, want 1 (the one WITH an intent): %+v", len(got), got)
	}
	if got[0].Intent == "" {
		t.Fatal("the surviving choice lost its intent — that is the card's label")
	}
}

func TestParseChoicesOnRubbishGivesNothing(t *testing.T) {
	// Nothing is a working state: the screen falls back to its text box, which is the
	// app as it always was. A scaffold that fails should leave the learner standing.
	for _, raw := range []string{"", "I could not do that.", "{", `{"choices":"not a list"}`, `{"choices":[]}`} {
		if got := parseChoices(raw); len(got) != 0 {
			t.Fatalf("parseChoices(%q) = %+v, want nothing", raw, got)
		}
	}
}

func TestTheThreeTiersAreAllUsable(t *testing.T) {
	// The tiers are best/strong/fair — not good/bad. A wrong option would make this a
	// quiz, and nobody picks the wrong one anyway, so the choice would be theatre.
	// What the learner chooses between is three ways of being competent.
	for _, tier := range []ChoiceTier{TierBest, TierStrong, TierFair} {
		if !validTier(tier) {
			t.Fatalf("%q is not accepted by the parser", tier)
		}
	}
	if validTier("bad") || validTier("wrong") || validTier("") {
		t.Fatal("a failing tier is accepted — the three are all correct by design")
	}
	if ChoiceCount != 3 {
		t.Fatalf("ChoiceCount = %d; two is a coin toss with no middle, four is a menu", ChoiceCount)
	}
}
