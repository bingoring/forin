import { bandOf, bandWidths, deptOf, scoreLabel } from './speakBands';
import type { SpokenSentence } from '@/api/client';

const row = (over: Partial<SpokenSentence>): SpokenSentence => ({
  sentenceKey: 'k', referenceText: 'text', recognized: 'text', overall: 50,
  accuracy: 50, fluency: 50, completeness: 100, attempts: 1, createdAt: '', ...over,
});

// The handoff writes the bands "60↓ / 60–79 / 80+", so the boundaries are
// lower-inclusive. An exclusive `> 60` would file both 60 and 80 one band low.
test('band boundaries are lower-inclusive', () => {
  expect(bandOf(0)).toBe('low');
  expect(bandOf(59.9)).toBe('low');
  expect(bandOf(60)).toBe('mid');
  expect(bandOf(79.9)).toBe('mid');
  expect(bandOf(80)).toBe('high');
  expect(bandOf(100)).toBe('high');
});

// Three rounded shares can sum to 101 and wrap the last segment onto a second
// line inside a flex row. The bar must always be exactly full.
test('band widths always sum to exactly 100', () => {
  for (const counts of [
    { total: 3, low: 1, mid: 1, high: 1 },     // 33+33+33 = 99
    { total: 6, low: 1, mid: 2, high: 3 },
    { total: 7, low: 2, mid: 2, high: 3 },
    { total: 128, low: 10, mid: 40, high: 78 },
    { total: 1, low: 0, mid: 0, high: 1 },
  ]) {
    const w = bandWidths(counts);
    expect(w.low + w.mid + w.high).toBe(100);
  }
});

test('an empty distribution has no width at all, rather than 100 of nothing', () => {
  expect(bandWidths({ total: 0, low: 0, mid: 0, high: 0 })).toEqual({ low: 0, mid: 0, high: 0 });
});

test('scores render as whole points', () => {
  expect(scoreLabel(81.4)).toBe('81');
  expect(scoreLabel(0)).toBe('0');
});

// The chip comes from the scenario id; a sentence practised outside a scenario
// gets no chip rather than an invented one.
test('department is parsed from the scenario id, and absent when there is none', () => {
  expect(deptOf(row({ scenarioId: 'SCN-ER-00002' }))).toBe('ER');
  expect(deptOf(row({ scenarioId: 'SCN-NICU-00101' }))).toBe('NICU');
  expect(deptOf(row({ scenarioId: '' }))).toBe('');
  expect(deptOf(row({}))).toBe('');
  expect(deptOf(row({ scenarioId: 'garbage' }))).toBe('');
});
