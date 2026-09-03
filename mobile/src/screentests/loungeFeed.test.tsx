// 스태프 라운지 피드 — what the wall says about other people's words.
//
// Every check here is a way for a feed to misreport the thing it is showing, and all
// of them render:
//
//  · A cheer that paints itself but never reaches the server, or that keeps the
//    optimistic number after the server said something else.
//  · Somebody else's post offering 삭제, or your own offering only 신고 — the first
//    is a button that 403s, the second takes your own post away from you.
//  · A filter chip or a search that narrows nothing while looking like it did.
//  · Paging by offset, which re-serves rows the reader already read.
//  · 오늘의 상황판 losing its way in when the tab stopped being the board.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as
// a route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

type MockPost = {
  id: string; authorId: string; authorName: string; authorJob?: string; authorLevel?: number;
  authorAvatar?: Record<string, string>;
  kind: 'talk' | 'question' | 'share'; body: string; tags?: string[];
  scenarioId?: string; snippet?: { title?: string; turns: { index: number; role: string; text: string }[] };
  cheers: number; cheered: boolean; mine: boolean; createdAt: string;
};

const mockCalls: { feed: { before?: string; limit?: number }[]; cheer: [string, boolean][]; deleted: string[]; reported: string[] } = {
  feed: [], cheer: [], deleted: [], reported: [],
};
let mockPages: MockPost[][] = [];
let mockCheerReply = { cheers: 9, cheered: true };
let mockFeedFails = false;

jest.mock('@/api/client', () => ({
  LOUNGE_LIMITS: { body: 600, tags: 4, tagLen: 20, turns: 6, perDay: 20 },
  api: {
    lounge: async (opts?: { before?: string; limit?: number }) => {
      mockCalls.feed.push(opts ?? {});
      if (mockFeedFails) throw new Error('down');
      const page = opts?.before ? (mockPages[1] ?? []) : (mockPages[0] ?? []);
      return { posts: page, hasMore: (mockPages.length > 1) && !opts?.before };
    },
    cheerLoungePost: async (id: string, on: boolean) => { mockCalls.cheer.push([id, on]); return mockCheerReply; },
    deleteLoungePost: async (id: string) => { mockCalls.deleted.push(id); },
    reportLoungePost: async (id: string) => { mockCalls.reported.push(id); },
  },
}));

