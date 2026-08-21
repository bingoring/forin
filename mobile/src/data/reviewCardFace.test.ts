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
