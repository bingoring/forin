// How the sheet ENTERS, which is the part that broke silently.
//
// Reported as: a profile badge sheet appears fully formed instead of sliding up, and
// closes smoothly — every time, until you drag it down once by the handle, after which
// it behaves. The career tab's sheet was always fine.
//
// The cause was an effect re-run. `offscreenY` is a dependency and it MOVES the moment
// a content-sized sheet is measured (restH derives from contentH), so the effect ran a
// second time mid-entry, found the sheet already open, and planted it at its resting
// position. A size="tall" sheet has a constant restH, so its offscreenY never moves —
// hence the career tab looking right.
//
// Three behaviours have to hold together, and they pull against each other: an entry
// animates, a measurement does not cancel it, and a sheet coming back from being
// covered is planted rather than re-animated.
import { readFileSync } from 'fs';
import { join } from 'path';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Animated, Text, View } from 'react-native';

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { BottomSheet } from '@/components/BottomSheet';

// beginEntry defers the spring by one frame; jest's rAF does not run on its own.
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, 'requestAnimationFrame').mockImplementation(((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  }) as never);
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

/** Records every spring/timing target the sheet animates `y` to. */
function trackAnimations() {
  const targets: number[] = [];
  const spring = jest.spyOn(Animated, 'spring').mockImplementation(((_v: unknown, cfg: { toValue: number }) => {
    targets.push(cfg.toValue);
    return { start: (cb?: (r: { finished: boolean }) => void) => cb?.({ finished: true }), stop: () => {} } as never;
  }) as never);
  return { targets, restore: () => spring.mockRestore() };
}

/** Fires onLayout on every view that has one, the way the native layout pass would. */
function layout(root: ReactTestInstance, height = 300) {
  const nodes = root.findAll((n) => typeof n.props?.onLayout === 'function', { deep: true });
  act(() => {
    for (const n of nodes) n.props.onLayout({ nativeEvent: { layout: { height, width: 390 } } });
  });
}

test('a reopened sheet animates in again', () => {
  const { targets, restore } = trackAnimations();
  let tree!: ReturnType<typeof create>;

  // Open.
  act(() => {
    tree = create(<BottomSheet visible onClose={() => {}}><View><Text>hi</Text></View></BottomSheet>);
  });
  layout(tree.root);
  act(() => { jest.advanceTimersByTime(400); });
  const first = [...targets];

  // Close, then reopen with the SAME content — the profile's badge sheet is one
  // component whose children never change shape.
  act(() => {
    tree.update(<BottomSheet visible={false} onClose={() => {}}><View><Text>hi</Text></View></BottomSheet>);
  });
  targets.length = 0;
  act(() => {
    tree.update(<BottomSheet visible onClose={() => {}}><View><Text>hi</Text></View></BottomSheet>);
  });
  layout(tree.root);
  act(() => { jest.advanceTimersByTime(400); });

  console.log('first open animated to:', first, ' reopen animated to:', targets);
  expect(targets).toContain(0); // travelled to the resting position = it animated in
  restore();
});

test('the measurement arriving must not slam the sheet to its resting place', () => {
  // The reported bug: a content-sized sheet appears fully formed instead of sliding up,
  // and closes smoothly. Reproduced by letting the measured height CHANGE — which is
  // what happens on a profile badge sheet, whose text length differs per badge:
  //
  //   1. visible -> effect parks y offscreen (using the OLD restH) and arms the entry
  //   2. content lays out taller -> setContentH -> restH changes -> offscreenY changes
  //   3. offscreenY is an effect dep, so the effect RE-RUNS, sees openedRef already
  //      true, and takes the "uncovered, just be there" branch: y.setValue(0)
  //
  // The career sheet is size="tall", whose restH is a constant, so its offscreenY never
  // moves and it never hits this.
  const setValues: number[] = [];
  const { targets, restore } = trackAnimations();
  const realSetValue = Animated.Value.prototype.setValue;
  jest.spyOn(Animated.Value.prototype, 'setValue').mockImplementation(function (this: Animated.Value, v: number) {
    setValues.push(v);
    return realSetValue.call(this, v);
  } as never);

  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(<BottomSheet visible onClose={() => {}}><View><Text>hi</Text></View></BottomSheet>);
  });
  // The measurement lands at a height the sheet did not have before.
  layout(tree.root, 420);
  act(() => { jest.advanceTimersByTime(400); });

  // It must have travelled to 0, not been placed there.
  expect(targets).toContain(0);
  const jumpedToRest = setValues.filter((v) => v === 0).length;
  expect(jumpedToRest).toBe(0);
  restore();
});

