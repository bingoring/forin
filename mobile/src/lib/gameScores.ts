// Break-time mini-games keep their scores on the device (v38 GameHub).
//
// Two things live here: a per-game BEST score, and how many games were STARTED today (the
// "오늘 N/3판" limit). The weekly colleague ranking and challenges are a server feature and
// are deliberately NOT here — this is the local half that ships first. Device-local, like
// favourites: a reinstall forgets high scores, which for a casual game is fine.
import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.games.v1';
/** Games can be started this many times a day (across all games, per the hub header). */
export const MAX_PLAYS_PER_DAY = 3;

type GameState = { best: Record<string, number>; playDate: string; playsToday: number };
let state: GameState = { best: {}, playDate: '', playsToday: 0 };
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
function persist() {
  void SecureStore.setItemAsync(KEY, JSON.stringify(state)).catch(() => {});
}

/** Local yyyy-mm-dd — the day boundary a learner means by "today", not UTC. */
export function todayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Hydrate at boot (see app/_layout). Best-effort. */
export async function loadGameScores(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (raw) state = { best: {}, playDate: '', playsToday: 0, ...JSON.parse(raw) };
  } catch {
    // keep the empty default
  }
  emit();
}

function playsFor(dateKey: string): number {
  return state.playDate === dateKey ? state.playsToday : 0;
}

/** Plays started today (resets when the date rolls over). */
export function playsToday(dateKey: string = todayKey()): number {
  return playsFor(dateKey);
}

/** Plays still allowed today. */
export function playsLeft(dateKey: string = todayKey()): number {
  return Math.max(0, MAX_PLAYS_PER_DAY - playsFor(dateKey));
}

export function bestScore(gameId: string): number | undefined {
  return state.best[gameId];
}

/** Count a started game against today's limit. Called when entering a game from the hub. */
export function startPlay(dateKey: string = todayKey()): void {
  if (state.playDate !== dateKey) {
    state.playDate = dateKey;
    state.playsToday = 0;
  }
  state.playsToday += 1;
  emit();
  persist();
}

/** Record a finished round's score, keeping only the best. Retries within a session are
 *  free — only startPlay counts against the daily limit. */
export function recordBest(gameId: string, score: number): void {
  if (state.best[gameId] === undefined || score > state.best[gameId]) {
    state.best[gameId] = score;
    emit();
    persist();
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Subscribe to today's play count (re-renders the hub as games are started). */
export function usePlaysToday(dateKey: string = todayKey()): number {
  return useSyncExternalStore(subscribe, () => playsFor(dateKey), () => playsFor(dateKey));
}

/** Subscribe to a game's best score. */
export function useBestScore(gameId: string): number | undefined {
  return useSyncExternalStore(subscribe, () => state.best[gameId], () => state.best[gameId]);
}
