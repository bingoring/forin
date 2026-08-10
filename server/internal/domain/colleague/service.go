package colleague

import (
	"context"
	"errors"
	"time"
)

// Repo is the persistence port this service needs. It mirrors ports.ColleagueRepo;
// declaring it here keeps the domain free of an import cycle.
type Repo interface {
	ActiveCode(ctx context.Context, userID string) (*InviteCode, error)
	SaveCode(ctx context.Context, c InviteCode) error
	CodeOwner(ctx context.Context, code string) (*InviteCode, error)

	Links(ctx context.Context, userID string) ([]Link, error)
	Linked(ctx context.Context, userID, otherID string) (bool, error)
	LinkCount(ctx context.Context, userID string) (int, error)

	PendingRequest(ctx context.Context, fromID, toID string) (*Request, error)
	CreateRequest(ctx context.Context, r Request, code string) error
	AcceptRequest(ctx context.Context, requestID, byUserID string) (*Request, error)

	AddCheer(ctx context.Context, c *Cheer) error
	CheersToday(ctx context.Context, fromID, toID string, since time.Time) (int, error)
}

// Errors the HTTP layer maps to status codes.
var (
	ErrSelfLink     = errors.New("colleague: cannot add yourself")
	ErrCodeInvalid  = errors.New("colleague: code not found or expired")
	ErrNotLinked    = errors.New("colleague: not linked")
	ErrLimitReached = errors.New("colleague: colleague limit reached")
	ErrCheerLimit   = errors.New("colleague: cheer limit reached")
)

type Service struct{ repo Repo }

func NewService(repo Repo) *Service { return &Service{repo: repo} }

// EnsureCode returns the caller's active invite code, minting one when there is
// none (or when rotate forces a fresh one). Rotating revokes the previous code so
// exactly one code is ever "mine" (INV-5).
func (s *Service) EnsureCode(ctx context.Context, userID string, rotate bool) (*InviteCode, error) {
	if !rotate {
		if c, err := s.repo.ActiveCode(ctx, userID); err != nil {
			return nil, err
		} else if c != nil {
			return c, nil
		}
	}
	code, err := NewCode()
	if err != nil {
		return nil, err
	}
	c := InviteCode{
		Code: code, UserID: userID, Relation: RelationPeer,
		ExpiresAt: time.Now().Add(CodeTTL), MaxUses: CodeMaxUses,
	}
	if err := s.repo.SaveCode(ctx, c); err != nil {
		return nil, err
	}
	return &c, nil
}

// AddResult reports what happened when a code was redeemed. All four outcomes are
// successes from the caller's point of view — the UI shows different copy, not an
// error, because "you already asked" is a state, not a failure.
type AddResult struct {
	OwnerID          string `json:"colleagueId"`
	Requested        bool   `json:"requested,omitempty"`
	AlreadyLinked    bool   `json:"alreadyLinked,omitempty"`
	AlreadyRequested bool   `json:"alreadyRequested,omitempty"`
	AutoAccepted     bool   `json:"autoAccepted,omitempty"`
}

// RedeemCode turns an invite code into a colleague request — or into a finished
// link when the other person had already requested us (R-6: both sides clearly
// want this, so making them wait for a second tap is pointless ceremony).
func (s *Service) RedeemCode(ctx context.Context, userID, rawCode string) (*AddResult, error) {
	code := NormalizeCode(rawCode)
	if code == "" {
		return nil, ErrCodeInvalid
	}
	rec, err := s.repo.CodeOwner(ctx, code)
	if err != nil {
		return nil, err
	}
	if rec == nil || !rec.Usable(time.Now()) {
		return nil, ErrCodeInvalid
	}
	owner := rec.UserID
	if owner == userID {
		return nil, ErrSelfLink
	}

	linked, err := s.repo.Linked(ctx, userID, owner)
	if err != nil {
		return nil, err
	}
	if linked {
		return &AddResult{OwnerID: owner, AlreadyLinked: true}, nil
	}
	if err := s.checkCap(ctx, userID); err != nil {
		return nil, err
	}

	// They asked us first → accept instead of creating a mirror-image request.
	if inbound, err := s.repo.PendingRequest(ctx, owner, userID); err != nil {
		return nil, err
	} else if inbound != nil {
		if _, err := s.repo.AcceptRequest(ctx, inbound.ID, userID); err != nil {
			return nil, err
		}
		return &AddResult{OwnerID: owner, AutoAccepted: true}, nil
	}

	if outbound, err := s.repo.PendingRequest(ctx, userID, owner); err != nil {
		return nil, err
	} else if outbound != nil {
		return &AddResult{OwnerID: owner, AlreadyRequested: true}, nil
	}

	req := Request{FromUserID: userID, ToUserID: owner, Relation: rec.Relation, Status: StatusPending}
	if err := s.repo.CreateRequest(ctx, req, code); err != nil {
		return nil, err
	}
	return &AddResult{OwnerID: owner, Requested: true}, nil
}

// Accept links the pair, refusing when either side is already at the cap.
func (s *Service) Accept(ctx context.Context, requestID, userID string) (*Request, error) {
	if err := s.checkCap(ctx, userID); err != nil {
		return nil, err
	}
	return s.repo.AcceptRequest(ctx, requestID, userID)
}

// SendCheer validates and stores a cheer for a linked colleague.
func (s *Service) SendCheer(ctx context.Context, fromID, toID string, preset Preset, message string) (*Cheer, error) {
	linked, err := s.repo.Linked(ctx, fromID, toID)
	if err != nil {
		return nil, err
	}
	if !linked {
		return nil, ErrNotLinked
	}
	if err := ValidateCheer(preset, message); err != nil {
		return nil, err
	}
	// Rate limit is per recipient per rolling 24h — a burst of encouragement to one
	// person reads as pestering, while cheering several colleagues does not.
	since := time.Now().Add(-24 * time.Hour)
	n, err := s.repo.CheersToday(ctx, fromID, toID, since)
	if err != nil {
		return nil, err
	}
	if n >= MaxCheersPerDay {
		return nil, ErrCheerLimit
	}
	c := &Cheer{FromUserID: fromID, ToUserID: toID, Preset: preset, Message: message}
	if err := s.repo.AddCheer(ctx, c); err != nil {
		return nil, err
	}
	c.PresetText = PresetText[preset]
	return c, nil
}

func (s *Service) checkCap(ctx context.Context, userID string) error {
	n, err := s.repo.LinkCount(ctx, userID)
	if err != nil {
		return err
	}
	if n >= MaxColleagues {
		return ErrLimitReached
	}
	return nil
}
