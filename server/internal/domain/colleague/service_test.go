package colleague

import (
	"context"
	"errors"
	"testing"
	"time"
)

// fakeRepo is an in-memory Repo — enough to exercise the service's decisions
// without a database.
type fakeRepo struct {
	code      *InviteCode
	saved     []InviteCode
	linked    map[string]bool // "a|b"
	linkCount int
	pending   map[string]*Request // "from|to"
	accepted  []string
	cheers    []Cheer
	cheersNow int
}

func newFake() *fakeRepo {
	return &fakeRepo{linked: map[string]bool{}, pending: map[string]*Request{}}
}

func key(a, b string) string { return a + "|" + b }

func (f *fakeRepo) ActiveCode(context.Context, string) (*InviteCode, error) { return f.code, nil }
func (f *fakeRepo) SaveCode(_ context.Context, c InviteCode) error {
	f.saved = append(f.saved, c)
	f.code = &c
	return nil
}
func (f *fakeRepo) CodeOwner(_ context.Context, code string) (*InviteCode, error) {
	if f.code != nil && f.code.Code == code {
		return f.code, nil
	}
	return nil, nil
}
func (f *fakeRepo) Links(context.Context, string) ([]Link, error) { return nil, nil }
func (f *fakeRepo) Linked(_ context.Context, a, b string) (bool, error) {
	return f.linked[key(a, b)], nil
}
func (f *fakeRepo) LinkCount(context.Context, string) (int, error) { return f.linkCount, nil }
func (f *fakeRepo) PendingRequest(_ context.Context, from, to string) (*Request, error) {
	return f.pending[key(from, to)], nil
}
func (f *fakeRepo) CreateRequest(_ context.Context, r Request, _ string) error {
	r.ID = "req-" + r.FromUserID
	f.pending[key(r.FromUserID, r.ToUserID)] = &r
	return nil
}
func (f *fakeRepo) AcceptRequest(_ context.Context, id, by string) (*Request, error) {
	f.accepted = append(f.accepted, id)
	return &Request{ID: id, ToUserID: by, Status: StatusAccepted}, nil
}
func (f *fakeRepo) AddCheer(_ context.Context, c Cheer) error {
	f.cheers = append(f.cheers, c)
	return nil
}
func (f *fakeRepo) CheersToday(context.Context, string, string, time.Time) (int, error) {
	return f.cheersNow, nil
}

func liveCode(owner string) *InviteCode {
	return &InviteCode{Code: "K7-N4XQ", UserID: owner, Relation: RelationPeer,
		ExpiresAt: time.Now().Add(time.Hour), MaxUses: 10, Uses: 0}
}

func TestEnsureCodeReusesActiveCode(t *testing.T) {
	f := newFake()
	f.code = liveCode("me")
	svc := NewService(f)

	got, err := svc.EnsureCode(context.Background(), "me", false)
	if err != nil {
		t.Fatal(err)
	}
	if got.Code != "K7-N4XQ" {
		t.Fatalf("expected the existing code, got %q", got.Code)
	}
	if len(f.saved) != 0 {
		t.Fatalf("an existing active code must not be replaced (saved %d)", len(f.saved))
	}
}

func TestEnsureCodeRotates(t *testing.T) {
	f := newFake()
	f.code = liveCode("me")
	svc := NewService(f)

	got, err := svc.EnsureCode(context.Background(), "me", true)
	if err != nil {
		t.Fatal(err)
	}
	if got.Code == "K7-N4XQ" {
		t.Fatal("rotate must mint a new code")
	}
	if len(f.saved) != 1 {
		t.Fatalf("rotate must persist exactly one new code, got %d", len(f.saved))
	}
	if f.saved[0].MaxUses != CodeMaxUses || !f.saved[0].ExpiresAt.After(time.Now()) {
		t.Fatal("a minted code must carry the handoff's 10-use / 7-day limits")
	}
}

func TestRedeemCodeRejectsSelf(t *testing.T) {
	f := newFake()
	f.code = liveCode("me")
	svc := NewService(f)

	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); !errors.Is(err, ErrSelfLink) {
		t.Fatalf("expected ErrSelfLink, got %v", err)
	}
}

