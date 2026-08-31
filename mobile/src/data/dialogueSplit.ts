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

// The numbers below are the screen's REAL geometry, not round figures. They were read off
// the layout: the portrait strip starts at y=128, the frame is drawn 110×130, the name
// plate and status chip under it come to ~62, and the QUICK INFO row is ~36 plus its gap.
// Guessed constants here would show up as a divider that overlaps the dock or floats a
// finger's width below the plate.

/** The portrait frame's drawn HEIGHT when there is room for it. Width follows from the
 *  frame's own ratio — see `scale` below. */
export const PORTRAIT_MAX = 130;
/** Below this it stops reading as a face, and the mood stops being legible. */
export const PORTRAIT_MIN = 72;
/** Height the name plate + status chip need under the portrait. */
const PLATE_STACKED = 62;
/** …and beside it, where they share the portrait's own height. */
const PLATE_BESIDE = 0;
/** Where the portrait strip begins: status bar, exit row and mission cluster above it. */
const TOP_INSET = 128;
/** The QUICK INFO row (차트 / 약물 / 활력) and its gap. It lives INSIDE the top band —
 *  it sits between the plate and the conversation — so leaving it out of the arithmetic
 *  would put the thread's top edge straight through the middle of it. */
export const DOCK_H = 44;
/** Breathing room below the dock. */
const BOTTOM_PAD = 10;

export type PortraitStage = 'roomy' | 'beside' | 'scaled';

export type PortraitLayout = {
  stage: PortraitStage;
  /** Drawn portrait size, square. */
  size: number;
  /** True when the name and mood sit to the right of the portrait instead of under it. */
  nameBeside: boolean;
  /** Every drawn dimension inside the frame times this. 1 unless the stage is 'scaled'. */
  scale: number;
};

/** The least height the top band can be given. Dragging past it does nothing — see
 *  clampSplit. */
export const TOP_BAND_MIN = TOP_INSET + PORTRAIT_MIN + DOCK_H + BOTTOM_PAD;
/** The height at which the band has everything it wants: full portrait, plate stacked
 *  under it, dock. Not a clamp — dragging BELOW the divider's default is allowed, and the
 *  extra room simply sits between the dock and the conversation, which is the gap the
 *  shipped design already has on a tall phone. What stops the drag is the conversation's
 *  own floor, in clampSplit. */
export const TOP_BAND_MAX = TOP_INSET + PORTRAIT_MAX + PLATE_STACKED + DOCK_H + BOTTOM_PAD;

/**
 * What the top band draws in `available` points of height.
 *
 * Stages in order of preference: keep the drawing at full size as long as possible, then
 * rearrange, and only then shrink. Rearranging is free — the row is shorter than the
 * stack — so it always comes before scaling.
 */
export function portraitLayout(available: number): PortraitLayout {
  const roomy = TOP_INSET + PORTRAIT_MAX + PLATE_STACKED + DOCK_H + BOTTOM_PAD;
  if (available >= roomy) return { stage: 'roomy', size: PORTRAIT_MAX, nameBeside: false, scale: 1 };

  const beside = TOP_INSET + PORTRAIT_MAX + PLATE_BESIDE + DOCK_H + BOTTOM_PAD;
  if (available >= beside) return { stage: 'beside', size: PORTRAIT_MAX, nameBeside: true, scale: 1 };

  // Scaling, and a floor. Clamped rather than allowed to go smaller: a 30pt face is not
  // a face. Everything drawn inside the frame is multiplied by `scale`, which is how the
  // ratio is kept — one factor, applied to every dimension, cannot distort anything.
  const size = Math.max(PORTRAIT_MIN, Math.min(PORTRAIT_MAX, available - TOP_INSET - DOCK_H - BOTTOM_PAD));
  return { stage: 'scaled', size, nameBeside: true, scale: size / PORTRAIT_MAX };
}

/** Keeps a dragged top edge inside what the screen can actually draw.
 *
 * The only ceiling is the CONVERSATION's floor. TOP_BAND_MAX was one too, and it was
 * wrong: the shipped divider rests at a percentage of the screen, so on a tall phone it
 * sits below the band's geometric need — clamping to that need would silently move the
 * divider up 39pt on an iPhone Pro Max for someone who never touched the handle.
 * Overshooting the geometric need costs nothing; it is background either way. */
export function clampSplit(top: number, screenH: number): number {
  // The conversation needs a floor of its own, or the drag could hand the whole screen
  // to a portrait and leave the learner reading one line at a time.
  const threadMin = screenH * 0.28;
  return Math.max(TOP_BAND_MIN, Math.min(top, screenH - threadMin));
}

/** The choices band's height, clamped. */
export function clampChoices(h: number, screenH: number): number {
  // A floor so one card is always readable, and a ceiling so the band cannot swallow the
  // conversation — which is exactly the complaint that started this.
  return Math.max(96, Math.min(screenH * 0.55, h));
}