const mockPushed: string[] = [];
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: (p: string) => mockPushed.push(p), replace: () => {}, back: () => {} }),
  // The feed loads on focus, so the callback has to actually run.
  useFocusEffect: (cb: () => void | (() => void)) => {
    const { useEffect } = require('react');
    useEffect(() => cb(), []);
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Lounge from '@/app/(tabs)/lounge';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const post = (over: Partial<MockPost> = {}): MockPost => ({
  id: 'p1', authorId: 'u-grace', authorName: 'Grace RN', authorJob: '간호사', authorLevel: 12,
  kind: 'talk', body: '미국 병동에서 진짜 많이 쓰는 말 Top 3',
  cheers: 8, cheered: false, mine: false, createdAt: '2026-08-01T00:00:00Z',
  ...over,
});

beforeEach(() => {
  mockCalls.feed = []; mockCalls.cheer = []; mockCalls.deleted = []; mockCalls.reported = [];
  mockPushed.length = 0;
  mockCheerReply = { cheers: 9, cheered: true };
  mockFeedFails = false;
  mockPages = [[post()]];
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Lounge />)); });
  for (let i = 0; i < 6; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Composites, not host nodes: Pressable turns onPress into responder behaviour, so a
 *  host-only search finds nothing and "passes" whatever the button does. */
function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

async function press(node: ReactTestInstance) {
  await act(async () => { node.props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
}

test('a post is drawn with its author, its words and its cheer count', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('Grace RN');
  expect(out).toContain('미국 병동에서 진짜 많이 쓰는 말 Top 3');
  expect(out.join(' ')).toContain('응원 8');
});

test('the author is drawn with their own portrait, or a seeded one', async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { avatarSpecFromSeed } = require('@/data/nbAvatar') as typeof import('@/data/nbAvatar');
  mockPages = [[
    post({ id: 'p1', authorId: 'u-grace', authorAvatar: { skin: 'olive', hair: 'afro', hairColor: 'black', eyes: 'wink', mouth: 'smile', outfit: 'labCoat', outfitColor: 'lilac', hat: 'none', bg: 'grid', acc: 'none' } }),
    post({ id: 'p2', authorId: 'u-plain', body: '피커 안 열어봄' }),
  ]];
  const tree = await mount();
  const faces = byName(tree.root, 'NbAvatar').map((n) => n.props.spec as Record<string, string>);
  expect(faces).toHaveLength(2);
  expect(faces[0]).toMatchObject({ hair: 'afro', outfit: 'labCoat' });
  // A writer who never opened the picker still has a face, and it is the SAME one
  // their profile and the colleague list draw — seeded from the id, not invented here.
  expect(faces[1]).toEqual(avatarSpecFromSeed('u-plain'));
});

test('a shared conversation shows the quoted turns, not just a count', async () => {
  mockPages = [[post({
    kind: 'share', scenarioId: 'SCN-ER-00002', body: '이 표현 좋았어요',
    snippet: { title: 'ER · 통증 사정', turns: [
      { index: 2, role: 'npc', text: 'Where is the pain?' },
      { index: 3, role: 'user', text: 'My back, not the waist.' },
    ] },
  })]];
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('Where is the pain?');
  expect(out).toContain('My back, not the waist.');
  expect(out).toContain('ER · 통증 사정');
  expect(out.join(' ')).toContain('연속 2턴');
});

test('a cheer reaches the server and then takes the server’s number', async () => {
  const tree = await mount();
  const cheer = byName(tree.root, 'Pressable').find((n) => {
    const inner = texts(n);
    return inner.some((s) => s.startsWith('응원'));
  })!;
  await press(cheer);

  expect(mockCalls.cheer).toEqual([['p1', true]]);
  // 9, from the reply — not 8+1 by coincidence: the server may have counted somebody
  // else's cheer in between, and this is the number the card must end up showing.
  mockCheerReply = { cheers: 40, cheered: true };
  const again = await mount();
  const btn = byName(again.root, 'Pressable').find((n) => texts(n).some((s) => s.startsWith('응원')))!;
  await press(btn);
  expect(texts(again.root).join(' ')).toContain('응원 40');
});

test('a failed cheer puts the card back the way it was', async () => {
  const tree = await mount();
  const cheer = byName(tree.root, 'Pressable').find((n) => texts(n).some((s) => s.startsWith('응원')))!;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { api } = require('@/api/client') as { api: { cheerLoungePost: unknown } };
  const original = api.cheerLoungePost;
  api.cheerLoungePost = async () => { throw new Error('offline'); };
  await press(cheer);
  api.cheerLoungePost = original;

  // Still 8, and still hollow: a star left filled after a failed write tells the
  // reader their cheer landed.
  expect(texts(tree.root).join(' ')).toContain('응원 8');
});

test('your own post offers 삭제; somebody else’s offers 신고', async () => {
  mockPages = [[post({ mine: true })]];
  const mineTree = await mount();
  await press(menuButton(mineTree.root));
  expect(texts(mineTree.root).join(' ')).toContain('내 글 삭제');
  expect(texts(mineTree.root).join(' ')).not.toContain('신고하기');

  mockPages = [[post({ mine: false })]];
  const theirs = await mount();
  await press(menuButton(theirs.root));
  expect(texts(theirs.root).join(' ')).toContain('신고하기');
  expect(texts(theirs.root).join(' ')).not.toContain('내 글 삭제');
});

/** The ⋯ control: the one Pressable on a card that carries no text of its own. */
function menuButton(root: ReactTestInstance): ReactTestInstance {
  const card = byName(root, 'LoungeCard')[0];
  return byName(card, 'Pressable').find((n) => texts(n).length === 0)!;
}

test('신고 goes to the server and then says it was filed', async () => {
  const tree = await mount();
  await press(menuButton(tree.root));
  const report = byName(tree.root, 'NbButton').find((n) => n.props.icon === 'bell')!;
  await press(report);

  expect(mockCalls.reported).toEqual(['p1']);
  await press(menuButton(tree.root));
  expect(texts(tree.root).join(' ')).toContain('신고 접수됨');
});

test('삭제 takes the post off the wall and off the server', async () => {
  mockPages = [[post({ mine: true }), post({ id: 'p2', body: '남은 글', mine: true })]];
  const tree = await mount();
  await press(menuButton(tree.root));
  const del = byName(tree.root, 'NbButton').find((n) => n.props.variant === 'danger')!;
  await press(del);

  expect(mockCalls.deleted).toEqual(['p1']);
  const out = texts(tree.root).join(' ');
  expect(out).not.toContain('미국 병동에서 진짜 많이 쓰는 말 Top 3');
  expect(out).toContain('남은 글');
});

test('a filter chip actually narrows the wall', async () => {
  mockPages = [[post(), post({ id: 'p2', kind: 'question', body: 'OET 스피킹 질문이요' })]];
  const tree = await mount();
  const chip = byName(tree.root, 'NbChip').find((n) => n.props.children === '질문')!;
  await press(chip);

  const out = texts(tree.root).join(' ');
  expect(out).toContain('OET 스피킹 질문이요');
  expect(out).not.toContain('미국 병동에서 진짜 많이 쓰는 말 Top 3');
});

test('search matches the body, the author and the tags', async () => {
  mockPages = [[post(), post({ id: 'p2', body: '야간 인계 살아남기', tags: ['현지팁'] })]];
  const tree = await mount();
  const input = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];

  await act(async () => { input.props.onChangeText('현지팁'); });
  let out = texts(tree.root).join(' ');
  expect(out).toContain('야간 인계 살아남기');
  expect(out).not.toContain('미국 병동에서 진짜 많이 쓰는 말 Top 3');

  await act(async () => { input.props.onChangeText('Grace'); });
  out = texts(tree.root).join(' ');
  expect(out).toContain('미국 병동에서 진짜 많이 쓰는 말 Top 3');
});

