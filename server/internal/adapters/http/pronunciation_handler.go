package http

import (
	"encoding/base64"
	"errors"
	"log/slog"
	"net/http"
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	"github.com/bingoring/forin/server/internal/content/phonemetips"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// maxReferenceTextLen is business-rules §2's validation cap on referenceText,
// counted in runes (not bytes, via utf8.RuneCountInString) — a Korean or
// Japanese sentence well under 300 characters can be well over 300 bytes, and
// len() on a Go string counts bytes.
const maxReferenceTextLen = 300

// maxRequestBodyBytes bounds the whole POST /pronunciation JSON body. A
// base64-encoded 1MB WAV (ValidateWAV's own cap) inflates to ~1.37MB on the
// wire; this leaves generous headroom over that for the rest of the JSON
// envelope without leaving the body unbounded.
const maxRequestBodyBytes = 4 << 20 // 4MiB

// reviewCardIDFormat is a canonical-UUID shape check (review_cards.id is a
// Postgres `uuid` column — db/migrations/000003_progress.up.sql). Checking
// this BEFORE calling GetCardForUser means a malformed id is rejected as a
// client input error (400) instead of reaching Postgres, which would reject
// it as 22P02 (invalid_text_representation) and come back as an opaque 500 —
// a scored attempt would then be lost over what is really a validation bug.
var reviewCardIDFormat = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)

type pronunciationHandler struct {
	svc *pronunciation.Service
	// speech records the attempt (Task 5): scoring stays behind svc.Assess
	// (used by /stt below and internally by speech.Record), persistence is
	// new here.
	speech *speech.Service
	// review is used only to check reviewCardId ownership (business-rules §2)
	// — this handler does not otherwise read/write review cards.
	review ports.ReviewRepo
}

// @Summary Assess pronunciation of recorded audio vs a reference phrase (Azure), and persist the attempt
// @Tags pronunciation
// @Security Bearer
// @Param body body pronounceReq true "base64 WAV (16kHz mono PCM) + reference text + optional origin/scenarioId/reviewCardId"
// @Success 200 {object} pronounceResp
// @Router /pronunciation [post]
func (h *pronunciationHandler) assess(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodyBytes)

	var req pronounceReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.ReferenceText == "" || req.AudioBase64 == "" {
		httpx.Error(w, http.StatusBadRequest, "referenceText and audioBase64 are required")
		return
	}
	if utf8.RuneCountInString(req.ReferenceText) > maxReferenceTextLen {
		httpx.Error(w, http.StatusBadRequest, "invalid_reference_text")
		return
	}
	audio, err := base64.StdEncoding.DecodeString(req.AudioBase64)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is not valid base64")
		return
	}
	// business-rules §2: WAV(RIFF PCM16) 16kHz mono, <=1MB, <=10s (R6).
	if err := speech.ValidateWAV(audio); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid_audio")
		return
	}

	// business-rules §2: reviewCardId, if given, must belong to the caller.
	// An empty string is normalized to "no card" (same as omitted) rather
	// than forwarded — Record/the repo would otherwise try to use "" as a
	// review_card_id. A non-empty value that isn't even UUID-shaped is
	// rejected as a client error before ever reaching the repo (see
	// reviewCardIDFormat's doc). Only a well-formed id that resolves to
	// someone else's card (or no card at all) is a 403 — GetCardForUser
	// already filters by (userID, cardID), so "someone else's" and "no such
	// card" both come back nil and are treated alike.
	if req.ReviewCardID != nil && *req.ReviewCardID == "" {
		req.ReviewCardID = nil
	}
	if req.ReviewCardID != nil {
		if !reviewCardIDFormat.MatchString(*req.ReviewCardID) {
			httpx.Error(w, http.StatusBadRequest, "invalid_review_card_id")
			return
		}
		card, err := h.review.GetCardForUser(r.Context(), uid, *req.ReviewCardID)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "could not verify review card")
			return
		}
		if card == nil {
			httpx.Error(w, http.StatusForbidden, "reviewCardId does not belong to you")
			return
		}
	}

	// Existing mobile clients never send origin at all; defaulting it here
	// (rather than leaving it to domain/speech's unknown-origin fallback)
	// avoids a "downgraded to freeform" warning log on every single legacy
	// call — the fallback in domain/speech.Record still guards truly unknown
	// values from any client.
	origin := req.Origin
	if origin == "" {
		origin = "freeform"
	}

	rec, err := h.speech.Record(r.Context(), uid, audio, req.ReferenceText, speech.RecordOptions{
		ScenarioID:   req.ScenarioID,
		ReviewCardID: req.ReviewCardID,
		Origin:       origin,
	})
	if err != nil {
		if errors.Is(err, azurespeech.ErrNoSpeech) {
			httpx.Error(w, http.StatusUnprocessableEntity, "no_speech_detected")
			return
		}
		httpx.Error(w, http.StatusBadGateway, "pronunciation assessment unavailable")
		return
	}
	// rec.PersistErr means Assess already succeeded (Azure already paid for,
	// I4) but the storage write failed afterward. That must not become a
	// failure response to the learner who just spoke for up to 10 seconds —
	// answer 200 with the real score and an empty attemptId/0 attemptNo
	// (nothing was actually stored), and only warn in the logs.
	if rec.PersistErr != nil {
		slog.Warn("pronunciation: attempt scored but not persisted, returning score anyway", "err", rec.PersistErr, "userID", uid)
	}

	httpx.JSON(w, http.StatusOK, pronounceResp{
		PronunciationResult: rec.Result,
		AttemptID:           rec.ID,
		AttemptNo:           rec.AttemptNo,
		PhonemeTips:         phonemeTipsFor(rec.Result),
	})
}

