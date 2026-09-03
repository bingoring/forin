// 대화 공유하기 / 글쓰기 — the screen where the consecutive-turn rule is visible.
//
// The rule is not cosmetic: a snippet with a hole in it reads as one exchange and is
// two, so it misrepresents what the patient said. The server refuses such a draft;
// this screen has to refuse it BEFORE the learner writes a paragraph to go with it.
//
// What renders here:
//  · A turn that would create a gap is locked, and the ends of the run are not.
//  · At the six-turn ceiling nothing new opens, and the ends still close.
//  · What is posted is what was picked: the exact turns, in order, with the body
//    trimmed and the tags hash-free.
//  · 대화 공유 with nothing to quote says where the conversation comes from instead
//    of offering an empty picker.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

const mockPosted: Record<string, unknown>[] = [];
let mockPostFails: string | null = null;

jest.mock('@/api/client', () => ({
  LOUNGE_LIMITS: { body: 600, tags: 4, tagLen: 20, turns: 6, perDay: 20 },
  api: {
    postToLounge: async (draft: Record<string, unknown>) => {
      if (mockPostFails) {
        throw { response: { data: { error: mockPostFails } } };
      }
      mockPosted.push(draft);
      return { id: 'p-new' };
    },
  },
}));

let mockBack = 0;
let mockKindParam: string | undefined;
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => { mockBack += 1; } }),
  useLocalSearchParams: () => ({ kind: mockKindParam }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Compose from '@/app/lounge/compose';
import { clearShareSource, offerShareSource } from '@/data/loungeShare';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const TURNS = [
  { index: 0, role: 'user' as const, text: 'Hello Mrs. Hopkins, I am your nurse today.' },
  { index: 1, role: 'npc' as const, text: "It's my back… really sharp." },
  { index: 2, role: 'user' as const, text: 'Where is the pain?' },
  { index: 3, role: 'npc' as const, text: 'My back… not the waist, the BACK.' },
  { index: 4, role: 'user' as const, text: 'Got it — your upper back?' },
  { index: 5, role: 'npc' as const, text: "Yes! Finally. It's a nine." },
  { index: 6, role: 'user' as const, text: 'When did it start?' },
];

beforeEach(() => {
  mockPosted.length = 0;
  mockPostFails = null;
  mockBack = 0;
  mockKindParam = 'share';
  clearShareSource();
  offerShareSource({ scenarioId: 'SCN-ER-00002', title: 'ER · 통증 사정', turns: TURNS });
});

afterEach(() => { clearShareSource(); });

function mount() {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<Compose />)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

/** The turn rows, in order — each is the Pressable that carries one turn's text. */
function turnRows(root: ReactTestInstance): ReactTestInstance[] {
  return byName(root, 'Pressable').filter((n) => texts(n).some((s) => TURNS.some((turn) => turn.text === s)));
}

const pick = (tree: ReturnType<typeof create>, i: number) =>
  act(() => { turnRows(tree.root)[i].props.onPress(); });

/** disabled is the only thing that says locked: Pressable turns it into responder
 *  behaviour, so no host node carries it and a host-only search would find nothing. */
const locked = (tree: ReturnType<typeof create>) => turnRows(tree.root).map((n) => !!n.props.disabled);

test('with nothing picked yet, every turn is open', () => {
  const tree = mount();
  expect(locked(tree)).toEqual([false, false, false, false, false, false, false]);
});

test('a turn that would leave a hole is locked; the ends of the run are not', () => {
  const tree = mount();
  pick(tree, 2);
  // Only 1, 2 and 3 are tappable: 2 to take it back, 1 and 3 to extend the run. Turn 4
  // would leave turn 3 out, and that snippet would read as one exchange when it is two.
  expect(locked(tree)).toEqual([true, false, false, false, true, true, true]);

  pick(tree, 3);
  expect(locked(tree)).toEqual([true, false, false, false, false, true, true]);
});

test('at the six-turn ceiling the run stops growing', () => {
  const tree = mount();
  for (const i of [0, 1, 2, 3, 4, 5]) pick(tree, i);
  expect(texts(tree.root).join(' ')).toContain('6턴 선택됨');
  // Turn 6 is no longer reachable — the ceiling is the handoff's 최대 6턴, and the
  // server refuses a seventh anyway.
  expect(locked(tree)[6]).toBe(true);
  // The ends still come back off, or a mis-tap at the ceiling would be permanent.
  expect(locked(tree)[5]).toBe(false);
});

test('what gets posted is what was picked, in order', async () => {
  const tree = mount();
  pick(tree, 2);
  pick(tree, 3);
  const body = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
  act(() => { body.props.onChangeText('  발음 때문에 세 번 말했어요  '); });
  const tag = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[1];
  act(() => { tag.props.onChangeText('#통증사정'); });
  act(() => { tag.props.onSubmitEditing(); });

  const pin = byName(tree.root, 'NbButton').find((n) => n.props.icon === 'pushpin')!;
  await act(async () => { pin.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockPosted).toHaveLength(1);
  const draft = mockPosted[0] as {
    kind: string; body: string; tags: string[]; scenarioId: string;
    snippet: { title: string; turns: { index: number; text: string }[] };
  };
  expect(draft.kind).toBe('share');
  expect(draft.body).toBe('발음 때문에 세 번 말했어요');   // trimmed
  expect(draft.tags).toEqual(['통증사정']);               // no leading #
  expect(draft.scenarioId).toBe('SCN-ER-00002');
  expect(draft.snippet.turns.map((x) => x.index)).toEqual([2, 3]);
  expect(draft.snippet.turns[0].text).toBe('Where is the pain?');
});

test('a share cannot be posted with no turns picked, or with no words', () => {
  const tree = mount();
  const pinOf = () => byName(tree.root, 'NbButton').find((n) => n.props.icon === 'pushpin')!;
  const body = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];

  act(() => { body.props.onChangeText('한마디만 씁니다'); });
  expect(pinOf().props.disabled).toBe(true);   // words but no turns

  pick(tree, 2);
  expect(pinOf().props.disabled).toBe(false);

  act(() => { body.props.onChangeText('   '); });
  expect(pinOf().props.disabled).toBe(true);   // turns but no words
});

test('대화 공유 with nothing to quote says where a conversation comes from', () => {
  clearShareSource();
  const tree = mount();
  const out = texts(tree.root).join(' ');
  expect(out).toContain('공유할 대화가 없어요');
  // And no picker: an empty list under a rule about picking turns is a dead end.
  expect(turnRows(tree.root)).toHaveLength(0);
});

test('a plain note carries no conversation, even when one is on offer', async () => {
  const tree = mount();
  const talk = byName(tree.root, 'NbChip').find((n) => n.props.children === '일상')!;
  act(() => { talk.props.onPress(); });

  const body = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
  act(() => { body.props.onChangeText('오늘 밤 근무 화이팅'); });
  const pin = byName(tree.root, 'NbButton').find((n) => n.props.icon === 'pushpin')!;
  await act(async () => { pin.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  const draft = mockPosted[0] as { kind: string; snippet?: unknown; scenarioId?: string };
  expect(draft.kind).toBe('talk');
  // Quoted material with no header saying where it came from is exactly what the
  // domain strips — the client must not send it in the first place.
  expect(draft.snippet).toBeUndefined();
  expect(draft.scenarioId).toBeUndefined();
});

test('the server’s rejection is shown, not replaced with “실패”', async () => {
  mockPostFails = 'lounge: daily post limit reached';
  const tree = mount();
  pick(tree, 2);
  const body = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
  act(() => { body.props.onChangeText('하루 스무 번째 글'); });
  const pin = byName(tree.root, 'NbButton').find((n) => n.props.icon === 'pushpin')!;
  await act(async () => { pin.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(texts(tree.root).join(' ')).toContain('daily post limit reached');
  expect(mockBack).toBe(0);   // and the draft is still on screen to fix
});

test('a posted share is consumed, so tomorrow’s note carries nothing', async () => {
  const tree = mount();
  pick(tree, 2);
  const body = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
  act(() => { body.props.onChangeText('공유합니다'); });
  const pin = byName(tree.root, 'NbButton').find((n) => n.props.icon === 'pushpin')!;
  await act(async () => { pin.props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockBack).toBe(1);
  // Re-opening 글쓰기 must not staple the same conversation to a different note.
  const again = mount();
  expect(texts(again.root).join(' ')).toContain('공유할 대화가 없어요');
});

test('opened without a kind, the screen starts on 일상', () => {
  mockKindParam = undefined;
  const tree = mount();
  const on = byName(tree.root, 'NbChip').filter((n) => n.props.on).map((n) => n.props.children);
  expect(on).toEqual(['일상']);
});
