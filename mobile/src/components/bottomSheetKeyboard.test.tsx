// The sheet and the keyboard move together, and nothing shows between them.
//
// Two defects, both visible only on a device with a text field in a sheet:
//
//  1. The sheet was positioned with `bottom: kbH` — a LAYOUT property set from state, so
//     it jumped to its lifted place in one frame while the keyboard was still gliding up
//     behind it. The keyboard glides; the sheet teleported.
//  2. The keyboard's top edge is rounded (iOS, and some Android OEM keyboards). A
//     square-edged sheet lifted to sit exactly on it left a sliver of backdrop showing
//     at each bottom corner, where the curve cut away.
import { Animated, Keyboard, Text, View } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BottomSheet } from '@/components/BottomSheet';

const SRC = readFileSync(join(__dirname, 'BottomSheet.tsx'), 'utf8');
const KB_H = 336;

/** Flattens a style prop into one object. */
function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}

/** The sheet's own animated container: the absolutely-positioned box that carries the
 *  top border the design draws on it. */
function sheet(root: ReactTestInstance): ReactTestInstance {
  const hits = root.findAll((n) => {
    const st = flat(n.props?.style);
    return typeof n.type === 'string' && st.position === 'absolute' && st.borderTopWidth === 4;
  }, { deep: true });
  expect(hits.length).toBe(1);
  return hits[0];
}

/** Every listener the sheet registered, by event name. Captured rather than emitted:
 *  this RN version has no Keyboard.emit, and intercepting addListener drives the exact
 *  callbacks the platform would call. */
const listeners = new Map<string, ((e: unknown) => void)[]>();
function captureKeyboard() {
  jest.spyOn(Keyboard, 'addListener').mockImplementation(((event: string, cb: (e: unknown) => void) => {
    const list = listeners.get(event) ?? [];
    list.push(cb);
    listeners.set(event, list);
    return { remove: () => { listeners.set(event, (listeners.get(event) ?? []).filter((x) => x !== cb)); } };
  }) as never);
}

const mounted: ReturnType<typeof create>[] = [];
function mount() {
  captureKeyboard();
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <BottomSheet visible onClose={() => {}}>
        <Text>content</Text>
      </BottomSheet>,
    );
  });
  mounted.push(tree);
  return tree;
}

/** Fires a keyboard event the way the platform does. */
function emit(event: string, height: number, duration?: number) {
  const cbs = listeners.get(event) ?? [];
  expect(cbs.length).toBeGreaterThan(0); // the sheet has to be listening for it at all
  act(() => {
    for (const cb of cbs) cb({ endCoordinates: { height, screenX: 0, screenY: 0, width: 390 }, duration });
  });
}

afterEach(() => {
  for (const tree of mounted.splice(0)) act(() => { tree.unmount(); });
  listeners.clear();
  jest.restoreAllMocks();
});

test('the lift is animated, not a layout jump', () => {
  const timing = jest.spyOn(Animated, 'timing');
  const tree = mount();

  // Pinned to the bottom. `bottom` is the property that cannot be animated by the
  // native driver, so the moment it carries the keyboard height the movement is a jump.
  expect(flat(sheet(tree.root).props.style).bottom).toBe(0);

  emit('keyboardWillShow', KB_H, 250);

  const lift = timing.mock.calls.find(([, cfg]) => (cfg as { toValue?: number }).toValue === KB_H);
  expect(lift).toBeDefined();
  const cfg = lift![1] as { duration?: number; useNativeDriver?: boolean };
  // The system's OWN duration, from the event. Travelling for a different length of time
  // than the keyboard is what makes the two look unrelated.
  expect(cfg.duration).toBe(250);
  expect(cfg.useNativeDriver).toBe(true);
  // Still bottom: 0 afterwards — the movement is entirely in the transform.
  expect(flat(sheet(tree.root).props.style).bottom).toBe(0);
});

test('hiding animates back down too', () => {
  const timing = jest.spyOn(Animated, 'timing');
  mount();
  emit('keyboardWillShow', KB_H, 250);
  timing.mockClear();
  emit('keyboardWillHide', 0, 300);

  const down = timing.mock.calls.find(([, cfg]) => (cfg as { toValue?: number }).toValue === 0);
  expect(down).toBeDefined();
  expect((down![1] as { duration?: number }).duration).toBe(300);
});

test('an event with no duration still animates', () => {
  // Android's keyboardDidShow arrives without one. A missing duration must not become
  // `duration: 0`, which is a jump wearing an animation's clothes.
  const timing = jest.spyOn(Animated, 'timing');
  mount();
  emit('keyboardDidShow', KB_H, undefined);
  const lift = timing.mock.calls.find(([, cfg]) => (cfg as { toValue?: number }).toValue === KB_H);
  expect(lift).toBeDefined();
  expect((lift![1] as { duration?: number }).duration).toBeGreaterThan(0);
});

test('both will* and did* are listened for, on both platforms', () => {
  // iOS gets `will` (before the move, with a duration); Android generally only gets
  // `did`. Choosing by Platform.OS meant Android animated from a listener that fires
  // after the keyboard has already arrived, and iOS never heard `did` at all.
  mount();
  for (const evt of ['keyboardWillShow', 'keyboardDidShow', 'keyboardWillHide', 'keyboardDidHide']) {
    expect(listeners.get(evt)?.length ?? 0).toBeGreaterThan(0);
  }
  // The platform fork this replaced.
  expect(SRC).not.toMatch(/Platform\.OS === 'ios' \? 'keyboardWillShow'/);
});

test('the keyboard area is painted in the sheet\'s own colour', () => {
  const tree = mount();
  const paper = flat(sheet(tree.root).props.style).backgroundColor;

  const filler = () =>
    sheet(tree.root).findAll((n) => {
      const st = flat(n.props?.style);
      return typeof n.type === 'string' && st.top === '100%' && st.backgroundColor === paper;
    }, { deep: true })[0];

  // Nothing to cover with no keyboard.
  expect(flat(filler().props.style).height).toBe(0);

  emit('keyboardWillShow', KB_H, 250);
  // The whole keyboard area, so what shows through its rounded corners is more sheet.
  expect(flat(filler().props.style).height).toBe(KB_H);

  emit('keyboardWillHide', 0, 250);
  expect(flat(filler().props.style).height).toBe(0);
});

test('the filler cannot swallow a touch', () => {
  const tree = mount();
  emit('keyboardWillShow', KB_H, 250);
  const filler = sheet(tree.root).findAll((n) => {
    const st = flat(n.props?.style);
    return typeof n.type === 'string' && st.top === '100%';
  }, { deep: true })[0];
  // It sits over the keyboard. A strip that took touches would eat key presses.
  expect(filler.props.pointerEvents).toBe('none');
});

test('the drag still speaks in its old numbers', () => {
  // The lift is a SEPARATE transform term, so `y` keeps meaning "how far below resting"
  // and the offscreen target stays restH + kbH. Folding the keyboard into `y` would have
  // made every gesture threshold keyboard-dependent.
  expect(SRC).toMatch(/transform: \[\{ translateY: Animated\.subtract\(y, kbLift\) \}\]/);
  expect(SRC).toMatch(/const offscreenY = restH \+ kbH;/);
});
