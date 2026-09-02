// The passport onboarding, driven end to end.
//
// It replaced a three-page wizard, so the thing that must not break is the CONTRACT: the
// same three answers reach the same PATCH, the draft is written as each one is given, and
// a country with no curriculum behind it cannot be chosen. The journey is the design; the
// contract is what the app runs on.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

const mockDraft: Record<string, unknown>[] = [];
const mockProfile: Record<string, unknown>[] = [];
const mockNav: string[] = [];
let mockCleared = 0;
let mockFail = false;

jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/onboardingDraft', () => ({
  loadDraft: async () => Object.assign({}, ...mockDraft),
  saveDraft: async (p: Record<string, unknown>) => { mockDraft.push(p); },
  clearDraft: async () => { mockCleared += 1; },
  passportStep: (d: Record<string, unknown>) => (!d.job ? 'job' : !d.destination ? 'dest' : 'level'),
}));
jest.mock('@/lib/auth', () => ({ syncOnboarded: async () => true }));
jest.mock('@/api/client', () => ({
  api: {
    updateProfile: async (p: Record<string, unknown>) => {
      if (mockFail) throw new Error('nope');
      mockProfile.push(p);
    },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: (p: string) => { mockNav.push(p); }, push: (p: string) => { mockNav.push(p); }, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({}),
}));
// Only the US has authored content, which is what the server reports today. The other
// three cards must therefore be visible and NOT selectable.
jest.mock('@/data/destinations', () => ({ isDestinationReady: (c: string) => c === 'us' }));
jest.mock('@/store/authStore', () => ({ useAuthStore: (sel: (s: unknown) => unknown) => sel({ accessToken: 'tok' }) }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import PassportRoute from '@/app/(onboarding)/passport';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  mockDraft.length = 0; mockProfile.length = 0; mockNav.length = 0; mockCleared = 0; mockFail = false;
  jest.useFakeTimers();
});
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

/** The innermost pressable whose subtree carries this label. */
function tapTarget(root: ReactTestInstance, label: string): ReactTestInstance {
  const hits = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && !n.props?.disabled && texts(n).some((t) => t.includes(label)),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

async function tap(root: ReactTestInstance, label: string) {
  await act(async () => { tapTarget(root, label).props.onPress(); });
  await act(async () => { await Promise.resolve(); });
}

/** Run the journey's unattended beats (page turns, flights) forward. */
async function settle(ms = 4000) {
  await act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); });
}

test('the journey collects three answers and posts them once, at the end', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('여권 펼치기');

  await tap(tree.root, '여권 펼치기');
  await settle(1400);
  expect(texts(tree.root)).toContain('어떤 일을 하시나요?');

  await tap(tree.root, '간호사');
  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);
  expect(texts(tree.root)).toContain('어디로 떠나나요?');

  await tap(tree.root, '미국');
  await tap(tree.root, '출국하기');
  // Stamp, then the passport closes, then the flight, then the desk.
  await settle(1200);
  await settle(1800);
  await settle(2800);
  expect(texts(tree.root)).toContain('IMMIGRATION · 입국심사');

  // The officer's question types itself before the options can be answered.
  await settle(4000);
  // '일상 대화 OK' is B2 — deliberately NOT the B1 fallback, so the mapping is actually
  // observed. Picking the option that happens to equal the default proved nothing.
  await tap(tree.root, '일상 대화 OK');
  await tap(tree.root, '심사대 통과하기');
  await settle(1400);
  expect(texts(tree.root).join(' ')).toContain('입국 승인');

  // Nothing has been posted yet: PATCH /me/profile marks the user onboarded, so a
  // per-page save would skip the rest of the journey for good.
  expect(mockProfile).toHaveLength(0);

  await tap(tree.root, '첫 출근하기');
  await act(async () => { await Promise.resolve(); });
  expect(mockProfile).toEqual([{
    job: 'nurse',
    nativeLang: expect.any(String),
    targetLang: 'en',
    destination: 'us',
    // "일상 대화 OK, 실전 감각이 필요해요" is B2. The three answers ARE the CEFR question —
    // the server reads this band for the NPC's register, the examiner's calibration and
    // the daily sample, so a wrong mapping is three wrong behaviours.
    targetLevel: 'B2',
  }]);
  expect(mockCleared).toBe(1);

  // The walk plays over the saved profile, then hands over to the app.
  await settle(3200);
  expect(mockNav).toContain('/(tabs)');
});

