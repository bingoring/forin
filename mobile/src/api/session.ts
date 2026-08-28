// What to do when a request fails: rotate the token, retry, or end the session.
//
// Its own module because the bug it encodes took the app down, and because the bug was
// in the WIRING rather than in any one function — a test that could not drive the
// wiring could not have caught it.
//
// The bug: the old rotate() caught every failure identically and returned null, and
// the interceptor answered null by calling logout(). logout() clears only the
// IN-MEMORY store; clearTokens() lives in signOut(), which the interceptor never
// called. So a Cloud Run cold start — the service scales to zero, and the first
// request after an idle period can fail or time out — produced this:
//
//   launch → access token expired → 401 → the refresh request fails because the server
//   is still starting → logout() → memory has no tokens → every request 401s → rotate
//   finds no refresh token in memory → logout() again → forever.
//
// Every tab renders empty and nothing recovers it, because secure store still holds
// good tokens that only bootstrapSession() reads — which is why killing the app and
// relaunching was the one thing that worked.
//
// Two rules follow, and they are what the tests hold:
//
//  1. "The server did not answer" is NOT "your token is bad". Only a 401/403 from
//     /auth/refresh means the token was rejected. No response, a 5xx, a timeout — all
//     retryable, and all must leave the session alone.
//  2. When the token IS rejected, memory and disk are cleared TOGETHER, so the app
//     lands in a state a restart agrees with instead of one it repairs.
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, saveTokens } from '@/lib/secureStore';
import { useAuthStore } from '@/store/authStore';

/** Minimal shape of the pair both /auth/refresh and /auth/dev return. */
type Pair = { accessToken?: string; refreshToken?: string };

/** What a rotation attempt concluded. Three outcomes, not two: the middle one is the
 *  cold start, and collapsing it into either neighbour is the bug above. */
export type RotateResult =
  | { kind: 'rotated'; token: string }
  /** The server did not answer, or answered 5xx. Session untouched; caller fails. */
  | { kind: 'retryable' }
  /** /auth/refresh rejected the token, or there is no token. The session is over. */
  | { kind: 'invalid' };

/** How long to wait for /auth/refresh. The main client allows 30s; this is shorter on
 *  purpose — it sits between the learner and the first screen, and raw axios defaults
 *  to NO timeout, which on a cold start meant an unbounded wait behind a spinner. */
export const REFRESH_TIMEOUT_MS = 15_000;

/** Cold-start retries. Cloud Run's first request after scaling to zero is the one that
 *  fails; the next usually succeeds, so retrying turns a dead launch into a slow one. */
export const COLD_RETRIES = 2;
export const COLD_RETRY_DELAY_MS = 1_200;

/** Methods that can be repeated safely. A retried POST could double a scenario
 *  attempt, a cheer, or an XP award. */
const IDEMPOTENT = new Set(['get', 'head', 'options']);

/** "The server is not ready" as opposed to "no".
 *
 *  No response at all covers network loss, DNS, and timeouts. 502/503/504 are what
 *  Cloud Run returns while an instance is still starting. A 4xx is an answer — the
 *  server understood and declined — and is never retried. */
export function isRetryableFailure(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === undefined) return true;
  return status >= 500;
}

/** Refresh tokens are SINGLE-USE server-side (auth.Service.Refresh consumes the hash),
 *  so two concurrent rotations would present the same token twice and the second would
 *  be rejected. One in flight at a time. */
let refreshing: Promise<RotateResult> | null = null;

export async function rotate(baseURL: string): Promise<RotateResult> {
  if (refreshing) return refreshing;

  const attempt = (async (): Promise<RotateResult> => {
    const rt = useAuthStore.getState().refreshToken;
    if (!rt) return { kind: 'invalid' };
    let pair: Pair;
    try {
      // raw axios (no interceptors) to avoid recursion
      const { data } = await axios.post(
        `${baseURL}/auth/refresh`,
        { refreshToken: rt },
        { timeout: REFRESH_TIMEOUT_MS },
      );
      pair = (data ?? {}) as Pair;
    } catch (err) {
      if (isRetryableFailure(err)) return { kind: 'retryable' };
      return devFallback(baseURL);
    }
    if (!pair.accessToken || !pair.refreshToken) return devFallback(baseURL);
    await persistPair(pair);
    return { kind: 'rotated', token: pair.accessToken };
  })();

  // The clear happens OUTSIDE the promise body, and that is not a style choice.
  //
  // With `finally { refreshing = null }` inside the async function, a path that
  // finishes SYNCHRONOUSLY — no refresh token in memory, which returns before the
  // first await — ran the finally while the right-hand side was still being evaluated,
  // i.e. BEFORE `refreshing` was assigned. The assignment then landed on an
  // already-settled promise that nothing would ever clear, so `{ kind: 'invalid' }`
  // was cached forever: after that, every 401 in the process resolved to "your session
  // is over" without a single request, even once the learner had signed in again.
  //
  // A plain clear is enough, and deliberately so: the guard at the top returns the
  // in-flight promise, so a second attempt cannot exist until this one's finally has
  // run. An `if (refreshing === attempt)` check would be a branch no test could reach.
  // If that guard is ever loosened, this needs the identity check back.
  refreshing = attempt;
  void attempt.finally(() => { refreshing = null; });
  return attempt;
}

