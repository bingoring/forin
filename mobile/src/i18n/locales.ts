// Which UI languages exist, and how finished each one is.
//
// Completeness is COMPUTED from the catalogs, not labelled by hand (business-rules
// R9): a hand-written "지원됨" goes stale the moment someone adds a key, and the
// whole point of showing it is that the user can trust it. Filling in translations
// moves the number on its own.
import { ko } from './catalog/ko';
import { en } from './catalog/en';
import { ja } from './catalog/ja';
import { de } from './catalog/de';

/** The canonical locale. Its catalog defines the key set everything else is measured against. */
export const BASE_LOCALE = 'ko';

export type Locale = 'ko' | 'en' | 'ja' | 'de';

export const CATALOGS: Record<Locale, Record<string, string>> = { ko, en, ja, de };

// Statically imported, all four. Metro resolves imports statically, so a computed
// path would not be bundled at all — the same constraint that made sfx.ts spell
// out each require(). Four catalogs of ~1,700 keys is tens of KB; if that ever
// matters, the fix is splitting by screen, not lazy paths that silently miss.
export const LOCALE_META: Record<Locale, { name: string; sub: string; flag: string }> = {
  ko: { name: '한국어', sub: 'Korean', flag: 'kr' },
  en: { name: 'English', sub: 'English', flag: 'us' },
  ja: { name: '日本語', sub: 'Japanese', flag: 'jp' },
  de: { name: 'Deutsch', sub: 'German', flag: 'de' },
};

export const LOCALES = Object.keys(LOCALE_META) as Locale[];

/**
 * Share of the base catalog this locale actually translates, 0..1.
 *
 * A key present but equal to the Korean string counts as untranslated: that is
 * what a half-finished catalog looks like, and calling it done would be the
 * "야매" this feature was explicitly told not to be.
 */
export function completeness(locale: Locale): number {
  if (locale === BASE_LOCALE) return 1;
  const base = Object.keys(ko);
  if (base.length === 0) return 1;
  let n = 0;
  const cat = CATALOGS[locale];
  for (const k of base) {
    const v = cat[k];
    if (v !== undefined && v !== '' && v !== ko[k]) n++;
  }
  return n / base.length;
}

/** How a locale should be described in the picker. */
export function completenessLabel(locale: Locale): { text: string; full: boolean } {
  const pct = completeness(locale);
  if (pct >= 0.999) return { text: '', full: true };
  if (pct <= 0.001) return { text: '준비 중', full: false };
  return { text: `번역 ${Math.round(pct * 100)}%`, full: false };
}

/** Narrow an arbitrary string (device locale, stored value, server field) to a Locale. */
export function asLocale(code?: string | null): Locale | undefined {
  if (!code) return undefined;
  const base = code.toLowerCase().split(/[-_]/)[0];
  return (LOCALES as string[]).includes(base) ? (base as Locale) : undefined;
}
