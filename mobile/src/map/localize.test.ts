import { localizeInterior } from './localize';
import { FIXTURES } from './fixtures/er';
import { setLocale } from '@/i18n';
import { MAP_CATALOGS } from '@/i18n/locales';

const ER = FIXTURES['INT-ER-00001'];

afterEach(async () => {
  await setLocale('ko');
});

test('korean passes through unchanged', async () => {
  await setLocale('ko');
  // Not just "returns something": the whole structure must be identical, because a
  // localizer that quietly drops a field would still look fine on one screen.
  expect(localizeInterior(ER)).toEqual(ER);
});

test('the fixture is never mutated', async () => {
  const before = JSON.stringify(ER);
  await setLocale('en');
  localizeInterior(ER);
  // Fixtures are module singletons shared across screens and locales. Mutating one
  // would leave the previous language's text behind after a switch.
  expect(JSON.stringify(ER)).toBe(before);
});

test('english actually changes the signage', async () => {
  await setLocale('en');
  const en = localizeInterior(ER);
  const names = (r: typeof ER) => r.rooms.map((x) => x.name);
  expect(names(en)).not.toEqual(names(ER));

  // And the specific strings that exist in the catalog really moved.
  const flat = JSON.stringify(en);
  expect(flat).toContain('Resuscitation');
  expect(flat).not.toContain('제염실 · DECON');
});

test('protocol values are left alone', async () => {
  await setLocale('en');
  const en = localizeInterior(ER);
  // ids, kinds and scenario references are lookups, not labels: translating one
  // breaks navigation instead of relabelling it.
  expect(en.rooms.map((r) => r.id)).toEqual(ER.rooms.map((r) => r.id));
  expect(en.hotspots.map((h) => h.kind)).toEqual(ER.hotspots.map((h) => h.kind));
  expect(en.hotspots.map((h) => h.scenarioId)).toEqual(ER.hotspots.map((h) => h.scenarioId));
  expect(en.objects.map((o) => o.type)).toEqual(ER.objects.map((o) => o.type));
  expect(en.collision).toEqual(ER.collision);
  expect(en.playerStart).toEqual(ER.playerStart);
});

// Catalog keys are authored Korean strings, so a typo in one is invisible at
// runtime — the entry simply never matches and the label stays Korean. This is the
// only thing that catches it.
//
// FIXTURES bundles every authored interior, so a key that matches nothing is an
// orphan, full stop. Asserting the list is empty (rather than "fewer orphans than
// keys", which passes even when every key is wrong) is the point.
test('no map key is an orphan, in any locale', () => {
  const haystack = JSON.stringify(Object.values(FIXTURES));
  for (const [locale, cat] of Object.entries(MAP_CATALOGS)) {
    const orphans = Object.keys(cat ?? {}).filter((k) => !haystack.includes(k));
    expect({ locale, orphans }).toEqual({ locale, orphans: [] });
  }
});
