// 탭탭 슛 (v38 HoopsGame) — the scoring rule (clean = 2, two in a row → fire → 3, bank = 1)
// is pure and unit-tested here; the physics loop is not. A light render check confirms the
// ready screen shows before any tap.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));
jest.mock('@/lib/gameScores', () => ({
  recordBest: () => {},
  useBestScore: () => 26,
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, back: () => {} }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import HoopsGame, { pointsFor, nextStreak } from '@/app/games/hoops';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('a clean streak scores 2, 2, then 3; a bank scores 1 and resets it', () => {
  // Walk the exact sequence from the spec: two clean 2-pointers light the fire, the next
  // clean is a 3, and a bank drops to 1 and puts the fire out.
  let streak = 0;
  const log: number[] = [];
  for (const clean of [true, true, true, false, true]) {
    log.push(pointsFor(clean, streak));
    streak = nextStreak(clean, streak);
  }
  expect(log).toEqual([2, 2, 3, 1, 2]);
});

test('a bank is always 1, however long the streak', () => {
  expect(pointsFor(false, 0)).toBe(1);
  expect(pointsFor(false, 9)).toBe(1);
  expect(nextStreak(false, 9)).toBe(0);
});

test('the ready screen shows the tap prompt and the best score before play', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<HoopsGame />); });
  for (let i = 0; i < 3; i++) await act(async () => { await Promise.resolve(); });
  const all = texts(tree.root).join(' ');
  await act(async () => { tree.unmount(); });

  expect(all).toContain('탭해서 시작'); // ready prompt
  expect(all).toContain('최고 26'); // best from the mocked store
});
