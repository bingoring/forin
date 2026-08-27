// The Review Lab's three sections (v26): 교정 노트 / 말하기 / 모범답안.
//
// This screen used to stack everything on one scroll and put 말하기·모범답안 in the
// CATEGORY CHIP ROW as sentinel ids — two entries beside "ER" and "통증" that
// navigated away instead of filtering, because neither one's items are PhraseCards.
// v26 makes them sections. The tests below are written against the RENDERED output
// rather than the source, because the failure that mattered here is not "the string
// is absent from the file" but "tapping the tab shows the wrong thing".
//
// Outside src/app deliberately: expo-router bundles every .ts/.tsx under the app
// root as a route, so a test file there crashes the app on launch with
// "Property 'jest' doesn't exist" (routeHygiene.test.ts enforces this).
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));
jest.mock('expo-speech', () => ({ speak: () => {}, stop: () => {} }));

// useFocusEffect RUNS. Mocked as a no-op it renders the spinner forever, and every
// assertion below would pass against a loading screen.
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

// Shaped like the real thing: topic_tag is EMPTY (nothing writes it — see deptOf),
// the department lives in context.dept as "DEPT · ROOM", and both card kinds exist.
const mockCard = {
  id: 'r1',
  source: 'correction',
  front: 'I want to ask about your pain.',
  back: 'Can you tell me about your pain?',
  note: '"I want to ask"는 직역체예요.',
  topicTag: '',
  masteryPips: 1,
  favorite: false,
  context: { title: '흉통 환자 트리아지', dept: 'ER · TRIAGE', situation: '흉통 환자에게 통증 양상을 묻는 장면', npc: 'It hurts right here.' },
};
const mockCardIcu = {
  ...mockCard,
  id: 'r2',
  front: 'The patient condition is not good.',
  back: 'The patient is deteriorating.',
  context: { title: 'SBAR 인계', dept: 'ICU · BEDSIDE', situation: '야간 당직 의사에게 보고하는 장면', npc: '' },
};
// source 'grade' = the end-of-scenario "you could have said this". Never said aloud,
// so it is not a correction and the card does not strike it through.
const mockCardTip = {
  ...mockCard,
  id: 'r3',
  source: 'grade',
  front: '통증이 어디로 퍼지는지 묻기',
  back: 'Does the pain spread anywhere?',
  context: { ...mockCard.context, title: '흉통 환자 트리아지' },
};

// Flipped by the "nothing to filter" test: every card in one department, one kind.
const mockUniform = { on: false };
// Flipped by the loading test. `mock`-prefixed, like every other fixture here, because
// the jest.mock factory below is hoisted above them all and may only close over names
// with that prefix.
const mockPending = { on: false };
const mockSpeak = {
  total: 128,
  low: 12,
  mid: 40,
  high: 76,
  weakest: [{ sentenceKey: 's1', referenceText: 'Please bear with me for a moment.', recognized: '', overall: 64, accuracy: 64, fluency: 64, completeness: 64, attempts: 2 }],
};
const mockModels = { total: 34, groups: [], more: 30 };

jest.mock('@/api/client', () => ({
  api: {
    reviewDue: async () => (mockUniform.on ? [{ ...mockCard }, { ...mockCard, id: 'r9' }] : [{ ...mockCard }, { ...mockCardIcu }, { ...mockCardTip }]),
    // A promise that never settles is what "still in flight" actually is. Returning
    // undefined or rejecting would test a different state.
    speakSummary: () => (mockPending.on ? new Promise(() => {}) : Promise.resolve(mockSpeak)),
    modelAnswerSummary: () => (mockPending.on ? new Promise(() => {}) : Promise.resolve(mockModels)),
    gradeReview: async () => ({ intervalDays: 3 }),
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Lab from '@/app/(tabs)/lab';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Renders the tab with every summary already resolved. */
async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<Lab />); });
  return tree;
}

/** The category chip row — the one horizontal scroller on this screen. */
function chipRow(root: ReactTestInstance): ReactTestInstance {
  return root.findAll((n) => n.props?.horizontal === true, { deep: true })[0];
}

/** The section TAB carrying `label`. Scoped to the tab row by testID rather than
 *  searched for page-wide: the category chips are pressables holding a Text too, so
 *  a page-wide search would happily tap a chip named 말하기 and then report on
 *  whatever that did. */
function tab(root: ReactTestInstance, label: string): ReactTestInstance {
  const row = root.findByProps({ testID: 'lab-sections' });
  const hits = row.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes(label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  // The innermost match: an ancestor pressable would also contain the label.
  return hits[hits.length - 1];
}

test('the three sections are one tab row, and 교정 노트 opens first', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('교정 노트');
  expect(out).toContain('말하기');
  expect(out).toContain('모범답안');
  // The default section's content — the daily-review hero — is on screen…
  expect(out).toContain('오늘의 복습');
  // …and the other two sections' are not. This is the half that a source-level
  // check cannot make: everything used to render at once.
  expect(out.some((x) => x.includes('가장 급한'))).toBe(false);
});

test('each tab carries its own count, and an unknown count is not 0', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('128'); // 말하기
  expect(out).toContain('34');  // 모범답안
  expect(out).toContain('3');   // 교정 노트 — three cards due
});

