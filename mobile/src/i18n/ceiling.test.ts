// The ratchet.
//
// Extracting 1,726 hardcoded Korean strings is worth nothing if the next screen
// adds twenty more. Nothing else stops that: tsc is happy, review misses it, and
// the app looks fine in Korean. So the count is measured and capped, and the caps
// come down as each area is extracted (build-spec i18n, business-rules R12).
//
// Same shape as the emoji discipline from 762bb6a: a rule the machine enforces
// beats a rule people remember.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// Per-area ceilings. LOWER these as extraction proceeds; never raise one to make a
// commit pass — put the string in the catalog instead.
//
// src/map is the exception and does not fall: the interior fixtures keep their
// Korean because that string IS the catalog key (map/localize.ts explains why the
// alternative — rewriting 1,131 values in pixel-verified files — is worse). Its
// ceiling therefore guards against NEW hardcoded Korean in the map engine rather
// than tracking translation progress; that progress is measured by
// scripts/i18n-matrix.py and the orphan test in map/localize.test.ts.
const CEILINGS: Record<string, number> = {
  'src/app': 0,
  'src/components': 0,
  'src/data': 5,
  'src/lib': 0,
  'src/map': 1203,
};

// JSX TEXT ceilings — a SEPARATE measurement, not a relaxation of the ones above.
//
// countKoreanLiterals only ever saw quoted strings, so `<Text>오늘의 성장 리포트</Text>`
// was invisible to it: strings that reach the screen in Korean regardless of the app
// language, while this file reported src/app and src/components at zero. The literal
// ceilings stay at 0 — that guarantee is intact and unchanged. These numbers are the debt
// the old regex was hiding, measured. They are a floor to drive DOWN to zero, never a
// budget to spend.
//
// Twice now the count went up because the DETECTOR was blind, not because the code got
// worse: first quoted-only, then text-without-interpolation. `기록 {n}` was extracted to
// the catalog and the number did not move, which is how the second hole surfaced. When
// these ceilings rise, check which of the two happened before treating it as a
// regression.
const JSX_CEILINGS: Record<string, number> = {
  'src/app': 165,
  'src/components': 40,
  'src/data': 0,
  'src/lib': 0,
  'src/map': 8,
};

const HANGUL = /[가-힣]/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      out.push(...walk(p));
    } else if ((p.endsWith('.ts') || p.endsWith('.tsx')) && !p.includes('.test.')) {
      out.push(p);
    }
  }
  return out;
}

/**
 * Korean inside string literals only — comments are excluded on purpose.
 *
 * Comments in this codebase are Korean by convention and explain WHY; they never
 * reach a screen. Counting them would push the ceiling up for writing a good
 * comment, which is exactly backwards.
 */
function countKoreanLiterals(file: string): number {
  let src = readFileSync(file, 'utf8');
  src = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const literals = src.match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g) ?? [];
  return literals.filter((l: string) => HANGUL.test(l)).length;
}

/**
 * Korean sitting directly between JSX tags — `<Text>따라 말해보세요</Text>`.
 *
 * This is the same user-visible string as t('pron.repeat'), but it carries no quotes, so
 * the literal scan above walks straight past it.
 *
 * Two details are load-bearing. The segment must be followed by a CLOSING tag, which is
 * what real JSX text is followed by — matching any `>...<` also swept up object literals
 * and comparisons spanning lines. And `{...}` spans are stripped from the segment rather
 * than disqualifying it: an earlier version skipped any segment containing braces, so
 * `기록 {n}` and `{name} 님과의 대화` were invisible — a mixed line is exactly where
 * hardcoded Korean hides.
 */
function countKoreanJsxText(file: string): number {
  let src = readFileSync(file, 'utf8');
  src = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  let n = 0;
  for (const [, text] of src.matchAll(/>([^<>]*)<\//g)) {
    if (HANGUL.test(text.replace(/\{[^{}]*\}/g, ''))) n += 1;
  }
  return n;
}

describe('hardcoded Korean stays capped', () => {
  for (const [area, ceiling] of Object.entries(CEILINGS)) {
    test(`${area} has at most ${ceiling} Korean string literals`, () => {
      const files = walk(join(__dirname, '..', '..', area));
      // Guard against the test passing because it scanned nothing — a wrong path
      // would make every ceiling trivially satisfied.
      expect(files.length).toBeGreaterThan(0);
      const total = files.reduce((n, f) => n + countKoreanLiterals(f), 0);
      // Reported as an object so a failure prints both numbers, which is what tells
      // you whether to extract or to lower the ceiling.
      expect({ area, total, ceiling, within: total <= ceiling }).toEqual({ area, total, ceiling, within: true });
    });
  }
});

describe('Korean in JSX text stays capped', () => {
  for (const [area, ceiling] of Object.entries(JSX_CEILINGS)) {
    test(`${area} has at most ${ceiling} Korean JSX text nodes`, () => {
      const files = walk(join(__dirname, '..', '..', area));
      expect(files.length).toBeGreaterThan(0);
      const total = files.reduce((n, f) => n + countKoreanJsxText(f), 0);
      expect({ area, total, ceiling, within: total <= ceiling }).toEqual({ area, total, ceiling, within: true });
    });
  }
});
