// Career titles (칭호) + hidden missions (히든미션) — single source of truth for
// the profile UI. Titles are earned by predicates over the growth snapshot (like
// badges); one can be equipped (persisted server-side). "warm" titles nudge NPC
// disposition (server mirrors the warm set). Hidden missions stay hidden (hint
// only) until their condition is met; finding any unlocks the 숨은 영웅 title.
export type GrowthInput = {
  level: number;
  xp: number;
  streakLongest: number;
  patientSatisfaction: number;
  peerTrust: number;
  emergencyResponse: number;
  scenariosTotal: number;
};

export type TitleDef = {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  how: string;
  effect?: string;
  warm?: boolean;
  earned: (g: GrowthInput, ctx: { hiddenFound: number }) => boolean;
};

export const TITLES: TitleDef[] = [
  { id: 'learner', emoji: '🌱', name: '새내기', desc: '이제 막 현장에 발을 들인 간호사예요.', how: '기본으로 주어지는 칭호예요.', earned: () => true },
  { id: 'ward_friend', emoji: '💗', name: '병동의 벗', desc: '환자들이 편안해하는 따뜻한 손길이에요.', how: '환자 만족도 70 이상이면 얻어요.', effect: '환자 NPC가 처음부터 조금 더 우호적으로 반응해요.', warm: true, earned: (g) => g.patientSatisfaction >= 70 },
  { id: 'diligent', emoji: '🔥', name: '성실한 손길', desc: '하루도 빠짐없이 근무한 성실함의 증표예요.', how: '7일 연속 출석하면 얻어요.', earned: (g) => g.streakLongest >= 7 },
  { id: 'er_ace', emoji: '⚡', name: '응급실의 에이스', desc: '수많은 현장을 지켜낸 베테랑이에요.', how: '시나리오를 10회 클리어하면 얻어요.', earned: (g) => g.scenariosTotal >= 10 },
  { id: 'polyglot', emoji: '🗣', name: '언어의 달인', desc: '영어가 몸에 밴 실력자예요.', how: '레벨 10에 도달하면 얻어요.', earned: (g) => g.level >= 10 },
  { id: 'hidden_hero', emoji: '🦸', name: '숨은 영웅', desc: '아무도 모르게 빛나는 히든 업적의 주인이에요.', how: '히든 미션을 하나라도 발견하면 얻어요.', effect: '환자 NPC가 처음부터 조금 더 우호적으로 반응해요.', warm: true, earned: (_g, c) => c.hiddenFound >= 1 },
];

export type MissionDef = {
  id: string;
  name: string;
  hint: string;
  reward: string;
  met: (g: GrowthInput) => boolean;
};

export const MISSIONS: MissionDef[] = [
  { id: 'veteran', name: '베테랑', hint: '현장을 아주 많이 누비다 보면…', reward: '숨은 영웅 칭호', met: (g) => g.scenariosTotal >= 25 },
  { id: 'iron_will', name: '철인', hint: '2주를 하루도 빠짐없이…', reward: '숨은 영웅 칭호', met: (g) => g.streakLongest >= 14 },
  { id: 'beloved', name: '신망', hint: '모두에게 사랑받는 간호사가 되면…', reward: '숨은 영웅 칭호', met: (g) => g.patientSatisfaction >= 80 && g.peerTrust >= 80 && g.emergencyResponse >= 80 },
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
