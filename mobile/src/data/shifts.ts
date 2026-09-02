// What "when you studied" is called, per job.
//
// A nurse reading their own week wants it to look like a roster, and a roster's unit is
// a shift — 데이/이브닝/나이트. That vocabulary is not universal: a software engineer
// has no evening shift, and borrowing hospital words for them would be costume rather
// than information. So the server sends a BAND CODE (day/evening/night, decided from
// the hour the attempt started) and each job decides what to call it.
//
// Code-side per-job table, no DB constraint — a new profession brings a row here.
import type { NbIconName } from '@/components/nb/NbIcon';

export type Band = 'day' | 'evening' | 'night';

export const BANDS: Band[] = ['day', 'evening', 'night'];

/** Colour and icon are shared across jobs: they encode the time of day, not the job.
 *
 *  The three washes are the notebook's own — a roster is written in pen, and the band is
 *  the wash the row is highlighted with. v29 07 is explicit that a calendar cell carries
 *  colour ONLY (셀 이모지 금지), so the icon appears in the day's detail, never in a cell. */
export const BAND_STYLE: Record<Band, { bg: string; nbIcon: NbIconName }> = {
  day: { bg: 'rgba(249,227,123,.5)', nbIcon: 'star' },
  evening: { bg: '#FFF3EE', nbIcon: 'bulb' },
  night: { bg: 'rgba(195,177,232,.35)', nbIcon: 'monitor' },
};

/**
 * i18n key for a band's label, given the learner's job.
 *
 * Falls back to the plain time-of-day naming for any job without a shift culture, which
 * is also what an unknown job gets — a job we have never seen should read as neutral
 * rather than be told it works nights.
 */
export function bandLabelKey(job: string | undefined, band: Band): string {
  const family = SHIFT_JOBS.has(job ?? '') ? 'shift' : 'plain';
  return `band.${family}.${band}`;
}

/** Jobs whose day is actually organised into shifts. */
const SHIFT_JOBS = new Set(['nurse', 'doctor', 'paramedic', 'caregiver']);

/** True when this job's calendar should be framed as a roster at all. */
export function usesShifts(job: string | undefined): boolean {
  return SHIFT_JOBS.has(job ?? '');
}
