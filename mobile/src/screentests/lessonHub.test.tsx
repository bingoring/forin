// 상황 허브 — lesson-four-steps-v44 G. It replaced the 상황 준비 (briefing) page at the
// same route (spec §6 결정 4), so this file replaced the briefing's tests. The checks are
// on the rendered output: the gauge and CTA count only the steps left for this learner,
// `그래도 할래요` opens a skipped step, an unwritten step cannot be opened, and each
// dialogue step sends its own rung.
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
// The hub's polaroid draws a RoleFace, which comes through @engine and pulls in
// reanimated. The face's motion is not what these tests are about; where the states show
// on the page is.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t, linear: (t: number) => t },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    useDerivedValue: (f: () => unknown) => ({ value: f() }),
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: (v: unknown) => v,
    withSequence: (v: unknown) => v,
    withTiming: (v: unknown) => v,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

let mockLesson: any;
function lesson(level: string, states: string[], counts = [12, 6, 4, 4]) {
  return {
    situation: {
      id: 'SCN-ER-00002', title: '통증 사정 — Mrs. Hopkins', tagline: 'It hurts here.',
      persona: { name: 'Mrs. Hopkins', role: 'patient', mood: 'pain' },
      briefing: { dept: 'ER · TRAUMA BAY #4', timeLabel: '약 5분', brief: '허리 통증을 호소하는 환자.', rewards: [{ icon: 'star', label: '경험치', value: '+ 60 XP' }] },
    },
    level,
    steps: (['words', 'sentences', 'guided', 'free'] as const).map((kind, i) => ({ kind, state: states[i], count: counts[i] })),
    words: [], sentences: [],
  };
}
jest.mock('@/api/client', () => ({ api: { lesson: async () => mockLesson } }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useFocusEffect: (cb: () => void | (() => void)) => require('react').useEffect(cb, []),
  useRouter: () => ({ push: (p: unknown) => { mockNav.push(String(typeof p === 'string' ? p : JSON.stringify(p))); }, replace: () => {}, back: () => {}, canGoBack: () => true }),
  // A caller may still pass the old rung; the hub ignores it.
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: 'choices' }),
}));
const mockNav: string[] = [];

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonHub from '@/app/scenario/[id]';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbButton, NbPaper, NbStamp, NbTag } from '@/components/nb/NbUI';
import { NbInline } from '@/components/nb/NbInline';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

async function mount(l: unknown) {
  mockLesson = l;
  mockNav.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonHub />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

const gaugeCount = (tree: ReturnType<typeof create>) =>
  texts(tree.root.findAll((n) => n.props?.testID === 'lesson-gauge-count')[0]).join('');
const ticket = (tree: ReturnType<typeof create>, kind: string) =>
  tree.root.findAll((n) => n.props?.testID === `lesson-ticket-${kind}`)[0];
const pressable = (root: ReactTestInstance, label: string) =>
  root.findAll((n) => typeof n.props?.onPress === 'function' && texts(n).some((x) => x.includes(label)), { deep: true });

test('level b: the gauge counts three steps, not four', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  expect(gaugeCount(tree)).toBe('0/3');
  expect(texts(tree.root)).toContain('3단계로 익혀요');
});

test('level c: the gauge counts two', async () => {
  const tree = await mount(lesson('B2', ['skip', 'skip', 'now', 'lock']));
  expect(gaugeCount(tree)).toBe('0/2');
});

test('그래도 할래요 opens the skipped step and makes it the next one', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  const opt = pressable(ticket(tree, 'words'), '그래도 할래요');
  expect(opt.length).toBeGreaterThan(0);
  await act(async () => { opt[opt.length - 1].props.onPress(); });
  expect(gaugeCount(tree)).toBe('0/4');
  expect(texts(ticket(tree, 'words'))).toContain('시작');

  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 1');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/scenario/SCN-ER-00002/words']);
});

// 결정 3: content not written yet is not a skip — there is nothing to opt into.
test('an unwritten step offers no 그래도 할래요 and is not counted', async () => {
  const tree = await mount(lesson('A2', ['empty', 'empty', 'now', 'lock'], [0, 0, 4, 4]));
  expect(pressable(ticket(tree, 'words'), '그래도 할래요')).toHaveLength(0);
  expect(texts(ticket(tree, 'words'))).toContain('이 상황은 아직 준비 중이에요');
  expect(gaugeCount(tree)).toBe('0/2');
});

// 8 words and 5 sentences are minimums, not what the ticket says (spec §2-2).
test('the ticket meta follows the content count', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock'], [13, 7, 4, 4]));
  const all = texts(tree.root);
  expect(all).toContain('단어 13');
  expect(all).toContain('문장 7');
});

