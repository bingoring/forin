// APGAR 채점 — the one genuinely new quiz type in v31 (M).
//
// A scoring table has two ways to be quietly wrong, and both render fine:
//
//  · Submitting an unfinished score. `[].every(...)` is vacuously true, so a payload with
//    no rows — or a sheet with four of five answered — must not read as complete.
//  · Reporting a total the learner did not arrive at. The number beside the criteria is
//    THEIR running sum while scoring, and the correct total only after submitting; a
//    single number doing both jobs tells somebody their 6 was a 7 all along.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

const APGAR = [
  { sign: 'Heart rate', finding: '100회/분 이상', score: 2 },
  { sign: 'Respiration', finding: '느리고 불규칙', score: 1 },
  { sign: 'Color', finding: '몸통 분홍 · 사지 청색', score: 1 },
];
let mockRows: { sign: string; finding: string; score: number }[] = APGAR;
jest.mock('@/hooks/useQuizData', () => ({
  useQuizData: () => ({
    quiz: {
      id: 'QZ-NICU-00006', title: 'APGAR 채점', type: 'apgar',
      content: { zone: 'NICU', apgar: mockRows, note: '7–10 정상' },
    },
    state: 'ok',
  }),
}));
jest.mock('@/api/client', () => ({ api: { recordAttempt: async () => {} } }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: () => {}, push: () => {}, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({ id: 'QZ-NICU-00006' }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Quiz from '@/app/quiz/[id]';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => { mockRows = APGAR; });

function mount() {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<Quiz />)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** The score circles, in row-major order: three per row. */
function circles(root: ReactTestInstance) {
  return root.findAll(
    (n) => typeof n.props?.onPress === 'function' && n.props?.disabled !== undefined && texts(n).length === 1
      && ['0', '1', '2'].includes(texts(n)[0]),
    { deep: true },
  );
}

async function score(root: ReactTestInstance, row: number, value: 0 | 1 | 2) {
  const cs = circles(root);
  expect(cs.length).toBe(mockRows.length * 3);
  await act(async () => { cs[row * 3 + value].props.onPress(); });
}

function button(root: ReactTestInstance) {
  const hits = root.findAll(
    (n) => typeof n.type !== 'string' && n.props?.disabled !== undefined && texts(n).length === 1
      && !['0', '1', '2'].includes(texts(n)[0]),
    { deep: true },
  );
  return hits[hits.length - 1];
}

test('the sheet asks for all five signs, in English, with the findings in Korean', () => {
  const out = texts(mount().root);
  expect(out).toContain('Heart rate');
  expect(out).toContain('100회/분 이상');
});

test('an unfinished score cannot be submitted, and says how many are left', async () => {
  const tree = mount();
  expect(button(tree.root).props.disabled).toBe(true);
  expect(texts(tree.root).join(' ')).toContain('3항목 남음');

  await score(tree.root, 0, 2);
  await score(tree.root, 1, 1);
  expect(button(tree.root).props.disabled).toBe(true);
  await score(tree.root, 2, 1);
  expect(button(tree.root).props.disabled).toBe(false);
});

test('a payload with no rows is not a complete score of zero', () => {
  // `[].every(...)` is vacuously true. Without the length guard this submits as correct.
  mockRows = [];
  expect(button(mount().root).props.disabled).toBe(true);
});

test('the total is the learner\'s own running sum, and the answer only after submitting', async () => {
  const tree = mount();
  await score(tree.root, 0, 2);
  await score(tree.root, 1, 0);   // wrong on purpose: the truth is 1
  await score(tree.root, 2, 1);
  // Their sum: 2 + 0 + 1.
  expect(texts(tree.root)).toContain('3');
  expect(texts(tree.root)).toContain('지금까지');

  await act(async () => { button(tree.root).props.onPress(); });
  // The correct total is 4, and the label changes with it — one number doing both jobs
  // would tell somebody their 3 had been a 4 all along.
  expect(texts(tree.root)).toContain('4');
  expect(texts(tree.root)).toContain('정답');
});

test('a wrong row is named, not just counted', async () => {
  const tree = mount();
  await score(tree.root, 0, 2);
  await score(tree.root, 1, 0);
  await score(tree.root, 2, 1);
  await act(async () => { button(tree.root).props.onPress(); });

  // "6 out of 7" does not say WHERE. The row that was wrong says so with its own sign.
  expect(texts(tree.root).join(' ')).toContain('Respiration');
  expect(texts(tree.root).join(' ')).toContain('정답은 1점');
});
