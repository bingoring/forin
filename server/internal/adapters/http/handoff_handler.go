package http

import (
	"net/http"
	"strings"
	"time"

	"github.com/bingoring/forin/server/internal/domain/handoff"
	"github.com/bingoring/forin/server/internal/i18n"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

// handoffHandler serves 환자 인수인계 노트: the inbox (generating a new note on open), marking
// read, and replying (which brings a reply back from the patient).
type handoffHandler struct{ svc *handoff.Service }

type handoffNoteDTO struct {
	ID            string `json:"id"`
	Kind          string `json:"kind"`
	PatientName   string `json:"patientName"`
	PatientSub    string `json:"patientSub,omitempty"`
	Coord         string `json:"coord,omitempty"`
	Body          string `json:"body"`
	RefScenarioID string `json:"refScenarioId,omitempty"`
	ReplyText     string `json:"replyText,omitempty"`
	PatientReply  string `json:"patientReply,omitempty"`
	MetAt         string `json:"metAt"`
	Read          bool   `json:"read"`
	Replied       bool   `json:"replied"`
}

type handoffResp struct {
	Notes  []handoffNoteDTO `json:"notes"`
	Unread int              `json:"unread"`
}

func handoffDTO(n handoff.Note) handoffNoteDTO {
	return handoffNoteDTO{
		ID: n.ID, Kind: string(n.Kind), PatientName: n.PatientName, PatientSub: n.PatientSub,
		Coord: n.Coord, Body: n.Body, RefScenarioID: n.RefScenarioID, ReplyText: n.ReplyText,
		PatientReply: n.PatientReply, MetAt: n.MetAt.Format(time.RFC3339),
		Read: n.ReadAt != nil, Replied: n.RepliedAt != nil,
	}
}

// @Summary Handoff notes (환자 인수인계 노트)
// @Description The follow-up inbox; opening it may generate one new note from a recent encounter.
// @Tags handoff
// @Security Bearer
// @Success 200 {object} handoffResp
// @Router /handoff [get]
func (h *handoffHandler) get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	notes, unread, err := h.svc.Inbox(ctx, uid, i18n.FromContext(ctx))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load notes")
		return
	}
	dtos := make([]handoffNoteDTO, 0, len(notes))
	for _, n := range notes {
		dtos = append(dtos, handoffDTO(n))
	}
	httpx.JSON(w, http.StatusOK, handoffResp{Notes: dtos, Unread: unread})
}

// @Summary Mark a handoff note read
// @Tags handoff
// @Security Bearer
// @Router /handoff/{id}/read [post]
func (h *handoffHandler) read(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	_ = h.svc.MarkRead(ctx, uid, r.PathValue("id"))
	w.WriteHeader(http.StatusNoContent)
}

type handoffReplyReq struct {
	Text string `json:"text"`
}

// @Summary Reply to a handoff note
// @Description Stores the learner's reply and returns the note with the patient's reply back.
// @Tags handoff
// @Security Bearer
// @Success 200 {object} handoffNoteDTO
// @Router /handoff/{id}/reply [post]
func (h *handoffHandler) reply(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	var req handoffReplyReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	text := strings.TrimSpace(req.Text)
	if text == "" {
		httpx.Error(w, http.StatusBadRequest, "empty reply")
		return
	}
	if rs := []rune(text); len(rs) > 300 {
		text = string(rs[:300])
	}
	n, err := h.svc.Reply(ctx, uid, r.PathValue("id"), text, i18n.FromContext(ctx))
	if err != nil || n == nil {
		httpx.Error(w, http.StatusNotFound, "note not found")
		return
	}
	httpx.JSON(w, http.StatusOK, handoffDTO(*n))
}
