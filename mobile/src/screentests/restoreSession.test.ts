// Why the app asked for a login every time it had been closed for a while.
//
// Access tokens last 15 minutes, so a launch after that starts with an expired one.
// The sequence was:
//
//   restoreSession loads (A1, R1) from the keychain and puts them in memory
//   → GET /me 401s
//   → the interceptor rotates: the server consumes R1 and issues (A2, R2), which are
//     written to memory AND the keychain
//   → the retried GET /me succeeds
//   → restoreSession then calls setSession(A1, R1) — the pair it captured BEFORE the
//     call — putting the dead tokens back into memory
//   → the next 401 rotates with R1, which the server has already consumed, so it
//     refuses; the client treats that as a rejected session and signs the learner out.
//
// The disk was fine the whole time. Only memory was poisoned, by one line.
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

const mockStored = { access: 'A1', refresh: 'R1' };
jest.mock('@/lib/secureStore', () => ({
  loadTokens: async () => ({ access: mockStored.access, refresh: mockStored.refresh }),
  saveTokens: async (a: string, r: string) => { mockStored.access = a; mockStored.refresh = r; },
  clearTokens: async () => { mockStored.access = ''; mockStored.refresh = ''; },
}));

/** Stands in for the interceptor: the rotation that happens DURING the /me call. */
const mockRotateDuringMe = { on: false };
jest.mock('@/api/client', () => ({
  api: {
    me: async () => {
      if (mockRotateDuringMe.on) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { useAuthStore: store } = require('@/store/authStore') as typeof import('@/store/authStore');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { saveTokens } = require('@/lib/secureStore') as typeof import('@/lib/secureStore');
        await saveTokens('A2', 'R2');
        store.setState({ accessToken: 'A2', refreshToken: 'R2' });
      }
      return { user: { id: 'u1', status: 'active' }, profile: { onboarded: true } };
    },
  },
}));
jest.mock('@react-native-kakao/user', () => ({ login: async () => ({}), me: async () => ({}) }), { virtual: true });
jest.mock('@react-native-kakao/core', () => ({ initializeKakaoSDK: () => {} }), { virtual: true });
jest.mock('expo-apple-authentication', () => ({ signInAsync: async () => ({}), AppleAuthenticationScope: { EMAIL: 0 } }));

import { restoreSession } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';

beforeEach(() => {
  mockStored.access = 'A1';
  mockStored.refresh = 'R1';
  mockRotateDuringMe.on = false;
  useAuthStore.setState({ accessToken: null, refreshToken: null, isAuthed: false, onboarded: null });
});

test('a rotation during the restore is not undone', async () => {
  mockRotateDuringMe.on = true;
  await restoreSession();

  const s = useAuthStore.getState();
  // THE regression. Reverting to R1 here is what left memory holding a refresh token
  // the server had already consumed — and the next 401 then ended the session for real.
  expect(s.refreshToken).toBe('R2');
  expect(s.accessToken).toBe('A2');
  // The keychain agrees, so a later launch starts from the same pair.
  expect(mockStored.refresh).toBe('R2');
});

test('without a rotation the restored pair is kept', async () => {
  await restoreSession();
  const s = useAuthStore.getState();
  expect(s.accessToken).toBe('A1');
  expect(s.refreshToken).toBe('R1');
  expect(s.isAuthed).toBe(true);
  expect(s.onboarded).toBe(true);
});

test('nothing stored, nothing restored', async () => {
  mockStored.access = '';
  mockStored.refresh = '';
  await restoreSession();
  expect(useAuthStore.getState().isAuthed).toBe(false);
});
