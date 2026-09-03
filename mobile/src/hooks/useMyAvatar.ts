// Subscribe to the learner's own portrait.
//
// useSyncExternalStore, not a plain module read: the store is module state, and a
// direct read during render is computed once per component instance under the React
// Compiler and then never updates (theme/README's standing lesson — see
// lib/nbAvatar.ts).
import { useSyncExternalStore } from 'react';
import { myAvatar, subscribeMyAvatar } from '@/lib/nbAvatar';
import type { AvatarSpec } from '@/data/nbAvatar';

/** null until /me has been read — the caller draws nothing rather than a wrong face. */
export function useMyAvatar(): AvatarSpec | null {
  return useSyncExternalStore(subscribeMyAvatar, myAvatar, myAvatar);
}
