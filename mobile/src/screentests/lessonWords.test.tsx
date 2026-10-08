// STEP 1 단어 — 회상형 단어장 (lesson-four-steps-v44 §11, H'), drawn 1:1 to handoff v46
// (design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx; lesson-fidelity-v46 T3,
// audit/audit-step1-words.md). The front shows the meaning; the learner answers, checks, and
// the explanation opens under it. The sheet is then torn off — left for 아직 헷갈려요, right
// for 외웠어요 — and the next one rises. Words, then the STEP 1 nuance cards; the last card
// records STEP 1 with the words missed.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-speech', () => ({ speak: (text: string) => { mockSpoken.push(text); }, stop: () => {} }));
const mockSpoken: string[] = [];

const mockCalls: string[] = [];
let mockFailSave = false;
const v45 = (id: string, en: string, ko: string, chips: string[][]) => ({
  id, en, ko, ipa: `/${en}/`, icon: 'pill', example: `Say ${en}.`, exKo: '예문', cue: `${ko} 단서`, tag: '분류',
  distractorsEn: [`${en}x`, `${en}y`], distractorsKo: [`${ko}1`, `${ko}2`], chips, decoyChips: ['zz'],
});
function mockLesson() {
  return {
    situation: { id: 'SCN-ER-00002', title: '통증 사정' },
    level: 'A2',
    steps: [
      { kind: 'words', state: 'now', count: 3 }, { kind: 'sentences', state: 'lock', count: 5 },
      { kind: 'guided', state: 'lock', count: 3 }, { kind: 'free', state: 'lock', count: 3 },
    ],
    // Positions 0·1·2 rotate pick → fill → listen.
    words: [
      v45('w-0', 'hypotensive', '저혈압의', [['hypo', 'tens', 'ive']]),
      v45('w-1', 'en route', '이송 중에', [['en'], ['route']]),
      v45('w-2', 'deteriorate', '악화되다', [['de', 'terio', 'rate']]),
    ],
    sentences: [],
    nuance: [
      { kind: 'swap', words: ['w-0'] }, // STEP 2 — not in this deck
      { kind: 'slider', words: ['w-2'], ko: '통증의 세기', icon: 'faceWorried', cue: 'bearable', scale: ['discomfort', 'pain', 'agony'], answerAt: 0, why: '견딜 만하면 discomfort' },
      { kind: 'pair', words: ['w-1'], pairs: [['administer', 'medication'], ['titrate', 'the drip']], decoys: ['the patient'], why: '짝' },
    ],
  };
}
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => mockLesson(),
    confusedWord: async (s: string, w: string) => { mockCalls.push(`confused ${s} ${w}`); return { created: true }; },
    clearLessonStep: async (s: string, k: string, missed?: string[]) => {
      if (mockFailSave) { mockFailSave = false; throw new Error('offline'); }
      mockCalls.push(`clear ${s} ${k} ${JSON.stringify([...(missed ?? [])].sort())}`); return mockLesson();
    },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({
    push: (p: unknown) => { mockCalls.push(`push ${JSON.stringify(p)}`); },
    replace: (p: unknown) => { mockCalls.push(`replace ${String(p)}`); }, back: () => { mockCalls.push('back'); }, canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002' }),
}));

