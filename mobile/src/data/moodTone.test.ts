// The bubble border, the portrait and the distress cue are three views of one fact.
// When they were derived separately the face could say worried while the border said
// calm, and a reader trusts whichever they noticed first.
import { asMood, MOODS, moodBorder, moodExpression, moodShowsSweat } from './moodTone';
import { colors } from '@/theme/tokens';

test('every mood the server can send is one the portrait draws', () => {
  // Mirrors the server's vocabulary (conversation/mood.go moodRank) and the app's
  // Expression union. If the three ever disagree, one of them renders nothing.
  expect([...MOODS].sort()).toEqual([
    'angry', 'derp', 'focused', 'happy', 'neutral', 'pain',
    'panic', 'sad', 'shy', 'sleepy', 'surprised', 'thinking', 'worried',
  ]);
});

test('a mood we cannot draw is rejected rather than passed through', () => {
  expect(asMood('worried')).toBe('worried');
  // The server aliases these away, but a version skew must not paint a blank face.
  expect(asMood('anxious')).toBeUndefined();
  expect(asMood('')).toBeUndefined();
  expect(asMood(undefined)).toBeUndefined();
});

test('distress is red, unsettled is peach, relief is mint', () => {
  for (const m of ['panic', 'pain', 'angry'] as const) expect(moodBorder(m)).toBe(colors.red);
  for (const m of ['sad', 'worried', 'surprised', 'shy'] as const) expect(moodBorder(m)).toBe(colors.peachShadow);
  expect(moodBorder('happy')).toBe(colors.mintShadow);
});

test('nothing notable looks like the default, not a fourth state', () => {
  // A neutral turn must not announce itself: the border is peripheral vision while
  // the learner reads the words.
  for (const m of ['neutral', 'derp', 'thinking', 'focused', 'sleepy'] as const) {
    expect(moodBorder(m)).toBe(colors.ink);
  }
  expect(moodBorder(undefined)).toBe(colors.ink);
});

test('an absent mood leaves the face alone rather than resetting it', () => {
  // The scenario authored a mood; a turn the model did not tag must not wipe it to
  // neutral, which would read as the patient going blank.
  expect(moodExpression(undefined)).toBeUndefined();
  expect(moodExpression('pain')).toBe('pain');
});

test('the distress cue is for stress happening now', () => {
  expect(moodShowsSweat('pain')).toBe(true);
  expect(moodShowsSweat('panic')).toBe(true);
  expect(moodShowsSweat('worried')).toBe(true);
  // Sadness is not physical distress; happiness certainly is not.
  expect(moodShowsSweat('sad')).toBe(false);
  expect(moodShowsSweat('happy')).toBe(false);
  expect(moodShowsSweat(undefined)).toBe(false);
});
