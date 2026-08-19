// Career titles (칭호) + hidden missions (히든미션) — single source of truth for
// the profile UI. Titles are earned by predicates over the growth snapshot (like
// badges); one can be equipped (persisted server-side). "warm" titles nudge NPC
// disposition (server mirrors the warm set). Hidden missions stay hidden (hint
// only) until their condition is met; finding any unlocks the 숨은 영웅 title.
export type GrowthInput = {
  level: number;
  xp: number;
  streakLongest: number;
  // Keyed by the server's reputation dimension (see api Standing). Titles are
  // themselves profession content, so naming nurse dimensions here is fine —
  // a second profession brings its own title catalog.
  rep: Record<string, number>;
  scenariosTotal: number;
};

// Text lives in the i18n catalogs (title.<id>.*): this array is a module constant,
// so a t() call here would freeze the strings to the startup language. The data
// holds keys; screens resolve them at render.
export type TitleDef = {
  id: string;
  emoji: string;
  nameKey: string;
  descKey: string;
  howKey: string;
  effectKey?: string;
  warm?: boolean;
  earned: (g: GrowthInput, ctx: { hiddenFound: number }) => boolean;
};

export const TITLES: TitleDef[] = [
  { id: 'learner', emoji: '🌱', nameKey: 'title.learner.name', descKey: 'title.learner.desc', howKey: 'title.learner.how', earned: () => true },
  { id: 'ward_friend', emoji: '💗', nameKey: 'title.ward_friend.name', descKey: 'title.ward_friend.desc', howKey: 'title.ward_friend.how', effectKey: 'title.ward_friend.effect', warm: true, earned: (g) => (g.rep.patient_satisfaction ?? 0) >= 70 },
  { id: 'diligent', emoji: '🔥', nameKey: 'title.diligent.name', descKey: 'title.diligent.desc', howKey: 'title.diligent.how', earned: (g) => g.streakLongest >= 7 },
  { id: 'er_ace', emoji: '⚡', nameKey: 'title.er_ace.name', descKey: 'title.er_ace.desc', howKey: 'title.er_ace.how', earned: (g) => g.scenariosTotal >= 10 },
  { id: 'polyglot', emoji: '🗣', nameKey: 'title.polyglot.name', descKey: 'title.polyglot.desc', howKey: 'title.polyglot.how', earned: (g) => g.level >= 10 },
  { id: 'hidden_hero', emoji: '🦸', nameKey: 'title.hidden_hero.name', descKey: 'title.hidden_hero.desc', howKey: 'title.hidden_hero.how', effectKey: 'title.hidden_hero.effect', warm: true, earned: (_g, c) => c.hiddenFound >= 1 },
];

export type MissionDef = {
  id: string;
  nameKey: string;
  hintKey: string;
  rewardKey: string;
  met: (g: GrowthInput) => boolean;
};

export const MISSIONS: MissionDef[] = [
  { id: 'veteran', nameKey: 'mission.veteran.name', hintKey: 'mission.veteran.hint', rewardKey: 'mission.veteran.reward', met: (g) => g.scenariosTotal >= 25 },
  { id: 'iron_will', nameKey: 'mission.iron_will.name', hintKey: 'mission.iron_will.hint', rewardKey: 'mission.iron_will.reward', met: (g) => g.streakLongest >= 14 },
  { id: 'beloved', nameKey: 'mission.beloved.name', hintKey: 'mission.beloved.hint', rewardKey: 'mission.beloved.reward', met: (g) => (g.rep.patient_satisfaction ?? 0) >= 80 && (g.rep.peer_trust ?? 0) >= 80 && (g.rep.emergency_response ?? 0) >= 80 },
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
