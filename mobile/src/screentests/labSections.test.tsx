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

const mockSounds: string[] = [];
jest.mock('@/lib/sfx', () => ({
  playSfx: (name: string) => { mockSounds.push(name); },
  primeSfx: () => {},
  loadSfxPreference: async () => {},
}));

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
// Flipped by the virtualization test: a realistic pile of due cards.
const mockManyCards = { on: false };
const mockBulk = Array.from({ length: 50 }, (_, i) => ({
  id: `bulk${i}`,
  source: 'correction',
  front: `bulk said ${i}`,
  back: `bulk sentence ${i}`,
  note: 'why',
  topicTag: '',
  masteryPips: i % 4,
  favorite: false,
  context: { title: `t${i}`, dept: 'ER · TRIAGE', situation: `장면 ${i}`, npc: '' },
}));
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
    reviewDue: async () => {
      if (mockManyCards.on) return mockBulk.map((c) => ({ ...c }));
      if (mockUniform.on) return [{ ...mockCard }, { ...mockCard, id: 'r9' }];
      return [{ ...mockCard }, { ...mockCardIcu }, { ...mockCardTip }];
    },
    // A promise that never settles is what "still in flight" actually is. Returning
    // undefined or rejecting would test a different state.
    speakSummary: () => (mockPending.on ? new Promise(() => {}) : Promise.resolve(mockSpeak)),
    modelAnswerSummary: () => (mockPending.on ? new Promise(() => {}) : Promise.resolve(mockModels)),
    // The 말하기 / 모범답안 tabs render the real lists now, so they read these.
    speakSentences: async () => ({
      sentences: [{ sentenceKey: 's1', referenceText: 'Please bear with me for a moment.', recognized: '', overall: 64, accuracy: 64, fluency: 64, completeness: 64, attempts: 2 }],
      total: 128,
      depts: ['ER'],
    }),
    modelAnswers: async () => ({
      groups: [{ scenarioId: 'SCN-ER-00002', title: '흉통 환자 트리아지', corrections: 3, lastAt: '2026-08-01T00:00:00Z', cards: [] }],
      total: 34,
    }),
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

/** Trees mounted by this file, torn down in afterEach. */
const mounted: ReturnType<typeof create>[] = [];

/** Renders the tab with every summary already resolved. */
async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = create(<Lab />); });
  mounted.push(tree);
  return tree;
}

// Every tree this file mounts gets torn down.
//
// Not hygiene — correctness of the SUITE. BottomSheet schedules its entry animation in
// a requestAnimationFrame, and jest's preset polyfills rAF with setTimeout. A tree left
// mounted keeps that timer alive past the end of the test, and when it finally fires
// jest has already torn down the module registry: `Animated.spring` is undefined and
// whichever unrelated test happens to be running gets the crash. Locally the ordering
// happened to be benign; CI caught it.
afterEach(() => {
  for (const tree of mounted.splice(0)) {
    act(() => { tree.unmount(); });
  }
});


/** The pressable face of a section tab — the node whose own style carries the press
 *  transform, as opposed to the cell that clips it. */
