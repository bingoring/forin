// Syllable chips are labelled by spelling, not by IPA.
//
// Azure returns both per syllable and we request PhonemeAlphabet: IPA, so its `syllable`
// field is an IPA string — "pronunciation" arrived as prə·nʌn·si·eɪ·ʃən and read as a
// different word. The chips exist so a learner can see WHICH PART of the word they missed,
// and they find that part by spelling.
import { readFileSync } from 'fs';
import { join } from 'path';

test('every place the screen names a syllable goes through syllableLabel', () => {
  const src = readFileSync(join(__dirname, '..', '..', 'app', 'pronunciation', '[sentenceKey].tsx'), 'utf8');
  // Chips AND the recording-time progress cells (cross-review I5) — one rule, not three.
  expect(src.match(/syllableLabel\(s\)/g)?.length).toBeGreaterThanOrEqual(2);
  // Never the bare phonetic field, which is what both used to be.
  expect(src).not.toMatch(/label:\s*s\.syllable\s*,/);
  expect(src).not.toMatch(/map\(\(s\) => s\.syllable\)/);
});
