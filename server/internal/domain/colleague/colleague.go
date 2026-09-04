// Package colleague models invite-code based peer relationships: who is linked
// to whom, the invite codes that create those links, and the cheers they send.
//
// Relations are directed and stored as a mirrored pair (see ports.ColleagueRepo):
// A—B peer is (A,B,peer) + (B,A,peer); a mentor link is (mentee,mentor,mentor) +
// (mentor,mentee,mentee). Mentor/mentee are already modelled even though only
// peer links can be created today — the screens and data shape are the same, so
// the local-nurse mentor programme needs new data, not a new design.
package colleague

import (
	"crypto/rand"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"
)

// Relation is how the OTHER person relates to the link's owner: for owner A with
// relation "mentor", A's counterpart is A's mentor.
type Relation string

const (
	RelationPeer   Relation = "peer"
	RelationMentor Relation = "mentor"
	RelationMentee Relation = "mentee"
)

// AllowedRelations is the canonical set — validated in code, not by a DB CHECK,
// so adding a relation later needs no migration.
var AllowedRelations = map[Relation]bool{
	RelationPeer: true, RelationMentor: true, RelationMentee: true,
}

func (r Relation) Valid() bool { return AllowedRelations[r] }

// Mirror is the relation stored on the opposite row of the pair. Peer is
// symmetric; mentor and mentee are each other's mirror.
var Mirror = map[Relation]Relation{
	RelationPeer:   RelationPeer,
	RelationMentor: RelationMentee,
	RelationMentee: RelationMentor,
}

// RequestStatus tracks an invite-code request until the recipient answers.
type RequestStatus string

const (
	StatusPending   RequestStatus = "pending"
	StatusAccepted  RequestStatus = "accepted"
	StatusDeclined  RequestStatus = "declined"
	StatusCancelled RequestStatus = "cancelled"
)

// Preset is a canned cheer. The wording lives on the server so a client can't
// invent one — it sends the key, we own the text.
type Preset string

const (
	PresetWellDone Preset = "well_done"
	PresetFighting Preset = "fighting"
	PresetStreak   Preset = "streak"
	PresetRest     Preset = "rest"
)

// PresetText maps a preset to its Korean copy (handoff ScreenCheerCompose).
var PresetText = map[Preset]string{
	PresetWellDone: "잘하고 있어요",
	PresetFighting: "오늘도 화이팅",
	PresetStreak:   "연속 대단해요",
	PresetRest:     "무리하지 말아요",
}

// Limits from the handoff (invite card) and R-9/R-13.
const (
	CodeTTL         = 7 * 24 * time.Hour
	CodeMaxUses     = 10
	MaxColleagues   = 50
	MaxCheersPerDay = 5  // per recipient
	MaxMessageRunes = 60 // handoff shows a 60-char counter
)

// Link is one directed row of a colleague pair.
type Link struct {
	OwnerID   string    `json:"-"`
	OtherID   string    `json:"id"`
	Relation  Relation  `json:"relation"`
	CreatedAt time.Time `json:"createdAt"`
}

type InviteCode struct {
	Code      string    `json:"code"`
	UserID    string    `json:"-"`
	Relation  Relation  `json:"relation"`
	ExpiresAt time.Time `json:"expiresAt"`
	MaxUses   int       `json:"maxUses"`
	Uses      int       `json:"uses"`
}

// Usable reports whether a code can still create a request.
func (c *InviteCode) Usable(now time.Time) bool {
	return c != nil && now.Before(c.ExpiresAt) && c.Uses < c.MaxUses
}

type Request struct {
	ID         string        `json:"id"`
	FromUserID string        `json:"fromUserId"`
	ToUserID   string        `json:"toUserId"`
	Relation   Relation      `json:"relation"`
	Status     RequestStatus `json:"status"`
	CreatedAt  time.Time     `json:"createdAt"`
}

type Cheer struct {
	ID         string    `json:"id"`
	FromUserID string    `json:"fromUserId"`
	ToUserID   string    `json:"toUserId"`
	Preset     Preset    `json:"preset,omitempty"`
	PresetText string    `json:"presetText,omitempty"`
	Message    string    `json:"message,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	Read       bool      `json:"read"`
}

type Presence struct {
	LastSeenAt time.Time `json:"lastSeenAt"`
	ScenarioID string    `json:"scenarioId,omitempty"`
	Label      string    `json:"label,omitempty"`
}

type Prefs struct {
	ShareStatus bool `json:"shareStatus"`
	ShareWeekly bool `json:"shareWeekly"`
	// ShareWard governs the anonymous home live-ward crowd, which strangers can see —
	// a different audience from ShareStatus (accepted colleagues), so it is its own
	// switch. On by default; the figure is faceless-of-name, but a learner can still
	// choose not to appear at all.
	ShareWard bool `json:"shareWard"`
}

// DefaultPrefs — colleagues are mutually accepted, so sharing is on by default
// and can be turned off at any time. The ward is anonymous, so it too defaults on.
func DefaultPrefs() Prefs { return Prefs{ShareStatus: true, ShareWeekly: true, ShareWard: true} }

// ── invite codes ───────────────────────────────────────────────────────────

// codeAlphabet deliberately omits 0/O, 1/I/L and U so a code read aloud or typed
// from a screenshot can't be mistyped into a DIFFERENT valid code. 30^6 ≈ 729M.
const codeAlphabet = "23456789ABCDEFGHJKMNPQRSTVWXYZ"

// NewCode returns a random code in XX-XXXX form.
func NewCode() (string, error) {
	buf := make([]byte, 6)
	if _, err := rand.Read(buf); err != nil {
		return "", fmt.Errorf("colleague: random: %w", err)
	}
	out := make([]byte, 6)
	for i, b := range buf {
		out[i] = codeAlphabet[int(b)%len(codeAlphabet)]
	}
	return fmt.Sprintf("%s-%s", out[:2], out[2:]), nil
}

// NormalizeCode upper-cases, strips separators/spaces and re-inserts the hyphen.
// Returns "" when the input can't be a code — confusable characters were removed
// from the alphabet rather than silently remapped, so a typo stays a typo.
func NormalizeCode(in string) string {
	var sb strings.Builder
	for _, r := range strings.ToUpper(strings.TrimSpace(in)) {
		if strings.ContainsRune(codeAlphabet, r) {
			sb.WriteRune(r)
		}
	}
	s := sb.String()
	if len(s) != 6 {
		return ""
	}
	return s[:2] + "-" + s[2:]
}

// ValidateCheer checks a cheer before it is stored (R-7).
func ValidateCheer(preset Preset, message string) error {
	if preset != "" {
		if _, ok := PresetText[preset]; !ok {
			return fmt.Errorf("unknown preset")
		}
	}
	if utf8.RuneCountInString(message) > MaxMessageRunes {
		return fmt.Errorf("message too long")
	}
	if preset == "" && strings.TrimSpace(message) == "" {
		return fmt.Errorf("empty cheer")
	}
	return nil
}
