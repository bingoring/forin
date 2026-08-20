// The vocabulary has to stay in one place.
//
// Before transitions.ts existed, `animation:` was written inline on every screen and had
// drifted to eight 'fade' and two 'slide_from_right' with nothing stating which was
// intended. Nobody chose that split; it accumulated. A named constant only helps if the
// next screen reaches for it, so reaching past it is what this test catches.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const APP = join(__dirname, '..', 'app');

/**
 * interior/[id] is the one screen that decides at runtime.
 *
 * Arriving through the elevator has its own transition — the doors close, the floor
 * ticker runs, and the interior must already be there when they open — so that entry has
 * to suppress the stack animation while a direct visit keeps it. That is a per-visit
 * decision, not a vocabulary entry.
 */
const RUNTIME_CHOICE = [join('interior', '[id].tsx')];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

test('no screen writes its own transition', () => {
  const files = walk(APP);
  // A wrong path would make this pass over nothing.
  expect(files.length).toBeGreaterThan(10);

  const offenders = files
    .filter((p) => !RUNTIME_CHOICE.some((x) => p.endsWith(x)))
    // A quoted animation name inline in the file, rather than a constant from the theme.
    .filter((p) => /animation:\s*'/.test(readFileSync(p, 'utf8')))
    .map((p) => p.slice(APP.length + 1));

  expect(offenders).toEqual([]);
});

test('and the screens that do transition use the named vocabulary', () => {
  const used = walk(APP).filter((p) => /(TASK_SCREEN|PLACE_SCREEN)/.test(readFileSync(p, 'utf8')));
  // Eight screens had a transition before this was centralised; none should have lost it.
  expect(used.length).toBeGreaterThanOrEqual(8);
});
