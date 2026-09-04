// Break-time game scores: the daily play limit resets by date, and a best score only
// ever climbs. Singleton module state, so the tests run in order.
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));

import { MAX_PLAYS_PER_DAY, bestScore, playsLeft, playsToday, recordBest, startPlay } from '@/lib/gameScores';

test('plays count up against the daily limit', () => {
  const day = '2026-09-05';
  expect(playsToday(day)).toBe(0);
  startPlay(day);
  startPlay(day);
  expect(playsToday(day)).toBe(2);
  expect(playsLeft(day)).toBe(MAX_PLAYS_PER_DAY - 2);
});

test('a new day resets the count', () => {
  startPlay('2026-09-05'); // same day as above → 3
  expect(playsToday('2026-09-06')).toBe(0); // a different date reads as fresh
  startPlay('2026-09-06');
  expect(playsToday('2026-09-06')).toBe(1);
  expect(playsLeft('2026-09-06')).toBe(MAX_PLAYS_PER_DAY - 1);
});

test('best score only climbs', () => {
  recordBest('circle', 80);
  expect(bestScore('circle')).toBe(80);
  recordBest('circle', 60); // lower — ignored
  expect(bestScore('circle')).toBe(80);
  recordBest('circle', 91);
  expect(bestScore('circle')).toBe(91);
});
