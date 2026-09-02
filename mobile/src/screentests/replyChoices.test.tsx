// Three ways to answer, for the guided pass of a curriculum step.
//
// Testers froze on the first turn: a patient, an empty text box, and no idea what to
// say. These are what stands in that box's place the first time through a conversation.
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

const CHOICES: ReplyChoice[] = [
  { tier: 'best', text: 'Can you tell me exactly where the pain is?', why: '통증 위치를 먼저 확보해요' },
  { tier: 'strong', text: 'Are you in pain right now?', why: '통증 유무는 확인하지만 양상은 남아요' },
  { tier: 'fair', text: "I'm here with you.", why: '안심시키지만 사정은 시작되지 않아요' },
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
        onSpeak={() => {}}
        onWriteMyOwn={() => {}}
        maxHeight={300}
        {...over}
      />,
    ));
  });
  return tree;
}

beforeEach(() => { mockSounds.length = 0; });

test('all three sentences are shown', () => {
  const out = texts(mount().root);
  for (const c of CHOICES) expect(out).toContain(c.text);
});

test('the ranking is not printed on the cards', () => {
  // Labelling them 가장 좋은 답 / 꽤 괜찮은 답 / 괜찮은 답 answered the question for the
  // learner: they would read the badges and never the sentences. The learner chooses;
  // the app says afterwards what the choice achieved.
  const out = texts(mount().root).join(' ');
  for (const giveaway of ['가장 좋은', '꽤 괜찮은', '괜찮은 답', 'best', 'strong', 'fair']) {
    expect(out).not.toContain(giveaway);
  }
  // And no reason is visible before a choice is made — that is the other answer key.
  for (const c of CHOICES) expect(out).not.toContain(c.why);
});

test('the reason arrives AFTER the choice', () => {
  // Feedback, not an answer key. This is where the lesson actually lands: the learner
  // has already committed, so reading why it works is learning rather than copying.
  const out = texts(mount({ selectedText: CHOICES[1].text }).root);
  expect(out).toContain(CHOICES[1].why);
  // Only the chosen one's.
  expect(out).not.toContain(CHOICES[0].why);
});

test('position gives nothing away either', () => {
  // Best-first was a second answer key: the top card would be taken every time without
  // anyone reading the other two. The order is shuffled, and stable for a given set so
  // it does not jump around under a re-render.
  const order = (t: ReturnType<typeof create>) =>
    texts(t.root).filter((x) => CHOICES.some((c) => c.text === x));
  const first = order(mount());
  expect(first).toHaveLength(3);
  expect(first[0]).not.toBe(CHOICES[0].text);
  expect(order(mount())).toEqual(first);
});

test('picking fills the box; it does not leave the screen', () => {
  const picked: ReplyChoice[] = [];
  const spoken: ReplyChoice[] = [];
  const tree = mount({ onPick: (c) => picked.push(c), onSpeak: (c) => spoken.push(c) });
  act(() => { press(tree.root, CHOICES[0].text).props.onPress(); });
  expect(picked).toEqual([CHOICES[0]]);
  // Speaking is a separate decision. It used to be forced on everybody who chose — a
  // toll gate on the way to sending, which someone on a bus cannot pay.
  expect(spoken).toEqual([]);
  expect(mockSounds).toEqual(['tap']);
});

test('the mic zone is drawn, not just positioned', () => {
  // It is found by geometry elsewhere in this file, which passes on an empty yellow
  // rectangle. A learner needs to see a microphone there — the zone exists so speaking is
  // a decision rather than a consequence of choosing.
  const tree = mount();
  const mics = tree.root.findAll(
    (n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbIcon' && n.props?.name === 'mic',
    { deep: true },
  );
  expect(mics.length).toBe(CHOICES.length);
});

test('the mic is its own zone, and that is what opens practice', () => {
  const picked: ReplyChoice[] = [];
  const spoken: ReplyChoice[] = [];
  const tree = mount({ onPick: (c) => picked.push(c), onSpeak: (c) => spoken.push(c) });
  const mic = tree.root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes('말하기'),
    { deep: true },
  )[0];
  act(() => { mic.props.onPress(); });
  expect(spoken).toHaveLength(1);
  expect(picked).toEqual([]);
});

test('a card presses', () => {
  // Without it there was no sign a tap had landed.
  //
  // v29 reads it off the Pressable's OWN pressed state rather than a piece of component
  // state driven by onPressIn/onPressOut. Same movement, and it can no longer be
  // forgotten by a card that renders itself out of a plain View.
  const tree = mount();
  const card = press(tree.root, CHOICES[0].text);
  expect(typeof card.props.style).toBe('function');
  const at = (pressed: boolean) => {
    const st = card.props.style({ pressed }) as { transform?: { translateY?: number }[] };
    return st.transform ?? [];
  };
  expect(at(false)).toEqual([]);
  expect(at(true)).toEqual(expect.arrayContaining([{ translateY: 2 }]));
});

test('the list is capped and can be folded away', () => {
  // Three cards at full height covered the conversation they were answers to — which is
  // the one thing you need on screen in order to choose.
  const tree = mount({ maxHeight: 220 });
  const scroller = tree.root.findAll((n) => {
    const st = Array.isArray(n.props?.style) ? Object.assign({}, ...n.props.style) : (n.props?.style ?? {});
    return String(n.type) === 'RCTScrollView' && st.maxHeight === 220;
  }, { deep: true });
  expect(scroller.length).toBe(1);

  act(() => { press(tree.root, '접기').props.onPress(); });
  expect(texts(tree.root)).not.toContain(CHOICES[0].text);
  expect(texts(tree.root)).toContain('펼치기');
});

