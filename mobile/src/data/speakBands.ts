// The score bands the handoff's 직접 말하기 연습 block is built on: 60↓ / 60–79 /
// 80+ (04_SCREENS ⑨). One module so the summary block, the result screen and the
// full list can never draw three different boundaries for the same score.
import { BAND } from '@/components/pron/nbPron';
import type { SpokenSentence } from '@/api/client';

export type Band = 'low' | 'mid' | 'high';

/** Boundaries are LOWER-inclusive: 60 is 'mid', 80 is 'high'. The handoff writes
 *  the bands as "60↓ / 60–79 / 80+", so a flat 60 belongs to the middle band and
 *  a flat 80 to the top — an exclusive `> 60` would file both one band too low. */
export function bandOf(overall: number): Band {
  if (overall >= 80) return 'high';
  if (overall >= 60) return 'mid';
  return 'low';
}

/** Band colours are the SAME three the pronunciation screen stamps its syllables with
 *  (components/pron/nbPron) — pink needs work, yellow is getting there, green is good.
 *  One palette, because a sentence scored 42 is drawn on three screens and a learner
 *  comparing them must not have to learn two colour languages. */
export function bandColor(band: Band): string {
  return band === 'high' ? BAND.ok : band === 'mid' ? BAND.weak : BAND.bad;
}

/** i18n key for a band's label, so the bar legend is translated like everything
 *  else rather than hard-coding "60↓". */
export function bandLabelKey(band: Band): string {
  return `speak.band.${band}`;
}

/** Widths for the distribution bar, as percentages that always sum to 100 when
 *  the total is positive.
 *
 *  The rounding is deliberate: naive Math.round on three shares can sum to 101
 *  and push the last segment onto a second line inside a flex row. The largest
 *  band absorbs the remainder instead, so the bar is always exactly full. */
export function bandWidths(counts: { total: number; low: number; mid: number; high: number }): { low: number; mid: number; high: number } {
  const { total } = counts;
  if (total <= 0) return { low: 0, mid: 0, high: 0 };
  const pct = (n: number) => Math.round((n / total) * 100);
  const w = { low: pct(counts.low), mid: pct(counts.mid), high: pct(counts.high) };
  const drift = 100 - (w.low + w.mid + w.high);
  if (drift !== 0) {
    const biggest = (['low', 'mid', 'high'] as Band[]).reduce((a, b) => (counts[b] > counts[a] ? b : a), 'low');
    w[biggest] += drift;
  }
  return w;
}

/** The badge number shown for an average or a sentence score. Scores arrive as
 *  raw floats from the scorer; the screen shows whole points. */
export function scoreLabel(n: number): string {
  return String(Math.round(n));
}

/** Department code for a sentence's chip, parsed from its scenario id
 *  (SCN-ER-00002 → ER). Returns '' for a sentence practised outside a scenario,
 *  which the list renders with no chip rather than a fake one. */
export function deptOf(s: SpokenSentence): string {
  const m = /^SCN-([A-Z0-9]+)-/.exec(s.scenarioId ?? '');
  return m ? m[1] : '';
}
