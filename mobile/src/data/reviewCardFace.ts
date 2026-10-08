// How a review card should present itself, from where it came from.
//
// Every card was drawn as a correction: the front struck through behind a red ✕, the back
// as the fix. That is right for a card made from something the learner actually said, and
// wrong for the other kind — the graded scenario also files "you could have said this"
// suggestions, and drawing one that way tells the learner they said a sentence they never
// said, and that it was wrong.
//
// The server already labels the source; only the screens had not asked.
export type CardFace = {
  /** Struck through, because it is a thing that was said badly. */
  strike: boolean;
  /** Key for the line above the front. */
  promptKey: string;
  /**
   * The badge beside the front, as a DRAWN icon.
   *
   * Not a character: ✕ renders in the pixel font at the type's weight, which is the same
   * reason the app replaced its glyph arrows — and putting it in a translation catalog
   * would ship the same mark four times under four keys.
   */
  badgeIcon: 'x' | 'bulb';
  correction: boolean;
};

export function faceOf(source: string): CardFace {
  // 'grade' is a suggestion from the end-of-scenario assessment: front is the phrase's
  // meaning, back is the phrase. Nothing was said wrong, so nothing is struck out.
  if (source === 'grade') {
    return { strike: false, promptKey: 'lab.faceSuggestPrompt', badgeIcon: 'bulb', correction: false };
  }
  // 'word' is a STEP 1 word the learner marked 헷갈려요 (v44): front is the meaning, back
  // the headword. Not said wrong — not known yet.
  if (source === 'word') {
    return { strike: false, promptKey: 'lab.faceWordPrompt', badgeIcon: 'bulb', correction: false };
  }
  // 'nuance' is the 감상 the learner left at the end of a reel (spec 2-9 §11-8): front is the
  // word, back the reel's note, the chosen chip kept as the memo. Nothing was said wrong.
  if (source === 'nuance') {
    return { strike: false, promptKey: 'lab.faceNuancePrompt', badgeIcon: 'bulb', correction: false };
  }
  // 'sentence' is a STEP 2 sentence the learner marked 아직 헷갈려요 (lesson-fidelity-v46 R5): front is
  // the meaning, back the sentence — the suggestion face, as for a word. Not said wrong.
  if (source === 'sentence') {
    return { strike: false, promptKey: 'lab.faceSentencePrompt', badgeIcon: 'bulb', correction: false };
  }
  // Anything else is treated as a correction, including sources this build has not seen:
  // a card whose origin is unknown is more safely shown as "you said this" than as advice
  // the learner never received.
  return { strike: true, promptKey: 'lab.faceSaidPrompt', badgeIcon: 'x', correction: true };
}
