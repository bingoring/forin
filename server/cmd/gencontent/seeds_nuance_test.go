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

// v46 (lesson-fidelity-v46 §D): the new sentence fields and the order card reach the
// scenario untouched, and a malformed one fails the run like any other content error.
func v46WristbandOrder() *content.SentenceOrder {
	return &content.SentenceOrder{Ko: "신원확인 4문장 순서", Why: "공감이 먼저예요.", Lines: []content.OrderLine{
		{En: "I know it feels repetitive.", Icon: "faceAngry"}, {En: "It's for your safety.", Icon: "shield"},
		{En: "Can you tell me your name?", Icon: "board"}, {En: "Thank you.", Icon: "star"}}}
}

func TestGenerateSeedScenarios_carriesV46Verbatim(t *testing.T) {
	s := baseSeed()
	sent := wristbandSentence()
	sent.Tag, sent.Icon, sent.Why, sent.Decoy = "환자 안심", "bandage", "every time을 끝에 둬요.", "for the doctor"
	sent.DistractorsKo = []string{"지금 약을 드릴게요", "차트에 기록했어요"}
	sent.Blank = &content.SentenceBlank{Answer: "wristband", Options: []content.BlankOption{
		{En: "wristband", Icon: "bandage"}, {En: "chart", Icon: "board"}, {En: "pill", Icon: "pill"}, {En: "monitor", Icon: "monitor"}}}
	s.Sentences = []content.Sentence{sent}
	s.Order = v46WristbandOrder()
	scns, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !reflect.DeepEqual(scns[0].Sentences, s.Sentences) || !reflect.DeepEqual(scns[0].Order, s.Order) {
		t.Fatalf("v46 fields not carried:\n got  %+v %+v\n want %+v %+v", scns[0].Sentences, scns[0].Order, s.Sentences, s.Order)
	}
}

func TestGenerateSeedScenarios_badV46Fails(t *testing.T) {
	s := baseSeed()
	sent := wristbandSentence()
	sent.Decoy = "every time"
	s.Sentences = []content.Sentence{sent}
	if _, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank()); err == nil || !strings.Contains(err.Error(), "V18") {
		t.Fatalf("want V18, got %v", err)
	}
	s.Sentences = []content.Sentence{wristbandSentence()}
	s.Order = v46WristbandOrder()
	s.Order.Lines = s.Order.Lines[:3]
	if _, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank()); err == nil || !strings.Contains(err.Error(), "V19") {
		t.Fatalf("want V19, got %v", err)
	}
	s.Sentences = nil
	s.Order = v46WristbandOrder()
	if _, _, err := generateSeedScenarios(0, testDept(), []Seed{s}, wristbandBank()); err == nil || !strings.Contains(err.Error(), "order") {
		t.Fatalf("order without sentences must fail, got %v", err)
	}
}
