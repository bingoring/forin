package conversation

import (
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

func TestBuildSystemPromptIsLanguageDriven(t *testing.T) {
	sc := &content.Scenario{Title: "T", Tagline: "x", Persona: content.Persona{Role: "patient"}}

	// Japanese learner of German → prompt must reflect that, with NO hardcoded ko/en leak.
	p := buildSystemPrompt(sc, langContext{Native: "Japanese", Target: "German", Job: "nurse"})
	if !strings.Contains(p, "German") || !strings.Contains(p, "Japanese") {
		t.Fatalf("prompt should use the given languages:\n%s", p)
	}
	if strings.Contains(p, "English") || strings.Contains(p, "Korean") {
		t.Fatalf("prompt leaked a hardcoded language:\n%s", p)
	}

	// Korean learner of English → reflects those.
	p2 := buildSystemPrompt(sc, langContext{Native: "Korean", Target: "English", Job: "nurse"})
	if !strings.Contains(p2, "English") || !strings.Contains(p2, "Korean") {
		t.Fatalf("prompt should use Korean/English when given:\n%s", p2)
	}
}

func TestLangName(t *testing.T) {
	cases := map[string]string{"ko": "Korean", "en": "English", "de": "German", "ja": "Japanese", "": "", "xx": "xx"}
	for code, want := range cases {
		if got := langName(code); got != want {
			t.Errorf("langName(%q)=%q want %q", code, got, want)
		}
	}
}
