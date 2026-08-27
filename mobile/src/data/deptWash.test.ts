// The dialogue background is the department's colour, washed out.
//
// At full strength (#DC2626 for ER) a full-screen band fights every bubble drawn on
// it; the peach it replaces was subtle enough that nobody complained. So the test is
// mostly about restraint.
import { deptWash } from './deptWash';
import { colors } from '@/theme/tokens';

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

test('a department colour becomes a light wash, not the colour itself', () => {
  const er = deptWash('#DC2626');
  expect(er).not.toBe('#DC2626');
  const [r, g, b] = rgb(er);
  // Still recognisably warm — red above the others.
  expect(r).toBeGreaterThan(g);
  expect(r).toBeGreaterThan(b);
  // But light enough to draw ink text and bubbles on: every channel near the top.
  expect(Math.min(r, g, b)).toBeGreaterThan(200);
});

test('different departments give different washes', () => {
  const seen = new Set(['#DC2626', '#7F1D1D', '#9333EA', '#3B82F6', '#16A34A'].map(deptWash));
  expect(seen.size).toBe(5);
});

test('a cool department reads cool', () => {
  const [r, , b] = rgb(deptWash('#3B82F6')); // PEDS blue
  expect(b).toBeGreaterThan(r);
});

test('a missing or unreadable colour falls back to the app default', () => {
  // A scenario with no colour must still look like the app, not like a bug.
  expect(deptWash(undefined)).toBe(colors.peach);
  expect(deptWash('')).toBe(colors.peach);
  expect(deptWash('not-a-colour')).toBe(colors.peach);
  expect(deptWash('#ABC')).toBe(colors.peach); // 3-digit form is not handled
});

test('the wash is deterministic', () => {
  expect(deptWash('#DC2626')).toBe(deptWash('#dc2626'));
});
