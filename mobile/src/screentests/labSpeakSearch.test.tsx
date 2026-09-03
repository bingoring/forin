// 말하기 · 문장 검색줄 (핸드오프 v31 07 · 리뷰랩 B).
//
// The list already had a sort and department chips; the handoff's third control is a
// search line on a ruled line. The interesting part is not the field — it is that the
// search must behave like the department filter, which means:
//
//  · It filters on the SERVER. The count line reads `total`, and a client-side filter
//    reports "3 of 128" for "3 among the pages loaded so far" (the comment at the top
//    of SpeakList records that exact regression).
//  · It debounces. One request per character spends a round trip on every prefix of a
//    word nobody meant to search for.
//  · The next page is the next page of the SAME search, not of the unfiltered list.
//  · The sort and the chips keep it, rather than quietly dropping back to everything.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

type Call = { sort: string; dept?: string; q?: string; offset?: number };
const mockCalls: Call[] = [];
const mockRow = (key: string, text: string) => ({
  sentenceKey: key, referenceText: text, recognized: '', overall: 64,
  accuracy: 64, fluency: 64, completeness: 64, attempts: 2, scenarioId: 'SCN-ER-00002',
});
let mockRows = [mockRow('s1', 'Please bear with me for a moment.')];
let mockTotal = 128;

jest.mock('@/api/client', () => ({
  api: {
    speakSentences: async (opts: Call) => {
      mockCalls.push(opts);
      return { sentences: mockRows, total: mockTotal, depts: ['ER', 'ICU'] };
    },
    speakSummary: async () => ({ total: 128, low: 12, mid: 40, high: 76, weakest: [] }),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  useLocalSearchParams: () => ({}),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { SpeakList } from '@/components/speak/SpeakList';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  jest.useFakeTimers();
  mockCalls.length = 0;
  mockRows = [mockRow('s1', 'Please bear with me for a moment.')];
  mockTotal = 128;
});
afterEach(() => { jest.useRealTimers(); });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<SpeakList />)); });
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

const field = (tree: ReturnType<typeof create>) =>
  tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];

/** Type, then let the debounce expire. */
async function search(tree: ReturnType<typeof create>, text: string) {
  await act(async () => { field(tree).props.onChangeText(text); });
  await act(async () => { jest.advanceTimersByTime(400); });
  await act(async () => { await Promise.resolve(); });
}

test('the search line is there, and it is a field rather than a button', async () => {
  const tree = await mount();
  expect(field(tree)).toBeTruthy();
  expect(field(tree).props.placeholder).toBe('문장 검색…');
});

test('what is typed reaches the SERVER as the query', async () => {
  const tree = await mount();
  await search(tree, 'acetaminophen');

  const last = mockCalls[mockCalls.length - 1];
  expect(last.q).toBe('acetaminophen');
  // From the top: page 2 of the unfiltered list has nothing to do with page 1 of a
  // search, and appending across the change interleaves two lists.
  expect(last.offset).toBe(0);
});

test('typing does not fire a request per keystroke', async () => {
  const tree = await mount();
  const before = mockCalls.length;
  await act(async () => { field(tree).props.onChangeText('a'); });
  await act(async () => { field(tree).props.onChangeText('ac'); });
  await act(async () => { field(tree).props.onChangeText('ace'); });
  expect(mockCalls.length).toBe(before);   // nothing yet

  await act(async () => { jest.advanceTimersByTime(400); });
  await act(async () => { await Promise.resolve(); });
  expect(mockCalls.length).toBe(before + 1);
  expect(mockCalls[mockCalls.length - 1].q).toBe('ace');
});

test('the next page is the next page of the same search', async () => {
  const tree = await mount();
  mockRows = Array.from({ length: 20 }, (_, i) => mockRow(`k${i}`, `sentence ${i}`));
  await search(tree, 'pain');

  const list = byName(tree.root, 'FlatList')[0];
  await act(async () => { list.props.onEndReached(); });
  await act(async () => { await Promise.resolve(); });

  const last = mockCalls[mockCalls.length - 1];
  expect(last.q).toBe('pain');
  expect(last.offset).toBe(20);
});

test('the sort and the department chips keep the search', async () => {
  const tree = await mount();
  await search(tree, 'pain');

  const sortMenu = byName(tree.root, 'NbSortMenu')[0];
  await act(async () => { sortMenu.props.onSelect('recent'); });
  await act(async () => { await Promise.resolve(); });
  expect(mockCalls[mockCalls.length - 1]).toMatchObject({ sort: 'recent', q: 'pain' });

  const icu = byName(tree.root, 'NbChip').find((n) => n.props.children === 'ICU')!;
  await act(async () => { icu.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(mockCalls[mockCalls.length - 1]).toMatchObject({ dept: 'ICU', q: 'pain' });
});

test('clearing the line goes back to everything', async () => {
  const tree = await mount();
  await search(tree, 'pain');
  await search(tree, '');
  expect(mockCalls[mockCalls.length - 1].q).toBe('');
});

test('a search that matches nothing says so instead of looking broken', async () => {
  const tree = await mount();
  mockRows = [];
  mockTotal = 0;
  await search(tree, 'zzzz');
  const out = texts(tree.root).join(' ');
  expect(out).toContain("'zzzz'와 맞는 문장이 없어요");
  // NOT the never-spoken copy: this learner has 128 sentences, and "아직 말한 문장이
  // 없어요" under a search that missed is the screen accusing them of nothing.
  expect(out).not.toContain('아직 말한 문장이 없어요');
});