import { Animated, ScrollView } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonWords from '@/app/scenario/[id]/words';
import { StepTrack } from '@/components/lesson/StepTrack';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbDoubleRing } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const realTiming = Animated.timing;
beforeEach(() => {
  jest.useFakeTimers();
  // The native driver never steps in a test renderer; run the same timings on the JS driver.
  jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => realTiming(v, { ...cfg, useNativeDriver: false }));
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function flat(n: ReactTestInstance): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const f = Object.assign({}, ...[n.props.style].flat(8).filter(Boolean)) as Record<string, unknown>;
  const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
  const out: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [k, v] of Object.entries(f)) {
    out[k] = k === 'transform' && Array.isArray(v)
      ? Object.assign({}, ...v.map((e) => Object.fromEntries(Object.entries(e as object).map(([a, b]) => [a, read(b)]))))
      : read(v);
  }
  return out;
}
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const hostID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type === 'string');
const icons = (root: ReactTestInstance, name: string) => root.findAll((n) => n.type === NbIcon && n.props.name === name);
async function press(node: ReactTestInstance) {
  const hit = [node, ...node.findAll(() => true)].find((n) => typeof n.props?.onPress === 'function');
  expect(hit).toBeTruthy();
  await act(async () => { await hit!.props.onPress(); });
}
const pressID = async (root: ReactTestInstance, id: string) => press(byID(root, id)[0]);
/** Judge the sheet and let it tear off (620ms) and the next one rise. */
async function judge(root: ReactTestInstance, id: 'recall-known' | 'recall-fuzzy') {
  await pressID(root, id);
  advance(700);
}
/** The option whose label is `label` (options are shuffled, stably). */
async function pick(root: ReactTestInstance, label: string) {
  const opt = root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith('recall-opt-') && texts(n).includes(label))[0];
  expect(opt).toBeTruthy();
  await press(opt);
}
const current = (root: ReactTestInstance) => byID(root, 'recall-sheet')[0];
async function mount() {
  mockCalls.length = 0;
  mockSpoken.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonWords />)); });
  await act(async () => { await Promise.resolve(); });
  advance(500);
  return tree;
}

// ── 화면 틀 ────────────────────────────────────────────────────────────────

test('the deck is the words, then the STEP 1 nuance cards — STEP 2 kinds stay out', async () => {
  const tree = await mount();
  expect(hostID(tree.root, 'recall-segment')).toHaveLength(5);
  // n / N sits in the sheet's own header (WL L162), not in the screen header.
  expect(texts(byID(current(tree.root), 'sheet-header')[0])).toContain('1 / 5');
});

test('header: an exit control (drawn ‹ + label) and the green STEP 1 tag; no StepTrack (결정 1)', async () => {
  const tree = await mount();
  const exit = byID(tree.root, 'recall-exit')[0];
  expect(icons(exit, 'chevronLeft')).toHaveLength(1);
  expect(texts(exit)).toContain('나가기');
  await press(exit);
  expect(mockCalls).toContain('back');
  const tag = tree.root.findAll((n) => String(n.type) === 'Text' && n.children.includes('STEP 1 · 단어'));
  expect(tag).toHaveLength(1);
  expect(flat(tag[0]).color).toBe(nb.green);
  expect(tree.root.findAll((n) => n.type === StepTrack)).toHaveLength(0);
});

test('the headline: situation, then the marked run; the nuance headline marks 뉘앙스', async () => {
  const tree = await mount();
  const head = byID(tree.root, 'recall-headline')[0];
  expect(texts(head).join('')).toContain('통증 사정 — 뜻을 보고 영어를 떠올려보세요');
  expect(texts(head)).toContain('영어를 떠올려');
  await walkWords(tree);
  const nuance = byID(tree.root, 'recall-headline')[0];
  expect(texts(nuance)).toContain('뉘앙스');
});

test('the binder sits in the handoff box: top 172 below a 44 status bar (here TOP_INSET), bottom 182; buttons at 98 and 34', async () => {
  const tree = await mount();
  const area = tree.root.findAll((n) => n.type === ScrollView && flat(n).position === 'absolute')[0];
  expect(flat(area)).toMatchObject({ top: 180, bottom: 182, left: 24, right: 24 });
  expect(flat(hostID(tree.root, 'recall-actions')[0])).toMatchObject({ position: 'absolute', left: 24, right: 24, bottom: 98 });
  expect(flat(hostID(tree.root, 'recall-step2-slot')[0])).toMatchObject({ position: 'absolute', left: 24, right: 24, bottom: 34 });
});