function tabFace(root: ReactTestInstance, label: string): ReactTestInstance {
  const row = root.findByProps({ testID: 'lab-sections' });
  const hits = row.findAll(
    (n) => String(n.type) === 'View' && n.props?.onStartShouldSetResponder !== undefined && texts(n).includes(label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[0];
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
  expect(out).toContain('잊어버리기 전에 다시 보기');
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
  // One string per chip now — "전체 3", the shape the handoff writes ("전체 14"): the
  // label and its count are one written phrase rather than a word plus a boxed number.
  const chips = texts(chipRow(tree.root)).map((x) => x.replace(/\s+\d+$/, ''));
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
  // The chip's text is "<label> <count>", so the lookup matches the label at the start
  // of the line rather than the whole node text.
  const chip = (label: string) => {
    const hits = chipRow(tree.root).findAll(
      (n) => typeof n.type === 'function' && n.props?.onPress !== undefined
        && texts(n).some((x) => x === label || x.startsWith(`${label} `)),
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

test('tapping 말하기 lands on the LIST, not a summary of it', async () => {
  const tree = await mount();
  await act(async () => { tab(tree.root, '말하기').props.onPress(); });
  const out = texts(tree.root);
  // A spoken sentence, straight away. It used to be a summary block whose "전체 ›" link
  // was the only way to the list — one tap too many for the thing the tab is named after.
  expect(out.some((x) => x.includes('Please bear with me'))).toBe(true);
  // The list's own controls come with it.
  expect(out.some((x) => x === '약한 순' || x === '최신')).toBe(true);
  // …and the 교정 노트 content is gone rather than merely scrolled past.
  expect(out).not.toContain('잊어버리기 전에 다시 보기');
  expect(out.some((x) => x.includes('Can you tell me about your pain?'))).toBe(false);
});

test('tapping 모범답안 swaps again, and 교정 노트 comes back', async () => {
  const tree = await mount();
  await act(async () => { tab(tree.root, '모범답안').props.onPress(); });
  // Again the list itself: a scenario group, not a block linking to one.
  expect(texts(tree.root).some((x) => x.includes('흉통 환자 트리아지'))).toBe(true);
  expect(texts(tree.root)).not.toContain('잊어버리기 전에 다시 보기');
  await act(async () => { tab(tree.root, '교정 노트').props.onPress(); });
  const back = texts(tree.root);
  expect(back).toContain('잊어버리기 전에 다시 보기');
  expect(back.some((x) => x.includes('Can you tell me about your pain?'))).toBe(true);
});

test('a card names the scene it came from without being tapped', async () => {
  const tree = await mount();
  // Scoped to the 맥락 HEADER, and that scoping is the whole test. Collapsible keeps
  // its children mounted and clipped on purpose (it has to measure them to animate
  // height), so the expanded content is in the tree whether or not it is on screen —
  // a page-wide `toContain` here passes even with the scene line still hidden behind
  // the chevron, which is exactly the assertion this replaced.
  // v29 writes the scene as a pencil line with a pencil doodle instead of labelling it
  // 맥락 — on paper the note IS the context, and a label saying so is chrome. The header
  // is therefore found by the line it carries.
  const header = tree.root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined
      && texts(n).some((x) => x.includes('통증 양상을 묻는 장면')),
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
    // NbIndexTabs draws a number when it is given one, so "not loaded" is said by giving
    // it none — which is stronger than the ellipsis this replaced: there is no glyph to
    // mistake for a value.
    expect(labels).not.toContain('0');
    expect(labels).not.toContain('…');
    expect(labels).toContain('말하기');
    expect(labels).toContain('모범답안');
  } finally {
    mockPending.on = false;
  }
});

/** Flattens a style prop (object, array, or nested arrays) into one object. */
function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}

/** Every Text inside `node` whose colour equals the nearest painted background
 *  behind it — i.e. text that is invisible. */
function invisibleText(node: ReactTestInstance): string[] {
  const bad: string[] = [];
  for (const txt of node.findAll((n) => String(n.type) === 'Text', { deep: true })) {
    const color = flat(txt.props?.style).color;
    let p: ReactTestInstance | null = txt.parent;
    let bg: unknown;
    while (p) {
      const s = flat(p.props?.style);
      if (s.backgroundColor) { bg = s.backgroundColor; break; }
      p = p.parent;
    }
    if (color && bg && String(color).toLowerCase() === String(bg).toLowerCase()) {
      bad.push(`${txt.children.filter((c) => typeof c === 'string').join('')} (${String(color)} on ${String(bg)})`);
    }
  }
  return bad;
}

// Five tests used to live here describing the PIXEL tab: a cap dropping onto a hard offset
// shadow, an active tab held down to say "you are here", a press that cannot reach its
// neighbour. v29 replaces the device entirely — the sections are index stickers, where
// "you are here" is said by coming forward in the page's own colour and losing the bottom
// edge, and there is no cap to drop. That behaviour is asserted where the component lives
// (components/nb/nbUI.test.tsx), so repeating it here would be two tests for one drawing.
//
// What this file still owns is the WIRING: three tabs, the right one open first, a count
// per tab, an unknown count showing no number, and tapping one swapping the body.
test('no chip paints its label or its count in its own colour', async () => {
  // The 전체 chip's tone was the ink colour, which the chip draws BOTH its label and
  // its count in: inactive, the count box was a black square with black digits;
  // active, the whole chip went black and swallowed the word 전체. Nothing in the
  // component guards against that — the tone is data — so the check is here.
  const tree = await mount();
  const find = (root: ReactTestInstance, label: string) => root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined
      && texts(n).some((x) => x === label || x.startsWith(`${label} `)),
    { deep: true },
  ).slice(-1)[0];

  for (const label of ['전체', 'ER', 'ICU', '교정', '제안']) {
    const chip = find(chipRow(tree.root), label);
    expect(chip).toBeDefined();
    expect(invisibleText(chip)).toEqual([]);
    // Selected, the chip fills with ink and its text flips to paper. That pairing is
    // NbChip's, and this is where it is checked against real data: the tone used to come
    // from the card list, and one of those tones was the ink colour itself.
    await act(async () => { chip.props.onPress(); });
    const active = find(chipRow(tree.root), label);
    expect(active).toBeDefined();
    expect(invisibleText(active)).toEqual([]);
  }
});

// The five tests that used to live here described the PIXEL tab: a cap that drops onto a
// hard offset shadow, an active tab held down to say "you are here", a press that cannot
// reach its neighbour. v29 replaces the device entirely — the sections are index stickers,
// where "you are here" is said by coming forward in the page's colour and losing the
// bottom edge, and there is no cap to drop. That behaviour is asserted where the component
// lives (components/nb/nbUI.test.tsx: "the index tab in front joins the page instead of
// closing its box"), so repeating it here would be two tests for one drawing.
//
// What this file still owns is the WIRING, which is above: three tabs, the right one open
// first, a count per tab, an unknown count showing no number, and tapping one swapping the
// body.

// (The chip-colour check lives once, above. This file carried two identical copies of it
// for a while — both ran, and only one of them was ever updated.)


/** True when a tab's cap is sitting down on its shadow. */
function isDown(root: ReactTestInstance, label: string): boolean {
  const st = flat(tabFace(root, label).props.style) as { transform?: { translateX?: number }[] };
  return (st.transform?.[0]?.translateX ?? 0) > 0;
}





test('the card list is virtualized — a window of cards is mounted, not the pile', async () => {
  // Fifty due cards is an ordinary week of practice. Mounting all of them cost 5,431
  // host nodes, and the "복습 등급이 뭔가요?" disclosure animates a HEIGHT — a layout
  // property the native driver cannot touch — so every frame of that animation re-laid
  // out the whole scroll content. That was the lag this tab was reported for.
  // Memoizing would not have helped: the work is layout, not render.
  mockManyCards.on = true;
  try {
    const tree = await mount();
    const drawn = texts(tree.root).filter((x) => x.startsWith('bulk sentence ')).length;
    expect(drawn).toBeGreaterThan(0); // the list is not empty
    // Far short of 50. The exact window depends on FlatList's batching, which is why
    // this is a bound rather than an equality.
    expect(drawn).toBeLessThan(20);
  } finally {
    mockManyCards.on = false;
  }
});

test('the disclosure toggle does not re-lay-out the whole pile', async () => {
  // The same claim from the other side: with 50 cards loaded, the number of mounted
  // host nodes stays in the hundreds. A ScrollView + map put it above five thousand,
  // and every frame of the height animation walked all of them.
  mockManyCards.on = true;
  try {
    const tree = await mount();
    const hosts = tree.root.findAll((n) => typeof n.type === 'string', { deep: true }).length;
    expect(hosts).toBeLessThan(1500);
  } finally {
    mockManyCards.on = false;
  }
});

test('a sentence the learner never said is not struck through', async () => {
  // A graded scenario also files "you could have said this" (source: 'grade'). Drawing
  // one of those behind a strike claims they said a sentence they never said — which is
  // worse than not filing it, because the learner corrects a mistake they did not make.
  const tree = await mount();
  const line = (text: string) => {
    const hit = tree.root.findAll(
      (n) => String(n.type) === 'Text' && n.children.some((c) => c === text),
      { deep: true },
    )[0];
    expect(hit).toBeTruthy();
    const st = hit.props.style;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean).map((x: unknown) => (Array.isArray(x) ? Object.assign({}, ...x) : x))) : st;
    return flat.textDecorationLine;
  };
  // The correction WAS said, so it is struck.
  expect(line('I want to ask about your pain.')).toBe('line-through');
  // The suggestion was not.
  expect(line('통증이 어디로 퍼지는지 묻기')).toBe('none');
});

