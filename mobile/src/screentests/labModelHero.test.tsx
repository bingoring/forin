// 모범답안 · 최근 1건 펼침 (핸드오프 v31 07 · 리뷰랩 C).
//
// The hero is the one correction the learner is most likely to still remember saying,
// worked through: what they said, what to say instead, why, and the two things you can
// do with a model answer — hear it and say it.
//
// What can go wrong, and therefore what renders here:
//  · A 최근 stamp on a row that is not the recent one (it is a false label under the
//    개선 필요 sort, where the first group is the WORST one).
//  · The same correction printed twice on one screen — hero plus an auto-opened row.
//  · A hero for a scenario the department filter has just removed from the list.
//  · 전체 듣기 re-downloading the clip on every tap, or 따라 말하기 opening the
//    learner's own sentence instead of the model one.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

const mockPlayer = { replace: 0, seek: 0, play: 0, uri: '' };
jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    replace: (src: { uri: string }) => { mockPlayer.replace += 1; mockPlayer.uri = src.uri; },
    seekTo: () => { mockPlayer.seek += 1; },
    play: () => { mockPlayer.play += 1; },
  }),
}));

const mockFs = { downloads: [] as { url: string; auth: boolean }[], exists: false, status: 200, deleted: [] as string[] };
jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///cache/',
  getInfoAsync: async () => ({ exists: mockFs.exists }),
  downloadAsync: async (url: string, _path: string, opts?: { headers?: Record<string, string> }) => {
    mockFs.downloads.push({ url, auth: !!opts?.headers?.Authorization });
    return { status: mockFs.status };
  },
  deleteAsync: async (path: string) => { mockFs.deleted.push(path); },
}));

type MockGroup = {
  scenarioId: string; title: string; corrections: number; lastAt: string;
  cards?: { said: string; model: string; note?: string; createdAt: string }[];
};

let mockGroups: MockGroup[] = [];
const mockSorts: string[] = [];
jest.mock('@/api/client', () => ({
  api: {
    modelAnswers: async (opts: { sort: string; offset?: number }) => {
      mockSorts.push(opts.sort);
      return { groups: (opts.offset ?? 0) > 0 ? [] : mockGroups, total: mockGroups.length };
    },
    speechReferenceAudioUrl: (text: string) => `https://api.test/speech/reference/audio.wav?text=${encodeURIComponent(text)}`,
    authHeaders: () => ({ Authorization: 'Bearer t' }),
  },
}));

const mockPushed: string[] = [];
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: (p: string) => mockPushed.push(p), replace: () => {}, back: () => {} }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { ModelAnswerList } from '@/components/model/ModelAnswerList';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const RECENT: MockGroup = {
  scenarioId: 'SCN-ER-00002', title: 'ER · 흉통 환자 트리아지', corrections: 3, lastAt: '2026-08-02T00:00:00Z',
  cards: [{
    said: 'Where is pain? How much?',
    model: 'Where exactly is the pain, and does it spread anywhere?',
    note: 'radiate(방사통) 여부는 흉통에서 반드시 물어야 해요.',
    createdAt: '2026-08-02T00:00:00Z',
  }],
};
const OLDER: MockGroup = {
  scenarioId: 'SCN-ICU-00001', title: 'ICU · 승압제 적정 보고', corrections: 4, lastAt: '2026-08-01T00:00:00Z',
  cards: [{ said: 'BP is low.', model: 'The MAP is 58 despite two litres.', createdAt: '2026-08-01T00:00:00Z' }],
};

beforeEach(() => {
  mockGroups = [RECENT, OLDER];
  mockSorts.length = 0;
  mockPushed.length = 0;
  mockPlayer.replace = 0; mockPlayer.seek = 0; mockPlayer.play = 0; mockPlayer.uri = '';
  mockFs.downloads = []; mockFs.exists = false; mockFs.status = 200; mockFs.deleted = [];
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<ModelAnswerList />)); });
  for (let i = 0; i < 6; i++) await act(async () => { await Promise.resolve(); });
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

const hero = (tree: ReturnType<typeof create>) => byName(tree.root, 'ModelAnswerHero')[0];