test('progress segments tilt ±.7°, and colour in over .3s once a sheet is torn off', async () => {
  const tree = await mount();
  const seg = () => hostID(tree.root, 'recall-segment');
  expect(flat(seg()[0]).transform).toMatchObject({ rotate: '-0.7deg' });
  expect(flat(seg()[1]).transform).toMatchObject({ rotate: '0.7deg' });
  expect(flat(seg()[0]).backgroundColor).toMatch(/^rgba\(62, 54, 43, 0\.1(5|49)/);
  expect(flat(seg()[3]).backgroundColor).toMatch(/^rgba\(74, 111, 165, 0\.(25|249)/);
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  advance(640); // torn; the colour is now on its way
  advance(150);
  expect(flat(seg()[0]).backgroundColor).not.toBe(nb.ink);
  advance(200);
  expect(flat(seg()[0]).backgroundColor).toBe('rgba(62, 54, 43, 1)');
});

// ── 뜯김 ──────────────────────────────────────────────────────────────────

test('외웠어요 tears the sheet off to the right; the next sheet rises only after 620ms', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-known');
  // The copy flies with its explanation still on it; the current layer is gone meanwhile.
  const tearing = hostID(tree.root, 'sheet-tearing-layer');
  expect(tearing).toHaveLength(1);
  expect(flat(tearing[0]).transformOrigin).toBe('0% 0%');
  expect(texts(tearing[0])).toContain('hypotensive');
  expect(byID(tree.root, 'recall-sheet')).toHaveLength(0);
  // The judge row stays while it flies (WL face stays 'back' until the timeout).
  expect(hostID(tree.root, 'recall-known')).toHaveLength(1);
  advance(600);
  expect(hostID(tree.root, 'sheet-tearing-layer')).toHaveLength(1);
  advance(40);
  expect(hostID(tree.root, 'sheet-tearing-layer')).toHaveLength(0);
  expect(texts(byID(current(tree.root), 'sheet-header')[0])).toContain('2 / 5');
  expect(byID(tree.root, 'recall-check')).toHaveLength(1);
  expect(hostID(tree.root, 'sheet-stub')).toHaveLength(1);
});

test('아직 헷갈려요 files the word into the review notes and tears to the left', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await pressID(tree.root, 'recall-fuzzy');
  expect(mockCalls).toContain('confused SCN-ER-00002 w-0');
  expect(flat(hostID(tree.root, 'sheet-tearing-layer')[0]).transformOrigin).toBe('100% 0%');
  // A second press while it flies does nothing.
  await pressID(tree.root, 'recall-fuzzy');
  expect(mockCalls.filter((c) => c.startsWith('confused'))).toHaveLength(1);
  advance(700);
  expect(texts(byID(current(tree.root), 'sheet-header')[0])).toContain('2 / 5');
});

test('a wrong pick shakes the sheet, opens the explanation with RETRY, and counts the word as missed', async () => {
  const tree = await mount();
  expect(texts(byID(current(tree.root), 'sheet-header')[0]).join('')).toContain('영어 고르기');
  expect(texts(tree.root)).toContain('저혈압의');
  await pick(tree.root, 'hypotensivex');
  await pressID(tree.root, 'recall-check');
  advance(75); // nb-shake 25%: -5px
  expect(flat(hostID(tree.root, 'sheet-current-layer')[0]).transform.translateX).toBeCloseTo(-5, 0);
  advance(300);
  expect(flat(hostID(tree.root, 'sheet-current-layer')[0]).transform.translateX).toBe(0);
  expect(byID(tree.root, 'recall-stamp-retry')).toHaveLength(1);
  expect(texts(byID(tree.root, 'recall-reveal')[0]).join('')).toContain('hypotensive');
  expect(texts(byID(current(tree.root), 'sheet-header')[0]).join('')).toContain('영어 고르기 · 해설');
  // After a miss the green button says "now I know", not "I knew it".
  expect(texts(byID(tree.root, 'recall-known')[0])).toContain('이제 알겠어요');
  expect(texts(byID(tree.root, 'recall-known')[0])).toContain('뜯고 다음 장');
});

test('a right answer does not shake', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  advance(75);
  expect(flat(hostID(tree.root, 'sheet-current-layer')[0]).transform.translateX).toBe(0);
});

