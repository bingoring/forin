// Subscribe to the player's saved portrait.
//
// A hook rather than a prop drilled from the root: FacePlayer turns up in the profile
// card, the home greeting, the dialogue player frame and the map. Threading the avatar
// through all of those would mean four call sites remembering to pass it, and the one
// that forgot would silently draw the default face.
import { useSyncExternalStore } from 'react';
import { getAvatar, subscribeAvatar, type Avatar } from '@/lib/avatar';

export function useAvatar(): Avatar {
  return useSyncExternalStore(subscribeAvatar, getAvatar, getAvatar);
}
