// The selected UI language: one module-level value, persisted, with subscribers.
//
// Not React context. `t()` has to work in module constants and plain functions
// (STEP_META, error mappers, notification text), which a context cannot reach —
// see index.ts. Screens subscribe through useLocale() so a change repaints without
// a restart, which is what "설정에서 바꿀 수 있다" actually requires.
import * as SecureStore from 'expo-secure-store';
import { asLocale, BASE_LOCALE, type Locale } from './locales';

const KEY = 'forin.ui.locale';

let current: Locale = BASE_LOCALE;
let explicit = false; // true once the user (or their profile) chose, not just the device
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/**
 * The device's language, via Intl rather than expo-localization.
 *
 * Hermes ships Intl and api/client.ts already reads the timezone the same way, so
 * this needs no new dependency. Wrapped because a JS engine built without Intl
 * would throw here, and a missing device language must fall back, not crash.
 */
function deviceLocale(): Locale | undefined {
  try {
    return asLocale(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return undefined;
  }
}

export function getLocale(): Locale {
  return current;
}

/** True when the locale came from a real choice rather than the device default. */
export function localeWasChosen(): boolean {
  return explicit;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Resolve the startup locale: stored choice → device language → ko (R2).
 *
 * The onboarding answer is applied later by adoptProfileLocale, once the profile
 * has loaded — it is a weaker signal than an explicit setting but stronger than
 * the device, and it arrives after this runs.
 */
export async function loadLocale(): Promise<void> {
  let next: Locale | undefined;
  try {
    next = asLocale(await SecureStore.getItemAsync(KEY));
  } catch {
    next = undefined; // no stored preference is not an error
  }
  if (next) {
    current = next;
    explicit = true;
  } else {
    // A Japanese phone should not open to Korean just because Korean is the base.
    current = deviceLocale() ?? BASE_LOCALE;
    explicit = false;
  }
  emit();
}

export async function setLocale(next: Locale): Promise<void> {
  if (next === current && explicit) return;
  current = next;
  explicit = true;
  emit();
  try {
    await SecureStore.setItemAsync(KEY, next);
  } catch {
    /* the in-memory value still applies for this session */
  }
}

/**
 * Adopt the language the user picked during onboarding, but never override a
 * setting they made afterwards — the settings screen is the higher authority (R2).
 */
export function adoptProfileLocale(nativeLang?: string | null): void {
  if (explicit) return;
  const next = asLocale(nativeLang);
  if (!next || next === current) return;
  current = next;
  emit();
}
