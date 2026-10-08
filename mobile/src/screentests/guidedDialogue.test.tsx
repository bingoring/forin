// STEP 3 가이드 대화 — lesson-four-steps-v44 J, matched 1:1 to handoff v46 in
// lesson-fidelity-v46 T7 (dialogue.jsx DialogueOptions L112–186). Mounts the real screen:
// the 말하기 / 타이핑 switch, the HOLD mic, the typing card, the `▷ 보내기 · 듣기 · 노트`
// rail and the 노트 sheet are behaviour, so they are driven rather than grepped.
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
// The recorder, scripted: `prepareGate` lets a test hold `prepareToRecordAsync` open to
// release the finger before the mic is live.
const mockRec = { log: [] as string[], prepareGate: null as null | Promise<void> };
jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {}, replace: () => {} }),
  useAudioRecorder: () => ({
    record: () => { mockRec.log.push('record'); },
    stop: async () => { mockRec.log.push('stop'); },
    uri: 'file:///tmp/a.wav',
    prepareToRecordAsync: async () => { mockRec.log.push('prepare'); if (mockRec.prepareGate) await mockRec.prepareGate; },
  }),
  requestRecordingPermissionsAsync: async () => ({ granted: true }),
  setAudioModeAsync: async () => {},
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
  IOSOutputFormat: { LINEARPCM: 'lpcm' },
  AudioQuality: { HIGH: 96 },
}));
jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: async () => 'AAAA', EncodingType: { Base64: 'base64' }, cacheDirectory: '/tmp/',
  downloadAsync: async () => ({ uri: '' }), deleteAsync: async () => {},
}));
const mockSpoken: string[] = [];
jest.mock('expo-speech', () => ({ speak: (s: string) => { mockSpoken.push(s); }, stop: () => {} }));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
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
    transcribe: async () => { mockCalls.push('transcribe'); return 'Where does it hurt'; },
    scenarioNotes: async (sid: string) => {
      mockCalls.push(`notes ${sid}`);
      return [{ said: 'Where pain?', model: 'Where does it hurt?', note: '완전한 문장', createdAt: '2026-10-01T00:00:00Z' }];
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
/** The host node carrying a testID (one per id). */
const host = (root: ReactTestInstance, id: string) => root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
/** The pressable (composite) for a testID. */
const press = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.props?.onPress === 'function')[0];
const flat = (st: unknown) => (Array.isArray(st) ? Object.assign({}, ...st.flat(3).filter(Boolean)) : (st ?? {})) as Record<string, unknown>;
const flush = async () => { for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); }); };

async function mount() {
  mockCalls.length = 0;
  mockRec.log.length = 0;
  mockRec.prepareGate = null;
  mockSpoken.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DialogueRoute />)); });
  await flush();
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

test('it opens on 말하기: the pill switch, the 84pt red mic and its line — no text box (L151–163)', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toEqual(expect.arrayContaining(['말하기', '타이핑', '꾹 누르고 영어로 말하기']));
  const pill = flat(host(tree.root, 'guided-mode-speak')[0].props.style);
  expect(pill).toMatchObject({ borderRadius: 99, borderWidth: 1.6, borderColor: '#3E362B', backgroundColor: '#3E362B', paddingVertical: 6, paddingHorizontal: 14 });
  expect(flat(host(tree.root, 'guided-mode-type')[0].props.style)).toMatchObject({ borderColor: 'rgba(62,54,43,.3)', backgroundColor: 'transparent' });
  const mic = flat(host(tree.root, 'guided-mic')[0].props.style);
  expect(mic).toMatchObject({ width: 84, height: 84, borderRadius: 42, borderWidth: 2.5, borderColor: '#C75146', backgroundColor: 'rgba(199,81,70,.12)' });
  expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
});

test('the mic is HELD: recording while down, transcribed into a pending line on release', async () => {
  const tree = await mount();
  const mic = () => tree.root.findAll((n) => n.props?.testID === 'guided-mic' && typeof n.props?.onPressIn === 'function')[0];
  await act(async () => { mic().props.onPressIn(); });
  await flush();
  expect(mockRec.log).toEqual(['prepare', 'record']);
  expect(texts(tree.root)).toContain('듣는 중… 손을 떼면 끝나요');
  // The release reaches the mic WHILE it records — the mic is the one control that must
  // stay live then.
  await act(async () => { mic().props.onPressOut(); });
  await flush();
  expect(mockRec.log).toEqual(['prepare', 'record', 'stop']);
  expect(mockCalls).toContain('transcribe');
  // The line waits in the thread at .6 (L90 "작성 중") and 보내기 comes alive.
  const composing = host(tree.root, 'composing-bubble')[0];
  expect(flat(composing.props.style).opacity).toBe(0.6);
  expect(texts(composing)).toContain('Where does it hurt');
  await act(async () => { press(tree.root, 'rail-send').props.onPress(); });
  await flush();
  expect(mockCalls.find((c) => c.startsWith('send'))).toBe('send Where does it hurt | 어디가 아프세요?');
});

