// Syllable chips are labelled by spelling, not by IPA.
//
// Azure returns both per syllable and we request PhonemeAlphabet: IPA, so its `syllable`
// field is an IPA string — "pronunciation" arrived as prə·nʌn·si·eɪ·ʃən and read as a
// different word. The chips exist so a learner can see WHICH PART of the word they missed,
// and they find that part by spelling.
import { readFileSync } from 'fs';
import { join } from 'path';

test('the screen labels chips with the grapheme, falling back to the phonetic form', () => {
  const src = readFileSync(join(__dirname, '..', '..', 'app', 'pronunciation', '[sentenceKey].tsx'), 'utf8');
  // Spelling first, IPA only when a locale gives no grapheme segmentation.
  expect(src).toMatch(/label:\s*s\.grapheme\?\.trim\(\)\s*\|\|\s*s\.syllable/);
  // And never the bare phonetic field, which is what it used to be.
  expect(src).not.toMatch(/label:\s*s\.syllable\s*,/);
});
