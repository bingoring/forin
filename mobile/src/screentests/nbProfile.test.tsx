// 프로필, in the 근무 수첩 line.
//
// There was no render test for this screen at all, which is how two of its rules ended up
// with nothing watching them: the ruled page (the thing that makes it paper), and the
// career path's tick — a step you have taken is TICKED and the one you are on is ringed,
// because a filled square says nothing about who did it.
//
// The mock list below is long because the screen reads six endpoints in one Promise.all
// and one of them is not optional: `api.progress()` has no .catch, and `repMap` calls
// .map on its `reputation`, so an object where an ARRAY belongs throws inside the try and
// the screen renders its error state. That is what defeated the first attempt at this
// file, and it is worth naming: every assertion below would have "passed" against a
// screen showing "프로필을 불러오지 못했어요".
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
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
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-speech', () => ({ speak: () => {}, stop: () => {} }));
jest.mock('@/lib/sfx', () => ({
  playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {},
  isSfxMuted: () => false, setSfxMuted: async () => {},
}));
// Signing out goes through lib/auth, which imports the Kakao SDK — and that package ships
// untranspiled ESM, so requiring it fails to parse under jest. Only the screen is under
// test here; the sign-out flow is asserted where it lives.
jest.mock('@/lib/auth', () => ({ signOut: async () => {}, syncOnboarded: async () => true }));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});
jest.mock('@/api/client', () => ({
  api: {
    // A level that puts the learner on the SENIOR rung (careerFor → step 2): two steps
    // behind them, one ringed, one ahead. Below the junior threshold every step is ahead
    // and there is no tick to find — which is the state the first version of this test
    // accidentally asserted against.
    progress: async () => ({ level: 24, xp: 4_800, streakCurrent: 3, streakLongest: 5, reputation: [] }),
    me: async () => ({ profile: { displayName: '지민', targetLevel: 'B1', equippedTitle: '', nativeLang: 'ko', targetLang: 'en' } }),
    growthStats: async () => ({ scenariosTotal: 12 }),
    missions: async () => [] as string[],
    colleagues: async () => ({ colleagues: [], pendingRequests: 0, unreadCheers: 0 }),
    inviteCode: async () => ({ code: 'AB12-CD34' }),
    colleaguePrefs: async () => ({ shareStatus: true, shareWeekly: true, shareWard: true }),
    setColleaguePrefs: async (p: unknown) => p,
    recordMission: async () => {},
    equipTitle: async () => {},
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Me from '@/app/(tabs)/me';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Me />)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

/** RN style props NEST: a component that takes `style` and puts it last in its own array
 *  produces [base, shadow, [mine]]. A one-level flatten copies the inner array's INDICES
 *  as keys and loses every property in it. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

/** Every HOST node whose style matches. Host only: RN's View wraps a host view and both
 *  carry the style, so counting composites doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('the screen actually loaded — everything below depends on it', async () => {
  // Named first and on its own: every other assertion here would pass against the error
  // state, which renders one line of text and nothing else.
  const tree = await mount();
  expect(texts(tree.root)).not.toContain('프로필을 불러오지 못했어요. (로그인·서버 확인)');
  expect(texts(tree.root)).toContain('지민');
});

test('the pass is written on a ruled page', async () => {
  // The rules are a run of 1pt views because RN has no repeating background. An empty run
  // is a blank cream rectangle, which reads as "the notebook look did not load".
  const tree = await mount();
  expect(styled(tree.root, (s) => s.height === 1 && s.backgroundColor === 'rgba(62,54,43,.06)').length)
    .toBeGreaterThan(10);
});

test('a step already taken is TICKED, and the one you are on is ringed', async () => {
  // Not filled. A filled square says a box has a state; a tick says somebody did it — and
  // the gold ring is the same mark the app uses everywhere for "this is the one you
  // chose", so the two cannot be confused.
  const tree = await mount();
  const ticks = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon' && n.props?.name === 'check',
    { deep: true },
  );
  expect(ticks.length).toBeGreaterThan(0);
  expect(ticks.every((n) => n.props.color === nb.green)).toBe(true);
  // Exactly one ring, and it says where you are in words too — a colour alone is not a
  // label, and this row is read at a glance.
  expect(styled(tree.root, (s) => s.borderColor === '#C99A1E' && s.borderWidth === 2).length).toBe(1);
  expect(texts(tree.root)).toContain('HERE');
});

test('a title you have not earned shows no name, and no card', async () => {
  // An unclaimed title is a blank space on the page rather than a card you own — and
  // printing its name would give away the thing you are meant to discover.
  const tree = await mount();
  expect(texts(tree.root)).toContain('???');
  expect(styled(tree.root, (s) => s.borderStyle === 'dashed' && s.backgroundColor === 'transparent').length)
    .toBeGreaterThan(0);
});

test('what is issued is typed; what you fill in is written', async () => {
  // The invite code and RANK are ISSUED — the code has to be read out to somebody, so
  // both are set in mono. The name is the one field that is yours, so it sits on a ruled
  // line in your own hand.
  const tree = await mount();
  const mono = tree.root.findAll(
    (n) => String(n.type) === 'Text' && String(flatten(n.props?.style).fontFamily).startsWith('IBMPlexMono'),
    { deep: true },
  ).flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
  expect(mono).toContain('AB12-CD34');
  expect(mono).toContain('RANK');

  const nameLine = styled(tree.root, (s) => s.borderBottomWidth === 1.5 && s.borderBottomColor === 'rgba(62,54,43,.35)');
  expect(nameLine.length).toBe(1);
  expect(texts(nameLine[0])).toContain('지민');
});
