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
      <ReplyChoices choices={CHOICES} loading={false} onPick={() => {}} onWriteMyOwn={() => {}} {...over} />,
    ));
  });
  return tree;
}

beforeEach(() => { mockSounds.length = 0; });

test('all three are shown, with the reason each one exists', () => {
  const out = texts(mount().root);
  for (const c of CHOICES) {
    expect(out).toContain(c.text);
    // The `why` is the lesson. Three sentences without it is a menu; with it, the
    // learner can see what separates a good answer from a merely correct one.
    expect(out).toContain(c.why);
  }
});

test('none of them is labelled wrong', () => {
  // A wrong option would make this a quiz, and nobody picks the wrong one anyway — the
  // choice would be theatre. What is being chosen between is three ways of being
  // competent.
  const out = texts(mount().root).join(' ');
  expect(out).toContain('가장 좋은 답');
  expect(out).toContain('꽤 괜찮은 답');
  expect(out).toContain('괜찮은 답');
  for (const bad of ['틀린', '나쁜', '하지 마', '오답']) {
    expect(out).not.toContain(bad);
  }
});

test('picking one hands back the whole choice, and blips', () => {
  const picked: ReplyChoice[] = [];
  const tree = mount({ onPick: (c) => picked.push(c) });
  act(() => { press(tree.root, CHOICES[0].text).props.onPress(); });
  expect(picked).toEqual([CHOICES[0]]);
  expect(mockSounds).toEqual(['tap']);
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

test('choices replace the text box only on a guided run', () => {
  // `guide` arrives WITH the scenario, so the screen knows what to draw before the
  // conversation starts — asking afterwards would show a box for a moment and then
  // replace it, which reads as the app changing its mind.
  expect(SRC).toMatch(/const guided = scenario\?\.guide === 'choices';/);
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
  expect(SRC).toMatch(/const cs = await api\.replyChoices\(sid\);/);
});
