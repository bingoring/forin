// The intents the learner could aim for this turn — the guided pass, redesigned.
//
// The card no longer hands over a ready-made target-language sentence. It hands over a
// GOAL in the learner's own language; picking one opens the mic below, and the learner
// says it in the target language themselves. Producing the sentence is the practice, so
// the words must NOT be on the card.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));

const mockSounds: string[] = [];
jest.mock('@/lib/sfx', () => ({ playSfx: (n: string) => { mockSounds.push(n); }, primeSfx: () => {}, loadSfxPreference: async () => {} }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ReplyChoices } from '@/components/dialogue/ReplyChoices';
import { trackMounts } from '@/testing/mountRegistry';
import type { ReplyChoice } from '@/api/client';

const track = trackMounts();

// intent = the goal (native), text = the hidden model line (target), why = the reason.
const CHOICES: ReplyChoice[] = [
  { tier: 'best', intent: '통증 위치를 정확히 물어보기', text: 'Can you tell me exactly where the pain is?', why: '통증 위치를 먼저 확보해요' },
  { tier: 'strong', intent: '지금 아픈지 확인하기', text: 'Are you in pain right now?', why: '통증 유무는 확인하지만 양상은 남아요' },
  { tier: 'fair', intent: '곁에 있음을 알려 안심시키기', text: "I'm here with you.", why: '안심시키지만 사정은 시작되지 않아요' },
];

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function press(root: ReactTestInstance, label: string): ReactTestInstance {
  const hits = root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).some((x) => x === label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

function mount(over: Partial<Parameters<typeof ReplyChoices>[0]> = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(
      <ReplyChoices
        choices={CHOICES}
        loading={false}
        onPick={() => {}}
        onWriteMyOwn={() => {}}
        maxHeight={300}
        {...over}
      />,
    ));
  });
  return tree;
}

beforeEach(() => { mockSounds.length = 0; });

test('the three intents are shown — and the target-language words are NOT', () => {
  const out = texts(mount().root);
  // The goal, in the learner's own language.
  for (const c of CHOICES) expect(out).toContain(c.intent);
  // Never the model sentence: handing over the words is the exact thing this redesign
  // removed — the learner must produce them.
  for (const c of CHOICES) expect(out).not.toContain(c.text);
  // Nor the reason (that arrives later, as the correction), nor the tier.
  for (const c of CHOICES) expect(out).not.toContain(c.why);
});

test('the ranking is not printed on the cards', () => {
  const out = texts(mount().root).join(' ');
  for (const giveaway of ['가장 좋은', '꽤 괜찮은', '괜찮은 답', 'best', 'strong', 'fair']) {
    expect(out).not.toContain(giveaway);
  }
});

test('position gives nothing away — the order is shuffled and stable', () => {
  const order = (t: ReturnType<typeof create>) =>
    texts(t.root).filter((x) => CHOICES.some((c) => c.intent === x));
  const first = order(mount());
  expect(first).toHaveLength(3);
  expect(first[0]).not.toBe(CHOICES[0].intent);
  expect(order(mount())).toEqual(first);
});

test('picking an intent reports it — it does not fill a box with words', () => {
  const picked: ReplyChoice[] = [];
  const tree = mount({ onPick: (c) => picked.push(c) });
  act(() => { press(tree.root, CHOICES[0].intent).props.onPress(); });
  expect(picked).toEqual([CHOICES[0]]);
  expect(mockSounds).toEqual(['tap']);
});

test('a mic is drawn on each card, so it reads as "you will speak this"', () => {
  const mics = mount().root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon' && n.props?.name === 'mic',
    { deep: true },
  );
  expect(mics.length).toBe(CHOICES.length);
});

test('a card presses', () => {
  const tree = mount();
  const card = press(tree.root, CHOICES[0].intent);
  expect(typeof card.props.style).toBe('function');
  const at = (pressed: boolean) => {
    const st = card.props.style({ pressed }) as { transform?: { translateY?: number }[] };
    return st.transform ?? [];
  };
  expect(at(false)).toEqual([]);
  expect(at(true)).toEqual(expect.arrayContaining([{ translateY: 2 }]));
});

test('the list is capped and can be folded away', () => {
  const tree = mount({ maxHeight: 220 });
  const scroller = tree.root.findAll((n) => {
    const st = Array.isArray(n.props?.style) ? Object.assign({}, ...n.props.style) : (n.props?.style ?? {});
    return String(n.type) === 'RCTScrollView' && st.maxHeight === 220;
  }, { deep: true });
  expect(scroller.length).toBe(1);

  act(() => { press(tree.root, '접기').props.onPress(); });
  expect(texts(tree.root)).not.toContain(CHOICES[0].intent);
  expect(texts(tree.root)).toContain('펼치기');
});

test('there is always a way out of the scaffold — type it yourself', () => {
  let out = 0;
  const tree = mount({ onWriteMyOwn: () => { out += 1; } });
  act(() => { press(tree.root, '직접 입력할래요').props.onPress(); });
  expect(out).toBe(1);
});

test('while they are being written, it says so', () => {
  const out = texts(mount({ loading: true, choices: [] }).root);
  expect(out.some((x) => x.includes('찾는 중'))).toBe(true);
  expect(out).not.toContain(CHOICES[0].intent);
});

test('nothing to offer draws nothing at all', () => {
  expect(mount({ choices: [], loading: false }).toJSON()).toBeNull();
});

// ── the wiring ────────────────────────────────────────────────────────────
const SRC = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');

test('the rung the learner TAPPED decides it, with the server as fallback', () => {
  expect(SRC).toMatch(/const guided = isGuidedRung\(guideParam \?\? scenario\?\.guide\);/);
  expect(SRC).toMatch(/guide: guideParam \} = useLocalSearchParams/);
});

