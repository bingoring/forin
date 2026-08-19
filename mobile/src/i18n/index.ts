// Translation lookup.
//
// `t()` is a plain function, not a hook, because module-level constants need it —
// STEP_META, error mappers, the tab titles in a layout. A hook-only API forces
// those into components or leaves them permanently Korean, which is how a codebase
// ends up half-translated. Screens call useLocale() once so a language change
// repaints them, then use t() freely.
import { useSyncExternalStore } from 'react';
import { BASE_LOCALE, CATALOGS, type Locale } from './locales';
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
  const locale = getLocale();
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
