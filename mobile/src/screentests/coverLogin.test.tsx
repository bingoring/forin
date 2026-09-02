// 여권 표지 = 로그인 (v30).
//
// Two rules here, and both fail quietly:
//
//  1. Somebody who has been here before must NOT be sent through the journey again.
//     The passport's last page PATCHes the profile, so walking a returning learner
//     through it overwrites the answers they already gave — with defaults, if they tap
//     past. The cover asks the server whether the profile is complete and only turns the
//     page when there is something left to fill in.
//  2. A learner already carrying a session (one resuming an interrupted journey) is not
//     asked to sign in again. Three provider buttons on a page you reached WITH a session
//     is a dead end that looks like the way forward.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-web-browser', () => ({ maybeCompleteAuthSession: () => {} }));
// The real provider pulls in the whole auth-session stack. What matters to these tests is
// which button is on the page and what happens after a successful sign-in.
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [null, null, () => {}],
}));

const mockNav: string[] = [];
let mockOnboarded = false;
let mockAuthed = false;
const mockSignedIn: string[] = [];
jest.mock('@/lib/auth', () => ({
  SOCIAL_CONFIG: { googleIosClientId: 'x', googleAndroidClientId: 'x', googleWebClientId: 'x' },
  isProviderConfigured: () => true,
  completeSocialLogin: async () => {},
  signInApple: async () => { mockSignedIn.push('apple'); },
  signInKakao: async () => { mockSignedIn.push('kakao'); },
  devSignIn: async () => {},
  syncOnboarded: async () => mockOnboarded,
}));
jest.mock('@/lib/onboardingDraft', () => ({
  loadDraft: async () => ({}),
  saveDraft: async () => {},
  clearDraft: async () => {},
  passportStep: () => 'job',
}));
jest.mock('@/api/client', () => ({ api: { updateProfile: async () => {} } }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: (p: string) => { mockNav.push(p); }, push: (p: string) => { mockNav.push(p); }, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({}),
}));
jest.mock('@/data/destinations', () => ({ isDestinationReady: () => true }));
jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel: (s: unknown) => unknown) => sel({ accessToken: mockAuthed ? 'tok' : null }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import PassportRoute from '@/app/(onboarding)/passport';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => { mockNav.length = 0; mockSignedIn.length = 0; mockOnboarded = false; mockAuthed = false; });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<PassportRoute />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** A pressable carrying an accessibility label — the provider buttons name themselves
 *  that way because Kakao's is an IMAGE with no text of ours on it. */
function byLabel(root: ReactTestInstance, label: string) {
  return root.findAll(
    (n) => typeof n.props?.onPress === 'function' && n.props?.accessibilityLabel === label,
    { deep: true },
  );
}

test("Kakao's button is the locale's own official image, not the Korean one everywhere", async () => {
  // The label is baked into Kakao's asset, so it cannot be translated — it has to be the
  // right FILE. A German learner shown the Korean button is being handed a language they
  // did not choose on the screen where they decide whether to trust the app.
  const tree = await mount();
  const kakao = byLabel(tree.root, '카카오로 시작하기');
  const img = kakao[0].findAll((n) => String(n.type) === 'Image', { deep: true });
  expect(img.length).toBe(1);
  expect(String(JSON.stringify(img[0].props.source))).toMatch(/kakao_login_wide(?!_en)/);
});

test('the cover offers the three providers, and no password anywhere', async () => {
  const tree = await mount();
  for (const label of ['Google로 계속하기', 'Apple로 계속하기', '카카오로 시작하기']) {
    expect(byLabel(tree.root, label).length).toBeGreaterThan(0);
  }
  // No field to type into: id/pw is not an option on this screen (v30 07).
  expect(tree.root.findAll((n) => typeof n.props?.onChangeText === 'function', { deep: true })).toHaveLength(0);
  // And the cover does not also offer to just walk in.
  expect(texts(tree.root)).not.toContain('여권 펼치기');
});

test('a returning learner goes home instead of being walked through onboarding again', async () => {
  // The journey's last page PATCHes the profile. Sending somebody who already answered
  // back through it overwrites what they said — with defaults, if they tap past.
  mockOnboarded = true;
  const tree = await mount();
  await act(async () => { byLabel(tree.root, 'Apple로 계속하기')[0].props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockSignedIn).toEqual(['apple']);
  expect(mockNav).toContain('/(tabs)');
  // The language page is the first page of the journey; it must not have been opened.
  expect(texts(tree.root)).not.toContain('어떤 언어로 볼까요?');
});

test('a new learner is taken to the first page, not into the app', async () => {
  mockOnboarded = false;
  const tree = await mount();
  await act(async () => { byLabel(tree.root, 'Apple로 계속하기')[0].props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockNav).not.toContain('/(tabs)');
  expect(texts(tree.root)).toContain('어떤 언어로 볼까요?');
});

test('a learner who already has a session is not asked to sign in again', async () => {
  mockAuthed = true;
  const tree = await mount();
  expect(texts(tree.root)).toContain('여권 펼치기');
  expect(byLabel(tree.root, 'Apple로 계속하기')).toHaveLength(0);
});
