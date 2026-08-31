// The authored guided pass, on screen.
//
// "옵션에서 선택해서 대화를 이어가는데, 굳이 직접 입력할 필요 없잖아. 어차피 다음
// 시나리오에서 할텐데 말이야. 직접 입력하기도 없애."
//
// So on an authored conversation there is no text box and no "직접 입력할래요" link, and
// picking a card IS the turn — no card-then-send. Each of those is a way for the screen
// to be wrong that only shows in the rendered output, so this file mounts the screen and
// drives it.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
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
jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {}, replace: () => {} }),
  useAudioRecorder: () => ({ record: () => {}, stop: async () => {}, uri: null, prepareToRecordAsync: async () => {} }),
  requestRecordingPermissionsAsync: async () => ({ granted: true }),
  setAudioModeAsync: async () => {},
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
  IOSOutputFormat: { LINEARPCM: 'lpcm' },
  AudioQuality: { HIGH: 96 },
}));
jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: async () => '', EncodingType: { Base64: 'base64' }, cacheDirectory: '/tmp/',
  downloadAsync: async () => ({ uri: '' }), deleteAsync: async () => {},
}));
jest.mock('expo-speech', () => ({ speak: () => {}, stop: () => {} }));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({ id: 'SCN-PHARMA-00900', guide: 'choices' }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

// What the server was sent, recorded. Every name here begins with `mock` because that is
// the only kind of out-of-scope variable a jest.mock factory is allowed to reach.
const mockSent: string[] = [];
const mockStarted: (string | undefined)[] = [];
let mockBeat = 0;
const mockBeats = [
  { npc: 'You must be the new nurse. Which ward are you picking up for?', choices: 3 },
  { npc: "Eight. Fine — I'm Daniel, I'm the pharmacist on days.", choices: 3 },
  { npc: 'Anything else before you go?', choices: 0 },
];

jest.mock('@/api/client', () => ({
  api: {
    scenario: async () => ({
      id: 'SCN-PHARMA-00900', title: '첫 인사 · 약제부', tagline: mockBeats[0].npc, guide: 'choices',
      persona: { name: 'Daniel Osei', role: 'pharmacist', mood: 'neutral', hair: '#1F2937' },
      steps: [{ type: 'dialogue', payload: { lineEn: mockBeats[0].npc, lineKo: '새로 온 간호사죠?' } }],
      missions: [],
    }),
    resumableConversation: async () => ({ sessionId: '', turns: [] }),
    startConversation: async (_id: string, _resume?: string, guide?: string) => {
      mockStarted.push(guide);
      return 'sess-1';
    },
    // An AUTHORED conversation: three cards while there is a beat to answer, none on the
    // closing line, and the turn reports itself as scripted.
    replyChoices: async () => {
      const b = mockBeats[Math.min(mockBeat, mockBeats.length - 1)];
      return {
        choices: b.choices === 0 ? [] : [
          { text: `best ${mockBeat}`, tier: 'best', why: `이유 ${mockBeat}` },
          { text: `strong ${mockBeat}`, tier: 'strong', why: '' },
          { text: `fair ${mockBeat}`, tier: 'fair', why: '' },
        ],
        scripted: true,
        turn: mockBeat,
        total: mockBeats.length,
        done: b.choices === 0,
      };
    },
    sendMessageStream: async (
      _sid: string,
      text: string,
      onChunk: (c: string) => void,
      opts?: { onResolved?: () => void },
    ) => {
      mockSent.push(text);
      mockBeat += 1;
      const b = mockBeats[Math.min(mockBeat, mockBeats.length - 1)];
      onChunk(b.npc);
      if (b.choices === 0) opts?.onResolved?.();
    },
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import DialogueRoute from '@/app/dialogue/[id]';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => { mockSent.length = 0; mockStarted.length = 0; mockBeat = 0; });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DialogueRoute />)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Every TextInput on screen. The claim is that there are none. */
function inputs(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => String(n.type) === 'TextInput', { deep: true });
}

/** The pressable that chooses a reply — the card body, not the mic beside it.
 *
 *  Matched on the COMPONENT, not the host node: RN's Pressable turns onPress into
 *  responder handlers, so no host View in the tree carries an onPress prop and a
 *  host-only search finds nothing. */
function cardFor(root: ReactTestInstance, label: string): ReactTestInstance {
  const hit = root.findAll((n) => {
    if (typeof n.props?.onPress !== 'function') return false;
    return texts(n).includes(label);
  }, { deep: true });
  expect(hit.length).toBeGreaterThan(0);
  // The innermost match: the outer wrappers contain the label too.
  return hit[hit.length - 1];
}

test('an authored conversation has no text box and no way to write your own', async () => {
  const tree = await mount();
  // The server was told which rung this is — without it the authored path never runs.
  expect(mockStarted).toEqual(['choices']);

  expect(inputs(tree.root)).toHaveLength(0);
  // "직접 입력할래요" was an escape hatch from a scaffold that ran out after one turn.
  // An authored conversation does not run out, and writing it yourself is the NEXT
  // curriculum step, not a link on this one.
  expect(texts(tree.root)).not.toContain('직접 입력할래요');
  // The cards are there, though — this is not an empty screen.
  expect(texts(tree.root)).toContain('best 0');
});

test('picking a card is the turn — no card-then-send', async () => {
  const tree = await mount();
  await act(async () => { cardFor(tree.root, 'best 0').props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  // Sent on the pick. With a text box this took two taps per beat; over eight beats
  // that is eight taps spent on confirming something already decided.
  expect(mockSent).toEqual(['best 0']);
  const out = texts(tree.root);
  expect(out).toContain('best 0');           // their own line, in the thread
  expect(out).toContain(mockBeats[1].npc);       // and the authored answer to it
});

test('the reason arrives with the line, after the choice', async () => {
  const tree = await mount();
  // Before picking, the reason is not on screen: printed on the cards it would be an
  // answer key, and the learner would read the badges instead of the sentences.
  expect(texts(tree.root)).not.toContain('이유 0');

  await act(async () => { cardFor(tree.root, 'best 0').props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  // After: it rides along with their own line. The card that carried it is gone —
  // picking mockSent it — so anywhere else it would simply never be read.
  expect(texts(tree.root)).toContain('이유 0');
});

test('the closing line says the conversation is over instead of going blank', async () => {
  const tree = await mount();
  for (const label of ['best 0', 'best 1']) {
    await act(async () => { cardFor(tree.root, label).props.onPress(); });
    await act(async () => { await Promise.resolve(); });
  }
  // Nothing left to pick and no text box on this pass, so without a word here the
  // bottom of the screen is empty — which reads as the app having lost the conversation.
  expect(texts(tree.root)).toContain('대화가 끝났어요. 상황 종료를 눌러 마무리하세요.');
  expect(inputs(tree.root)).toHaveLength(0);
});
