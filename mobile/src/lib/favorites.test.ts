// The store's job is to survive its own history: the JSON on disk was written by an older
// version of this file, and a bad row must not become a row you cannot open or remove.
// `mock`-prefixed so jest allows the hoisted factory to reach it.
let mockStore: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: async (k: string) => mockStore[k] ?? null,
  setItemAsync: async (k: string, v: string) => {
    mockStore[k] = v;
  },
}));

import {
  floorKey,
  getFavorites,
  isFloorFavorite,
  isSituationFavorite,
  loadFavorites,
  toggleFloorFavorite,
  subscribeFavorites,
  toggleSituationFavorite,
} from '@/lib/favorites';

const KEY = 'forin.favorites.v1';
const ICU = { building: '본관', floor: '5F', place: '중환자실', code: 'ICU' };
const OR = { building: '본관', floor: '3F', place: '수술방', code: 'OR' };

beforeEach(async () => {
  mockStore = {};
  await loadFavorites();
});

test('starts empty and reads back what was starred', async () => {
  expect(getFavorites()).toEqual({ floors: [], situations: [] });
  await toggleFloorFavorite(ICU);
  expect(isFloorFavorite(ICU)).toBe(true);
  expect(JSON.parse(mockStore[KEY]).floors).toHaveLength(1);
});

test('starring again removes it', async () => {
  await toggleFloorFavorite(ICU);
  await toggleFloorFavorite(ICU);
  expect(isFloorFavorite(ICU)).toBe(false);
  expect(getFavorites().floors).toEqual([]);
});

test('the newest is first — the ward you just starred is the one you are in', async () => {
  await toggleFloorFavorite(ICU);
  await toggleFloorFavorite(OR);
  expect(getFavorites().floors.map((f) => f.place)).toEqual(['수술방', '중환자실']);
});

test('a floor is identified by building AND floor, not by either alone', async () => {
  // 본관 3F and 여성의료 3F are different places with the same floor number.
  await toggleFloorFavorite(OR);
  expect(isFloorFavorite({ building: '여성의료', floor: '3F' })).toBe(false);
  expect(floorKey(OR)).not.toBe(floorKey({ building: '여성의료', floor: '3F' }));
});

test('situations are kept by the id that opens them', async () => {
  await toggleSituationFavorite({ scenarioId: 'SCN-ICU-00004', name: '인공호흡기 알람' });
  expect(isSituationFavorite('SCN-ICU-00004')).toBe(true);
  expect(isSituationFavorite('SCN-ICU-00005')).toBe(false);
});

test('survives a reload', async () => {
  await toggleFloorFavorite(ICU);
  await toggleSituationFavorite({ scenarioId: 'SCN-ER-00001', name: '흉통' });
  await loadFavorites();
  expect(isFloorFavorite(ICU)).toBe(true);
  expect(isSituationFavorite('SCN-ER-00001')).toBe(true);
});

test('corrupt storage reads as no favourites rather than crashing', async () => {
  mockStore[KEY] = '{not json';
  await loadFavorites();
  expect(getFavorites()).toEqual({ floors: [], situations: [] });
});

test('shapes what an older version wrote', async () => {
  mockStore[KEY] = JSON.stringify({
    floors: [
      ICU,
      ICU, // duplicate
      { building: '본관' }, // no floor: unaddressable
      null,
    ],
    situations: [{ name: 'no id' }, { scenarioId: 'SCN-ER-00001' }],
  });
  await loadFavorites();
  const f = getFavorites();
  expect(f.floors.map((x) => x.place)).toEqual(['중환자실']);
  // A name is invented from the id rather than left undefined: the row has to say
  // something, and the id is the one thing that is certainly there.
  expect(f.situations).toEqual([{ scenarioId: 'SCN-ER-00001', name: 'SCN-ER-00001', where: undefined }]);
});

test('a missing array is not a crash', async () => {
  mockStore[KEY] = JSON.stringify({ floors: 'nope' });
  await loadFavorites();
  expect(getFavorites()).toEqual({ floors: [], situations: [] });
});

test('notifies subscribers so the star flips under the finger', async () => {
  const seen: boolean[] = [];
  const off = subscribeFavorites(() => seen.push(isFloorFavorite(ICU)));
  await toggleFloorFavorite(ICU);
  off();
  expect(seen).toEqual([true]);
});

// Components must derive the star from the subscription, not from a bare module read.
//
// React Compiler is on (app.json experiments), so it caches expressions by their reactive
// inputs. `isFloorFavorite({building, floor})` takes arguments that never change, so it was
// computed once per row and reused; calling useFavorites() beside it and discarding the
// result subscribed the row to re-render but left nothing for the star to depend on. The
// row re-rendered with a cached answer and the star only caught up when the building was
// collapsed and the row remounted.
//
// A source rule because the failure cannot be reproduced here: jest's transform does not
// run the compiler, so the render test for this passed the whole time the device was wrong.
test('screens read favourites through the hooks', () => {
  const { readdirSync, readFileSync, statSync } = require('fs') as typeof import('fs');
  const { join } = require('path') as typeof import('path');

  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) return walk(p);
      return (p.endsWith('.tsx') || p.endsWith('.ts')) && !p.includes('.test.') ? [p] : [];
    });

  const root = join(__dirname, '..');
  const offenders: string[] = [];
  for (const p of [...walk(join(root, 'app')), ...walk(join(root, 'components'))]) {
    const src = readFileSync(p, 'utf8').replace(/\/\/[^\n]*/g, '');
    // The bare readers, called rather than merely imported for a test.
    if (/(?<!use)\b(isFloorFavorite|isSituationFavorite)\s*\(/.test(src)) {
      offenders.push(p.slice(root.length + 1));
    }
  }
  expect(offenders).toEqual([]);
});
