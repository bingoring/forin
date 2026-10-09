// GET /config/economy carries pronunciationEnabled next to the economy numbers. The server
// half shipped without the app reading it, so a deploy with no Azure key still drew every
// mic button (cross-review I2) — this pins the hand-off from the response to the flag.
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

import { api } from './client';
import { isPronunciationEnabled, resetPronunciationEnabled } from '@/data/pronunciationFlag';

afterEach(() => { jest.restoreAllMocks(); resetPronunciationEnabled(); });

test('economyConfig() turns the pronunciation flag off when the server says false', async () => {
  jest.spyOn(api.raw, 'get').mockResolvedValue({ data: { pronunciationEnabled: false, xpPerLevel: 100 } });
  await api.economyConfig();
  expect(isPronunciationEnabled()).toBe(false);
});

test('economyConfig() leaves it on when the response has no flag', async () => {
  jest.spyOn(api.raw, 'get').mockResolvedValue({ data: { xpPerLevel: 100 } });
  await api.economyConfig();
  expect(isPronunciationEnabled()).toBe(true);
});