test('the explanation unfolds (nb-reveal) and the stamp lands (nb-ok) to -20° on a double ring', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  const reveal = hostID(tree.root, 'recall-reveal')[0];
  expect(flat(reveal).opacity).toBe(0);
  expect(flat(reveal).transform.translateY).toBe(-6);
  const ok = hostID(tree.root, 'recall-stamp-enter')[0];
  expect(flat(ok).transform).toMatchObject({ scale: 0.6, rotate: '-20deg' });
  advance(400);
  expect(flat(hostID(tree.root, 'recall-reveal')[0]).opacity).toBe(1);
  expect(flat(hostID(tree.root, 'recall-stamp-enter')[0]).transform).toMatchObject({ scale: 1, rotate: '-10deg' });
  const stamp = hostID(tree.root, 'recall-stamp-good')[0];
  expect(flat(stamp)).toMatchObject({ width: 56, height: 56, borderWidth: 1, borderColor: nb.green, transform: { rotate: '-10deg' } });
  expect(byID(tree.root, 'recall-stamp-good')[0].findAll((n) => n.type === NbDoubleRing)).toHaveLength(1);
});

// ── 조각 맞추기 ────────────────────────────────────────────────────────────

async function toFill(tree: ReturnType<typeof create>) {
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  expect(texts(byID(current(tree.root), 'sheet-header')[0]).join('')).toContain('조각 맞추기');
}

test('fill: each fragment is its own marked piece; tapping one takes that piece out', async () => {
  const tree = await mount();
  await toFill(tree);
  const built = () => byID(tree.root, 'recall-built')[0];
  expect(texts(built())).toEqual(['e_ _ _ _ _ _ _ ']);
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  expect(texts(built())).toEqual(['en', 'route']);
  expect(flat(hostID(tree.root, 'recall-piece-0')[0])).toMatchObject({ backgroundColor: 'rgba(249,227,123,.55)', paddingHorizontal: 5, paddingVertical: 1 });
  await pressID(tree.root, 'recall-piece-0'); // the first, not the last
  expect(texts(built())).toEqual(['route']);
  await pressID(tree.root, 'recall-chip-en');
  expect(texts(built())).toEqual(['route', 'en']);
});

test('fill: a used chip is hatched and dashed, an unused one casts a hard 1×2 shadow; the hint says spaces are automatic', async () => {
  const tree = await mount();
  await toFill(tree);
  await pressID(tree.root, 'recall-chip-en');
  const used = byID(tree.root, 'recall-chip-en')[0];
  expect(hostID(used, 'recall-chip-hatch')).toHaveLength(1);
  expect(hostID(used, 'recall-chip-shadow')).toHaveLength(0);
  const unused = byID(tree.root, 'recall-chip-route')[0];
  expect(hostID(unused, 'recall-chip-hatch')).toHaveLength(0);
  const shadow = hostID(unused, 'recall-chip-shadow');
  expect(shadow.map((s) => flat(s))).toEqual([
    expect.objectContaining({ left: '100%', top: 2, width: 1, backgroundColor: 'rgba(62,54,43,.2)' }),
    expect.objectContaining({ top: '100%', left: 1, height: 2, backgroundColor: 'rgba(62,54,43,.2)' }),
  ]);
  expect(texts(tree.root)).toContain('조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요 · 띄어쓰기는 자동');
});

test('fill: a wrong build shows 내 답 struck through under the explanation', async () => {
  const tree = await mount();
  await toFill(tree);
  await pressID(tree.root, 'recall-chip-route');
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-check');
  const mine = byID(tree.root, 'recall-my-answer')[0];
  expect(texts(mine).join('')).toBe('내 답: route en');
  const struck = mine.findAll((n) => String(n.type) === 'Text' && n.children.includes('route en'))[0];
  expect(flat(struck).textDecorationLine).toBe('line-through');
  expect(flat(struck).color ?? flat(mine).color).toBeDefined();
});

test('fill: a right build shows no 내 답 line', async () => {
  const tree = await mount();
  await toFill(tree);
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-good')).toHaveLength(1);
  expect(byID(tree.root, 'recall-my-answer')).toHaveLength(0);
});

// ── 뉘앙스 ────────────────────────────────────────────────────────────────

