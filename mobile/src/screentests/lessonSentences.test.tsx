// STEP 2 문장 — lesson-fidelity-v46 T4. 아트보드 순서대로 나뉜 화면(§L, 결정 2):
// 릴(C0) → 문장장(장마다 프롬프트 → 확인 → 해설 → 헷갈려요/알겠어요 → … → DONE 장) → C5 → C6 → 완료(C').
// 모션은 줄인 상태로 돌린다(뜯김·스와이프가 즉시 끝난다) — 모션 순서 자체는 부품 테스트가 본다.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-speech', () => ({ speak: (text: string) => { mockSpoken.push(text); }, stop: () => {} }));
const mockSpoken: string[] = [];
const mockCalls: string[] = [];
let mockFeelFails = false;
/** 'full' — every v46 field authored · 'bare' — v45 content: no reel, no order, no nuance drills, no v46 fields. */
let mockShape: 'full' | 'bare' = 'full';

const S = (en: string, chunks: string[], words: string[], goal: number, extra: Record<string, unknown> = {}) => ({ en, ko: `${en} (뜻)`, chunks, words, goal, ...extra });
function mockLesson() {
  const full = mockShape === 'full';
  return {
    situation: { id: 'SCN-ER-00002', title: '통증 척도 초기 사정 · Marcus Bell' },
    level: 'A2',
    steps: [
      { kind: 'words', state: 'done', count: 3 }, { kind: 'sentences', state: 'now', count: 5 },
      { kind: 'guided', state: 'lock', count: 3 }, { kind: 'free', state: 'lock', count: 3 },
    ],
    words: [{ id: 'w-pain', en: 'pain', ko: '통증' }, { id: 'w-scale', en: 'scale', ko: '척도' }, { id: 'w-worse', en: 'worse', ko: '더 나쁜' }],
    sentences: [
      S('Rate your pain.', ['Rate', 'your pain', '.'], ['w-pain'], 1, full ? { tag: '통증 점수', icon: 'chartup', why: '점수로 물으면 비교가 쉬워요.', decoy: 'for the doctor' } : {}),
      S('Use this scale.', ['Use', 'this scale', '.'], ['w-scale'], 2, {
        review: true, ...(full ? { tag: '척도 안내', icon: 'board', why: '척도를 먼저 보여 줘요.', distractorsKo: ['지금 약을 드릴게요', '차트에 기록했어요'] } : {}),
      }),
      S('I know it feels repetitive.', ['I know', 'it feels', 'repetitive', '.'], [], 3, full ? {
        tag: '공감', icon: 'faceWorried', why: '공감이 먼저.',
        blank: { answer: 'repetitive', options: [{ en: 'repetitive', icon: 'compass' }, { en: 'important', icon: 'star' }, { en: 'annoying', icon: 'faceAngry' }, { en: 'quick', icon: 'chartup' }] },
      } : {}),
      S('Is it getting worse?', ['Is it', 'getting worse', '?'], ['w-worse'], 3),
      S('Tell me if it changes.', ['Tell me', 'if it changes', '.'], [], 4),
    ],
    ...(full ? {
      order: {
        ko: '통증 사정 4문장 순서', why: '척도부터 보여 줘요.',
        lines: [{ en: 'Use this scale.', icon: 'board' }, { en: 'Rate your pain.', icon: 'chartup' }, { en: 'Is it getting worse?', icon: 'monitor' }, { en: 'Thank you.', icon: 'star' }],
      },
    } : {}),
    nuance: full ? [
      { kind: 'reel', words: ['w-pain'], word: 'pain', why: '누구에게나 쓰는 쉬운 말이에요.', feels: ['직설적', '환자에게도 씀', '차트용'], scenes: [
        { who: '환자', en: 'The pain is sharp.', ko: '1', tone: '급함' }, { who: '인계', en: 'Pain 7/10.', ko: '2' },
        { who: '보호자에게는', en: 'He is in pain.', ko: '3', swap: true }] },
      { kind: 'context', words: ['w-pain'], word: 'pain', ko: '통증', why: '환자에게는 쉬운 말로.', scenes: [
        { who: '차트', icon: 'board', en: 'Pt reports pain 7/10.', ok: true },
        { who: '환자에게', icon: 'me', en: 'Your NRS is 7.', ok: false, fix: 'You said your pain is a 7.' },
        { who: '의사에게', icon: 'monitor', en: 'Pain is 7 out of 10.', ok: true }] },
      { kind: 'swap', words: ['w-pain'], who: '보호자에게', icon: 'me', before: ['Your dad is in ', 'agony', ' now.'], options: ['pain', 'agony', 'hurt'], answer: 'pain',
        notes: { pain: '가장 흔한 말.', agony: '너무 세요.', hurt: '아이 말 같아요.' }, why: '보호자에게는 온도를 낮춰요.', ko: '아버님이 지금 아파하세요' },
    ] : [],
  };
}
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => mockLesson(),
    clearLessonStep: async (s: string, k: string) => { mockCalls.push(`clear ${s} ${k}`); return mockLesson(); },
    reelFeel: async (s: string, f: string) => {
      mockCalls.push(`feel ${s} ${f}`);
      if (mockFeelFails) throw new Error('offline');
      return { created: true };
    },
    confusedSentence: async (s: string, en: string) => { mockCalls.push(`confused ${s} ${en}`); return { created: true }; },
    speechAttempts: async (text: string) => (text === 'Rate your pain.' ? [{ overall: 91.4 }] : text === 'Use this scale.' ? [{ overall: 69 }] : []),
  },
}));
jest.mock('expo-router', () => {
  const { useEffect } = jest.requireActual('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({
      push: (p: unknown) => { mockCalls.push(`push ${JSON.stringify(p)}`); },
      replace: (p: unknown) => { mockCalls.push(`replace ${String(p)}`); }, back: () => { mockCalls.push('back'); }, canGoBack: () => true,
    }),
    useLocalSearchParams: () => ({ id: 'SCN-ER-00002' }),
    useFocusEffect: (cb: () => void) => useEffect(cb, [cb]),
  };
});

