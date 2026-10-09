package postgres

import (
	"context"
	"reflect"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/content"
)

// v46 (lesson-fidelity-v46 §D): the sentence sheet's fields ride inside `sentences` jsonb,
// the order card has its own `lesson_order` column — both must come back out of the row
// exactly as they went in, and a scenario without an order card must read back nil (SQL
// NULL), not an empty card. Runs inside a rolled-back transaction: it never touches the
// content a real seed loaded.
func TestContentRepo_lessonV46RoundTrip(t *testing.T) {
	pool := speechTestPool(t)
	ctx := context.Background()
	tx, err := pool.Begin(ctx)
	if err != nil {
		t.Fatal(err)
	}
	defer tx.Rollback(ctx)
	q := sqlc.New(tx)
	repo := &ContentRepo{q: q}

	sc := content.Scenario{
		ID: "SCN-TEST-90001", Profession: "nurse", EventID: "EVT-TEST-90001", Title: "t", Theme: "core-safety-er",
		Sentences: []content.Sentence{{
			En: "I know it feels repetitive.", Ko: "반복처럼 느껴지시는 거 알아요", Chunks: []string{"I know", "it feels", "repetitive", "."},
			Words: []string{"w-a"}, Goal: 1, Tag: "공감", Icon: "faceAngry", Why: "공감으로 들려요.", Decoy: "for the doctor",
			DistractorsKo: []string{"지금 약을 드릴게요", "차트에 기록했어요"},
			Blank: &content.SentenceBlank{Answer: "repetitive", Options: []content.BlankOption{
				{En: "repetitive", Icon: "compass"}, {En: "important", Icon: "star"}, {En: "annoying", Icon: "faceAngry"}, {En: "quick", Icon: "chartup"}}},
		}},
		Nuance: []content.Nuance{{Kind: content.NuanceSwap, Words: []string{"w-a"}, Ko: "어젯밤 어머니가 돌아가셨어요"}},
		Order: &content.SentenceOrder{Tag: "대화 흐름", Icon: "compass", Ko: "불만 환자 응대 4문장 순서", Why: "공감이 먼저.",
			Lines: []content.OrderLine{{En: "a", Icon: "star", Ko: "가", Note: "공감"}, {En: "b", Icon: "shield"}, {En: "c", Icon: "board"}, {En: "d", Icon: "star"}}},
	}
	bare := sc
	bare.ID, bare.Order = "SCN-TEST-90002", nil
	for _, s := range []content.Scenario{sc, bare} {
		if err := q.InsertScenario(ctx, scenarioParams(s)); err != nil {
			t.Fatalf("insert %s: %v", s.ID, err)
		}
	}

	got, err := repo.GetScenario(ctx, sc.ID)
	if err != nil || got == nil {
		t.Fatalf("get: %v %v", got, err)
	}
	if !reflect.DeepEqual(got.Sentences, sc.Sentences) {
		t.Errorf("sentences:\n got  %+v\n want %+v", got.Sentences, sc.Sentences)
	}
	if !reflect.DeepEqual(got.Order, sc.Order) {
		t.Errorf("order:\n got  %+v\n want %+v", got.Order, sc.Order)
	}
	if got.Nuance[0].Ko != sc.Nuance[0].Ko {
		t.Errorf("nuance ko: %q", got.Nuance[0].Ko)
	}

	var isNull bool
	if err := tx.QueryRow(ctx, `SELECT lesson_order IS NULL FROM scenarios WHERE id = $1`, bare.ID).Scan(&isNull); err != nil || !isNull {
		t.Errorf("no order card must store SQL NULL: null=%v err=%v", isNull, err)
	}
	if b, _ := repo.GetScenario(ctx, bare.ID); b == nil || b.Order != nil {
		t.Errorf("no order card must read back nil: %+v", b)
	}
}
