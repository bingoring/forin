import { monthWeeks } from '@/data/monthGrid';

test('every week has exactly seven days', () => {
  // The property the old grid could not hold: it relied on seven percentage widths adding
  // up in layout, and a rounding-up container dropped the seventh column entirely.
  for (const month of ['2026-08', '2026-02', '2024-02', '2026-11', '2027-01']) {
    for (const week of monthWeeks(month)) expect(week).toHaveLength(7);
  }
});

test('Monday-first: 2026-08-01 is a Saturday, so it sits in the sixth column', () => {
  // 월화수목금토일 → Saturday is index 5, Sunday index 6. The bug put the 1st in column 6
  // and then the 2nd in the NEXT row's first column, leaving Sunday blank.
  const weeks = monthWeeks('2026-08');
  expect(weeks[0].slice(0, 5)).toEqual([null, null, null, null, null]);
  expect(weeks[0][5]).toBe('2026-08-01');
  expect(weeks[0][6]).toBe('2026-08-02'); // Sunday, not blank
});

test('a month starting on a Monday has no leading blanks', () => {
  // 2026-06-01 is a Monday.
  expect(monthWeeks('2026-06')[0][0]).toBe('2026-06-01');
});

test('a month starting on a Sunday fills the first row and starts the next', () => {
  // 2026-02-01 is a Sunday: last column of week one.
  const weeks = monthWeeks('2026-02');
  expect(weeks[0][6]).toBe('2026-02-01');
  expect(weeks[1][0]).toBe('2026-02-02');
});

test('holds every day of the month, once, in order', () => {
  const days = monthWeeks('2026-08').flat().filter(Boolean);
  expect(days).toHaveLength(31);
  expect(days[0]).toBe('2026-08-01');
  expect(days[30]).toBe('2026-08-31');
  expect(new Set(days).size).toBe(31);
});

test('a leap February is 29 days', () => {
  expect(monthWeeks('2024-02').flat().filter(Boolean)).toHaveLength(29);
});

test('a malformed month is an empty grid, not a crash', () => {
  expect(monthWeeks('')).toEqual([]);
  expect(monthWeeks('nonsense')).toEqual([]);
});

test('no calendar cell sizes itself with a seventh of a percent', () => {
  // The rounding this replaced is invisible until a container width makes it round up, so
  // the shape is pinned rather than the symptom: a seven-column grid divides a row, it does
  // not wrap a run of percentage widths.
  const { readFileSync } = require('fs') as typeof import('fs');
  const { join } = require('path') as typeof import('path');
  const src = readFileSync(join(__dirname, '..', 'components', 'growth', 'ActivityCalendar.tsx'), 'utf8');
  expect(src).not.toMatch(/100\s*\/\s*7/);
  expect(src).not.toMatch(/flexWrap:\s*'wrap'[^}]*}\s*>\s*\{?\s*weeks/);
  expect(src).toMatch(/weeks\.map/);
});
