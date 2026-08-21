// The wards and situations this learner keeps coming back to.
//
// "Favorites", not "pins": Epic and Cerner both call this Favorites, and a US nurse has
// almost certainly used one of them. 즐겨찾기 in Korean, a star everywhere — the icon US
// clinical software uses for exactly this.
//
// Why it exists: a learner works in one or two wards. The career tab used to present all
// 24 floors as if the goal were to walk them, and reaching the one that matters meant
// picking a building and scrolling. Search answers "where is it"; this answers "stop
// making me look it up again".
//
// Stored on the device. That is a deliberate limit, and the same one the avatar takes: a
// reinstall forgets your wards. Moving it to the profile is a column and a sync, and worth
// doing once favourites have proven they are used.
import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.favorites.v1';

/** A favourited floor, addressed the way the career tab addresses floors. */
export type FavFloor = { building: string; floor: string; place: string; code?: string };
/** A favourited situation, addressed by the id that opens it. */
export type FavSituation = { scenarioId: string; name: string; where?: string };

export type Favorites = { floors: FavFloor[]; situations: FavSituation[] };

const EMPTY: Favorites = { floors: [], situations: [] };

let current: Favorites = EMPTY;
const listeners = new Set<() => void>();

export function getFavorites(): Favorites {
  return current;
}

export function subscribeFavorites(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Stable identity for a floor: a building and a floor number name exactly one. */
export function floorKey(f: { building: string; floor: string }): string {
  return `${f.building}/${f.floor}`;
}

export function isFloorFavorite(f: { building: string; floor: string }): boolean {
  const k = floorKey(f);
  return current.floors.some((x) => floorKey(x) === k);
}

export function isSituationFavorite(scenarioId: string): boolean {
  return current.situations.some((x) => x.scenarioId === scenarioId);
}

/** Read what was saved. Call once at startup. */
export async function loadFavorites(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    current = raw ? sanitize(JSON.parse(raw) as Partial<Favorites>) : EMPTY;
  } catch {
    current = EMPTY; // corrupt or absent → no favourites, never a crash
  }
  emit();
}

export async function toggleFloorFavorite(f: FavFloor): Promise<void> {
  const k = floorKey(f);
  const had = current.floors.some((x) => floorKey(x) === k);
  current = {
    ...current,
    // Newest first: the ward you just starred is the one you are working in now.
    floors: had ? current.floors.filter((x) => floorKey(x) !== k) : [f, ...current.floors],
  };
  await commit();
}

export async function toggleSituationFavorite(s: FavSituation): Promise<void> {
  const had = current.situations.some((x) => x.scenarioId === s.scenarioId);
  current = {
    ...current,
    situations: had
      ? current.situations.filter((x) => x.scenarioId !== s.scenarioId)
      : [s, ...current.situations],
  };
  await commit();
}

function emit(): void {
  for (const l of listeners) l();
}

async function commit(): Promise<void> {
  // Listeners first, storage second: the star must flip under the finger whether or not
  // the write lands, and a failed write costs a preference rather than a session.
  emit();
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(current));
  } catch {
    /* the in-memory value still applies for this session */
  }
}

/**
 * Stored JSON is input from a PREVIOUS VERSION of this file, so it is shaped rather than
 * trusted: a missing array, a duplicate, or an entry with no id would otherwise render as
 * a row that cannot be opened or removed.
 */
function sanitize(f: Partial<Favorites>): Favorites {
  const floors: FavFloor[] = [];
  const seenFloor = new Set<string>();
  for (const x of Array.isArray(f.floors) ? f.floors : []) {
    if (!x || typeof x.building !== 'string' || typeof x.floor !== 'string') continue;
    const k = floorKey(x);
    if (seenFloor.has(k)) continue;
    seenFloor.add(k);
    floors.push({ building: x.building, floor: x.floor, place: typeof x.place === 'string' ? x.place : x.floor, code: typeof x.code === 'string' ? x.code : undefined });
  }

  const situations: FavSituation[] = [];
  const seenSit = new Set<string>();
  for (const x of Array.isArray(f.situations) ? f.situations : []) {
    if (!x || typeof x.scenarioId !== 'string' || !x.scenarioId) continue;
    if (seenSit.has(x.scenarioId)) continue;
    seenSit.add(x.scenarioId);
    situations.push({ scenarioId: x.scenarioId, name: typeof x.name === 'string' ? x.name : x.scenarioId, where: typeof x.where === 'string' ? x.where : undefined });
  }
  return { floors, situations };
}

/** Subscribe a component to the list. The star has to flip the moment it is tapped. */
export function useFavorites(): Favorites {
  return useSyncExternalStore(subscribeFavorites, getFavorites);
}
