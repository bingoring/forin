// Measuring a shelf binder's on-screen rect for the fly-in cover (journey-binder-v42
// Task I, task-I-brief.md §2 point 1). Pulled out of BinderShelf.tsx into its own module
// for one reason: BinderShelf.test.tsx has to be able to fake a SUCCESSFUL measurement,
// and there is no way to do that against the real bridge call — `View#measureInWindow`
// exists on a host component instance under jest-expo (`typeof` it is `'function'`), but
// its native side is stubbed to a no-op that never invokes the callback, not even after a
// real wall-clock wait (confirmed by hand before writing this). Mocking this module is
// the only way to exercise "measurement succeeded" in a test.
//
// `NbInlineSelect.tsx` set the pattern this follows: measure into a ref, don't make the
// press wait on the bridge. There, the popover opens immediately and the measurement only
// refines its position afterward. Here, a binder can only carry ONE rect into `onOpen` —
// pressing it navigates away — so instead of refining after the fact, `Binder` measures
// once on mount (well before any press) and reads back whatever landed by press time. If
// nothing has landed yet — the bridge never called back, or hasn't yet — `onOpen` is
// called with no rect at all (task-I-brief.md §1: "측정이 실패하거나 늦으면 연출 없이
// 그냥 연다"), never with `undefined` standing in for one.
import type { RefObject } from 'react';
import type { View } from 'react-native';
import type { BinderRect } from '@/data/journeyBinderFly';

/** The shape `View#measureInWindow` actually has — not exported by `react-native`'s own
 *  types on every RN version, so this is spelled out rather than imported. */
type Measurable = { measureInWindow?: (cb: (x: number, y: number, width: number, height: number) => void) => void };

/**
 * Fires the native measure and calls `onRect` if and when it resolves. Fire-and-forget —
 * nothing here returns a promise for a caller to await, because there is nothing safe to
 * await: a stalled or missing bridge must never hold up navigation.
 */
export function watchBinderRect(ref: RefObject<View | null>, onRect: (rect: BinderRect) => void): void {
  const view = ref.current as unknown as Measurable | null;
  if (!view || typeof view.measureInWindow !== 'function') return;
  try {
    view.measureInWindow((x, y, width, height) => onRect({ x, y, width, height }));
  } catch {
    // A rect that never arrives IS the "measurement failed" case — nothing to recover.
  }
}
