// The portrait, as data (핸드오프 v32 · NbAvatar 에셋 시스템).
//
// Ten axes, each a short list of named keys — skin, hair style, hair colour, eyes,
// mouth, outfit, outfit colour, hat, background, accessory. The drawings live in
// components/nb/NbAvatar.tsx; this module owns the KEYS, and the drawing maps there
// are typed `Record<…Key, …>` so a key added here without a drawing is a compile
// error rather than a picker cell that renders nothing.
//
// Named keys rather than hex values: the spec is stored on the server and read back
// by other people's screens, so it has to survive a palette revision. `#B8CBB0` in a
// database is a colour nobody can rename; `sage` is one line of Go and one of TS.
//
// This replaces the device-local pixel avatar (lib/avatar.ts): that one reset on
// reinstall and nobody but its owner could see it, which is exactly what a lounge
// feed full of other people's posts needs to be able to do.
export const SKIN_KEYS = ['pale', 'ivory', 'beige', 'tan', 'warm', 'olive', 'brown', 'deep'] as const;

/** 19 styles. Back hair and front hair are matched by the SAME key — see NbAvatar. */
export const HAIR_KEYS = [
  'short', 'part', 'midPart', 'buzz', 'curlyShort', 'bob', 'ponytail', 'bun', 'twintails',
  'longStraight', 'curlyLong', 'wavyMid', 'wavyLong', 'fringe', 'spiky', 'afro', 'braid',
  'baldFringe', 'bald',
] as const;

/** Includes dyed points (red/pink/mint) on purpose: the set has to cover a photo. */
export const HAIR_COLOR_KEYS = [
  'black', 'darkbrown', 'brown', 'lightbrown', 'blonde', 'ash', 'gray', 'white',
  'red', 'navy', 'pink', 'mint',
] as const;

export const EYE_KEYS = [
  'dot', 'lash', 'happy', 'closed', 'round', 'sleepy', 'wink', 'uu', 'side', 'sparkle',
  'droopy', 'brow',
] as const;

export const MOUTH_KEYS = [
  'line', 'smile', 'grin', 'laugh', 'pout', 'o', 'wave', 'smirk', 'tongue', 'frown',
  'teeth', 'hmm',
] as const;

export const OUTFIT_KEYS = [
  'scrubV', 'scrubPocket', 'dress', 'labCoat', 'surgGown', 'isoGown', 'polo', 'knit',
  'hoodie', 'shirt', 'tshirt', 'apron',
] as const;

export const OUTFIT_COLOR_KEYS = [
  'sage', 'navy', 'burgundy', 'lilac', 'sky', 'peach', 'charcoal', 'mint', 'yellow',
  'rose', 'white', 'teal',
] as const;

export const HAT_KEYS = [
  'none', 'nurseCap', 'scrubCap', 'scrubCapDot', 'beanie', 'cap', 'gradCap', 'party',
  'beret', 'headband', 'bandana',
] as const;

export const BG_KEYS = [
  'plain', 'lines', 'grid', 'washSky', 'washPink', 'washMint', 'washYellow', 'window',
  'stripe', 'stamps', 'dots',
] as const;

export const ACC_KEYS = [
  'none', 'stetho', 'badge', 'glassesRound', 'glassesSquare', 'earring', 'maskChin',
  'maskOn', 'plaster', 'earphones', 'blush', 'freckles',
] as const;

export type SkinKey = typeof SKIN_KEYS[number];
export type HairKey = typeof HAIR_KEYS[number];
export type HairColorKey = typeof HAIR_COLOR_KEYS[number];
export type EyeKey = typeof EYE_KEYS[number];
export type MouthKey = typeof MOUTH_KEYS[number];
export type OutfitKey = typeof OUTFIT_KEYS[number];
export type OutfitColorKey = typeof OUTFIT_COLOR_KEYS[number];
export type HatKey = typeof HAT_KEYS[number];
export type BgKey = typeof BG_KEYS[number];
export type AccKey = typeof ACC_KEYS[number];

export type AvatarSpec = {
  skin: SkinKey;
  hair: HairKey;
  hairColor: HairColorKey;
  eyes: EyeKey;
  mouth: MouthKey;
  outfit: OutfitKey;
  outfitColor: OutfitColorKey;
  hat: HatKey;
  bg: BgKey;
  acc: AccKey;
};

