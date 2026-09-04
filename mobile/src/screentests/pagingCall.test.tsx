// 오늘의 호출 (v27) — on the surface that actually renders it.
//
// This file used to mount `components/home/PagingCall`, the navy pixel pager. The home
// screen does not render it any more: v29 replaced it with the taped red-pen note the home
// page draws itself (PageNote in app/(tabs)/index.tsx). So the suite was green while
// guarding a component nobody could see — and one of the rules it guarded HAD been lost in
// the port: an expired call was still being drawn, offering an action that could no longer
// be taken. The pixel component is deleted and the rules now sit on the live note.
//
// The rules the note owns (the rest belong to the server: which scenario, when it was
// issued, how long is left, whether it was answered, what the bonus is worth):
//
//  · An expired, unanswered call is not drawn at all.
//  · An ACCEPTED call outlives its countdown — the window is for deciding, and dropping
//    the note at 00:00 would strand somebody mid-conversation with no way back.
//  · Taking the call is not answering it. "Answered" used to be set on the tap, so walking
//    straight out of the scenario still reported +40 XP.
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
    me: async () => ({ profile: { displayName: '지민' } }),
    colleaguePrefs: async () => ({ shareStatus: true, shareWeekly: true, shareWard: true }),
    acceptPage: async () => ({ scenarioId: 'SCN-ER-00002' }),
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

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
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

test('the note carries the summons, the bonus and how long is left', async () => {
  const tree = await mount();
  const out = texts(tree.root).join(' ');
  expect(out).toContain('3병동 환자 통증 호소');
  // The bonus arrives as three Text children ("+", "40", " XP"), so the join carries the
  // spaces between them — what matters is that the number is on the page beside the call.
  expect(out).toMatch(/\+\s*40\s+XP/);
  // Minutes, not a ticking clock: the number came from the server on this read and the
  // note is one line in a page, not a device with a display.
  expect(out).toMatch(/4[23]분 남음/);
});

test('an expired call is not drawn at all', async () => {
  // A note offering an action that cannot be taken is worse than no note. This is the
  // rule the port lost — it was guarded on the pixel pager, which nothing rendered.
  const tree = await mount({ secondsLeft: 0 });
  expect(texts(tree.root).join(' ')).not.toContain('3병동 환자 통증 호소');
});

test('an accepted call outlives its countdown', async () => {
  // The window is for DECIDING. Once taken, the scenario is theirs to finish.
  const tree = await mount({ accepted: true, secondsLeft: 0 });
  const out = texts(tree.root).join(' ');
  expect(out).toContain('3병동 환자 통증 호소');
  expect(out).toContain('이어서');
});

test('taking the call is not answering it', async () => {
  const tree = await mount();
  await press(tree.root, '응답!');
  await act(async () => { await Promise.resolve(); });

  // It entered the scenario…
  expect(mockNav.join(' ')).toContain('SCN-ER-00002');
  // …and the note now offers a way back IN, not a receipt. The bonus is the server's to
  // grant on the next home read.
  const out = texts(tree.root).join(' ');
  expect(out).toContain('이어서');
  expect(out).not.toContain('응답 완료');
});

test('an answered call says so, and cannot be answered again', async () => {
  const tree = await mount({ answered: true });
  const out = texts(tree.root).join(' ');
  expect(out).toContain('응답 완료');
  expect(out).not.toContain('지금 응답');
});
