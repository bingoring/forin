import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en.json';
import ko from './ko.json';

export const SUPPORTED_LOCALES = ['ko', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const i18n = new I18n({ en, ko });

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Warn once per missing key in dev; otherwise fall back via defaultLocale/enableFallback.
const warnedKeys = new Set<string>();
i18n.missingTranslation.register('warnOnce', (_i18n, scope) => {
  const key = String(scope);
  if (__DEV__ && !warnedKeys.has(key)) {
    warnedKeys.add(key);
    // eslint-disable-next-line no-console
    console.warn(`[i18n] missing key: ${key}`);
  }
  return `[missing: ${key}]`;
});
i18n.missingBehavior = 'warnOnce';

function normalize(locale: string | undefined | null): SupportedLocale {
  if (!locale) return 'en';
  const primary = locale.toLowerCase().split(/[-_]/)[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(primary)
    ? (primary as SupportedLocale)
    : 'en';
}

const deviceLocales = Localization.getLocales();
const first = deviceLocales[0];
i18n.locale = normalize(first?.languageCode ?? first?.languageTag ?? null);

export function setAppLocale(locale: string) {
  i18n.locale = normalize(locale);
}

export function t(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options);
}
