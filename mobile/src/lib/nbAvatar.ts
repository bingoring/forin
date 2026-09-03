// The learner's own portrait, as shared state.
//
// A module store with a subscribe/snapshot pair rather than a prop: the portrait is
// drawn on the profile pass, the colleague list's own row, the lounge card for your
// own post and the picker's live preview. Threading it through those would mean four
// call sites remembering to pass it, and the one that forgot would silently draw
// somebody else's face.
//
// Read through useMyAvatar(), never by calling myAvatar() during a render: this is
// module state, and the React Compiler is entitled to compute a plain read once per
// component instance and never again.
//
// Two values, deliberately:
//
//   · `chosen` — what the learner picked, from the server. null = never opened the
//     picker, which is NOT the same as the default face.
//   · the EFFECTIVE spec — `chosen`, or a face seeded from the user id. That seed is
//     the "최초에는 랜덤" requirement, and deriving it (rather than writing a random
//     spec at sign-up) is why every account has a face on every device with no extra
//     write and no backfill.
import { api } from '@/api/client';
import { avatarSpecFromSeed, normalizeAvatarSpec, type AvatarSpec } from '@/data/nbAvatar';

let chosen: AvatarSpec | null = null;
let seedID = '';
/** Recomputed on every change so the snapshot is referentially stable — returning a
 *  fresh object per read makes useSyncExternalStore re-render forever. */
let effective: AvatarSpec | null = null;
const listeners = new Set<() => void>();

function recompute() {
  effective = chosen ?? (seedID ? avatarSpecFromSeed(seedID) : null);
  for (const l of listeners) l();
}

export function myAvatar(): AvatarSpec | null {
  return effective;
}

export function subscribeMyAvatar(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True when the learner has actually chosen a face — the picker says so. */
export function hasChosenAvatar(): boolean {
  return chosen !== null;
}

/**
 * Adopt what /me returned. Called wherever the profile is already being read, so the
 * portrait costs no extra request.
 *
 * `userID` matters as much as the spec: without it there is no seed, and a learner
 * who never opened the picker would have no face at all.
 */
export function adoptAvatar(userID: string, raw: unknown): void {
  seedID = userID || seedID;
  chosen = raw ? normalizeAvatarSpec(raw) : null;
  recompute();
}

/**
 * Save a chosen face.
 *
 * Applied locally FIRST and reconciled with the server's answer: the picker's whole
 * interaction is tapping a cell and seeing the preview change, and waiting a round
 * trip for that reads as a dropped tap. A failed write is re-thrown so the screen
 * can say so — and the local value stays, because the learner is still looking at
 * the face they picked.
 */
export async function saveAvatar(spec: AvatarSpec): Promise<void> {
  chosen = spec;
  recompute();
  const stored = await api.setAvatar(spec);
  if (stored) {
    chosen = stored;
    recompute();
  }
}

/** Sign-out: the next account must not inherit this face. */
export function clearAvatar(): void {
  chosen = null;
  seedID = '';
  recompute();
}
