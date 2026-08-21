package conversation

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/progress"
)

// A review card asks you to produce a phrase. Its front has to be something you can
// answer, and the reason a phrase is better is not that.
//
// The bug: Front was the tip's `ko`, which the prompt defines as the REASON. So a tip
// whose reason was "자신의 이름과 직책을 영어로 말하세요" became a card whose prompt was an
// instruction — advice about a phrase sitting where the phrase's meaning belongs. The
// learner reported it as "why is your coaching in my review lab", which is exactly what it
// was.
func TestTipCardPutsTheMeaningOnTheFrontAndTheReasonInTheNote(t *testing.T) {
	card, ok := tipCard(GradeTip{
		En:  "Hello, I'm Mina, the nurse looking after you today.",
		Ko:  "자신의 이름과 직책을 영어로 말하세요",
		Cue: "안녕하세요, 오늘 담당 간호사 미나입니다.",
	}, progress.ReviewContext{Situation: "응급실 첫 출근"})
	if !ok {
		t.Fatalf("expected a card")
	}
	if card.Front != "안녕하세요, 오늘 담당 간호사 미나입니다." {
		t.Fatalf("front should be the meaning, got %q", card.Front)
	}
	if card.Back != "Hello, I'm Mina, the nurse looking after you today." {
		t.Fatalf("back should be the phrase, got %q", card.Back)
	}
	if card.Note != "자신의 이름과 직책을 영어로 말하세요" {
		t.Fatalf("the reason belongs in the note, got %q", card.Note)
	}
}

func TestTipWithNothingToRecallIsDropped(t *testing.T) {
	// Previously a missing front fell back to the scenario's situation text, which asked the
	// learner to recall a phrase from a description of the room.
	for _, tip := range []GradeTip{
		{En: "", Ko: "reason", Cue: "의미"},
		{En: "Some phrase.", Ko: "reason", Cue: ""},
		{En: "   ", Ko: "reason", Cue: "   "},
	} {
		if _, ok := tipCard(tip, progress.ReviewContext{Situation: "응급실 첫 출근"}); ok {
			t.Fatalf("expected %+v to be dropped", tip)
		}
	}
}

// The prompt has to ask for all three, and say what `en` may not be.
func TestGradePromptAsksForACueAndForbidsInstructions(t *testing.T) {
	p := buildGradingPrompt(&content.Scenario{Title: "첫 출근", Tagline: "You must be the new nurse."}, langContext{Native: "Korean", Target: "English", Job: "nurse"})
	for _, want := range []string{"\"cue\"", "word-for-word", "never an instruction"} {
		if !strings.Contains(p, want) {
			t.Fatalf("prompt is missing %q", want)
		}
	}
}
