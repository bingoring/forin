// Campus hub presentation. The PATH itself (buildings → floors → curricula) comes
// from GET /me/curriculum; what stays here is only what the server has no opinion
// about — a building's colour and icon, and which departments you can walk around.
//
// The floor list used to live here too, and it had silently drifted from the
// server's: a "5-8F" row that merged four real floors, and CH.N chips pointing at
// the wrong chapters (`cur: 3` labelled the pharmacy chapter as the ward's). The
// same file also carried authored "situations" whose scenario ids named other
// scenarios entirely — 흉통 환자 트리아지 pointed at SCN-ER-00002, which is a pain
// assessment. Both are gone: one source of truth, and it is the server's.
import { colors } from '@/theme/tokens';
import type { IconName } from '@/components/PixelIcon';

export type StepKind = 'dlg' | 'quiz' | 'event' | 'boss';
export const STEP_META: Record<StepKind, { icon: IconName; label: string; bg: string }> = {
  dlg: { icon: 'speech', label: '대화', bg: colors.blue },
  quiz: { icon: 'clipboard', label: '퀴즈', bg: colors.yellow },
  event: { icon: 'bolt', label: '돌발 이벤트', bg: colors.peach },
  boss: { icon: 'trophy', label: '챕터 시험', bg: colors.pink },
};

/** Per-building colour + icon, keyed by the server's building name. */
export const BUILDING_STYLE: Record<string, { icon: IconName; accent: string; sub: string }> = {
  '본관': { icon: 'hospital', accent: '#D14B3D', sub: '응급 · 수술 · 중환자 · 병동' },
  '별관 1': { icon: 'baby', accent: '#C2487E', sub: '여성 · 소아 · 신생아' },
  '별관 2': { icon: 'sprout', accent: '#1E8A5B', sub: '재활 · 정신 · 종양 · 완화' },
  '별관 3': { icon: 'microscope', accent: '#0E7490', sub: '영상 · 외래 · 주사 · 내시경' },
  '지원동': { icon: 'box', accent: '#6E6354', sub: '영안실 · 공급 · 휴게 · 시뮬랩' },
};

/** Fallback for a building the server adds before this file learns its colour. */
export const DEFAULT_BUILDING_STYLE = { icon: 'hospital' as IconName, accent: colors.textSoft, sub: '' };

// Departments with a walkable interior (INT-<CODE>-00001). Listed rather than
// derived because the tile fixtures are bundled per-department modules — a walk
// button for a department without one would push a route that can only error.
export const INTERIOR_DEPTS = new Set([
  'DERM', 'DIAL', 'ENDO', 'ER', 'GERI', 'HOSPICE', 'ICU', 'INFUSION', 'LD',
  'LOUNGE', 'MORGUE', 'NICU', 'NURSERY', 'ONCO', 'OR', 'ORTHOWARD', 'PEDS',
  'PHARMA', 'PICU', 'PSYCH', 'RAD', 'REHAB', 'SIM', 'SPD', 'SPECIALTY',
  'SURGWARD', 'WARD',
]);

/**
 * Bank code out of a content id ("SCN-WARD-00101" → "WARD").
 *
 * The department a floor teaches is derivable from its own steps, so the server
 * does not need to send it and the two cannot disagree.
 */
export function deptCodeOf(contentID?: string): string | undefined {
  if (!contentID) return undefined;
  const parts = contentID.split('-');
  return parts.length >= 3 ? parts[1] : undefined;
}