// phonemeTipDTO is the wire shape of one phoneme's Korean coaching —
// deliberately a subset of phonemetips.Tip: Message is what the SoT's
// correction card actually renders (screen-pronunciation.jsx L199-200) and
// IPA is the phoneme's own dictionary spelling (the package doc's own
// warning: NOT the syllable ipa the card shows — the mobile client already
// assembles that from PhonemeResult/SyllableResult). Detail/Example exist in
// the content package for a future drill screen (out of this task's scope,
// SoT L221-274) and are left off the wire until something reads them —
// shipping unused fields invites drift between the DTO and what actually
// renders.
type phonemeTipDTO struct {
	IPA     string `json:"ipa"`
	Message string `json:"message"`
}

// phonemeTipsFor builds the deduplicated phoneme->tip map Task 11 adds to
// POST /pronunciation's response (task-11-brief.md item ①: content/
// phonemetips existed but nothing imported it, so the result screen's
// correction points were permanently empty).
//
// Design judgment (task-11-brief.md's first open question): inlined here
// rather than served from a separate endpoint — the practice screen needs
// this exactly once per scored attempt and never independently of a score,
// so a second round trip would only add latency for no reuse. The map is
// keyed by the RAW phoneme spelling as it appears in Words[*].Phonemes[*]
// (not renormalized) so the mobile client can index straight into it with
// the same string buildCorrectionPoints already carries per candidate —
// content/phonemetips is the only thing that should be interpreting phoneme
// notation (its own package doc), so normalization happens once, here, via
// Lookup, never reimplemented in TypeScript.
//
// One entry per DISTINCT phoneme, not one per occurrence — a single sentence
// repeats phonemes constantly ("acetaminophen" alone has three schwas), and
// Message/Detail/Example text is identical for every occurrence of the same
// sound, so shipping it once instead of per-position measurably shrinks the
// response instead of growing it with word count.
//
// business-rules R5: a phoneme with no mapped tip is left out of the map
// entirely — never a fabricated or empty entry.
func phonemeTipsFor(res *ports.PronunciationResult) map[string]phonemeTipDTO {
	if res == nil {
		return nil
	}
	var out map[string]phonemeTipDTO
	for _, w := range res.Words {
		for _, p := range w.Phonemes {
			if _, seen := out[p.Phoneme]; seen {
				continue
			}
			tip, ok := phonemetips.Lookup(p.Phoneme)
			if !ok {
				continue
			}
			if out == nil {
				out = make(map[string]phonemeTipDTO)
			}
			out[p.Phoneme] = phonemeTipDTO{IPA: tip.IPA, Message: tip.Message}
		}
	}
	return out
}

type pronounceReq struct {
	ReferenceText string `json:"referenceText"`
	AudioBase64   string `json:"audioBase64"`
	// Origin/ScenarioID/ReviewCardID are all optional and new in Task 5 —
	// existing clients that omit them get origin="freeform", no scenario,
	// no linked card (business-rules §2, domain-entities §4).
	Origin       string  `json:"origin,omitempty"`
	ScenarioID   string  `json:"scenarioId,omitempty"`
	ReviewCardID *string `json:"reviewCardId,omitempty"`
}

