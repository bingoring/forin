// The cold-start outage, as a test.
//
// Cloud Run scales to zero. The first request after an idle period can fail or time
// out while an instance starts. The app answered that by logging the user out of
// memory only — secure store kept good tokens that nothing but bootstrapSession()
// reads — so every tab went empty and the only cure was killing the app.
//
// These tests drive the WIRING, because that is where the bug was: rotate() and
// logout() were each defensible on their own.
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

const mockStore = {
  saved: [] as string[][],
  cleared: 0,
  failSave: false,
  /** What the in-memory store held AT THE MOMENT of the disk write. Recording this is
   *  the only way to observe the ordering — asserting on the two end states passes
   *  whichever way round they happened. */
  memoryAtSave: undefined as string | null | undefined,
};
jest.mock('@/lib/secureStore', () => ({
  saveTokens: async (a: string, r: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore: store } = require('@/store/authStore') as typeof import('@/store/authStore');
    mockStore.memoryAtSave = store.getState().accessToken;
    if (mockStore.failSave) throw new Error('keychain unavailable');
    mockStore.saved.push([a, r]);
  },
  clearTokens: async () => { mockStore.cleared += 1; },
  loadTokens: async () => ({ access: null, refresh: null }),
}));

const mockAxios = { posts: [] as unknown[][], reply: null as unknown, throwing: null as unknown };
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: async (...args: unknown[]) => {
      mockAxios.posts.push(args);
      if (mockAxios.throwing) throw mockAxios.throwing;
      return { data: mockAxios.reply };
    },
  },
}));

import type { InternalAxiosRequestConfig } from 'axios';
import {
  COLD_RETRIES,
  endSession,
  handleResponseError,
  isRetryableFailure,
  rotate,
  type RotateResult,
  type SessionIO,
} from './session';
import { useAuthStore } from '@/store/authStore';

/** An axios-shaped rejection. `status` omitted = no response at all. */
function failure(status: number | undefined, config?: Partial<InternalAxiosRequestConfig>) {
  return {
    config: { url: '/me/home', method: 'get', headers: {}, ...config } as InternalAxiosRequestConfig,
    response: status === undefined ? undefined : { status },
  };
}

function io(over: Partial<SessionIO> = {}): SessionIO & { replays: unknown[]; ended: number; slept: number[] } {
  const rec = {
    replays: [] as unknown[],
    ended: 0,
    slept: [] as number[],
    rotate: async (): Promise<RotateResult> => ({ kind: 'retryable' }),
    endSession: async () => { rec.ended += 1; },
    replay: async (c: InternalAxiosRequestConfig) => { rec.replays.push(c); return 'replayed'; },
    sleep: async (ms: number) => { rec.slept.push(ms); },
    ...over,
  };
  return rec;
}

beforeEach(() => {
  mockStore.saved = [];
  mockStore.cleared = 0;
  mockStore.failSave = false;
  mockStore.memoryAtSave = undefined;
  mockAxios.posts = [];
  mockAxios.reply = null;
  mockAxios.throwing = null;
  useAuthStore.setState({ accessToken: 'old-access', refreshToken: 'old-refresh', isAuthed: true });
});

// ── classification ────────────────────────────────────────────────────────
test('a server that did not answer is retryable; an answer of "no" is not', () => {
  expect(isRetryableFailure(failure(undefined))).toBe(true); // network, DNS, timeout
  expect(isRetryableFailure(failure(503))).toBe(true); // Cloud Run, instance starting
  expect(isRetryableFailure(failure(502))).toBe(true);
  expect(isRetryableFailure(failure(504))).toBe(true);
  expect(isRetryableFailure(failure(401))).toBe(false); // an answer: your token is bad
  expect(isRetryableFailure(failure(403))).toBe(false);
  expect(isRetryableFailure(failure(404))).toBe(false);
});

