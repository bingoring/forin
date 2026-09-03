// The portrait an NPC wears (핸드오프 v34 · NPC 통합 원칙).
//
// The handoff ships 12 NPC PRESETS, but there are hundreds of scenarios, so a preset per
// NPC would put the same twelve faces on every ward. Instead a preset is a ROLE TEMPLATE:
//
//   role       → what the person IS: their uniform, role headwear, role prop.
//   seed       → who the person is: skin, hair, hair colour, background — so two patients
//                are two different people, stable per (scenario, name).
//   expression → how they feel right now: eyes and mouth.
//
// Twelve role templates × an open seed = a different face for every situation, which is
// what "상황이 얼마나 많은데 프리셋 12개로 해" asked for. Every key here is a real
// NbAvatar key, so a portrait built this way is drawable and validates server-side like
// any other spec (domain/avatar).
import {
  avatarSpecFromSeed, type AvatarSpec, type EyeKey, type MouthKey,
} from '@/data/nbAvatar';
import type { RoleKind } from '@engine';

/** The scenario persona's mood vocabulary — the server's Expression union. */
export type NpcExpression =
  | 'neutral' | 'derp' | 'happy' | 'sad' | 'worried' | 'pain'
  | 'surprised' | 'angry' | 'thinking' | 'sleepy' | 'panic' | 'focused' | 'shy';

/**
 * The role axis: only the fields the role FIXES. Everything omitted comes from the seed
 * (skin/hair/hairColor/bg/outfitColor) or the default (hat/acc none), so a paramedic does
 * not inherit a random party hat and a patient keeps their own hair.
 *
 * Drawn from the handoff's 12 presets (forin Notebook - Avatar.html · NPCS): the outfit,
 * the role headwear and the one prop that says the job. `hair: 'none'` is set where the
 * head is covered (surgeon's cap, coverall's hood) so the seed's hair is not drawn under
 * a mask.
 */
const ROLE_TEMPLATE: Record<RoleKind, Partial<AvatarSpec>> = {
  patient: { outfit: 'hospitalGown', acc: 'cannula' },
  doctor: { outfit: 'labCoat', acc: 'stetho' },
  nurse: { outfit: 'scrubPocket', acc: 'badge' },
  // 'bald' is this app's equivalent of the preset's hair:'none' — the head is covered
  // by the cap and mask, so nothing should be drawn under them.
  surgeon: { outfit: 'surgGown', hat: 'scrubCap', acc: 'maskOn', hair: 'bald' },
  paramedic: { outfit: 'paramedic' },
  police: { outfit: 'security', hat: 'securityCap' },
  pharmacist: { outfit: 'labCoat', acc: 'glassesSquare' },
  parent: { outfit: 'cardigan' },
  visitor: { outfit: 'suit' },
  child: { outfit: 'tshirt' },
};

/**
 * How a mood shows on the face. Empty for `neutral` and `derp` — the default dot eyes and
 * line mouth ARE neutral, and overriding them would make "no particular feeling" a face
 * of its own.
 */
const FACE: Record<NpcExpression, { eyes?: EyeKey; mouth?: MouthKey }> = {
  neutral: {},
  derp: {},
  happy: { eyes: 'happy', mouth: 'smile' },
  sad: { eyes: 'droopy', mouth: 'frown' },
  worried: { eyes: 'worried', mouth: 'frown' },
  pain: { eyes: 'weary', mouth: 'pain' },
  surprised: { eyes: 'round', mouth: 'o' },
  angry: { eyes: 'angry', mouth: 'clench' },
  thinking: { eyes: 'side', mouth: 'hmm' },
  sleepy: { eyes: 'sleepy' },
  panic: { eyes: 'round', mouth: 'o' },
  focused: { eyes: 'brow', mouth: 'line' },
  shy: { eyes: 'happy', mouth: 'pout' },
};

/**
 * The full portrait for an NPC.
 *
 * `seed` should be stable for one NPC across a conversation — the persona's name plus the
 * scenario id — so their face does not change turn to turn. `expression` is the current
 * mood; omit it and the role's resting face (dot/line, plus the role prop) shows.
 */
export function npcAvatarSpec(role: RoleKind, seed: string, expression?: NpcExpression): AvatarSpec {
  const person = avatarSpecFromSeed(seed);
  const spec: AvatarSpec = {
    // Start from a plain face (hat/acc none, dot/line), so anything the role and the
    // seed do not set stays neutral rather than random.
    skin: person.skin, hair: person.hair, hairColor: person.hairColor,
    eyes: 'dot', mouth: 'line', outfit: 'scrubV', outfitColor: person.outfitColor,
    hat: 'none', bg: person.bg, acc: 'none',
  };
  // Role wins over the seed (uniform, headwear, prop), then the mood wins over both
  // (eyes, mouth). The seed only ever touched the personal axes above.
  Object.assign(spec, ROLE_TEMPLATE[role]);
  if (expression) Object.assign(spec, FACE[expression]);
  return spec;
}
