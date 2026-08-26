// A t() call must never end up as JSX TEXT.
//
// `<Text>t('result.warmSmile')</Text>` renders the eleven characters t('result…
// on screen. It compiles, it typechecks, every render test passes — the component
// really does render, just with the source of the call as its content. Three of
// these were live: the result screen's closing line and two Review Lab teasers.
//
// They arrived during the useT() conversion, where `{t('x')}` inside JSX had its
// braces dropped. Nothing else can catch it: the string is valid text.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC = join(__dirname, '..');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx') && !p.includes('.test.')) out.push(p);
  }
  return out;
}

test('no t() call renders as literal text', () => {
  const leaks: string[] = [];
  for (const f of walk(SRC)) {
    const src = readFileSync(f, 'utf8');
    src.split('\n').forEach((line, i) => {
      // A t(...) call sitting in JSX text position: preceded by > or start-of-text
      // rather than by { — the brace is what makes it an expression.
      for (const m of line.matchAll(/(^|[>}\s])t\('[A-Za-z0-9_.]+'\)/g)) {
        const before = m[1];
        // `{t('x')}` and `?t('x')` and `=t('x')` are calls; `>t('x')` is text.
        if (before === '>') leaks.push(`${relative(SRC, f)}:${i + 1}  ${line.trim().slice(0, 90)}`);
      }
    });
  }
  expect(leaks).toEqual([]);
});

test('the scan reads the tsx files it claims to', () => {
  // Otherwise an empty walk would pass forever.
  expect(walk(SRC).length).toBeGreaterThan(30);
});