// 2026-09-30에 이 회차의 이름이 `choices` 에서 `guided` 로 바뀌었다. 판정을 화면에서
// 직접 하면 옛 이름이 박힌 딥링크가 조용히 자유 회차로 떨어진다 — 터지지 않고 그냥
// 보기가 사라지므로 눈으로 못 찾는다. 그래서 판정은 data/guideRung 한 곳에만 둔다.
test('회차 판정을 화면에서 직접 하지 않는다 — 옛 이름이 조용히 떨어진다', () => {
  expect(SRC).not.toMatch(/=== 'choices'/);
  expect(SRC).not.toMatch(/=== 'guided'/);
  expect(SRC).toMatch(/import \{ GUIDED, isGuidedRung \} from '@\/data\/guideRung'/);
  // 보낼 때는 새 이름만 쓴다.
  expect(SRC).not.toMatch(/'choices' : 'free'/);
});

test('the speak area opens once an intent is picked, or on the free path', () => {
  // The mic-driven input replaces the option list the moment a goal is chosen; it also
  // stands in for the whole box on the free / no-mic / empty path.
  expect(SRC).toMatch(/selectedChoice \|\| wroteOwn \|\| !guided \|\| \(!choicesBusy && choices\.length === 0\)/);
});

test('send carries the picked intent so the correction can judge against it', () => {
  expect(SRC).toMatch(/send\(selectedChoice \? \{ text: draft, intent: selectedChoice\.intent \}/);
});

test('the immediate correction lands under the learner’s own bubble', () => {
  // Grounded by the intent, it is feedback on the line just spoken — so it renders under
  // that bubble, not on the cards.
  expect(SRC).toMatch(/onCorrection:/);
  expect(SRC).toMatch(/mine && !!m\.correction/);
});

test('the NPC line types out letter by letter', () => {
  expect(SRC).toMatch(/<Typewriter[\s\S]{0,120}?text=\{showKo && npcLineKo \? npcLineKo : m\.text\}/);
});

test('the suggestions are answers to the line that was just said', () => {
  expect((SRC.match(/void loadChoices\(\)/g) ?? []).length).toBeGreaterThanOrEqual(2);
  expect(SRC).toMatch(/sessionRef\.current = sid;[\s\S]{0,400}?void loadChoices\(\)/);
});

test('asking for the box is remembered', () => {
  expect(SRC).toMatch(/if \(!guided \|\| wroteOwn \|\| !sid\) return;/);
});

// ── the hint ──────────────────────────────────────────────────────────────
test('the hint reveals the picked intent’s model line when stuck', () => {
  // With a goal chosen, "막히면 보기" shows THAT intent's model line in the target
  // language — it is already in hand, so no fetch. On the free pass it still withholds
  // the sentence and shows only the reason.
  expect(SRC).toMatch(/const askHint = async \(\) => \{/);
  expect(SRC).toMatch(/if \(selectedChoice\) \{ setHintText\(selectedChoice\.text\); return; \}/);
  expect(SRC).toMatch(/setHintText\(cs\.find\(\(c\) => c\.tier === 'best'\)\?\.why/);
});

// Task 13 replaced 캠퍼스's DeptSheet/campus.tsx pair with the journey map's
// StationSheet/journey.tsx pair — the property survived through that pipe: a step row
// carries its own `guide` (JourneyStep, server-sent) straight to `onStepPress`, and
// journey.tsx threaded THAT into the push rather than re-deriving it.
//
// P3-C (curriculum-v3-journey-ia/build-spec-index.md) moved the whole pipe: the 일터
// 탭 (1단계) no longer opens a sheet at all, and `StationSheet.tsx` itself is gone —
// §6 of the build spec called this out up front ("시트는 이 화면에 흡수된다"). The
// 2단계 주제 화면 (`app/journey/theme/[themeKey].tsx` + `StationTrack.tsx`) is what
// absorbed the job, so this now checks the SAME property one hop later in that pipe:
// `StationTrack` still hands the tapped step's own `guide` straight through to
// `onStepPress` (via `pressStep`, not renamed away), and the theme screen's own
// `routeStep` still reads `step.guide` off of it rather than re-deriving one.
test('the chosen rung survives from the step row to the conversation screen', () => {
  const track = readFileSync(join(__dirname, '..', 'components', 'journey', 'StationTrack.tsx'), 'utf8');
  expect(track).toMatch(/onPress=\{\(\) => pressStep\(i, step\)\}/);
  expect(track).toMatch(/onStepPress\(step\);/);

  const theme = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'journey', 'theme', '[themeKey].tsx'), 'utf8');
  expect(theme).toMatch(/router\.push\(step\.guide \? `\/scenario\/\$\{scn\}\?guide=\$\{step\.guide\}`/);

  // v44 G (lesson-four-steps-v44 결정 4): the pipe now ends at the 상황 허브, which took
  // the briefing's route. The hub is where the rung is chosen — each dialogue step sends
  // its own (`stepHref`, locked in data/lessonSteps.test + screentests/lessonHub.test) —
  // so what must hold here is that the hub does NOT read a rung off the URL and forward
  // it: a stale `?guide=choices` link would otherwise open a pass the hub shows as locked.
  const hub = readFileSync(join(__dirname, '..', 'app', 'scenario', '[id]', 'index.tsx'), 'utf8');
  expect(hub).toMatch(/router\.push\(stepHref\(id, k\)\)/);
  expect(hub).not.toMatch(/useLocalSearchParams<\{[^}]*guide/);
});