// The rung is the step's, not the ?guide= the caller passed (here the legacy 'choices').
test('each dialogue step sends its own rung into the conversation', async () => {
  const tree = await mount(lesson('B2', ['skip', 'skip', 'now', 'lock']));
  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 3');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=guided']);

  const done = await mount(lesson('B2', ['skip', 'skip', 'done', 'now']));
  const next = pressable(done.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], 'STEP 4');
  await act(async () => { next[next.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=free']);
});

test('everything done: the CTA replays the free dialogue', async () => {
  const tree = await mount(lesson('A2', ['done', 'done', 'done', 'done']));
  const cta = pressable(tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0], '다시 풀기');
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav).toEqual(['/dialogue/SCN-ER-00002?guide=free']);
});

// 결정 4: the hub has no tab bar, so its CTA sits where the STEP screens put theirs.
test('the CTA floats 30 above the bottom', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const box = tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0];
  expect(flatten(box.props.style).bottom).toBe(30);
});

// ── lesson-fidelity-v46 T6: the hub, 1:1 with forin-notebook-lesson.jsx LessonHub ──

const icons = (root: ReactTestInstance) => root.findAllByType(NbIcon).map((n) => n.props.name as string);
const testIDs = (tree: ReturnType<typeof create>, id: string) =>
  tree.root.findAll((n) => n.props?.testID === id && typeof n.type === 'string');
const textNode = (root: ReactTestInstance, s: string) =>
  root.findAll((n) => String(n.type) === 'Text' && n.children.some((c) => c === s))[0];

// L131: the feeling in Korean (결정 9 — a mood → label table), `+60 XP` spaced, `노트 자동저장`.
test('the cover chips: the feeling as a word, the XP spaced, the note auto-saved', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const all = texts(tree.root);
  expect(all).toContain('아픔');
  expect(all).not.toContain('PAIN');
  expect(all).toContain('+60 XP');
  expect(all).toContain('노트 자동저장');
  const angry = lesson('A2', ['now', 'lock', 'lock', 'lock']);
  angry.situation.persona.mood = 'angry';
  angry.situation.briefing.rewards = [{ icon: 'star', label: 'XP', value: '+60XP' }];
  const t2 = await mount(angry);
  expect(texts(t2.root)).toContain('짜증남');
  expect(texts(t2.root)).toContain('+60 XP');
  expect(icons(t2.root)).toContain('faceAngry');
});

// L110: `ER · 투약 안전 · 오류 예방 · 3/34` — department, theme, place in the theme.
test('the subtitle is the curriculum coordinate, or the department without one', async () => {
  const withCourse = { ...lesson('A2', ['now', 'lock', 'lock', 'lock']), course: { dept: 'ER', theme: '환자 안전·오류 예방', index: 3, total: 34 } };
  const tree = await mount(withCourse);
  const sub = textNode(tree.root, 'ER · 환자 안전·오류 예방 · 3/34');
  expect(sub).toBeTruthy();
  // 10.5 soft, marginTop 2, no line height of its own (L56).
  expect(flatten(sub.props.style)).toMatchObject({ fontSize: 10.5, marginTop: 2 });
  expect(flatten(sub.props.style).lineHeight).toBeUndefined();
  const bare = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  expect(textNode(bare.root, 'ER · TRAUMA BAY #4')).toBeTruthy();
});

// L55: Gaegu 21, lineHeight 1.1.
test('the title sits on a 1.1 line', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  expect(flatten(textNode(tree.root, '통증 사정 — Mrs. Hopkins').props.style)).toMatchObject({ fontSize: 21, lineHeight: 23.1 });
});

// L110, L122–124: every tag is 10.5; the level tag carries a shield, the place tag a siren.
test('the tags are 10.5 with the shield and the siren', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const tags = tree.root.findAllByType(NbTag);
  expect(tags).toHaveLength(4);
  for (const tag of tags) expect(flatten(tag.props.textStyle).fontSize).toBe(10.5);
  const iconOf = (label: string) => tags.find((tg) => texts(tg).some((x) => x.includes(label)))!.props.icon;
  expect(iconOf('기초')).toBe('shield');
  expect(iconOf('TRAUMA BAY')).toBe('siren');
  expect(iconOf('Lv.')).toBeUndefined();
});

// L126: the one line, with its highlighted span (briefing.line `[[…]]`); the brief unmarked without it.
test('the one line highlights its span, and falls back to the brief unmarked', async () => {
  const l = lesson('A2', ['now', 'lock', 'lock', 'lock']);
  (l.situation.briefing as any).line = '“또 물어요?” — 환자에게 [[왜 매번 확인하는지]] 설명하기';
  const tree = await mount(l);
  const run = tree.root.findAllByType(NbInline);
  expect(run).toHaveLength(1);
  expect(run[0].props.parts).toEqual([{ text: '“또 물어요?” — 환자에게 ' }, { text: '왜 매번 확인하는지', mark: true }, { text: ' 설명하기' }]);
  // Gaegu 15 soft, marginTop 8, lineHeight 1.4 (21).
  expect(run[0].props.textStyle).toMatchObject({ fontSize: 15, color: nb.soft, lineHeight: 21 });
  expect(flatten(run[0].props.style).marginTop).toBe(8);
  expect(run[0].findAll((n) => n.props?.testID === 'nb-inline-mark' && typeof n.type === 'string').length).toBeGreaterThan(0);
  expect(texts(tree.root).join('')).not.toContain('[[');
  const bare = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  expect(bare.root.findAllByType(NbInline)).toHaveLength(0);
  expect(texts(bare.root)).toContain('허리 통증을 호소하는 환자.');
});