// ── rotate ────────────────────────────────────────────────────────────────
test('a cold start is reported as retryable, and does not touch the session', async () => {
  mockAxios.throwing = failure(503);
  const result = await rotate('http://api');
  expect(result).toEqual({ kind: 'retryable' });
  // The tokens the learner still has are still there. This is the whole fix.
  expect(useAuthStore.getState().refreshToken).toBe('old-refresh');
  expect(mockStore.cleared).toBe(0);
});

test('a timeout is reported as retryable too', async () => {
  mockAxios.throwing = { code: 'ECONNABORTED', message: 'timeout of 15000ms exceeded' };
  expect(await rotate('http://api')).toEqual({ kind: 'retryable' });
  expect(useAuthStore.getState().refreshToken).toBe('old-refresh');
});

test('a rejected refresh token is invalid, not retryable', async () => {
  mockAxios.throwing = failure(401);
  expect(await rotate('http://api')).toEqual({ kind: 'invalid' });
});

test('a successful rotation writes disk BEFORE memory', async () => {
  mockAxios.reply = { accessToken: 'new-access', refreshToken: 'new-refresh' };
  const result = await rotate('http://api');
  expect(result).toEqual({ kind: 'rotated', token: 'new-access' });
  // Refresh tokens are single-use server-side, so the old one on disk is already dead
  // by now. Memory-then-disk left a window where a crash stranded the app with a
  // consumed token and no way back except signing in again.
  expect(mockStore.saved).toEqual([['new-access', 'new-refresh']]);
  expect(useAuthStore.getState().accessToken).toBe('new-access');
  // The order itself: when the disk write ran, memory still held the OLD token. Both
  // end states are identical either way round, so only this observes it.
  expect(mockStore.memoryAtSave).toBe('old-access');
  // Explicit timeout: raw axios defaults to none, which on a cold start meant an
  // unbounded wait behind the launch spinner.
  expect((mockAxios.posts[0][2] as { timeout?: number })?.timeout).toBeGreaterThan(0);
});

test('a failed disk write still leaves this session usable', async () => {
  mockStore.failSave = true;
  mockAxios.reply = { accessToken: 'new-access', refreshToken: 'new-refresh' };
  expect(await rotate('http://api')).toEqual({ kind: 'rotated', token: 'new-access' });
  // Discarding a rotation we cannot undo would be worse: the server has consumed the
  // old token either way.
  expect(useAuthStore.getState().accessToken).toBe('new-access');
});

test('no refresh token at all is invalid without a request', async () => {
  useAuthStore.setState({ accessToken: null, refreshToken: null, isAuthed: false });
  expect(await rotate('http://api')).toEqual({ kind: 'invalid' });
  expect(mockAxios.posts).toEqual([]);
});

test('concurrent 401s share one rotation', async () => {
  // The server consumes the refresh token, so a second concurrent call would present
  // an already-spent token and be rejected.
  mockAxios.reply = { accessToken: 'new-access', refreshToken: 'new-refresh' };
  const [a, b, c] = await Promise.all([rotate('http://api'), rotate('http://api'), rotate('http://api')]);
  expect([a, b, c]).toEqual([
    { kind: 'rotated', token: 'new-access' },
    { kind: 'rotated', token: 'new-access' },
    { kind: 'rotated', token: 'new-access' },
  ]);
  expect(mockAxios.posts).toHaveLength(1);
});

// ── the wiring ────────────────────────────────────────────────────────────
test('a 401 during a cold start leaves the session alone', async () => {
  const rec = io({ rotate: async () => ({ kind: 'retryable' }) });
  await expect(handleResponseError(failure(401), rec)).rejects.toBeDefined();
  // THE regression. endSession here is what emptied every tab until the app was killed.
  expect(rec.ended).toBe(0);
  expect(rec.replays).toEqual([]);
});