test('the hero works the most recent correction through, in full', async () => {
  const tree = await mount();
  const out = texts(hero(tree)!);
  expect(out).toContain('최근');
  expect(out).toContain('ER · 흉통 환자 트리아지');
  expect(out).toContain('Where is pain? How much?');
  expect(out).toContain('Where exactly is the pain, and does it spread anywhere?');
  expect(out).toContain('radiate(방사통) 여부는 흉통에서 반드시 물어야 해요.');
  expect(out).toContain('전체 듣기');
  expect(out).toContain('따라 말하기');
});

test('no row opens by itself, so the hero’s correction is shown once', async () => {
  const tree = await mount();
  // `open`, not the text: the shared Collapsible keeps its children MOUNTED and clips
  // them, so a collapsed row's cards are still in the tree. What the learner sees is
  // decided by this prop, and the list used to open the first row — printing the same
  // correction the hero is already working through, twice on one screen.
  expect(byName(tree.root, 'ModelAnswerGroupRow').map((n) => !!n.props.open)).toEqual([false, false]);
});

test('under 개선 필요 there is no 최근 stamp', async () => {
  const tree = await mount();
  const sortMenu = byName(tree.root, 'NbSortMenu')[0];
  await act(async () => { sortMenu.props.onSelect('needs-work'); });
  for (let i = 0; i < 6; i++) await act(async () => { await Promise.resolve(); });

  // The first group under that sort is the WORST one, not the last one — a card
  // stamped 최근 that is three weeks old is a lie about the date.
  expect(mockSorts).toContain('needs-work');
  expect(byName(tree.root, 'ModelAnswerHero')).toHaveLength(0);
  expect(texts(tree.root)).not.toContain('최근');
});

test('a department chip moves the hero to a scenario the list still contains', async () => {
  const tree = await mount();
  const icu = byName(tree.root, 'NbChip').find((n) => n.props.children === 'ICU')!;
  await act(async () => { icu.props.onPress(); });

  const out = texts(hero(tree)!);
  expect(out).toContain('ICU · 승압제 적정 보고');
  expect(out).not.toContain('ER · 흉통 환자 트리아지');
});

test('a scenario with no cards yet gets no hero rather than an empty one', async () => {
  mockGroups = [{ scenarioId: 'SCN-ER-00009', title: 'ER · 새 상황', corrections: 2, lastAt: '2026-08-03T00:00:00Z', cards: [] }];
  const tree = await mount();
  expect(byName(tree.root, 'ModelAnswerHero')).toHaveLength(0);
  // The row is still there — the scenario is the learner's whatever the page carries.
  expect(texts(tree.root)).toContain('ER · 새 상황');
});

test('전체 듣기 fetches the model sentence with the auth header, once', async () => {
  const tree = await mount();
  const listen = byName(hero(tree)!, 'Pressable').find((n) => texts(n).includes('전체 듣기'))!;
  await act(async () => { listen.props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  expect(mockFs.downloads).toHaveLength(1);
  // The endpoint is authenticated and expo-audio cannot attach a header itself, which
  // is the whole reason the clip is downloaded before it is played.
  expect(mockFs.downloads[0].auth).toBe(true);
  expect(decodeURIComponent(mockFs.downloads[0].url)).toContain('Where exactly is the pain');
  expect(mockPlayer.play).toBe(1);

  // A second tap replays the file already on disk.
  mockFs.exists = true;
  await act(async () => { listen.props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  expect(mockFs.downloads).toHaveLength(1);
  expect(mockPlayer.play).toBe(2);
});

test('a failed download is deleted rather than cached as audio', async () => {
  mockFs.status = 401;
  const tree = await mount();
  const listen = byName(hero(tree)!, 'Pressable').find((n) => texts(n).includes('전체 듣기'))!;
  await act(async () => { listen.props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  // downloadAsync writes the body whatever the status, so a 401 JSON body would be
  // cached as a WAV and replayed forever.
  expect(mockFs.deleted).toHaveLength(1);
  expect(mockPlayer.play).toBe(0);
});

test('따라 말하기 practises the MODEL sentence, not the one that was wrong', async () => {
  const tree = await mount();
  const repeat = byName(hero(tree)!, 'Pressable').find((n) => texts(n).includes('따라 말하기'))!;
  await act(async () => { repeat.props.onPress(); });

  expect(mockPushed).toHaveLength(1);
  const target = decodeURIComponent(mockPushed[0]);
  expect(target).toContain('Where exactly is the pain, and does it spread anywhere?');
  expect(target).not.toContain('Where is pain? How much?');
});
