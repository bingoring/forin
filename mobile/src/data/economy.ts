// Client mirror of the server economy config (single source of truth). Bundled
// defaults match the server's economy.Default(); at boot we hydrate from
// GET /config/economy so the server stays authoritative and numbers live in one
// place instead of scattered literals. Read `ECON` at render time.
export type Economy = {
  xpPerLevel: number;
  scenarioBaseXP: number;
  rankJunior: number;
  rankSenior: number;
  rankHead: number;
  reputationDefault: number;
  repBandWarm: number;
  repBandCordial: number;
  repBandWary: number;
  titleWarmthBonus: number;
  easeDefault: number;
  easeFloor: number;
  firstInterval: number;
  secondInterval: number;
  masteryCap: number;
  dailyPoolSize: number;
  dailyDeptCap: number;
  dailyClearedWeight: number;
  dailyOffBandWeight: number;
  topUpAdd: number;
  topUpCap: number;
};

// Bundled defaults — kept in sync with server economy.Default() (offline fallback).
export const ECON: Economy = {
  xpPerLevel: 100,
  scenarioBaseXP: 100,
  rankJunior: 5,
  rankSenior: 15,
  rankHead: 30,
  reputationDefault: 50,
  repBandWarm: 75,
  repBandCordial: 50,
  repBandWary: 25,
  titleWarmthBonus: 15,
  easeDefault: 2.5,
  easeFloor: 1.3,
  firstInterval: 1,
  secondInterval: 6,
  masteryCap: 3,
  dailyPoolSize: 12,
  dailyDeptCap: 2,
  dailyClearedWeight: 0.25,
  dailyOffBandWeight: 0.5,
  topUpAdd: 3,
  topUpCap: 3,
};

// careerFor maps a level to its rank title + career-path step (0..3).
export function careerFor(level: number): { label: string; step: number } {
  if (level >= ECON.rankHead) return { label: 'Head Nurse', step: 3 };
  if (level >= ECON.rankSenior) return { label: 'Senior Nurse', step: 2 };
  if (level >= ECON.rankJunior) return { label: 'Junior Nurse', step: 1 };
  return { label: 'Learner', step: 0 };
}

// hydrateEconomy overwrites ECON in place from the server (called once at boot).
// Silent on failure — bundled defaults keep the app working offline.
export async function hydrateEconomy(fetcher: () => Promise<Partial<Economy>>): Promise<void> {
  try {
    const remote = await fetcher();
    Object.assign(ECON, remote);
  } catch {
    /* keep bundled defaults */
  }
}
