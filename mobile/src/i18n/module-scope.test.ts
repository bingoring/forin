// Guard against t() inside a module-level constant.
//
// These arrays and objects are evaluated once, when the module is imported, so a
// t() call in one pins its strings to whatever language was active at startup and
// then ignores every language change. The symptom is nasty: most of the app
// switches language and a few labels silently do not.
//
// It already happened twice while extracting strings (JOBS in the onboarding job
// screen, and DEPT_META in the board tab), which is why this is a test and not a
// note in a comment. The fix in both cases was to store a KEY and resolve it at
// render — see data/badges.ts for the pattern.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC = join(__dirname, '..');

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
 * Extents of top-level `const NAME = [` / `= {` initializers, by bracket matching.
 *
 * Deliberately not a regex: a regex for "the block after const" runs to the last
 * closing brace in the file, which is how an earlier attempt at this check reported
 * four violations that were all the whole file. Brackets have to be counted.
 */
function moduleConstBlocks(src: string): { name: string; body: string }[] {
  const out: { name: string; body: string }[] = [];
  const re = /^(?:export )?const (\w+)(?::[^=]+)? = ([[{])/gm;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    const open = m[2];
    const close = open === '[' ? ']' : '}';
    let depth = 0;
    let i = m.index + m[0].length - 1;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) break;
      }
    }
    out.push({ name: m[1], body: src.slice(m.index, i + 1) });
  }
  return out;
}

// `t(` preceded by anything that is not a member access or identifier char, so
// `format(` and `obj.t(` do not match.
const CALL = /(^|[^.\w])t\(/;

test('no module-level constant calls t()', () => {
  const offenders: string[] = [];
  for (const file of walk(SRC)) {
    if (file.includes(`${'/'}i18n${'/'}`)) continue;
    const src = readFileSync(file, 'utf8');
    if (!CALL.test(src)) continue;
    for (const { name, body } of moduleConstBlocks(src)) {
      if (CALL.test(body)) offenders.push(`${relative(SRC, file)} · ${name}`);
    }
  }
  expect(offenders).toEqual([]);
});
