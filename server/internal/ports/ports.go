// Package ports defines the interfaces (driven ports) that the domain depends on.
// Adapters in internal/adapters implement these; this keeps providers swappable.
package ports

import (
	"context"
	"errors"
	"time"

	"github.com/bingoring/forin/server/internal/domain/colleague"
	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/reputation"
	"github.com/bingoring/forin/server/internal/domain/user"
)

// ErrDailyCapReached signals the user has spent all of today's rewarded-ad top-up grants.
var ErrDailyCapReached = errors.New("daily ad-grant cap reached")

// ProgressRepo reads/updates user growth.
type ProgressRepo interface {
	GetProgress(ctx context.Context, userID string) (*progress.Progress, error)
	// RecordAttempt logs a scenario attempt, awards `score` XP, updates streak, and
	// returns new progress. state is 'cleared' (passed → counts as 완료) or
	// 'attempted' (engaged but below pass). grade is the 0..100 AI score, or <0 for
	// a direct/legacy attempt with no grade (stored NULL).
	RecordAttempt(ctx context.Context, userID, scenarioID string, score int, state string, grade int) (*progress.Progress, error)
	// ApplyReputation nudges ONE standing dimension by delta, clamped to 0..100.
	// The dimension is passed by name (reputation.Dimension) so the column layout
	// stays an implementation detail of the repo — a future per-profession
	// key-value store swaps in without touching callers.
	ApplyReputation(ctx context.Context, userID string, dim reputation.Dimension, delta int) error
	// GrowthStats aggregates activity for the growth report. dayStart/weekStart are
	// the period lower bounds (already computed in tzName); ActiveDates are bucketed
	// as calendar dates in tzName (an IANA zone, e.g. "Asia/Seoul") over the week.
	GrowthStats(ctx context.Context, userID string, dayStart, weekStart time.Time, tzName string) (*progress.GrowthStats, error)
	// CalendarEntries returns each attempt in [from, to) with the local date and hour
	// it started, for the calendar report. The band those hours mean is the domain's
	// decision (progress.BandForHour), not this query's.
	CalendarEntries(ctx context.Context, userID string, from, to time.Time, tzName string) ([]progress.CalendarEntry, []string, error)
	// LatestAttemptScenarioID returns the scenario the user most recently STARTED,
	// or "" when they have never played. started_at, not cleared_at: a run the user
	// walked out of is still the place they were, and the home screen's "continue"
	// has to point there (business-rules R11).
	LatestAttemptScenarioID(ctx context.Context, userID string) (string, error)
	// ClearedScenarioIDs returns the set of scenario ids the user has cleared.
	ClearedScenarioIDs(ctx context.Context, userID string) (map[string]bool, error)
	// AttemptedScenarioIDs returns the ids the user has PLAYED but not cleared.
	// Disjoint from ClearedScenarioIDs on purpose: a scenario appears in exactly one
	// of the two, so the caller never has to decide which wins.
	AttemptedScenarioIDs(ctx context.Context, userID string) (map[string]bool, error)
	// TodaysPage returns today's 오늘의 호출, ISSUING it on the first look of the day.
	// `scenarioID` is what the call should point at if there is no row yet; it is
	// ignored once one exists, so the call cannot change under a learner who reloads.
	TodaysPage(ctx context.Context, userID, localDate, scenarioID string) (*progress.DailyPage, error)
	// AcceptPage records that the learner took today's call and returns its scenario.
	// Idempotent — the first acceptance's time is what "did they actually go?" is
	// measured from.
	AcceptPage(ctx context.Context, userID, localDate string) (scenarioID string, err error)
	// CompletePageIfAttempted pays the call off ONCE the learner has actually started
	// the scenario, and reports whether this call was the one that did it. False means
	// they have not gone yet, or it was already paid.
	CompletePageIfAttempted(ctx context.Context, userID, localDate string) (bool, error)
	// AddBonusXP grants XP that is not a scenario attempt. RecordAttempt is the other
	// XP path and it logs an attempt row, which would put a phantom run in the history.
	AddBonusXP(ctx context.Context, userID string, xp int) error
	// FoundMissions lists permanently-discovered hidden mission ids.
	FoundMissions(ctx context.Context, userID string) ([]string, error)
	// RecordMission permanently records a hidden-mission discovery (idempotent).
	RecordMission(ctx context.Context, userID, missionID string) error
}

