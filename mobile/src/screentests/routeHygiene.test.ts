// No test files under the app root.
//
// expo-router bundles EVERY .ts/.tsx under the app root as a route: its
// require.context regex (expo-router/_ctx.js) excludes only +api, +html and
// +middleware. A test file placed next to the screen it tests therefore ships
// inside the app bundle, and the jest.mock calls at its top level throw
// "Property 'jest' doesn't exist" the moment the bundle evaluates — the app dies
// on launch, before any screen renders.
//
// Nothing else catches this. `jest` passes (the file is a valid test), `tsc`
// passes (jest types are installed), and the failure only appears when the app
// actually starts. So the guard is a test about file placement.
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const APP_ROOT = join(__dirname, '..', 'app');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

test('no test files live under src/app, where expo-router would bundle them as routes', () => {
  const files = walk(APP_ROOT);
  // Without this the test would pass on an empty or mis-pointed directory.
  expect(files.length).toBeGreaterThan(10);

  const offenders = files
    .filter((f) => /\.(test|spec)\.[tj]sx?$/.test(f) || /__tests__/.test(f))
    .map((f) => relative(APP_ROOT, f));

  // Named, so a failure says which file to move rather than that a count changed.
  expect(offenders).toEqual([]);
});

test('and every route file is something expo-router can actually route', () => {
  // The same bundling rule means a helper module dropped into src/app becomes a
  // route with no component. Route files must have a default export; the
  // conventional non-route names (_layout, +html …) are the documented exceptions.
  const files = walk(APP_ROOT).filter((f) => /\.[tj]sx?$/.test(f));
  const noDefault = files.filter((f) => {
    const base = f.split('/').pop()!;
    if (base.startsWith('_') || base.startsWith('+')) return false;
    return !/export default/.test(require('fs').readFileSync(f, 'utf8'));
  }).map((f) => relative(APP_ROOT, f));
  expect(noDefault).toEqual([]);
});
