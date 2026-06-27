// Shared scenario source (5f-ii). The single source of truth for "what's active
// today" — consumed by the Elevator situation chips now, and by the 상황판 / dept
// interiors later, so they always agree (handoff v8). Ported from the reference
// scenarios-data.jsx; only the fields needed to drive selection + chips are kept
// here — the rich briefing/dialogue content is the content workstream / 2-6.

export type Dept = 'ER' | 'OR' | 'ICU' | 'PEDS' | 'PHARMA';
export type Urgency = 'urgent' | 'quest' | 'info';

export interface ScenarioMeta {
  id: string;
  dept: Dept;
  urgency: Urgency;
  weight: number; // selection weight in the daily rotation
}

/** Per-department display info (name + tone), used by chips/board. */
export const DEPT_INFO: Record<Dept, { name: string; color: string }> = {
  ER: { name: '응급실', color: '#DC2626' },
  OR: { name: '수술실', color: '#9333EA' },
  ICU: { name: '중환자실', color: '#0891B2' },
  PEDS: { name: '소아과', color: '#3B82F6' },
  PHARMA: { name: '약국', color: '#16A34A' },
};

export const SCENARIOS: ScenarioMeta[] = [
  { id: 'er-hopkins-pain', dept: 'ER', urgency: 'urgent', weight: 1.5 },
  { id: 'er-police-jdoe', dept: 'ER', urgency: 'urgent', weight: 0.6 },
  { id: 'er-paramedic-mvc', dept: 'ER', urgency: 'urgent', weight: 1.2 },
  { id: 'er-anaphylaxis', dept: 'ER', urgency: 'urgent', weight: 0.9 },
  { id: 'er-chest-pain', dept: 'ER', urgency: 'quest', weight: 1.0 },
  { id: 'er-mental-health', dept: 'ER', urgency: 'urgent', weight: 0.5 },
  { id: 'er-language-barrier', dept: 'ER', urgency: 'quest', weight: 1.0 },
  { id: 'er-fever-child', dept: 'ER', urgency: 'quest', weight: 1.0 },
  { id: 'or-garcia-consent', dept: 'OR', urgency: 'quest', weight: 1.2 },
  { id: 'or-timeout', dept: 'OR', urgency: 'quest', weight: 1.0 },
  { id: 'or-instrument-pass', dept: 'OR', urgency: 'quest', weight: 0.7 },
  { id: 'or-pacu-handoff', dept: 'OR', urgency: 'quest', weight: 1.1 },
  { id: 'or-family-update', dept: 'OR', urgency: 'info', weight: 0.9 },
  { id: 'peds-crying-mia', dept: 'PEDS', urgency: 'urgent', weight: 1.4 },
  { id: 'peds-vax-explain', dept: 'PEDS', urgency: 'quest', weight: 1.2 },
  { id: 'peds-fever-assessment', dept: 'PEDS', urgency: 'quest', weight: 1.0 },
  { id: 'peds-anxious-parent', dept: 'PEDS', urgency: 'info', weight: 0.9 },
  { id: 'peds-immunization-consent', dept: 'PEDS', urgency: 'info', weight: 1.0 },
  { id: 'icu-park-vent', dept: 'ICU', urgency: 'urgent', weight: 1.0 },
  { id: 'icu-eol-family', dept: 'ICU', urgency: 'info', weight: 0.4 },
  { id: 'icu-code-blue', dept: 'ICU', urgency: 'urgent', weight: 0.7 },
  { id: 'icu-psychosis', dept: 'ICU', urgency: 'quest', weight: 0.9 },
  { id: 'icu-monitor-alarm', dept: 'ICU', urgency: 'quest', weight: 1.0 },
  { id: 'pharma-heparin', dept: 'PHARMA', urgency: 'quest', weight: 1.2 },
  { id: 'pharma-verbal-order', dept: 'PHARMA', urgency: 'quest', weight: 1.3 },
  { id: 'pharma-pediatric-dose', dept: 'PHARMA', urgency: 'quest', weight: 0.8 },
  { id: 'pharma-controlled-pickup', dept: 'PHARMA', urgency: 'info', weight: 0.6 },
  { id: 'pharma-iv-admixture', dept: 'PHARMA', urgency: 'urgent', weight: 0.8 },
];

// deterministic PRNG seeded by the calendar day → the rotation re-rolls at midnight
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedSample(items: ScenarioMeta[], k: number, rng: () => number): ScenarioMeta[] {
  const pool = items.slice();
  const out: ScenarioMeta[] = [];
  while (out.length < k && pool.length > 0) {
    const totalW = pool.reduce((s, it) => s + (it.weight || 1), 0);
    let r = rng() * totalW;
    let i = 0;
    while (i < pool.length) {
      r -= pool[i].weight || 1;
      if (r < 0) break;
      i++;
    }
    i = Math.min(i, pool.length - 1);
    out.push(pool[i]);
    pool.splice(i, 1);
  }
  return out;
}

const QUOTAS: Record<Dept, number> = { ER: 2, OR: 1, ICU: 1, PEDS: 1, PHARMA: 1 };

/** Today's active scenarios (~6/day), deterministic per calendar date. */
export function getTodaysActiveScenarios(date: Date = new Date()): ScenarioMeta[] {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const rng = mulberry32(seed);
  const picked: ScenarioMeta[] = [];
  (Object.keys(QUOTAS) as Dept[]).forEach((dept) => {
    const candidates = SCENARIOS.filter((s) => s.dept === dept);
    picked.push(...weightedSample(candidates, QUOTAS[dept], rng));
  });
  return picked;
}

/** Live count per dept code (synced with the board) — {total, urgent}. */
export function deptCounts(date: Date = new Date()): Record<string, { total: number; urgent: number }> {
  const out: Record<string, { total: number; urgent: number }> = {};
  for (const s of getTodaysActiveScenarios(date)) {
    const d = out[s.dept] || (out[s.dept] = { total: 0, urgent: 0 });
    d.total++;
    if (s.urgency === 'urgent') d.urgent++;
  }
  return out;
}

export function getScenarioById(id: string): ScenarioMeta | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function scenariosByDept(dept: Dept): ScenarioMeta[] {
  return SCENARIOS.filter((s) => s.dept === dept);
}