// pronounceResp embeds every field POST /pronunciation returned before Task 5
// (via the embedded *ports.PronunciationResult, whose fields promote to the
// top level in JSON) and adds the two new bookkeeping fields. Existing mobile
// clients that only read the old fields are unaffected.
type pronounceResp struct {
	*ports.PronunciationResult
	AttemptID string `json:"attemptId"`
	AttemptNo int    `json:"attemptNo"`
	// PhonemeTips is new in Task 11 — see phonemeTipsFor's doc for the shape
	// and dedup rationale. omitempty: a scored attempt with no words at all
	// (or no phoneme with a mapped tip) sends no field rather than `{}`.
	PhonemeTips map[string]phonemeTipDTO `json:"phonemeTips,omitempty"`
}

// @Summary Transcribe recorded audio to text (dictation, Azure STT)
// @Tags pronunciation
// @Security Bearer
// @Param body body sttReq true "base64 WAV (16kHz mono PCM)"
// @Router /stt [post]
func (h *pronunciationHandler) transcribe(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req sttReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.AudioBase64 == "" {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is required")
		return
	}
	audio, err := base64.StdEncoding.DecodeString(req.AudioBase64)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is not valid base64")
		return
	}
	text, err := h.svc.Transcribe(r.Context(), uid, audio)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "speech-to-text unavailable")
		return
	}

	out := sttResp{Text: text}
	if score := h.scoreDictation(r, uid, audio, text, req); score != nil {
		out.Overall, out.Accuracy, out.Fluency = score.Overall, score.Accuracy, score.Fluency
		out.Scored = true
	}
	httpx.JSON(w, http.StatusOK, out)
}

// scoreDictation scores a dialogue utterance so the Scenario Clear screen and
// the Review Lab have per-sentence numbers to review. It returns nil when there
// is nothing to score or scoring failed — a dialogue turn must never fail
// because the review pipeline did.
//
// The reference text is the RECOGNIZED text, which is the only reference free
// dialogue can have: the player chose their own words, so there is no script to
// compare against. Azure then scores how clearly each of those words was
// pronounced against that word's canonical pronunciation — which is the question
// the review answers ("how well did I say what I said"), not a circular one.
// Completeness is meaningless under this arrangement (the reference is by
// construction exactly what was heard) and the review screens do not show it.
//
// Scoring is skipped entirely outside a dialogue: without a sessionId there is
// no run to attribute the utterance to, and paying for a second Azure call per
// dictation with nowhere to file the result is pure cost.
func (h *pronunciationHandler) scoreDictation(r *http.Request, uid string, audio []byte, text string, req sttReq) *ports.PronunciationResult {
	if h.speech == nil || req.SessionID == "" || strings.TrimSpace(text) == "" {
		return nil
	}
	res, err := h.speech.Record(r.Context(), uid, audio, text, speech.RecordOptions{
		Origin: "dialogue", ScenarioID: req.ScenarioID, SessionID: req.SessionID,
	})
	if err != nil {
		// Includes ErrNoSpeech, which STT already contradicted by returning
		// text — either way the turn proceeds with no score attached.
		slog.Warn("stt: utterance transcribed but not scored", "err", err, "sessionID", req.SessionID)
		return nil
	}
	return res.Result
}

type sttReq struct {
	AudioBase64 string `json:"audioBase64"`
	// SessionID/ScenarioID are optional: present when the audio came from a
	// dialogue turn, in which case the utterance is also scored and filed under
	// that run. Absent for any other dictation.
	SessionID  string `json:"sessionId,omitempty"`
	ScenarioID string `json:"scenarioId,omitempty"`
}

// sttResp carries the transcript plus, for a dialogue turn, that utterance's
// score. scored distinguishes "0 points" from "not scored", which zero values
// alone cannot.
type sttResp struct {
	Text     string  `json:"text"`
	Scored   bool    `json:"scored"`
	Overall  float64 `json:"overall,omitempty"`
	Accuracy float64 `json:"accuracy,omitempty"`
	Fluency  float64 `json:"fluency,omitempty"`
}