func TestRedeemCodeRejectsUnknownAndExpired(t *testing.T) {
	f := newFake()
	svc := NewService(f)
	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); !errors.Is(err, ErrCodeInvalid) {
		t.Fatalf("unknown code: expected ErrCodeInvalid, got %v", err)
	}

	expired := liveCode("owner")
	expired.ExpiresAt = time.Now().Add(-time.Minute)
	f.code = expired
	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); !errors.Is(err, ErrCodeInvalid) {
		t.Fatalf("expired code: expected ErrCodeInvalid, got %v", err)
	}

	used := liveCode("owner")
	used.Uses = used.MaxUses
	f.code = used
	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); !errors.Is(err, ErrCodeInvalid) {
		t.Fatalf("used-up code: expected ErrCodeInvalid, got %v", err)
	}
}

func TestRedeemCodeCreatesRequest(t *testing.T) {
	f := newFake()
	f.code = liveCode("owner")
	svc := NewService(f)

	res, err := svc.RedeemCode(context.Background(), "me", "k7n4xq") // unnormalized on purpose
	if err != nil {
		t.Fatal(err)
	}
	if !res.Requested || res.AutoAccepted || res.AlreadyLinked {
		t.Fatalf("expected a plain request, got %+v", res)
	}
	if f.pending[key("me", "owner")] == nil {
		t.Fatal("request was not stored")
	}
}

func TestRedeemCodeAutoAcceptsInboundRequest(t *testing.T) {
	// The owner already asked us; redeeming their code should finish the link
	// rather than queue a mirror-image request (R-6).
	f := newFake()
	f.code = liveCode("owner")
	f.pending[key("owner", "me")] = &Request{ID: "req-owner", FromUserID: "owner", ToUserID: "me", Status: StatusPending}
	svc := NewService(f)

	res, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ")
	if err != nil {
		t.Fatal(err)
	}
	if !res.AutoAccepted {
		t.Fatalf("expected auto-accept, got %+v", res)
	}
	if len(f.accepted) != 1 || f.accepted[0] != "req-owner" {
		t.Fatalf("expected the inbound request to be accepted, got %v", f.accepted)
	}
}

func TestRedeemCodeIsIdempotentishOnRepeat(t *testing.T) {
	f := newFake()
	f.code = liveCode("owner")
	svc := NewService(f)

	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); err != nil {
		t.Fatal(err)
	}
	res, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ")
	if err != nil {
		t.Fatalf("a repeat redeem is a state, not an error: %v", err)
	}
	if !res.AlreadyRequested {
		t.Fatalf("expected alreadyRequested, got %+v", res)
	}
}

func TestRedeemCodeReportsExistingLink(t *testing.T) {
	f := newFake()
	f.code = liveCode("owner")
	f.linked[key("me", "owner")] = true
	svc := NewService(f)

	res, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ")
	if err != nil {
		t.Fatal(err)
	}
	if !res.AlreadyLinked {
		t.Fatalf("expected alreadyLinked, got %+v", res)
	}
}

func TestRedeemCodeEnforcesColleagueCap(t *testing.T) {
	f := newFake()
	f.code = liveCode("owner")
	f.linkCount = MaxColleagues
	svc := NewService(f)

	if _, err := svc.RedeemCode(context.Background(), "me", "K7-N4XQ"); !errors.Is(err, ErrLimitReached) {
		t.Fatalf("expected ErrLimitReached, got %v", err)
	}
}

func TestSendCheerRequiresLink(t *testing.T) {
	f := newFake()
	svc := NewService(f)
	if _, err := svc.SendCheer(context.Background(), "me", "stranger", PresetWellDone, ""); !errors.Is(err, ErrNotLinked) {
		t.Fatalf("expected ErrNotLinked, got %v", err)
	}
}

func TestSendCheerRateLimit(t *testing.T) {
	f := newFake()
	f.linked[key("me", "buddy")] = true
	f.cheersNow = MaxCheersPerDay
	svc := NewService(f)

	if _, err := svc.SendCheer(context.Background(), "me", "buddy", PresetFighting, ""); !errors.Is(err, ErrCheerLimit) {
		t.Fatalf("expected ErrCheerLimit, got %v", err)
	}
}

func TestSendCheerStoresPresetText(t *testing.T) {
	f := newFake()
	f.linked[key("me", "buddy")] = true
	svc := NewService(f)

	c, err := svc.SendCheer(context.Background(), "me", "buddy", PresetStreak, "축하해요")
	if err != nil {
		t.Fatal(err)
	}
	if c.PresetText != PresetText[PresetStreak] {
		t.Fatalf("preset copy must come from the server, got %q", c.PresetText)
	}
	if len(f.cheers) != 1 {
		t.Fatalf("cheer was not stored")
	}
}
