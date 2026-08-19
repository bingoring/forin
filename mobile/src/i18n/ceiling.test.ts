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
const CEILINGS: Record<string, number> = {
  'src/app': 0,
  'src/components': 0,
  'src/data': 5,
  'src/lib': 0,
  'src/map': 1203,
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
