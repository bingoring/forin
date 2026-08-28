package conversation

import (
	"context"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/user"
)

func levelScenario() *content.Scenario {
	return &content.Scenario{
		ID: "SCN-ER-00002", Title: "흉통 환자 트리아지", Tagline: "가슴 통증을 호소하는 환자",
		Goals:      []string{"환자 본인 확인", "통증 양상 사정"},
		Guardrails: []string{"진단을 단정하지 않는다"},
		Persona:    content.Persona{Name: "Mr. Reyes", Role: "환자", SpeakingStyle: "짧게 끊어 말한다"},
	}
}

// The register has to reach the model. Both prompts are built from langContext, and a
// level that is stored but never written into the string is exactly the state this
// feature was in before: a profile chip and nothing else.
func TestTheLevelReachesBothPrompts(t *testing.T) {
	sc := levelScenario()
	for _, level := range []string{"A1", "B1", "C1"} {
		lc := langContext{Native: "Korean", Target: "English", Job: "nurse", Level: level}

		sys := buildSystemPrompt(sc, lc, "")
		if !strings.Contains(sys, user.SpeechRegister(level)) {
			t.Fatalf("the %s speech register is missing from the role-play prompt", level)
		}
		grade := buildGradingPrompt(sc, lc)
		if !strings.Contains(grade, user.GradingExpectation(level)) {
			t.Fatalf("the %s grading expectation is missing from the examiner prompt", level)
		}
	}
}

// Two different learners must get two different prompts, or the plumbing is there and
// the behaviour is not.
func TestDifferentLevelsProduceDifferentPrompts(t *testing.T) {
	sc := levelScenario()
	base := langContext{Native: "Korean", Target: "English", Job: "nurse"}
	a := base
	a.Level = "A1"
	c := base
	c.Level = "C1"

	if buildSystemPrompt(sc, a, "") == buildSystemPrompt(sc, c, "") {
		t.Fatal("a beginner and an advanced speaker get the same role-play prompt")
	}
	if buildGradingPrompt(sc, a) == buildGradingPrompt(sc, c) {
		t.Fatal("a beginner and an advanced speaker are graded by the same prompt")
	}
}

// The scenario's own instructions must survive the addition. The register is one
// paragraph among the goals, guardrails and persona — not a replacement for them.
func TestTheRegisterDoesNotDisplaceTheScenario(t *testing.T) {
	sc := levelScenario()
	lc := langContext{Native: "Korean", Target: "English", Job: "nurse", Level: "A1"}
	sys := buildSystemPrompt(sc, lc, "")
	for _, must := range []string{sc.Title, "Mr. Reyes", "짧게 끊어 말한다", "환자 본인 확인"} {
		if !strings.Contains(sys, must) {
			t.Fatalf("the prompt lost %q", must)
		}
	}
	// The persona's authored speaking style comes AFTER the register, so a character
	// written as terse stays terse even at the advanced tier.
	if strings.Index(sys, user.SpeechRegister("A1")) > strings.Index(sys, "짧게 끊어 말한다") {
		t.Fatal("the register is written after the persona and would override it")
	}
}

// levelProfiles is a ProfileReader returning one fixed profile, or none.
type levelProfiles struct {
	p *user.Profile
}

func (f levelProfiles) GetProfile(context.Context, string) (*user.Profile, error) {
	if f.p == nil {
		return nil, nil
	}
	return f.p, nil
}

// The step between the database and the prompt: langFor has to actually READ
// target_level. Removing that one line broke nothing until this test existed — the
// prompt builders were covered, and the thing that fills their input was not.
func TestLangForReadsTheProfileLevel(t *testing.T) {
	cases := []struct {
		name    string
		profile *user.Profile
		want    string
	}{
		{"the answered level", &user.Profile{TargetLevel: "C1"}, "C1"},
		{"lower case from the column", &user.Profile{TargetLevel: "a2"}, "A2"},
		// Normalized in langFor, so no prompt builder has to know the default.
		{"an unanswered level", &user.Profile{TargetLevel: ""}, user.DefaultLevel},
		{"a value nothing wrote", &user.Profile{TargetLevel: "fluent"}, user.DefaultLevel},
		{"no profile at all", nil, user.DefaultLevel},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			e := &Engine{profiles: levelProfiles{p: c.profile}}
			if got := e.langFor(context.Background(), "u1").Level; got != c.want {
				t.Fatalf("langFor().Level = %q, want %q", got, c.want)
			}
		})
	}
}
