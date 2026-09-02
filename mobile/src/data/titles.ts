import type { NbIconName } from '@/components/nb/NbIcon';

// Career titles (칭호) + hidden missions — the single collection on the profile.
//
// Badges used to be a second, parallel collection: eight milestone markers you could
// look at but not use, sitting next to six titles you could equip. TestFlight
// feedback asked for one thing, so the badges moved in here. Two pairs collided on
// the way (both a badge and a title fired at a 7-day streak, and both at level 10) —
// the title kept its name because it says something, and the badge's duplicate
// condition was dropped rather than renamed onto a level nobody chose.
//
// Text lives in the i18n catalogs (title.<id>.*): this array is a module constant, so
// a t() call here would freeze it to the language at startup.
export type GrowthInput = {
  level: number;
  xp: number;
  streakLongest: number;
  streakCurrent: number;
  // Keyed by the server's reputation dimension (see api Standing). Titles are
  // themselves profession content, so naming nurse dimensions here is fine —
  // a second profession brings its own title catalog.
  rep: Record<string, number>;
  scenariosTotal: number;
  // Day/week activity, for the light-hearted hidden titles. Optional because the
  // clear screen knows a user's progress but not their week — a title that needs a
  // signal the caller lacks simply stays unearned there and turns up on the profile.
  scenariosToday?: number;
  conversationSecondsToday?: number;
  newCardsWeek?: number;
};

export type TitleDef = {
  id: string;
  /** The emoji the pixel line drew through EmojiIcon. Kept because the content pipeline
   *  still speaks in emoji, but the notebook line draws `nbIcon` instead. */
  emoji: string;
  /** The 근무 수첩 doodle. A title is a badge on a page, and a pen sketch is what the rest
   *  of that page is drawn in — an emoji tile there reads as a sticker somebody stuck on. */
  nbIcon: NbIconName;
  nameKey: string;
  descKey: string;
  howKey: string;
  effectKey?: string;
  warm?: boolean;
  /** Masked as ??? until earned. The reveal IS the reward. */
  hidden?: boolean;
  earned: (g: GrowthInput, ctx: { hiddenFound: number }) => boolean;
};

export const TITLES: TitleDef[] = [
  // ── the visible spine, in the order they arrive ───────────────────────────
  { id: 'learner', nbIcon: 'pencil', emoji: '🌱', nameKey: 'title.learner.name', descKey: 'title.learner.desc', howKey: 'title.learner.how', earned: () => true },
  { id: 'cap', nbIcon: 'bandage', emoji: '👒', nameKey: 'title.cap.name', descKey: 'title.cap.desc', howKey: 'title.cap.how', earned: (g) => g.xp > 0 },
  { id: 'stethoscope', nbIcon: 'stetho', emoji: '🩺', nameKey: 'title.stethoscope.name', descKey: 'title.stethoscope.desc', howKey: 'title.stethoscope.how', earned: (g) => g.level >= 3 },
  { id: 'streak3', nbIcon: 'star', emoji: '🔥', nameKey: 'title.streak3.name', descKey: 'title.streak3.desc', howKey: 'title.streak3.how', earned: (g) => g.streakLongest >= 3 },
  { id: 'syringe', nbIcon: 'pill', emoji: '💉', nameKey: 'title.syringe.name', descKey: 'title.syringe.desc', howKey: 'title.syringe.how', earned: (g) => g.level >= 5 },
  { id: 'diligent', nbIcon: 'calendar', emoji: '🏅', nameKey: 'title.diligent.name', descKey: 'title.diligent.desc', howKey: 'title.diligent.how', earned: (g) => g.streakLongest >= 7 },
  { id: 'ward_friend', nbIcon: 'handshake2', emoji: '💗', nameKey: 'title.ward_friend.name', descKey: 'title.ward_friend.desc', howKey: 'title.ward_friend.how', effectKey: 'title.ward_friend.effect', warm: true, earned: (g) => (g.rep.patient_satisfaction ?? 0) >= 70 },
  { id: 'er_ace', nbIcon: 'siren', emoji: '⚡', nameKey: 'title.er_ace.name', descKey: 'title.er_ace.desc', howKey: 'title.er_ace.how', earned: (g) => g.scenariosTotal >= 10 },
  { id: 'polyglot', nbIcon: 'speech', emoji: '🗣', nameKey: 'title.polyglot.name', descKey: 'title.polyglot.desc', howKey: 'title.polyglot.how', earned: (g) => g.level >= 10 },
  { id: 'crown', nbIcon: 'trophy', emoji: '👑', nameKey: 'title.crown.name', descKey: 'title.crown.desc', howKey: 'title.crown.how', earned: (g) => g.level >= 20 },
  { id: 'hidden_hero', nbIcon: 'shield', emoji: '🦸', nameKey: 'title.hidden_hero.name', descKey: 'title.hidden_hero.desc', howKey: 'title.hidden_hero.how', effectKey: 'title.hidden_hero.effect', warm: true, earned: (_g, c) => c.hiddenFound >= 1 },

  // ── the light-hearted ones, masked until they fire ─────────────────────────
  //
  // Every condition here is a signal the app already records — a title that cannot
  // be earned is a joke with no punchline. They are deliberately about being a
  // person rather than being good: talking too long, doing too much in one evening,
  // hoarding phrases, coming back after falling off.
  { id: 'chatterbox', nbIcon: 'mic', emoji: '💬', nameKey: 'title.chatterbox.name', descKey: 'title.chatterbox.desc', howKey: 'title.chatterbox.how', hidden: true, earned: (g) => (g.conversationSecondsToday ?? 0) >= 1800 },
  { id: 'marathoner', nbIcon: 'compass', emoji: '🏃', nameKey: 'title.marathoner.name', descKey: 'title.marathoner.desc', howKey: 'title.marathoner.how', hidden: true, earned: (g) => (g.scenariosToday ?? 0) >= 5 },
  { id: 'collector', nbIcon: 'lab', emoji: '📚', nameKey: 'title.collector.name', descKey: 'title.collector.desc', howKey: 'title.collector.how', hidden: true, earned: (g) => (g.newCardsWeek ?? 0) >= 30 },
  // Broke a long run and came back. streakCurrent === 1 with a real history behind it
  // is exactly "today is day one again", which is the moment worth naming.
  { id: 'returner', nbIcon: 'plane', emoji: '🌤', nameKey: 'title.returner.name', descKey: 'title.returner.desc', howKey: 'title.returner.how', hidden: true, earned: (g) => g.scenariosTotal >= 20 && g.streakCurrent === 1 && g.streakLongest >= 5 },
];