test('a 401 with a genuinely rejected token ends the session on both sides', async () => {
  const rec = io({ rotate: async () => ({ kind: 'invalid' }), endSession });
  await expect(handleResponseError(failure(401), rec)).rejects.toBeDefined();
  // Memory AND disk. Clearing only memory is the state a restart repairs and nothing
  // else can — which is how "kill the app" became the workaround.
  expect(mockStore.cleared).toBe(1);
  expect(useAuthStore.getState().refreshToken).toBeNull();
});

test('a 401 that rotates replays the request with the new token', async () => {
  const rec = io({ rotate: async () => ({ kind: 'rotated', token: 'fresh' }) });
  await expect(handleResponseError(failure(401), rec)).resolves.toBe('replayed');
  expect(rec.ended).toBe(0);
  expect((rec.replays[0] as InternalAxiosRequestConfig).headers.Authorization).toBe('Bearer fresh');
});

test('a request is rotated at most once', async () => {
  let rotations = 0;
  const rec = io({ rotate: async () => { rotations += 1; return { kind: 'rotated', token: 'fresh' }; } });
  const already = failure(401, { _retry: true } as Partial<InternalAxiosRequestConfig>);
  await expect(handleResponseError(already, rec)).rejects.toBeDefined();
  expect(rotations).toBe(0);
});

test('a 401 on /auth/refresh itself is not rotated', async () => {
  let rotations = 0;
  const rec = io({ rotate: async () => { rotations += 1; return { kind: 'invalid' }; } });
  await expect(handleResponseError(failure(401, { url: '/auth/refresh' }), rec)).rejects.toBeDefined();
  expect(rotations).toBe(0); // recursion
});

test('a GET that hits a waking instance is retried, with backoff', async () => {
  const rec = io();
  const err = failure(503);
  // Each call is one interceptor pass; axios re-enters through the same handler.
  await expect(handleResponseError(err, rec)).resolves.toBe('replayed');
  await expect(handleResponseError(err, rec)).resolves.toBe('replayed');
  // Exhausted: the third pass rejects rather than looping.
  await expect(handleResponseError(err, rec)).rejects.toBeDefined();
  expect(rec.replays).toHaveLength(COLD_RETRIES);
  // Backoff grows, so the second attempt is not fired into the same cold instance.
  expect(rec.slept[1]).toBeGreaterThan(rec.slept[0]);
});

test('a POST is never retried', async () => {
  const rec = io();
  // A repeated POST could double a scenario attempt, a cheer, or an XP award.
  await expect(handleResponseError(failure(503, { method: 'post' }), rec)).rejects.toBeDefined();
  expect(rec.replays).toEqual([]);
});

test('a 404 is not retried', async () => {
  const rec = io();
  // The server answered. Asking again gets the same answer, slower.
  await expect(handleResponseError(failure(404), rec)).rejects.toBeDefined();
  expect(rec.replays).toEqual([]);
});

test('a synchronous "invalid" does not poison every later rotation', async () => {
  // The latent bug the concurrency test exposed. With `finally { refreshing = null }`
  // INSIDE the promise body, the no-token path — which returns before the first await —
  // ran the finally while the right-hand side was still being evaluated, so the clear
  // happened BEFORE the assignment. `refreshing` then held a settled `invalid` promise
  // that nothing would ever clear: after one 401 with no token in memory, every 401 in
  // the process resolved to "your session is over" without a request, even once the
  // learner had signed in again.
  useAuthStore.setState({ accessToken: null, refreshToken: null, isAuthed: false });
  expect(await rotate('http://api')).toEqual({ kind: 'invalid' });

  // Sign back in, then rotate again.
  useAuthStore.setState({ accessToken: 'a', refreshToken: 'r', isAuthed: true });
  mockAxios.reply = { accessToken: 'new-access', refreshToken: 'new-refresh' };
  expect(await rotate('http://api')).toEqual({ kind: 'rotated', token: 'new-access' });
  expect(mockAxios.posts).toHaveLength(1);
});
