// 나이트 근무 라디오 (v38) — the radio and tonight's story render from the server. Only that
// the story, its key line, and the follow-along button show; the night time-gate and audio
// are UX/asset concerns, not asserted here.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));

const RADIO = {
  total: 6, index: 0,
  story: {
    id: 'nr-001', title: '새벽 3시, 502호의 콜벨',
    body: '콜벨이 두 번 울렸다 끊겼다.',
    keyLine: 'Would you like some warm milk, or shall I sit with you for a bit?',
    keyGloss: '따뜻한 우유 드릴까요, 아니면 잠시 곁에 있어 드릴까요?',
  },
};
jest.mock('@/api/client', () => ({ api: { night: async () => RADIO } }));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, back: () => {} }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import NightRadio from '@/app/night/index';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('the radio shows tonight’s story and its line to practice', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<NightRadio />); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  const all = texts(tree.root).join(' ');
  await act(async () => { tree.unmount(); });

  expect(all).toContain('ON AIR');
  expect(all).toContain('오늘 밤의 이야기'); // storyTag
  expect(all).toContain('새벽 3시, 502호의 콜벨'); // story title
  expect(all).toContain('Would you like some warm milk'); // the English key line
  expect(all).toContain('이 문장 따라 말하기'); // follow-along
});
