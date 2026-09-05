// A best score must survive a relaunch: recordBest persists to the device, and
// loadGameScores at boot reads it back. This is the round-trip the hub relies on — the
// in-memory "best only climbs" is covered in gameScores.test.ts; this proves it is written
// and re-hydrated, not just held in a module singleton.
const mockStore: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: async (k: string) => (k in mockStore ? mockStore[k] : null),
  setItemAsync: async (k: string, v: string) => { mockStore[k] = v; },
}));

test('a best score is written to the device and rehydrated on the next launch', async () => {
  const gs = require('@/lib/gameScores') as typeof import('@/lib/gameScores');
  gs.recordBest('hoops', 42);
  // let the fire-and-forget persist() write settle
  await new Promise((r) => setTimeout(r, 0));
  expect(mockStore['forin.games.v1']).toContain('42');

  // Simulate a fresh launch: a new module instance with empty state, hydrated from the
  // same device store.
  jest.resetModules();
  const gs2 = require('@/lib/gameScores') as typeof import('@/lib/gameScores');
  expect(gs2.bestScore('hoops')).toBeUndefined(); // nothing in memory yet
  await gs2.loadGameScores();
  expect(gs2.bestScore('hoops')).toBe(42); // read back from the device
});
