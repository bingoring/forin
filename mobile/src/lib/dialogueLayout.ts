// The sizes the learner set for the dialogue screen's two movable bands.
//
// Remembered, because the alternative is asking them again in every scenario. Someone who
// decided they want a small portrait and a tall conversation decided it about the app, not
// about one patient.
//
// Stored on the device, the same deliberate limit the avatar and the favourites take: a
// reinstall forgets it. A layout preference is not worth a column and a sync.
//
// Kept as POINTS rather than fractions. A fraction would move the divider when the
// keyboard changes the usable height, and the number the learner dragged to is a place on
// their screen, not a ratio.
import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'forin.dialogueLayout.v1';

export type DialogueLayout = {
  /** Where the conversation starts — the portrait/thread divider. 0 = never set, and
   *  then the screen uses its own default for the device. */
  splitTop: number;
  /** How tall the reply-choices band is. 0 = never set. */
  choicesH: number;
};

export const NOT_SET: DialogueLayout = { splitTop: 0, choicesH: 0 };

let current: DialogueLayout = NOT_SET;
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) fn();
}

export function getDialogueLayout(): DialogueLayout {
  return current;
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Reads the saved sizes. Called once at boot, alongside the avatar. */
export async function loadDialogueLayout(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return;
    const p = JSON.parse(raw) as Partial<DialogueLayout>;
    current = {
      splitTop: Number(p.splitTop) > 0 ? Number(p.splitTop) : 0,
      choicesH: Number(p.choicesH) > 0 ? Number(p.choicesH) : 0,
    };
    emit();
  } catch {
    // A corrupt value is not worth a failed launch: the screen falls back to its
    // defaults, which is what a learner who never dragged anything sees anyway.
  }
}

/** Saves one or both sizes. Called when a drag ENDS, not while it moves — a write per
 *  frame would put the keychain in the gesture's path. */
export async function setDialogueLayout(next: Partial<DialogueLayout>): Promise<void> {
  current = { ...current, ...next };
  emit();
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(current));
  } catch {
    // The size is applied for this session either way; only a relaunch would forget it.
  }
}

export function useDialogueLayout(): DialogueLayout {
  return useSyncExternalStore(subscribe, getDialogueLayout, getDialogueLayout);
}
