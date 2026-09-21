// The hand-off from journey.tsx (일터 탭) to the pushed 부서 고르기 screen
// (app/journey/pick-dept.tsx) — same shape as loungeShare.ts, and for the same
// reason: a URL is not where 29 department codes belong (a route param would be a
// second place that list could drift from GET /me/journey), and the server has
// nothing new to say — journey.tsx already has `goalDept` + `freeRoam[].dept` in
// hand from the fetch that drew the tab.
//
// The pick itself is not new either (J5 — one way to choose a goal department).
// `pickGoalDept` calls straight into journey.tsx's OWN `pickDept()`, published here
// alongside the list — that is the one function wired to the request-order counter
// (`seqRef`) that makes a fast double-pick resolve to whichever was tapped LAST. A
// route cannot receive a function as a param, but journey.tsx stays mounted under
// the pushed screen (React Navigation blurs a screen it pushed over, it does not
// unmount it), so handing the picker a reference to call is enough — no event bus,
// no context provider, just the same single-consumer module store the rest of this
// repo already uses for this exact kind of cross-screen hand-off.
export type GoalPickOffer = {
  /** The whole department list, already assembled by journey.tsx (goalDept ∪
   *  freeRoam[].dept) — this module never builds one of its own. */
  depts: string[];
  current: string;
  /** True when `current` is only a server guess, not yet the learner's own choice —
   *  the picker reads with an inviting tone rather than presenting a settled fact. */
  inferred: boolean;
};

let offer: GoalPickOffer | null = null;
let pick: ((dept: string) => void) | null = null;

/** journey.tsx calls this right before pushing the picker, handing it both the list
 *  to show and the function to call when one is tapped. */
export function offerGoalPick(o: GoalPickOffer, pickFn: (dept: string) => void) {
  offer = o;
  pick = pickFn;
}

/** Read once, at mount, by the picker screen — see loungeShare.ts's `shareSource()`
 *  for why a snapshot rather than a live subscription: the list is exactly what was
 *  on the tab bar the moment it was tapped, and should not shift under the learner's
 *  thumb while they are choosing. */
export function goalPickOffer(): GoalPickOffer | null {
  return offer;
}

/** Called by a row in the picker screen. Routes straight into journey.tsx's
 *  pickDept() — the same PATCH + refetch the free-roam chips use, request-order
 *  counter and all. */
export function pickGoalDept(dept: string) {
  pick?.(dept);
}

/** Test-only reset / defensive cleanup — mirrors loungeShare.ts's clearShareSource(). */
export function clearGoalPickOffer() {
  offer = null;
  pick = null;
}
