package http

import (
	"net/http"
	"strconv"
	"time"

	"github.com/bingoring/forin/server/internal/domain/night"
	"github.com/bingoring/forin/server/internal/i18n"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

// nightHandler serves 오늘 밤의 이야기 for the night radio. The story rotates daily; the
// client passes `i` to page to the next one (다음 이야기). The night-only time gate is a
// client concern — the story is served whenever asked.
type nightHandler struct{ stories *night.Stories }

type nightStoryDTO struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Body     string `json:"body"`
	KeyLine  string `json:"keyLine"`
	KeyGloss string `json:"keyGloss"`
}

type nightResp struct {
	Total int            `json:"total"`
	Index int            `json:"index"`
	Story *nightStoryDTO `json:"story,omitempty"`
}

// @Summary Tonight's story (오늘 밤의 이야기)
// @Description A rotating night-shift story with one English line to practice; `i` offsets from today's for 다음 이야기.
// @Tags night
// @Security Bearer
// @Success 200 {object} nightResp
// @Router /night [get]
func (h *nightHandler) get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	locale := i18n.FromContext(ctx)
	loc := locFrom(r)

	off := 0
	if q := r.URL.Query().Get("i"); q != "" {
		if n, err := strconv.Atoi(q); err == nil {
			off = n
		}
	}

	total := h.stories.Len()
	resp := nightResp{Total: total}
	if total == 0 {
		httpx.JSON(w, http.StatusOK, resp)
		return
	}
	// A stable "today's story" from the local day, plus the client's offset.
	base := int(time.Now().In(loc).Unix() / 86400)
	idx := base + off
	if st, ok := h.stories.At(idx); ok {
		resp.Index = ((idx % total) + total) % total
		resp.Story = &nightStoryDTO{
			ID: st.ID, Title: st.TitleFor(locale), Body: st.BodyFor(locale),
			KeyLine: st.KeyLine, KeyGloss: st.KeyGlossFor(locale),
		}
	}
	httpx.JSON(w, http.StatusOK, resp)
}
