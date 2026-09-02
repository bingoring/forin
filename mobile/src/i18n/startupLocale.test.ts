// What language the app opens in, on a phone that has never run it.
//
// The rule is: a stored choice, else the DEVICE, else Korean. It was already written that
// way; this is here because the passport flow now pre-answers its language page from
// whatever the app is showing, so "the app opens in the device's language" stopped being
// an internal detail and became the reason a card arrives already chosen. A regression to
// "always Korean" would show a Japanese learner a Korean app AND a Korean answer to
// confirm, which is worse than either alone.
const mockStored: { value: string | null } = { value: null };
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => mockStored.value,
  setItemAsync: async () => {},
  deleteItemAsync: async () => {},
}));

import { getLocale, loadLocale, localeWasChosen } from './store';

/** Pretend the phone is set to `tag`. Intl is what the store reads — no extra dependency
 *  for something the platform already knows. */
function deviceIs(tag: string) {
  const real = Intl.DateTimeFormat;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Intl as any).DateTimeFormat = function fake() {
    return { resolvedOptions: () => ({ locale: tag }) };
  };
  return () => { (Intl as unknown as { DateTimeFormat: typeof real }).DateTimeFormat = real; };
}

afterEach(() => { mockStored.value = null; });

test('a first launch follows the device', async () => {
  for (const [device, want] of [['ja-JP', 'ja'], ['de-DE', 'de'], ['en-US', 'en'], ['ko-KR', 'ko']] as const) {
    const restore = deviceIs(device);
    await loadLocale();
    restore();
    expect(getLocale()).toBe(want);
    // …and it does NOT count as a choice. The difference is visible: the passport's
    // language page says "matched to your device" only while this is false.
    expect(localeWasChosen()).toBe(false);
  }
});

test('a language the app does not have falls back to Korean, not to nothing', async () => {
  const restore = deviceIs('fr-FR');
  await loadLocale();
  restore();
  expect(getLocale()).toBe('ko');
});

test('a stored choice beats the device', async () => {
  mockStored.value = 'de';
  const restore = deviceIs('ja-JP');
  await loadLocale();
  restore();
  expect(getLocale()).toBe('de');
  expect(localeWasChosen()).toBe(true);
});
