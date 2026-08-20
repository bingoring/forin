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
 * The KEYS stay Korean because they are not display text — they are the exact
 * strings GET /me/curriculum sends, and the lookup has to match them. The subtitle
 * is display text, so it carries a translation key.
 */
export const BUILDING_STYLE: Record<string, { icon: IconName; accent: string; subKey: string }> = {
  '본관': { icon: 'hospital', accent: '#D14B3D', subKey: 'building.main.sub' },
  '별관 1': { icon: 'baby', accent: '#C2487E', subKey: 'building.annex1.sub' },
  '별관 2': { icon: 'sprout', accent: '#1E8A5B', subKey: 'building.annex2.sub' },
  '별관 3': { icon: 'microscope', accent: '#0E7490', subKey: 'building.annex3.sub' },
  '지원동': { icon: 'box', accent: '#6E6354', subKey: 'building.support.sub' },
};

/** Fallback for a building the server adds before this file learns its colour. */
export const DEFAULT_BUILDING_STYLE = { icon: 'hospital' as IconName, accent: colors.textSoft, subKey: '' };

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