// v33: 말하기·모범답안 섹션의 정렬은 두 번째 탭 줄이었다. 리뷰랩은 이미 섹션 탭
// 한 줄을 갖고 있어서, 그 아래 정렬 탭이 또 쌓이니 학습자가 "지금 어느 섹션인가"와
// "목록이 어떻게 정렬됐나"를 구분할 수 없었다("리뷰랩의 말하기, 모범답안 안에 또
// 탭이 존재한다"). 정렬을 드롭다운으로 옮겨서 탭 줄은 섹션 탭 하나만 남는다.
test('every section has exactly one tab row — the section tabs, never a nested one', async () => {
  const tree = await mount();
  const tabRows = () =>
    tree.root.findAll(
      (n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'NbIndexTabs',
      { deep: true },
    ).length;

  // 교정 노트 (default): one tab row.
  expect(tabRows()).toBe(1);

  // 말하기 — the sort used to be a second NbIndexTabs here.
  await act(async () => { tab(tree.root, '말하기').props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  expect(tabRows()).toBe(1);

  // 모범답안 — same.
  await act(async () => { tab(tree.root, '모범답안').props.onPress(); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  expect(tabRows()).toBe(1);
});

// 교정 노트의 등급 버튼(다시/어려움/알맞음/쉬움)이 핸드오프처럼 색과 예상 간격을
// 갖는지. 이전엔 색 없는 paper/ink 버튼이었고 간격도 없었다.
test('each SRS grade is written in its own pen, with the interval it means', async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { nb } = require('@/theme/nb') as typeof import('@/theme/nb');
  const flat = (s: unknown): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    const walk = (x: unknown) => Array.isArray(x) ? x.forEach(walk) : x && typeof x === 'object' ? Object.assign(out, x) : undefined;
    walk(s);
    return out;
  };
  const tree = await mount();
  // '다시' appears in both the collapsible grade GUIDE and the button; collect every
  // colour it is drawn in and require the button's pen among them.
  const colours = (label: string): unknown[] => tree.root.findAll(
    (n) => String(n.type) === 'Text' && n.children.length === 1 && n.children[0] === label,
    { deep: true },
  ).map((n) => flat(n.props.style).color);
  expect(colours('다시')).toContain(nb.red);
  expect(colours('알맞음')).toContain(nb.blue);
  expect(colours('쉬움')).toContain(nb.green);

  // …and the estimated next interval sits under each one.
  const out = texts(tree.root);
  expect(out).toContain('<1분');
  expect(out).toContain('10분');
  expect(out).toContain('1일');
  expect(out).toContain('4일');
});
