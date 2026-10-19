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

test('the hub shows two tiles, plays as dots, and Locked chips for the unbuilt games', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<GameHub />); });
  const all = texts(tree.root).join(' ');
  expect(tree.root.findAllByProps({ testID: 'games-tile-circle' }).length).toBeGreaterThan(0);
  expect(tree.root.findAllByProps({ testID: 'games-tile-hoops' }).length).toBeGreaterThan(0);
  expect(tree.root.findAll((n) => n.props.testID === 'v48-locked' && typeof n.type === 'string').length).toBe(2); // plane · pen cap, no copy
  expect(tree.root.findAllByProps({ testID: 'games-dot-on' }).length + tree.root.findAllByProps({ testID: 'games-dot-off' }).length).toBeGreaterThan(0);
  act(() => { tree.unmount(); });
  expect(all).not.toContain('준비 중');
  expect(all).not.toContain('시작');
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
