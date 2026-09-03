package speech

import (
	"context"
	"errors"
	"log/slog"
	"sort"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/ports"
)

// allowedOrigins mirrors domain-entities §4's allowed-set. Kept as a code-side
// set rather than a DB CHECK per project convention (extensibility over DB
// constraints) — adding an origin later needs no migration.
var allowedOrigins = map[string]bool{
	"dialogue": true,
	"review":   true,
	"drill":    true,
	"freeform": true,
}

// RecordOptions carries the bookkeeping a Record call needs beyond the audio
// and reference text: where the attempt came from and what it's linked to
// (business-rules §2, §4).
type RecordOptions struct {
	ScenarioID string
	// SessionID names the dialogue run (see ports.SpeechAttemptInput.SessionID).
	// "" outside a dialogue.
	SessionID string
	// ReviewCardID: nil means no linked card. Ownership of a non-nil id is the
	// CALLER's responsibility (ports.SpeechAttemptInput doc, business-rules
	// §2) — that check belongs to the HTTP layer (Task 5), not here.
	ReviewCardID *string
	Origin       string
}

// RecordResult is what Record hands back: the score plus the bookkeeping the
// store assigned, so a caller can both render the result and know where it
// lands in this sentence's history.
//
// PersistErr is non-nil in exactly one situation: Assess succeeded (Azure was
// already called — I4, that cost is already spent and cannot be undone) but
// InsertAttempt failed afterward. Result is still populated in that case —
// Record does NOT turn a storage failure into a total failure, mirroring
// Reference's own principle (business-rules §5) that a derivation/storage
// problem must not block a screen the user already paid an Azure call for.
// ID/AttemptNo are zero-value ("" / 0) when PersistErr is set — there is no
// row to point to. The caller decides how to surface PersistErr (Task 5's
// HTTP handler: log it, answer 200 with an empty attemptId anyway).
type RecordResult struct {
	ID          string
	SentenceKey string
	AttemptNo   int
	Result      *ports.PronunciationResult
	PersistErr  error
}

// Service records pronunciation attempts and serves their history. Scoring
// itself lives in domain/pronunciation (business-logic-model §1 PracticeLoop);
// this package owns persistence and the business rules around it. tts backs
// Reference (reference.go) — deriving the canonical IPA for a sentence before
// any audio exists (business-logic-model §1 ReferenceDerivation).
type Service struct {
	repo ports.SpeechRepo
	pron *pronunciation.Service
	tts  ports.SpeechSynthesizer
}

func NewService(repo ports.SpeechRepo, pron *pronunciation.Service, tts ports.SpeechSynthesizer) *Service {
	return &Service{repo: repo, pron: pron, tts: tts}
}

// Record scores one spoken attempt and, unless nothing was heard, persists it.
// Azure is called exactly once per attempt (invariant I4): pron.Assess is the
// only call into the scorer, and LocaleFor (used for the sentence key) is a
// pure profile lookup that never touches Azure. A no-speech result
// (azurespeech.ErrNoSpeech) is returned as-is — no attempt row is written and
// no attempt_no is consumed, matching the same treatment for a scorer 5xx.
//
// A failure AFTER scoring — InsertAttempt itself erroring — does NOT make
// Record return an error: the Azure call already happened and produced a real
// result, so the returned RecordResult carries that Result with PersistErr set
// instead of discarding it (see RecordResult's doc). Only a scoring failure
// (pron.Assess erroring, including ErrNoSpeech) is a Record-level error.
func (s *Service) Record(ctx context.Context, userID string, audioWav []byte, referenceText string, opts RecordOptions) (*RecordResult, error) {
	locale := s.pron.LocaleFor(ctx, userID)

	res, err := s.pron.Assess(ctx, userID, audioWav, referenceText)
	if err != nil {
		return nil, err
	}

	origin := opts.Origin
	if !allowedOrigins[origin] {
		slog.Warn("speech: unknown origin downgraded to freeform", "origin", opts.Origin)
		origin = "freeform"
	}

	reviewCardID := opts.ReviewCardID
	if origin == "drill" {
		// I3: a drill attempt never carries a card, regardless of what the
		// caller passed in.
		reviewCardID = nil
	}

	key := SentenceKey(referenceText, locale)

	id, attemptNo, err := s.repo.InsertAttempt(ctx, ports.SpeechAttemptInput{
		UserID:        userID,
		SentenceKey:   key,
		ReferenceText: referenceText,
		Locale:        locale,
		Recognized:    res.Recognized,
		Overall:       res.Overall,
		Accuracy:      res.Accuracy,
		Fluency:       res.Fluency,
		Completeness:  res.Completeness,
		Prosody:       res.Prosody,
		ProsodyOK:     res.ProsodyOK,
		DurationMS:    DurationMS(audioWav),
		Words:         res.Words,
		ScenarioID:    opts.ScenarioID,
		SessionID:     opts.SessionID,
		ReviewCardID:  reviewCardID,
		Origin:        origin,
	})
	if err != nil {
		slog.Warn("speech: attempt scored but not persisted", "err", err, "userID", userID, "sentenceKey", key)
		return &RecordResult{SentenceKey: key, Result: res, PersistErr: err}, nil
	}

	return &RecordResult{ID: id, SentenceKey: key, AttemptNo: attemptNo, Result: res}, nil
}

