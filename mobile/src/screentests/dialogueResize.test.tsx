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

/** The QUICK INFO dock's label node. */
function dockNode(root: ReactTestInstance): ReactTestInstance | undefined {
  return root.findAll(
    (n) => String(n.type) === 'Text' && n.children.includes('QUICK INFO'),
    { deep: true },
  )[0];
}

/** True when the bedside tools live INSIDE the conversation column — which is the whole
 *  claim: they are the learner's instruments, used while talking, so they travel with the
 *  conversation's edge rather than sitting above it as something the patient presents. */
function dockIsInThread(root: ReactTestInstance): boolean {
  let n = dockNode(root)?.parent ?? null;
  while (n) {
    const st = n.props?.style;
    if (!!st && !Array.isArray(st) && st.zIndex === 6 && st.left === 14) return true;
    n = n.parent;
  }
  return false;
}

/** The portrait frame's drawn box. */
function frameBox(root: ReactTestInstance): { w: number; h: number } {
  const hits = root.findAll((n) => {
    const st = n.props?.style;
    // v29 draws the portrait as a polaroid: the PAPER carries the border, and the print
    // itself is a clipped box with a size. So the box is found by its size and clip, not
    // by a border it no longer has.
    return !!st && !Array.isArray(st) && st.overflow === 'hidden' && typeof st.width === 'number' && typeof st.height === 'number';
  }, { deep: true });
  expect(hits.length).toBeGreaterThan(0);
  return { w: hits[0].props.style.width, h: hits[0].props.style.height };
}

