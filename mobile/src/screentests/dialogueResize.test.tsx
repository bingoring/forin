// The dialogue screen's stage and its dragged edges, driven for real.
//
// lesson-fidelity-v46 결정 5: the stage is the handoff's (dialogue.jsx Stage — 236 on the
// free run, 168 on the guided run, `#F6E3DC`, name and mood on the left, speaker on the
// right), and the learner can still drag its edge. The complaint that produced the drag:
// the reply choices covered the exchange they were answers to. Every fixed fraction was
// wrong for somebody, so the edges are the reader's to place.
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
const mockRun = { guide: 'free' as string };
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
    // Per test: the free run (E) or the guided run with reply choices (D, no sentences).
    useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: mockRun.guide }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

jest.mock('@/api/client', () => ({
  api: {
    // No STEP 2 sentences: the guided pass keeps its reply choices (v44 J), which is
    // the band these tests measure.
    lesson: async () => ({ sentences: [] }),
    scenario: async () => ({
      id: 'SCN-ER-00002', title: '첫 인사', tagline: 'Good morning.', guide: mockRun.guide,
      persona: { name: '김민준', role: 'patient', mood: 'worried', hair: 'short' },
      steps: [{ type: 'dialogue', payload: { lineEn: 'It hurts here.', lineKo: '여기가 아파요.' } }],
      missions: [],
    }),
    resumableConversation: async () => ({ sessionId: '', turns: [] }),
    scenarioNotes: async () => [{ said: 'Where pain?', model: 'Where does it hurt?', createdAt: '2026-10-01T00:00:00Z' }],
    startConversation: async () => 'sess-1',
    // The turn shape, not a bare array: an authored conversation reports where it
    // stands, and the screen decides whether to draw a text box from that.
    replyChoices: async () => ({
      choices: [
        { text: 'Can you tell me where it hurts?', tier: 'best', why: '열린 질문이에요.' },
        { text: 'Does it hurt here?', tier: 'strong', why: '' },
        { text: 'Where pain?', tier: 'fair', why: '' },
      ],
      scripted: false, turn: 0, total: 0, done: false,
    }),
  },
}));

import { Keyboard } from 'react-native';
import { readFileSync } from 'fs';
import { join } from 'path';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import DialogueRoute from '@/app/dialogue/[id]';
import { STAGE, STAGE_MIN, STAGE_TOP, clampChoices, clampStage } from '@/data/dialogueSplit';
import { NOT_SET, setDialogueLayout } from '@/lib/dialogueLayout';
import { trackMounts } from '../testing/mountRegistry';
import { panDriver } from '../testing/panDriver';

const track = trackMounts();

// The saved sizes are module state ON PURPOSE — they outlive the screen, which is the
// whole feature: a learner sets them once, not once per scenario. That also means one
// test's drag is the next test's starting point, so each case starts from "never
// dragged".
beforeEach(async () => { await setDialogueLayout(NOT_SET); written.length = 0; mockRun.guide = 'free'; });

// react-test-renderer's default window is 750×1334 (RN's Dimensions mock).
const WIN_H = 1334;

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DialogueRoute />)); });
  // The screen opens a session and loads choices in an effect chain.
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

