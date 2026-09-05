// The break-time game hub and the circle game render (v38 GameHub · CircleGame).
//
// Only that they mount and show their key copy — the drawing/scoring is unit-tested by the
// math, not the tree. Home entry, the game grid, and the canvas prompt.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: () => {}, back: () => {} }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import GameHub from '@/app/games/index';
import CircleGame from '@/app/games/circle';
import { MAX_PLAYS_PER_DAY, startPlay } from '@/lib/gameScores';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('the hub lists the games and gates by the daily limit', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<GameHub />); });
  const all = texts(tree.root).join(' ');
  act(() => { tree.unmount(); });
  expect(all).toContain('탭탭 슛'); // the new playable game
  expect(all).toContain('완벽한 원 그리기'); // the other playable game
  expect(all).toContain('종이비행기 날리기'); // a 준비 중 game is still listed
  expect(all).toContain('준비 중'); // ...and marked not-ready
  expect(all).toContain('시작');
});

test('using up the daily plays offers a rewarded ad for more', () => {
  for (let i = 0; i < MAX_PLAYS_PER_DAY; i++) startPlay(); // exhaust today's allowance
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<GameHub />); });
  const all = texts(tree.root).join(' ');
  act(() => { tree.unmount(); });
  expect(all).toContain('오늘 판을 다 썼어요'); // the out-of-plays notice
  expect(all).toContain('광고 보고'); // the rewarded-ad top-up button
});

test('the circle game shows the canvas prompt', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<CircleGame />); });
  const all = texts(tree.root).join(' ');
  act(() => { tree.unmount(); });
  expect(all).toContain('점선 원을 따라 한 붓에 그리세요');
});
