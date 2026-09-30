// STEP 3 가이드 대화 — lesson-four-steps-v44 J. Harness mocks copied from dialogueResize.test.tsx.
// The dialogue screen's two dragged edges, driven for real.
//
// The complaint that produced them: the reply choices covered the exchange they were
// answers to. Every fixed fraction was wrong for somebody, so the divider between the
// character and the conversation, and the top of the choices band, are the reader's to
// place.
//
// These tests MOUNT the screen and drive the gestures through panDriver, because the
// failures that matter here are not "the constant is in the file" — they are "dragging
// moves nothing", "the portrait distorts", and "the band can be dragged over the
// conversation anyway". Only the rendered numbers show those.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
// The RoleFace the portrait draws comes through @engine, which pulls in reanimated. The
// sprite's motion is not what these tests are about; where the frame is, and how big, is.
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

const written: string[] = [];
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null,
  setItemAsync: async (_k: string, v: string) => { written.push(v); },
  deleteItemAsync: async () => {},
}));

jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
        useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: 'guided' }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

const mockCalls: string[] = [];
jest.mock('@/api/client', () => ({
  api: {
    lesson: async () => ({ sentences: [
      { en: 'Is it getting worse?', ko: '점점 심해지나요?', chunks: ['Is it', 'getting worse', '?'], words: [], goal: 2 },
      { en: 'Where does it hurt?', ko: '어디가 아프세요?', chunks: ['Where does', 'it hurt', '?'], words: [], goal: 1 },
    ] }),
    scenario: async () => ({
      id: 'SCN-ER-00002', title: '첫 인사', tagline: 'Good morning.', guide: 'guided',
      persona: { name: '김민준', role: 'patient', mood: 'worried', hair: 'short' },
      steps: [{ type: 'dialogue', payload: { lineEn: 'It hurts here.', lineKo: '여기가 아파요.' } }],
      missions: [],
    }),
    resumableConversation: async () => ({ sessionId: '', turns: [] }),
    startConversation: async () => 'sess-1',
    replyChoices: async () => { mockCalls.push('replyChoices'); return { choices: [], scripted: false, turn: 0, total: 0, done: false }; },
    sendMessageStream: async (_sid: string, text: string, _onChunk: unknown, _h: unknown, intent?: string) => {
      mockCalls.push(`send ${text} | ${intent ?? ''}`);
    },
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';
import DialogueRoute from '@/app/dialogue/[id]';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

async function mount() {
  mockCalls.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DialogueRoute />)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

// STEP 3 (v44 J): with STEP 2 sentences, the guided pass asks for ONE Korean target —
// the first in goal order — and never offers or fetches the three replies.
test('the guided pass shows the first STEP 2 sentence in goal order, not three replies', async () => {
  const tree = await mount();
  expect(tree.root.findAll((n) => n.props?.testID === 'guided-target' && typeof n.type !== 'string')).toHaveLength(1);
  expect(texts(tree.root)).toContain('어디가 아프세요?');
  expect(mockCalls).not.toContain('replyChoices');
});

test('what the learner says is sent with the target as its intent', async () => {
  const tree = await mount();
  const input = tree.root.findByType(TextInput);
  await act(async () => { input.props.onChangeText('Where does it hurt?'); });
  await act(async () => { await input.props.onSubmitEditing(); });
  expect(mockCalls.find((c) => c.startsWith('send'))).toBe('send Where does it hurt? | 어디가 아프세요?');
});