/** The name/mood plate's own box. */
function plate(root: ReactTestInstance): Record<string, unknown> {
  const hits = root.findAll(
    (n) => typeof n.type === 'string' && n.props?.testID === 'portrait-plate',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  return hits[0].props.style as Record<string, unknown>;
}

/** True when the plate hangs off the frame's LEFT edge instead of sitting under it.
 *
 *  Positioned OUT of the layout is the whole point: as a row it took width, and the strip
 *  centres the container, so the plate's width pushed the frame to the right — the
 *  character slid sideways as the divider came up. */
function nameIsBeside(root: ReactTestInstance): boolean {
  const st = plate(root);
  return st.position === 'absolute' && typeof st.right === 'number';
}

/** The department wash band's height — the coloured ground the portrait stands on. */
function washHeight(root: ReactTestInstance): number {
  const hits = root.findAll(
    (n) => typeof n.type === 'string' && n.props?.testID === 'wash-band',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  const v = hits[0].props.style.height;
  // A percentage string would sail through a loose read and report a passing test on a
  // band that does not move, so anything but a number is a failure here.
  expect(typeof v === 'number' || typeof v?.__getValue === 'function').toBe(true);
  return typeof v === 'number' ? v : v.__getValue();
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
  // The tools are in the conversation, so they need no position of their own — they move
  // because the column moves.
  expect(dockIsInThread(tree.root)).toBe(true);
  // And the coloured ground ends exactly at the edge. At a fixed 40% the wash stayed put
  // while the divider moved, so dragging cut the colour across the conversation.
  expect(washHeight(tree.root)).toBe(before);

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
  expect(dockIsInThread(tree.root)).toBe(true);
  expect(washHeight(tree.root)).toBe(after);
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

  // …and it shrinks IN PLACE. The plate is out of the layout, so the container is the
  // frame's width and the strip's centring still lands on the drawing. As a row the
  // plate's width pushed the frame right, and dragging read as the character sliding
  // sideways rather than getting smaller.
  const st = plate(tree.root);
  expect(st.position).toBe('absolute');
  // Clear of the frame's left edge, not overlapping it.
  expect(st.right).toBeGreaterThanOrEqual(small.w);
  expect(holdingBox(tree.root).flexDirection).toBeUndefined();
});

/** The style of the box that holds the frame and the plate. */
function holdingBox(root: ReactTestInstance): Record<string, unknown> {
  let n: ReactTestInstance | null = root.findAll(
    (x) => typeof x.type === 'string' && x.props?.testID === 'portrait-plate',
    { deep: true },
  )[0]?.parent ?? null;
  while (n && typeof n.type !== 'string') n = n.parent;
  return (n?.props?.style ?? {}) as Record<string, unknown>;
}

test('the voice toggle is centred on the portrait, at its right edge', async () => {
  // Vertically centred against the FRAME, not against the frame plus the stacked plate:
  // a fixed offset put it three quarters of the way down, and it moved as the portrait
  // scaled. `top: 0, bottom: 0` centres it without this file knowing the button's height.
  const tree = await mount();
  const hits = tree.root.findAll(
    (n) => typeof n.type === 'string' && n.props?.testID === 'portrait-aside',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  const st = hits[0].props.style;
  expect(st.position).toBe('absolute');
  expect(st.right).toBeLessThan(0);
  expect(st.top).toBe(0);
  expect(st.bottom).toBe(0);
  expect(st.justifyContent).toBe('center');

  // The box it is centred against draws the frame, and nothing else — otherwise
  // "centred" would mean centred on the plate as well.
  let holder = hits[0].parent;
  while (holder && typeof holder.type !== 'string') holder = holder.parent;
  const drawsFrame = holder?.findAll((n) => {
    const s2 = n.props?.style;
    return !!s2 && !Array.isArray(s2) && s2.overflow === 'hidden' && typeof s2.width === 'number' && typeof s2.height === 'number';
  }, { deep: true }) ?? [];
  expect(drawsFrame.length).toBeGreaterThan(0);
  expect(holder?.findAll(
    (n) => typeof n.type === 'string' && n.props?.testID === 'portrait-plate', { deep: true },
  ) ?? []).toHaveLength(0);
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
  // Walk out to the View that actually positions it.
  let box = hits[0].parent;
  while (box && !(typeof box.type === 'string' && box.props?.style?.position === 'absolute' && box.props.style.right < 0)) {
    box = box.parent;
  }
  expect(box).toBeTruthy();
  // The container it is measured from must be the one that DRAWS THE FRAME. That is the
  // only box in this screen whose right edge is the portrait's right edge: the full-width
  // strip put the toggle off the screen, and a wrapper that also held the name plate grew
  // with the plate and pushed the toggle a notch past the frame.
  // Up to the next HOST node. The immediate parent is RN's View class component, which
  // carries the same style — mistaking it for the container is how this read as broken.
  let holder = box!.parent;
  while (holder && typeof holder.type !== 'string') holder = holder.parent;
  const drawsFrame = holder?.findAll((n) => {
    const st = n.props?.style;
    return !!st && !Array.isArray(st) && st.overflow === 'hidden' && typeof st.width === 'number' && typeof st.height === 'number';
  }, { deep: true }) ?? [];
  expect(drawsFrame.length).toBeGreaterThan(0);
  const spans = holder?.props?.style;
  const flat = Array.isArray(spans) ? Object.assign({}, ...spans.filter(Boolean)) : spans;
  expect(flat?.left).toBeUndefined();
  expect(flat?.right).toBeUndefined();
});

test('the keyboard borrows the edge, and the tools hand their row back', async () => {
  // Two things at once, because they are the same fact: while the keyboard is up the
  // divider is NOT at the learner's number — it is borrowed — and the bedside tools stop
  // being drawn rather than merely fading, so the exchange gets their height back at the
  // moment the screen is smallest. Then both return.
  //
  // Driven through real Keyboard events. The source-level version of this check matched
  // the `{!typing && (` that guards the DRAG HANDLE a few lines above the dock, so it
  // passed with the dock rendered unconditionally.
  // Keyboard has no emit(), so the subscription is intercepted and the screen's own
  // handler is called. The platform is the only part faked; the handler is the real one.
  // A LIST per event, not one callback: more than one component on this screen listens,
  // and keeping only the last registration silently dropped the screen's own handler —
  // the dock stayed on and the test read as a broken guard.
  const fired: Record<string, ((e: unknown) => void)[]> = {};
  const spy = jest.spyOn(Keyboard, 'addListener').mockImplementation(((evt: string, cb: (e: unknown) => void) => {
    (fired[evt] ??= []).push(cb);
    return { remove: () => { fired[evt] = (fired[evt] ?? []).filter((f) => f !== cb); } };
  }) as never);
  const emit = (evt: string, e: unknown) => { for (const cb of fired[evt] ?? []) cb(e); };
  const tree = await mount();
  const resting = threadTop(tree.root);
  expect(dockNode(tree.root)).toBeTruthy();
  // will*, because jest-expo reports Platform.OS as ios — the same branch the screen
  // takes there. Other components on the screen subscribe to did* as well.
  expect(Object.keys(fired)).toEqual(expect.arrayContaining(['keyboardWillShow', 'keyboardWillHide']));

  await act(async () => {
    // duration 1, not 0: the screen reads `e.duration || 220`, so a zero would
    // silently take the 220ms fallback and the assertions would land mid-flight.
    emit('keyboardWillShow', { duration: 1, endCoordinates: { height: 300 } });
    await Promise.resolve();
  });
  expect(dockNode(tree.root)).toBeUndefined();

  await act(async () => {
    emit('keyboardWillHide', { duration: 1 });
    // Animated's JS driver runs on frames, so a microtask flush lands mid-flight. This
    // waits for the animation to actually arrive.
    await new Promise((r) => setTimeout(r, 60));
  });
  expect(dockNode(tree.root)).toBeTruthy();
  expect(threadTop(tree.root)).toBe(resting);
  spy.mockRestore();
});

test('the conversation happens on a ruled page', async () => {
  // The 근무 수첩 line is paper, and the rules are what make it paper. They are a run of
  // 1pt views here because RN has no repeating background — so an empty run is a blank
  // cream rectangle, which reads as "the notebook look did not load" rather than a bug.
  const tree = await mount();
  const rules = tree.root.findAll((n) => {
    if (typeof n.type !== 'string') return false;
    const st = n.props?.style;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st;
    return !!flat && flat.height === 1 && flat.backgroundColor === 'rgba(62,54,43,.06)';
  }, { deep: true });
  expect(rules.length).toBeGreaterThan(10);
});