test('each answer is written to the draft as it is given', async () => {
  // The draft is why closing the app mid-journey does not cost the answers. Written per
  // answer, not per page: someone who picks a job and quits has picked a job.
  const tree = await mount();
  await tap(tree.root, '여권 펼치기');
  await settle(1400);
  await tap(tree.root, '간호사');
  expect(mockDraft).toEqual([{ job: 'nurse' }]);

  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);
  await tap(tree.root, '미국');
  // targetLang travels with the destination, as it did on the old locale page.
  expect(mockDraft[1]).toEqual({ destination: 'us', targetLang: 'en' });
});

test('a country with no curriculum behind it cannot be chosen', async () => {
  // Onboarding would otherwise end by posting the learner to a hospital that does not
  // exist yet. The card stays on the page — the destination is coming — but it is marked
  // and it does not answer.
  const tree = await mount();
  await tap(tree.root, '여권 펼치기');
  await settle(1400);
  await tap(tree.root, '간호사');
  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);

  const out = texts(tree.root);
  expect(out).toContain('호주');
  expect(out).toContain('준비중');

  const open = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && n.props?.disabled !== true && texts(n).includes('호주'),
    { deep: true },
  );
  expect(open).toHaveLength(0);
});

test('the desk will not take an answer until the question has finished landing', async () => {
  // The beat is that somebody is asking you something. Answerable early, it is a form
  // again — and the options are dimmed to say so, not merely inert.
  const tree = await mount();
  await tap(tree.root, '여권 펼치기');
  await settle(1400);
  await tap(tree.root, '간호사');
  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);
  await tap(tree.root, '미국');
  await tap(tree.root, '출국하기');
  await settle(1200); await settle(1800); await settle(2800);

  const gate = () => {
    const hits = tree.root.findAll((n) => typeof n.type === 'string' && n.props?.pointerEvents !== undefined && texts(n).some((t) => t.includes('더듬더듬')), { deep: true });
    expect(hits.length).toBeGreaterThan(0);
    return hits[0].props;
  };
  expect(gate().pointerEvents).toBe('none');

  await settle(4000);
  expect(gate().pointerEvents).toBe('auto');
});

test('a failed save keeps the learner where they are and says so', async () => {
  // Someone who has just been admitted must not be dropped back at the cover because a
  // request failed.
  mockFail = true;
  const tree = await mount();
  await tap(tree.root, '여권 펼치기');
  await settle(1400);
  await tap(tree.root, '간호사');
  await tap(tree.root, '다음 장 넘기기');
  await settle(1400);
  await tap(tree.root, '미국');
  await tap(tree.root, '출국하기');
  await settle(1200); await settle(1800); await settle(2800); await settle(4000);
  await tap(tree.root, '더듬더듬');
  await tap(tree.root, '심사대 통과하기');
  await settle(1400);
  await tap(tree.root, '첫 출근하기');
  await act(async () => { await Promise.resolve(); });

  expect(mockNav).not.toContain('/(tabs)');
  expect(texts(tree.root).join(' ')).toContain('저장이 안 됐어요');
  // …and it is still the same page, with the button live again.
  expect(texts(tree.root)).toContain('첫 출근하기');
});

test('a returning learner opens the passport where they stopped', async () => {
  // The cover is skipped: they have opened this passport before, and making them open it
  // again is the loss the draft exists to prevent.
  mockDraft.push({ job: 'nurse' });
  const tree = await mount();
  expect(texts(tree.root)).not.toContain('여권 펼치기');
  expect(texts(tree.root)).toContain('어디로 떠나나요?');
});
