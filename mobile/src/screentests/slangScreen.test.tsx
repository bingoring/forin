// 병원 은어 도감 (v38 SlangDeck) — the day's card and the collected grid render from the
// server deck. Only that the screen shows the featured card, the collect action, and the
// cards already collected; the daily-drop logic is server-side.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));

const DECK = {
  collectedCount: 2, total: 50, masterAt: 30, master: false, collectableToday: true,
  todayCard: { id: 'sl-030', number: 30, code: 'code brown', meaning: '대변 사고 처리 상황', example: "We've got a code brown in 12.", hidden: true },
  collected: [
    { id: 'sl-001', number: 1, code: 'stat', meaning: '지금 당장' },
    { id: 'sl-002', number: 2, code: 'PRN', meaning: '필요시' },
  ],
};
jest.mock('@/api/client', () => ({
  api: { slang: async () => DECK, collectSlang: async () => DECK },
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
import SlangDeckScreen from '@/app/slang/index';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('the deck shows the day card and the collected grid', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<SlangDeckScreen />); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  const all = texts(tree.root).join(' ');
  await act(async () => { tree.unmount(); });

  expect(all).toContain('code brown'); // the day's card code
  expect(all).toContain('대변 사고 처리 상황'); // its meaning (server-resolved)
  expect(all).toContain('도감에 붙이기'); // collectable → the collect action
  expect(all).toContain('stat'); // a collected card in the grid
  expect(all).toContain('PRN');
});
