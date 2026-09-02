// 동료 목록·상세, in the 근무 수첩 line (v30).
//
// The rules watched here are the ones that were WRONG in the app at some point, or that
// would be wrong invisibly:
//
//  · Whether somebody came in today is the thing the list is opened to check. A row that
//    reads the same either way is a list of names.
//  · A block a colleague chose not to share is a locked note, not an empty week or a
//    zero. Drawing seven empty boxes says "they did nothing", which is a different claim.
//  · The CEFR band and the XP level are two different numbers under two different labels.
//    They shared one "Lv." field once, so the same row meant B1 for one colleague and 12
//    for the next.
//  · An unknown relation renders nothing. Falling back to "peer" states a relationship
//    the server never claimed.
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
jest.mock('expo-clipboard', () => ({ setStringAsync: async () => {} }));
jest.mock('@/lib/sfx', () => ({
  playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {},
  isSfxMuted: () => false, setSfxMuted: async () => {},
}));

const mockNav: string[] = [];
const mockDetail: Record<string, unknown> = {};
jest.mock('@/api/client', () => ({
  api: {
    colleagues: async () => ({
      colleagues: [
        { id: 'a', name: '수진', relation: 'peer', targetLevel: 'B1', streak: 21, activeToday: true, activity: 'ER 통증 사정' },
        { id: 'b', name: '민호', relation: 'mentee', targetLevel: 'A2', streak: 8, activeToday: false },
      ],
      pendingRequests: 0,
      unreadCheers: 2,
    }),
    colleagueRequests: async () => [{ id: 'r1', from: 'z', name: '하영', relation: 'peer', createdAt: '' }],
    inviteCode: async () => ({ code: 'AB12-CD34', maxUses: 5, uses: 1 }),
    cheerInbox: async () => [],
    sendCheer: async () => {},
    colleague: async () => mockDetail,
    removeColleague: async () => {},
  },
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: (p: string) => { mockNav.push(p); }, replace: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({ id: 'a' }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Colleagues from '@/app/colleagues/index';
import Detail from '@/app/colleagues/[id]';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const BASE_DETAIL = {
  id: 'a', name: '수진', relation: 'peer', targetLevel: 'B1', level: 12, streak: 21,
  destination: 'us', activity: 'ER 통증 사정', activeDates: [], cheers: [],
};

beforeEach(() => {
  mockNav.length = 0;
  Object.keys(mockDetail).forEach((k) => delete mockDetail[k]);
  Object.assign(mockDetail, BASE_DETAIL);
});

async function mount(node: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(node)); });
  await act(async () => { await Promise.resolve(); });
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

function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

test('the list says who came in today and who has not', async () => {
  const tree = await mount(<Colleagues />);
  const out = texts(tree.root).join(' | ');
  expect(out).toContain('수진');
  expect(out).toContain('오늘 출근');
  expect(out).toContain('아직 안 왔어요');
});

test('mentor and mentee are shown as themselves, not flattened to peer', async () => {
  // The relation is in the data and this screen renders it as it is, so a local-nurse
  // mentor arriving later needs no change here.
  const tree = await mount(<Colleagues />);
  expect(texts(tree.root)).toContain('멘티');
});

test('the invite code is typed, and cheering opens the sheet for that person', async () => {
  const tree = await mount(<Colleagues />);
  const mono = tree.root.findAll(
    (n) => String(n.type) === 'Text' && String(flatten(n.props?.style).fontFamily).startsWith('IBMPlexMono'),
    { deep: true },
  ).flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
  expect(mono).toContain('AB12-CD34');

  const cheer = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbButton' && String(n.props?.children) === '응원',
    { deep: true },
  );
  expect(cheer.length).toBe(2);
  await act(async () => { cheer[0].props.onPress(); });
  // The sheet names the person being cheered — a sheet with the wrong name sends it to
  // the wrong colleague, which the screen cannot take back.
  expect(texts(tree.root).join(' ')).toContain('수진');
  // And it did not navigate into their profile on the way.
  expect(mockNav).toEqual([]);
});

test('a request waiting on you is the one coloured card', async () => {
  const tree = await mount(<Colleagues />);
  expect(texts(tree.root).join(' ')).toContain('하영');
  expect(styled(tree.root, (s) => s.backgroundColor === '#FFF0EC').length).toBe(1);
  expect(texts(tree.root)).toContain('수락');
});

test('a hidden week is a locked note, not an empty one', async () => {
  // Seven empty boxes would say "they did nothing this week". That is a claim about them;
  // the truth is that they did not share it.
  mockDetail.weeklyHidden = true;
  const tree = await mount(<Detail />);
  expect(texts(tree.root)).not.toContain('이번 주 학습');
  expect(styled(tree.root, (s) => s.borderStyle === 'dashed' && s.borderColor === 'rgba(62,54,43,.28)').length).toBe(1);
  const locks = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon' && n.props?.name === 'lock',
    { deep: true },
  );
  expect(locks.length).toBe(1);
});

test('the band and the XP level are two labelled numbers, not one field taking turns', async () => {
  const tree = await mount(<Detail />);
  const out = texts(tree.root);
  expect(out).toContain('B1');
  expect(out).toContain('12');
  expect(out).toContain('LV');
});

test('a day they came in is ticked, in green', async () => {
  // Same mark the app uses everywhere for "somebody did this" — a filled box alone says a
  // cell has a state.
  const today = new Date();
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  mockDetail.activeDates = [key];
  const tree = await mount(<Detail />);
  const ticks = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon'
      && n.props?.name === 'check' && n.props?.color === nb.green,
    { deep: true },
  );
  expect(ticks.length).toBe(1);
});
