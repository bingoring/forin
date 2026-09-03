// Two different numbers must not share one abbreviation.
//
// The app has two "levels" and they are unrelated: the XP level (LV 12, from
// user_progress) and the CEFR band (B1, the onboarding answer). Four screens drew the
// CEFR band as "Lv.B1", one dot away from the profile card's "LV 12" — and the
// colleague detail screen went further and put BOTH through one field
// (`c.targetLevel || String(c.level)`), so the same row read "B1" for one colleague
// and "12" for the next.
//
// A source scan rather than a render test on purpose: the claim is about every place
// the label is written, and a render test only covers the screens it mounts.
import { readFileSync } from 'fs';
import { join } from 'path';

const APP = join(__dirname, '..', 'app');

/** Source with comments removed.
 *
 *  Load-bearing: these screens' comments QUOTE the code that was replaced ("it used
 *  to read Lv.{enLevel}"), so a scan of the raw file reports the fix as absent
 *  because the explanation of the fix is present. Stripping comments is also what
 *  makes the assertions mean what they say — the claim is about what the screen
 *  renders, not about what anyone wrote about it.
 *
 *  JSX comments are `{\/* … *\/}` and collapse into the block-comment case. */
function code(...p: string[]): string {
  return readFileSync(join(APP, ...p), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}
/** Raw source, comments included — for the assertions that are ABOUT a comment. */
const read = (...p: string[]) => readFileSync(join(APP, ...p), 'utf8');

const SCREENS: [string, string][] = [
  ['career tab', code('(tabs)', 'campus.tsx')],
  ['profile tab', code('(tabs)', 'me.tsx')],
  ['colleague list', code('colleagues', 'index.tsx')],
  ['colleague detail', code('colleagues', '[id].tsx')],
  ['add colleague', code('colleagues', 'add.tsx')],
];

test('one abbreviation per number: nothing is labelled "Lv."', () => {
  // `Lv.` is banned outright rather than only in front of a CEFR band, because the
  // collision runs both ways: the profile tab wrote the XP level as "Lv.{level}" two
  // lines below writing the same number as "LV {level}". One spelling — "LV" for XP,
  // the language code or nothing for a CEFR band — leaves no pair to confuse.
  for (const [name, src] of SCREENS) {
    const offenders = src.match(/Lv\.\s*\{|Lv\.\$\{/g);
    // jest's expect takes one argument, so the screen name goes in the failure text.
    expect({ screen: name, offenders: offenders ?? [] }).toEqual({ screen: name, offenders: [] });
  }
});

test('the career chip names the language its band is in', () => {
  const src = code('(tabs)', 'campus.tsx');
  // A German-track learner's B1 is not an English B1, so the chip cannot hardcode EN
  // and cannot omit the language either.
  expect(src).toMatch(/\(targetLang \|\| 'en'\)\.toUpperCase\(\)/);
  expect(src).toMatch(/if \(prof\?\.targetLang\) setTargetLang\(prof\.targetLang\)/);
});

test('colleague detail keeps the two levels in two fields', () => {
  const src = code('colleagues', '[id].tsx');
  // The defect was one field fed by `targetLevel || level`. Either value alone is
  // fine; the two of them sharing a slot is not.
  expect(src).not.toMatch(/targetLevel \|\| String\(c\.level/);
  expect(src).toMatch(/value=\{c\.targetLevel \|\| '-'\}/);
  expect(src).toMatch(/value=\{String\(c\.level \?\? '-'\)\}/);
});

test('the onboarding answer no longer claims something nothing does', () => {
  // The question moved twice: the three-page wizard (onboarding/level.tsx) became the
  // passport flow, and the three ANSWERS then moved out of that screen into
  // data/onboardingChoices so the settings screen could offer the same list. The claim
  // travels with the answer, so this reads where the CEFR mapping is defined.
  const src = readFileSync(join(__dirname, '..', 'data', 'onboardingChoices.ts'), 'utf8');
  // The old page said "Picking a CEFR band tunes scenario difficulty" while the column
  // was written and never read. It is true now — via three named server-side effects —
  // and the comment has to name them, so the next reader can check the claim against
  // domain/user/level.go rather than trusting it.
  expect(src).not.toMatch(/band tunes scenario difficulty/);
  expect(src).toMatch(/speech register/);
  expect(src).toMatch(/grading calibration/);
  expect(src).toMatch(/scenario weighting/);
});
