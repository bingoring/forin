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

// v2 (lesson-fidelity-v46 결정 5): v1 held the old divider — a point ~400 down a screen
// whose stage was a wash of 41% — which means nothing on the handoff's 236/168 stage.
// A fresh key so everyone opens on the handoff heights; the old value is left unread.
const KEY = 'forin.dialogueLayout.v2';

export type DialogueLayout = {
  /** The stage's height on the free run (E). 0 = never set → the handoff's 236. */
  stageFree: number;
  /** …and on the guided run (D). 0 = never set → the handoff's 168. Separate, because the
   *  handoff gives the two runs different stages. */
  stageGuided: number;
  /** The guided run's message band (D). 0 = never set → the handoff's 128. */
  threadGuided: number;
  /** How tall the reply-choices band is. 0 = never set. */
  choicesH: number;
};

const FIELDS = ['stageFree', 'stageGuided', 'threadGuided', 'choicesH'] as const;

export const NOT_SET: DialogueLayout = { stageFree: 0, stageGuided: 0, threadGuided: 0, choicesH: 0 };

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
    const next = { ...NOT_SET };
    for (const f of FIELDS) next[f] = Number(p[f]) > 0 ? Number(p[f]) : 0;
    current = next;
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
