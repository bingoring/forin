// 라이브 병동 (v27), and the clock it follows.
//
// The shift used to come from the server, which never read a clock: home.DeriveShift
// picked between "DAY" and "EVENING" with `shifts[hash(userID, day) % 2]`. A learner
// opening the app at 11pm was told they were on days, and it flipped the next morning
// for no reason they could see. The phone decides now — and the badge and the ward read
// the SAME source, because two sources is how the badge came to say DAY over a ward
// full of stars.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}),
  createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f,
  runOnUI: (f: unknown) => f,
  isWorkletFunction: () => false,
}));
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t, linear: (t: number) => t },
    // Exactly what engine/Sprite.tsx imports. The sprite's motion is not what these
    // tests are about — that its colours come from the learner's profile is.
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
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { LiveWard } from '@/components/home/LiveWard';
import { SHIFT_LABEL, moodAt, msUntilNextMood } from '@/data/wardMood';
import { setAvatar } from '@/lib/avatar';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}
/** Every fill colour used anywhere in the drawing. */
function fills(root: ReactTestInstance): string[] {
  const out: string[] = [];
  for (const n of root.findAll(() => true, { deep: true })) {
    const bg = flat(n.props?.style).backgroundColor;
    if (typeof bg === 'string') out.push(bg.toUpperCase());
    const f = n.props?.fill;
    if (typeof f === 'string') out.push(f.toUpperCase());
  }
  return out;
}

const at = (h: number) => () => new Date(2026, 7, 28, h, 30, 0);

const mounted: ReturnType<typeof create>[] = [];
function mount(props: Parameters<typeof LiveWard>[0] = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<LiveWard {...props} />); });
  mounted.push(tree);
  return tree;
}
afterEach(() => { for (const tree of mounted.splice(0)) act(() => { tree.unmount(); }); });

// ── the clock ─────────────────────────────────────────────────────────────
test('the mood comes from the device clock, on nursing shift boundaries', () => {
  // 데이 07–15, 이브닝 15–23, 나이트 23–07. Not 6/12/18: a nurse reading this screen
  // knows the real boundaries, and those are the ones the app is about.
  expect(moodAt(new Date(2026, 7, 28, 6, 59))).toBe('night');
  expect(moodAt(new Date(2026, 7, 28, 7, 0))).toBe('day');
  expect(moodAt(new Date(2026, 7, 28, 14, 59))).toBe('day');
  expect(moodAt(new Date(2026, 7, 28, 15, 0))).toBe('evening');
  expect(moodAt(new Date(2026, 7, 28, 22, 59))).toBe('evening');
  expect(moodAt(new Date(2026, 7, 28, 23, 0))).toBe('night');
  expect(moodAt(new Date(2026, 7, 28, 3, 0))).toBe('night');
});

test('the ward waits for the next boundary rather than polling', () => {
  // At 14:58 the ward turns over at 15:00 without the learner leaving the screen; an
  // app left open overnight does not still say DAY in the morning.
  const eightMin = msUntilNextMood(new Date(2026, 7, 28, 14, 52));
  expect(Math.round(eightMin / 60_000)).toBe(8);
  // 23:00 → 07:00 crosses midnight, which is the one boundary that is not today.
  const overnight = msUntilNextMood(new Date(2026, 7, 28, 23, 30));
  expect(Math.round(overnight / 3_600_000)).toBe(8);
  // Every hour lands on a boundary strictly ahead of it, including the boundary
  // instants themselves — so the wait is always positive without needing a floor.
  for (let h = 0; h < 24; h++) {
    expect(msUntilNextMood(new Date(2026, 7, 28, h, 0, 0))).toBeGreaterThan(0);
  }
});

// ── the three moods ───────────────────────────────────────────────────────
test('each shift draws its own sky, and says what it changes', () => {
  expect(texts(mount({ now: at(10) }).root).join(' ')).toContain('DAY');
  expect(texts(mount({ now: at(10) }).root).join(' ')).toContain('회진');
  expect(texts(mount({ now: at(18) }).root).join(' ')).toContain('EVENING');
  expect(texts(mount({ now: at(2) }).root).join(' ')).toContain('NIGHT');
  // The bar under the ward is the reason the mood matters: it says which scenarios are
  // likelier today. A mood with no consequence is decoration.
  expect(texts(mount({ now: at(18) }).root).join(' ')).toContain('SBAR');
});

/** The full-bleed night overlay: it has to cover the PEOPLE too, not just the walls, or
 *  the ward reads as a lit room with a dark wall behind it. */
