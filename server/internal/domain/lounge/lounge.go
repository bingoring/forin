// Package lounge models the staff lounge: the app's first user-written content.
//
// A post is one of three KINDS, and the kind is not decoration — it is what the
// reader needs to know before reading the body:
//
//	talk     — anything about the road out (the default)
//	question — asking for help; the feed marks it so it can be answered
//	share    — quoting a conversation the learner actually had with an NPC
//
// The allowed set lives here rather than in a DB CHECK, which is this repository's
// rule for enum-ish columns: a fourth kind should cost a line of Go, not a migration.
//
// Two things this package refuses on purpose, both because the alternative is a lie
// on somebody else's screen:
//
//   - A `share` post whose quoted turns are not CONSECUTIVE. A snippet with a hole
//     in it reads as one exchange and is two, which misrepresents what the NPC said.
//   - A post over the length cap, or an empty one. The cap is small (the lounge is
//     notes between colleagues, not essays) and an empty post is a tap somebody made
//     by accident.
package lounge

import (
	"errors"
	"strings"
	"time"
	"unicode/utf8"
)

type Kind string

const (
	KindTalk     Kind = "talk"
	KindQuestion Kind = "question"
	KindShare    Kind = "share"
)

// AllowedKinds is the canonical set — validated in code, not by a DB CHECK.
var AllowedKinds = map[Kind]bool{KindTalk: true, KindQuestion: true, KindShare: true}

func (k Kind) Valid() bool { return AllowedKinds[k] }

const (
	// MaxBody is counted in RUNES, matching the client's counter: a byte cap would
	// tell a Korean writer they had used three characters after typing one.
	MaxBody = 600
	// MaxTags keeps the card readable; the row above the body is not a filing system.
	MaxTags = 4
	// MaxTagLen is per tag, again in runes.
	MaxTagLen = 20
	// MaxSnippetTurns — the handoff's ceiling for a shared exchange (07: 최대 6턴).
	// Past that the card is a transcript and nobody reads it in a feed.
	MaxSnippetTurns = 6
	// PostsPerDay is the rate limit. Not spam protection on its own — it is what
	// stops one account from filling every reader's feed before anyone notices.
	PostsPerDay = 20
	// FeedPage is how many posts one read returns.
	FeedPage = 20
	// MaxFeedPage caps what a client may ask for, so one request cannot pull the
	// whole table.
	MaxFeedPage = 50
)

var (
	ErrEmptyBody          = errors.New("lounge: post body is empty")
	ErrBodyTooLong        = errors.New("lounge: post body is too long")
	ErrTooManyTags        = errors.New("lounge: too many tags")
	ErrTagTooLong         = errors.New("lounge: tag is too long")
	ErrBadKind            = errors.New("lounge: unknown post kind")
	ErrGapInShare         = errors.New("lounge: shared turns are not consecutive")
	ErrTooManyTurns       = errors.New("lounge: too many shared turns")
	ErrShareNeedsScenario = errors.New("lounge: a shared post needs the scenario it came from")
	ErrRateLimited        = errors.New("lounge: daily post limit reached")
	ErrNotAuthor          = errors.New("lounge: not the author")
)

// Turn is one line of a quoted conversation. `Index` is the turn's position in the
// original session, which is what makes "consecutive" checkable at all.
type Turn struct {
	Index int    `json:"index"`
	Role  string `json:"role"`
	Text  string `json:"text"`
}

// Snippet is the quoted part of a conversation a `share` post carries.
type Snippet struct {
	Title string `json:"title,omitempty"`
	Turns []Turn `json:"turns"`
}

// Post is a lounge entry as the feed reads it: the post plus the author facts the
// card shows and the reader's own cheer state.
type Post struct {
	ID          string `json:"id"`
	AuthorID    string `json:"authorId"`
	AuthorName  string `json:"authorName"`
	AuthorJob   string `json:"authorJob,omitempty"`
	AuthorDest  string `json:"authorDestination,omitempty"`
	AuthorLevel int    `json:"authorLevel,omitempty"`
	// AuthorAvatar is the writer's NbAvatar spec, or nil when they never opened the
	// picker — the card then draws a face seeded from authorId, so a post always has
	// a person attached to it.
	AuthorAvatar map[string]string `json:"authorAvatar,omitempty"`
	Kind         Kind              `json:"kind"`
	Body         string            `json:"body"`
	Tags         []string          `json:"tags,omitempty"`
	ScenarioID   string            `json:"scenarioId,omitempty"`
	Snippet      *Snippet          `json:"snippet,omitempty"`
	Cheers       int               `json:"cheers"`
	Cheered      bool              `json:"cheered"`
	Mine         bool              `json:"mine"`
	CreatedAt    time.Time         `json:"createdAt"`
}

// Draft is what a client may send. Everything the server owns — author, time,
// counts — is absent on purpose.
type Draft struct {
	Kind       Kind
	Body       string
	Tags       []string
	ScenarioID string
	Snippet    *Snippet
}

// Clean trims a draft and rejects what cannot be stored, in the order a writer
// would notice: the kind, then the body, then the tags, then the quoted turns.
//
// Trimming happens BEFORE the empty check, so a post of three spaces is empty
// rather than a three-character post.
func (d Draft) Clean() (Draft, error) {
	out := d
	if out.Kind == "" {
		out.Kind = KindTalk
	}
	if !out.Kind.Valid() {
		return out, ErrBadKind
	}

	out.Body = strings.TrimSpace(out.Body)
	if out.Body == "" {
		return out, ErrEmptyBody
	}
	if utf8.RuneCountInString(out.Body) > MaxBody {
		return out, ErrBodyTooLong
	}

	tags := make([]string, 0, len(out.Tags))
	seen := map[string]bool{}
	for _, t := range out.Tags {
		t = strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(t), "#"))
		if t == "" || seen[t] {
			continue
		}
		if utf8.RuneCountInString(t) > MaxTagLen {
			return out, ErrTagTooLong
		}
		seen[t] = true
		tags = append(tags, t)
	}
	if len(tags) > MaxTags {
		return out, ErrTooManyTags
	}
	out.Tags = tags

	if out.Kind != KindShare {
		// A snippet on a post that is not a share would be quoted material with no
		// header saying where it came from — the card has nowhere to draw it.
		out.Snippet = nil
		out.ScenarioID = ""
		return out, nil
	}
	if out.Snippet == nil || len(out.Snippet.Turns) == 0 {
		return out, ErrGapInShare
	}
	if strings.TrimSpace(out.ScenarioID) == "" {
		return out, ErrShareNeedsScenario
	}
	if len(out.Snippet.Turns) > MaxSnippetTurns {
		return out, ErrTooManyTurns
	}
	if !Consecutive(out.Snippet.Turns) {
		return out, ErrGapInShare
	}
	return out, nil
}

// Consecutive reports whether the turns are a single unbroken run of the original
// conversation. One turn is trivially consecutive; a repeated index is not (it is
// the same line quoted twice, which is a hole by another name).
func Consecutive(turns []Turn) bool {
	for i := 1; i < len(turns); i++ {
		if turns[i].Index != turns[i-1].Index+1 {
			return false
		}
	}
	return true
}

// PageSize clamps what a client asked for into what the server will serve.
func PageSize(want int) int {
	if want <= 0 {
		return FeedPage
	}
	if want > MaxFeedPage {
		return MaxFeedPage
	}
	return want
}