// ReviewRepo manages spaced-repetition cards.
type ReviewRepo interface {
	DueCards(ctx context.Context, userID string, today time.Time, limit int) ([]progress.ReviewCard, error)
	GetCardForUser(ctx context.Context, userID, cardID string) (*progress.ReviewCard, error)
	SaveSchedule(ctx context.Context, cardID string, s progress.Schedule, masteryPips int) error
	// CreateCard inserts a card + its initial (due-today) schedule, returns the card id.
	CreateCard(ctx context.Context, c NewReviewCard) (string, error)
	// ListModelAnswerScenarios returns one page of the scenarios the player has
	// corrections for, WITHOUT their cards, plus the unpaged total.
	// needsWorkFirst selects the sort (개선 필요 / 최신).
	ListModelAnswerScenarios(ctx context.Context, userID string, needsWorkFirst bool, limit, offset int) (groups []progress.ModelAnswerGroup, total int, err error)
	// ListModelAnswerCards returns the corrections for the given scenarios,
	// keyed by scenario id — one query for a whole page rather than one per group.
	ListModelAnswerCards(ctx context.Context, userID string, scenarioIDs []string) (map[string][]progress.ModelAnswerCard, error)
}

// NewReviewCard is the input for creating a review card (e.g. from an AI correction).
type NewReviewCard struct {
	UserID, Source, Front, Back, Note, TopicTag string
	ScenarioID                                  string
	Context                                     progress.ReviewContext
}

// ---- AI / conversation ports ----

// LLMMessage is one chat message (role: "user" | "assistant").
type LLMMessage struct {
	Role    string
	Content string
}

// LLMRequest is a provider-agnostic completion request.
type LLMRequest struct {
	Model     string
	System    string
	Messages  []LLMMessage
	MaxTokens int
}

// LLMPort is the low-level LLM adapter (Anthropic/OpenAI etc.). Strategies compose it.
type LLMPort interface {
	Complete(ctx context.Context, req LLMRequest) (string, error)
	// CompleteStream streams the reply; onDelta is called per text chunk. Returns the full text.
	// If onDelta returns an error (e.g. client disconnected), streaming stops.
	CompleteStream(ctx context.Context, req LLMRequest, onDelta func(string) error) (string, error)
}

// ProfileReader exposes the user's language context for prompt building.
type ProfileReader interface {
	GetProfile(ctx context.Context, userID string) (*user.Profile, error)
}

// ProgressReader exposes the user's growth snapshot for prompt building (e.g. to
// weight an NPC's disposition by reputation). Narrow read-only view of ProgressRepo.
type ProgressReader interface {
	GetProgress(ctx context.Context, userID string) (*progress.Progress, error)
}

// ReputationWriter applies a standing change. Kept separate from ProgressReader
// so the dialogue engine's read path stays provably read-only.
type ReputationWriter interface {
	ApplyReputation(ctx context.Context, userID string, dim reputation.Dimension, delta int) error
}

// SyllableResult is one syllable of a word, as segmented by the scorer.
//
// Offset and Duration are the scorer's timing for this syllable, in
// 100-nanosecond units from the start of the audio. They are what links a
// syllable to the phonemes inside it: the two arrays arrive flat and
// unindexed, and a phoneme belongs to the syllable whose [Offset,
// Offset+Duration) window contains it. A correction point is labeled with the
// syllable, not the phoneme, so dropping these leaves the caller guessing
// from array order.
type SyllableResult struct {
	Syllable string  `json:"syllable"`
	Grapheme string  `json:"grapheme,omitempty"`
	Accuracy float64 `json:"accuracy"`
	Offset   int64   `json:"offset,omitempty"`
	Duration int64   `json:"duration,omitempty"`
}

// PhonemeResult is one phoneme and how well it was produced.
//
// Phoneme is IPA when the scorer was asked for it — see the notation notes in
// content/phonemetips, which is the only thing that should be interpreting
// this string. Offset and Duration are as in SyllableResult.
type PhonemeResult struct {
	Phoneme  string  `json:"phoneme"`
	Accuracy float64 `json:"accuracy"`
	Offset   int64   `json:"offset,omitempty"`
	Duration int64   `json:"duration,omitempty"`
}

// WordScore is a per-word pronunciation result.
type WordScore struct {
	Word      string           `json:"word"`
	Accuracy  float64          `json:"accuracy"`
	ErrorType string           `json:"errorType,omitempty"`
	Syllables []SyllableResult `json:"syllables,omitempty"`
	Phonemes  []PhonemeResult  `json:"phonemes,omitempty"`
}

