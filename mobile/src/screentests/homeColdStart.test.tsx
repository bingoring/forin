// The home screen while the server is waking up.
//
// Cloud Run scales to zero, so the first request after an idle period can take longer
// than the transport's own two retries. What the learner saw then was the launch screen
// promising "서버를 깨우고 있어요", followed by a home screen that was blank apart from
// one line of failure text — with nothing to press. Killing the app was the only move.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v, runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
// The home screen draws the LiveWard, which draws the avatar sprite. Its motion is not
// what these tests are about — whether the screen recovers from a cold start is.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t, linear: (t: number) => t },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    useDerivedValue: (f: () => unknown) => ({ value: f() }),
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: (v: unknown) => v,
    withSequence: (v: unknown) => v,
    withTiming: (v: unknown) => v,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
});
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

/** How many times the fake server refuses before it comes up. */
const mockServer: { calls: number; failures: number; nameFails?: boolean } = { failures: 0, calls: 0 };
const mockHome = {
  date: '2026-08-31', done: false, firstRun: false, streak: 3, week: [1, 0, 1, 1, 0, 1, 1],
  level: 4, xp: 420, situationsWaiting: 2, colleagues: [], colleagueTotal: 0,
  unreadCheers: 0, pendingRequests: 0,
};
jest.mock('@/api/client', () => ({
  api: {
    home: async () => {
      mockServer.calls += 1;
      if (mockServer.calls <= mockServer.failures) throw new Error('503 — instance starting');
      return mockHome;
    },
    acceptPage: async () => ({ scenarioId: '', bonusXp: 0, already: false }),
    // The heading asks for the learner's display name alongside the home read. It must
    // never be able to fail the page — the screen catches it — but it does have to exist,
    // or Promise.all rejects on an undefined function and the wait becomes an error.
    me: async () => {
      if (mockServer.nameFails) throw new Error('nope');
      return { profile: { displayName: '지민' } };
    },
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Home from '@/app/(tabs)/index';
import { trackMounts } from '@/testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function press(root: ReactTestInstance, label: string): ReactTestInstance | undefined {
  return root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes(label),
    { deep: true },
  ).slice(-1)[0];
}

beforeEach(() => {
  jest.useFakeTimers();
  mockServer.calls = 0;
  mockServer.failures = 0;
});
afterEach(() => { jest.useRealTimers(); });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Home />)); });
  return tree;
}

/** Runs the pending retry timers, and the promises each one starts. */
async function waitForRetries(tree: ReturnType<typeof create>, rounds = 5) {
  for (let i = 0; i < rounds; i++) {
    await act(async () => { jest.advanceTimersByTime(10_000); });
  }
  return tree;
}

test('a waking server is a wait, not a failure', async () => {
  mockServer.failures = 2; // up on the third attempt
  const tree = await mount();

  // The first refusal does not become an error screen.
  await act(async () => { jest.advanceTimersByTime(2_000); });
  expect(texts(tree.root).some((x) => x.includes('불러오지 못'))).toBe(false);
  // …and it says what is happening, rather than spinning silently.
  expect(texts(tree.root).some((x) => x.includes('서버를 깨우고'))).toBe(true);

  await waitForRetries(tree);
  // It came up on its own. No tap, no relaunch.
  expect(mockServer.calls).toBeGreaterThan(2);
  // A module only the LOADED screen has. The point of the test is that the wait ends in a
  // home, not in a blank page — so the sentinel has to be something the screen always
  // draws, whatever the day's data looks like. (v29: 과별 출근 카드 replaced 오늘의 상황.)
  expect(texts(tree.root)).toContain('과별 출근 카드');
});

test('a warm server never mentions waking', async () => {
  const tree = await mount();
  expect(mockServer.calls).toBe(1);
  expect(texts(tree.root).some((x) => x.includes('서버를 깨우고'))).toBe(false);
});

test('a server that never comes up leaves a way out', async () => {
  mockServer.failures = 99;
  const tree = await mount();
  await waitForRetries(tree);

  expect(texts(tree.root).some((x) => x.includes('불러오지 못'))).toBe(true);
  // THE gap. The screen said it had failed and offered nothing but killing the app.
  const retry = press(tree.root, '다시 시도');
  expect(retry).toBeDefined();

  // And the button works: the server comes up, the tap loads the screen.
  mockServer.failures = 0;
  await act(async () => { retry!.props.onPress(); });
  expect(texts(tree.root)).toContain('과별 출근 카드');
});

test('it gives up rather than retrying forever', async () => {
  mockServer.failures = 99;
  const tree = await mount();
  await waitForRetries(tree, 8);
  // A screen that never stops trying never shows the retry button either, and burns the
  // battery of someone whose network is simply down.
  expect(mockServer.calls).toBeLessThanOrEqual(6);
  expect(texts(tree.root).some((x) => x.includes('불러오지 못'))).toBe(true);
});

test('the name is decoration: losing it must not lose the home', async () => {
  // The heading asks for the display name alongside the home read. It is the only request
  // on this screen that nothing depends on — so it is caught, and the notebook is simply
  // titled without a name, which is what a learner who never set one sees anyway.
  mockServer.calls = 0; mockServer.failures = 0; mockServer.nameFails = true;
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('과별 출근 카드');
  expect(out).toContain('나의 근무 수첩');
  expect(out).not.toContain('홈을 불러오지 못했어요. (로그인·서버 확인)');
  mockServer.nameFails = false;
});