test('there is always a way out of the scaffold', () => {
  // A learner who knows what to say must never have to pick from a list to say it.
  let out = 0;
  const tree = mount({ onWriteMyOwn: () => { out += 1; } });
  act(() => { press(tree.root, '직접 입력할래요').props.onPress(); });
  expect(out).toBe(1);
});

test('while they are being written, it says so', () => {
  const out = texts(mount({ loading: true, choices: [] }).root);
  expect(out.some((x) => x.includes('찾는 중'))).toBe(true);
  expect(out).not.toContain(CHOICES[0].text);
});

test('nothing to offer draws nothing at all', () => {
  // The text box comes back, which is the app working as it always did. A scaffold that
  // fails should leave the learner standing, not stop them mid-conversation.
  expect(mount({ choices: [], loading: false }).toJSON()).toBeNull();
});

// ── the wiring ────────────────────────────────────────────────────────────
const SRC = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');

test('the rung the learner TAPPED decides it, with the server as fallback', () => {
  // Both entries of a dialogue point at one scenario id, so the server can only infer a
  // rung from what has been cleared — and inference cannot know which of the two rows was
  // tapped. Tapping "1/2 보기 중에서" and getting the unguided run is the app ignoring a
  // decision it had just asked for.
  expect(SRC).toMatch(/const guided = \(guideParam \?\? scenario\?\.guide\) === 'choices';/);
  expect(SRC).toMatch(/guide: guideParam \} = useLocalSearchParams/);
  // And the box returns whenever there is nothing to pick: unguided run, they asked to
  // write their own, or the suggestions came back empty.
  expect(SRC).toMatch(/!guided \|\| wroteOwn \|\| \(!choicesBusy && choices\.length === 0\)/);
});

test('picking a reply goes to pronunciation practice, not straight into the thread', () => {
  // The point is to SAY it. Dropping the sentence into the box and sending it would be
  // practice at recognising English, which is not what the learner is short of.
  expect(SRC).toMatch(/setDraft\(c\.text\);/);
  expect(SRC).toMatch(/origin=dialogue/);
});

test('the suggestions are answers to the line that was just said', () => {
  // Refetched after each of the character's turns. Yesterday's answers to a different
  // line are worse than none.
  expect(SRC).toMatch(/void loadChoices\(\);/g);
  expect((SRC.match(/void loadChoices\(\)/g) ?? []).length).toBeGreaterThanOrEqual(2);
  // Including the very first turn, which is the one testers froze on.
  expect(SRC).toMatch(/sessionRef\.current = sid;[\s\S]{0,400}?void loadChoices\(\)/);
});

test('asking for the box is remembered', () => {
  // Being handed the list again after saying "I'll write my own" is the app not
  // listening.
  expect(SRC).toMatch(/if \(!guided \|\| wroteOwn \|\| !sid\) return;/);
});

// ── the hint, on the free pass ────────────────────────────────────────────
test('the hint says what the turn NEEDS, not what to say', () => {
  // It used to be the scenario's authored key phrases, shown as a permanent list of
  // ready-made sentences. It cost nothing and sat on screen, so there was no reason not
  // to read it — and a hint nobody has to reach for teaches nothing. Worse, it handed
  // over the answer, which on the free pass is the one thing that must stay theirs.
  expect(SRC).toMatch(/const askHint = async \(\) => \{/);
  // The `why` of the best reply, with the reply itself withheld.
  expect(SRC).toMatch(/setHintText\(cs\.find\(\(c\) => c\.tier === 'best'\)\?\.why/);
  expect(SRC).not.toMatch(/setHintText\([^)]*\.text/);
  // The authored list is gone, and so is the button being disabled without one.
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  expect(code).not.toMatch(/scenario\?\.keyPhrases\?\.length/);
  expect(code).not.toMatch(/keyPhrases\.map/);
});

test('the hint is asked for per turn, not left on screen', () => {
  // A hint from two exchanges ago is about a situation that has moved on. Pressing it
  // again closes it; pressing it fresh asks again.
  expect(SRC).toMatch(/if \(hintOn\) \{ setHintOn\(false\); return; \}/);
  expect(SRC).toMatch(/const \{ choices: cs \} = await api\.replyChoices\(sid\);/);
});

test('the chosen rung survives every screen between the list and the conversation', () => {
  // Three hops: the sheet hands it to the career tab, the tab to the briefing, the
  // briefing to the dialogue. It was dropped at the first one — onStart took only a
  // scenario id — so the two rows navigated identically.
  const sheet = readFileSync(join(__dirname, '..', 'components', 'campus', 'DeptSheet.tsx'), 'utf8');
  expect(sheet).toMatch(/onStart\(st\.scenarioId, st\.guide\)/);

  const career = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'campus.tsx'), 'utf8');
  expect(career).toMatch(/router\.push\(guide \? `\/scenario\/\$\{scn\}\?guide=\$\{guide\}`/);

  const briefing = readFileSync(join(__dirname, '..', 'app', 'scenario', '[id].tsx'), 'utf8');
  expect(briefing).toMatch(/guide \? `\/dialogue\/\$\{id\}\?guide=\$\{guide\}`/);
});