// PronunciationResult is the assessment of a spoken utterance vs a reference text.
type PronunciationResult struct {
	Recognized   string  `json:"recognized"`
	Accuracy     float64 `json:"accuracy"`
	Fluency      float64 `json:"fluency"`
	Completeness float64 `json:"completeness"`
	Overall      float64 `json:"overall"`
	// Prosody (억양) only arrives when EnableProsodyAssessment is on AND the
	// locale supports it. ProsodyOK distinguishes "scored 0" from "not scored" —
	// rendering an absent score as 0 would tell the learner a falsehood.
	Prosody   float64     `json:"prosody"`
	ProsodyOK bool        `json:"prosodyAvailable"`
	Words     []WordScore `json:"words,omitempty"`
	// DurationMS is the recorded audio's length in milliseconds. Azure's
	// pronunciation-assessment response does not carry this — it is NOT
	// populated by the azurespeech adapter. The caller computes it from the
	// WAV it captured (see business-rules R6 / domain-entities SpeechAttempt).
	DurationMS int `json:"durationMs"`
}

// PronunciationPort scores spoken audio against a reference (Azure etc.) and
// transcribes plain speech-to-text.
type PronunciationPort interface {
	Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*PronunciationResult, error)
	Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error)
}

// ---- Speech attempt / reference persistence (pronunciation loop, Build Spec
// docs/dlc/projects/forin/02-construction/pronunciation/) ----

// SpeechAttemptInput is what the domain layer hands to SpeechRepo.InsertAttempt.
// It mirrors PronunciationResult + the bookkeeping fields the caller adds (which
// sentence, whose attempt, which card if any). attempt_no and id are NOT here —
// the store assigns them (business-rules I5), which is why they come back as
// return values instead of being passed in.
type SpeechAttemptInput struct {
	UserID        string
	SentenceKey   string
	ReferenceText string
	Locale        string
	Recognized    string
	Overall       float64
	Accuracy      float64
	Fluency       float64
	Completeness  float64
	// Prosody/ProsodyOK mirror PronunciationResult: ProsodyOK=false means the
	// locale/scorer did not assess prosody, which is NOT the same fact as scoring
	// zero (domain-entities SpeechAttempt). The repo maps ProsodyOK=false to a
	// SQL NULL, never to 0.
	Prosody      float64
	ProsodyOK    bool
	DurationMS   int
	Words        []WordScore // stored as JSONB; the repo also flattens Words[*].Phonemes into speech_phoneme_scores rows in the SAME transaction (I2) — callers do not pass phonemes separately
	ScenarioID   string
	ReviewCardID *string // nil = no linked card (drill/freeform origin, or a correction with no card). Ownership of a non-nil id is the CALLER's responsibility (business-rules §2) — the repo does not check it
	Origin       string  // allowed-set: dialogue | review | drill | freeform (domain-entities §4)
	// SessionID names the dialogue RUN this utterance belongs to, where
	// ScenarioID only names the scenario. The Scenario Clear review lists the
	// run that just ended, so a replay must not pull in the previous run's
	// sentences. "" for attempts made outside a dialogue.
	SessionID string
}

