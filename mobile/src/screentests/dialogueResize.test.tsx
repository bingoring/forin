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
    // guide=choices, because the choices band only exists on the guided pass — which is
    // the pass the complaint came from.
    useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: 'choices' }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

jest.mock('@/api/client', () => ({
  api: {
    scenario: async () => ({
      id: 'SCN-ER-00002', title: '첫 인사', tagline: 'Good morning.', guide: 'choices',
      persona: { name: '김민준', role: 'patient', mood: 'worried', hair: 'short' },
      steps: [{ type: 'dialogue', payload: { lineEn: 'It hurts here.', lineKo: '여기가 아파요.' } }],
      missions: [],
    }),
    resumableConversation: async () => ({ sessionId: '', turns: [] }),
    startConversation: async () => 'sess-1',
    replyChoices: async () => ([
      { text: 'Can you tell me where it hurts?', tier: 'best', why: '열린 질문이에요.' },
      { text: 'Does it hurt here?', tier: 'strong', why: '' },
      { text: 'Where pain?', tier: 'fair', why: '' },
    ]),
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import DialogueRoute from '@/app/dialogue/[id]';
import { clampChoices, clampSplit, DOCK_H, PORTRAIT_MAX } from '@/data/dialogueSplit';
import { NOT_SET, setDialogueLayout } from '@/lib/dialogueLayout';
import { trackMounts } from '../testing/mountRegistry';
import { panDriver } from '../testing/panDriver';

const track = trackMounts();

// The saved sizes are module state ON PURPOSE — they outlive the screen, which is the
// whole feature: a learner sets them once, not once per scenario. That also means one
// test's drag is the next test's starting point, so each case starts from "never
// dragged". Without this the second case began from the first one's number and read as a
// portrait that shrank when it should have rearranged.
beforeEach(async () => { await setDialogueLayout(NOT_SET); written.length = 0; });

// react-test-renderer's default window is 750×1334 (RN's Dimensions mock).
const WIN_H = 1334;

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DialogueRoute />)); });
  // The screen opens a session and loads choices in an effect chain.
  await act(async () => { await Promise.resolve(); });
  return tree;
}

/** The pan-handler host for one handle. Found via the handle's testID, so the two
 *  edges cannot be confused with each other. */
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
  const hits = root.findAll((n) => {
    const st = n.props?.style;
    return !!st && !Array.isArray(st) && st.zIndex === 6 && st.left === 14 && st.top !== undefined;
  }, { deep: true });
  expect(hits.length).toBeGreaterThan(0);
  const v = hits[0].props.style.top;
  return typeof v === 'number' ? v : v.__getValue();
}

/** The QUICK INFO dock's top edge. */
function dockTop(root: ReactTestInstance): number {
  const hits = root.findAll((n) => {
    const st = n.props?.style;
    return !!st && !Array.isArray(st) && st.zIndex === 4 && st.left === 14;
  }, { deep: true });
  expect(hits.length).toBeGreaterThan(0);
  return hits[0].props.style.top;
}

/** The portrait frame's drawn box. */
function frameBox(root: ReactTestInstance): { w: number; h: number } {
  const hits = root.findAll((n) => {
    const st = n.props?.style;
    return !!st && !Array.isArray(st) && st.borderWidth === 3 && st.overflow === 'hidden' && typeof st.width === 'number';
  }, { deep: true });
  expect(hits.length).toBeGreaterThan(0);
  return { w: hits[0].props.style.width, h: hits[0].props.style.height };
}

/** True when the name plate sits to the RIGHT of the portrait rather than under it. */
function nameIsBeside(root: ReactTestInstance): boolean {
  return root.findAll((n) => {
    const st = n.props?.style;
    return !!st && !Array.isArray(st) && st.flexDirection === 'row' && st.gap === 10 && st.alignItems === 'center';
  }, { deep: true }).length > 0;
}

/** The ceiling the reply cards actually scroll inside. */
function choicesBand(root: ReactTestInstance): number {
  const hits = root.findAll((n) => {
    const st = n.props?.style;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st;
    return !!flat && typeof flat.maxHeight === 'number' && flat.maxHeight > 50;
  }, { deep: true });
  expect(hits.length).toBeGreaterThan(0);
  return hits[0].props.style.maxHeight ?? 0;
}

