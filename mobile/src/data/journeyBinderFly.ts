// Hand-off from BinderShelf (부서 서가) to journey/dept/[dept].tsx (부서 간지) —
// journey-binder-v42 Task I, task-I-brief.md §2. Same shape and the same reasoning as
// journeyGoalPick.ts: the four numbers a press measured describe ONE RENDER of the shelf,
// not a stable id, so a route param is not where they belong — and the dept screen has
// nothing else it needs from the shelf to play the fly-in.
//
// `journey.tsx` only calls `setBinderFlyRect` when `BinderShelf` actually managed to
// measure a rect at press time (see BinderShelf.tsx's own "measurement failed or was
// late" fallback, which calls its `onOpen` prop with no rect at all in that case) — so an
// entry into the dept screen with nothing in this store is not a bug, it is the normal
// shape of "reached this screen without pressing a shelf binder" (a deep link, a
// re-focus, `router.back()` from the theme screen).
export type BinderRect = { x: number; y: number; width: number; height: number };

type Handoff = { dept: string; rect: BinderRect };

let handoff: Handoff | null = null;

/** `journey.tsx` calls this right before pushing the dept route, only when the press
 *  handler handed it a rect. */
export function setBinderFlyRect(dept: string, rect: BinderRect) {
  handoff = { dept, rect };
}

/**
 * Read once, at mount, by `journey/dept/[dept].tsx`. Consumes the value — like
 * `journeyGoalPick.ts`'s `goalPickOffer()`, a snapshot rather than a live subscription,
 * and additionally cleared here so a second mount of the SAME dept screen (the learner
 * backs out with the device button, then re-enters through a deep link or a re-focus)
 * does not replay a flight that belongs to the press that is long gone.
 *
 * Returns `null` when nothing was set, it was already consumed, or — the case that
 * matters most — it was set for a DIFFERENT department: a fast tap on one binder
 * racing a screen that opens a second dept by another path must not fly the wrong
 * rect onto the wrong cover.
 */
export function takeBinderFlyRect(dept: string): BinderRect | null {
  if (!handoff || handoff.dept !== dept) return null;
  const rect = handoff.rect;
  handoff = null;
  return rect;
}

/** Test-only reset — mirrors journeyGoalPick.ts's clearGoalPickOffer(). */
export function clearBinderFlyRect() {
  handoff = null;
}
