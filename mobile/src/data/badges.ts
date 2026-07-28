// Career-badge catalog — the single source of truth for both the profile grid
// (나 탭) and the clear-screen "new badge unlocked" celebration. Each badge names
// what it is and how it's earned, plus a pure predicate over the growth snapshot.
export type BadgeInput = { xp: number; level: number; streakLongest: number };

export type BadgeDef = {
  e: string; // emoji icon
  l: string; // short tile label
  name: string; // full name (shown in detail / unlock)
  what: string; // 무엇인가요?
  how: string; // 어떻게 얻나요?
  earned: (p: BadgeInput) => boolean;
  special?: boolean; // highlighted (yellow + NEW ribbon)
  hidden?: boolean; // not yet revealed (locked, title masked)
};

export const BADGES: BadgeDef[] = [
  { e: '👒', l: '첫 근무', name: '간호사 캡', what: '첫 근무를 시작하며 받은 간호사 캡이에요. 여정의 출발점을 기념해요.', how: '첫 시나리오에서 XP를 획득하면 열려요.', earned: (p) => p.xp > 0 },
  { e: '🩺', l: 'Lv.3', name: '청진기', what: '기본기를 다졌다는 표시예요. 환자의 소리에 귀 기울일 준비가 됐어요.', how: '레벨 3에 도달하면 열려요.', earned: (p) => p.level >= 3 },
  { e: '💉', l: 'Lv.5', name: '주사기', what: '술기에 익숙해진 주니어 간호사의 증표예요.', how: '레벨 5에 도달하면 열려요.', earned: (p) => p.level >= 5 },
  { e: '🔥', l: '3일 연속', name: '3일 연속 출석', what: '사흘 연속 근무한 성실함의 상징이에요.', how: '3일 연속 출석하면 열려요.', earned: (p) => p.streakLongest >= 3 },
  { e: '🏅', l: '7일 연속', name: '일주일 개근', what: '일주일 내내 빠짐없이 나온 열정의 메달이에요.', how: '7일 연속 출석하면 열려요.', earned: (p) => p.streakLongest >= 7, special: true },
  { e: '🏆', l: 'Lv.10', name: '병동 트로피', what: '한 병동을 능숙히 누비는 실력자의 트로피예요.', how: '레벨 10에 도달하면 열려요.', earned: (p) => p.level >= 10 },
  { e: '👑', l: 'Lv.20', name: '헤드 간호사 왕관', what: '팀을 이끄는 시니어의 왕관이에요.', how: '레벨 20에 도달하면 열려요.', earned: (p) => p.level >= 20 },
  { e: '🔒', l: '???', name: '숨겨진 뱃지', what: '아직 공개되지 않은 뱃지예요. 계속 성장하다 보면 만나게 돼요.', how: '조건은 아직 비밀이에요.', earned: () => false, hidden: true },
];

/** BADGES with a resolved `got` flag for the given snapshot. */
export function earnedBadges(p: BadgeInput): (BadgeDef & { got: boolean })[] {
  return BADGES.map((b) => ({ ...b, got: b.earned(p) }));
}

/** Badges that flip from not-earned → earned between two snapshots (for unlock celebration). */
export function newlyEarned(before: BadgeInput, after: BadgeInput): BadgeDef[] {
  return BADGES.filter((b) => !b.hidden && !b.earned(before) && b.earned(after));
}
