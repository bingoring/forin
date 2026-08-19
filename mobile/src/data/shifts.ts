// What "when you studied" is called, per job.
//
// A nurse reading their own week wants it to look like a roster, and a roster's unit is
// a shift — 데이/이브닝/나이트. That vocabulary is not universal: a software engineer
// has no evening shift, and borrowing hospital words for them would be costume rather
// than information. So the server sends a BAND CODE (day/evening/night, decided from
// the hour the attempt started) and each job decides what to call it.
//
// Code-side per-job table, no DB constraint — a new profession brings a row here.
import type { IconName } from '@/components/PixelIcon';
import { colors } from '@/theme/tokens';

export type Band = 'day' | 'evening' | 'night';

export const BANDS: Band[] = ['day', 'evening', 'night'];

/** Colour and icon are shared across jobs: they encode the time of day, not the job. */
export const BAND_STYLE: Record<Band, { bg: string; icon: IconName }> = {
  day: { bg: colors.yellow, icon: 'star' },
  evening: { bg: colors.peach, icon: 'bulb' },
  night: { bg: colors.lilac, icon: 'moon' },
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
