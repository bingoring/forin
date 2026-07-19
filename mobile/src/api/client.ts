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
      if (!rt) return null;
      try {
        // raw axios (no interceptors) to avoid recursion
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
        const pair = data as TokenPair;
        if (!pair.accessToken || !pair.refreshToken) return null;
        useAuthStore.setState({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
        await saveTokens(pair.accessToken, pair.refreshToken);
        return pair.accessToken;
      } catch {
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
export interface ScenarioBriefing {
  dept?: string; deptColor?: string; brief?: string; difficulty?: number; timeLabel?: string;
  skills?: string[]; rewards?: ScenarioReward[]; reqs?: ScenarioReq[]; tone?: string; accent?: string;
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
}
export interface QuizDetail {
  id: string; profession: string; type: string; title: string; content?: QuizContent;
}

export interface WordScore { word: string; accuracy: number; errorType?: string }
export interface PronunciationResult {
  recognized: string; accuracy: number; fluency: number; completeness: number; overall: number;
  words?: WordScore[];
}

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

  /** Assess pronunciation of recorded audio (base64 16kHz mono WAV) vs a reference. */
  async assessPronunciation(referenceText: string, audioBase64: string): Promise<PronunciationResult> {
    const { data } = await http.post('/pronunciation', { referenceText, audioBase64 });
    return data as PronunciationResult;
  },

  /** Full quiz (playable content). GET /quizzes/{id}. */
  async quiz(id: string): Promise<QuizDetail> {
    const { data } = await http.get(`/quizzes/${id}`);
    return data as QuizDetail;
  },

  /** Open a persona-driven session for a scenario. Returns its sessionId. */
  async startConversation(scenarioId: string): Promise<string> {
    const { data } = await http.post(`/scenarios/${scenarioId}/conversation`, {});
    return (data as { sessionId: string }).sessionId;
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
