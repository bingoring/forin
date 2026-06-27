// Guards the shared scenario rotation: deterministic per day, correct quota,
// and the dept counts the elevator/board chips read.
import { getTodaysActiveScenarios, deptCounts, getScenarioById, SCENARIOS } from './scenarios';

describe('scenario daily rotation', () => {
  const day = new Date(2026, 4, 14); // frozen demo date

  test('all scenario ids are unique and depts are valid', () => {
    const ids = new Set(SCENARIOS.map((s) => s.id));
    expect(ids.size).toBe(SCENARIOS.length);
    for (const s of SCENARIOS) {
      expect(['ER', 'OR', 'ICU', 'PEDS', 'PHARMA']).toContain(s.dept);
      expect(s.weight).toBeGreaterThan(0);
    }
  });

  test('picks 6/day with the per-dept quota (ER2 OR1 ICU1 PEDS1 PHARMA1)', () => {
    const picked = getTodaysActiveScenarios(day);
    expect(picked.length).toBe(6);
    const byDept = picked.reduce<Record<string, number>>((m, s) => ((m[s.dept] = (m[s.dept] ?? 0) + 1), m), {});
    expect(byDept).toEqual({ ER: 2, OR: 1, ICU: 1, PEDS: 1, PHARMA: 1 });
    // no dept picks the same scenario twice
    expect(new Set(picked.map((s) => s.id)).size).toBe(6);
  });

  test('is deterministic for a given date and changes across dates', () => {
    const a = getTodaysActiveScenarios(day).map((s) => s.id);
    const b = getTodaysActiveScenarios(new Date(2026, 4, 14)).map((s) => s.id);
    expect(a).toEqual(b);
    const c = getTodaysActiveScenarios(new Date(2026, 4, 15)).map((s) => s.id);
    expect(c).not.toEqual(a); // different day → (very likely) different roll
  });

  test('deptCounts matches the picked list', () => {
    const counts = deptCounts(day);
    expect(counts.ER.total).toBe(2);
    expect(counts.OR.total).toBe(1);
    // every picked scenario resolves back to a real scenario
    for (const s of getTodaysActiveScenarios(day)) expect(getScenarioById(s.id)).toBeTruthy();
  });
});