/** The picker's rows, in the order they are drawn. */
export const AVATAR_AXES = [
  { key: 'skin', labelKey: 'avatar.axisSkin', options: SKIN_KEYS },
  { key: 'hair', labelKey: 'avatar.axisHair', options: HAIR_KEYS },
  { key: 'hairColor', labelKey: 'avatar.axisHairColor', options: HAIR_COLOR_KEYS },
  { key: 'eyes', labelKey: 'avatar.axisEyes', options: EYE_KEYS },
  { key: 'mouth', labelKey: 'avatar.axisMouth', options: MOUTH_KEYS },
  { key: 'outfit', labelKey: 'avatar.axisOutfit', options: OUTFIT_KEYS },
  { key: 'outfitColor', labelKey: 'avatar.axisOutfitColor', options: OUTFIT_COLOR_KEYS },
  { key: 'hat', labelKey: 'avatar.axisHat', options: HAT_KEYS },
  { key: 'acc', labelKey: 'avatar.axisAcc', options: ACC_KEYS },
  { key: 'bg', labelKey: 'avatar.axisBg', options: BG_KEYS },
] as const satisfies readonly { key: keyof AvatarSpec; labelKey: string; options: readonly string[] }[];

/** The face a spec falls back to, axis by axis, when a stored value is unknown. */
export const DEFAULT_AVATAR_SPEC: AvatarSpec = {
  skin: 'beige', hair: 'short', hairColor: 'darkbrown', eyes: 'dot', mouth: 'line',
  outfit: 'scrubV', outfitColor: 'sage', hat: 'none', bg: 'plain', acc: 'none',
};

const LISTS: { [K in keyof AvatarSpec]: readonly AvatarSpec[K][] } = {
  skin: SKIN_KEYS, hair: HAIR_KEYS, hairColor: HAIR_COLOR_KEYS, eyes: EYE_KEYS,
  mouth: MOUTH_KEYS, outfit: OUTFIT_KEYS, outfitColor: OUTFIT_COLOR_KEYS, hat: HAT_KEYS,
  bg: BG_KEYS, acc: ACC_KEYS,
};

/**
 * Whatever crossed the network, made drawable.
 *
 * Per AXIS, not all-or-nothing: a spec whose `hat` was retired in a later release
 * still has a face, a hairstyle and a uniform the learner chose. Dropping the whole
 * spec for one unknown value would silently reset somebody's portrait.
 */
export function normalizeAvatarSpec(raw: unknown): AvatarSpec {
  const src = (raw ?? {}) as Partial<Record<keyof AvatarSpec, unknown>>;
  const out = { ...DEFAULT_AVATAR_SPEC };
  for (const axis of Object.keys(LISTS) as (keyof AvatarSpec)[]) {
    const value = src[axis];
    if (typeof value === 'string' && (LISTS[axis] as readonly string[]).includes(value)) {
      // The cast is what the `includes` above just proved.
      (out as Record<string, string>)[axis] = value;
    }
  }
  return out;
}

/**
 * A face from a string — the same string always gives the same face.
 *
 * This is what every learner starts with (핸드오프 요구: 최초에는 랜덤). Derived from
 * the user id rather than written at sign-up, so:
 *   · a new account has a face the moment it exists, with no extra write;
 *   · every device shows the same one, which a `Math.random()` at first paint would not;
 *   · colleagues and lounge posts can draw an author who never opened the picker.
 *
 * Hats and accessories skew empty (a third and a half of the time) because a random
 * party hat on a nurse's staff pass reads as a bug, not as a choice.
 */
export function avatarSpecFromSeed(seed: string): AvatarSpec {
  // djb2. Cheap, stable, and — unlike summing char codes — it does not give two
  // anagram ids the same face.
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
  let state = h >>> 0 || 1;
  const next = () => {
    // xorshift32: one multiply-free step per axis, and never returns to 0.
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    return state;
  };
  const pick = <T,>(list: readonly T[]) => list[next() % list.length];

  return {
    skin: pick(SKIN_KEYS),
    hair: pick(HAIR_KEYS),
    hairColor: pick(HAIR_COLOR_KEYS),
    eyes: pick(EYE_KEYS),
    mouth: pick(MOUTH_KEYS),
    outfit: pick(OUTFIT_KEYS),
    outfitColor: pick(OUTFIT_COLOR_KEYS),
    hat: next() % 3 === 0 ? pick(HAT_KEYS) : 'none',
    bg: pick(BG_KEYS),
    acc: next() % 2 === 0 ? pick(ACC_KEYS) : 'none',
  };
}

/** 주사위 — a fresh face on demand. Not seeded: the point is that it changes. */
export function randomAvatarSpec(): AvatarSpec {
  return avatarSpecFromSeed(`${Math.random()}`);
}
