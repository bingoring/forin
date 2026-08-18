package speech

import (
	"context"
	"errors"
	"log/slog"
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
