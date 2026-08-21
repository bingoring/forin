// Rendered strings come from useT(), never from the module-level t().
//
// React Compiler is on (app.json experiments) and caches expressions by their reactive
// inputs. `t("some.key")` takes a constant and reads a module store, so it was computed
// once per component instance and reused — 66 such calls sat in memo slots in the shipped
// bundle, and a screen that re-rendered on a language change re-rendered with the strings
// it was first mounted with. Subscribing with useLocale() did not help: the subscription
// re-rendered the component while the cached string stayed.
//
// useT() returns the translate function as a VALUE whose identity changes with the
// language, which is the dependency React needs to see. Helpers that are not components
// take one as a parameter for the same reason — a helper called from a render is cached by
// its arguments like anything else.
//
// A source rule, because jest's transform does not run the compiler: every render test in
// this repo passed the whole time the device was wrong.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const RENDER_DIRS = ['app', 'components', 'map', 'engine'];

/**
 * Any call to a translate function — `t("literal")` AND `t(someKey)`.
 *
 * The first version of this rule only matched a quoted key, and three components used
 * nothing but dynamic ones: `t(r.labelKey)`, `t(style.subKey)`. They kept the module-level
 * t and stayed stale, and the rule said they were fine. A dynamic key is not a weaker
 * case of this bug — the key being a variable does nothing about the locale being invisible.
 *
 * The lookbehind skips `.t(` (a method) and the parameter forms `(t:` / `(t,` are not
 * `t(` at all.
 */
const CALL = /(?<![A-Za-z0-9_.$])t\(/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ((p.endsWith('.ts') || p.endsWith('.tsx')) && !p.includes('.test.')) out.push(p);
  }
  return out;
}

/** Every `function Name(` in a file, with the index of its body's opening brace. */
function functions(src: string): { name: string; start: number; brace: number }[] {
  const out: { name: string; start: number; brace: number }[] = [];
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    let i = m.index! + m[0].length - 1;
    let depth = 0;
    while (i < src.length) {
      if (src[i] === '(') depth += 1;
      else if (src[i] === ')') {
        depth -= 1;
        if (depth === 0) break;
      }
      i += 1;
    }
    out.push({ name: m[1], start: m.index!, brace: src.indexOf('{', i) });
  }
  return out;
}

test('nothing that renders depends on the module-level t()', () => {
  const root = join(__dirname, '..');
  const files = RENDER_DIRS.flatMap((d) => walk(join(root, d)));
  expect(files.length).toBeGreaterThan(40);

  const offenders: string[] = [];
  for (const p of files) {
    const src = readFileSync(p, 'utf8');
    if (!CALL.test(src)) continue;
    const fns = functions(src);
    for (let i = 0; i < fns.length; i += 1) {
      const end = i + 1 < fns.length ? fns[i + 1].start : src.length;
      const body = src.slice(fns[i].brace, end);
      if (!CALL.test(body)) continue;
      const hasLocal = body.includes('const t = useT();');
      const takesIt = new RegExp(`function ${fns[i].name}\\(t: Translate`).test(src);
      if (!hasLocal && !takesIt) offenders.push(`${p.slice(root.length + 1)}::${fns[i].name}`);
    }
  }
  expect(offenders).toEqual([]);
});

test('and the compiler is what makes that necessary', () => {
  // If the experiment is ever turned off this rule becomes belt-and-braces rather than
  // load-bearing — but it is the fact the rule rests on, so it should fail loudly.
  const app = JSON.parse(readFileSync(join(__dirname, '..', '..', 'app.json'), 'utf8')) as {
    expo?: { experiments?: { reactCompiler?: boolean } };
  };
  expect(app.expo?.experiments?.reactCompiler).toBe(true);
});
