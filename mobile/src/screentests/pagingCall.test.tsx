// 오늘의 호출 (v27) — on the surface that actually renders it: since v47 the home's call
// BADGE (a ringing pager in the top row, components/home/HomeCal CallBadge). The badge has
// no words of its own; its line is its accessibility label.
//
// The rules the badge owns (the rest belong to the server: which scenario, when it was
// issued, how long is left, whether it was answered, what the bonus is worth):
//
//  · An expired, unanswered call is not drawn at all.
//  · An ACCEPTED call outlives its countdown — the window is for deciding, and dropping
//    the badge at 00:00 would strand somebody mid-conversation with no way back.
//  · Taking the call is not answering it, and the server is asked FIRST — entering before
//    it answers would let an expired call still be played.
//  · An answered call is gone.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

const mockPage: { value: Record<string, unknown> | undefined } = { value: undefined };
const mockNav: string[] = [];
jest.mock('@/api/client', () => ({
  api: {
    home: async () => ({
      date: '2026-09-02', done: false, firstRun: false, streak: 3, week: [1, 0, 1, 1, 0, 1, 1],
      level: 4, xp: 420, situationsWaiting: 2, colleagues: [], colleagueTotal: 0,
      unreadCheers: 0, pendingRequests: 0,
      page: mockPage.value,
    }),
    calendar: async () => ({ month: '2026-09', days: [] }),
    acceptPage: async () => { mockNav.push('accept'); return { scenarioId: 'SCN-ER-00002' }; },
  },
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: (p: string) => { mockNav.push(String(p)); }, replace: () => {}, back: () => {} }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Home from '@/app/(tabs)/index';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const PAGE = {
  scenarioId: 'SCN-ER-00002',
  line: '3병동 환자 통증 호소! 담당 간호사 응답 바랍니다.',
  hint: '응답하면 통증 사정 단기 시나리오로 바로 입장 · 약 3분',
  secondsLeft: 2_592,
  totalSeconds: 3_600,
  accepted: false,
  answered: false,
  bonusXp: 40,
};

beforeEach(() => { mockNav.length = 0; mockPage.value = { ...PAGE }; });

async function mount(over: Partial<typeof PAGE> = {}) {
  mockPage.value = { ...PAGE, ...over };
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Home />)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

const badge = (root: ReactTestInstance) => root.findAll((n) => n.props?.testID === 'home-call' && typeof n.props?.onPress === 'function')[0];

test('an open call rings, and says what it is to a screen reader', async () => {
  const tree = await mount();
  const b = badge(tree.root);
  expect(b).toBeDefined();
  expect(b.props.accessibilityLabel).toContain('3병동 환자 통증 호소');
});

test('an expired call is not drawn at all', async () => {
  // A badge offering an action that cannot be taken is worse than no badge.
  const tree = await mount({ secondsLeft: 0 });
  expect(badge(tree.root)).toBeUndefined();
});

test('an accepted call outlives its countdown', async () => {
  // The window is for DECIDING. Once taken, the scenario is theirs to finish.
  const tree = await mount({ accepted: true, secondsLeft: 0 });
  expect(badge(tree.root)).toBeDefined();
});

test('taking the call asks the server first, and is not answering it', async () => {
  const tree = await mount();
  await act(async () => { badge(tree.root).props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  // Accepted on the server, THEN into the scenario.
  expect(mockNav[0]).toBe('accept');
  expect(mockNav.join(' ')).toContain('SCN-ER-00002');
  // …and the badge stays: it is the way back in until the server says it was answered.
  expect(badge(tree.root)).toBeDefined();
});

test('an answered call is gone', async () => {
  const tree = await mount({ answered: true });
  expect(badge(tree.root)).toBeUndefined();
});