import { AccessibilityInfo } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import LessonSentences from '@/app/scenario/[id]/sentences';
import { trackMounts } from '../testing/mountRegistry';

jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
// A walk through every sheet is a few hundred renders — under a full parallel run that outgrows 5s.
jest.setTimeout(30000);
const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
const allText = (root: ReactTestInstance) => texts(root).join('');
/** Text in reading order — nested Text runs where they sit. */
const inOrder = (n: ReactTestInstance | string): string => (typeof n === 'string' ? n : n.children.map(inOrder).join(''));
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const hostID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type === 'string');
async function press(node: ReactTestInstance) {
  const hit = [node, ...node.findAll(() => true)].find((n) => typeof n.props?.onPress === 'function');
  expect(hit).toBeTruthy();
  expect(hit!.props.disabled).not.toBe(true); // a disabled control does not answer a tap
  await act(async () => { await hit!.props.onPress(); });
}
const pressID = async (root: ReactTestInstance, id: string) => press(byID(root, id)[0]);
async function pressLabel(root: ReactTestInstance, prefix: string, label: string) {
  const hit = root.findAll((n) => typeof n.type !== 'string' && String(n.props?.testID ?? '').startsWith(prefix) && texts(n).join('') === label)[0];
  expect(hit).toBeTruthy();
  await press(hit);
}
const flat = (n: ReactTestInstance) => Object.assign({}, ...[n.props.style].flat(5).filter(Boolean)) as Record<string, unknown>;
const opacityOf = (root: ReactTestInstance, id: string) => flat(hostID(root, id)[0]).opacity;
/** The current sheet (the layer that answers). */
const current = (root: ReactTestInstance) => hostID(root, 'sheet-current-layer')[0];
const barColors = (root: ReactTestInstance) => hostID(root, 'sent-bar-cell').map((n) => n.props.accessibilityLabel);

