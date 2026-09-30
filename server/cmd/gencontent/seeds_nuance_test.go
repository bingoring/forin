package main

import (
	"reflect"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// v45 (build-spec §11): the bank carries recall material, the seed carries nuance.

func v45WristbandBank() []content.Lexicon {
	bank := wristbandBank()
	w := &bank[0].Words[0]
	w.ExKo, w.Cue, w.Tag = "손목 밴드를 확인할게요.", "환자 팔에 찬 이름표", "신원 확인"
	w.DistractorsEn, w.DistractorsKo = []string{"armband", "wristwatch"}, []string{"팔찌", "손목시계"}
	w.Chips, w.DecoyChips = [][]string{{"wrist", "band"}}, []string{"arm"}
	return bank
}

func wristbandNuance() []content.Nuance {
	yes, no, zero := true, false, 0
	return []content.Nuance{
		{Kind: content.NuanceSlider, Words: []string{"w-wristband"}, Cue: "c", Scale: []string{"a", "b", "c"}, AnswerAt: &zero, Why: "w"},
		{Kind: content.NuanceContext, Words: []string{"w-wristband"}, Why: "w", Scenes: []content.NuanceScene{
			{Who: "a", En: "1", OK: &yes}, {Who: "b", En: "2", OK: &no, Fix: "f"}, {Who: "c", En: "3", OK: &yes}}},
	}
}

func TestGenerateSeedScenarios_carriesNuanceVerbatim(t *testing.T) {
	s := baseSeed()
	s.Sentences = []content.Sentence{wristbandSentence()}
	s.Nuance = wristbandNuance()
	scns, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, v45WristbandBank())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(scns[0].Nuance, s.Nuance) {
		t.Fatalf("nuance not carried verbatim:\n got  %+v\n want %+v", scns[0].Nuance, s.Nuance)
	}
}

// A v45 bank makes nuance mandatory for the situations drawing on it.
func TestGenerateSeedScenarios_v45BankWithoutNuanceFails(t *testing.T) {
	s := baseSeed()
	s.Sentences = []content.Sentence{wristbandSentence()}
	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, v45WristbandBank())
	if err == nil || !strings.Contains(err.Error(), "V14") {
		t.Fatalf("want V14, got %v", err)
	}
}

// A v44 bank (ER·ICU·OR before the backfill) still generates without nuance.
func TestGenerateSeedScenarios_v44BankWithoutNuancePasses(t *testing.T) {
	s := baseSeed()
	s.Sentences = []content.Sentence{wristbandSentence()}
	if _, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank()); err != nil {
		t.Fatalf("v44 content must still generate: %v", err)
	}
}

func TestGenerateSeedScenarios_halfBackfilledBankFails(t *testing.T) {
	bank := v45WristbandBank()
	bank[0].Words = append(bank[0].Words, content.Word{ID: "w-other", En: "other", Ko: "다른"})
	s := baseSeed()
	s.Sentences = []content.Sentence{wristbandSentence()}
	s.Nuance = wristbandNuance()
	_, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, bank)
	if err == nil || !strings.Contains(err.Error(), "V12") {
		t.Fatalf("want V12, got %v", err)
	}
}
