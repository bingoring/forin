package http

import (
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// defaultAttemptsLimit mirrors business-rules R3: the practice screen's
// history strip renders the most recent 3 attempts. maxAttemptsLimit is a
// ceiling so a client can't ask for an unbounded history dump — no rule
// specifies one, so this is a defensive default, not a spec'd number.
const (
	defaultAttemptsLimit = 3
	maxAttemptsLimit     = 50
)

// speechHandler serves the read-only pronunciation-practice endpoints:
// the canonical per-sentence reference (GET /speech/reference) and a user's
// own attempt history for a sentence (GET /speech/attempts). Recording a new
// attempt stays on POST /pronunciation (pronunciation_handler.go) — that
// route already existed in production before this task.
type speechHandler struct {
	svc *speech.Service
	// pron resolves the caller's locale so this handler can derive the same
	// sentence_key Record/Reference use (business-rules §2: "locale는 서버가
	// 프로필에서 파생한다. 클라이언트가 보내지 않는다") — domain/speech.History takes an
	// already-computed sentenceKey, so this layer computes it exactly the way
	// domain/speech.Reference does internally, from the same LocaleFor call.
	pron *pronunciation.Service
}

// @Summary Canonical syllable/phoneme reference for a sentence (TTS-derived, cached globally per business-rules R9)
// @Tags pronunciation
// @Security Bearer
// @Param text query string true "sentence text to derive the reference for"
// @Success 200 {object} ports.SentenceReferenceRow
// @Router /speech/reference [get]
func (h *speechHandler) reference(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	text := r.URL.Query().Get("text")
	if text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}
	// business-rules §2's cap (same as POST /pronunciation's referenceText) —
	// review round 2, Important 4: an unauthenticated-in-spirit text length
	// cap here bounds how much Synthesize+Assess cost one caller can trigger
	// via arbitrary `text` values, each landing a new, never-invalidated
	// speech_references row (R9).
	if utf8.RuneCountInString(text) > maxReferenceTextLen {
		httpx.Error(w, http.StatusBadRequest, "invalid_reference_text")
		return
	}

	ref, err := h.svc.Reference(r.Context(), uid, text)
	if err != nil {
		// business-rules §5 "참조 생성(TTS→assess) 실패": every failure mode here —
		// a DB read error, ErrTTSNotConfigured, ErrUnsupportedLocale, or a
		// Synthesize/Assess error — is handled identically, per the Task 4
		// reviewer's call-out. Log it and answer 200 with the reference
		// omitted rather than failing the practice-screen request outright:
		// the screen just hides the IPA line and native waveform when this
		// is absent (business-logic-model §2) — recording/scoring still work.
		slog.Warn("speech: reference unavailable, practice continues without it", "err", err)
		httpx.JSON(w, http.StatusOK, map[string]any{})
		return
	}
	httpx.JSON(w, http.StatusOK, ref)
}

// @Summary Recent attempt history for a sentence, oldest first (business-rules R3: screen renders the last 3)
// @Tags pronunciation
// @Security Bearer
// @Param text query string true "sentence text — the server derives sentenceKey from text+locale (business-rules §2); clients cannot compute or send it directly"
// @Param limit query int false "max attempts to return, default 3"
// @Success 200 {array} ports.SpeechAttemptRow
// @Router /speech/attempts [get]
func (h *speechHandler) attempts(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	text := r.URL.Query().Get("text")
	if text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}

	limit := defaultAttemptsLimit
	if q := r.URL.Query().Get("limit"); q != "" {
		if n, err := strconv.Atoi(q); err == nil && n > 0 {
			limit = n
		}
	}
	if limit > maxAttemptsLimit {
		limit = maxAttemptsLimit
	}

	locale := h.pron.LocaleFor(r.Context(), uid)
	key := speech.SentenceKey(text, locale)

	rows, err := h.svc.History(r.Context(), uid, key, limit)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load attempt history")
		return
	}
	if rows == nil {
		rows = []ports.SpeechAttemptRow{}
	}
	httpx.JSON(w, http.StatusOK, rows)
}

// spokenListLimit is the page size the 직접 말하기 연습 list asks for when it
// sends none. The handoff's soft count ("128문장 중 24개 표시") implies pages
// well under the total, and infinite scroll fetches again as the user reaches
// the bottom, so a small page keeps the first paint fast.
const spokenListLimit = 20

// sessionReviewResp is the Scenario Clear read-back (04_SCREENS ⑤ → ⑨): the
// sentences spoken in the run that just ended, the run average, and the two
// weakest for the 다시 연습 button.
//
// average is sent as a number, not a pre-formatted badge string: the badge's
// rounding is a display decision and the client's locale owns it.
type sessionReviewResp struct {
	Sentences []ports.SpokenSentenceRow `json:"sentences"`
	Average   float64                   `json:"average"`
	Weakest   []ports.SpokenSentenceRow `json:"weakest"`
}

