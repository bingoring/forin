// 홈의 두 바로가기 버튼 — 일터(→ /journey)와 오늘의 상황판(→ /board).
//
// Neither had a test. Task 13 removed the board link that used to live in 일터's own
// header (campus.tsx, before it became the journey map) — the button here is the one
// surviving entry point for it outside the lounge header, and nothing proved it still
// worked. A loungeFeed.test.tsx comment claimed this coverage existed elsewhere; it did
// not (code review, Task 13 follow-up) — this file is that missing coverage.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

jest.mock('@/api/client', () => ({
  api: {
    home: async () => ({
      date: '2026-09-20', done: false, firstRun: false, streak: 1, week: [0, 0, 0, 0, 0, 0, 0],
      level: 1, xp: 0, situationsWaiting: 0, colleagues: [], colleagueTotal: 0, unreadCheers: 0, pendingRequests: 0,
      todayOne: null,
      brief: { reviewCount: 0, reviewTarget: 0, reviewDone: false, curriculumDone: false },
      phrase: { id: 'p1', en: 'How are you feeling?', ko: '기분이 어떠세요?' },
    }),
    me: async () => ({ profile: { displayName: '지민' } }),
    colleaguePrefs: async () => ({ shareStatus: true, shareWeekly: true, shareWard: true }),
    handoff: async () => ({ notes: [], unread: 0 }),
  },
}));

const mockPushed: string[] = [];
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: (p: string) => mockPushed.push(p), replace: () => {}, back: () => {} }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Home from '@/app/(tabs)/index';
import { trackMounts } from '@/testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** react-test-renderer's `findAllByType(Pressable)` is unreliable in this jest
 *  environment (two module instances) — CurrentStationBar.test.tsx and
 *  StationSheet.test.tsx already worked around it by matching the pressable that WRAPS
 *  the button's own label text instead. */
function pressableWithText(root: ReactTestInstance, label: string): ReactTestInstance {
  return root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes(label),
    { deep: true },
  )[0];
}

beforeEach(() => { mockPushed.length = 0; });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Home />)); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

test('일터 바로가기는 /journey로 간다', async () => {
  const tree = await mount();
  const button = pressableWithText(tree.root, '일터');
  expect(button).toBeTruthy();
  await act(async () => { button.props.onPress(); });
  expect(mockPushed).toContain('/journey');
  expect(mockPushed).not.toContain('/campus');
});

test('오늘의 상황판(라운지) 바로가기는 /board로 간다', async () => {
  const tree = await mount();
  const button = pressableWithText(tree.root, '라운지');
  expect(button).toBeTruthy();
  await act(async () => { button.props.onPress(); });
  expect(mockPushed).toContain('/board');
});
