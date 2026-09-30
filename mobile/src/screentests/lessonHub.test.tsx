// 상황 허브 — lesson-four-steps-v44 G. It replaced the 상황 준비 (briefing) page at the
// same route (spec §6 결정 4), so this file replaced the briefing's tests. The checks are
// on the rendered output: the gauge and CTA count only the steps left for this learner,
// `그래도 할래요` opens a skipped step, an unwritten step cannot be opened, and each
// dialogue step sends its own rung.
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
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
// The hub's polaroid draws a RoleFace, which comes through @engine and pulls in
// reanimated. The face's motion is not what these tests are about; where the states show
// on the page is.
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

let mockLesson: any;
function lesson(level: string, states: string[], counts = [12, 6, 4, 4]) {
  return {
    situation: {
      id: 'SCN-ER-00002', title: '통증 사정 — Mrs. Hopkins', tagline: 'It hurts here.',
      persona: { name: 'Mrs. Hopkins', role: 'patient', mood: 'pain' },
      briefing: { dept: 'ER · TRAUMA BAY #4', timeLabel: '약 5분', brief: '허리 통증을 호소하는 환자.', rewards: [{ icon: 'star', label: '경험치', value: '+ 60 XP' }] },
    },
    level,
    steps: (['words', 'sentences', 'guided', 'free'] as const).map((kind, i) => ({ kind, state: states[i], count: counts[i] })),
    words: [], sentences: [],
  };
}
jest.mock('@/api/client', () => ({ api: { lesson: async () => mockLesson } }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useFocusEffect: (cb: () => void | (() => void)) => require('react').useEffect(cb, []),
  useRouter: () => ({ push: (p: unknown) => { mockNav.push(String(typeof p === 'string' ? p : JSON.stringify(p))); }, replace: () => {}, back: () => {}, canGoBack: () => true }),
  // A caller may still pass the old rung; the hub ignores it.
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: 'choices' }),
}));
const mockNav: string[] = [];

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonHub from '@/app/scenario/[id]';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

async function mount(l: unknown) {
  mockLesson = l;
  mockNav.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonHub />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

const gaugeCount = (tree: ReturnType<typeof create>) =>
  texts(tree.root.findAll((n) => n.props?.testID === 'lesson-gauge-count')[0]).join('');
const ticket = (tree: ReturnType<typeof create>, kind: string) =>
  tree.root.findAll((n) => n.props?.testID === `lesson-ticket-${kind}`)[0];
const pressable = (root: ReactTestInstance, label: string) =>
  root.findAll((n) => typeof n.props?.onPress === 'function' && texts(n).some((x) => x.includes(label)), { deep: true });

test('level b: the gauge counts three steps, not four', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  expect(gaugeCount(tree)).toBe('0/3');
  expect(texts(tree.root)).toContain('3단계로 익혀요');
});

test('level c: the gauge counts two', async () => {
  const tree = await mount(lesson('B2', ['skip', 'skip', 'now', 'lock']));
  expect(gaugeCount(tree)).toBe('0/2');
});

test('그래도 할래요 opens the skipped step and makes it the next one', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  const opt = pressable(ticket(tree, 'words'), '그래도 할래요');
  expect(opt.length).toBeGreaterThan(0);
  await act(async () => { opt[opt.length - 1].props.onPress(); });
  expect(gaugeCount(tree)).toBe('0/4');
  expect(texts(ticket(tree, 'words'))).toContain('시작');

  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 1');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/scenario/SCN-ER-00002/words']);
});

// 결정 3: content not written yet is not a skip — there is nothing to opt into.
test('an unwritten step offers no 그래도 할래요 and is not counted', async () => {
  const tree = await mount(lesson('A2', ['empty', 'empty', 'now', 'lock'], [0, 0, 4, 4]));
  expect(pressable(ticket(tree, 'words'), '그래도 할래요')).toHaveLength(0);
  expect(texts(ticket(tree, 'words'))).toContain('이 상황은 아직 준비 중이에요');
  expect(gaugeCount(tree)).toBe('0/2');
});

// 8 words and 5 sentences are minimums, not what the ticket says (spec §2-2).
test('the ticket meta follows the content count', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock'], [13, 7, 4, 4]));
  const all = texts(tree.root);
  expect(all).toContain('단어 13');
  expect(all).toContain('문장 7');
});

// The rung is the step's, not the ?guide= the caller passed (here the legacy 'choices').
test('each dialogue step sends its own rung into the conversation', async () => {
  const tree = await mount(lesson('B2', ['skip', 'skip', 'now', 'lock']));
  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 3');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=guided']);

  const done = await mount(lesson('B2', ['skip', 'skip', 'done', 'now']));
  const next = pressable(done.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 4');
  await act(async () => { next[next.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=free']);
});

test('everything done: the CTA replays the free dialogue', async () => {
  const tree = await mount(lesson('A2', ['done', 'done', 'done', 'done']));
  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], '다시 풀기');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=free']);
});

// 결정 4: the hub has no tab bar, so its CTA sits where the STEP screens put theirs.
test('the CTA floats 30 above the bottom', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const box = tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0];
  expect(flatten(box.props.style).bottom).toBe(30);
});

test('the feeling is on the cover', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const all = texts(tree.root);
  expect(all).toContain('PAIN');
  expect(all).toContain('+60XP');
});
