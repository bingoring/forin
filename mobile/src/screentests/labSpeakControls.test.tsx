// 말하기 · 두 개의 컨트롤 (학습자 결정): 정렬 드롭다운 + 부서 칩. 검색은 뺐다.
//
// The learner cut search ("검색도 누가 할까 싶으니 빼고") and asked for the sort to drop
// down from its control rather than raise a bottom sheet. So this pins three things the
// port keeps getting wrong on its own:
//
//  · There is NO search field. A stray TextInput is how the removed feature comes back.
//  · The sort is the inline dropdown, and every ordering it offers reaches the SERVER
//    as that sort — 낮은순 / 높은순 / 최신순, weak / high / recent. A dropdown that
//    changed the label but sent the old sort would look right and read the wrong list.
//  · The department chips keep the sort, rather than quietly dropping back to 낮은순.
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
// The distribution the server returns FOR THE FILTER. ER's spread differs from the whole
// bank's, so the test can prove the gauge re-reads when a chip is tapped.
const BANDS_ALL = { total: 128, low: 12, mid: 40, high: 76 };
const BANDS_ER = { total: 74, low: 30, mid: 24, high: 20 };

jest.mock('@/api/client', () => ({
  api: {
    speakSentences: async (opts: Call) => {
      mockCalls.push(opts);
      const b = opts.dept === 'ER' ? BANDS_ER : BANDS_ALL;
      return { sentences: mockRows, total: b.total, depts: ['ER', 'ICU'], low: b.low, mid: b.mid, high: b.high };
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
  mockCalls.length = 0;
  mockRows = [mockRow('s1', 'Please bear with me for a moment.')];
  mockTotal = 128;
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<SpeakList />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

function texts(root: ReactTestInstance): string {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'))
    .join(' ');
}

const selector = (tree: ReturnType<typeof create>) => byName(tree.root, 'NbInlineSelect')[0];

test('search is gone — there is no text field on the list', async () => {
  const tree = await mount();
  const fields = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true });
  expect(fields.length).toBe(0);
});

test('the sort is the inline dropdown, and it offers 낮은순 / 높은순 / 최신순', async () => {
  const tree = await mount();
  const sel = selector(tree);
  expect(sel).toBeTruthy();
  expect(sel.props.options.map((o: { label: string }) => o.label)).toEqual(['낮은순', '높은순', '최신순']);
  // Opens on 낮은순 — the sentences that most need the practice this list is for.
  expect(sel.props.value).toBe('weak');
  expect(mockCalls[0].sort).toBe('weak');
});

test('each ordering reaches the server as its own sort', async () => {
  const tree = await mount();
  for (const want of ['high', 'recent', 'weak'] as const) {
    await act(async () => { selector(tree).props.onSelect(want); });
    await act(async () => { await Promise.resolve(); });
    const last = mockCalls[mockCalls.length - 1];
    expect(last.sort).toBe(want);
    // From the top: page 2 of one ordering is not page 2 of another.
    expect(last.offset).toBe(0);
  }
});

test('the score distribution re-reads as the selected department’s spread (v35)', async () => {
  const tree = await mount();
  // Whole bank first — its 80+ count is 76 (BANDS_ALL).
  expect(texts(tree.root)).toMatch(/\b76\b/);

  const er = byName(tree.root, 'NbChip').find((n) => n.props.children === 'ER')!;
  await act(async () => { er.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  // ER's spread now — 30 / 24 / 20 (BANDS_ER), and the whole-bank 76 is gone. This is the
  // gauge reading the filter, not the whole bank: a static distribution would still say 76.
  const after = texts(tree.root);
  expect(after).toMatch(/\b20\b/);
  expect(after).not.toMatch(/\b76\b/);
});

test('a department chip keeps the chosen sort', async () => {
  const tree = await mount();
  await act(async () => { selector(tree).props.onSelect('high'); });
  await act(async () => { await Promise.resolve(); });

  const icu = byName(tree.root, 'NbChip').find((n) => n.props.children === 'ICU')!;
  await act(async () => { icu.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockCalls[mockCalls.length - 1]).toMatchObject({ sort: 'high', dept: 'ICU' });
});
