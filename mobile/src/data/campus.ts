// Campus hub presentation. The PATH itself (buildings → floors → curricula) used to
// come from the server's now-retired campus route (L4.4 — the journey map replaced
// the campus screen); what stays here is only what the server had no opinion about —
// a building's colour and icon, and which departments you can walk around.
//
// The floor list used to live here too, and it had silently drifted from the
// server's: a "5-8F" row that merged four real floors, and CH.N chips pointing at
// the wrong chapters (`cur: 3` labelled the pharmacy chapter as the ward's). The
// same file also carried authored "situations" whose scenario ids named other
// scenarios entirely — 흉통 환자 트리아지 pointed at SCN-ER-00002, which is a pain
// assessment. Both are gone: one source of truth, and it is the server's.
import { colors } from '@/theme/tokens';
import type { IconName } from '@/components/PixelIcon';
import type { NbIconName } from '@/components/nb/NbIcon';
import type { FIconName } from '@/theme/ficons';

export type StepKind = 'dlg' | 'quiz' | 'event' | 'boss';
// labelKey, not a label: this is a module constant, so a t() call would freeze the
// text to the language at startup (see i18n/module-scope.test.ts).
export const STEP_META: Record<StepKind, { icon: IconName; nbIcon: NbIconName; labelKey: string; bg: string }> = {
  // `nbIcon` is the 근무 수첩 doodle beside the pixel line's `icon` — a step is a talk, a
  // quiz or a chapter test, and the notebook says that with a speech bubble, a pencil and
  // a trophy. Two names because a screen belongs to one line or the other (07).
  dlg: { icon: 'speech', nbIcon: 'speech', labelKey: 'step.kind.dlg', bg: colors.blue },
  quiz: { icon: 'clipboard', nbIcon: 'pencil', labelKey: 'step.kind.quiz', bg: colors.yellow },
  event: { icon: 'bolt', nbIcon: 'siren', labelKey: 'step.kind.event', bg: colors.peach },
  boss: { icon: 'trophy', nbIcon: 'trophy', labelKey: 'step.kind.boss', bg: colors.pink },
};

/**
 * Per-building colour + icon, keyed by the server's building name.
 *
 * The icons are SYMBOLS, not buildings — v25 02_COMPONENTS: "건물·층 목록에서는
 * 건물 외형이 아니라 그 건물을 대표하는 상징물(물건) 아이콘을 쓴다. 건물형
 * 아이콘(tower/women/onco/clinic/admin/dx)은 FICONS에 보존되어 있으나 목록에서는
 * 미사용." A row of five near-identical building silhouettes tells the reader
 * nothing; a stethoscope, a baby, an IV bag, a magnifier and a gear are legible at
 * 16px and say what happens inside.
 *
 * The KEYS stay Korean because they are not display text — they are the exact
 * building-name strings the old (now-retired, L4.4) campus route sent, and the
 * lookup has to match them. The subtitle is display text, so it carries a
 * translation key.
 */
export const BUILDING_STYLE: Record<string, { icon: FIconName; nbIcon: NbIconName; accent: string; subKey: string; nameKey: string }> = {
  // `nbIcon` is the 근무 수첩 line's doodle, beside the pixel line's `icon`. Two names
  // rather than one because they are not the same drawing at two sizes, and a screen
  // belongs to one line or the other (07). The KEYS are the server's building names, which
  // is why this table lives in src/data — src/app and src/components may hold no Korean
  // literals at all (i18n/ceiling), and these are data, not copy. `nameKey` localizes the
  // DISPLAY name while the Korean key stays the lookup id the server sends.
  '본관': { icon: 'stetho', nbIcon: 'siren', accent: '#D14B3D', subKey: 'building.main.sub', nameKey: 'building.main.name' },
  '별관 1': { icon: 'baby', nbIcon: 'baby', accent: '#C2487E', subKey: 'building.annex1.sub', nameKey: 'building.annex1.name' },
  '별관 2': { icon: 'ivbag', nbIcon: 'pill', accent: '#1E8A5B', subKey: 'building.annex2.sub', nameKey: 'building.annex2.name' },
  '별관 3': { icon: 'magnify', nbIcon: 'monitor', accent: '#0E7490', subKey: 'building.annex3.sub', nameKey: 'building.annex3.name' },
  '지원동': { icon: 'gear', nbIcon: 'board', accent: '#6E6354', subKey: 'building.support.sub', nameKey: 'building.support.name' },
};

/** Fallback for a building the server adds before this file learns its colour.
 *  `pin` rather than a building: a place we cannot name yet is still a place, and
 *  the principle above rules out drawing a generic hospital. */
export const DEFAULT_BUILDING_STYLE = { icon: 'pin' as FIconName, nbIcon: 'hospital' as NbIconName, accent: colors.textSoft, subKey: '' };

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

/**
 * The 근무 수첩 doodle that stands for a department, used where a row names a
 * scenario by its content id (모범답안 목록 등). The icons are a small shared
 * vocabulary — siren for the ER, an incubator baby for the newborn units, a pill
 * for the med-facing floors — so the same department reads the same way wherever
 * it appears, matching design-handoff v40's 리뷰랩 · 모범답안.
 *
 * Every department that ships scenarios is listed; anything unmapped (a future
 * bank, a malformed id) falls back to the stethoscope rather than a blank slot.
 */
const DEPT_NB_ICON: Record<string, NbIconName> = {
  ER: 'siren',
  ICU: 'monitor', PICU: 'monitor', DIAL: 'monitor', SIM: 'monitor',
  NICU: 'baby', NURSERY: 'baby', LD: 'baby', PEDS: 'baby', WOMENKIDS: 'baby', WOMEN: 'baby',
  OR: 'scalpel', SURGWARD: 'scalpel',
  ORTHOWARD: 'bandage', REHAB: 'bandage', DERM: 'bandage',
  PHARMA: 'pill', INFUSION: 'pill', ONCO: 'pill', ENDO: 'pill',
  RAD: 'magnify', DX: 'magnify',
  LOUNGE: 'coffee',
  GERI: 'shield', HOSPICE: 'shield', MORGUE: 'shield',
  PSYCH: 'bulb',
  SPD: 'gear',
  ADMIN: 'board',
  ORIENT: 'compass',
};

/** The department doodle for a scenario/event id — see {@link DEPT_NB_ICON}. */
export function deptNbIcon(contentID?: string): NbIconName {
  const code = deptCodeOf(contentID);
  return (code && DEPT_NB_ICON[code]) || 'stetho';
}
