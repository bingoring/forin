// Hand-off from journey/dept/[dept].tsx BACK to the tab's own overlay
// (components/journey/BinderExitOverlay.tsx) — journey-binder-v42 Task J,
// task-J-brief.md §1.
//
// Same shape as journeyBinderFly.ts's forward hand-off (dept, rect, and here also the
// progress numbers the cover face needs to draw itself), but that store is read ONCE, at
// mount, by the screen it hands off to — the dept screen mounting IS the moment it wants
// to know. This hand-off runs the other way: the receiver (`BinderExitOverlay`) is
// already standing, mounted beside the stack in journey/_layout.tsx, long before any
// exit ever happens. It has no mount of its own to read a snapshot at when the request
// arrives — it has to be TOLD, while it is already rendering. That is a subscription,
// not a snapshot.
//
// `components/SheetOverlay.tsx`'s `Registry` is this repo's subscription convention
// (`useSyncExternalStore`) — mirrored here rather than reused directly, because that
// registry holds a rendered `ReactNode` per caller-chosen id and republishes it on every
// render of whichever screen registered it (a sheet's owner is still mounted the whole
// time it is open). This store holds one plain value instead, and it is deliberately
// built to outlive the screen that set it: the entire point of Task J is that the dept
// screen unmounts (`onExit()`) the instant it hands this off, while the flight (⑤) is
// still mid-air. Nothing here may depend on that screen still being around to keep
// republishing — the overlay both reads AND clears this store on its own.
import { useSyncExternalStore } from 'react';
import type { BinderRect } from './journeyBinderFly';

export type BinderExitRequest = {
  dept: string;
  rect: BinderRect;
  doneTopics: number;
  totalTopics: number;
};

let current: BinderExitRequest | null = null;
const listeners = new Set<() => void>();

function publish() {
  for (const fn of listeners) fn();
}

/**
 * `useBinderCoverFlight`'s `onCoverClosed` calls this the INSTANT ④ (the reverse curl)
 * finishes — before it calls `onExit()` (task-J-brief.md §4). That order is the whole
 * fix: the overlay has a cover to paint for the one frame the dept screen still occupies
 * the screen behind it, so nothing is ever briefly showing through.
 */
export function requestBinderExit(req: BinderExitRequest) {
  current = req;
  publish();
}

/** `BinderExitOverlay` calls this once its own flight (⑤, `LEAVE_MS`) finishes. */
export function clearBinderExit() {
  if (current === null) return;
  current = null;
  publish();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  return current;
}

/** `BinderExitOverlay`'s own subscription — re-renders the instant a request lands or
 *  is cleared, unlike `journeyBinderFly.ts`'s read-once-at-mount pattern. */
export function useBinderExitRequest(): BinderExitRequest | null {
  return useSyncExternalStore(subscribe, getSnapshot);
}