// History returns up to `limit` attempts for (userID, sentenceKey), oldest
// first. ListAttempts hands rows back newest attempt_no first; the practice
// screen renders 1st -> 2nd -> 3rd (business-rules R3), so this reverses here
// rather than making every caller remember to.
// SpeakLine synthesizes one NPC utterance in the persona's voice.
//
// Deliberately NOT a general "speak this text" endpoint: the caller passes text
// that the server itself already stored as a dialogue turn, so there is no path
// for a client to run up an unbounded TTS bill on arbitrary strings (the same
// reason the reference routes cap their text).
func (s *Service) SpeakLine(ctx context.Context, userID, text string, p PersonaVoice) ([]byte, error) {
	if s.tts == nil || !s.tts.Configured() {
		return nil, ErrTTSNotConfigured
	}
	if strings.TrimSpace(text) == "" {
		return nil, ErrNothingToSpeak
	}
	p.Locale = s.pron.LocaleFor(ctx, userID)
	voice, ok := VoiceForPersona(p)
	if !ok {
		// No appropriate voice: stay silent rather than speak in a voice that
		// contradicts the character.
		return nil, ErrUnsupportedLocale
	}
	return s.tts.Synthesize(ctx, text, voice, p.Locale)
}

// ErrNothingToSpeak means the turn had no text — nothing to synthesize, and not
// a failure the learner should see as an error.
var ErrNothingToSpeak = errors.New("speech: nothing to speak")

func (s *Service) History(ctx context.Context, userID, sentenceKey string, limit int) ([]ports.SpeechAttemptRow, error) {
	rows, err := s.repo.ListAttempts(ctx, userID, sentenceKey, limit)
	if err != nil {
		return nil, err
	}
	for i, j := 0, len(rows)-1; i < j; i, j = i+1, j-1 {
		rows[i], rows[j] = rows[j], rows[i]
	}
	return rows, nil
}

// SessionReview is the comprehensive read-back of one dialogue run: every
// sentence the player said aloud, at the score they reached, with the run's
// average.
//
// Average is over Sentences, so a player who kept re-trying one line is judged
// on where they ended up, not on the tries it took. It is 0 with no sentences —
// the screen shows the empty state rather than a badge.
type SessionReview struct {
	Sentences []ports.SpokenSentenceRow
	Average   float64
	// Weakest holds the lowest-scoring sentences (at most two), which the
	// "🎯 낮은 점수 2문장 다시 연습하기" button practises. Empty when the run had
	// nothing to review. A single spoken sentence yields one entry, not two.
	Weakest []ports.SpokenSentenceRow
}

// SessionSpeechReview assembles the Scenario Clear review for one dialogue run.
func (s *Service) SessionSpeechReview(ctx context.Context, userID, sessionID string) (*SessionReview, error) {
	rows, err := s.repo.ListSessionSpeech(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}
	out := &SessionReview{Sentences: rows}
	if len(rows) == 0 {
		return out, nil
	}
	sum := 0.0
	for _, r := range rows {
		sum += r.Overall
	}
	out.Average = sum / float64(len(rows))

	// Copy before sorting: Sentences is in conversation order and the screen
	// renders it that way. Sorting in place would silently reorder it.
	weak := make([]ports.SpokenSentenceRow, len(rows))
	copy(weak, rows)
	sort.SliceStable(weak, func(i, j int) bool { return weak[i].Overall < weak[j].Overall })
	if len(weak) > weakestCount {
		weak = weak[:weakestCount]
	}
	out.Weakest = weak
	return out, nil
}

// weakestCount is the handoff's "낮은 점수 2문장" / "가장 급한 2문장" — the same
// number in both places, so it is one constant.
const weakestCount = 2

// SpeakSummary is the Review Lab 직접 말하기 연습 block: the band distribution
// plus only the most urgent sentences. Summary-only by design — the handoff
// keeps the block bounded because the list grows past 100 items.
type SpeakSummary struct {
	Bands   ports.SpeakBandCounts
	Weakest []ports.SpokenSentenceRow
}

// SpeakSummary reads the block's two halves. The weakest rows come from the same
// paged query the full list uses, asked for its first two — so the block and the
// list can never disagree about which sentences are worst.
func (s *Service) SpeakSummary(ctx context.Context, userID string) (*SpeakSummary, error) {
	bands, err := s.repo.SpeakBands(ctx, userID)
	if err != nil {
		return nil, err
	}
	weak, _, err := s.repo.ListSpokenSentences(ctx, userID, "weak", "", "", weakestCount, 0)
	if err != nil {
		return nil, err
	}
	return &SpeakSummary{Bands: bands, Weakest: weak}, nil
}

// SpokenSentences serves one page of the full 직접 말하기 연습 list.
//
// limit is clamped rather than rejected: an over-large page is a client bug that
// should degrade to a big-but-bounded page, not a 400 that leaves the list
// stuck. Offsets past the end return an empty page, which is how the client's
// infinite scroll learns it has reached the bottom.
func (s *Service) SpokenSentences(ctx context.Context, userID, sort, dept, q string, limit, offset int) ([]ports.SpokenSentenceRow, int, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}
	return s.repo.ListSpokenSentences(ctx, userID, sort, dept, q, limit, offset)
}

// SpokenDepartments lists every department the learner has spoken in, for the list
// screen's filter chips.
func (s *Service) SpokenDepartments(ctx context.Context, userID string) ([]string, error) {
	return s.repo.SpokenDepartments(ctx, userID)
}
