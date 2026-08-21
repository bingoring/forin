// Translation lookup.
//
// Two entry points, and which one to use is not a preference.
//
// `useT()` for anything a component renders. React Compiler is on (app.json
// experiments) and caches expressions by their reactive inputs, so the plain `t("key")`
// below — a constant argument reading a module store — was computed once per component
// instance and reused: 66 of these calls sat in memo slots in the shipped bundle, and a
// screen that re-rendered on a language change re-rendered with the strings it was first
// mounted with. Subscribing with useLocale() and calling t() did NOT fix that; the
// subscription re-rendered the component while the cached string stayed. The dependency
// has to be visible to React, and useT() is what makes it visible.
//
// `t()` for code that is not rendering: an Alert in a handler, a module-level map of
// labels. It reads the locale at call time, which is correct there — nothing is being
// cached because nothing is being rendered.
import { useMemo, useSyncExternalStore } from 'react';
import { BASE_LOCALE, CATALOGS, MAP_CATALOGS, type Locale } from './locales';
import { getLocale, subscribe } from './store';

export { getLocale, setLocale, loadLocale, adoptProfileLocale, localeWasChosen, onLocaleChange } from './store';
export { LOCALES, LOCALE_META, completeness, completenessLabel, asLocale, type Locale } from './locales';

/** Variables interpolated into a string as {name}. */
export type Vars = Record<string, string | number>;

/**
 * The string for `key` in the current UI language.
 *
 * Falls back to Korean and then to the key itself (R5). A missing translation must
 * render something a human can act on — never an empty label, never a crash —
 * because catalogs are filled in over time and the app ships during that.
 */
export function t(key: string, vars?: Vars): string {
  return translateIn(getLocale(), key, vars);
}

/** The lookup itself, with the language named. Both entry points go through here. */
function translateIn(locale: Locale, key: string, vars?: Vars): string {
  let s = CATALOGS[locale]?.[key];
  if (s === undefined && locale !== BASE_LOCALE) {
    s = CATALOGS[BASE_LOCALE][key];
    if (s !== undefined && __DEV__) {
      console.warn(`[i18n] ${locale} is missing "${key}" — showing Korean`);
    }
  }
  if (s === undefined) {
    if (__DEV__) console.warn(`[i18n] no such key "${key}"`);
    return key;
  }
  return vars ? interpolate(s, vars) : s;
}

/** A translate function, same shape as `t`. */
export type Translate = (key: string, vars?: Vars) => string;

/**
 * The translate function for the CURRENT language, as a value.
 *
 * Shaped like react-i18next's `const { t } = useTranslation()` on purpose: named `t` at
 * the call site, every existing `t("key")` inside the component keeps working unchanged,
 * and the identity changes when the language does — which is the whole point. The
 * compiler can see that every string derived from it must be recomputed.
 *
 * Helpers that are not components take one of these as a parameter (`function
 * nextLabel(t: Translate, ...)`) rather than reaching for the module-level t: a helper
 * called from a render is cached by its arguments like anything else, so the translate
 * function has to be one of them.
 */
export function useT(): Translate {
  const locale = useLocale();
  // Keyed on the locale, so the identity is stable while the language is and changes the
  // moment it is not.
  return useMemo(() => (key: string, vars?: Vars) => translateIn(locale, key, vars), [locale]);
}

/**
 * Subscribe to the current locale so a component repaints when it changes.
 *
 * Returned so callers can key off it if they need to; most just call it for the
 * subscription. Language has to change without a restart — otherwise "설정에서
 * 바꿀 수 있다" is only half true.
 */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, getLocale);
}

function interpolate(s: string, vars: Vars): string {
  return s.replace(/\{(\w+)\}/g, (whole, name) => {
    const v = vars[name];
    // Leaving {name} visible beats printing "undefined": it says which variable
    // the caller forgot, and it shows up in review instead of shipping silently.
    return v === undefined ? whole : String(v);
  });
}

/**
 * Interior signage and object labels, keyed by the authored Korean itself.
 *
 * A separate catalog from the UI keys, and keyed by value rather than by name: the
 * map fixtures are pixel-verified ports, so the alternative — rewriting 1,131 field
 * values into key strings — would be a large edit through the files a test suite
 * guards byte for byte. See map/localize.ts for the full reasoning.
 */
export function mapText(ko: string): string {
  const locale = getLocale();
  if (locale === BASE_LOCALE) return ko;
  return MAP_CATALOGS[locale]?.[ko] ?? ko;
}
