// Career-badge catalog — the single source of truth for both the profile grid
// (나 탭) and the clear-screen "new badge unlocked" celebration. Each badge names
// what it is and how it's earned, plus a pure predicate over the growth snapshot.
export type BadgeInput = { xp: number; level: number; streakLongest: number };

// Text lives in the i18n catalogs, not here: this array is a module constant
// evaluated once at import, so a t() call inside it would freeze the strings to
// whichever language was active at startup and never follow a language change.
// The data holds KEYS; the screens resolve them at render.
export type BadgeDef = {
  id: string; // stable identity for i18n keys (badge.<id>.*)
  e: string; // emoji icon
  labelKey: string; // short tile label
  nameKey: string; // full name (shown in detail / unlock)
  whatKey: string; // 무엇인가요?
  howKey: string; // 어떻게 얻나요?
  earned: (p: BadgeInput) => boolean;
  special?: boolean; // highlighted (yellow + NEW ribbon)
  hidden?: boolean; // not yet revealed (locked, title masked)
};

export const BADGES: BadgeDef[] = [
  { id: 'cap', e: '👒', labelKey: 'badge.cap.label', nameKey: 'badge.cap.name', whatKey: 'badge.cap.what', howKey: 'badge.cap.how', earned: (p) => p.xp > 0 },
  { id: 'stethoscope', e: '🩺', labelKey: 'badge.stethoscope.label', nameKey: 'badge.stethoscope.name', whatKey: 'badge.stethoscope.what', howKey: 'badge.stethoscope.how', earned: (p) => p.level >= 3 },
  { id: 'syringe', e: '💉', labelKey: 'badge.syringe.label', nameKey: 'badge.syringe.name', whatKey: 'badge.syringe.what', howKey: 'badge.syringe.how', earned: (p) => p.level >= 5 },
  { id: 'streak3', e: '🔥', labelKey: 'badge.streak3.label', nameKey: 'badge.streak3.name', whatKey: 'badge.streak3.what', howKey: 'badge.streak3.how', earned: (p) => p.streakLongest >= 3 },
  { id: 'streak7', e: '🏅', labelKey: 'badge.streak7.label', nameKey: 'badge.streak7.name', whatKey: 'badge.streak7.what', howKey: 'badge.streak7.how', earned: (p) => p.streakLongest >= 7, special: true },
  { id: 'trophy', e: '🏆', labelKey: 'badge.trophy.label', nameKey: 'badge.trophy.name', whatKey: 'badge.trophy.what', howKey: 'badge.trophy.how', earned: (p) => p.level >= 10 },
  { id: 'crown', e: '👑', labelKey: 'badge.crown.label', nameKey: 'badge.crown.name', whatKey: 'badge.crown.what', howKey: 'badge.crown.how', earned: (p) => p.level >= 20 },
  { id: 'hidden', e: '🔒', labelKey: 'badge.hidden.label', nameKey: 'badge.hidden.name', whatKey: 'badge.hidden.what', howKey: 'badge.hidden.how', earned: () => false, hidden: true },
];

/** BADGES with a resolved `got` flag for the given snapshot. */
export function earnedBadges(p: BadgeInput): (BadgeDef & { got: boolean })[] {
  return BADGES.map((b) => ({ ...b, got: b.earned(p) }));
}

/** Badges that flip from not-earned → earned between two snapshots (for unlock celebration). */
export function newlyEarned(before: BadgeInput, after: BadgeInput): BadgeDef[] {
  return BADGES.filter((b) => !b.hidden && !b.earned(before) && b.earned(after));
}