export type MissionDef = {
  id: string;
  nbIcon: NbIconName;
  nameKey: string;
  hintKey: string;
  rewardKey: string;
  met: (g: GrowthInput) => boolean;
};

export const MISSIONS: MissionDef[] = [
  { id: 'veteran', nbIcon: 'compass', nameKey: 'mission.veteran.name', hintKey: 'mission.veteran.hint', rewardKey: 'mission.veteran.reward', met: (g) => g.scenariosTotal >= 25 },
  { id: 'iron_will', nbIcon: 'calendar', nameKey: 'mission.iron_will.name', hintKey: 'mission.iron_will.hint', rewardKey: 'mission.iron_will.reward', met: (g) => g.streakLongest >= 14 },
  { id: 'beloved', nbIcon: 'handshake2', nameKey: 'mission.beloved.name', hintKey: 'mission.beloved.hint', rewardKey: 'mission.beloved.reward', met: (g) => (g.rep.patient_satisfaction ?? 0) >= 80 && (g.rep.peer_trust ?? 0) >= 80 && (g.rep.emergency_response ?? 0) >= 80 },
];

export function foundMissions(g: GrowthInput): MissionDef[] {
  return MISSIONS.filter((m) => m.met(g));
}

// hiddenFound: permanent count of discovered missions (from the server). Falls
// back to the live-met count when omitted.
export function earnedTitles(g: GrowthInput, hiddenFound?: number): (TitleDef & { got: boolean })[] {
  const hf = hiddenFound ?? foundMissions(g).length;
  return TITLES.map((t) => ({ ...t, got: t.earned(g, { hiddenFound: hf }) }));
}

export function titleById(id: string): TitleDef | undefined {
  return TITLES.find((t) => t.id === id);
}

/**
 * Titles that flip from unearned to earned between two snapshots — what the clear
 * screen celebrates.
 *
 * Replaces the deleted badges catalog's newlyEarned. Hidden titles are included:
 * their whole point is turning up unannounced, and the clear screen is where that
 * lands.
 */
export function newlyEarnedTitles(
  before: GrowthInput,
  after: GrowthInput,
  ctx: { hiddenFound: number },
): TitleDef[] {
  return TITLES.filter((t) => !t.earned(before, ctx) && t.earned(after, ctx));
}
