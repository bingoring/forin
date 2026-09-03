// Package http is the HTTP adapter: stdlib net/http router, middleware, handlers.
package http

import (
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/colleague"
	"github.com/bingoring/forin/server/internal/domain/conversation"
	"github.com/bingoring/forin/server/internal/domain/home"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/ports"
)

// Deps are the dependencies the HTTP layer needs (wired in main).
type Deps struct {
	Env           string // dev | staging | prod — gates dev-only routes
	DevAuthSecret string // gates POST /auth/dev outside dev; empty in prod
	Log           *slog.Logger
	Tokens        *auth.TokenService
	AuthSvc       *auth.Service
	Users         ports.UserRepo
	Content       ports.ContentReader
	Progress      ports.ProgressRepo
	Review        ports.ReviewRepo
	Convo         *conversation.Engine
	Pron          *pronunciation.Service
	Speech        *speech.Service         // pronunciation-attempt persistence + history + reference (Task 5)
	Synth         ports.SpeechSynthesizer // TTS for listen-quiz audio (optional)
	// PronunciationEnabled mirrors Azure Speech's configuredness (business-rules
	// §5) — surfaced on GET /config/economy, see economyConfigResp's doc comment.
	PronunciationEnabled bool
	Colleague            ports.ColleagueRepo // colleague links, cheers, presence
	Lounge               ports.LoungeRepo    // staff-lounge posts, cheers, reports
	HomePools            home.Pools          // authored mentor notes + field phrases
	PG                   *pgxpool.Pool
	Redis                *redis.Client
}

