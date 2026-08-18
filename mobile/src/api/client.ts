// API client — an axios instance wrapped in a small module so the HTTP library
// is swappable (1-3 decision: no direct fetch). Endpoint/response types come from
// the generated contract (packages/contract), keeping mobile↔server type-safe.
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { saveTokens } from '@/lib/secureStore';
import type { paths } from '@contract/types';
import type { Interior } from '@engine';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const http: AxiosInstance = axios.create({ baseURL, timeout: 30_000 });

// Attach the access token to every request.
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: rotate the refresh token once and retry; if that fails, log out.
let refreshing: Promise<string | null> | null = null;

async function rotate(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      const rt = useAuthStore.getState().refreshToken;
      try {
        if (rt) {
          // raw axios (no interceptors) to avoid recursion
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
          const pair = data as TokenPair;
          if (pair.accessToken && pair.refreshToken) {
            useAuthStore.setState({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
            await saveTokens(pair.accessToken, pair.refreshToken);
            return pair.accessToken;
          }
        }
        throw new Error('refresh unavailable');
      } catch {
        // In dev, a missing/stale refresh token shouldn't strand the session:
        // silently re-run the dev login (server registers /auth/dev only in dev).
        if (__DEV__) {
          try {
            const { data } = await axios.post(`${baseURL}/auth/dev`, {});
            const pair = (data as { tokens?: TokenPair })?.tokens;
            if (pair?.accessToken && pair?.refreshToken) {
              useAuthStore.setState({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
              await saveTokens(pair.accessToken, pair.refreshToken);
              return pair.accessToken;
            }
          } catch { /* fall through to logout */ }
        }
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const is401 = error?.response?.status === 401;
    if (is401 && original && !original._retry && !original.url?.includes('/auth/refresh')) {
      original._retry = true;
      const token = await rotate();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      }
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

// --- types extracted from the generated contract ---
type SocialLoginBody =
  paths['/auth/social']['post']['requestBody'] extends { content: { 'application/json': infer B } } ? B : never;
type LoginResp = paths['/auth/social']['post']['responses'][200]['content']['application/json'];
type TokenPair = paths['/auth/refresh']['post']['responses'][200]['content']['application/json'];
type MeResp = paths['/me']['get']['responses'][200]['content']['application/json'];
type Manifest = paths['/content/manifest']['get']['responses'][200]['content']['application/json'];

// --- scenario + conversation types (GET /scenarios/{id} is untyped in the
// contract, so we mirror the server content.Scenario json tags here). ---
export interface ScenarioPersona {
  name?: string; role?: string; ageRange?: string; personality?: string;
  speakingStyle?: string; mood?: string; sub?: string; hair?: string; hairStyle?: string;
}
export interface ScenarioReward { icon: string; label: string; value: string }
export interface ScenarioReq { label: string; metric?: string; threshold?: number }
export interface ScenarioChart { vitals?: QuizVital[]; meds?: string[]; allergies?: string; notes?: string }
export interface ScenarioBriefing {
  dept?: string; deptColor?: string; brief?: string; difficulty?: number; timeLabel?: string;
  skills?: string[]; rewards?: ScenarioReward[]; reqs?: ScenarioReq[]; tone?: string; accent?: string;
  chart?: ScenarioChart; riskyPhrases?: string[];
}
export interface ScenarioStep {
  id: string; type: string; next?: string;
  payload?: { quizId?: string; speaker?: string; expression?: string; lineEn?: string; lineKo?: string; [k: string]: unknown };
}
export interface ScenarioDetail {
  id: string; profession: string; eventId: string; title: string; tagline: string;
  persona: ScenarioPersona; goals?: string[]; guardrails?: string[]; keyPhrases?: string[];
  briefing?: ScenarioBriefing; steps?: ScenarioStep[];
}

export interface QuizPair { left: string; leftSub?: string; right: string; rightIcon?: string }
export interface QuizChoice { text: string; ko?: string; tags?: string[]; correct?: boolean }
export interface QuizCard { text: string; track: string; order: number }
export interface QuizItem { text: string; ko?: string; correct?: boolean }
export interface QuizReading { num: string; unit?: string; color?: string; label: string }
export interface QuizContent {
  sub?: string; zone?: string; context?: string; hint?: string;
  template?: string; answers?: string[]; wordBank?: string[];
  pairs?: QuizPair[];
  audioText?: string; choices?: QuizChoice[];
  cards?: QuizCard[];
  scene?: string; note?: string; items?: QuizItem[];
  device?: string; readings?: QuizReading[]; bank?: string[];
  given?: { label: string; value: string }[]; eq?: string; answer?: string; answerUnit?: string;
  pool?: string[]; buckets?: { name: string; color?: string; items: string[] }[];
  gauge?: { min: number; max: number; start: number; target: number; step: number; unit?: string };
  rows?: { label: string; text: string; error?: boolean }[];
  deck?: { term: string; options: string[]; answer: string }[];
  // triage (ESI decision)
  patient?: QuizPatient; correctLevel?: number; reasoning?: QuizReason[];
  // calc (dosage worksheet)
  order?: QuizOrder; vial?: QuizVial; desired?: string; onHand?: string; perQty?: string; dhqUnit?: string; syringeMax?: number; secondCheck?: string;
  // listen (waveform)
  duration?: string; glossary?: QuizGloss[];
  // anatomy (body labeling): dots at x/y % of the body card + their correct label
  bodyDots?: { x: number; y: number; label: string }[];
}
export interface QuizVital { label: string; value: string; unit?: string; warn?: boolean }
export interface QuizObs { text: string; warn?: boolean }
export interface QuizPatient { age?: string; sex?: string; arrival?: string; cc?: string; vitals?: QuizVital[]; obs?: QuizObs[] }
export interface QuizReason { kind: string; text: string }
export interface QuizOrder { id?: string; prescriber?: string; time?: string; patient?: string; drug?: string }
export interface QuizVial { drug?: string; concentration?: string; size?: string }
export interface QuizGloss { abbr: string; meaning: string }
export interface QuizDetail {
  id: string; profession: string; type: string; title: string; content?: QuizContent;
}

// Listen-quiz dictation audio metadata (server: GET /quizzes/{id}/audio-meta).
// waveform is a 0..100 RMS amplitude envelope of the real synthesized clip.
export interface QuizAudioMeta { waveform: number[]; durationMs: number; url: string; }

export interface BoardCard {
  id: string; dept: string; title: string; tagline: string; urgency: string; deptColor?: string;
  difficulty?: number; room?: string; npcName?: string; npcSub?: string; skills?: string[]; timeLabel?: string;
}

// A department-scoped situation card (server: GET /me/situations?dept=).
export interface DeptSituation {
  scenarioId: string; name: string; room?: string;
  lv: string; min: number; tag: string; urgent: boolean;
}

// Chapter/step curriculum with per-user progress (server: GET /me/curriculum).
export interface CurriculumStep {
  kind: 'dlg' | 'quiz' | 'event' | 'boss';
  name: string; scenarioId?: string;
  state: 'done' | 'now' | 'lock' | 'optional'; // optional = bonus quiz (doesn't gate)
  optional?: boolean;
}
export interface CurriculumChapter {
  ch: number; name: string; dept: string; done: number; total: number;
  state: 'done' | 'now' | 'lock'; next?: string; steps?: CurriculumStep[];
}

// One node of the main-route curriculum graph (server: GET /me/route).
export interface RouteNode {
  eventId: string; title: string; tier: number;
  state: 'locked' | 'available' | 'completed';
  scenarioId?: string; prerequisites?: string[];
}

// Syllable/phoneme spans as scored by Azure, in 100-ns ticks from the start of
// the audio (offset/duration). Both are optional per business-rules R10: an
// older/degraded response may carry a word's accuracy without this detail.
export interface SyllableScore { syllable: string; grapheme?: string; accuracy: number; offset?: number; duration?: number }
export interface PhonemeScore { phoneme: string; accuracy: number; offset?: number; duration?: number }
export interface WordScore {
  word: string; accuracy: number; errorType?: string;
  syllables?: SyllableScore[]; phonemes?: PhonemeScore[];
}
export interface PronunciationResult {
  recognized: string; accuracy: number; fluency: number; completeness: number; overall: number;
  // Prosody (억양) only arrives when Azure scored it (locale + config
  // dependent) — prosodyAvailable distinguishes "scored 0" from "not scored"
  // (business-logic-model §2, ScoreBars.tsx).
  prosody?: number; prosodyAvailable?: boolean;
  // DurationMS is the recorded clip's length in ms (server computes it from
  // the WAV it received; Azure's own response does not carry it).
  durationMs?: number;
  words?: WordScore[];
  // Only present on POST /pronunciation's response (Task 5): the persisted
  // attempt's id and its 1-based attempt number for this sentence.
  attemptId?: string; attemptNo?: number;
}

// GET /speech/reference?text=… — canonical syllable/phoneme reference for a
// sentence, TTS-derived and cached globally (business-rules R9). A sentence
// the server could not derive a reference for comes back as HTTP 200 with an
// empty object — every field below is absent, not an error.
export interface SentenceReference {
  sentenceKey?: string;
  referenceText?: string;
  locale?: string;
  ipa?: string;
  words?: WordScore[];
  durationMs?: number;
}

// One row of GET /speech/attempts?text=…&limit=… (oldest first, business-rules R3).
export interface SpeechAttemptRow {
  id?: string;
  attemptNo?: number;
  recognized?: string;
  overall?: number;
  accuracy?: number;
  fluency?: number;
  completeness?: number;
  prosody?: number;
  prosodyAvailable?: boolean;
  durationMs?: number;
  words?: WordScore[];
  createdAt?: string;
}

// A user's growth snapshot (server: GET /me/progress, POST /attempts).
// Level = 1 + floor(xp / 100); every 100 XP is one level.
export interface Standing { key: string; label: string; value: number }
export interface Progress {
  xp: number; level: number; rank: string;
  // Reputation is server-defined per profession: ordered, self-labelled. The
  // client renders whatever arrives and never hardcodes a dimension name.
  reputation: Standing[];
  streakCurrent: number; streakLongest: number;
}

// AI grade of a finished scenario conversation (server: POST /conversation/{sid}/complete).
export interface ScenarioGrade {
  scenarioId: string; score: number; passed: boolean; xpAwarded: number;
  goals: { goal: string; met: boolean }[];
  headline: string; feedback: string;
  tips: { en: string; ko: string }[];
  turns: number;
}
export interface CompleteResult { progress: Progress; grade: ScenarioGrade; xpAwarded: number; }

// Aggregated activity for the growth report. activeDates are UTC yyyy-mm-dd
// within the current (Monday-first) week.
export interface GrowthStats {
  scenariosToday: number; scenariosWeek: number; scenariosTotal: number;
  newCardsToday: number; newCardsWeek: number;
  conversationSecondsToday: number; conversationSecondsWeek: number;
  activeDates: string[];
}

// One spaced-repetition (SM-2) card from an AI correction: front = original
// phrasing, back = the natural correction, note = why. masteryPips 0-3.
export interface ReviewContext {
  title?: string; dept?: string; situation?: string; npc?: string;
}
export interface ReviewCard {
  id: string; source: string; front: string; back: string; note: string;
  topicTag: string; masteryPips: number; favorite: boolean;
  scenarioId?: string; context?: ReviewContext;
}
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

// ── Home tab ───────────────────────────────────────────────────────────────
// The server sends ONE object for the whole home screen. Optional fields are
// ABSENT (not null/placeholder) when there is nothing to show — the screen's
// rule is simply "no field, no module", never invented copy.
export interface HomeShift { shift: 'DAY' | 'EVENING'; deptLabel: string }
export interface HomeTodayOne { chapter: string; title: string; kind: string; scenarioId?: string }
export interface HomeMentorNote { id: string; npc: { name: string; role: string; dept: string }; text: string }
export interface HomePhrase { id: string; en: string; ko: string; note?: string }
export interface HomeReviewPeek { id: string; front: string }
export type ColleagueRelation = 'peer' | 'mentor' | 'mentee';
export interface HomeColleague {
  id: string; name: string; relation: ColleagueRelation; activity?: string; activeToday: boolean;
}
export interface Home {
  date: string;
  done: boolean;               // curriculum has no next step today → rest card
  shift?: HomeShift;
  streak: number;
  week: number[];              // 7 blocks, Monday-first: 0 none | 1 studied | 2 today
  level: number; xp: number; targetLevel?: string;
  todayOne?: HomeTodayOne;
  mentorNote?: HomeMentorNote;
  phrase?: HomePhrase;
  review?: HomeReviewPeek;
  situationsWaiting: number;
  colleagues: HomeColleague[];
  colleagueTotal: number;
  unreadCheers: number;
  pendingRequests: number;
}

// ── Colleagues ─────────────────────────────────────────────────────────────
export interface InviteCode { code: string; relation: ColleagueRelation; expiresAt: string; maxUses: number; uses: number }
export interface CodePreview { id: string; name: string; targetLevel?: string; destination?: string; streak?: number }
export interface Colleague {
  id: string; name: string; relation: ColleagueRelation;
  targetLevel?: string; destination?: string; streak?: number;
  activity?: string; activeToday?: boolean; statusHidden?: boolean;
}
export interface ColleagueDetail extends Colleague {
  level?: number; lastSeenAt?: string; activeDates?: string[]; weeklyHidden?: boolean; cheers: Cheer[];
}
export type CheerPreset = 'well_done' | 'fighting' | 'streak' | 'rest';
export interface Cheer {
  id: string; fromUserId: string; toUserId: string;
  preset?: CheerPreset; presetText?: string; message?: string; createdAt: string; read: boolean;
}
export interface ColleagueRequest { id: string; from: string; name: string; relation: ColleagueRelation; createdAt: string }
/** All four outcomes are successes — "you already asked" is a state, not a failure. */
export interface AddColleagueResult {
  colleagueId: string; requested?: boolean; alreadyLinked?: boolean; alreadyRequested?: boolean; autoAccepted?: boolean;
}
export interface ColleaguePrefs { shareStatus: boolean; shareWeekly: boolean }

export const api = {
  raw: http,

  async socialLogin(body: SocialLoginBody): Promise<LoginResp> {
    const { data } = await http.post('/auth/social', body);
    return data as LoginResp;
  },

  /** Dev-only login (server registers POST /auth/dev only when ENV=dev). */
  async devLogin(): Promise<LoginResp> {
    const { data } = await http.post('/auth/dev', {});
    return data as LoginResp;
  },

  async me(): Promise<MeResp> {
    const { data } = await http.get('/me');
    return data as MeResp;
  },

  /** Server economy config (single source of truth) — mirrored into ECON at boot. */
  async economyConfig(): Promise<Record<string, number>> {
    const { data } = await http.get('/config/economy');
    return data as Record<string, number>;
  },

  /** Save onboarding selections; server marks the profile onboarded. */
  async updateProfile(body: {
    job?: string; nativeLang?: string; targetLang?: string; destination?: string; targetLevel?: string;
  }): Promise<{ onboarded: boolean }> {
    const { data } = await http.patch('/me/profile', body);
    return data as { onboarded: boolean };
  },

  /** Equip a career title ('' un-equips); returns the updated profile. */
  async equipTitle(titleId: string): Promise<{ equippedTitle: string }> {
    const { data } = await http.patch('/me/title', { titleId });
    return data as { equippedTitle: string };
  },

  /** Permanently-discovered hidden mission ids. */
  async missions(): Promise<string[]> {
    const { data } = await http.get('/me/missions');
    return (data?.found ?? []) as string[];
  },

  /** Record a hidden-mission discovery (permanent, idempotent); returns found ids. */
  async recordMission(id: string): Promise<string[]> {
    const { data } = await http.post(`/me/missions/${id}`);
    return (data?.found ?? []) as string[];
  },

  /** Current growth snapshot (XP, level, streak, stats). */
  /** The whole home tab in one round trip (app's first screen — round trips are felt). */
  async home(): Promise<Home> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/me/home', { params: tz ? { tz } : undefined });
    return data as Home;
  },

  /** My invite code; `rotate` mints a fresh one and revokes the old. */
  async inviteCode(rotate = false): Promise<InviteCode> {
    const { data } = await http.post('/me/invite-code', null, { params: rotate ? { rotate: 1 } : undefined });
    return data as InviteCode;
  },

  /** Preview who a code belongs to, before sending a request. */
  async lookupCode(code: string): Promise<CodePreview> {
    const { data } = await http.get(`/invite/${encodeURIComponent(code)}`);
    return data as CodePreview;
  },

  async colleagues(): Promise<{ colleagues: Colleague[]; pendingRequests: number; unreadCheers: number }> {
    const { data } = await http.get('/me/colleagues');
    return { colleagues: data?.colleagues ?? [], pendingRequests: data?.pendingRequests ?? 0, unreadCheers: data?.unreadCheers ?? 0 };
  },

  async addColleague(code: string): Promise<AddColleagueResult> {
    const { data } = await http.post('/me/colleagues', { code });
    return data as AddColleagueResult;
  },

  async colleague(id: string): Promise<ColleagueDetail> {
    const { data } = await http.get(`/me/colleagues/${id}`);
    return data as ColleagueDetail;
  },

  async removeColleague(id: string): Promise<void> {
    await http.delete(`/me/colleagues/${id}`);
  },

  async sendCheer(id: string, body: { preset?: CheerPreset; message?: string }): Promise<Cheer> {
    const { data } = await http.post(`/me/colleagues/${id}/cheers`, body);
    return data as Cheer;
  },

  async cheerInbox(markRead = false): Promise<Cheer[]> {
    const { data } = await http.get('/me/cheers', { params: markRead ? { markRead: 1 } : undefined });
    return (data?.cheers ?? []) as Cheer[];
  },

  async colleagueRequests(): Promise<ColleagueRequest[]> {
    const { data } = await http.get('/me/colleague-requests');
    return (data?.requests ?? []) as ColleagueRequest[];
  },

  async acceptColleagueRequest(id: string): Promise<void> {
    await http.post(`/me/colleague-requests/${id}/accept`);
  },

  async declineColleagueRequest(id: string): Promise<void> {
    await http.post(`/me/colleague-requests/${id}/decline`);
  },

  async colleaguePrefs(): Promise<ColleaguePrefs> {
    const { data } = await http.get('/me/colleague-prefs');
    return data as ColleaguePrefs;
  },

  async setColleaguePrefs(p: Partial<ColleaguePrefs>): Promise<ColleaguePrefs> {
    const { data } = await http.patch('/me/colleague-prefs', p);
    return data as ColleaguePrefs;
  },

  async progress(): Promise<Progress> {
    const { data } = await http.get('/me/progress');
    return data as Progress;
  },

  /** Record a cleared scenario; awards `score` XP + advances streak, returns updated progress. */
  /** Growth-report aggregates (scenarios, cards, conversation time, attendance).
   *  Sends the device timezone so the server buckets today/this-week locally. */
  async growthStats(): Promise<GrowthStats> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/me/stats', { params: tz ? { tz } : undefined });
    return data as GrowthStats;
  },

  async recordAttempt(scenarioId: string, score: number): Promise<Progress> {
    const { data } = await http.post('/attempts', { scenarioId, score });
    return data as Progress;
  },

  /** Review cards due today (spaced-repetition oops-notes). */
  async reviewDue(): Promise<ReviewCard[]> {
    const { data } = await http.get('/me/review');
    return (data?.cards ?? []) as ReviewCard[];
  },

  /** Grade a review card (SM-2); returns the new mastery pips. */
  async gradeReview(id: string, grade: ReviewGrade): Promise<{ masteryPips: number; intervalDays: number }> {
    const { data } = await http.post(`/me/review/${id}/grade`, { grade });
    return {
      masteryPips: (data?.masteryPips ?? 0) as number,
      intervalDays: (data?.schedule?.intervalDays ?? 1) as number,
    };
  },

  async manifest(): Promise<Manifest> {
    const { data } = await http.get('/content/manifest');
    return data as Manifest;
  },

  // The /interiors/{id} handler is untyped in the contract, so we assert the
  // mobile-side Interior shape (src/map/types.ts mirrors the server json tags).
  // Cached so the elevator can prefetch a floor's map during the ride and the
  // interior route then reads it instantly.
  async interior(id: string): Promise<Interior> {
    const hit = interiorCache.get(id);
    if (hit) return hit;
    const { data } = await http.get(`/interiors/${id}`);
    interiorCache.set(id, data as Interior);
    return data as Interior;
  },

  /** Warm the cache for an interior (fire-and-forget; errors swallowed). */
  prefetchInterior(id: string): void {
    if (interiorCache.has(id)) return;
    this.interior(id).catch(() => {});
  },

  // --- scenario briefing + AI conversation ---

  /** Full scenario (briefing card + persona). GET /scenarios/{id}. */
  async scenario(id: string): Promise<ScenarioDetail> {
    const { data } = await http.get(`/scenarios/${id}`);
    return data as ScenarioDetail;
  },

  /** Today's situation board — a daily-rotated set of scenario cards (global). */
  async boardToday(profession = 'nurse'): Promise<BoardCard[]> {
    const { data } = await http.get(`/board/today?profession=${profession}`);
    return (data as { scenarios: BoardCard[] }).scenarios ?? [];
  },

  /** Department situation cards (dept-scoped scenarios, tagged 완료/긴급/신규),
   *  paginated so a single-dept learner can scroll the full bank. */
  async deptSituations(dept: string, offset = 0, limit = 20): Promise<{ situations: DeptSituation[]; hasMore: boolean }> {
    const { data } = await http.get('/me/situations', { params: { dept, offset, limit } });
    const d = data as { situations?: DeptSituation[]; hasMore?: boolean };
    return { situations: d.situations ?? [], hasMore: !!d.hasMore };
  },

  /** Chapter/step curriculum with per-user progress (v19 campus hub). */
  async curriculum(): Promise<CurriculumChapter[]> {
    const { data } = await http.get('/me/curriculum');
    return (data as { chapters: CurriculumChapter[] }).chapters ?? [];
  },

  /** Main-route curriculum path (events + unlock states). */
  async mainRoute(profession = 'nurse'): Promise<RouteNode[]> {
    const { data } = await http.get('/me/route', { params: { profession } });
    return (data as { nodes: RouteNode[] }).nodes ?? [];
  },

  /** Personalized daily pool (weighted, persisted, resets 00:00 in device tz). */
  async dailyBoard(profession = 'nurse'): Promise<BoardCard[]> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/me/daily-board', { params: { profession, ...(tz ? { tz } : {}) } });
    return (data as { scenarios: BoardCard[] }).scenarios ?? [];
  },

  /** Rewarded-ad top-up: adds fresh scenarios to today's pool (up to a daily cap).
   *  Throws with `capReached: true` when the daily cap is spent (HTTP 429). */
  async topUpDailyBoard(profession = 'nurse'): Promise<{ scenarios: BoardCard[]; adGrants: number; cap: number }> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    try {
      const { data } = await http.post('/me/daily-board/topup', null, { params: { profession, ...(tz ? { tz } : {}) } });
      return data as { scenarios: BoardCard[]; adGrants: number; cap: number };
    } catch (e) {
      const err = e as { response?: { status?: number } };
      if (err.response?.status === 429) throw Object.assign(new Error('cap'), { capReached: true });
      throw e;
    }
  },

  /** Assess pronunciation of recorded audio (base64 16kHz mono WAV) vs a reference. */
  /** Transcribe recorded audio to text (dictation, Azure STT). */
  async transcribe(audioBase64: string): Promise<string> {
    const { data } = await http.post('/stt', { audioBase64 });
    return (data as { text?: string })?.text ?? '';
  },

  async assessPronunciation(referenceText: string, audioBase64: string): Promise<PronunciationResult> {
    const { data } = await http.post('/pronunciation', { referenceText, audioBase64 });
    return data as PronunciationResult;
  },

  /** Canonical IPA/syllable reference for a sentence (business-rules R9). A
   *  miss comes back as 200 + `{}` (server business-logic-model §2) rather
   *  than an error — the caller must treat an empty result as "no reference
   *  available" (hide the IPA line + native waveform), not retry/fail. */
  async speechReference(text: string): Promise<SentenceReference> {
    const { data } = await http.get('/speech/reference', { params: { text } });
    return (data ?? {}) as SentenceReference;
  },

  /** Recent attempt history for a sentence, oldest first (business-rules R3:
   *  the practice screen renders the last 3). */
  async speechAttempts(text: string, limit = 3): Promise<SpeechAttemptRow[]> {
    const { data } = await http.get('/speech/attempts', { params: { text, limit } });
    return (data as SpeechAttemptRow[] | null) ?? [];
  },

  /** Full quiz (playable content). GET /quizzes/{id}. */
  async quiz(id: string): Promise<QuizDetail> {
    const { data } = await http.get(`/quizzes/${id}`);
    return data as QuizDetail;
  },

  /** Absolute URL of a listen-quiz's synthesized dictation audio (for the player). */
  quizAudioUrl(id: string): string {
    return `${baseURL}/quizzes/${id}/audio.wav`;
  },

  /** Real amplitude waveform + duration for a listen-quiz's dictation audio. */
  async quizAudioMeta(id: string): Promise<QuizAudioMeta> {
    const { data } = await http.get(`/quizzes/${id}/audio-meta`);
    const d = (data ?? {}) as Partial<QuizAudioMeta>;
    return { waveform: d.waveform ?? [], durationMs: d.durationMs ?? 0, url: d.url ?? '' };
  },

  /** Open a persona-driven session for a scenario. Returns its sessionId. */
  async startConversation(scenarioId: string): Promise<string> {
    const { data } = await http.post(`/scenarios/${scenarioId}/conversation`, {});
    return (data as { sessionId: string }).sessionId;
  },

  /** Finish + AI-grade a conversation: awards score-scaled XP, records the clear
   *  (완료) or attempt (재도전), files improvement tips as review cards. 422 when
   *  the learner never spoke (nothing to grade). */
  async completeScenario(sessionId: string): Promise<CompleteResult> {
    const { data } = await http.post(`/conversation/${sessionId}/complete`, {});
    return data as CompleteResult;
  },

  /** Send a message; the NPC replies in persona (non-streaming). */
  async sendMessage(sessionId: string, text: string): Promise<string> {
    const { data } = await http.post(`/conversation/${sessionId}/message`, { text });
    return (data as { reply: string }).reply;
  },

  /**
   * Streaming send: the NPC reply arrives as SSE chunks (`data: <json-string>`).
   * RN's fetch has no reliable ReadableStream, so we read XHR.responseText
   * incrementally and parse newly-arrived `data:` frames. onDelta receives each
   * chunk; resolves with the full reply. Falls back to sendMessage on failure.
   */
  sendMessageStream(sessionId: string, text: string, onDelta: (chunk: string) => void): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const token = useAuthStore.getState().accessToken;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseURL}/conversation/${sessionId}/stream`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      let seen = 0; // chars of responseText consumed up to the last newline
      let full = '';
      const parse = (flush = false) => {
        const buf = xhr.responseText;
        let chunkText = buf.slice(seen);
        // Keep any trailing partial line buffered until its newline arrives.
        const lastNL = chunkText.lastIndexOf('\n');
        if (lastNL === -1 && !flush) return;
        if (!flush && lastNL !== -1) { seen += lastNL + 1; chunkText = chunkText.slice(0, lastNL + 1); }
        else { seen = buf.length; }
        for (const line of chunkText.split('\n')) {
          const l = line.trim();
          if (!l.startsWith('data:')) continue;
          const payload = l.slice(5).trim();
          if (payload === '"[DONE]"' || payload === '[DONE]') continue;
          try {
            const chunk = JSON.parse(payload) as string; // server JSON-encodes each chunk
            if (typeof chunk === 'string') { full += chunk; onDelta(chunk); }
          } catch {
            /* not valid JSON yet; ignore */
          }
        }
      };
      xhr.onprogress = () => parse(false);
      xhr.onload = () => { parse(true); resolve(full); };
      xhr.onerror = () => reject(new Error('stream failed'));
      xhr.send(JSON.stringify({ text }));
    });
  },
};

const interiorCache = new Map<string, Interior>();
