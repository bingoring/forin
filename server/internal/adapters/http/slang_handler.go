package http

import (
	"context"
	"net/http"
	"time"

	"github.com/bingoring/forin/server/internal/domain/home"
	"github.com/bingoring/forin/server/internal/domain/slang"
	"github.com/bingoring/forin/server/internal/i18n"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// slangHandler serves the 은어 도감: one card drops per local day, the learner collects it,
// and the deck comes entirely from content (content/slang), so it grows by server deploy.
type slangHandler struct {
	deck *slang.Deck
	repo ports.SlangRepo
}

type slangCardDTO struct {
	ID      string `json:"id"`
	Number  int    `json:"number"` // position in the deck (1-based), the "#007" on the card
	Code    string `json:"code"`
	Meaning string `json:"meaning"`
	Example string `json:"example,omitempty"`
	Hidden  bool   `json:"hidden,omitempty"`
}

type slangResp struct {
	CollectedCount   int            `json:"collectedCount"`
	Total            int            `json:"total"`
	MasterAt         int            `json:"masterAt"`
	Master           bool           `json:"master"`
	TodayCard        *slangCardDTO  `json:"todayCard,omitempty"`
	CollectableToday bool           `json:"collectableToday"`
	Collected        []slangCardDTO `json:"collected"`
}

func locFrom(r *http.Request) *time.Location {
	loc := time.UTC
	if tz := r.URL.Query().Get("tz"); tz != "" {
		if l, err := time.LoadLocation(tz); err == nil {
			loc = l
		}
	}
	return loc
}

func (h *slangHandler) dto(c slang.Card, locale string) slangCardDTO {
	return slangCardDTO{
		ID: c.ID, Number: h.deck.IndexOf(c.ID) + 1, Code: c.Code,
		Meaning: c.GlossFor(locale), Example: c.Example, Hidden: c.Hidden,
	}
}

// state builds the deck view for a user: the collected grid, and the featured card — the
// next uncollected one (collectable) unless one was already collected today.
func (h *slangHandler) state(ctx context.Context, uid, locale string, loc *time.Location) slangResp {
	collected, _ := h.repo.Collected(ctx, uid)
	count := len(collected)
	today := home.DayKey(time.Now(), loc)
	lastDate := ""
	if count > 0 {
		lastDate = home.DayKey(collected[count-1].CollectedAt, loc)
	}

	resp := slangResp{
		CollectedCount: count, Total: h.deck.Len(), MasterAt: slang.MasterTitleAt,
		Master: count >= slang.MasterTitleAt, Collected: []slangCardDTO{},
	}
	for _, cc := range collected {
		if card, ok := h.deck.ByID(cc.CardID); ok {
			resp.Collected = append(resp.Collected, h.dto(card, locale))
		}
	}

	idx := count
	resp.CollectableToday = true
	if lastDate == today && count > 0 {
		idx, resp.CollectableToday = count-1, false // already collected today: feature that card
	}
	if card, ok := h.deck.At(idx); ok {
		d := h.dto(card, locale)
		resp.TodayCard = &d
	} else {
		resp.CollectableToday = false // deck exhausted
	}
	return resp
}

// @Summary Slang deck (은어 도감)
// @Description Today's droppable card, whether it can be collected now, and the collected grid.
// @Tags slang
// @Security Bearer
// @Success 200 {object} slangResp
// @Router /slang [get]
func (h *slangHandler) get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	httpx.JSON(w, http.StatusOK, h.state(ctx, uid, i18n.FromContext(ctx), locFrom(r)))
}

// @Summary Collect today's slang card
// @Description Collects the next card, at most once per local day. The server chooses the card; the body is ignored.
// @Tags slang
// @Security Bearer
// @Success 200 {object} slangResp
// @Router /slang/collect [post]
func (h *slangHandler) collect(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	loc := locFrom(r)

	collected, _ := h.repo.Collected(ctx, uid)
	count := len(collected)
	today := home.DayKey(time.Now(), loc)
	lastDate := ""
	if count > 0 {
		lastDate = home.DayKey(collected[count-1].CollectedAt, loc)
	}
	// One per day, and the server picks which card — the client cannot skip ahead.
	if lastDate != today {
		if card, ok := h.deck.At(count); ok {
			_ = h.repo.Collect(ctx, uid, card.ID)
		}
	}
	httpx.JSON(w, http.StatusOK, h.state(ctx, uid, i18n.FromContext(ctx), locFrom(r)))
}
