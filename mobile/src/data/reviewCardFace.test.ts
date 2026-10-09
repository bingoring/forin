import { faceOf } from '@/data/reviewCardFace';

test('a correction is struck through — it is a thing that was said', () => {
  const f = faceOf('correction');
  expect(f.strike).toBe(true);
  expect(f.correction).toBe(true);
  // A drawn icon, not a ✕ character: the catalog ratchet exists to keep marks like that
  // out of translated strings, and the badge is a mark.
  expect(f.badgeIcon).toBe('x');
});

test('a suggestion is not', () => {
  // The bug: a graded scenario's "you could have said this" was drawn struck through
  // behind a red ✕, which tells the learner they said a sentence they never said and that
  // it was wrong.
  const f = faceOf('grade');
  expect(f.strike).toBe(false);
  expect(f.correction).toBe(false);
  expect(f.promptKey).not.toBe(faceOf('correction').promptKey);
  expect(f.badgeIcon).toBe('bulb');
});

test('an unknown source is shown as a correction', () => {
  // Safer of the two mistakes: "you said this" about a real utterance beats presenting a
  // sentence as advice the learner never got.
  expect(faceOf('something-new').strike).toBe(true);
  expect(faceOf('').strike).toBe(true);
});

test('a confused STEP 1 word is drawn as advice, never as something said wrong', () => {
  const f = faceOf('word');
  expect(f.strike).toBe(false);
  expect(f.correction).toBe(false);
  expect(f.promptKey).toBe('lab.faceWordPrompt');
});

// 문장 릴의 감상(스펙 2-9 §11-8) — 틀리게 말한 것이 아니므로 취소선 없는 제안 면이다.
test('a reel 감상 card is a suggestion, not a correction', () => {
  const f = faceOf('nuance');
  expect(f.strike).toBe(false);
  expect(f.correction).toBe(false);
  expect(f.promptKey).toBe('lab.faceNuancePrompt');
});

// STEP 2 문장 '아직 헷갈려요'(lesson-fidelity-v46 R5) — 단어처럼 제안 면, 취소선 없음.
test('a confused STEP 2 sentence is drawn as advice, never as something said wrong', () => {
  const f = faceOf('sentence');
  expect(f.strike).toBe(false);
  expect(f.correction).toBe(false);
  expect(f.badgeIcon).toBe('bulb');
  expect(f.promptKey).toBe('lab.faceSentencePrompt');
});
