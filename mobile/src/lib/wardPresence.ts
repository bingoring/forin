// Live-ward presence — the client half of the polling + TTL roster.
//
// Two concerns, deliberately split:
//
//  · Whether I am ONLINE is app-wide. A heartbeat runs while the app is FOREGROUNDED on any
//    screen, so a learner deep in a scenario still walks the ward; only backgrounding or
//    closing the app drops them (the server's TTL clears a crash). initPresence() wires this
//    once at the app root.
//  · Whether I SEE the ward is home-only. The roster is polled just while home is focused,
//    because that is the only place it is drawn. The home poll (GET /ward) doubles as the
//    heartbeat, so on home there is no separate POST.
//
// Every network call is best-effort: presence must never throw into the UI.
import { AppState, type AppStateStatus } from 'react-native';
import { useSyncExternalStore } from 'react';
import { api, type WardMember } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

const HOME_MS = 6_000; // roster poll (also the heartbeat) while home is focused
const AWAY_MS = 15_000; // heartbeat only, on every other foreground screen

let appActive = AppState.currentState === 'active';
let homeActive = false;
let started = false;
let timer: ReturnType<typeof setInterval> | null = null;

let roster: WardMember[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setRoster(next: WardMember[]) {
  // Skip a needless notify when the same people are in the same order.
  if (next.length === roster.length && next.every((m, i) => m.id === roster[i]?.id)) return;
  roster = next;
  emit();
}

function authed(): boolean {
  try {
    return !!useAuthStore.getState().accessToken;
  } catch {
    return false;
  }
}

async function tickHome() {
  if (!authed()) return;
  try {
    setRoster(await api.ward());
  } catch {
    // keep the last roster; the next tick tries again
  }
}

async function tickAway() {
  if (!authed()) return;
  try {
    await api.wardHeartbeat();
  } catch {
    // best-effort
  }
}

function reschedule() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (!appActive) return;
  if (homeActive) {
    void tickHome();
    timer = setInterval(tickHome, HOME_MS);
  } else {
    void tickAway();
    timer = setInterval(tickAway, AWAY_MS);
  }
}

function onAppState(s: AppStateStatus) {
  const nowActive = s === 'active';
  if (nowActive === appActive) return;
  appActive = nowActive;
  if (appActive) {
    reschedule();
    return;
  }
  // Backgrounded/closed: stop, drop the roster, and leave the ward at once so others see
  // the exit without waiting out the TTL.
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  setRoster([]);
  if (authed()) {
    void api.wardLeave().catch(() => {});
  }
}

/** Wire the app-wide heartbeat once, at the app root. Idempotent. */
export function initPresence() {
  if (started) return;
  started = true;
  AppState.addEventListener('change', onAppState);
  reschedule();
}

/** The home screen calls this on focus/blur, so the roster polls only while it is on screen. */
export function setHomeActive(active: boolean) {
  if (active === homeActive) return;
  homeActive = active;
  reschedule();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getRoster() {
  return roster;
}

/** Subscribe to the live roster: up to 9 others. The learner's own figure is drawn on top. */
export function useWardRoster(): WardMember[] {
  return useSyncExternalStore(subscribe, getRoster, getRoster);
}
