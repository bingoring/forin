// 환자 인수인계 노트 (v38 HandoffNotes) — the inbox renders each note (patient, body, the
// kind's action) from the server; a gratitude note opens a reply composer whose Send posts
// and shows the patient's reply back. The generation/eligibility logic is server-side.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));

const mockNotes = [
  { id: 'h1', kind: 'gratitude', patientName: 'Mr. Park', patientSub: '60s / M', coord: 'ER',
    body: '어제는 정말 고마웠어요. 덕분에 마음이 놓였습니다.', metAt: new Date(Date.now() - 86_400_000).toISOString(), read: false, replied: false },
  { id: 'h2', kind: 'followup', patientName: 'Baby Chloe', patientSub: '6mo / F', coord: 'PED',
    body: '열이 내렸어요. 다음 단계도 부탁드려요.', refScenarioId: 'SCN-PED-00002', metAt: new Date(Date.now() - 2 * 86_400_000).toISOString(), read: true, replied: false },
];
const mockReadCalls: string[] = [];
const mockReplied = { ...mockNotes[0], read: true, replied: true, replyText: 'Take care, Mr. Park!', patientReply: 'Thank you, I will!' };
jest.mock('@/api/client', () => ({
  api: {
    handoff: async () => ({ notes: mockNotes, unread: 1 }),
    readHandoff: async (id: string) => { mockReadCalls.push(id); },
    replyHandoff: async () => mockReplied,
  },
}));
const mockPushed: string[] = [];
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: (r: string) => { mockPushed.push(r); }, back: () => {} }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import HandoffScreen from '@/app/handoff/index';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function press(root: ReactTestInstance, label: string) {
  const target = root.findAll((n) => {
    const kids = n.children.filter((c): c is string => typeof c === 'string');
    return kids.join('') === label;
  }, { deep: true }).map((n) => {
    // Walk up to the nearest pressable.
    let p: ReactTestInstance | null = n;
    while (p && typeof p.props.onPress !== 'function') p = p.parent;
    return p;
  }).find(Boolean);
  if (!target) throw new Error(`no pressable labelled ${label}`);
  act(() => { target.props.onPress(); });
}

test('the inbox renders notes with their per-kind actions', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<HandoffScreen />); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  const all = texts(tree.root).join(' ');

  expect(all).toContain('Mr. Park'); // a note's patient
  expect(all).toContain('덕분에 마음이 놓였습니다'); // its body
  expect(all).toContain('답장 한마디'); // gratitude → reply action
  expect(all).toContain('이어서 하기'); // followup → continue action
  expect(mockReadCalls).toContain('h1'); // opening the inbox clears the unread note server-side

  await act(async () => { tree.unmount(); });
});

test('replying to a gratitude note shows the patient reply back', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<HandoffScreen />); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  press(tree.root, '답장 한마디'); // open the composer
  // Type into the reply field.
  const input = tree.root.findAll((n) => String(n.type) === 'TextInput')[0];
  act(() => { input.props.onChangeText('Take care!'); });
  press(tree.root, '보내기'); // send
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  const all = texts(tree.root).join(' ');
  expect(all).toContain('Take care, Mr. Park!'); // my reply, echoed from the server note
  expect(all).toContain('Thank you, I will!'); // the patient's reply back

  await act(async () => { tree.unmount(); });
});
