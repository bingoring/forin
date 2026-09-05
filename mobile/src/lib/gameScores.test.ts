// Break-time game scores: the daily play limit resets by date, and a best score only
// ever climbs. Singleton module state, so the tests run in order.
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));

import {
  AD_GRANTS_PER_DAY, AD_PLAYS_GRANT, MAX_PLAYS_PER_DAY, bestScore, canGrantPlays,
  grantPlaysFromAd, playsLeft, playsToday, recordBest, startPlay,
} from '@/lib/gameScores';

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

test('a watched ad grants extra plays, up to the daily cap', () => {
  const day = '2026-09-07'; // a fresh day, so the base allowance is untouched
  expect(playsLeft(day)).toBe(MAX_PLAYS_PER_DAY);
  expect(grantPlaysFromAd(day)).toBe(true);
  expect(playsLeft(day)).toBe(MAX_PLAYS_PER_DAY + AD_PLAYS_GRANT);
  grantPlaysFromAd(day);
  grantPlaysFromAd(day); // three grants total = the cap
  expect(canGrantPlays(day)).toBe(false);
  expect(grantPlaysFromAd(day)).toBe(false); // capped, no more
  expect(playsLeft(day)).toBe(MAX_PLAYS_PER_DAY + AD_GRANTS_PER_DAY * AD_PLAYS_GRANT);
});

test('best score only climbs', () => {
  recordBest('circle', 80);
  expect(bestScore('circle')).toBe(80);
  recordBest('circle', 60); // lower — ignored
  expect(bestScore('circle')).toBe(80);
  recordBest('circle', 91);
  expect(bestScore('circle')).toBe(91);
});
