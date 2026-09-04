// The one brief task the server cannot see: whether today's 오늘의 문장 was practiced.
//
// A home phrase is authored/derived, with no binding to a speech attempt, so the server has
// nothing to check. The device remembers the DATE the phrase was last practiced and the
// brief compares it to today's date (the home payload's local `date`). Device-local, like
// favourites and the avatar — a reinstall forgets it, which for a daily checkmark is fine.
import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.dailyBrief.v1';

let practicedDate = '';
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

/** Hydrate at boot (see app/_layout). Best-effort: a read failure just means "not today". */
export async function loadDailyBrief(): Promise<void> {
  try {
    practicedDate = (await SecureStore.getItemAsync(KEY)) ?? '';
  } catch {
    practicedDate = '';
  }
  emit();
}

/** Mark today's phrase practiced. `dateKey` is the home payload's local date (yyyy-mm-dd). */
export function markPhrasePracticed(dateKey: string): void {
  if (!dateKey || practicedDate === dateKey) return;
  practicedDate = dateKey;
  emit();
  void SecureStore.setItemAsync(KEY, dateKey).catch(() => {});
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function snapshot() {
  return practicedDate;
}

/** Whether the phrase for `dateKey` (today, per the home date) has been practiced here. */
export function usePhrasePracticed(dateKey: string): boolean {
  const d = useSyncExternalStore(subscribe, snapshot, snapshot);
  return !!dateKey && d === dateKey;
}
