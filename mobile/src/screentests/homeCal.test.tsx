// 홈 "달력 한 장 + 버튼 하나" (handoff v47 · home-calendar-v47 §R) — the rules the
// screen owns, on the screen itself.
//
//  R2  only days with activity can be tapped; tapping the chosen day again closes it;
//      future days are faint
//  R3  a day's stamps are its CLEARED scenarios, one department doodle each, ×n
//  R4  the streak pill only once there is a streak
//  R6  the continue button only while there is a next step — else the rest card
//  결정 7  ring = the department track's progress, five cells = the theme's
//  결정 8  the doodle comes from the department code the server sent
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

const mockNav: string[] = [];
const mockData: { home: Record<string, unknown>; days: unknown[] } = { home: {}, days: [] };
jest.mock('@/api/client', () => ({
  api: {
    home: async () => mockData.home,
    calendar: async () => ({ month: '2026-09', days: mockData.days }),
    acceptPage: async () => ({ scenarioId: '' }),
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
import { continueCells } from '@/components/home/HomeCal';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const BASE_HOME = {
  date: '2026-09-16', done: false, firstRun: false, streak: 3, week: [], level: 4, xp: 420,
  situationsWaiting: 0, colleagues: [], colleagueTotal: 0, unreadCheers: 0, pendingRequests: 0,
  todayOne: {
    chapter: '본관 3F 중환자실 · 진정', title: '진정 평가', kind: 'dlg', scenarioId: 'SCN-ICU-00101',
    progress: { done: 8, total: 20 }, dept: 'ICU', deptProgress: { done: 9, total: 35 },
  },
};
const DAYS = [
  { date: '2026-09-15', band: 'evening', sessions: 1, cleared: 1, entries: [{ scenarioId: 'SCN-ICU-1', title: 'a', cleared: true, hour: 18, dept: 'ICU' }] },
  { date: '2026-09-16', band: 'evening', sessions: 3, cleared: 2, entries: [
    { scenarioId: 'SCN-ER-1', title: 'a', cleared: true, hour: 18, dept: 'ER' },
    { scenarioId: 'SCN-ER-2', title: 'b', cleared: false, hour: 19, dept: 'ER' },
    { scenarioId: 'SCN-PHARMA-1', title: 'c', cleared: true, hour: 20, dept: 'PHARMA' },
  ] },
];

beforeEach(() => {
  mockNav.length = 0;
  mockData.home = { ...BASE_HOME };
  mockData.days = DAYS;
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Home />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const one = (root: ReactTestInstance, id: string) => byID(root, id)[0];
const icons = (root: ReactTestInstance) => root.findAll((n) => typeof n.type === 'function' && typeof n.props?.name === 'string' && n.props?.size !== undefined).map((n) => n.props.name as string);
function texts(root: ReactTestInstance): string[] {
  return root.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
/** The flattened style of a Pressable cell (its style is a function of `pressed`). */
function cellStyle(cell: ReactTestInstance) {
  const st = cell.props.style;
  return typeof st === 'function' ? st({ pressed: false }) : st;
}

test('continueCells: never full before the end, never empty once begun (결정 7)', () => {
  expect(continueCells(0, 20)).toBe(0);
  expect(continueCells(1, 20)).toBe(1);   // 0.25 rounds to 0, but something is done
  expect(continueCells(8, 20)).toBe(2);
  expect(continueCells(19, 20)).toBe(4);  // 4.75 rounds to 5, but it is not finished
  expect(continueCells(20, 20)).toBe(5);
  expect(continueCells(3, 0)).toBe(0);
});

test('only days with activity respond, and the chosen day toggles (R2)', async () => {
  const tree = await mount();
  expect(one(tree.root, 'home-cal-2026-09-03').props.disabled).toBe(true);
  expect(one(tree.root, 'home-cal-2026-09-15').props.disabled).toBe(false);

  const open = () => byID(tree.root, 'home-day-stamps').length > 0;
  expect(open()).toBe(false);
  await act(async () => { one(tree.root, 'home-cal-2026-09-16').props.onPress(); });
  expect(open()).toBe(true);
  await act(async () => { one(tree.root, 'home-cal-2026-09-16').props.onPress(); });
  expect(open()).toBe(false);
});

test('future days are faint; today carries the red circle and nothing else does (R2)', async () => {
  const tree = await mount();
  expect(cellStyle(one(tree.root, 'home-cal-2026-09-20')).opacity).toBe(0.45);
  expect(cellStyle(one(tree.root, 'home-cal-2026-09-15')).opacity).toBe(1);
  const circles = byID(tree.root, 'home-cal-today');
  expect(circles).toHaveLength(1);
  // …inside today's cell.
  expect(byID(one(tree.root, 'home-cal-2026-09-16'), 'home-cal-today')).toHaveLength(1);
});

test("a day's stamps are its cleared scenarios, by department, ×n (R3 · 결정 8)", async () => {
  const tree = await mount();
  await act(async () => { one(tree.root, 'home-cal-2026-09-16').props.onPress(); });
  const stamps = one(tree.root, 'home-day-stamps');
  // Three attempts, two cleared: the unfinished one is not a stamp.
  expect(new Set(byID(stamps, 'home-day-stamp').map((n) => n.props.style)).size).toBe(2);
  expect(texts(stamps).join('')).toContain('×2');
  const drawn = icons(stamps);
  expect(drawn).toContain('siren'); // ER
  expect(drawn).toContain('pill');  // PHARMA
});

test('the streak pill shows only once there is a streak (R4)', async () => {
  let tree = await mount();
  expect(byID(tree.root, 'home-streak')).toHaveLength(1);
  expect(texts(one(tree.root, 'home-streak'))).toContain('3');
  mockData.home = { ...BASE_HOME, streak: 0 };
  tree = await mount();
  expect(byID(tree.root, 'home-streak')).toHaveLength(0);
});

test('the continue button: department doodle, ring of the track, cells of the theme (결정 7·8)', async () => {
  const tree = await mount();
  const btn = one(tree.root, 'home-continue');
  expect(icons(btn)).toContain('monitor'); // ICU, from the code — not the old hard-coded siren
  expect(icons(btn)).not.toContain('siren');
  // 8/20 of the theme → 2 of 5 cells.
  expect(byID(btn, 'home-continue-cell-on')).toHaveLength(2);
  expect(byID(btn, 'home-continue-cell-off')).toHaveLength(3);
  // 9/35 of the ICU track → the ring's arc is that fraction of the circumference.
  const arc = one(btn, 'home-continue-ring');
  const len = Number(String(arc.props.strokeDasharray).split(' ')[0]);
  expect(len).toBeCloseTo(2 * Math.PI * 25 * (9 / 35), 3);

  await act(async () => { btn.props.onPress(); });
  expect(mockNav).toEqual(['/scenario/SCN-ICU-00101']);
});

test('with nothing left to continue, the rest card stands in its place (R6)', async () => {
  const { todayOne: _drop, ...rest } = BASE_HOME;
  mockData.home = { ...rest, done: true };
  const tree = await mount();
  expect(byID(tree.root, 'home-continue')).toHaveLength(0);
  expect(texts(tree.root)).toContain('오늘 할 일은 끝났어요');
});

test('the face opens the 나 tab', async () => {
  const tree = await mount();
  await act(async () => { one(tree.root, 'home-face').props.onPress(); });
  expect(mockNav).toEqual(['/me']);
});
