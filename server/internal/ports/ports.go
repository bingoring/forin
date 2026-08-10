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
	// GrowthStats aggregates activity for the growth report. dayStart/weekStart are
	// the period lower bounds (already computed in tzName); ActiveDates are bucketed
	// as calendar dates in tzName (an IANA zone, e.g. "Asia/Seoul") over the week.
	GrowthStats(ctx context.Context, userID string, dayStart, weekStart time.Time, tzName string) (*progress.GrowthStats, error)
	// ClearedScenarioIDs returns the set of scenario ids the user has cleared.
	ClearedScenarioIDs(ctx context.Context, userID string) (map[string]bool, error)
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

// WordScore is a per-word pronunciation result.
type WordScore struct {
	Word      string  `json:"word"`
	Accuracy  float64 `json:"accuracy"`
	ErrorType string  `json:"errorType,omitempty"`
}

// PronunciationResult is the assessment of a spoken utterance vs a reference text.
type PronunciationResult struct {
	Recognized   string      `json:"recognized"`
	Accuracy     float64     `json:"accuracy"`
	Fluency      float64     `json:"fluency"`
	Completeness float64     `json:"completeness"`
	Overall      float64     `json:"overall"`
	Words        []WordScore `json:"words,omitempty"`
}

// PronunciationPort scores spoken audio against a reference (Azure etc.) and
// transcribes plain speech-to-text.
type PronunciationPort interface {
	Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*PronunciationResult, error)
	Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error)
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
type ConversationTurn struct{ Role, Content string }

// ConversationRepo persists dialogue sessions and turns.
type ConversationRepo interface {
	CreateSession(ctx context.Context, userID, scenarioID string) (string, error)
	GetSession(ctx context.Context, sessionID string) (*ConversationSession, error)
	AppendTurn(ctx context.Context, sessionID, role, content string) error
	History(ctx context.Context, sessionID string, limit int) ([]ConversationTurn, error)
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
