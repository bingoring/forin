import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { setAppLocale, i18n } from '../locales';

/**
 * Keeps i18n.locale in sync with the authenticated user's native_language.
 * Pre-login, i18n.locale is already set to the device locale by
 * `mobile/src/locales/index.ts`.
 */
export function useLocale(): string {
  const userLocale = useAuthStore((s) => s.user?.native_language);

  useEffect(() => {
    if (userLocale) {
      setAppLocale(userLocale);
    }
  }, [userLocale]);

  return i18n.locale;
}