test('a sheet uncovered after being suspended IS planted, not re-animated', () => {
  // The branch's actual purpose, and the reason it cannot simply be deleted: a sheet
  // covered by a pushed screen was never dismissed, so coming back it should already be
  // where it was. Re-animating it would make returning from a briefing look like the
  // sheet opening for the first time.
  const setValues: number[] = [];
  const { targets, restore } = trackAnimations();
  const realSetValue = Animated.Value.prototype.setValue;
  jest.spyOn(Animated.Value.prototype, 'setValue').mockImplementation(function (this: Animated.Value, v: number) {
    setValues.push(v);
    return realSetValue.call(this, v);
  } as never);

  const sheet = (props: { visible: boolean; suspended: boolean }) => (
    <BottomSheet visible={props.visible} suspended={props.suspended} onClose={() => {}}>
      <View><Text>hi</Text></View>
    </BottomSheet>
  );
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(sheet({ visible: true, suspended: false })); });
  layout(tree.root, 300);
  act(() => { jest.advanceTimersByTime(400); });

  // Covered by a pushed screen, then uncovered.
  act(() => { tree.update(sheet({ visible: true, suspended: true })); });
  setValues.length = 0;
  targets.length = 0;
  act(() => { tree.update(sheet({ visible: true, suspended: false })); });
  act(() => { jest.advanceTimersByTime(400); });

  // Planted at rest, and NOT animated in again.
  expect(setValues).toContain(0);
  expect(targets).not.toContain(0);
  restore();
});

test('nothing the entry schedules outlives the sheet', () => {
  // The effect's 250ms fallback was cleared on cleanup; the frame it schedules was not.
  // A sheet unmounted in between started a spring on a gone component — which on CI
  // surfaced as `Cannot read properties of undefined (reading 'spring')` inside an
  // unrelated suite, because the callback ran after jest had torn the module registry
  // down and `Animated` itself was gone. Locally it never fired: a teardown race only
  // shows up where the timing differs.
  const src = readFileSync(join(__dirname, 'BottomSheet.tsx'), 'utf8');
  // The frame is held so it can be cancelled…
  expect(src).toMatch(/entryFrame\.current = requestAnimationFrame\(/);
  // …and it is, on unmount.
  expect(src).toMatch(/cancelAnimationFrame\(entryFrame\.current\)/);
  // The fallback timer keeps its own cleanup.
  expect(src).toMatch(/return \(\) => clearTimeout\(fallback\)/);
});

test('nothing the sheet scheduled runs after it unmounts', () => {
  // The CI-only crash, twice over: `Cannot read properties of undefined (reading
  // 'spring')` in an unrelated suite, because a frame the sheet had scheduled fired
  // after jest tore the module registry down and `Animated` was gone.
  //
  // The first fix cancelled the frame on unmount. It came back — cancelling relies on
  // the host's cancelAnimationFrame actually cancelling, and under jest's preset rAF is
  // a setTimeout shim. So the callback checks for itself.
  //
  // rAF is NOT auto-run here (unlike the other tests in this file): the whole point is
  // to fire it after the unmount, the way the real leak did.
  jest.restoreAllMocks();
  jest.useFakeTimers();
  const frames: FrameRequestCallback[] = [];
  jest.spyOn(global, 'requestAnimationFrame').mockImplementation(((cb: FrameRequestCallback) => {
    frames.push(cb);
    return frames.length;
  }) as never);
  // A cancel that does nothing — exactly the environment the second crash came from.
  jest.spyOn(global, 'cancelAnimationFrame').mockImplementation((() => {}) as never);
  const { targets } = trackAnimations();

  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<BottomSheet visible onClose={() => {}}><Text>x</Text></BottomSheet>); });
  // Layout is what calls beginEntry, and beginEntry is what schedules the frame. Without
  // it nothing is pending and this test passes no matter what the callback does — which
  // is exactly how the first version of it passed with the guard deleted.
  layout(tree.root);
  expect(frames.length).toBeGreaterThan(0);

  act(() => { tree.unmount(); });

  const before = targets.length;
  // Fire everything the sheet left behind.
  act(() => { frames.splice(0).forEach((cb) => cb(0)); jest.runOnlyPendingTimers(); });

  // Not one more animation than before the unmount. In the real failure this extra
  // spring is what touched a torn-down `Animated`.
  expect(targets.length).toBe(before);
});
