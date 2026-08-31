// Where the dialogue screen's two movable edges sit, and what the top half does as it
// runs out of room.
//
// The screen is three bands: the character up top, the conversation in the middle, and —
// on a guided run — the reply choices at the bottom. The choices kept covering the
// conversation they were answers to, and no fixed fraction fixes that: how much room the
// thread needs depends on how long the exchange is, and how much the choices need depends
// on how long the sentences are. Only the person reading it knows.
//
// So both edges are draggable, and this file is the arithmetic — kept out of the screen
// so the rules can be read and tested without mounting a conversation.
//
// The top band does not just shrink. It goes through three stages, because a portrait
// squeezed to nothing with a name plate crushed under it is worse than a smaller
// portrait:
//
//   ROOMY  — portrait with its name and mood underneath, as drawn
//   BESIDE — the name and mood move to the RIGHT of the portrait; the row is shorter
//            than the stack, so this buys height without shrinking anything
//   SCALED — the portrait itself scales down, aspect ratio kept, to a floor
//
// The floor matters: below it the face stops reading as a face, and the mood — which is
// the whole reason the portrait is there — stops being legible.

/** The portrait's drawn size when there is room for it. */
export const PORTRAIT_MAX = 150;
/** Below this it stops reading as a face, and the mood stops being legible. */
export const PORTRAIT_MIN = 72;
/** Height the name + mood plate needs under the portrait. */
const PLATE_STACKED = 54;
/** …and beside it, where it shares the portrait's own height. */
const PLATE_BESIDE = 0;
/** Breathing room above the portrait (status bar inset) and below the plate. */
const TOP_INSET = 52;
const BOTTOM_PAD = 10;

export type PortraitStage = 'roomy' | 'beside' | 'scaled';

export type PortraitLayout = {
  stage: PortraitStage;
  /** Drawn portrait size, square. */
  size: number;
  /** True when the name and mood sit to the right of the portrait instead of under it. */
  nameBeside: boolean;
};

/** The least height the top band can be given. Dragging past it does nothing — see
 *  clampSplit. */
export const TOP_BAND_MIN = TOP_INSET + PORTRAIT_MIN + BOTTOM_PAD;
/** …and the most, past which the conversation would have no room worth having. */
export const TOP_BAND_MAX = TOP_INSET + PORTRAIT_MAX + PLATE_STACKED + BOTTOM_PAD;

/**
 * What the top band draws in `available` points of height.
 *
 * Stages in order of preference: keep the drawing at full size as long as possible, then
 * rearrange, and only then shrink. Rearranging is free — the row is shorter than the
 * stack — so it always comes before scaling.
 */
export function portraitLayout(available: number): PortraitLayout {
  const roomy = TOP_INSET + PORTRAIT_MAX + PLATE_STACKED + BOTTOM_PAD;
  if (available >= roomy) return { stage: 'roomy', size: PORTRAIT_MAX, nameBeside: false };

  const beside = TOP_INSET + PORTRAIT_MAX + PLATE_BESIDE + BOTTOM_PAD;
  if (available >= beside) return { stage: 'beside', size: PORTRAIT_MAX, nameBeside: true };

  // Scaling, with the aspect ratio kept (the portrait is square, so one number does it)
  // and a floor. Clamped rather than allowed to go smaller: a 30pt face is not a face.
  const size = Math.max(PORTRAIT_MIN, Math.min(PORTRAIT_MAX, available - TOP_INSET - BOTTOM_PAD));
  return { stage: 'scaled', size, nameBeside: true };
}

/** Keeps a dragged top edge inside what the screen can actually draw. */
export function clampSplit(top: number, screenH: number): number {
  // The conversation needs a floor of its own, or the drag could hand the whole screen
  // to a portrait and leave the learner reading one line at a time.
  const threadMin = screenH * 0.28;
  return Math.max(TOP_BAND_MIN, Math.min(TOP_BAND_MAX, Math.min(top, screenH - threadMin)));
}

/** The choices band's height, clamped. */
export function clampChoices(h: number, screenH: number): number {
  // A floor so one card is always readable, and a ceiling so the band cannot swallow the
  // conversation — which is exactly the complaint that started this.
  return Math.max(96, Math.min(screenH * 0.55, h));
}
