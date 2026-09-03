// 온보딩 — the four things the emulator caught, each of which renders fine and is wrong.
//
//  1. The pages were drawn from y=0. The prototype's `top: 14` is measured under a 44px
//     status bar a browser mock paints and a phone does not, so every header sat in the
//     notch and the ‹ chip was not hit-testable at all — a back button that does not
//     exist.
//  2. 심사대 통과하기 turned a PAGE. The prototype slides the desk away sideways, and
//     turning the page there mounted the immigration screen a second time, so the
//     officer ducked under his counter and jumped up again behind the learner.
//  3. The officer's pop was written as one timing over an interpolate. CSS eases every
//     keyframe SEGMENT; one timing eases the whole run and moves linearly between the
//     stops, which is why three springs read as one slow float.
//  4. The commuter's left leg was drawn at negative x inside its own viewBox, so it was
//     clipped away entirely — and both legs pivoted from the middle of the shin.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-web-browser', () => ({ maybeCompleteAuthSession: () => {} }));
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [null, null, async () => ({ type: 'cancel' })],
}));
jest.mock('@/lib/auth', () => ({
  SOCIAL_CONFIG: { googleIosClientId: 'x', googleAndroidClientId: 'x', googleWebClientId: 'x' },
  isProviderConfigured: () => true,
  completeSocialLogin: async () => {},
  signInApple: async () => {},
  signInKakao: async () => {},
  devSignIn: async () => {},
  syncOnboarded: async () => false,
}));
jest.mock('@/lib/onboardingDraft', () => ({
  loadDraft: async () => ({}), saveDraft: async () => {}, clearDraft: async () => {},
  passportStep: () => 'job',
}));
jest.mock('@/api/client', () => ({ api: { updateProfile: async () => {} } }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: () => {}, push: () => {}, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({}),
}));
jest.mock('@/data/destinations', () => ({ isDestinationReady: () => true }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import PassportRoute from '@/app/(onboarding)/passport';
import { TOP_INSET } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

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

function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

/** RN style props NEST — flatten recursively or the property under test disappears. */
function flat(style: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const walk = (s: unknown) => {
    if (!s) return;
    if (Array.isArray(s)) { s.forEach(walk); return; }
    if (typeof s === 'object') Object.assign(out, s as Record<string, unknown>);
  };
  walk(style);
  return out;
}

async function signIn(root: ReactTestInstance) {
  const apple = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && n.props?.accessibilityLabel === 'Apple로 계속하기',
    { deep: true },
  );
  await act(async () => { apple[0].props.onPress(); });
  await act(async () => { await Promise.resolve(); });
}

async function settle(ms: number) {
  await act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); });
}

/** Walk the journey to the immigration desk and answer the officer. */
async function toImmigration(tree: ReturnType<typeof create>) {
  await signIn(tree.root);
  await settle(1400);
  await tap(tree.root, '이 언어로 계속');
  await settle(1400);
  await tap(tree.root, '간호사');
  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);
  await tap(tree.root, '미국');
  await tap(tree.root, '출국하기');
  await settle(1200);   // the stamp
  await settle(1800);   // the passport closes
  await settle(2800);   // the flight
  await settle(4000);   // the officer's question types itself
}

async function tap(root: ReactTestInstance, label: string) {
  const hits = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && !n.props?.disabled && texts(n).some((x) => x.includes(label)),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  await act(async () => { hits[hits.length - 1].props.onPress(); });
  await act(async () => { await Promise.resolve(); });
}

test('the ‹ chip clears the status bar, so it can actually be pressed', async () => {
  const tree = await mount();
  await signIn(tree.root);
  await settle(1400);

  // The chip is the only 32×32 pressable in the top-right of these pages.
  const chip = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && flat(n.props?.style).position === 'absolute'
      && typeof flat(n.props?.style).top === 'number',
    { deep: true },
  ).map((n) => flat(n.props.style));
  expect(chip.length).toBeGreaterThan(0);
  for (const style of chip) {
    // 14 put it under the notch: rendered, and not reachable by a finger.
    expect(style.top as number).toBeGreaterThanOrEqual(TOP_INSET);
  }
});

