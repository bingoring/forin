// The player's own portrait, as data.
//
// FacePlayer used to hardcode `kind="nurse" hair="#3C2A18"`, so every learner wore
// the same face while the Face renderer already accepted hairStyle, hair, skin and
// scrub colour for NPCs. Making the player's four parameters storable is the whole
// of "a profile that looks like me" — the renderer needed nothing.
//
// Stored on the device, not the server. That is a deliberate limit and worth naming:
// a reinstall resets the portrait, and colleagues cannot see it. Both would need a
// profile column, and the avatar is not yet something anyone else looks at.
import * as SecureStore from 'expo-secure-store';
import type { HairStyle } from '@engine';

export type Avatar = {
  hairStyle: HairStyle;
  hair: string;
  skin: string;
  scrub: string;
};

// The choices offered in the builder. Deliberately a short list per axis: a colour
// wheel invites a purple-skinned nurse, and these are pixel plates drawn for a
// limited palette — arbitrary values read as mistakes rather than as expression.
export const HAIR_STYLES: HairStyle[] = [
  'short', 'long', 'bob', 'ponytail', 'pigtails', 'bun', 'curly', 'balding', 'bald',
];

export const HAIR_COLORS = ['#1B1B1B', '#3C2A18', '#6B4A2F', '#A9743F', '#C9A227', '#8A8A8A', '#E8E4DC'];

// Six tones spanning the range the plates render legibly. Not a gradient picker:
// six choices someone can actually see themselves in beats a million they cannot.
export const SKIN_TONES = ['#FBE3C8', '#F8D7B2', '#E8B584', '#C68642', '#8D5524', '#5C3317'];

// Scrub colours a hospital actually issues.
export const SCRUB_COLORS = ['#A7F3D0', '#BAE6FD', '#DDD6FE', '#FBCFE8', '#FDE68A', '#CBD5E1'];

export const DEFAULT_AVATAR: Avatar = {
  hairStyle: 'short',
  hair: '#3C2A18',
  skin: '#F8D7B2',
  scrub: '#A7F3D0',
};

const KEY = 'forin.avatar';

let current: Avatar = DEFAULT_AVATAR;
const listeners = new Set<() => void>();

export function getAvatar(): Avatar {
  return current;
}

export function subscribeAvatar(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Read the saved portrait. Call once at startup. */
export async function loadAvatar(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (raw) current = sanitize(JSON.parse(raw) as Partial<Avatar>);
  } catch {
    current = DEFAULT_AVATAR; // corrupt or absent → the default face, never a crash
  }
  for (const l of listeners) l();
}

export async function setAvatar(next: Partial<Avatar>): Promise<void> {
  current = sanitize({ ...current, ...next });
  for (const l of listeners) l();
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(current));
  } catch {
    /* the in-memory value still applies for this session */
  }
}

/**
 * Keep only values the renderer draws.
 *
 * Stored JSON is not trusted input in the security sense, but it IS input from a
 * previous version of this file — an axis that gains or loses an option would
 * otherwise leave a face that renders as nothing at all.
 */
function sanitize(a: Partial<Avatar>): Avatar {
  return {
    hairStyle: HAIR_STYLES.includes(a.hairStyle as HairStyle) ? (a.hairStyle as HairStyle) : DEFAULT_AVATAR.hairStyle,
    hair: HAIR_COLORS.includes(a.hair ?? '') ? a.hair! : DEFAULT_AVATAR.hair,
    skin: SKIN_TONES.includes(a.skin ?? '') ? a.skin! : DEFAULT_AVATAR.skin,
    scrub: SCRUB_COLORS.includes(a.scrub ?? '') ? a.scrub! : DEFAULT_AVATAR.scrub,
  };
}
