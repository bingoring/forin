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
import type { NbIconName } from '@/components/nb/NbIcon';
import type { FIconName } from '@/theme/ficons';

export type StepKind = 'dlg' | 'quiz' | 'event' | 'boss';
// labelKey, not a label: this is a module constant, so a t() call would freeze the
// text to the language at startup (see i18n/module-scope.test.ts).
export const STEP_META: Record<StepKind, { icon: IconName; labelKey: string; bg: string }> = {
  dlg: { icon: 'speech', labelKey: 'step.kind.dlg', bg: colors.blue },
  quiz: { icon: 'clipboard', labelKey: 'step.kind.quiz', bg: colors.yellow },
  event: { icon: 'bolt', labelKey: 'step.kind.event', bg: colors.peach },
  boss: { icon: 'trophy', labelKey: 'step.kind.boss', bg: colors.pink },
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
 * strings GET /me/curriculum sends, and the lookup has to match them. The subtitle
 * is display text, so it carries a translation key.
 */
export const BUILDING_STYLE: Record<string, { icon: FIconName; nbIcon: NbIconName; accent: string; subKey: string }> = {
  // `nbIcon` is the 근무 수첩 line's doodle, beside the pixel line's `icon`. Two names
  // rather than one because they are not the same drawing at two sizes, and a screen
  // belongs to one line or the other (07). The KEYS are the server's building names, which
  // is why this table lives in src/data — src/app and src/components may hold no Korean
  // literals at all (i18n/ceiling), and these are data, not copy.
  '본관': { icon: 'stetho', nbIcon: 'siren', accent: '#D14B3D', subKey: 'building.main.sub' },
  '별관 1': { icon: 'baby', nbIcon: 'baby', accent: '#C2487E', subKey: 'building.annex1.sub' },
  '별관 2': { icon: 'ivbag', nbIcon: 'pill', accent: '#1E8A5B', subKey: 'building.annex2.sub' },
  '별관 3': { icon: 'magnify', nbIcon: 'monitor', accent: '#0E7490', subKey: 'building.annex3.sub' },
  '지원동': { icon: 'gear', nbIcon: 'board', accent: '#6E6354', subKey: 'building.support.sub' },
};

/** Fallback for a building the server adds before this file learns its colour.
 *  `pin` rather than a building: a place we cannot name yet is still a place, and
 *  the principle above rules out drawing a generic hospital. */
export const DEFAULT_BUILDING_STYLE = { icon: 'pin' as FIconName, nbIcon: 'hospital' as NbIconName, accent: colors.textSoft, subKey: '' };

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

/**
 * The department a FLOOR belongs to: the code most of its steps come from.
 *
 * Not the first step's code. 본관 1F opens with the three authored orientation
 * scenarios (SCN-ORIENT-*), so reading the first step gave "ORIENT" — a bank that does
 * not exist — and that floor's situation list came back empty while all 23 others
 * worked. Counting over every step is right for the same reason it is obvious in
 * hindsight: a floor is where most of its content is, not where its first step is.
 *
 * Ties break toward the code seen first, so a two-department floor answers the same way
 * every time instead of flipping with iteration order.
 */
export function floorDeptCode(
  curricula: { steps?: { scenarioId?: string }[] }[],
): string | undefined {
  const count = new Map<string, number>();
  for (const c of curricula) {
    for (const st of c.steps ?? []) {
      const code = deptCodeOf(st.scenarioId);
      if (code) count.set(code, (count.get(code) ?? 0) + 1);
    }
  }
  let best: string | undefined;
  let bestN = 0;
  for (const [code, n] of count) {
    if (n > bestN) {
      best = code;
      bestN = n;
    }
  }
  return best;
}

/**
 * The floor's place name, with the building and floor prefix stripped.
 *
 * "본관 1F 응급의료센터" → "응급의료센터". The two rows above already say which building
 * and floor this is, so repeating them inside the row is noise. Lives here rather than in
 * the screen because the search results need exactly the same name — two copies of this
 * expression is two places for it to drift.
 */
export function floorPlace(floor: { floor: string; where: string; curricula: { where: string }[] }): string {
  const raw = floor.curricula[0]?.where ?? floor.where;
  return raw.replace(new RegExp(`^\\S+\\s+${floor.floor}\\s*`), '') || floor.where;
}
