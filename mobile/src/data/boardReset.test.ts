import { msUntilReset, resetLabel } from '@/data/boardReset';

const at = (h: number, m: number, s = 0) => new Date(2026, 7, 20, h, m, s);

test('counts down to the next local midnight', () => {
  expect(msUntilReset(at(23, 0))).toBe(60 * 60_000);
  expect(msUntilReset(at(0, 0))).toBe(24 * 60 * 60_000);
});

test('reads as hours and minutes, and drops a zero hour', () => {
  expect(resetLabel(at(9, 30))).toEqual({ key: 'board.resetHM', params: { h: 14, m: 30 } });
  expect(resetLabel(at(23, 20))).toEqual({ key: 'board.resetM', params: { m: 40 } });
});

test('says "soon" rather than counting the last seconds', () => {
  // A chip that flips every second in the corner of a list is worse than one that says
  // the day is nearly over.
  expect(resetLabel(at(23, 59, 30))).toEqual({ key: 'board.resetSoon' });
});

test('never goes negative across the boundary', () => {
  // Midnight itself is a full day away, not zero: the pool for the new day has begun.
  expect(msUntilReset(at(0, 0))).toBeGreaterThan(0);
  expect(resetLabel(at(0, 0)).key).toBe('board.resetHM');
});
