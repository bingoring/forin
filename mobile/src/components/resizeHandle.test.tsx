// The app's third gesture. It exists because the dialogue screen has two edges nobody
// but the reader can place, and every fixed fraction was wrong for somebody.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));

import { readFileSync } from 'fs';
import { join } from 'path';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { ResizeHandle } from '@/components/ResizeHandle';
import { trackMounts } from '../testing/mountRegistry';
import { panDriver } from '../testing/panDriver';

const track = trackMounts();

/** The host node carrying the pan handlers. */
function grabber(root: ReactTestInstance): ReactTestInstance {
  const hits = root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true },
  );
  expect(hits.length).toBe(1);
  return hits[0];
}

function mount(over: Partial<Parameters<typeof ResizeHandle>[0]> = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<ResizeHandle onDrag={() => {}} {...over} />)); });
  return tree;
}

test('it claims the gesture on MOVEMENT, not on touch', () => {
  // Claiming on touch would steal taps from the rows either side of the line — the same
  // mistake the bottom sheet's drag made when its handlers sat on the whole sheet.
  //
  // Driven through panDriver, not by calling the props: PanResponder ignores a hand-made
  // gesture object and derives its own from the touch history, so poking the prop reads
  // dy = 0 forever and would pass whatever the threshold said.
  // A FRESH mount per case: one PanResponder instance carries its gesture state across
  // gestures, so a failed claim pollutes the dy the next driver computes.
  expect(panDriver(grabber(mount().root).props).down()).toBe(false);
  expect(panDriver(grabber(mount().root).props).claim(2)).toBe(false);
  expect(panDriver(grabber(mount().root).props).claim(9)).toBe(true);
});

test('it reports movement, and the caller owns the number', () => {
  // A delta per gesture rather than an absolute: this component knows nothing about what
  // is above or below it, so it cannot be the thing that clamps.
  const seen: number[] = [];
  const g = grabber(mount({ onDrag: (dy) => seen.push(dy) }).root);
  const pan = panDriver(g.props);
  act(() => {
    expect(pan.claim(10)).toBe(true);
    pan.move(20);
  });
  expect(seen).toHaveLength(1);
  // Measured from the GRANT, not from touch-down: PanResponder zeroes the gesture state
  // when the view wins the responder, so the 10 that earned the claim is not counted
  // again. That is the number the caller wants — how far the finger has moved the edge
  // since it took hold of it.
  expect(seen[0]).toBeCloseTo(20, 0);
});

test('the end of the gesture is reported once, however it ends', () => {
  // Somewhere to persist what the reader settled on. A terminate — another view stealing
  // the responder — has to count too, or a size would be kept only when the finger lifted
  // cleanly.
  let done = 0;
  const g = grabber(mount({ onDone: () => { done += 1; } }).root);
  const pan = panDriver(g.props);
  act(() => { pan.claim(10); pan.up(); });
  expect(done).toBe(1);
  act(() => { g.props.onResponderTerminate(); });
  expect(done).toBe(2);
});

test('the target is taller than the mark', () => {
  // A 4pt line is not something a thumb can find. The bar is the sign; the padded view
  // is what gets hit.
  const g = grabber(mount().root);
  const st = Array.isArray(g.props.style) ? Object.assign({}, ...g.props.style) : g.props.style;
  const bar = g.findAll((n) => {
    const s = Array.isArray(n.props?.style) ? Object.assign({}, ...n.props.style) : (n.props?.style ?? {});
    return typeof n.type === 'string' && typeof s.height === 'number';
  }, { deep: true })[0];
  const barSt = Array.isArray(bar.props.style) ? Object.assign({}, ...bar.props.style) : bar.props.style;
  expect(st.paddingVertical * 2 + barSt.height).toBeGreaterThan(barSt.height * 3);
});

test('a vertical drag on the line is captured, so a card below cannot steal it', () => {
  // The reply-choice cards sit directly below this handle and are pressables. Without
  // capture, a drag that started on the handle could be claimed by a card instead —
  // "잡고 위아래로 움직여도 잘 안 움직여". panDriver invokes the capture handler but does
  // not assert its return, so a check on the rendered tree cannot catch its removal;
  // the source is where the fix lives.
  const src = readFileSync(join(__dirname, 'ResizeHandle.tsx'), 'utf8');
  // Capture on MOVEMENT (the same condition as the bubble claim), never on touch — a
  // real card tap has no dy and still works.
  expect(src).toMatch(/onMoveShouldSetPanResponderCapture: \(_e, g\) => Math\.abs\(g\.dy\) > CLAIM_PX/);
  // And hitSlop widens the target so a thumb near the line still grabs it.
  expect(src).toMatch(/hitSlop=\{\{/);
});

test('a re-render does not leave the gesture calling a stale handler', () => {
  // PanResponder is built once. Closing over the first render's callbacks is the trap the
  // sheet's drag fell into, where it kept animating towards a height that had changed.
  const seen: string[] = [];
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<ResizeHandle onDrag={() => seen.push('first')} />)); });
  act(() => { tree.update(<ResizeHandle onDrag={() => seen.push('second')} />); });
  const pan = panDriver(grabber(tree.root).props);
  act(() => { pan.claim(10); pan.move(5); });
  expect(seen).toEqual(['second']);
});