test('말하기 and 모범답안 are no longer entries in the category chip row', async () => {
  const tree = await mount();
  // Scoped to the chip row itself, not the page: the speaking BLOCK also renders
  // the words "직접 말하기 연습" as its title, so a page-wide search for that string
  // fails whenever the block is on screen — which is a test that reports the chip
  // row as fixed or broken for a reason that has nothing to do with the chip row.
  const chips = texts(chipRow(tree.root));
  expect(chips).not.toContain('직접 말하기 연습');
  expect(chips).not.toContain('시나리오 모범답안');
  expect(chips).not.toContain('말하기');
  expect(chips).not.toContain('모범답안');
});

test('the chips are the axes a card actually varies on', async () => {
  const tree = await mount();
  const chips = texts(chipRow(tree.root));
  expect(chips).toContain('전체');
  // department, from context.dept's leading segment ("ER · TRIAGE" → "ER")…
  expect(chips).toContain('ER');
  expect(chips).toContain('ICU');
  // …and kind, which the card already draws differently but could not be filtered on.
  expect(chips).toContain('교정');
  expect(chips).toContain('제안');
  // NOT the old chip: it came from topic_tag, which nothing writes, so every card fell
  // into it and the row filtered nothing.
  expect(chips).not.toContain('교정 노트');
});

test('a chip that would match every card is not offered', async () => {
  // 전체 already is that chip. Two cards, one department, one kind → nothing splits the
  // list, so there is no row at all rather than a row of no-ops.
  mockUniform.on = true;
  try {
    const tree = await mount();
    expect(tree.root.findAll((n) => n.props?.horizontal === true, { deep: true })).toHaveLength(0);
  } finally {
    mockUniform.on = false;
  }
});

test('tapping a chip narrows the list to that chip', async () => {
  const tree = await mount();
  const chip = (label: string) => {
    const hits = chipRow(tree.root).findAll(
      (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes(label),
      { deep: true },
    );
    expect(hits.length).toBeGreaterThan(0);
    return hits[hits.length - 1];
  };

  await act(async () => { chip('ICU').props.onPress(); });
  let out = texts(tree.root);
  expect(out.some((x) => x.includes('The patient is deteriorating.'))).toBe(true);
  expect(out.some((x) => x.includes('Can you tell me about your pain?'))).toBe(false);

  await act(async () => { chip('제안').props.onPress(); });
  out = texts(tree.root);
  // Only the 'grade' card, and the two corrections are gone — the axes are independent,
  // and a single selection switches between them rather than intersecting.
  expect(out.some((x) => x.includes('Does the pain spread anywhere?'))).toBe(true);
  expect(out.some((x) => x.includes('The patient is deteriorating.'))).toBe(false);
});

test('the card header names the kind, not that it is due', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  // Every card in this list is due — it is GET /me/review. A badge saying so on all of
  // them carried no information, and it sat where something varying belongs.
  expect(out).not.toContain('복습');
  expect(out).toContain('교정');
  expect(out).toContain('제안');
  // …and the strip says where the card came from.
  expect(out).toContain('ER');
  expect(out).toContain('ICU');
});

test('tapping 말하기 swaps the content for the speaking summary', async () => {
  const tree = await mount();
  await act(async () => { tab(tree.root, '말하기').props.onPress(); });
  const out = texts(tree.root);
  // The speaking block is up…
  expect(out.some((x) => x.includes('Please bear with me'))).toBe(true);
  // …and the 교정 노트 content is gone rather than merely scrolled past.
  expect(out).not.toContain('오늘의 복습');
  expect(out.some((x) => x.includes('Can you tell me about your pain?'))).toBe(false);
});

test('tapping 모범답안 swaps again, and 교정 노트 comes back', async () => {
  const tree = await mount();
  await act(async () => { tab(tree.root, '모범답안').props.onPress(); });
  expect(texts(tree.root)).not.toContain('오늘의 복습');
  await act(async () => { tab(tree.root, '교정 노트').props.onPress(); });
  const back = texts(tree.root);
  expect(back).toContain('오늘의 복습');
  expect(back.some((x) => x.includes('Can you tell me about your pain?'))).toBe(true);
});

test('a card names the scene it came from without being tapped', async () => {
  const tree = await mount();
  // Scoped to the 맥락 HEADER, and that scoping is the whole test. Collapsible keeps
  // its children mounted and clipped on purpose (it has to measure them to animate
  // height), so the expanded content is in the tree whether or not it is on screen —
  // a page-wide `toContain` here passes even with the scene line still hidden behind
  // the chevron, which is exactly the assertion this replaced.
  const header = tree.root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes('맥락'),
    { deep: true },
  ).slice(-1)[0];
  // v26 puts 맥락 at the top of the card body as a plain line: the corrected sentence
  // means little without the situation that prompted it. The collapsed row used to
  // show the scenario TITLE ("흉통 환자 트리아지") — the label of the scenario, not
  // the scene the learner was in.
  expect(texts(header)).toContain('흉통 환자에게 통증 양상을 묻는 장면');
  expect(texts(header)).not.toContain('흉통 환자 트리아지');
});

test('a tab whose count is still loading shows no number at all', async () => {
  // The number under each tab comes from a separate read that can still be in flight.
  // 0 is a real answer once it lands, so "not loaded" cannot borrow that glyph: the
  // tab would read 0 and jump to 128, which looks like the feature was empty.
  mockPending.on = true;
  try {
    const tree = await mount();
    const row = tree.root.findByProps({ testID: 'lab-sections' });
    const labels = texts(row);
    expect(labels.filter((x) => x === '…')).toHaveLength(2); // 말하기, 모범답안
    expect(labels).not.toContain('0');
  } finally {
    mockPending.on = false;
  }
});