// SpokenSentenceRow is one sentence the player said out loud, at the score they
// currently stand at (newest attempt per sentence) — the unit of both the
// Scenario Clear review list and the Review Lab 직접 말하기 연습 list.
//
// Deliberately not SpeechAttemptRow: that type is one TRY at a known sentence
// and carries the syllable/phoneme breakdown for the practice strip. This is one
// SENTENCE across tries, and the lists that render it need the text and the
// provenance (which scenario, how many tries) instead — sending words[] for 128
// rows would dwarf the payload with data no list draws.
type SpokenSentenceRow struct {
	SentenceKey   string  `json:"sentenceKey"`
	ReferenceText string  `json:"referenceText"`
	Recognized    string  `json:"recognized"`
	Overall       float64 `json:"overall"`
	Accuracy      float64 `json:"accuracy"`
	Fluency       float64 `json:"fluency"`
	Completeness  float64 `json:"completeness"`
	// Attempts is the newest attempt_no, which IS the number of tries: attempt
	// numbers are assigned 1..N per (user, sentence) with no gaps (I5).
	Attempts int `json:"attempts"`
	// ScenarioID lets the list derive its department chip (SCN-ER-00002 → ER)
	// without a second lookup. "" for a sentence practised outside a scenario.
	ScenarioID string    `json:"scenarioId,omitempty"`
	Origin     string    `json:"origin,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// SpeakBandCounts is the 60↓ / 60–79 / 80+ distribution of the player's current
// standing, one count per band over sentences (not attempts) — see the SpeakBands
// query for why attempts would be the wrong denominator.
type SpeakBandCounts struct {
	Total int `json:"total"`
	Low   int `json:"low"`
	Mid   int `json:"mid"`
	High  int `json:"high"`
}

// SpeechAttemptRow is one row of a sentence's attempt history, as returned by
// ListAttempts (business-rules R3: caller takes the newest 3). Bookkeeping-only
// columns (scenario_id, origin, review_card_id, locale, sentence_key,
// reference_text) are deliberately not surfaced here — the practice screen's
// history strip only needs scores, the transcript, and the syllable/phoneme
// breakdown for that attempt.
// JSON tags match PronunciationResult's wire convention exactly (durationMs,
// not DurationMS; prosodyAvailable, not ProsodyOK) — these rows travel over
// GET /speech/attempts alongside PronunciationResult-shaped data, and a mixed
// vocabulary (durationMs on one, DurationMS on the other) in the same client
// is its own bug. Before these tags existed, encoding/json fell back to the
// exported Go field names verbatim (PascalCase) — caught in code review
// because the http tests decoded the response back into this same struct,
// which is case-insensitive on unmarshal and so never noticed the mismatch.
type SpeechAttemptRow struct {
	ID           string      `json:"id"`
	AttemptNo    int         `json:"attemptNo"`
	Recognized   string      `json:"recognized"`
	Overall      float64     `json:"overall"`
	Accuracy     float64     `json:"accuracy"`
	Fluency      float64     `json:"fluency"`
	Completeness float64     `json:"completeness"`
	Prosody      float64     `json:"prosody"`
	ProsodyOK    bool        `json:"prosodyAvailable"` // false = NULL in storage, i.e. prosody was never scored — see SpeechAttemptInput
	DurationMS   int         `json:"durationMs"`
	Words        []WordScore `json:"words,omitempty"`
	CreatedAt    time.Time   `json:"createdAt"`
}

// SentenceReferenceRow is the canonical per-sentence breakdown (business-rules
// R9: one global row per sentence_key, derived once and shared by every user).
// Words carries syllable/phoneme segmentation only — accuracy on this row is
// meaningless because there is no speaker to score (domain-entities §2).
// JSON tags mirror SpeechAttemptRow's (see its comment) — durationMs, not
// DurationMS.
type SentenceReferenceRow struct {
	SentenceKey   string      `json:"sentenceKey"`
	ReferenceText string      `json:"referenceText"`
	Locale        string      `json:"locale"`
	IPA           string      `json:"ipa"`
	Words         []WordScore `json:"words,omitempty"`
	DurationMS    int         `json:"durationMs"`
	// ReferenceAudio is the exact WAV Reference synthesized to derive this
	// row (Task 11) — an INPUT to PutReference only, so the same TTS render
	// backs both the segmentation and native playback (one Synthesize call,
	// not two). json:"-" because GET /speech/reference must keep returning
	// small JSON metadata, never an inline ~320KB base64 blob; GetReference
	// (the row read used by that endpoint) does NOT populate this field —
	// serving audio bytes goes through the separate GetReferenceAudio call
	// (speech_audio_handler.go), which fetches only the bytea column.
	ReferenceAudio []byte `json:"-"`
}

// SpeechRepo persists pronunciation-practice attempts and the canonical
// per-sentence reference breakdown. speech_attempts is append-only (I1): there
// is no Update/Delete path here, by design.
type SpeechRepo interface {
	// InsertAttempt appends one attempt row plus its phoneme observations (0..N,
	// derived from a.Words) in a single transaction (I2), with attempt_no
	// assigned by the database as (user_id, sentence_key) MAX+1 (I5). Two
	// concurrent requests can compute the same MAX and race on the
	// UNIQUE(user_id, sentence_key, attempt_no) constraint; InsertAttempt retries
	// once on a 23505 unique-violation before giving up and returning the error.
	InsertAttempt(ctx context.Context, a SpeechAttemptInput) (id string, attemptNo int, err error)
	// ListAttempts returns up to `limit` attempts for (userID, sentenceKey),
	// newest attempt_no first.
	ListAttempts(ctx context.Context, userID, sentenceKey string, limit int) ([]SpeechAttemptRow, error)
	// ListSessionSpeech returns the sentences spoken during ONE dialogue run
	// (userID, sessionID), oldest first, collapsed to the newest attempt per
	// sentence. Empty slice — never an error — when that run recorded nothing.
	ListSessionSpeech(ctx context.Context, userID, sessionID string) ([]SpokenSentenceRow, error)
	// SpeakBands returns the score-band distribution of the player's current
	// standing across every sentence they have spoken (one per sentence, newest
	// attempt). Zero counts for a player who has never spoken.
	SpeakBands(ctx context.Context, userID string) (SpeakBandCounts, error)
	// ListSpokenSentences returns one page of the player's spoken sentences,
	// newest attempt per sentence, plus the UNPAGED total. weakestFirst selects
	// the sort (약한 순 / 최신). total is 0 on an empty page — the caller holds
	// the real total from the first page.
	// dept "" means every department. Filtering here rather than on the client is
	// what keeps `total` and the paging honest.
	ListSpokenSentences(ctx context.Context, userID string, weakestFirst bool, dept string, limit, offset int) (rows []SpokenSentenceRow, total int, err error)
	// SpokenDepartments lists every department the learner has spoken in, so the
	// filter chips are complete rather than growing as pages load.
	SpokenDepartments(ctx context.Context, userID string) ([]string, error)
	// GetReference fetches the cached canonical breakdown for sentenceKey, or nil
	// if none has been derived yet (business-rules "참조 생성 실패" edge case).
	GetReference(ctx context.Context, sentenceKey string) (*SentenceReferenceRow, error)
	// PutReference caches a freshly-derived breakdown. First writer wins — an
	// existing row for the same sentence_key is left untouched (R9: the
	// breakdown is deterministic per sentence, so a race just wastes one Azure
	// call, never corrupts data). r.ReferenceAudio is persisted alongside it
	// (Task 11) so the same TTS render backs both segmentation and playback.
	PutReference(ctx context.Context, r SentenceReferenceRow) error
	// GetReferenceAudio fetches the cached reference WAV for sentenceKey, or a
	// nil/empty slice if none is stored (no reference derived yet, or a row
	// that predates Task 11's audio_wav column). Never returns an error for
	// "not found" — same convention as GetReference.
	GetReferenceAudio(ctx context.Context, sentenceKey string) ([]byte, error)
	// UpdateReferenceAudio backfills audio_wav for a row that already exists
	// but has none (review round 2, Important 1: a legacy row predating this
	// column, or one left behind by running migration 000022 down and back
	// up). Conditioned on the CURRENT audio_wav still being empty — first
	// writer wins, same spirit as PutReference's ON CONFLICT DO NOTHING for
	// the row as a whole — so a race between two backfills just wastes one
	// extra Azure call, never corrupts data.
	UpdateReferenceAudio(ctx context.Context, sentenceKey string, wav []byte) error
}

// SpeechSynthesizer turns text into speech audio (WAV/PCM16). Used to voice
// listen-quiz dictation with a real, waveform-analyzable audio clip.
type SpeechSynthesizer interface {
	// Synthesize returns a WAV (RIFF PCM16) of `text` spoken in `voice`/`locale`.
	Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error)
	Configured() bool
}

// ConversationSession / Turn are persistence DTOs for dialogue.
type ConversationSession struct{ ID, UserID, ScenarioID string }
type ConversationTurn struct {
	Role, Content string
	// Mood is the NPC's mood at this turn, "" for a user turn (and for assistant
	// turns recorded before the column existed).
	Mood string
}

// ConversationRepo persists dialogue sessions and turns.
type ConversationRepo interface {
	CreateSession(ctx context.Context, userID, scenarioID string) (string, error)
	GetSession(ctx context.Context, sessionID string) (*ConversationSession, error)
	// AppendTurn records one turn. `mood` is "" for user turns and for an assistant
	// reply whose mood could not be read.
	AppendTurn(ctx context.Context, sessionID, role, content, mood string) error
	// LatestAssistantMood returns the mood of the NPC's most recent turn, or "" when
	// it has not spoken yet. Used to decide whether THIS turn made things better.
	LatestAssistantMood(ctx context.Context, sessionID string) (string, error)
	History(ctx context.Context, sessionID string, limit int) ([]ConversationTurn, error)
	// LatestSessionWithTurns finds the newest session for this learner+scenario
	// that has at least one turn, so a half-finished conversation can be picked
	// up instead of being orphaned in the table. Returns ("", 0, nil) when there
	// is nothing to resume — absence is not an error.
	LatestSessionWithTurns(ctx context.Context, userID, scenarioID string) (sessionID string, turns int, err error)
	// DiscardSession marks one of this learner's sessions as thrown away, so it is
	// never offered back for resuming. Returns false when there is nothing to
	// discard — no such session, not theirs, or already discarded — which is not an
	// error: the caller wanted it gone and it is gone.
	DiscardSession(ctx context.Context, userID, sessionID string) (bool, error)
	SaveCorrection(ctx context.Context, userID, original, corrected, note, topicTag string) error
}

// ContentReader serves authored content (read-only) to the domain/API.
type ContentReader interface {
	Manifest(ctx context.Context) (*content.Manifest, error)
	ListDepartments(ctx context.Context, profession string) ([]content.Department, error)
	GetInterior(ctx context.Context, id string) (*content.Interior, error)
	ListEvents(ctx context.Context, profession string) ([]content.Event, error)
	GetScenario(ctx context.Context, id string) (*content.Scenario, error)
	GetQuiz(ctx context.Context, id string) (*content.Quiz, error)
	TodaysBoard(ctx context.Context, profession string, limit int) ([]content.Event, error)
	TodaysScenarios(ctx context.Context, profession string, limit int) ([]content.BoardCard, error)
	// DailyPool returns the user's personalized daily situation set (DailyEventSet):
	// weighted, persisted, and reset at 00:00 in the user's timezone (via localDate).
	DailyPool(ctx context.Context, userID, profession, localDate string, limit int) ([]content.BoardCard, error)
	// TopUpDailyPool appends `add` fresh scenarios (rewarded ad) up to `cap` grants/
	// day; returns the grown set + new grant count (ErrDailyCapReached when spent).
	TopUpDailyPool(ctx context.Context, userID, profession, localDate string, add, cap int) ([]content.BoardCard, int, error)
	// MainRoute computes the user's curriculum path (events + unlock states).
	MainRoute(ctx context.Context, userID, profession string) ([]content.RouteNode, error)
	// DeptSituations lists a department's scenarios as situation cards (tagged by
	// difficulty + the user's cleared attempts), paginated by offset/limit so a
	// single-department learner can browse the full bank. Returns hasMore.
	DeptSituations(ctx context.Context, userID, dept string, offset, limit int) ([]content.DeptSituation, bool, error)
	// SearchSituations finds situations by title across every department, so the
	// client can offer one search box instead of asking which ward to look in
	// first. Same card shape as DeptSituations; capped by limit.
	SearchSituations(ctx context.Context, userID, q string, limit int) ([]content.DeptSituation, error)
}

// ContentSeeder ingests a validated content bundle (file-source or, later, a CMS).
type ContentSeeder interface {
	Seed(ctx context.Context, b *content.Bundle) error
}

// VerifiedIdentity is the result of validating a provider ID token.
type VerifiedIdentity struct {
	Subject string
	Email   string
}

// IdentityVerifier validates a social provider's ID token (Apple/Google/Kakao via OIDC).
type IdentityVerifier interface {
	Verify(ctx context.Context, provider user.Provider, idToken string) (*VerifiedIdentity, error)
}

// UserRepo persists users, identities, and profiles.
type UserRepo interface {
	// UpsertByIdentity finds-or-creates a user for (provider, subject), recording email.
	UpsertByIdentity(ctx context.Context, provider user.Provider, subject, email string) (*user.User, error)
	GetByID(ctx context.Context, id string) (*user.User, error)
	GetProfile(ctx context.Context, userID string) (*user.Profile, error)
	// UpdateProfile upserts onboarding-derived profile fields and marks onboarded.
	UpdateProfile(ctx context.Context, p user.Profile) error
	// SetEquippedTitle persists the user's equipped career title.
	SetEquippedTitle(ctx context.Context, userID, titleID string) error
	// SetDisplayName persists the learner's chosen name ("" = cleared, fall back to
	// user.ShortID).
	SetDisplayName(ctx context.Context, userID, name string) error
	// DisplayNames resolves many users' names at once. Users with no name set are
	// ABSENT from the returned map, not present with "".
	DisplayNames(ctx context.Context, userIDs []string) (map[string]string, error)
	// SetUILang persists the app's display language ("" = follow NativeLang). Kept
	// apart from UpdateProfile, which is a full onboarding upsert.
	SetUILang(ctx context.Context, userID, lang string) error
}

// RefreshStore stores hashed refresh tokens with TTL and supports rotation.
type RefreshStore interface {
	Save(ctx context.Context, userID, tokenHash string, ttl time.Duration) error
	// Consume returns true and deletes the token if (userID, tokenHash) exists.
	Consume(ctx context.Context, userID, tokenHash string) (bool, error)
	DeleteAll(ctx context.Context, userID string) error
}

// ColleagueRepo persists invite-code based colleague relationships, the requests
// that create them, cheers, presence and sharing preferences.
//
// Links are stored as a MIRRORED PAIR — every method that creates or removes a
// link writes both rows in one transaction, so callers never see a half-link
// (Build Spec INV-1/2/3).
type ColleagueRepo interface {
	// ActiveCode returns the user's current invite code, or nil when they have
	// none / it expired / it is used up.
	ActiveCode(ctx context.Context, userID string) (*colleague.InviteCode, error)
	// SaveCode revokes any previous active code and stores this one atomically.
	SaveCode(ctx context.Context, c colleague.InviteCode) error
	// CodeOwner resolves a normalized code to its still-usable record.
	CodeOwner(ctx context.Context, code string) (*colleague.InviteCode, error)

	// Links lists the user's colleagues, newest first.
	Links(ctx context.Context, userID string) ([]colleague.Link, error)
	// Linked reports whether the two users are connected (either direction implies
	// both, given the mirrored-pair invariant).
	Linked(ctx context.Context, userID, otherID string) (bool, error)
	// LinkRelation is how the other person relates to this learner, or "" when there is
	// no link. The detail response needs it and the link row already carries it.
	LinkRelation(ctx context.Context, userID, otherID string) (colleague.Relation, error)
	// LinkCount is used to enforce the colleague cap.
	LinkCount(ctx context.Context, userID string) (int, error)
	// Unlink removes both rows of the pair.
	Unlink(ctx context.Context, userID, otherID string) error

	// PendingRequest returns the pending request from → to, if any.
	PendingRequest(ctx context.Context, fromID, toID string) (*colleague.Request, error)
	// CreateRequest stores a pending request and increments the code's use count
	// in the same transaction (INV-4).
	CreateRequest(ctx context.Context, r colleague.Request, code string) error
	// InboxRequests lists pending requests addressed to the user.
	InboxRequests(ctx context.Context, userID string) ([]colleague.Request, error)
	// AcceptRequest marks the request accepted AND writes the mirrored link pair.
	AcceptRequest(ctx context.Context, requestID, byUserID string) (*colleague.Request, error)
	// SetRequestStatus handles decline/cancel.
	SetRequestStatus(ctx context.Context, requestID, byUserID string, status colleague.RequestStatus) error

	// AddCheer stores a cheer and fills in the generated id/timestamp.
	AddCheer(ctx context.Context, c *colleague.Cheer) error
	// CheersToday counts cheers sent from → to since `since` (rate limit R-9).
	CheersToday(ctx context.Context, fromID, toID string, since time.Time) (int, error)
	// Inbox lists received cheers, newest first.
	Inbox(ctx context.Context, userID string, limit int) ([]colleague.Cheer, error)
	// UnreadCheers counts unread received cheers.
	UnreadCheers(ctx context.Context, userID string) (int, error)
	// MarkCheersRead marks the user's received cheers as read.
	MarkCheersRead(ctx context.Context, userID string) error
	// Conversation lists cheers exchanged between two users, newest first.
	Conversation(ctx context.Context, userID, otherID string, limit int) ([]colleague.Cheer, error)

	// TouchPresence bumps last_seen_at, optionally recording what the user is doing.
	// Empty scenarioID/label leave the previous activity untouched.
	TouchPresence(ctx context.Context, userID, scenarioID, label string) error
	// Presences fetches presence for several users at once (colleague list).
	Presences(ctx context.Context, userIDs []string) (map[string]colleague.Presence, error)

	// Prefs returns sharing preferences, defaulting when no row exists.
	Prefs(ctx context.Context, userID string) (colleague.Prefs, error)
	SetPrefs(ctx context.Context, userID string, p colleague.Prefs) error
}