// NewRouter builds the application handler with global middleware and routes.
func NewRouter(d Deps) http.Handler {
	mux := http.NewServeMux()

	h := &health{pg: d.PG, redis: d.Redis}
	mux.HandleFunc("GET /healthz", h.live)
	mux.HandleFunc("GET /readyz", h.ready)

	ah := &authHandler{svc: d.AuthSvc, log: d.Log, env: d.Env, devSecret: d.DevAuthSecret}
	mux.HandleFunc("POST /auth/social", ah.social)
	mux.HandleFunc("POST /auth/refresh", ah.refresh)
	// Registered only where the bypass is deliberately enabled: local dev, or an
	// environment that was given DEV_AUTH_SECRET (staging, for the smoke test).
	// The `d.Env != "prod"` guard is a second, independent lock on top of
	// devAccessAllowed's own unconditional prod refusal — a stray
	// DEV_AUTH_SECRET in a prod env block must not even register the route,
	// let alone pass the handler's check.
	if d.Env != "prod" && (d.Env == "dev" || d.DevAuthSecret != "") {
		mux.HandleFunc("POST /auth/dev", ah.dev)
	}

	// Authenticated routes.
	auth := requireAuth(d.Tokens)
	// Public, but better when it knows who is asking — see optionalAuth.
	maybeAuth := optionalAuth(d.Tokens)
	mux.Handle("POST /auth/logout", auth(http.HandlerFunc(ah.logout)))
	mh := &meHandler{users: d.Users}
	mux.Handle("GET /me", auth(http.HandlerFunc(mh.me)))
	mux.Handle("PATCH /me/profile", auth(http.HandlerFunc(mh.updateProfile)))
	mux.Handle("PATCH /me/title", auth(http.HandlerFunc(mh.equipTitle)))
	mux.Handle("PATCH /me/ui-lang", auth(http.HandlerFunc(mh.setUILang)))
	mux.Handle("PATCH /me/display-name", auth(http.HandlerFunc(mh.setDisplayName)))
	mux.Handle("PATCH /me/avatar", auth(http.HandlerFunc(mh.setAvatar)))

	// Content (public read).
	ch := &contentHandler{content: d.Content, progress: d.Progress, pronunciationEnabled: d.PronunciationEnabled}
	mux.HandleFunc("GET /content/manifest", ch.manifest)
	mux.HandleFunc("GET /departments", ch.departments)
	mux.HandleFunc("GET /interiors/{id}", ch.interior)
	mux.HandleFunc("GET /events", ch.events)
	mux.Handle("GET /scenarios/{id}", maybeAuth(http.HandlerFunc(ch.scenario)))
	mux.HandleFunc("GET /quizzes/{id}", ch.quiz)
	qa := &quizAudioHandler{content: d.Content, synth: d.Synth}
	mux.HandleFunc("GET /quizzes/{id}/audio.wav", qa.audio)
	mux.HandleFunc("GET /quizzes/{id}/audio-meta", qa.meta)
	mux.HandleFunc("GET /board/today", ch.board)
	mux.HandleFunc("GET /config/economy", ch.economyConfig)
	mux.Handle("GET /me/route", auth(http.HandlerFunc(ch.mainRoute)))
	mux.Handle("GET /me/situations", auth(http.HandlerFunc(ch.deptSituations)))
	mux.Handle("GET /me/daily-board", auth(http.HandlerFunc(ch.dailyBoard)))
	mux.Handle("POST /me/daily-board/topup", auth(http.HandlerFunc(ch.dailyBoardTopUp)))

	// Progress + review (authenticated).
	ph := &progressHandler{progress: d.Progress, review: d.Review}
	mux.Handle("GET /me/progress", auth(http.HandlerFunc(ph.get)))
	mux.Handle("GET /me/stats", auth(http.HandlerFunc(ph.stats)))
	mux.Handle("GET /me/calendar", auth(http.HandlerFunc(ph.calendar)))
	mux.Handle("GET /me/curriculum", auth(http.HandlerFunc(ph.curriculum)))
	mux.Handle("GET /me/missions", auth(http.HandlerFunc(ph.missions)))
	mux.Handle("POST /me/missions/{id}", auth(http.HandlerFunc(ph.recordMission)))
	mux.Handle("POST /attempts", auth(http.HandlerFunc(ph.attempt)))
	mux.Handle("GET /me/review", auth(http.HandlerFunc(ph.due)))
	mux.Handle("POST /me/review/{id}/grade", auth(http.HandlerFunc(ph.grade)))
	// 시나리오 모범답안 — the summary block in Review Lab and its full list.
	// The summary route is registered before the bare one so it is not swallowed
	// by it; net/http's mux picks the more specific pattern regardless, but the
	// order also documents which is which.
	mux.Handle("GET /me/review/model-answers/summary", auth(http.HandlerFunc(ph.modelAnswerSummary)))
	mux.Handle("GET /me/review/model-answers", auth(http.HandlerFunc(ph.modelAnswers)))

	// Access — what this learner may enter (kept out of the cached interior payload).
	acc := &accessHandler{content: d.Content, progress: d.Progress, users: d.Users}
	mux.Handle("GET /me/access/{interiorId}", auth(http.HandlerFunc(acc.interior)))

	// Home tab — one aggregated response (see homeHandler).
	hh := &homeHandler{progress: d.Progress, review: d.Review, content: d.Content,
		users: d.Users, colleague: d.Colleague, pools: d.HomePools}
	mux.Handle("GET /me/home", auth(http.HandlerFunc(hh.get)))
	mux.Handle("POST /me/home/page/answer", auth(http.HandlerFunc(hh.answerPage)))

	// Colleagues (authenticated).
	if d.Colleague != nil {
		cl := &colleagueHandler{svc: colleague.NewService(d.Colleague), repo: d.Colleague,
			users: d.Users, progress: d.Progress}
		mux.Handle("POST /me/invite-code", auth(http.HandlerFunc(cl.inviteCode)))
		mux.Handle("GET /invite/{code}", auth(http.HandlerFunc(cl.lookup)))
		mux.Handle("GET /me/colleagues", auth(http.HandlerFunc(cl.list)))
		mux.Handle("POST /me/colleagues", auth(http.HandlerFunc(cl.add)))
		mux.Handle("GET /me/colleagues/{id}", auth(http.HandlerFunc(cl.detail)))
		mux.Handle("DELETE /me/colleagues/{id}", auth(http.HandlerFunc(cl.remove)))
		mux.Handle("POST /me/colleagues/{id}/cheers", auth(http.HandlerFunc(cl.cheer)))
		mux.Handle("GET /me/cheers", auth(http.HandlerFunc(cl.inbox)))
		mux.Handle("GET /me/colleague-requests", auth(http.HandlerFunc(cl.requests)))
		mux.Handle("POST /me/colleague-requests/{id}/accept", auth(http.HandlerFunc(cl.accept)))
		mux.Handle("POST /me/colleague-requests/{id}/decline", auth(http.HandlerFunc(cl.decline)))
		mux.Handle("GET /me/colleague-prefs", auth(http.HandlerFunc(cl.prefs)))
		mux.Handle("PATCH /me/colleague-prefs", auth(http.HandlerFunc(cl.prefs)))
	}

	// Staff lounge (authenticated). Nil when the repo is not wired — the routes
	// simply do not exist then, rather than 500-ing on a missing dependency.
	if d.Lounge != nil {
		lg := &loungeHandler{repo: d.Lounge}
		mux.Handle("GET /lounge", auth(http.HandlerFunc(lg.feed)))
		mux.Handle("POST /lounge", auth(http.HandlerFunc(lg.create)))
		mux.Handle("DELETE /lounge/{id}", auth(http.HandlerFunc(lg.remove)))
		mux.Handle("POST /lounge/{id}/cheer", auth(http.HandlerFunc(lg.cheer)))
		// Every screen that shows somebody else's words needs a way to flag them
		// (App Store review guideline 1.2 asks for exactly this).
		mux.Handle("POST /lounge/{id}/report", auth(http.HandlerFunc(lg.report)))
	}

	// AI conversation + correction (authenticated).
	conv := &conversationHandler{engine: d.Convo, progress: d.Progress, content: d.Content, colleague: d.Colleague}
	mux.Handle("POST /scenarios/{id}/conversation", auth(http.HandlerFunc(conv.start)))
	// Lets the client offer "이어서 대화" instead of silently orphaning the
	// previous conversation every time a scenario is opened.
	mux.Handle("GET /scenarios/{id}/conversation/last", auth(http.HandlerFunc(conv.resumable)))
	mux.Handle("POST /conversation/{sessionId}/message", auth(http.HandlerFunc(conv.message)))
	mux.Handle("GET /conversation/{sessionId}/choices", auth(http.HandlerFunc(conv.choices)))
	mux.Handle("POST /conversation/{sessionId}/stream", auth(http.HandlerFunc(conv.stream)))
	mux.Handle("POST /conversation/{sessionId}/complete", auth(http.HandlerFunc(conv.complete)))
	mux.Handle("POST /conversation/{sessionId}/discard", auth(http.HandlerFunc(conv.discard)))
	mux.Handle("POST /correct", auth(http.HandlerFunc(conv.correct)))

	// Pronunciation assessment (authenticated).
	pron := &pronunciationHandler{svc: d.Pron, speech: d.Speech, review: d.Review}
	mux.Handle("POST /pronunciation", auth(http.HandlerFunc(pron.assess)))
	mux.Handle("POST /stt", auth(http.HandlerFunc(pron.transcribe)))

	// Pronunciation practice: canonical reference + a user's own attempt
	// history for a sentence (Task 5; recording stays on POST /pronunciation
	// above, which already existed).
	sh := &speechHandler{svc: d.Speech, pron: d.Pron}
	mux.Handle("GET /speech/reference", auth(http.HandlerFunc(sh.reference)))
	mux.Handle("GET /speech/attempts", auth(http.HandlerFunc(sh.attempts)))
	// The comprehensive speech read-back for one dialogue run (Scenario Clear)
	// and its two Review Lab aggregates (직접 말하기 연습 block + full list).
	mux.Handle("GET /conversation/{sessionId}/speech-review", auth(http.HandlerFunc(sh.sessionReview)))
	mux.Handle("GET /speech/summary", auth(http.HandlerFunc(sh.speakSummary)))
	mux.Handle("GET /speech/sentences", auth(http.HandlerFunc(sh.spokenSentences)))
	// The reference sentence's synthesized audio (Task 11 — see
	// speech_audio_handler.go's doc for why this closes a real gap: "🔊
	// 원어민"/"0.5× 느리게" had no route to call).
	sa := &speechAudioHandler{speech: d.Speech, convo: d.Convo}
	mux.Handle("GET /speech/reference/audio.wav", auth(http.HandlerFunc(sa.audio)))
	// Reads the session's latest NPC line aloud in the persona's voice. Session
	// scoped so the text always comes from a stored turn, never from the client.
	mux.Handle("GET /conversation/{sessionId}/speech.wav", auth(http.HandlerFunc(sa.npcSpeech)))

	// Global middleware (outermost first).
	return chain(mux,
		recoverMW(d.Log),
		requestLog(d.Log),
		cors,
		localeMW,
		rateLimit(rate.Limit(20), 40),
	)
}