test('a page header starts below the status bar', async () => {
  const tree = await mount();
  await signIn(tree.root);
  await settle(1400);

  const header = tree.root.findAll(
    (n) => String(n.type) === 'View' && typeof flat(n.props?.style).paddingLeft === 'number'
      && flat(n.props?.style).paddingLeft === 34 && typeof flat(n.props?.style).paddingTop === 'number',
    { deep: true },
  ).map((n) => flat(n.props.style).paddingTop as number);
  expect(header.length).toBeGreaterThan(0);
  expect(Math.max(...header)).toBeGreaterThanOrEqual(TOP_INSET);
});

test('심사대 통과하기 slides the desk away and does not turn a page', async () => {
  const tree = await mount();
  await toImmigration(tree);
  expect(texts(tree.root).join(' ')).toContain('입국심사');

  await tap(tree.root, '더듬더듬');
  await tap(tree.root, '심사대 통과하기');

  // The approved page is here…
  expect(texts(tree.root)).toContain('APPROVED');
  // …and the page-turn curl is NOT: a gate is somebody moving you through, and the
  // curl also re-mounted the desk behind the learner.
  expect(byName(tree.root, 'PageCurl')).toHaveLength(0);
});

test('the officer does not stand up a second time as the learner leaves', async () => {
  const tree = await mount();
  await toImmigration(tree);
  await tap(tree.root, '더듬더듬');
  await tap(tree.root, '심사대 통과하기');

  // The desk is still on screen, sliding out — and its officer is frozen mid-stand,
  // not replaying his pop.
  const officers = byName(tree.root, 'Officer');
  expect(officers.length).toBeGreaterThan(0);
  for (const o of officers) expect(o.props.frozen).toBe(true);
});

test('the officer’s three parts are on three separate clocks', async () => {
  const tree = await mount();
  await toImmigration(tree);

  // What is checkable HERE is the structure: three independently-driven transforms,
  // live rather than frozen. The shape of the motion — one timing per keyframe
  // segment, which is what makes it snap instead of float — is not observable from
  // the tree at all (native-driven values never reach JS), so it is tested where it
  // is real arithmetic: data/keyframes.test.ts.
  const officer = byName(tree.root, 'Officer')[0];
  expect(officer).toBeTruthy();
  expect(officer.props.frozen).toBeFalsy();

  const moving = officer.findAll(
    (n) => String(n.type) === 'View' && Array.isArray(flat(n.props?.style).transform),
    { deep: true },
  );
  expect(moving.length).toBeGreaterThanOrEqual(3);
});

test('the commute page has a horizon, not one flat colour', async () => {
  const tree = await mount();
  await toImmigration(tree);
  await tap(tree.root, '더듬더듬');
  await tap(tree.root, '심사대 통과하기');
  await tap(tree.root, '첫 출근하기');
  await settle(100);

  // The prototype's pages are gradients. With a flat fill the dashed line across the
  // middle was a line on a solid colour rather than a road meeting the sky.
  const grad = tree.root.findAll((n) => {
    if (typeof n.type === 'string') return false;
    const name = n.type as { displayName?: string; name?: string };
    return (name.displayName ?? name.name) === 'Stop';
  }, { deep: true }).map((n) => (n.props as { stopColor?: string }).stopColor);
  expect(grad).toEqual(['#BFDCEE', '#E8EEE4', '#F1EBDD']);
});

test('both of the commuter’s legs are drawn inside their own viewBox', async () => {
  const tree = await mount();
  await toImmigration(tree);
  await tap(tree.root, '더듬더듬');
  await tap(tree.root, '심사대 통과하기');
  await tap(tree.root, '첫 출근하기');
  await settle(100);

  const legs = tree.root
    .findAll((n) => {
      if (typeof n.type === 'string') return false;
      const name = (n.type as { displayName?: string; name?: string });
      return (name.displayName ?? name.name) === 'Path';
    }, { deep: true })
    .map((n) => String((n.props as { d?: string }).d ?? ''))
    .filter((d) => /^M30 30 L/.test(d));

  // Two legs, and neither one leaves the box: a coordinate below 0 is clipped by the
  // viewport, which is how the left leg went missing while still being in the source.
  expect(legs).toHaveLength(2);
  for (const d of legs) {
    const coords = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    expect(Math.min(...coords)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...coords)).toBeLessThanOrEqual(60);
  }
});
