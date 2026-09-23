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

/**
 * Every function-like declaration in a file, with its real body span.
 *
 * Two things this has to get right, both learned the hard way:
 *
 * ① **The body ends at its matching brace, not at the next `function` keyword.** The first
 *    version sliced from one declaration to the start of the next, so a helper declared
 *    INSIDE a component swallowed everything below it — including the component's own JSX.
 *    `StationTrack`'s `pressStep` never touched a translation and was reported anyway,
 *    and the way that reads from inside the failure is "reshape the helper until the rule
 *    stops complaining", which is how a guard turns into a thing people route around.
 *
 * ② **Arrow consts count.** They were invisible, so `const f = () => …` was a way out of
 *    the rule that needed no argument. A rule with a legal escape hatch protects nothing.
 */
type Fn = { name: string; params: string; start: number; bodyStart: number; bodyEnd: number };

/** Index just past the token that closes the group opened at `open`. */
function matchAt(src: string, open: number, pair: string): number {
  const [o, c] = pair;
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === o) depth += 1;
    else if (src[i] === c) {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return src.length;
}

/** A concise arrow (`(x) => x + 1`) has no braces — take it to the end of its statement. */
function conciseEnd(src: string, from: number): number {
  let depth = 0;
  for (let i = from; i < src.length; i += 1) {
    const ch = src[i];
    if ('([{'.includes(ch)) depth += 1;
    else if (')]}'.includes(ch)) {
      if (depth === 0) return i;
      depth -= 1;
    } else if (depth === 0 && (ch === ';' || ch === '\n')) return i;
  }
  return src.length;
}

function functions(src: string): Fn[] {
  const out: Fn[] = [];

  const push = (name: string, start: number, paren: number, arrow: boolean) => {
    const afterParams = matchAt(src, paren, '()');
    const params = src.slice(paren, afterParams);
    let i = afterParams;
    if (arrow) {
      // The body begins right after `=>`. Scanning on for a `{` instead would walk
      // straight through a concise body (`(x) => t(x)`) and measure nothing — which is
      // how the terse form stayed unguarded on the first attempt at this fix.
      i = src.indexOf('=>', afterParams) + 2;
    } else {
      while (i < src.length && src[i] !== '{') i += 1; // past any return-type annotation
    }
    while (i < src.length && /\s/.test(src[i])) i += 1;
    out.push(src[i] === '{'
      ? { name, params, start, bodyStart: i, bodyEnd: matchAt(src, i, '{}') }
      : { name, params, start, bodyStart: i, bodyEnd: conciseEnd(src, i) });
  };

  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    push(m[1], m.index!, m.index! + m[0].length - 1, false);
  }
  // `const name = (…) =>` and `const name = async (…) =>`, with or without a type annotation
  // on the binding. A non-arrow initialiser is filtered out by the `=>` check in `push`.
  for (const m of src.matchAll(/\b(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::[^=\n]*)?=\s*(?:async\s*)?\(/g)) {
    const paren = m.index! + m[0].length - 1;
    const afterParams = matchAt(src, paren, '()');
    let j = afterParams;
    while (j < src.length && /[\s:A-Za-z0-9_<>,.|\[\]]/.test(src[j]) && !src.startsWith('=>', j)) j += 1;
    if (!src.startsWith('=>', j)) continue; // not an arrow — a call, a cast, a tuple
    push(m[1], m.index!, paren, true);
  }

  return out.sort((a, b) => a.start - b.start);
}

/** Does this declaration, or anything it is nested inside, hold a live translate function? */
function satisfied(fn: Fn, all: Fn[]): boolean {
  const own = (f: Fn) =>
    f.params.includes('t: Translate') ||
    src_has(f, 'const t = useT();');
  if (own(fn)) return true;
  return all.some((o) => o !== fn && o.bodyStart <= fn.start && fn.bodyEnd <= o.bodyEnd && own(o));
}

let SRC = '';
function src_has(f: Fn, needle: string): boolean {
  return SRC.slice(f.bodyStart, f.bodyEnd).includes(needle);
}

test('nothing that renders depends on the module-level t()', () => {
  const root = join(__dirname, '..');
  const files = RENDER_DIRS.flatMap((d) => walk(join(root, d)));
  expect(files.length).toBeGreaterThan(40);

  const offenders: string[] = [];
  for (const p of files) {
    const src = readFileSync(p, 'utf8');
    if (!CALL.test(src)) continue;
    SRC = src;
    const fns = functions(src);
    for (const fn of fns) {
      // Only the calls this declaration makes ITSELF — a nested helper's own calls belong
      // to that helper, and it is measured on its own turn.
      let own = src.slice(fn.bodyStart, fn.bodyEnd);
      for (const inner of fns) {
        if (inner !== fn && fn.bodyStart <= inner.start && inner.bodyEnd <= fn.bodyEnd) {
          own = own.slice(0, inner.start - fn.bodyStart) + ' '.repeat(inner.bodyEnd - inner.start) + own.slice(inner.bodyEnd - fn.bodyStart);
        }
      }
      if (!CALL.test(own)) continue;
      if (!satisfied(fn, fns)) offenders.push(`${p.slice(root.length + 1)}::${fn.name}`);
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
