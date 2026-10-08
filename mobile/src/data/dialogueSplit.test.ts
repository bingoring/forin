import {
  DOCK_H,
  GUIDED_FLOOR,
  GUIDED_THREAD,
  PIC,
  STAGE,
  STAGE_MIN,
  STAGE_TOP,
  clampChoices,
  clampGuidedThread,
  clampStage,
  stageGeometry,
} from './dialogueSplit';

// lesson-fidelity-v46 결정 5: the stage opens at the handoff's height (E 236 · D 168), and
// at those heights every position is the handoff's own number (dialogue.jsx Stage L43–55).
test('at the handoff heights the stage draws the handoff numbers', () => {
  expect(STAGE).toEqual({ free: 236, guided: 168 });
  expect(STAGE_TOP).toBe(44);
  expect(stageGeometry(236)).toEqual({ polaroidTop: 54, pictureH: 120, nameTop: 88, speakerTop: 96, scale: 1 });
  expect(stageGeometry(168)).toEqual({ polaroidTop: 38, pictureH: 92, nameTop: 60, speakerTop: 66, scale: 1 });
});

// Dragged between or past them, the positions follow the line through the two artboards.
test('between and above the artboards the stage interpolates, and the picture stops at the portrait', () => {
  const mid = stageGeometry(202);
  expect(mid.polaroidTop).toBeCloseTo(46);
  expect(mid.pictureH).toBeCloseTo(106);
  // The portrait is 118 wide (NbAvatar 64×70) → 129 tall; past that there is nothing to show.
  expect(stageGeometry(400).pictureH).toBe(PIC.max);
  expect(stageGeometry(400).polaroidTop).toBe(stageGeometry(270).polaroidTop);
});

// Smaller than D, the polaroid stays where D puts it (under the top bar is the 상황 종료
// button) and the print shrinks as a whole, ratio kept.
test('below the guided height the print scales down in place, to a floor', () => {
  const g = stageGeometry(140);
  expect(g.polaroidTop).toBe(38);
  expect(g.pictureH).toBe(140 - 76);
  expect(g.scale).toBeCloseTo(g.pictureH / 92);
  expect(stageGeometry(0).pictureH).toBe(PIC.min);
});

test('the stage cannot be dragged past what the screen can draw', () => {
  expect(clampStage(10, 874, 'free')).toBe(STAGE_MIN);
  // Free: the conversation keeps its floor (28% of the screen plus the bedside tools).
  expect(clampStage(2_000, 874, 'free')).toBe(874 - STAGE_TOP - (874 * 0.28 + DOCK_H));
  // Guided: the target card, the input and the rail need their room.
  expect(clampStage(2_000, 874, 'guided')).toBe(874 - STAGE_TOP - GUIDED_FLOOR);
  // The handoff heights themselves are always reachable on the artboard's screen.
  expect(clampStage(STAGE.free, 874, 'free')).toBe(STAGE.free);
  expect(clampStage(STAGE.guided, 874, 'guided')).toBe(STAGE.guided);
});

test('the guided message band opens at the handoff 128 and is clamped', () => {
  expect(GUIDED_THREAD).toBe(128);
  expect(clampGuidedThread(GUIDED_THREAD, 874)).toBe(128);
  expect(clampGuidedThread(0, 874)).toBe(56);
  expect(clampGuidedThread(5_000, 874)).toBe(874 * 0.4);
});

test('the choices band keeps one card readable and cannot swallow the conversation', () => {
  expect(clampChoices(10, 874)).toBe(96);
  expect(clampChoices(5_000, 874)).toBe(874 * 0.55);
});