// @Summary Comprehensive review of the sentences spoken aloud during one dialogue run
// @Tags pronunciation
// @Security Bearer
// @Param sessionId path string true "conversation session id"
// @Success 200 {object} sessionReviewResp
// @Router /conversation/{sessionId}/speech-review [get]
func (h *speechHandler) sessionReview(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	sessionID := r.PathValue("sessionId")
	if sessionID == "" {
		httpx.Error(w, http.StatusBadRequest, "sessionId is required")
		return
	}
	// No separate ownership check: the query is scoped to (user_id, session_id),
	// so another user's session id simply reads as a run with no sentences.
	rev, err := h.svc.SessionSpeechReview(r.Context(), uid, sessionID)
	if err != nil {
		slog.Error("speech: session review failed", "err", err, "sessionID", sessionID)
		httpx.Error(w, http.StatusInternalServerError, "could not load the speech review")
		return
	}
	httpx.JSON(w, http.StatusOK, sessionReviewResp{
		Sentences: nonNil(rev.Sentences), Average: rev.Average, Weakest: nonNil(rev.Weakest),
	})
}

// speakSummaryResp is the Review Lab 🎙 직접 말하기 연습 block: band counts plus
// the most urgent sentences only.
type speakSummaryResp struct {
	Total   int                       `json:"total"`
	Low     int                       `json:"low"`
	Mid     int                       `json:"mid"`
	High    int                       `json:"high"`
	Weakest []ports.SpokenSentenceRow `json:"weakest"`
}

// @Summary Score-band summary of everything the player has spoken aloud (Review Lab 직접 말하기 연습 block)
// @Tags pronunciation
// @Security Bearer
// @Success 200 {object} speakSummaryResp
// @Router /speech/summary [get]
func (h *speechHandler) speakSummary(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	sum, err := h.svc.SpeakSummary(r.Context(), uid)
	if err != nil {
		slog.Error("speech: speak summary failed", "err", err)
		httpx.Error(w, http.StatusInternalServerError, "could not load the speaking summary")
		return
	}
	httpx.JSON(w, http.StatusOK, speakSummaryResp{
		Total: sum.Bands.Total, Low: sum.Bands.Low, Mid: sum.Bands.Mid, High: sum.Bands.High,
		Weakest: nonNil(sum.Weakest),
	})
}

// spokenSentencesResp pairs the page with the UNPAGED total, which the list's
// "N문장 중 M개 표시" line needs and infinite scroll cannot derive from the page.
type spokenSentencesResp struct {
	Sentences []ports.SpokenSentenceRow `json:"sentences"`
	// Total counts the sentences that match the CURRENT filter, not the whole bank:
	// the list's count line reads "N문장 중 M개 표시", and reporting an unfiltered
	// total there said "3 of 128" for a filter that matched 3.
	Total int `json:"total"`
	// Depts is every department the learner has spoken in, regardless of the filter or
	// how far they have scrolled. Sent so the chip row is complete and stable —
	// deriving it from the loaded pages made chips appear mid-scroll.
	Depts []string `json:"depts"`
}

// @Summary One page of every sentence the player has spoken aloud (ScreenSpeakList)
// @Tags pronunciation
// @Security Bearer
// @Param sort query string false "weak (약한 순, default), high (높은 순) or recent (최신)"
// @Param q query string false "substring of the sentence to match (case-insensitive)"
// @Param dept query string false "department code (ER, ICU, …); omit for every department"
// @Param limit query int false "page size, default 20, clamped to 100"
// @Param offset query int false "rows to skip"
// @Success 200 {object} spokenSentencesResp
// @Router /speech/sentences [get]
func (h *speechHandler) spokenSentences(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	// One of "weak" (약한 순, the default), "high" (높은 순) or "recent" (최신).
	// An unrecognized value falls back to "weak" — the list opens on what needs
	// work, and a typo must not silently reorder the screen.
	sort := r.URL.Query().Get("sort")
	if sort != "high" && sort != "recent" {
		sort = "weak"
	}
	limit := spokenListLimit
	if v := r.URL.Query().Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			limit = n // domain clamps; see speech.SpokenSentences
		}
	}
	offset := 0
	if v := r.URL.Query().Get("offset"); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			offset = n
		}
	}
	// Uppercased so a chip tapped as "er" still matches SCN-ER-*; the codes are
	// upper-case by construction.
	dept := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("dept")))
	// 문장 검색. Trimmed, and NOT uppercased — the match is case-insensitive in SQL,
	// and upper-casing it here would only make the parameter unreadable in a log.
	// Over-long input is cut rather than rejected: a paste into the search line is
	// not an error, it just cannot match anything past a sentence's length.
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	if len(q) > 120 {
		q = q[:120]
	}
	rows, total, err := h.svc.SpokenSentences(r.Context(), uid, sort, dept, q, limit, offset)
	if err != nil {
		slog.Error("speech: spoken sentence list failed", "err", err)
		httpx.Error(w, http.StatusInternalServerError, "could not load your spoken sentences")
		return
	}
	// Best-effort: without the chip row the list still works, filtered or not.
	depts, _ := h.svc.SpokenDepartments(r.Context(), uid)
	if depts == nil {
		depts = []string{}
	}
	httpx.JSON(w, http.StatusOK, spokenSentencesResp{Sentences: nonNil(rows), Total: total, Depts: depts})
}

// nonNil turns a nil slice into an empty one so the JSON says [] rather than
// null. A client that maps over the field should not have to guard for both.
func nonNil(rows []ports.SpokenSentenceRow) []ports.SpokenSentenceRow {
	if rows == nil {
		return []ports.SpokenSentenceRow{}
	}
	return rows
}
