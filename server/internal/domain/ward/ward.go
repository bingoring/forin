// Package ward turns raw live-ward presence into the roster the home screen draws: the
// people currently studying, shown as an anonymous crowd of figures.
//
// Two rules shape it. The viewer never sees themselves in the roster (the app draws the
// learner's own figure on top, client-side), and no one is ever named — a Member carries a
// non-reversible id and a face, nothing that says who they are. Presence itself lives in a
// Store (a Redis sorted set in production); this package is the policy over it.
package ward

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/bingoring/forin/server/internal/domain/avatar"
)

// Store is the presence backend: who was seen, and when.
type Store interface {
	Touch(ctx context.Context, userID string, at time.Time) error
	Leave(ctx context.Context, userID string) error
	// Recent evicts anyone last seen before cutoff, then returns up to limit user ids,
	// most-recently-seen first.
	Recent(ctx context.Context, cutoff time.Time, limit int64) ([]string, error)
}

// Avatars reads saved portraits for many users in one call.
type Avatars interface {
	Avatars(ctx context.Context, userIDs []string) (map[string]avatar.Spec, error)
}

// Member is one anonymous figure: a stable, non-reversible id and the face to draw.
type Member struct {
	ID     string      `json:"id"`
	Avatar avatar.Spec `json:"avatar,omitempty"`
}

// Cap is the most figures a ward ever shows; the viewer's own is drawn on top of these.
const Cap = 10

// Service is the roster policy over a presence Store.
type Service struct {
	store   Store
	avatars Avatars
	ttl     time.Duration
	now     func() time.Time
}

// NewService wires the policy. ttl is how long a presence survives without a heartbeat.
func NewService(store Store, avatars Avatars, ttl time.Duration) *Service {
	return &Service{store: store, avatars: avatars, ttl: ttl, now: time.Now}
}

// Touch records the caller as present now — unless they have hidden themselves from the
// ward, in which case they may still watch but never appear.
func (s *Service) Touch(ctx context.Context, userID string, hidden bool) error {
	if hidden {
		return nil
	}
	return s.store.Touch(ctx, userID, s.now())
}

// Leave removes the caller immediately (the app went to the background or closed).
func (s *Service) Leave(ctx context.Context, userID string) error {
	return s.store.Leave(ctx, userID)
}

// Roster is who ELSE is in the ward right now: the most-recently-active people, capped,
// never the viewer, each anonymised and wearing their saved face.
func (s *Service) Roster(ctx context.Context, viewerID string) ([]Member, error) {
	cutoff := s.now().Add(-s.ttl)
	// One past the cap, because the viewer may be among the recent set and gets dropped.
	ids, err := s.store.Recent(ctx, cutoff, int64(Cap)+1)
	if err != nil {
		return nil, err
	}
	others := make([]string, 0, len(ids))
	for _, id := range ids {
		if id == viewerID {
			continue
		}
		others = append(others, id)
		if len(others) >= Cap {
			break
		}
	}
	out := make([]Member, 0, len(others))
	if len(others) == 0 {
		return out, nil
	}
	// A face per figure. If the lookup fails, presence is still a ward — the client seeds
	// a face from the id — so a read error here is not fatal to the roster.
	faces, err := s.avatars.Avatars(ctx, others)
	if err != nil {
		faces = nil
	}
	for _, id := range others {
		out = append(out, Member{ID: anonID(id), Avatar: faces[id]})
	}
	return out, nil
}

// anonID is a stable, non-reversible handle. The client needs the same key across polls to
// animate a figure in and out; a stranger must not be able to recover who it is.
func anonID(userID string) string {
	sum := sha256.Sum256([]byte(userID))
	return hex.EncodeToString(sum[:6])
}