test('a release before the mic is live still closes it', async () => {
  // Opening the recorder is async. A quick tap lifts before it records — the release is
  // remembered, and the mic is closed the moment it opens rather than left running.
  const tree = await mount();
  const mic = tree.root.findAll((n) => n.props?.testID === 'guided-mic' && typeof n.props?.onPressIn === 'function')[0];
  let open!: () => void;
  mockRec.prepareGate = new Promise<void>((r) => { open = r; });
  await act(async () => { mic.props.onPressIn(); });
  await act(async () => { mic.props.onPressOut(); });
  expect(mockRec.log).toEqual(['prepare']);
  await act(async () => { open(); });
  await flush();
  expect(mockRec.log).toEqual(['prepare', 'record', 'stop']);
});

test('타이핑 opens the writing card; word chips insert; 보내기 sends with the target as intent (L165–179)', async () => {
  const tree = await mount();
  await act(async () => { press(tree.root, 'guided-mode-type').props.onPress(); });
  const card = host(tree.root, 'guided-typing-card')[0];
  expect(texts(card)).toEqual(expect.arrayContaining(['영어로 적어보세요', '단어 칩 탭 → 삽입', 'Where', 'it hurt']));
  const input = tree.root.findByType(TextInput);
  expect(flat(input.props.style)).toMatchObject({ borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.45)', fontFamily: 'Pretendard', fontSize: 15, minHeight: 30 });
  // 보내기 is soft and faded until there is a line (L179).
  const sendFace = () => flat(host(tree.root, 'rail-send')[0].findAll((n) => typeof n.type === 'string' && flat(n.props?.style).paddingVertical === 9)[0].props.style);
  expect(sendFace()).toMatchObject({ opacity: 0.6 });
  const chips = tree.root.findAll((n) => n.props?.testID === 'guided-word-chip' && typeof n.props?.onPress === 'function');
  await act(async () => { chips[0].props.onPress(); });
  await act(async () => { chips[1].props.onPress(); });
  expect(tree.root.findByType(TextInput).props.value).toBe('Where it hurt');
  await act(async () => { tree.root.findByType(TextInput).props.onChangeText('Where does it hurt'); });
  expect(sendFace()).toMatchObject({ opacity: 1, backgroundColor: 'rgba(249,227,123,.5)' });
  // No composing bubble while the card itself shows the line.
  expect(host(tree.root, 'composing-bubble')).toHaveLength(0);
  await act(async () => { await tree.root.findByType(TextInput).props.onSubmitEditing(); });
  expect(mockCalls.find((c) => c.startsWith('send'))).toBe('send Where does it hurt | 어디가 아프세요?');
});

test('the rail is ▷ 보내기 · 듣기 · 노트 — no 힌트 (L178–182)', async () => {
  const tree = await mount();
  expect(host(tree.root, 'rail-send')).toHaveLength(1);
  expect(host(tree.root, 'rail-listen')).toHaveLength(1);
  expect(host(tree.root, 'rail-notes')).toHaveLength(1);
  expect(host(tree.root, 'rail-hint')).toHaveLength(0);
  // The ▷ is drawn, not typed (결정 4): the play icon, in the label's colour.
  const play = host(tree.root, 'rail-send')[0].findAll((n) => String(n.type) === 'RNSVGPath', { deep: true });
  expect(play.length).toBeGreaterThan(0);
  // 듣기 plays the model sentence — from the rail now, not the card.
  await act(async () => { press(tree.root, 'rail-listen').props.onPress(); });
  expect(mockSpoken).toEqual(['Where does it hurt?']);
});

test('노트 opens this situation’s correction notes in a sheet, without leaving (결정 6)', async () => {
  const tree = await mount();
  expect(mockCalls).toContain('notes SCN-ER-00002');
  await act(async () => { press(tree.root, 'rail-notes').props.onPress(); });
  await flush();
  const sheet = tree.root.findAll((n) => n.props?.testID === 'notes-sheet' && typeof n.type === 'string')[0];
  expect(texts(sheet)).toEqual(expect.arrayContaining(['교정노트', 'Where pain?', 'Where does it hurt?', '완전한 문장']));
  // Still on the conversation.
  expect(texts(tree.root)).toContain('어디가 아프세요?');
});

test('the Korean target never leaves the screen', async () => {
  // It used to vanish behind the hint paper when 힌트 was on. The guided pass has no
  // 힌트 now; whatever the learner does — switch modes, open hints — the target stays.
  const tree = await mount();
  await act(async () => { press(tree.root, 'guided-mode-type').props.onPress(); });
  await act(async () => { press(tree.root, 'guided-hint-more').props.onPress(); });
  expect(texts(tree.root)).toContain('어디가 아프세요?');
});

test('the guided stage is the handoff’s short one: 168 under the status bar, the print 92 (L43–47)', async () => {
  const tree = await mount();
  const band = host(tree.root, 'stage-band')[0];
  const h = band.props.style.height;
  expect(typeof h === 'number' ? h : h.__getValue()).toBe(168);
  expect(flat(host(tree.root, 'stage-print')[0].props.style)).toMatchObject({ width: 118, height: 92 });
  // D's message band is the handoff's fixed 128 (L122).
  expect(flat(host(tree.root, 'thread-log')[0].props.style).height).toBe(128);
});

test('no StepTrack on the conversation screen (결정 1)', async () => {
  const tree = await mount();
  expect(tree.root.findAll((n) => (n.type as { name?: string })?.name === 'StepTrack')).toHaveLength(0);
});
