// React Compiler caches t() — so a language change must remount.
//
// The compiler (app.json experiments.reactCompiler) memoises expressions by their reactive
// inputs. `t("campus.favTitle")` takes a constant, so it is computed once per component
// instance and reused: a screen that re-renders because the locale changed re-renders with
// the strings it was first mounted with. Subscribing to the locale does not help — the
// cached value has to be discarded, and only a remount discards it.
//
// The root navigator is keyed on the locale for exactly that reason. This test exists
// because the line looks removable: it has no visible effect in development until someone
// switches language twice, and none at all under jest, whose transform does not run the
// compiler.
import { readFileSync } from 'fs';
import { join } from 'path';

test('the root navigator is keyed on the locale', () => {
  const src = readFileSync(join(__dirname, '..', 'app', '_layout.tsx'), 'utf8');
  expect(src).toMatch(/const locale = useLocale\(\)/);
  expect(src).toMatch(/<Stack key=\{locale\}/);
});

test('and the compiler is what makes that necessary', () => {
  // If the experiment is ever turned off, the key becomes harmless rather than wrong — but
  // this is the fact the comment above depends on, so it should fail loudly if it changes.
  const app = JSON.parse(readFileSync(join(__dirname, '..', '..', 'app.json'), 'utf8')) as {
    expo?: { experiments?: { reactCompiler?: boolean } };
  };
  expect(app.expo?.experiments?.reactCompiler).toBe(true);
});