/** Disk FIRST, then memory.
 *
 *  The server has already consumed the old refresh token by the time this runs, so the
 *  copy on disk is dead. Writing memory first and disk second left a window where a
 *  crash — or a failed write — stranded the app with a consumed token on disk and no
 *  way back except signing in again. */
async function persistPair(pair: Pair): Promise<void> {
  try {
    await saveTokens(pair.accessToken!, pair.refreshToken!);
  } catch {
    // The session still works for THIS run; only a later launch would notice. Better
    // than discarding a rotation that cannot be undone.
  }
  useAuthStore.setState({ accessToken: pair.accessToken!, refreshToken: pair.refreshToken! });
}

/** In dev, a missing or stale refresh token shouldn't strand the session: silently
 *  re-run the dev login (the server registers /auth/dev only when ENV != prod).
 *
 *  Reached only on a genuine rejection — never on a transport failure, where
 *  re-logging-in would paper over an outage in the one environment where nobody would
 *  notice it had happened. */
async function devFallback(baseURL: string): Promise<RotateResult> {
  if (!__DEV__) return { kind: 'invalid' };
  try {
    const { data } = await axios.post(`${baseURL}/auth/dev`, {}, { timeout: REFRESH_TIMEOUT_MS });
    const pair = (data as { tokens?: Pair })?.tokens;
    if (pair?.accessToken && pair?.refreshToken) {
      await persistPair(pair);
      return { kind: 'rotated', token: pair.accessToken };
    }
  } catch { /* fall through */ }
  return { kind: 'invalid' };
}

/** Ends the session on both sides at once. Called ONLY when /auth/refresh rejected the
 *  token — never on a failure to reach the server. */
export async function endSession(): Promise<void> {
  try {
    await clearTokens();
  } catch { /* the in-memory clear below is what the UI reads */ }
  useAuthStore.getState().logout();
}

/** The pieces the handler needs, injected so a test can drive the wiring without a
 *  network, a clock, or a secure store. */
export type SessionIO = {
  rotate: () => Promise<RotateResult>;
  endSession: () => Promise<void>;
  /** Re-send the request (the axios instance itself, in production). */
  replay: (config: InternalAxiosRequestConfig) => Promise<unknown>;
  sleep: (ms: number) => Promise<void>;
};

type Retryable = InternalAxiosRequestConfig & { _retry?: boolean; _cold?: number };

/** The response-error interceptor. Rejects with the original error unless it can
 *  legitimately recover. */
export async function handleResponseError(error: unknown, io: SessionIO): Promise<unknown> {
  const e = error as { config?: Retryable; response?: { status?: number } };
  const original = e?.config;
  const is401 = e?.response?.status === 401;

  if (is401 && original && !original._retry && !original.url?.includes('/auth/refresh')) {
    original._retry = true;
    const result = await io.rotate();
    if (result.kind === 'rotated') {
      original.headers.Authorization = `Bearer ${result.token}`;
      return io.replay(original);
    }
    if (result.kind === 'invalid') {
      await io.endSession();
    }
    // 'retryable' falls through untouched: the request fails, the screen can try
    // again, and the session the learner still has survives.
    return Promise.reject(error);
  }

  // Not an auth problem — the server was unreachable or still waking up.
  if (original && IDEMPOTENT.has((original.method ?? 'get').toLowerCase()) && isRetryableFailure(error)) {
    const attempt = (original._cold ?? 0) + 1;
    if (attempt <= COLD_RETRIES) {
      original._cold = attempt;
      await io.sleep(COLD_RETRY_DELAY_MS * attempt);
      return io.replay(original);
    }
  }

  return Promise.reject(error);
}
