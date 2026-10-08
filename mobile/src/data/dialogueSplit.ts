// Where the dialogue screen's movable edges sit, and what the stage draws at each height.
//
// lesson-fidelity-v46 결정 5: the stage is the handoff's (dialogue.jsx Stage, L41–58) —
// a fixed `#F6E3DC` band under the status bar, 236 tall on the free run (E) and 168 on the
// guided run (D, `short`), the polaroid centred, the name plate and mood tag on the LEFT,
// the speaker on the RIGHT. What we keep from before is that the learner can drag the
// edge: the stage OPENS at the handoff's height and follows the finger from there.
//
// The handoff gives two artboards, so it fixes two points for every position inside the
// stage. Between and above them the positions follow the straight line through those two
// points (an interpolation — not a handoff value); below D the polaroid stays where D puts
// it and the print scales down as a whole.
//
// Kept out of the screen so the rules can be read and tested without mounting a
// conversation.

/** Where the stage starts: under the artboard's 44pt status bar (dialogue.jsx L81 `top: 44`). */
export const STAGE_TOP = 44;
/** The handoff stage heights: E (free) 236, D (guided, `short`) 168 — dialogue.jsx L43. */
export const STAGE = { free: 236, guided: 168 } as const;
export type StageMode = keyof typeof STAGE;

/** The print: D 92 tall, E 120 (L47); the portrait is 118 wide, and NbAvatar's 64×70 box
 *  makes it 129 tall, which is all there is to show. Below `min` it stops reading as a face. */
export const PIC = { guided: 92, free: 120, max: 129, min: 48, w: 118 } as const;

export type StageGeometry = {
  /** Polaroid's top inside the stage (L44: D 38 · E 54). */
  polaroidTop: number;
  /** The print's height (L47: D 92 · E 120). */
  pictureH: number;
  /** Name plate + mood tag block's top (L50: D 60 · E 88). */
  nameTop: number;
  /** Speaker button's top (L54: D 66 · E 96). */
  speakerTop: number;
  /** The whole print's scale — 1 unless the stage is smaller than D. */
  scale: number;
};

const SPAN = STAGE.free - STAGE.guided; // 68
/** Past this the print is the whole portrait, and growing further only adds space below. */
const T_MAX = (PIC.max - PIC.guided) / (PIC.free - PIC.guided);
/** D's room under the polaroid (168 − 38 − 8 − 92 − 4) — kept as the stage shrinks below D. */
const UNDER = STAGE.guided - 38 - 8 - PIC.guided - 4;

export function stageGeometry(h: number): StageGeometry {
  if (h <= STAGE.guided) {
    const pictureH = Math.max(PIC.min, h - 38 - 8 - 4 - UNDER);
    return { polaroidTop: 38, pictureH, nameTop: 60, speakerTop: 66, scale: Math.min(1, pictureH / PIC.guided) };
  }
  const t = Math.min(T_MAX, (h - STAGE.guided) / SPAN);
  return {
    polaroidTop: 38 + 16 * t,
    pictureH: Math.min(PIC.max, PIC.guided + (PIC.free - PIC.guided) * t),
    nameTop: 60 + 28 * t,
    speakerTop: 66 + 30 * t,
    scale: 1,
  };
}

/** The QUICK INFO row (차트 / 약물 / 활력) and the grabber above it — they belong to the
 *  conversation column, so its floor has to leave room for them. */
export const DOCK_H = 44;
/** The least stage: the shrunken print plus the name block still fit. */
export const STAGE_MIN = 124;
/** What the guided column needs under the stage: grabber ① 19, tools ~30, the message
 *  band at its 56 floor, grabber ② 19, the target card + switch + mic ~308, the rail ~40 and
 *  the 22 under it. On a short phone (667) this caps the stage below the handoff's 168, so
 *  the rail never runs off the bottom; on the artboard's 874 the cap is far above it. */
export const GUIDED_FLOOR = 500;

/** Keeps a dragged stage height inside what the screen can draw. */
export function clampStage(h: number, screenH: number, mode: StageMode): number {
  const floor = mode === 'guided' ? GUIDED_FLOOR : screenH * 0.28 + DOCK_H;
  return Math.max(STAGE_MIN, Math.min(h, screenH - STAGE_TOP - floor));
}

/** D's message band: fixed at 128 in the handoff (dialogue.jsx L122), resizable by the
 *  grabber under it. */
export const GUIDED_THREAD = 128;

export function clampGuidedThread(h: number, screenH: number): number {
  return Math.max(56, Math.min(screenH * 0.4, h));
}

/** The reply-choices band's height (the no-sentence guided pass), clamped. */
export function clampChoices(h: number, screenH: number): number {
  // A floor so one card is always readable, and a ceiling so the band cannot swallow the
  // conversation — which is exactly the complaint that started this.
  return Math.max(96, Math.min(screenH * 0.55, h));
}
