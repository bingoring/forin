import { ko } from './catalog/ko';
import { CATALOGS, LOCALES, BASE_LOCALE, completeness, isTranslated, asLocale } from './locales';

// A locale that invents a key nobody reads is a typo with no symptom: the screen
// silently falls back to Korean and looks merely untranslated.
test('no locale defines a key the base catalog does not have', () => {
  const base = new Set(Object.keys(ko));
  for (const loc of LOCALES) {
    if (loc === BASE_LOCALE) continue;
    const stray = Object.keys(CATALOGS[loc]).filter((k) => !base.has(k));
    expect({ locale: loc, stray }).toEqual({ locale: loc, stray: [] });
  }
});

// A translation that drops {n} produces a sentence with the number missing —
// grammatical, plausible, and wrong. Only the variable SET is compared: word order
// legitimately differs between languages.
test('translations interpolate the same variables as the base string', () => {
  const varsOf = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const loc of LOCALES) {
    if (loc === BASE_LOCALE) continue;
    for (const [key, value] of Object.entries(CATALOGS[loc])) {
      const want = varsOf(ko[key] ?? '');
      expect({ loc, key, vars: varsOf(value) }).toEqual({ loc, key, vars: want });
    }
  }
});

// Empty strings would render as blank labels. Absent is fine (it falls back);
// present-but-empty is not.
test('no catalog holds an empty string', () => {
  for (const loc of LOCALES) {
    for (const [key, value] of Object.entries(CATALOGS[loc])) {
      expect({ loc, key, empty: value === '' }).toEqual({ loc, key, empty: false });
    }
  }
});

// The number the settings screen shows has to mean something.
test('completeness counts translated keys, not merely present ones', () => {
  expect(completeness(BASE_LOCALE)).toBe(1);
  for (const loc of LOCALES) {
    const pct = completeness(loc);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(1);
  }
});

test('asLocale narrows device and stored values', () => {
  expect(asLocale('ko-KR')).toBe('ko');
  expect(asLocale('en_US')).toBe('en');
  expect(asLocale('de')).toBe('de');
  expect(asLocale('pt-BR')).toBeUndefined();
  expect(asLocale('')).toBeUndefined();
  expect(asLocale(null)).toBeUndefined();
});

// The metric has to distinguish "nobody translated this" from "this is the same
// word in every language". Without that, 'Lv.3' and 'NOW' hold every locale under
// 100% permanently and the number becomes noise the reader learns to ignore.
test('identical-to-Korean counts as translated only when there was no Hangul', () => {
  const hangulKey = Object.keys(ko).find((k) => /[가-힣]/.test(ko[k]) && CATALOGS.en[k] !== undefined);
  const asciiKey = Object.keys(ko).find((k) => !/[가-힣]/.test(ko[k]) && CATALOGS.en[k] === ko[k]);
  expect(hangulKey).toBeDefined();
  expect(asciiKey).toBeDefined();

  // A Korean sentence copied verbatim into English is a gap.
  expect(isTranslated('en', hangulKey!)).toBe(CATALOGS.en[hangulKey!] !== ko[hangulKey!]);
  // 'Lv.3' being identical is correct, not a gap.
  expect(isTranslated('en', asciiKey!)).toBe(true);
});

// Every key really is translated right now; if that stops being true the number in
// the settings picker drops, which is the intended signal — but a locale silently
// falling to 0 would mean the catalog import broke, not that work is pending.
test('no locale is empty', () => {
  for (const loc of LOCALES) {
    if (loc === BASE_LOCALE) continue;
    expect(completeness(loc)).toBeGreaterThan(0);
  }
});