async function walkWords(tree: ReturnType<typeof create>) {
  await pick(tree.root, 'hypotensivex'); // wrong → missed
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-fuzzy'); // right but unsure → missed
  await pressID(tree.root, 'recall-listen');
  await pick(tree.root, '악화되다');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
}

test('listen plays the word; the nuance cards follow the words', async () => {
  const tree = await mount();
  await walkWords(tree);
  expect(mockSpoken).toContain('deteriorate');
  expect(texts(byID(current(tree.root), 'sheet-header')[0]).join('')).toContain('뉘앙스 저울');
});

test('slider: its tag, the content title (ko) and icon, the gradient axis, the guide line, the scale as the answer', async () => {
  const tree = await mount();
  await walkWords(tree);
  const sheet = current(tree.root);
  expect(texts(byID(sheet, 'sheet-header')[0])).toContain('뉘앙스 · 강도');
  expect(texts(sheet)).toContain('통증의 세기');
  expect(icons(byID(sheet, 'sheet-icon')[0], 'faceWorried')).toHaveLength(1);
  expect(texts(sheet)).toContain('이 환자의 말에 맞는 위치를 골라요');
  expect(byID(sheet, 'recall-scale-axis')).toHaveLength(1);
  await pressID(tree.root, 'recall-scale-0');
  await pressID(tree.root, 'recall-check');
  expect(texts(byID(tree.root, 'recall-reveal')[0]).join('')).toContain('discomfort · pain · agony');
});

async function toPair(tree: ReturnType<typeof create>) {
  await walkWords(tree);
  await pressID(tree.root, 'recall-scale-0');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
}
const rightOf = (tree: ReturnType<typeof create>, label: string) =>
  tree.root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith('recall-right-') && texts(n).includes(label))[0];

test('pair: no content title → the catalog one; tilted rows, a glow on the picked word, a dashed 60% preview, → once linked', async () => {
  const tree = await mount();
  await toPair(tree);
  const sheet = current(tree.root);
  expect(texts(byID(sheet, 'sheet-header')[0])).toContain('뉘앙스 · 콜로케이션');
  expect(texts(sheet)).toContain('무엇과 같이 쓰나요?');
  const left0 = () => hostID(tree.root, 'recall-left-0-face')[0];
  expect(flat(left0()).transform).toMatchObject({ rotate: '-0.4deg' });
  expect(byID(tree.root, 'recall-left-glow')).toHaveLength(0);
  await pressID(tree.root, 'recall-left-0');
  const glow = hostID(tree.root, 'recall-left-glow');
  expect(glow).toHaveLength(1);
  expect(flat(glow[0])).toMatchObject({ borderWidth: 3, borderColor: '#4A6FA533' });
  const r = hostID(rightOf(tree, 'the patient'), String(rightOf(tree, 'the patient').props.testID) + '-face')[0];
  expect(flat(r)).toMatchObject({ borderStyle: 'dashed', borderColor: '#4A6FA599', transform: { rotate: '0.4deg' } });
  await press(rightOf(tree, 'medication'));
  expect(hostID(byID(tree.root, 'recall-left-0')[0], 'recall-link-arrow')).toHaveLength(1);
  await pressID(tree.root, 'recall-left-1');
  await press(rightOf(tree, 'the drip'));
  await pressID(tree.root, 'recall-check');
  expect(texts(byID(tree.root, 'recall-reveal')[0]).join('')).toContain('administer · titrate');
});

// ── 끝 ───────────────────────────────────────────────────────────────────

async function finishDeck(tree: ReturnType<typeof create>) {
  await toPair(tree);
  await pressID(tree.root, 'recall-left-0');
  await press(rightOf(tree, 'medication'));
  await pressID(tree.root, 'recall-left-1');
  await press(rightOf(tree, 'the drip'));
  await pressID(tree.root, 'recall-check');
  expect(byID(tree.root, 'recall-stamp-good')).toHaveLength(1);
  await judge(tree.root, 'recall-known');
}