test('the next page is asked for by TIME, not by offset', async () => {
  mockPages = [[post({ id: 'p1', createdAt: '2026-08-02T00:00:00Z' })], [post({ id: 'p9', body: '더 오래된 글' })]];
  const tree = await mount();
  const list = tree.root.findAll((n) => String(n.type) === 'FlatList' || (typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'FlatList'), { deep: true })[0];
  await act(async () => { list.props.onEndReached(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  // The oldest row the reader holds — an offset would re-serve p1 the moment somebody
  // posts while they are reading.
  expect(mockCalls.feed[1]).toEqual({ before: '2026-08-02T00:00:00Z' });
  expect(texts(tree.root)).toContain('더 오래된 글');
});

test('the lounge does not advertise 오늘의 상황판 — that lives in 일터', async () => {
  const tree = await mount();
  // It sat in this header for one commit. The board is a fact about the workplace
  // (today's situations across the hospital); the lounge is where colleagues talk, and
  // a link to another screen at the top of a feed reads as an ad for it.
  // campusSections.test.tsx is where the entry point is checked now.
  expect(texts(tree.root)).not.toContain('오늘의 상황판');
  expect(mockPushed).not.toContain('/board');
});

test('an empty wall says so instead of showing an empty page', async () => {
  mockPages = [[]];
  const tree = await mount();
  expect(texts(tree.root).join(' ')).toContain('아직 라운지가 비어 있어요');
});

test('a failed load offers a retry rather than an empty lounge', async () => {
  mockFeedFails = true;
  const tree = await mount();
  expect(texts(tree.root).join(' ')).toContain('라운지를 불러오지 못했어요');

  mockFeedFails = false;
  const retry = byName(tree.root, 'NbButton')[0];
  await press(retry);
  expect(texts(tree.root)).toContain('Grace RN');
});