// L90: the step in progress keeps its 1px paper edge and gets a 2.5 ring OUTSIDE it.
test('the step in progress wears an outer ring, not a thicker border', async () => {
  const tree = await mount(lesson('A2', ['done', 'now', 'lock', 'lock']));
  const t = ticket(tree, 'sentences');
  const paper = t.findAllByType(NbPaper)[0];
  expect(flatten(paper.props.style).borderWidth).toBeUndefined();
  const ring = t.findAll((n) => n.props?.testID === 'lesson-ticket-ring' && typeof n.type === 'string');
  expect(ring).toHaveLength(1);
  expect(flatten(ring[0].props.style)).toMatchObject({ position: 'absolute', left: -3.5, top: -3.5, right: -3.5, bottom: -3.5, borderWidth: 2.5, borderColor: nb.blue });
  expect(ticket(tree, 'guided').findAll((n) => n.props?.testID === 'lesson-ticket-ring')).toHaveLength(0);
});

// L103: the done stamp has a ✓ above 완료 — drawn (결정 4 — glyphs are NbIcon).
test('the done stamp carries a check over 완료', async () => {
  const tree = await mount(lesson('A2', ['done', 'now', 'lock', 'lock']));
  const stamp = ticket(tree, 'words').findAllByType(NbStamp)[0];
  expect(stamp.props).toMatchObject({ topIcon: 'check', bottom: '완료', size: 40, color: nb.green });
});

// L79: the skipped card is hatched; the not-yet-written card (결정 3) is not.
test('the skipped card is hatched', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  expect(ticket(tree, 'words').findAll((n) => n.props?.testID === 'lesson-skip-hatch' && typeof n.type === 'string')).toHaveLength(1);
  const empty = await mount(lesson('A2', ['empty', 'empty', 'now', 'lock'], [0, 0, 4, 4]));
  expect(ticket(empty, 'words').findAll((n) => n.props?.testID === 'lesson-skip-hatch')).toHaveLength(0);
});

// L154: `STEP n 이어서 ›`, `다시 풀기 ↺` — the glyphs drawn after the label.
test('the CTA ends in the chevron or the replay arrow', async () => {
  const going = await mount(lesson('A2', ['done', 'now', 'lock', 'lock']));
  const cta = (tree: ReturnType<typeof create>) => tree.root.findAll((n) => n.props?.testID === 'lesson-cta')[0].findAllByType(NbButton)[0];
  expect(cta(going).props.iconRight).toBe('chevronRight');
  const first = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  expect(cta(first).props.iconRight).toBeUndefined();
  const all = await mount(lesson('A2', ['done', 'done', 'done', 'done']));
  expect(cta(all).props.iconRight).toBe('redo');
});

// L82, L96, L145: MONO 700 with no tracking.
test('the step labels and the count are mono with no tracking', async () => {
  const tree = await mount(lesson('B1', ['skip', 'now', 'lock', 'lock']));
  expect(flatten(textNode(tree.root, 'STEP 2').props.style).letterSpacing).toBe(0);
  expect(flatten(textNode(tree.root, 'STEP 1').props.style).letterSpacing).toBe(0);
  const count = tree.root.findAll((n) => n.props?.testID === 'lesson-gauge-count' && String(n.type) === 'Text')[0];
  expect(flatten(count.props.style)).toMatchObject({ letterSpacing: 0, fontSize: 11 });
});

// L99: the meta row is gap 6 and does not wrap.
test('the ticket meta row is gap 6, one line', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const row = tree.root.findAll((n) => n.props?.testID === 'lesson-meta-row-words' && typeof n.type === 'string')[0];
  expect(flatten(row.props.style)).toMatchObject({ gap: 6 });
  expect(flatten(row.props.style).flexWrap).toBeUndefined();
});

// L116: the polaroid is the avatar itself (72 → 72×78.75), with no taller box around it.
test('the polaroid frames the avatar with no extra box', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const avatar = tree.root.findAllByType(NbAvatar)[0];
  expect(avatar.props.size).toBe(72);
  expect(flatten(avatar.parent!.props.style).height).not.toBe(84);
});

// ui.jsx L164: the rule is the last point of each 28pt band — y = 27, 55, …
test('the page is ruled at 27, 55, …', async () => {
  const tree = await mount(lesson('A2', ['now', 'lock', 'lock', 'lock']));
  const rules = tree.root.findAll((n) => typeof n.type === 'string' && flatten(n.props.style).height === 1 && flatten(n.props.style).position === 'absolute');
  expect(flatten(rules[0].props.style).top).toBe(27);
  expect(flatten(rules[1].props.style).top).toBe(55);
});