async function mount() {
  mockCalls.length = 0;
  mockSpoken.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LessonSentences />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

beforeEach(() => { mockShape = 'full'; mockFeelFails = false; });

// ── C0 릴 ────────────────────────────────────────────────────────────────────

describe('C0 문장 릴', () => {
  it('has its own frame — tag, 30초, a blue cell per scene, the title with the count in words', async () => {
    const tree = await mount();
    const t = allText(tree.root);
    expect(t).toContain('STEP 2 · 워밍업');
    expect(t).toContain('30초');
    expect(texts(hostID(tree.root, 'sent-title')[0]).join('')).toBe('외우지 말고 세 장면에서 그냥 만나보세요');
    expect(hostID(tree.root, 'nb-inline-mark').length).toBeGreaterThan(0);
    expect(barColors(tree.root)).toEqual(['rgba(62,54,43,.15)', 'rgba(62,54,43,.15)', 'rgba(62,54,43,.15)']);
    expect(texts(byID(tree.root, 'sent-reel-count')[0])).toEqual(['1 / 3']);
  });

  it('two cards wait behind the first scene, one behind the second, none behind the last', async () => {
    const tree = await mount();
    expect([hostID(tree.root, 'sent-reel-back2').length, hostID(tree.root, 'sent-reel-back1').length]).toEqual([1, 1]);
    await pressID(tree.root, 'sent-reel-card');
    expect([hostID(tree.root, 'sent-reel-back2').length, hostID(tree.root, 'sent-reel-back1').length]).toEqual([0, 1]);
    await pressID(tree.root, 'sent-reel-card');
    expect([hostID(tree.root, 'sent-reel-back2').length, hostID(tree.root, 'sent-reel-back1').length]).toEqual([0, 0]);
    expect(barColors(tree.root).slice(0, 2)).toEqual(['#4A6FA5', '#4A6FA5']);
  });

  it('marks the word in the scene line, and the guardian scene is the amber dashed card', async () => {
    const tree = await mount();
    const line = hostID(tree.root, 'sent-reel-line')[0];
    expect(texts(line)).toContain('pain');
    expect(hostID(line, 'nb-inline-mark')).toHaveLength(1);
    await pressID(tree.root, 'sent-reel-card');
    await pressID(tree.root, 'sent-reel-card');
    const swapCard = hostID(tree.root, 'sent-reel-card')[0].findAll((n) => typeof n.type === 'string' && flat(n).borderStyle === 'dashed');
    expect(swapCard.length).toBeGreaterThan(0);
  });

  it('the CTA stays dashed until a 감상 is left; the chips can be re-picked but the note is saved once', async () => {
    const tree = await mount();
    for (let k = 0; k < 3; k++) await pressID(tree.root, 'sent-reel-card');
    expect(hostID(tree.root, 'sent-feel-card')).toHaveLength(1);
    expect(inOrder(hostID(tree.root, 'sent-feel-card')[0])).toContain('세 번 만난 pain, 어떤 느낌이었나요?');
    expect(opacityOf(tree.root, 'sent-start')).toBe(0.5);
    await pressID(tree.root, 'sent-start');
    expect(hostID(tree.root, 'sent-feel-card')).toHaveLength(1); // not yet
    await pressLabel(tree.root, 'sent-feel-', '차트용');
    expect(allText(tree.root)).toContain('누구에게나 쓰는 쉬운 말이에요.');
    expect(byID(tree.root, 'sent-feel-saved')).toHaveLength(1);
    await pressLabel(tree.root, 'sent-feel-', '직설적');
    expect(byID(tree.root, 'sent-feel-0')[0].props.accessibilityState).toEqual({ selected: true });
    expect(byID(tree.root, 'sent-feel-2')[0].props.accessibilityState).toEqual({ selected: false });
    expect(mockCalls.filter((c) => c.startsWith('feel '))).toEqual(['feel SCN-ER-00002 차트용']);
    expect(opacityOf(tree.root, 'sent-start')).toBe(1);
    expect(allText(tree.root)).toContain('STEP 2 · 문장 학습 시작');
    await pressID(tree.root, 'sent-start');
    expect(hostID(tree.root, 'sheet-stack')).toHaveLength(1);
  });

  it('a failed save still shows the note and lets the learner on — and says so', async () => {
    mockFeelFails = true;
    const tree = await mount();
    for (let k = 0; k < 3; k++) await pressID(tree.root, 'sent-reel-card');
    await pressLabel(tree.root, 'sent-feel-', '차트용');
    expect(byID(tree.root, 'sent-feel-failed')).toHaveLength(1);
    expect(opacityOf(tree.root, 'sent-start')).toBe(1);
  });
});

async function toSheets(tree: ReturnType<typeof create>) {
  for (let k = 0; k < 3; k++) await pressID(tree.root, 'sent-reel-card');
  await pressLabel(tree.root, 'sent-feel-', '차트용');
  await pressID(tree.root, 'sent-start');
}

// ── 문장장 ───────────────────────────────────────────────────────────────────

describe('문장장', () => {
  it('frame: STEP 2 · 문장, n / N, one cell per sheet, the title with the situation short name', async () => {
    const tree = await mount();
    await toSheets(tree);
    expect(texts(byID(tree.root, 'sent-count')[0])).toEqual(['1 / 6']);
    expect(barColors(tree.root)).toHaveLength(6);
    expect(texts(hostID(tree.root, 'sent-title')[0]).join('')).toBe('통증 척도 초기 사정 — 뜻을 보고 문장을 만들어보세요');
    // T8 user decision (§7): no CTA under the sheets until the pad is done — it did nothing before DONE
    expect(byID(tree.root, 'sent-sheets-next')).toHaveLength(0);
  });

  it('listen: the speaker circle plays, two replays and no more; A/B/C; the review sentence first', async () => {
    const tree = await mount();
    await toSheets(tree);
    const cur = current(tree.root);
    expect(texts(cur)).toEqual(expect.arrayContaining(['척도 안내', '듣고 뜻 고르기', '1 / 6', '이 문장의 뜻은?', 'A', 'B', 'C']));
    expect(hostID(cur, 'sent-wave-bar')).toHaveLength(18);
    for (let k = 0; k < 3; k++) await pressID(current(tree.root), 'sheet-icon-press');
    expect(mockSpoken.filter((s) => s === 'Use this scale.')).toHaveLength(3);
    // the first listen and two replays — then the speaker does nothing
    expect(byID(current(tree.root), 'sheet-icon-press')[0].props.onPress).toBeUndefined();
    expect(byID(current(tree.root), 'sent-replay')[0].props.disabled).toBe(true);
    expect(texts(byID(current(tree.root), 'sent-replay-left')[0]).join('')).toBe('탭해서 다시 듣기 · 0회');
    // the authored wrong meanings
    expect(texts(current(tree.root))).toEqual(expect.arrayContaining(['지금 약을 드릴게요', '차트에 기록했어요']));
  });

  it('a right answer: GOOD, the explanation with why and 따라 말하기, then 아직 헷갈려요 files it and tears left', async () => {
    const tree = await mount();
    await toSheets(tree);
    expect(opacityOf(tree.root, 'sent-check')).toBe(0.4);
    const opt = byID(current(tree.root), 'sent-opt-0').concat(byID(current(tree.root), 'sent-opt-1'), byID(current(tree.root), 'sent-opt-2'))
      .find((n) => texts(n).includes('Use this scale. (뜻)'))!;
    await press(opt);
    await pressID(tree.root, 'sent-check');
    const cur = current(tree.root);
    expect(hostID(cur, 'sent-stamp-good')).toHaveLength(1);
    expect(texts(cur)).toContain('듣고 뜻 고르기 · 해설');
    expect(inOrder(hostID(cur, 'sent-why')[0])).toBe('왜? 척도를 먼저 보여 줘요.');
    await pressID(cur, 'sent-repeat');
    expect(mockCalls.find((c) => c.startsWith('push'))).toContain('"referenceText":"Use this scale."');
    expect(allText(tree.root)).toContain('외웠어요');
    await pressID(tree.root, 'sent-fuzzy');
    expect(mockCalls).toContain('confused SCN-ER-00002 Use this scale.');
    expect(texts(byID(tree.root, 'sent-count')[0])).toEqual(['2 / 6']);
    expect(barColors(tree.root)[0]).toBe('#C75146');
  });

  it('build: placeholder, pieces each marked, any piece taken back, the decoy in the pool; wrong is RETRY + 이제 알겠어요', async () => {
    const tree = await mount();
    await toSheets(tree);
    await press(byID(current(tree.root), 'sent-opt-0')[0]);
    await pressID(tree.root, 'sent-check');
    await pressID(tree.root, 'sent-known');
    const cur = () => current(tree.root);
    expect(texts(cur())).toEqual(expect.arrayContaining(['통증 점수', '청크 조립', 'Rate your pain. (뜻)']));
    expect(texts(byID(cur(), 'sent-build-empty')[0])).toEqual(['Rate _ _ _ _ _']);
    expect(texts(cur())).toContain('for the doctor');
    await pressLabel(cur(), 'sent-chunk-', 'your pain.');
    await pressLabel(cur(), 'sent-chunk-', 'for the doctor');
    await pressLabel(cur(), 'sent-chunk-', 'Rate');
    // the used chip is hatched and dashed
    expect(hostID(cur(), 'sent-hatch').length).toBe(3);
    await pressID(cur(), 'sent-built-1'); // take back the decoy only — the one in the middle
    expect([0, 1].map((k) => texts(byID(cur(), `sent-built-${k}`)[0]).join(''))).toEqual(['your pain.', 'Rate']);
    expect(byID(cur(), 'sent-built-2')).toHaveLength(0);
    await pressID(tree.root, 'sent-check');
    expect(hostID(cur(), 'sent-stamp-retry')).toHaveLength(1);
    expect(flat(hostID(cur(), 'sent-build-line')[0]).borderColor).toBe('#C75146');
    expect(allText(tree.root)).toContain('이제 알겠어요');
  });

  it('blank (authored): 2×2 icon cards; a wrong pick shows the answer in red in the slot', async () => {
    const tree = await mount();
    await toSheets(tree);
    for (let k = 0; k < 2; k++) {
      if (k === 0) await press(byID(current(tree.root), 'sent-opt-0')[0]);
      else { await pressLabel(current(tree.root), 'sent-chunk-', 'Rate'); await pressLabel(current(tree.root), 'sent-chunk-', 'your pain.'); }
      await pressID(tree.root, 'sent-check');
      await pressID(tree.root, 'sent-known');
    }
    const cur = () => current(tree.root);
    expect(texts(cur())).toEqual(expect.arrayContaining(['공감', '빈칸 채우기', 'I know it feels repetitive. (뜻)', '?']));
    expect(cur().findAll((n) => n.props?.name === 'compass')).toHaveLength(1);
    await pressLabel(cur(), 'sent-opt-', 'quick');
    expect(texts(byID(cur(), 'sent-blank-text')[0])).toEqual(['quick']);
    await pressID(tree.root, 'sent-check');
    expect(texts(byID(cur(), 'sent-blank-text')[0])).toEqual(['repetitive']);
    expect(flat(hostID(cur(), 'sent-blank-text')[0]).color).toBe('#C75146');
  });

  it('order: number circles, a picked number taken back, the four lines in the written order are GOOD', async () => {
    const tree = await mount();
    await toSheets(tree);
    // listen, build, blank, listen — then the order card (5th)
    await press(byID(current(tree.root), 'sent-opt-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
    await pressLabel(current(tree.root), 'sent-chunk-', 'Rate'); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
    await press(byID(current(tree.root), 'sent-opt-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
    await press(byID(current(tree.root), 'sent-opt-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
    const cur = () => current(tree.root);
    expect(texts(cur())).toEqual(expect.arrayContaining(['대화 순서', '통증 사정 4문장 순서', '말할 순서대로 탭하세요 · 다시 누르면 취소']));
    const lines = ['Use this scale.', 'Rate your pain.', 'Is it getting worse?', 'Thank you.'];
    await pressLabel(cur(), 'sent-order-', `?${lines[1]}`);
    expect(allText(cur())).toContain(`1${lines[1]}`);
    await pressLabel(cur(), 'sent-order-', `1${lines[1]}`); // take it back
    for (const [k, l] of lines.entries()) await pressLabel(cur(), 'sent-order-', `?${l}`).then(() => expect(allText(cur())).toContain(`${k + 1}${l}`));
    await pressID(tree.root, 'sent-check');
    expect(hostID(cur(), 'sent-stamp-good')).toHaveLength(1);
    expect(texts(hostID(cur(), 'sent-reveal-line')[0]).filter((x) => x !== ' ')).toEqual(lines.join(' ').split(' '));
  });
});

async function finishSheets(tree: ReturnType<typeof create>) {
  await press(byID(current(tree.root), 'sent-opt-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
  await pressLabel(current(tree.root), 'sent-chunk-', 'Rate'); await pressLabel(current(tree.root), 'sent-chunk-', 'your pain.'); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
  await pressLabel(current(tree.root), 'sent-opt-', 'repetitive'); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-fuzzy');
  await press(byID(current(tree.root), 'sent-opt-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
  for (let k = 0; k < 4; k++) await press(byID(current(tree.root), `sent-order-${k}`)[0]);
  await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
  await press(byID(current(tree.root), 'sent-chunk-0')[0]); await pressID(tree.root, 'sent-check'); await pressID(tree.root, 'sent-known');
}

describe('DONE 장 → C5 → C6 → C\'', () => {
  it('the DONE sheet tallies right and fuzzy; the CTA turns ink and goes on', async () => {
    const tree = await mount();
    await toSheets(tree);
    await finishSheets(tree);
    expect(hostID(tree.root, 'sheet-done')).toHaveLength(1);
    expect(texts(byID(tree.root, 'sent-done-sheet')[0])).toEqual(expect.arrayContaining(['DONE', '문장 완료', '바로 맞힘', '틀림 → 노트']));
    const right = Number(texts(byID(tree.root, 'sent-done-right')[0])[0]);
    const wrong = Number(texts(byID(tree.root, 'sent-done-wrong')[0])[0]);
    expect(right + wrong).toBe(6);
    expect(wrong).toBeGreaterThanOrEqual(1); // the 헷갈려요 on the blank
    expect(texts(byID(tree.root, 'sent-count')[0])).toEqual(['6 / 6']);
    expect(byID(tree.root, 'sent-sheets-next')).toHaveLength(1);
  });

  it('C5: word + ko head, memo, rings, the fix marked after the arrow, the stamp in the card', async () => {
    const tree = await mount();
    await toSheets(tree);
    await finishSheets(tree);
    await pressID(tree.root, 'sent-sheets-next');
    const t = allText(tree.root);
    expect(t).toContain('STEP 2 · 문장 1/2');
    expect(t).toContain('같은 뜻, 다른 장면');
    expect(texts(hostID(tree.root, 'sent-title')[0]).join('')).toBe('pain이 어색한 장면은 어디일까요?');
    expect(texts(byID(tree.root, 'sent-ctx-memo')[0]).join('')).toBe('뜻은 셋 다 “통증” — 듣는 사람이 달라요');
    expect(barColors(tree.root)).toEqual(['#C77E2E', 'rgba(62,54,43,.15)']);
    await pressID(tree.root, 'sent-scene-0');
    expect(flat(hostID(byID(tree.root, 'sent-scene-0')[0], 'sent-scene-ring')[0]).borderColor).toBe('#3E362B');
    await pressID(tree.root, 'sent-check');
    expect(flat(hostID(byID(tree.root, 'sent-scene-1')[0], 'sent-scene-ring')[0])).toMatchObject({ borderColor: '#5F8D5A', borderWidth: 2.5 });
    expect(flat(hostID(byID(tree.root, 'sent-scene-0')[0], 'sent-scene-ring')[0])).toMatchObject({ borderColor: '#C75146', borderWidth: 2 });
    expect(hostID(byID(tree.root, 'sent-scene-1')[0], 'nb-inline-strike').length).toBeGreaterThan(0);
    expect(hostID(byID(tree.root, 'sent-scene-1')[0], 'sent-stamp-retry')).toHaveLength(1);
    const fix = byID(tree.root, 'sent-ctx-fix')[0];
    expect(texts(fix).filter((x) => x !== ' ').join(' ')).toBe('You said your pain is a 7.');
    expect(hostID(fix, 'nb-inline-mark').length).toBeGreaterThan(0);
    expect(texts(byID(tree.root, 'sent-ctx-why')[0]).join('')).toContain('환자에게는 쉬운 말로.');
    await pressID(tree.root, 'sent-drill-repeat');
    expect(mockCalls.filter((c) => c.startsWith('push')).pop()).toContain('"referenceText":"You said your pain is a 7."');
  });

  it('C6: the underline, the pick written above it, re-pickable until checked; notes, stamp, the ko line; then C\' and STEP 3', async () => {
    const tree = await mount();
    await toSheets(tree);
    await finishSheets(tree);
    await pressID(tree.root, 'sent-sheets-next');
    await pressID(tree.root, 'sent-scene-1');
    await pressID(tree.root, 'sent-check');
    await pressID(tree.root, 'sent-drill-next');
    expect(allText(tree.root)).toContain('STEP 2 · 문장 2/2');
    expect(barColors(tree.root)).toEqual(['#3E362B', '#C77E2E']);
    expect(texts(byID(tree.root, 'sent-swap-ko')[0]).join('')).toBe('아버님이 지금 아파하세요 — 라고 전해야 해요');
    expect(hostID(tree.root, 'sent-swap-underline')).toHaveLength(1);
    await pressLabel(tree.root, 'sent-swap-opt-', 'hurt');
    expect(texts(byID(tree.root, 'sent-swap-over')[0])).toEqual(['hurt']);
    await pressLabel(tree.root, 'sent-swap-opt-', 'pain');
    expect(texts(byID(tree.root, 'sent-swap-over')[0])).toEqual(['pain']);
    await pressID(tree.root, 'sent-check');
    expect(hostID(tree.root, 'sent-swap-strike')).toHaveLength(1);
    expect(hostID(tree.root, 'sent-stamp-good')).toHaveLength(1);
    expect(allText(byID(tree.root, 'sent-swap-notes')[0])).toContain('너무 세요.');
    await pressID(tree.root, 'sent-drill-repeat');
    expect(mockCalls.filter((c) => c.startsWith('push')).pop()).toContain('"referenceText":"Your dad is in pain now."');
    await pressID(tree.root, 'sent-drill-next');

    // C'
    expect(byID(tree.root, 'sent-passed')).toHaveLength(1);
    // the artboard draws the stamp at the left edge — its centring text-align does not move a flex block (T8)
    expect(flat(hostID(tree.root, 'sent-passed-stamp')[0]).alignSelf).toBe('flex-start');
    expect(allText(tree.root)).toContain('문장 5개, 입에 붙었어요');
    expect(texts(byID(tree.root, 'sent-score-0')[0])).toEqual(['91']);
    expect(texts(byID(tree.root, 'sent-score-1')[0])).toEqual(['69']);
    expect(texts(byID(tree.root, 'sent-score-2')[0])).toEqual([]); // never said — no invented score
    await pressID(tree.root, 'sent-to-step3');
    expect(mockCalls.slice(-2)).toEqual(['clear SCN-ER-00002 sentences', 'replace /dialogue/SCN-ER-00002?guide=guided']);
  });
});

// ── R3 — 저작 전 콘텐츠 ─────────────────────────────────────────────────────────

describe('R3: v45 content — no reel, no order, no C5/C6, no v46 fields', () => {
  it('starts on the sheets, falls back for the tag and icon, draws no why box, skips the order sheet, ends at C\'', async () => {
    mockShape = 'bare';
    const tree = await mount();
    expect(hostID(tree.root, 'sheet-stack')).toHaveLength(1);
    expect(texts(byID(tree.root, 'sent-count')[0])).toEqual(['1 / 5']);
    const cur = current(tree.root);
    expect(texts(cur)).toContain('통증 척도 초기 사정'); // the tag fallback
    expect(cur.findAll((n) => n.props?.name === 'siren').length).toBe(0); // listen: the speaker, not the dept icon
    await press(byID(cur, 'sent-opt-0')[0]);
    await pressID(tree.root, 'sent-check');
    expect(byID(current(tree.root), 'sent-why')).toHaveLength(0);
    await pressID(tree.root, 'sent-known');
    // build: the department icon in the amber circle (ER → siren)
    expect(current(tree.root).findAll((n) => n.props?.name === 'siren').length).toBeGreaterThan(0);
    for (let k = 0; k < 4; k++) {
      const c = current(tree.root);
      const opt = byID(c, 'sent-opt-0')[0] ?? byID(c, 'sent-chunk-0')[0];
      await press(opt);
      await pressID(tree.root, 'sent-check');
      await pressID(tree.root, 'sent-known');
    }
    expect(hostID(tree.root, 'sheet-done')).toHaveLength(1);
    await pressID(tree.root, 'sent-sheets-next');
    expect(byID(tree.root, 'sent-passed')).toHaveLength(1);
  });

  it('exit goes back to the hub from any screen', async () => {
    const tree = await mount();
    await pressID(tree.root, 'sent-exit');
    expect(mockCalls).toContain('back');
  });
});