test('dragging the divider moves the conversation, and the bedside tools come with it', async () => {
  const tree = await mount();
  const before = threadTop(tree.root);
  // The default is the position that shipped — someone who never touches the handle
  // must get the screen they already had.
  expect(before).toBe(clampSplit(WIN_H * 0.41 + 34, WIN_H));
  // The dock lives immediately above the edge. At a percentage of the window it stayed
  // put while the edge moved through it.
  expect(dockTop(tree.root)).toBe(before - DOCK_H);

  const pan = handleOf(tree.root, 'split-handle');
  await act(async () => {
    expect(pan.claim(-10)).toBe(true);
    pan.move(-90);
    pan.up();
  });

  const after = threadTop(tree.root);
  // 90, not 100: PanResponder resets dy at the moment it grants, so the few pixels that
  // won the claim are not part of the drag. Every gesture in the app behaves this way.
  expect(after).toBe(before - 90);
  expect(dockTop(tree.root)).toBe(after - DOCK_H);
});

test('the portrait rearranges before it shrinks, and keeps its ratio when it does', async () => {
  const tree = await mount();
  const drawn = frameBox(tree.root);
  expect(drawn.h).toBe(PORTRAIT_MAX);
  expect(nameIsBeside(tree.root)).toBe(false);

  // Up past the point where the stacked plate fits, but not past the portrait's floor.
  // A fresh driver per gesture: one PanResponder carries its state between gestures, so
  // a reused driver's bank computes the next dy from the wrong origin.
  await act(async () => {
    const pan = handleOf(tree.root, 'split-handle');
    expect(pan.claim(-10)).toBe(true);
    pan.move(-260);
    pan.up();
  });
  // The plate moved; the drawing did not have to.
  expect(nameIsBeside(tree.root)).toBe(true);
  expect(frameBox(tree.root).h).toBe(PORTRAIT_MAX);

  // All the way up: now it scales, and the ratio survives.
  await act(async () => {
    const pan = handleOf(tree.root, 'split-handle');
    expect(pan.claim(-10)).toBe(true);
    pan.move(-400);
    pan.up();
  });
  const small = frameBox(tree.root);
  expect(small.h).toBeLessThan(drawn.h);
  expect(small.w / small.h).toBeCloseTo(drawn.w / drawn.h, 1);
});

test('the choices band is the reader\'s, and it cannot be dragged over the conversation', async () => {
  const tree = await mount();
  const start = choicesBand(tree.root);
  expect(start).toBe(clampChoices(WIN_H * 0.34, WIN_H));

  // Down on the band's TOP edge gives the conversation more room.
  await act(async () => {
    const pan = handleOf(tree.root, 'choices-handle');
    expect(pan.claim(10)).toBe(true);
    pan.move(60);
    pan.up();
  });
  expect(choicesBand(tree.root)).toBe(start - 60);

  // And it stops: one card stays readable however far down it is pushed.
  await act(async () => {
    const pan = handleOf(tree.root, 'choices-handle');
    expect(pan.claim(10)).toBe(true);
    pan.move(2_000);
    pan.up();
  });
  expect(choicesBand(tree.root)).toBe(96);
});

test('the sizes are remembered, so nobody sets them again next scenario', async () => {
  written.length = 0;
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
  expect(JSON.parse(written[0]).splitTop).toBe(threadTop(tree.root));
});

test('the voice toggle sits beside the portrait, not off the edge of the screen', async () => {
  // It was `position: absolute; right: -38` inside the full-width portrait STRIP, so
  // "38pt past the frame's right edge" was really 38pt past the right edge of the phone.
  // The toggle was off-screen — which is why the whole feature reads as missing rather
  // than misplaced. It now hangs off a wrapper that shrinks to the frame.
  const tree = await mount();
  const hits = tree.root.findAll(
    (n) => typeof n.type === 'string' && n.props?.accessibilityRole === 'switch',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  const box = hits[0].props.style;
  expect(box.right).toBeLessThan(0);
  // Its offset is measured from whatever View contains it, so that View must not be the
  // one stretched across the window. Walked up to the nearest HOST node: the immediate
  // parent is the Pressable itself, which carries the very style being checked.
  let up = hits[0].parent;
  while (up && typeof up.type !== 'string') up = up.parent;
  const parent = up?.props?.style;
  const flat = Array.isArray(parent) ? Object.assign({}, ...parent.filter(Boolean)) : parent;
  expect(flat?.left).toBeUndefined();
  expect(flat?.right).toBeUndefined();
});
