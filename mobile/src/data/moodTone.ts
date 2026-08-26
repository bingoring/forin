// How an NPC mood looks: the colour its speech bubble is outlined in, and whether the
// portrait shows distress.
//
// One module because the bubble border, the portrait expression and the distress cue
// are three views of ONE fact. When they were derived separately the face could say
// worried while the border said calm, and a reader trusts whichever they noticed
// first.
import { colors } from '@/theme/tokens';
import type { Expression } from '@engine';

/** The moods the server can send — exactly the drawable Expression union. Kept as a
 *  const array (not just a type) so the runtime can reject anything else: a mood the
 *  portrait cannot draw would leave the face neutral while the border changed. */
export const MOODS = [
  'neutral', 'derp', 'happy', 'sad', 'worried', 'pain',
  'surprised', 'angry', 'thinking', 'sleepy', 'panic', 'focused', 'shy',
] as const;

export type Mood = (typeof MOODS)[number];

const MOOD_SET = new Set<string>(MOODS);

/** Narrows a mood string from the wire, or undefined when it is not one we draw. */
export function asMood(raw?: string): Mood | undefined {
  return raw && MOOD_SET.has(raw) ? (raw as Mood) : undefined;
}

/** The bubble's outline colour.
 *
 *  Three bands rather than thirteen colours: the border is peripheral vision while
 *  the learner reads the words, and thirteen hues there would be noise. Distress is
 *  the app's red, unsettled its peach (the NPC's own bubble colour, deepened), and
 *  relief its mint — the same three tones every score band in the app already uses,
 *  so a red border reads as "not good" without being taught. */
export function moodBorder(mood?: Mood): string {
  switch (mood) {
    case 'panic':
    case 'pain':
    case 'angry':
      return colors.red;
    case 'sad':
    case 'worried':
    case 'surprised':
    case 'shy':
      return colors.peachShadow;
    case 'happy':
      return colors.mintShadow;
    // neutral, derp, thinking, focused, sleepy — and an unknown mood — keep the ink
    // outline every other bubble has. "Nothing notable" must look like the default,
    // not like a fourth state.
    default:
      return colors.ink;
  }
}

/** The portrait expression for a mood. Identity where the names line up, which is
 *  every case — the server's vocabulary IS this union. Undefined leaves the face on
 *  the scenario's authored mood rather than resetting it to neutral. */
export function moodExpression(mood?: Mood): Expression | undefined {
  return mood;
}

/** Whether the portrait shows the distress cue (the 💧 sweat drop). Physical pain and
 *  panic, not sadness: the cue reads as "under stress right now". */
export function moodShowsSweat(mood?: Mood): boolean {
  return mood === 'pain' || mood === 'panic' || mood === 'worried';
}