test('STEP 2 · 문장 학습으로 is always there: dashed at .5 and inert before the end, ink after', async () => {
  const tree = await mount();
  const slot = () => byID(tree.root, 'recall-to-step2')[0];
  expect(texts(slot())).toContain('STEP 2 · 문장 학습으로');
  expect(icons(slot(), 'chevronRight')).toHaveLength(1);
  expect([slot(), ...slot().findAll(() => true)].some((n) => typeof n.props?.onPress === 'function')).toBe(false);
  expect(slot().findAll((n) => typeof n.type === 'string' && !!n.props.style && flat(n).opacity === 0.5).length).toBeGreaterThan(0);
  expect(slot().findAll((n) => typeof n.type === 'string' && !!n.props.style && flat(n).borderStyle === 'dashed').length).toBeGreaterThan(0);
  await finishDeck(tree);
  expect([slot(), ...slot().findAll(() => true)].some((n) => typeof n.props?.onPress === 'function')).toBe(true);
});

test('the last card records STEP 1 with the missed words and goes on to STEP 2', async () => {
  const tree = await mount();
  await finishDeck(tree);
  expect(byID(tree.root, 'recall-done')).toHaveLength(1);
  expect(texts(byID(tree.root, 'recall-right-count')[0])).toEqual(['4']);
  expect(texts(byID(tree.root, 'recall-wrong-count')[0])).toEqual(['1']);
  expect(texts(byID(tree.root, 'recall-missed-note')[0]).join('').trim()).toBe('틀린 단어는 STEP 2 문장에 다시 나와요');
  expect(icons(byID(tree.root, 'recall-missed-note')[0], 'pencil')).toHaveLength(1);
  // The DONE stamp: 96 on a double ring, DONE 24 down in the flow (not centred).
  const stamp = hostID(tree.root, 'recall-done-stamp')[0];
  expect(flat(stamp)).toMatchObject({ width: 96, height: 96, borderWidth: 1, borderColor: nb.green });
  expect(byID(tree.root, 'recall-done-stamp')[0].findAll((n) => n.type === NbDoubleRing)).toHaveLength(1);
  // The words headline stays up on the last card (WL L270).
  expect(texts(byID(tree.root, 'recall-headline')[0])).toContain('영어를 떠올려');
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.slice(-2)).toEqual([
    'clear SCN-ER-00002 words ["w-0","w-1"]',
    'replace /scenario/SCN-ER-00002/sentences',
  ]);
});

// Branch review: a failed save must not drop the missed words and move on silently.
test('a failed STEP 1 save stays on the page, says so, and retries', async () => {
  const tree = await mount();
  await finishDeck(tree);
  mockFailSave = true;
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.some((c) => c.startsWith('replace'))).toBe(false);
  expect(byID(tree.root, 'lesson-save-failed')).toHaveLength(1);
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls.slice(-2)).toEqual(['clear SCN-ER-00002 words ["w-0","w-1"]', 'replace /scenario/SCN-ER-00002/sentences']);
});

// WL L300: the note shows when something was answered wrong — 헷갈려요 alone still sends the
// word to STEP 2 (missed), but the line is about wrong answers.
test('no wrong answers → no missed note, though a 헷갈려요 word is still recorded as missed', async () => {
  const tree = await mount();
  await pick(tree.root, 'hypotensive');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-fuzzy');
  await pressID(tree.root, 'recall-chip-en');
  await pressID(tree.root, 'recall-chip-route');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  await pick(tree.root, '악화되다');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  await pressID(tree.root, 'recall-scale-0');
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  await pressID(tree.root, 'recall-left-0');
  await press(rightOf(tree, 'medication'));
  await pressID(tree.root, 'recall-left-1');
  await press(rightOf(tree, 'the drip'));
  await pressID(tree.root, 'recall-check');
  await judge(tree.root, 'recall-known');
  expect(texts(byID(tree.root, 'recall-wrong-count')[0])).toEqual(['0']);
  expect(byID(tree.root, 'recall-missed-note')).toHaveLength(0);
  await pressID(tree.root, 'recall-to-step2');
  expect(mockCalls).toContain('clear SCN-ER-00002 words ["w-0"]');
});