function overlays(root: ReactTestInstance): ReactInstanceStyle[] {
  return root
    .findAll((n) => {
      const st = flat(n.props?.style);
      return String(n.type) === 'View'
        && st.position === 'absolute'
        && st.left === 0 && st.top === 0 && st.right === 0 && st.bottom === 0
        && String(st.backgroundColor).toUpperCase() === '#213B4A'
        && typeof st.opacity === 'number';
    }, { deep: true })
    .map((n) => flat(n.props.style) as ReactInstanceStyle);
}
type ReactInstanceStyle = { opacity?: number };

test('night is dark, day is not', () => {
  // Counting #213B4A occurrences was not enough: the vitals monitor is that colour in
  // every mood, so removing the overlay entirely still left night with more of it than
  // day, and the test passed. This looks for the overlay itself.
  const night = overlays(mount({ now: at(2) }).root);
  expect(night).toHaveLength(1);
  expect(night[0].opacity).toBeCloseTo(0.28);
  expect(overlays(mount({ now: at(10) }).root)).toHaveLength(0);
  expect(overlays(mount({ now: at(18) }).root)).toHaveLength(0);
  // Day's sky, which night has no room for.
  expect(fills(mount({ now: at(10) }).root)).toContain('#BAE6FD');
});

test('the ward is quieter at night', () => {
  // One person on nights, two on the busy shifts — the handoff's `npcs`. Counted by
  // sprites, since that is what "quieter" means here.
  const sprites = (tree: ReturnType<typeof create>) =>
    tree.root.findAll((n) => String(n.type) === 'RNSVGSvgView', { deep: true }).length;
  expect(sprites(mount({ now: at(10) }))).toBeGreaterThan(sprites(mount({ now: at(2) })));
});

// ── the learner's own ward ────────────────────────────────────────────────
test('the walking nurse is the learner, from their profile', async () => {
  // Their ward, their avatar. A stranger patrolling it would be a decoration — and the
  // same three choices already draw their face on the profile card and in the dialogue.
  await act(async () => { await setAvatar({ hair: '#C9A227', skin: '#8D5524', scrub: '#FBCFE8' }); });
  const drawn = fills(mount({ now: at(10) }).root);
  expect(drawn).toContain('#C9A227'); // hair
  expect(drawn).toContain('#8D5524'); // skin
  expect(drawn).toContain('#FBCFE8'); // scrubs
});

test('changing the avatar changes the nurse', async () => {
  await act(async () => { await setAvatar({ scrub: '#BAE6FD' }); });
  const before = fills(mount({ now: at(10) }).root);
  expect(before).toContain('#BAE6FD');
  await act(async () => { await setAvatar({ scrub: '#FDE68A' }); });
  const after = fills(mount({ now: at(10) }).root);
  expect(after).toContain('#FDE68A');
});

// ── one source ────────────────────────────────────────────────────────────
test('the shift badge reads the same clock as the ward', () => {
  const { readFileSync } = require('fs') as typeof import('fs');
  const { join } = require('path') as typeof import('path');
  const src = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'index.tsx'), 'utf8');
  // The badge takes its NAME from the device clock and its DEPARTMENT from the server —
  // the department is the current curriculum step's, which the phone cannot know.
  // v29 draws them in one handwritten line rather than a badge, so the check is on where
  // each half comes FROM, which is the invariant — not on the component that used to hold
  // them.
  expect(src).toMatch(/SHIFT_LABEL\[moodAt\(new Date\(\)\)\]/);
  expect(src).toMatch(/dept: home\.shift\.deptLabel/);
  // The dice roll it replaced.
  expect(src).not.toMatch(/shift: home\.shift\.shift/);
  expect(SHIFT_LABEL.night).toBe('NIGHT'); // a value the server's two-way coin flip had no room for
});

test('the home card names the CURRICULUM, with the step as its subtitle', () => {
  const { readFileSync } = require('fs') as typeof import('fs');
  const { join } = require('path') as typeof import('path');
  const src = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'index.tsx'), 'utf8');
  // It used to be the other way round: the step's title was the big line and the
  // curriculum a caption above it, which said "today's one thing" and left the learner
  // to work out where that thing was. `one.chapter` is the curriculum the server
  // resumed — the one holding their LAST attempt (see markResume server-side).
  // v29 draws it as handwriting on a taped page; what must hold is which half is big.
  expect(src).toMatch(/nbText\.hand\(21\)[^>]*>\{home\.todayOne\.chapter\}/);
  expect(src).toMatch(/t\('home\.nextUp', \{ title: home\.todayOne\.title \}\)/);
  // And the label says so.
  expect(src).toMatch(/t\('home\.curriculumTab'\)/);
  expect(src).not.toMatch(/t\('home\.todayOneTab'\)/);
});
