// The deploy-wide "can this server score speech" flag.
import { isPronunciationEnabled, hydratePronunciationEnabled, resetPronunciationEnabled } from './pronunciationFlag';

afterEach(resetPronunciationEnabled);

test('on by default, so a flag that never arrives does not hide pronunciation', () => {
  expect(isPronunciationEnabled()).toBe(true);
});

test('a boolean from the server overwrites it', () => {
  hydratePronunciationEnabled(false);
  expect(isPronunciationEnabled()).toBe(false);
  hydratePronunciationEnabled(true);
  expect(isPronunciationEnabled()).toBe(true);
});

test('anything that is not a boolean leaves the value alone', () => {
  hydratePronunciationEnabled(false);
  for (const junk of [undefined, null, 'true', 0, 1, {}]) hydratePronunciationEnabled(junk);
  expect(isPronunciationEnabled()).toBe(false);
});