const flat = (st: unknown) => (Array.isArray(st) ? Object.assign({}, ...st.flat(3).filter(Boolean)) : (st ?? {})) as Record<string, unknown>;
const num = (v: unknown): number => (typeof v === 'number' ? v : (v as { __getValue: () => number }).__getValue());
const host = (root: ReactTestInstance, id: string) => root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
function texts(root: ReactTestInstance): string[] {
  return root.findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** The pan-handler host for one handle. Found via the handle's testID, so the edges
 *  cannot be confused with each other. */
function handleOf(root: ReactTestInstance, testID: string) {
  const hits = root.findAll(
    (n) => typeof n.type === 'string' && n.props?.testID === testID && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  return panDriver(hits[0].props);
}

/** The conversation column's top edge, as a NUMBER. It is an interpolation, so this is
 *  the only way to see where it actually is. */
function threadTop(root: ReactTestInstance): number {
  return num(flat(host(root, 'thread-column')[0].props.style).top);
}
/** The stage band's height. */
function stageBand(root: ReactTestInstance): number {
  const st = flat(host(root, 'stage-band')[0].props.style);
  // A percentage string would sail through a loose read and report a passing test on a
  // band that does not move, so anything but a number is a failure here.
  expect(typeof st.height === 'number' || typeof (st.height as { __getValue?: unknown })?.__getValue === 'function').toBe(true);
  return num(st.height);
}

/** The QUICK INFO dock's label node. */
function dockNode(root: ReactTestInstance): ReactTestInstance | undefined {
  return root.findAll((n) => String(n.type) === 'Text' && n.children.includes('QUICK INFO'), { deep: true })[0];
}
/** True when the bedside tools live INSIDE the conversation column — they are the
 *  learner's instruments, used while talking, so they travel with the conversation's edge. */
function dockIsInThread(root: ReactTestInstance): boolean {
  let n = dockNode(root)?.parent ?? null;
  while (n) {
    if (n.props?.testID === 'thread-column') return true;
    n = n.parent;
  }
  return false;
}
/** The top of the absolutely-placed box that holds `testID`'s node. */
function placedTop(root: ReactTestInstance, testID: string): number {
  let n: ReactTestInstance | null = host(root, testID)[0];
  while (n && !(typeof n.type === 'string' && flat(n.props?.style).position === 'absolute' && flat(n.props?.style).top !== undefined)) n = n.parent;
  return num(flat(n!.props.style).top);
}

// ── the stage (lesson-fidelity-v46 결정 5) ─────────────────────────────────────

test('the free run opens on the handoff stage: #F6E3DC, 236 under the status bar (E)', async () => {
  const tree = await mount();
  expect(stageBand(tree.root)).toBe(STAGE.free);
  expect(flat(host(tree.root, 'stage-band')[0].props.style)).toMatchObject({ backgroundColor: '#F6E3DC', borderBottomWidth: 1.5, borderBottomColor: '#E0D6C0' });
  expect(threadTop(tree.root)).toBe(STAGE_TOP + STAGE.free);
});

test('on the stage: the print 118×120 at 54, the name and mood on the LEFT, the speaker on the RIGHT (L44–55)', async () => {
  const tree = await mount();
  expect(flat(host(tree.root, 'stage-print')[0].props.style)).toMatchObject({ width: 118, height: 120, overflow: 'hidden' });
  // Positions are screen coordinates: the stage starts at 44.
  const plate = flat(host(tree.root, 'stage-plate')[0].props.style);
  expect(plate).toMatchObject({ position: 'absolute', left: 22, top: STAGE_TOP + 88 });
  // The mood tag: red, white Pretendard 9.5 tracking 1, 2/7, -2° (L52).
  const mood = host(tree.root, 'stage-mood')[0];
  expect(flat(mood.props.style)).toMatchObject({ backgroundColor: '#C75146', paddingVertical: 2, paddingHorizontal: 7, marginTop: 6 });
  expect(flat(mood.findAll((n) => String(n.type) === 'Text')[0].props.style)).toMatchObject({ fontSize: 9.5, letterSpacing: 1, color: '#fff' });
  expect(texts(mood)).toEqual(['WORRIED']);
  // The speaker: right 26, top 96, a 32×32 paper with NbIcon speaker 17 — not the pixel
  // volume box with a hard shadow and a 2.5 ink border.
  let sp: ReactTestInstance | null = host(tree.root, 'stage-voice')[0];
  while (sp && flat(sp.props?.style).right === undefined) sp = sp.parent;
  expect(flat(sp!.props.style)).toMatchObject({ position: 'absolute', right: 26, top: STAGE_TOP + 96 });
  const face = host(tree.root, 'stage-voice')[0].findAll((n) => typeof n.type === 'string' && flat(n.props?.style).width === 32)[0];
  expect(flat(face.props.style)).toMatchObject({ width: 32, height: 32, borderWidth: 1, borderColor: '#E0D6C0' });
  // The polaroid sits 54 into the stage; its tape is the 58×16 strip at -9 (L46).
  expect(placedTop(tree.root, 'stage-print')).toBe(STAGE_TOP + 54);
  expect(flat(host(tree.root, 'stage-tape')[0].props.style)).toMatchObject({ top: -9, width: 58, height: 16 });
});

test('dragging the edge resizes the stage, and the bedside tools come with the conversation', async () => {
  const tree = await mount();
  const before = threadTop(tree.root);
  expect(dockIsInThread(tree.root)).toBe(true);

  const pan = handleOf(tree.root, 'split-handle');
  await act(async () => {
    expect(pan.claim(-10)).toBe(true);
    pan.move(-90);
    pan.up();
  });

  // 90, not 100: PanResponder resets dy at the moment it grants, so the few pixels that
  // won the claim are not part of the drag. Every gesture in the app behaves this way.
  expect(threadTop(tree.root)).toBe(before - 90);
  expect(stageBand(tree.root)).toBe(STAGE.free - 90);
  expect(dockIsInThread(tree.root)).toBe(true);
});

test('dragged small, the print shrinks in place with its ratio, to a floor', async () => {
  const tree = await mount();
  await act(async () => {
    const pan = handleOf(tree.root, 'split-handle');
    expect(pan.claim(-10)).toBe(true);
    pan.move(-2_000);
    pan.up();
  });
  expect(stageBand(tree.root)).toBe(STAGE_MIN);
  const print = flat(host(tree.root, 'stage-print')[0].props.style);
  expect(print.height as number).toBeLessThan(92);
  expect((print.width as number) / (print.height as number)).toBeCloseTo(118 / 92, 1);
  // Still on the left / right — the plate and the speaker do not move into the print.
  expect(flat(host(tree.root, 'stage-plate')[0].props.style).left).toBe(22);
});

test('the stage size is remembered per run, written on release', async () => {
  const tree = await mount();
  await act(async () => {
    const pan = handleOf(tree.root, 'split-handle');
    expect(pan.claim(-10)).toBe(true);
    pan.move(-90);
    pan.up();
  });
  await act(async () => { await Promise.resolve(); });
  // Written on RELEASE, not per frame: a keychain write in the gesture's path would
  // show up as a stutter under the finger.
  expect(written.length).toBe(1);
  expect(JSON.parse(written[0]).stageFree).toBe(STAGE.free - 90);
  expect(JSON.parse(written[0]).stageGuided).toBe(0);
});

test('the guided run opens on the short stage (D 168)', async () => {
  mockRun.guide = 'choices';
  const tree = await mount();
  expect(stageBand(tree.root)).toBe(STAGE.guided);
  expect(stageBand(tree.root)).toBe(clampStage(STAGE.guided, WIN_H, 'guided'));
  expect(flat(host(tree.root, 'stage-plate')[0].props.style).top).toBe(STAGE_TOP + 60);
});

test('the choices band is the reader\'s, and it cannot be dragged over the conversation', async () => {
  mockRun.guide = 'choices';
  const tree = await mount();
  const band = () => {
    const hits = tree.root.findAll((n) => typeof flat(n.props?.style).maxHeight === 'number' && (flat(n.props?.style).maxHeight as number) > 50, { deep: true });
    expect(hits.length).toBeGreaterThan(0);
    return flat(hits[0].props.style).maxHeight as number;
  };
  const start = band();
  expect(start).toBe(clampChoices(WIN_H * 0.34, WIN_H));
  await act(async () => {
    const pan = handleOf(tree.root, 'choices-handle');
    expect(pan.claim(10)).toBe(true);
    pan.move(60);
    pan.up();
  });
  expect(band()).toBe(start - 60);
  await act(async () => {
    const pan = handleOf(tree.root, 'choices-handle');
    expect(pan.claim(10)).toBe(true);
    pan.move(2_000);
    pan.up();
  });
  expect(band()).toBe(96);
});

// ── the free run's thread and rail (E) ──────────────────────────────────────

test('bubbles are blocks: mine 40 in from the left, theirs 40 in from the right, flat (L72–73)', async () => {
  const tree = await mount();
  const npc = tree.root.findAll((n) => typeof n.type === 'string' && flat(n.props?.style).backgroundColor === '#FCEEDC')[0];
  let row: ReactTestInstance | null = npc.parent;
  while (row && flat(row.props?.style).marginRight === undefined) row = row.parent;
  expect(flat(row!.props.style).marginRight).toBe(40);
  // rot 0 → no rotation, and the neutral edge is the handoff's #E8D2B0.
  expect(JSON.stringify(flat(npc.props.style).transform)).toMatch(/"0deg"/);
  // The exchange: padding 10/16/4, gap 10 (L85).
  const log = tree.root.findAll((n) => n.props?.testID === 'thread-log' && n.props?.contentContainerStyle)[0];
  expect(flat(log.props.contentContainerStyle)).toMatchObject({ paddingTop: 10, paddingBottom: 4, paddingHorizontal: 16, gap: 10 });
});

test('E’s rail is paper: ▷ 보내기 · 힌트 · 노트 n (L99–103)', async () => {
  const tree = await mount();
  const face = (id: string) => flat(host(tree.root, id)[0].findAll((n) => typeof n.type === 'string' && flat(n.props?.style).paddingVertical === 9)[0].props.style);
  expect(face('rail-send')).toMatchObject({ backgroundColor: '#FFFdf4', borderWidth: 1, paddingHorizontal: 0, opacity: 0.6 });
  expect(face('rail-hint')).toMatchObject({ paddingHorizontal: 16 });
  expect(face('rail-notes')).toMatchObject({ paddingHorizontal: 13 });
  expect(texts(host(tree.root, 'rail-hint')[0])).toEqual(['힌트']);
  // The count is this situation's notes.
  expect(texts(host(tree.root, 'rail-notes')[0])).toEqual(['1']);
});

test('the keyboard borrows the edge, and the tools hand their row back', async () => {
  // Driven through real Keyboard events. Keyboard has no emit(), so the subscription is
  // intercepted and the screen's own handler is called. A LIST per event: more than one
  // component on this screen listens.
  const fired: Record<string, ((e: unknown) => void)[]> = {};
  const spy = jest.spyOn(Keyboard, 'addListener').mockImplementation(((evt: string, cb: (e: unknown) => void) => {
    (fired[evt] ??= []).push(cb);
    return { remove: () => { fired[evt] = (fired[evt] ?? []).filter((f) => f !== cb); } };
  }) as never);
  const emit = (evt: string, e: unknown) => { for (const cb of fired[evt] ?? []) cb(e); };
  const tree = await mount();
  const resting = threadTop(tree.root);
  expect(dockNode(tree.root)).toBeTruthy();
  expect(Object.keys(fired)).toEqual(expect.arrayContaining(['keyboardWillShow', 'keyboardWillHide']));

  await act(async () => {
    // duration 1, not 0: the screen reads `e.duration || 220`.
    emit('keyboardWillShow', { duration: 1, endCoordinates: { height: 300 } });
    await Promise.resolve();
  });
  expect(dockNode(tree.root)).toBeUndefined();

  await act(async () => {
    emit('keyboardWillHide', { duration: 1 });
    await new Promise((r) => setTimeout(r, 60));
  });
  expect(dockNode(tree.root)).toBeTruthy();
  expect(threadTop(tree.root)).toBe(resting);
  spy.mockRestore();
});

test('the conversation happens on a ruled page', async () => {
  const tree = await mount();
  const rules = tree.root.findAll((n) => {
    if (typeof n.type !== 'string') return false;
    const st = flat(n.props?.style);
    return st.height === 1 && st.backgroundColor === 'rgba(62,54,43,.06)';
  }, { deep: true });
  expect(rules.length).toBeGreaterThan(10);
});

test('no pixel-line residue: no navy page, no pixel or flat icon sets, no hard Korean', () => {
  // lesson-fidelity-v46 T7: the loading page was #1F2937 (the pixel line's navy), the
  // voice toggle a PixelIcon with a hard shadow, the sheets FIcon with 2.5 borders and
  // Korean typed into the JSX.
  const src = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');
  expect(src).not.toMatch(/#1F2937/);
  expect(src).not.toMatch(/PixelIcon|FIcon|deptWash|borderWidth: 2\.5/);
  expect(src).not.toMatch(/이어서 대화할까요|번 주고받은 기록/);
});
