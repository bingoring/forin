// API client — an axios instance wrapped in a small module so the HTTP library
// is swappable (1-3 decision: no direct fetch). Endpoint/response types come from
// the generated contract (packages/contract), keeping mobile↔server type-safe.
import axios, { type AxiosInstance } from 'axios';
import { parseSseLines } from './sseFrames';
import { endSession, handleResponseError, rotate } from './session';
import { useAuthStore } from '@/store/authStore';

import type { paths } from '@contract/types';
import type { Interior } from '@engine';
import { getLocale } from '@/i18n';
import { hydrateDestinations } from '@/data/destinations';
import { normalizeAvatarSpec, type AvatarSpec } from '@/data/nbAvatar';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const http: AxiosInstance = axios.create({ baseURL, timeout: 30_000 });

// Attach the access token — and the UI language — to every request.
//
// Accept-Language carries the app's display language so the server can localize the
// strings it renders (curriculum names, floor headings). Sent as a header rather than
// read from the profile server-side: the profile lookup would add a database round
// trip to every request, and the client already knows the answer.
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = getLocale();
  return config;
});

// The 401 / cold-start policy lives in ./session — it is the piece that took the app
// down when it was wrong, and it is testable there without a network. This is only the
// wiring: the axios instance is what replays a request, and setTimeout is the clock.
http.interceptors.response.use(
  (res) => res,
  (error) =>
    handleResponseError(error, {
      rotate: () => rotate(baseURL),
      endSession,
      replay: (config) => http(config),
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    }),
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
/** One suggested reply, from the guided pass of a curriculum step. */
export interface ReplyChoice {
  /** best / strong / fair — all three are correct; they differ in what they ACHIEVE. */
  tier: 'best' | 'strong' | 'fair';
  /** What to CONVEY, in the learner's own (native) language — the card's label. The
   *  learner reads this and produces the target-language line themselves. */
  intent: string;
  /** The model line in the target language: what a strong answer sounds like. Hidden —
   *  it grounds the immediate correction and can be revealed as a hint if the learner is
   *  stuck; it is no longer the pickable option. */
  text: string;
  /** One line in the learner's own language saying what this reply achieves. The
   *  difference between the three IS the lesson. */
  why: string;
}

/** The intents the learner could aim for this turn. */
export interface ReplyTurn {
  choices: ReplyChoice[];
}

export interface ScenarioDetail {
  id: string; profession: string; eventId: string; title: string; tagline: string;
  persona: ScenarioPersona; goals?: string[]; guardrails?: string[]; keyPhrases?: string[];
  /** How much help THIS run gets: "choices" the first time through a conversation,
   *  "free" the second. Sent with the scenario so the screen knows what to draw before
   *  the conversation starts. */
  guide?: 'choices' | 'free';
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
  // apgar (newborn scoring): the five signs, each with the observed finding and the
  // correct 0/1/2. See server content.QuizApgarRow for why the sign stays English.
  apgar?: { sign: string; finding: string; score: number }[];
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
  lv: string; min: number; urgent: boolean;
  /** State to compare on: 'cleared' | 'urgent' | 'new'. */
  tagCode: string;
  /** The same state as a label in the app's language. Never compare against it —
   *  that is what forced this field to stay Korean until the server split the two. */
  tag: string;
}

// Chapter/step curriculum with per-user progress (server: GET /me/curriculum).
export interface CurriculumStep {
  kind: 'dlg' | 'quiz' | 'event' | 'boss';
  name: string; scenarioId?: string;
  state: 'done' | 'now' | 'lock' | 'optional'; // optional = bonus quiz (doesn't gate)
  /** Played, graded below the bar. Orthogonal to `state`: a step you failed is still
   *  'now' (it is what to do next) and its successors are still 'lock' (clearing is
   *  what unlocks). The server only sets it where it means something — never on a
   *  'done' or 'lock' step. */
  attempted?: boolean;
  optional?: boolean;
  /** How much help THIS entry gives. A dialogue appears twice in the list — once
   *  guided, once alone — and these are the two entries; without this the learner would
   *  see the same title twice with no way to tell which is which. */
  guide?: 'choices' | 'free';
  /** The rung, as "1/2" and "2/2". Absent on steps with only one run (boss, quiz). */
  pass?: number;
  passes?: number;
}
// One themed curriculum on one floor. `state` has no 'lock': every floor and
// curriculum is open, and the sequence lives inside a curriculum (server
// business-rules R9) — drawing a padlock here would contradict that on screen.
// `resume` is set on exactly one curriculum in the whole payload, and the home
// tab's "오늘의 한 가지" points at the same one; both read the server's flag rather
// than deciding for themselves, because two screens computing "what's next"
// separately is how they end up disagreeing.
export interface Curriculum {
  key: string; name: string; building: string; floor: string; where: string;
  done: number; total: number;
  state: 'done' | 'doing' | 'todo'; next?: string; resume?: boolean;
  steps?: CurriculumStep[];
}
export interface CurriculumFloor { floor: string; where: string; curricula: Curriculum[] }
export interface CurriculumBuilding { building: string; floors: CurriculumFloor[] }

/** One thing the learner touched on a day. `hour` is local, 0-23. */
export interface CalendarEntry {
  scenarioId: string; title: string; cleared: boolean; hour: number;
}

/**
 * A day of activity. `band` is the day's DOMINANT band — a day split across two
 * reports the busier one, because the calendar cell has room for one mark and the
 * entries carry the detail.
 */
export interface CalendarDay {
  date: string;            // YYYY-MM-DD in the caller's timezone
  band: 'day' | 'evening' | 'night';
  sessions: number;
  cleared: number;
  entries: CalendarEntry[];
}

// One node of the main-route curriculum graph (server: GET /me/route).
export interface RouteNode {
  eventId: string; title: string; tier: number;
  state: 'locked' | 'available' | 'completed';
  scenarioId?: string; prerequisites?: string[];
  /** Played but graded below the bar. Separate from `state` because unlocking needs a
   *  CLEAR — an attempted node is still 'available' and its successors still locked —
   *  while the learner still needs to see that they have been here. */
  attempted?: boolean;
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
  // Task 11: Korean coaching per DISTINCT phoneme that appears in `words`,
  // keyed by the same raw phoneme spelling those entries carry — one entry
  // per sound, not one per occurrence (a sentence repeats phonemes often).
  // Absent (not `{}`) when no word had any phoneme with a mapped tip
  // (business-rules R5). See lib/pronTokens.ts's phonemeTipLookup, the only
  // intended consumer.
  phonemeTips?: Record<string, { ipa: string; message: string }>;
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

/** One sentence the player said out loud, at the score they currently stand at.
 *  Distinct from SpeechAttemptRow, which is one TRY at a known sentence and
 *  carries the syllable breakdown; this is one SENTENCE across tries and the
 *  lists that render it need the text and provenance instead. */
export interface SpokenSentence {
  sentenceKey: string;
  referenceText: string;
  recognized: string;
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  /** Number of tries — attempt numbers run 1..N with no gaps. */
  attempts: number;
  /** Present when the sentence came from a scenario; the list derives its
   *  department chip from it (SCN-ER-00002 → ER). */
  scenarioId?: string;
  origin?: string;
  createdAt: string;
}

/** GET /conversation/{sessionId}/speech-review — the Scenario Clear read-back.
 *  `average` is a raw number: the badge's rounding is the client's decision. */
export interface SessionSpeechReview {
  sentences: SpokenSentence[];
  average: number;
  /** At most two, for 낮은 점수 2문장 다시 연습하기. */
  weakest: SpokenSentence[];
}

/** GET /speech/summary — band counts over SENTENCES (not attempts). */
export interface SpeakSummary {
  total: number;
  /** 60↓ / 60–79 / 80+ */
  low: number;
  mid: number;
  high: number;
  weakest: SpokenSentence[];
}

/** ScreenSpeakList's sort dropdown: 낮은순 / 높은순 / 최신순 (weak / high / recent). */
export type SpeakSort = 'weak' | 'high' | 'recent';

/** One correction as the 시나리오 모범답안 block draws it: 내 답변 struck through
 *  against the 모범, with the "왜?" note. `said`/`model` rather than front/back —
 *  in this block their meaning is fixed and a reader should not have to know
 *  which way round the storage columns are. */
export interface ModelAnswerCard {
  said: string;
  model: string;
  /** Often absent; the block omits the box rather than drawing an empty one. */
  note?: string;
  createdAt: string;
}

/** One scenario's worth of corrections. `cards` is absent on a collapsed row. */
export interface ModelAnswerGroup {
  scenarioId: string;
  /** '' when the scenario is no longer in the served content set; the row falls
   *  back to the id rather than rendering blank. */
  title: string;
  corrections: number;
  lastAt: string;
  cards?: ModelAnswerCard[];
}

/** GET /me/review/model-answers/summary — the Review Lab block. */
export interface ModelAnswerSummary {
  total: number;
  /** At most four: the expanded one plus three collapsed. */
  groups: ModelAnswerGroup[];
  /** What "+ N개 더" says. 0 means the block showed everything. */
  more: number;
}

/** ScreenModelAnswerList's segmented sort: 최신 / 개선 필요. */
export type ModelAnswerSort = 'recent' | 'needs-work';

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
export interface CompleteResult {
  progress: Progress; grade: ScenarioGrade; xpAwarded: number;
  /** What to do next, decided by the server at the moment it recorded this attempt.
   *  Equals the scenario just finished when the run did NOT pass — the step after it
   *  is locked precisely because of that, so retrying is the honest next move and the
   *  button says so. Absent when there is nothing left to do. */
  nextScenarioId?: string;
}

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
/** `progress` is the current chapter's required-step completion (runs, not raw steps), so
 *  the card can draw a real "이어서 하기" progress bar. */
export interface HomeTodayOne { chapter: string; title: string; kind: string; scenarioId?: string; progress?: { done: number; total: number } }
/** The day's work brief. The two server-derived tasks; the 오늘의 문장 task is tracked
 *  client-side (see lib/dailyBrief). */
export interface HomeBrief { reviewCount: number; reviewTarget: number; reviewDone: boolean; curriculumDone: boolean }
export interface HomeMentorNote { id: string; npc: { name: string; role: string; dept: string }; text: string }
export interface HomePhrase { id: string; en: string; ko: string; note?: string }
export interface HomeReviewPeek { id: string; front: string }
/** 오늘의 호출 (v27). `secondsLeft` counts down to the sooner of the one-hour window and
 *  the learner's local midnight; the server omits the whole field once a call has
 *  expired unanswered, so the card is never drawn dead. */
export interface HomePage {
  scenarioId: string;
  line: string;
  hint: string;
  secondsLeft: number;
  /** The whole window, so the time bar is a fraction of something real. */
  totalSeconds: number;
  /** Took the call: the countdown stops and the scenario is theirs to finish. The bonus
   *  is NOT paid here — it lands when the server sees they actually started it. */
  accepted: boolean;
  answered: boolean;
  bonusXp: number;
}
export type ColleagueRelation = 'peer' | 'mentor' | 'mentee';
export interface HomeColleague {
  id: string; name: string; relation: ColleagueRelation; activity?: string; activeToday: boolean;
}
export interface Home {
  date: string;
  done: boolean;               // curriculum has no next step today → rest card
  /** True until the learner clears anything. Reorders the home to lead with the task. */
  firstRun?: boolean;
  shift?: HomeShift;
  streak: number;
  week: number[];              // rolling window ending today: 0 none | 1 studied | 2 today
  level: number; xp: number; targetLevel?: string;
  todayOne?: HomeTodayOne;
  brief?: HomeBrief;
  mentorNote?: HomeMentorNote;
  phrase?: HomePhrase;
  review?: HomeReviewPeek;
  page?: HomePage;
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
  /** Absent until they choose one; the row draws a seeded face then. */
  avatar?: Partial<AvatarSpec>;
  targetLevel?: string; destination?: string; streak?: number;
  activity?: string; activeToday?: boolean; statusHidden?: boolean;
}
/**
 * One colleague, in detail.
 *
 * `relation` is optional here and required on Colleague, and the difference is not
 * cosmetic: the list endpoint sends it, and the detail endpoint did not. The type claimed
 * otherwise, so the screen's label helper indexed into the missing string and took the app
 * down. The server now sends it — this stays optional because a type is not a runtime
 * guarantee for a value that crossed a network, and the compiler pointing at every use is
 * the only thing that keeps the next screen from assuming again.
 */
export type ColleagueDetail = Omit<Colleague, 'relation'> & {
  relation?: ColleagueRelation;
  level?: number; lastSeenAt?: string; activeDates?: string[]; weeklyHidden?: boolean; cheers: Cheer[];
}
/** A staff-lounge post as the feed reads it — the post, the author facts the card
 *  shows, and this reader's own cheer state. Mirrors domain/lounge.Post. */
export type LoungeKind = 'talk' | 'question' | 'share';
export interface LoungeTurn { index: number; role: string; text: string }
export interface LoungeSnippet { title?: string; turns: LoungeTurn[] }
export interface LoungePost {
  id: string; authorId: string; authorName: string;
  authorJob?: string; authorDestination?: string; authorLevel?: number;
  /** The author's NbAvatar spec, absent when they never opened the picker — the
   *  card then draws a face seeded from authorId. */
  authorAvatar?: Partial<AvatarSpec>;
  kind: LoungeKind; body: string; tags?: string[];
  scenarioId?: string; snippet?: LoungeSnippet;
  cheers: number; cheered: boolean; mine: boolean; createdAt: string;
}
export interface LoungeDraft {
  kind: LoungeKind; body: string; tags?: string[];
  scenarioId?: string; snippet?: LoungeSnippet;
}
/** Mirrors domain/lounge's caps. Duplicated rather than fetched: the compose screen
 *  counts characters as they are typed, and a round trip per keystroke to learn the
 *  limit is absurd. The server still enforces them — this is only what the counter
 *  and the disabled state read. */
export const LOUNGE_LIMITS = { body: 600, tags: 4, tagLen: 20, turns: 6, perDay: 20 } as const;

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
export interface ColleaguePrefs { shareStatus: boolean; shareWeekly: boolean; shareWard: boolean }

/** One anonymous figure in the home live ward: a stable, non-reversible id and the face to
 *  draw. Never a name — the ward is a crowd, not a directory. `avatar` is absent when the
 *  person never chose one (the client seeds a face from the id). */
export interface WardMember { id: string; avatar?: Partial<AvatarSpec> }

/** One 은어 도감 card. `meaning` is already resolved to the caller's locale by the server. */
export interface SlangCard { id: string; number: number; code: string; meaning: string; example?: string; hidden?: boolean }
export interface SlangDeck {
  collectedCount: number; total: number; masterAt: number; master: boolean;
  todayCard?: SlangCard; collectableToday: boolean; collected: SlangCard[];
}

/** One 오늘 밤의 이야기; text is server-resolved to the caller's locale. */
export interface NightStory { id: string; title: string; body: string; keyLine: string; keyGloss: string }
export interface NightRadio { total: number; index: number; story?: NightStory }

/** A follow-up note from a patient met in a cleared scenario (환자 인수인계 노트). */
export type HandoffKind = 'gratitude' | 'followup' | 'review';
export interface HandoffNote {
  id: string; kind: HandoffKind; patientName: string; patientSub?: string; coord?: string;
  body: string; refScenarioId?: string; replyText?: string; patientReply?: string;
  metAt: string; read: boolean; replied: boolean;
}
export interface HandoffInbox { notes: HandoffNote[]; unread: number }

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
    // The same response carries deploy-wide flags that are not economy numbers
    // (pronunciationEnabled, readyDestinations). Hand the destinations to their own
    // module rather than letting an array land in ECON's number map.
    hydrateDestinations((data as { readyDestinations?: unknown }).readyDestinations);
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

  // ── live ward presence ──────────────────────────────────────────────────
  /** Touch presence AND read who else is studying (the home-screen poll). */
  async ward(): Promise<WardMember[]> {
    const { data } = await http.get('/ward');
    return (data?.roster ?? []) as WardMember[];
  },
  /** Keep present while foregrounded on any screen (no body). */
  async wardHeartbeat(): Promise<void> {
    await http.post('/ward/heartbeat');
  },
  /** Leave immediately when the app backgrounds/closes (best-effort). */
  async wardLeave(): Promise<void> {
    await http.post('/ward/leave');
  },

  // ── 은어 도감 (slang deck) ────────────────────────────────────────────────
  async slang(): Promise<SlangDeck> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/slang', { params: tz ? { tz } : undefined });
    return data as SlangDeck;
  },
  /** Collect today's card (server picks it, at most once per local day). */
  async collectSlang(): Promise<SlangDeck> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.post('/slang/collect', null, { params: tz ? { tz } : undefined });
    return data as SlangDeck;
  },

  // ── 나이트 근무 라디오 (오늘 밤의 이야기) ──────────────────────────────────
  /** Tonight's story; `i` offsets from today's for 다음 이야기. */
  async night(i = 0): Promise<NightRadio> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/night', { params: { i, ...(tz ? { tz } : {}) } });
    return data as NightRadio;
  },

  /** 환자 인수인계 노트: the inbox. Opening it may generate one waiting note, so the
   *  server resolves note text to the caller's locale (pass it as a hint). */
  async handoff(): Promise<HandoffInbox> {
    const { data } = await http.get('/handoff');
    return data as HandoffInbox;
  },

  /** Mark one note read (clears its unread mark). Best-effort; returns nothing. */
  async readHandoff(id: string): Promise<void> {
    await http.post(`/handoff/${encodeURIComponent(id)}/read`);
  },

  /** Send a short reply to a note; the patient replies back (LLM), and the updated note
   *  — now carrying both lines — is returned. */
  async replyHandoff(id: string, text: string): Promise<HandoffNote> {
    const { data } = await http.post(`/handoff/${encodeURIComponent(id)}/reply`, { text });
    return data as HandoffNote;
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
  /** Three ways to answer the character's latest line.
   *
   *  Never throws for the learner's sake: an empty list means the screen falls back to
   *  its text box, which is the app as it always was. A scaffold that fails should leave
   *  them standing, not stop them mid-conversation. */
  async replyChoices(sessionId: string): Promise<ReplyTurn> {
    try {
      const { data } = await http.get(`/conversation/${encodeURIComponent(sessionId)}/choices`);
      const d = (data ?? {}) as { choices?: ReplyChoice[] };
      // Keep only cards that carry an intent — the intent IS the card now, and one without
      // it is a blank card. (The server drops these too; this is belt and braces.)
      return { choices: (d.choices ?? []).filter((c) => !!c.intent) };
    } catch {
      return { choices: [] };
    }
  },

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

  /**
   * Situations matching a title, across every department.
   *
   * The dept listing above needs to be told which ward to look in; this does not, which
   * is the point — the learner has one search box and no reason to know that the ward is
   * how the bank is organised.
   */
  async searchSituations(q: string, limit = 20): Promise<DeptSituation[]> {
    const { data } = await http.get('/me/situations', { params: { q, limit } });
    return (data as { situations?: DeptSituation[] }).situations ?? [];
  },

  /**
   * The whole path, grouped building → floor → curriculum, with per-user progress.
   *
   * Grouped by the server because the ORDER is the learning order, derived from a
   * floor tier table the client does not have — a client that regrouped a flat
   * list would have to reproduce it and would drift.
   */
  async curriculum(): Promise<CurriculumBuilding[]> {
    const { data } = await http.get('/me/curriculum');
    return (data as { buildings: CurriculumBuilding[] }).buildings ?? [];
  },

  /**
   * Persist the app's display language so a reinstall restores it.
   *
   * Separate from the onboarding PATCH /me/profile, which is a full upsert that
   * would reset job and languages to defaults when called with one field. Fire and
   * forget at the call site: the local setting already applied, and losing the sync
   * costs a preference, not a session.
   */
  /** Answer today's 오늘의 호출. Returns the scenario to enter and the XP granted —
   *  `bonusXp` is 0 when it had already been answered, which the server decides: the
   *  UPDATE only pays on the transition, so tapping twice cannot farm it. `tz` so the
   *  server judges the deadline against the learner's own midnight. */
  async acceptPage(): Promise<{ scenarioId: string; bonusXp: number; already: boolean }> {
    const { data } = await http.post('/me/home/page/answer', null, {
      params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
    const d = data as { scenarioId?: string; bonusXp?: number; already?: boolean } | null;
    return { scenarioId: d?.scenarioId ?? '', bonusXp: d?.bonusXp ?? 0, already: !!d?.already };
  },

  async setUILang(uiLang: string): Promise<void> {
    await http.patch('/me/ui-lang', { uiLang });
  },

  /** Save the learner's portrait — every axis at once (핸드오프 v32).
   *
   *  The whole spec, not a patch: the picker holds a complete face on screen and
   *  sends what it is showing. Returns the SERVER's stored spec, so a rejected axis
   *  cannot look accepted.
   */
  async setAvatar(spec: AvatarSpec): Promise<AvatarSpec | null> {
    const { data } = await http.patch('/me/avatar', { avatar: spec });
    const raw = (data as { avatar?: unknown } | null)?.avatar;
    return raw ? normalizeAvatarSpec(raw) : null;
  },

  /** Save the learner's own display name. `''` clears it, and the server then falls
   *  back to a short form of the user id — the same fallback other people's rows use.
   *
   *  Returns the SERVER's version of the name, not the submitted one: the server
   *  trims and collapses whitespace, so echoing what was typed would show a
   *  different name here than the one a colleague sees. Throws on a rejected name
   *  (too long, or characters that cannot be drawn). */
  async setDisplayName(displayName: string): Promise<string> {
    const { data } = await http.patch('/me/display-name', { displayName });
    return (data as { displayName?: string } | null)?.displayName ?? '';
  },

  /**
   * Activity calendar for one month: which days had sessions, which band they fell in,
   * and what was studied on each.
   *
   * A month at a time because the screen draws a month. Asking for "everything" would
   * grow without bound for a long-time learner while the grid can only show 31 cells.
   */
  async calendar(month?: string): Promise<{ month: string; days: CalendarDay[] }> {
    let tz: string | undefined;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { tz = undefined; }
    const { data } = await http.get('/me/calendar', { params: { month, tz } });
    const d = data as { month?: string; days?: CalendarDay[] };
    return { month: d.month ?? (month ?? ''), days: d.days ?? [] };
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
  /** Passing `session` makes the server ALSO score this utterance and file it
   *  under that dialogue run, which is what feeds the Scenario Clear review and
   *  the Review Lab 직접 말하기 연습 block. Omit it and the audio is only
   *  transcribed, exactly as before. */
  async transcribe(audioBase64: string, session?: { sessionId: string; scenarioId?: string }): Promise<string> {
    const { data } = await http.post('/stt', {
      audioBase64,
      ...(session ? { sessionId: session.sessionId, scenarioId: session.scenarioId } : null),
    });
    return (data as { text?: string })?.text ?? '';
  },

  /** The sentences spoken aloud during ONE dialogue run, for Scenario Clear. */
  async sessionSpeechReview(sessionId: string): Promise<SessionSpeechReview> {
    const { data } = await http.get(`/conversation/${encodeURIComponent(sessionId)}/speech-review`);
    const d = data as Partial<SessionSpeechReview> | null;
    return { sentences: d?.sentences ?? [], average: d?.average ?? 0, weakest: d?.weakest ?? [] };
  },

  /** The 시나리오 모범답안 summary block. */
  async modelAnswerSummary(): Promise<ModelAnswerSummary> {
    const { data } = await http.get('/me/review/model-answers/summary');
    const d = data as Partial<ModelAnswerSummary> | null;
    return { total: d?.total ?? 0, groups: d?.groups ?? [], more: d?.more ?? 0 };
  },

  /** One page of ScreenModelAnswerList. Every group carries its cards, so a row
   *  expands without another request. */
  async modelAnswers(opts: { sort: ModelAnswerSort; limit?: number; offset?: number }): Promise<{ groups: ModelAnswerGroup[]; total: number }> {
    const { data } = await http.get('/me/review/model-answers', {
      params: { sort: opts.sort, limit: opts.limit ?? 10, offset: opts.offset ?? 0 },
    });
    const d = data as { groups?: ModelAnswerGroup[]; total?: number } | null;
    return { groups: d?.groups ?? [], total: d?.total ?? 0 };
  },

  /** One page of the staff lounge, newest first. `before` is the oldest createdAt
   *  the caller already holds — paging by time rather than offset, because a post
   *  arriving between two reads shifts every offset by one. */
  async lounge(opts?: { before?: string; limit?: number }): Promise<{ posts: LoungePost[]; hasMore: boolean }> {
    const { data } = await http.get('/lounge', {
      params: { before: opts?.before, limit: opts?.limit ?? 20 },
    });
    const d = data as { posts?: LoungePost[]; hasMore?: boolean } | null;
    return { posts: d?.posts ?? [], hasMore: !!d?.hasMore };
  },

  /** Write a post. Throws with the server's own message on a rejected draft — the
   *  domain names what is wrong with it, and that is what the writer needs to read. */
  async postToLounge(draft: LoungeDraft): Promise<{ id: string }> {
    const { data } = await http.post('/lounge', draft);
    return data as { id: string };
  },

  async deleteLoungePost(id: string): Promise<void> {
    await http.delete(`/lounge/${encodeURIComponent(id)}`);
  },

  /** Cheer or take the cheer back; returns the post's new total so the card can
   *  paint the number the server holds rather than a guess. */
  async cheerLoungePost(id: string, on: boolean): Promise<{ cheers: number; cheered: boolean }> {
    const { data } = await http.post(`/lounge/${encodeURIComponent(id)}/cheer`, null, { params: { on } });
    return data as { cheers: number; cheered: boolean };
  },

  async reportLoungePost(id: string, reason: string): Promise<void> {
    await http.post(`/lounge/${encodeURIComponent(id)}/report`, { reason });
  },

  /** Score-band summary for the Review Lab 🎙 직접 말하기 연습 block. */
  async speakSummary(): Promise<SpeakSummary> {
    const { data } = await http.get('/speech/summary');
    const d = data as Partial<SpeakSummary> | null;
    return {
      total: d?.total ?? 0, low: d?.low ?? 0, mid: d?.mid ?? 0, high: d?.high ?? 0,
      weakest: d?.weakest ?? [],
    };
  },

  /** One page of the spoken-sentence list.
   *
   *  `total` counts what matches the CURRENT filter, so the count line means what it
   *  says. `depts` is every department the learner has spoken in, regardless of filter
   *  or scroll position — the chip row is built from it rather than from the loaded
   *  rows, which made chips appear mid-scroll. */
  async speakSentences(opts: { sort: SpeakSort; dept?: string; q?: string; limit?: number; offset?: number }): Promise<{ sentences: SpokenSentence[]; total: number; depts: string[]; low: number; mid: number; high: number }> {
    const { data } = await http.get('/speech/sentences', {
      // `q` filters on the SERVER for the same reason `dept` does: `total` is what the
      // "N문장 중 M개 표시" line reads, and a client-side filter reports "3 of 128" for
      // "3 among the pages loaded so far".
      params: { sort: opts.sort, dept: opts.dept || undefined, q: opts.q || undefined, limit: opts.limit ?? 20, offset: opts.offset ?? 0 },
    });
    // low/mid/high is the score-band distribution OF THIS FILTER, so the 말하기 탭's
    // gauge re-reads as the selected chip's spread. It rides on the same response as the
    // page, so the bars and the list can never disagree about which department they show.
    const d = data as { sentences?: SpokenSentence[]; total?: number; depts?: string[]; low?: number; mid?: number; high?: number } | null;
    return {
      sentences: d?.sentences ?? [], total: d?.total ?? 0, depts: d?.depts ?? [],
      low: d?.low ?? 0, mid: d?.mid ?? 0, high: d?.high ?? 0,
    };
  },

  /** `opts` forwards Task 5's origin/scenarioId/reviewCardId (business-rules
   *  §2/domain-entities §4) so an attempt is attributed correctly; all three
   *  are optional and omitted entirely means the same as before Task 5
   *  (server defaults origin to "freeform"). */
  async assessPronunciation(
    referenceText: string,
    audioBase64: string,
    opts?: { origin?: string; scenarioId?: string; reviewCardId?: string }
  ): Promise<PronunciationResult> {
    const { data } = await http.post('/pronunciation', { referenceText, audioBase64, ...opts });
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

  /** Absolute URL of a sentence's synthesized reference audio (Task 11 — the
   *  same TTS render GET /speech/reference derives its IPA from). Unlike
   *  quizAudioUrl this endpoint is authenticated (locale is derived from the
   *  caller's profile, business-rules §2), so a raw fetch/download of this
   *  URL needs `authHeaders()`'s Authorization header attached manually —
   *  expo-audio's player can't attach one itself. */
  speechReferenceAudioUrl(text: string): string {
    return `${baseURL}/speech/reference/audio.wav?text=${encodeURIComponent(text)}`;
  },

  /** URL for the latest NPC line of a session, spoken in the persona's voice.
   *  404 when there is nothing appropriate to speak (no turn yet, TTS off, or no
   *  voice for the locale) — the caller should treat that as silence, not error. */
  npcSpeechUrl(sessionId: string): string {
    return `${baseURL}/conversation/${encodeURIComponent(sessionId)}/speech.wav`;
  },

  /** Bearer header for the rare out-of-band request (expo-file-system
   *  downloads) that bypasses the axios instance above and so needs
   *  Authorization attached by hand. */
  authHeaders(): Record<string, string> {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
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

  /** Open a persona-driven session for a scenario. Returns its sessionId.
   *
   *  `guide` is the rung of the ladder the learner tapped. The SERVER needs it: on the
   *  guided rung a scenario with an authored conversation is answered from that file
   *  instead of from a model, and it cannot know which rung this is otherwise. Omitted
   *  means the free pass, which is the safe default — the value only ever adds help. */
  async startConversation(scenarioId: string, resumeSessionId?: string, guide?: 'choices' | 'free'): Promise<string> {
    const body: Record<string, string> = {};
    if (resumeSessionId) body.resumeSessionId = resumeSessionId;
    if (guide) body.guide = guide;
    const { data } = await http.post(`/scenarios/${scenarioId}/conversation`, body);
    return (data as { sessionId: string }).sessionId;
  },

  /** The conversation this learner can pick up for a scenario, if any. Empty
   *  sessionId means "nothing to resume" — a normal 200, not an error, since the
   *  screen asks this on every entry. `role` is the stored role (user|assistant). */
  async resumableConversation(scenarioId: string): Promise<{ sessionId: string; turns: { role: string; content: string }[] }> {
    const { data } = await http.get(`/scenarios/${scenarioId}/conversation/last`);
    const d = data as { sessionId?: string; turns?: { role: string; content: string }[] };
    return { sessionId: d.sessionId ?? '', turns: d.turns ?? [] };
  },

  /** Finish + AI-grade a conversation: awards score-scaled XP, records the clear
   *  (완료) or attempt (재도전), files improvement tips as review cards. 422 when
   *  the learner never spoke (nothing to grade). */
  async completeScenario(sessionId: string): Promise<CompleteResult> {
    const { data } = await http.post(`/conversation/${sessionId}/complete`, {});
    return data as CompleteResult;
  },

  /**
   * Throw a conversation away: it stops being offered for resuming, so the next visit to
   * the scenario starts clean. The turns stay on the server — study time is derived from
   * them and the learner did spend those minutes.
   */
  async discardConversation(sessionId: string): Promise<void> {
    await http.post(`/conversation/${sessionId}/discard`, {});
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
  /** One NPC turn as it streams.
   *
   *  `onMood` fires at most once, before any text, so the portrait and the bubble's
   *  border are already right when the first words appear. `onImproved` fires after
   *  the text, and only when this turn moved the character to a better place.
   */
  sendMessageStream(
    sessionId: string,
    text: string,
    onDelta: (chunk: string) => void,
    handlers?: {
      onMood?: (mood: string) => void;
      onImproved?: (mood: string) => void;
      onResolved?: () => void;
      onMissions?: (numbers: number[]) => void;
      /** The immediate correction of the line just spoken, grounded by the picked intent.
       *  Fires once, before the NPC reply, so it lands under the learner's own bubble. */
      onCorrection?: (c: { original: string; corrected: string; note: string }) => void;
    },
    /** The native-language intent the learner picked this turn — grounds the correction. */
    intent?: string,
  ): Promise<string> {
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
        // Framing lives in sseFrames.ts, tested without an XMLHttpRequest. This used
        // to be inline and read only `data:` lines, ignoring `event:` — so every
        // frame's payload was appended to the bubble as if the patient had said it.
        // That was already wrong for `event: error` ("ai unavailable" in the
        // patient's mouth) before moods gave it a second way to show.
        for (const frame of parseSseLines(chunkText.split('\n'))) {
          switch (frame.kind) {
            case 'delta': full += frame.text; onDelta(frame.text); break;
            case 'mood': handlers?.onMood?.(frame.mood); break;
            case 'improved': handlers?.onImproved?.(frame.mood); break;
            case 'resolved': handlers?.onResolved?.(); break;
            case 'missions': handlers?.onMissions?.(frame.numbers); break;
            case 'correction': handlers?.onCorrection?.({ original: frame.original, corrected: frame.corrected, note: frame.note }); break;
            // error/done: the promise's resolve/reject path already covers both, and
            // neither is anything the learner should read as speech.
            case 'error':
            case 'done': break;
          }
        }
      };
      xhr.onprogress = () => parse(false);
      xhr.onload = () => { parse(true); resolve(full); };
      xhr.onerror = () => reject(new Error('stream failed'));
      // A stuck reply must not lock the screen forever. Without this the XHR waits on the
      // server indefinitely — and the dialogue keeps `pending` set the whole time, so the
      // input is disabled and only the "…생각 중" bubble shows, which reads as a freeze
      // ("대화 한 5~6번만 해도 화면이 멈춰"). The server's own LLM cap is ~60s, plus a cold
      // start; 75s is past any healthy reply, so this only fires on a genuine hang — and
      // then the caller's catch clears `pending` and offers a retry instead of hanging.
      xhr.timeout = 75000;
      xhr.ontimeout = () => reject(new Error('stream timed out'));
      xhr.send(JSON.stringify(intent ? { text, intent } : { text }));
    });
  },
};

const interiorCache = new Map<string, Interior>();
