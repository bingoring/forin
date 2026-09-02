// 오늘의 복습 세션, in the 근무 수첩 line (v30).
//
// Four rules, each of which fails silently:
//
//  · The answer must be hidden until the learner asks for it. Revealing it with the card
//    turns a recall exercise into a reading exercise, and nothing on screen would look
//    wrong.
//  · A SUGGESTION card ("you could have said this") must not be struck through. Striking
//    it tells the learner they said a sentence they never said, and that it was wrong.
//  · The stack behind the card means "there is more due". A fixed two-card stack on the
//    last card of the day promises work that does not exist.
//  · Nothing due is a finished day, not an error state.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
const mockSpoke: string[] = [];
jest.mock('expo-speech', () => ({ speak: (s: string) => { mockSpoke.push(s); }, stop: () => {} }));

let mockCards: Record<string, unknown>[] = [];
const mockGraded: string[] = [];
jest.mock('@/api/client', () => ({
  api: {
    reviewDue: async () => mockCards,
    gradeReview: async (id: string, g: string) => { mockGraded.push(`${id}:${g}`); return { intervalDays: 4 }; },
  },
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ replace: () => {}, push: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Review from '@/app/review';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const CORRECTION = {
  id: 'c1', source: 'dialogue', front: 'I want to ask about your pain.',
  back: 'Can you tell me about your pain?', note: '더 부드러운 요청이에요.',
  topicTag: 'ER · 통증 사정', masteryPips: 1, favorite: false,
};
const SUGGESTION = {
  id: 'c2', source: 'grade', front: '통증의 성격을 묻는 표현',
  back: 'What does the pain feel like?', note: '', topicTag: 'ER', masteryPips: 0, favorite: false,
};

beforeEach(() => { mockCards = [CORRECTION]; mockGraded.length = 0; mockSpoke.length = 0; });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Review />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** RN style props NEST, so a one-level flatten loses whatever is in the inner array. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

/** The Text node carrying a line, and its own flattened style. */
function lineStyle(root: ReactTestInstance, line: string): Record<string, unknown> {
  const hit = root.findAll(
    (n) => String(n.type) === 'Text' && n.children.some((c) => c === line),
    { deep: true },
  )[0];
  expect(hit).toBeTruthy();
  return flatten(hit.props.style);
}

/** Presses the pressable whose rendered text contains `label`. */
async function press(root: ReactTestInstance, label: string) {
  const hits = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).some((x) => x.includes(label)),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  await act(async () => { hits[hits.length - 1].props.onPress(); });
}

test('the answer is hidden until it is asked for', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('I want to ask about your pain.');
  // The corrected line is the answer. On screen from the start, this is a reading
  // exercise wearing a recall exercise's clothes.
  expect(texts(tree.root)).not.toContain('Can you tell me about your pain?');

  await press(tree.root, '정답 보기');
  expect(texts(tree.root)).toContain('Can you tell me about your pain?');
  // …and it is spoken as it lands, because hearing it is half of learning it.
  expect(mockSpoke).toContain('Can you tell me about your pain?');
});

test('what you said is struck through in red; a suggestion is not struck at all', async () => {
  const said = await mount();
  const struck = lineStyle(said.root, 'I want to ask about your pain.');
  expect(struck.textDecorationLine).toBe('line-through');
  expect(struck.textDecorationColor).toBe(nb.red);

  // A 'grade' card is advice about a sentence the learner never spoke.
  mockCards = [SUGGESTION];
  const advice = await mount();
  expect(lineStyle(advice.root, '통증의 성격을 묻는 표현').textDecorationLine).toBe('none');
});

test('the stack behind the card is as deep as the work left', async () => {
  // Three due → two cards behind. One due → none: a stack on the last card promises
  // work that does not exist.
  mockCards = [CORRECTION, { ...CORRECTION, id: 'c3' }, { ...CORRECTION, id: 'c4' }];
  const many = await mount();
  const behind = (t: ReturnType<typeof create>) =>
    t.root.findAll((n) => typeof n.type === 'string' && flatten(n.props?.style).height === 260, { deep: true }).length;
  expect(behind(many)).toBe(2);

  mockCards = [CORRECTION];
  expect(behind(await mount())).toBe(0);
});

test('grading files the grade and says when the card comes back', async () => {
  const tree = await mount();
  await press(tree.root, '정답 보기');
  await press(tree.root, '알맞음');
  await act(async () => { await Promise.resolve(); });

  expect(mockGraded).toEqual(['c1:good']);
  // The interval comes from the server's SM-2 answer, humanised — 4 days, not "1일".
  expect(texts(tree.root).join(' ')).toContain('4일');
});

test('nothing due is a finished day, not an error', async () => {
  mockCards = [];
  const tree = await mount();
  const out = texts(tree.root).join(' ');
  expect(out).toContain('복습할 카드가 없어요');
  expect(out).not.toContain('불러오지 못했어요');
});
