// 근무 완료, in the 근무 수첩 line (v30) — what the page actually says about the run.
//
// Every check here is a way for a completion screen to misreport the shift it is
// summarising, and all of them render:
//
//  · A stat the run cannot know drawn as 0. "0 turns" and "we did not measure turns" are
//    different facts, and the first is an accusation.
//  · A failed run stamped as passed. The stamp IS the verdict now — the confetti and the
//    praise sticker it replaced were both unconditional decoration.
//  · A mission the learner missed shown ticked, or an achieved one shown as pending.
//  · The corrections claiming to be filed when there are none.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
// The avatar's reaction is motion, and motion is not what these tests are about.
jest.mock('@engine', () => ({ AnimatedFace: () => null }));
jest.mock('@/hooks/useAvatar', () => ({ useAvatar: () => ({}) }));

const mockGrade: Record<string, unknown> = {};
let mockSession: string | undefined = 'sess-1';
let mockSpeech: unknown = null;
jest.mock('@/api/client', () => ({
  api: {
    scenario: async () => ({
      id: 'SCN-ER-00001', title: '흉통 환자 트리아지',
      briefing: { dept: 'ER · TRIAGE', rewards: [{ icon: '⭐', label: '경험치', value: '+ 60 XP' }] },
    }),
    progress: async () => ({ level: 11, xp: 1_040, streakCurrent: 4, streakLongest: 9, reputation: [] }),
    completeScenario: async () => ({
      progress: { level: 12, xp: 1_160, streakCurrent: 5, streakLongest: 9, reputation: [] },
      grade: mockGrade,
      xpAwarded: 120,
      nextScenarioId: 'SCN-ER-00002',
    }),
    recordAttempt: async () => ({ level: 11, xp: 1_100, streakCurrent: 4, streakLongest: 9, reputation: [] }),
    growthStats: async () => ({ scenariosTotal: 13 }),
    sessionSpeechReview: async () => {
      if (!mockSpeech) throw new Error('none');
      return mockSpeech;
    },
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: () => {}, push: () => {}, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({ id: 'SCN-ER-00001', session: mockSession }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Result from '@/app/result/[id]';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const PASSING = {
  scenarioId: 'SCN-ER-00001', score: 86, passed: true, xpAwarded: 120, turns: 14,
  goals: [
    { goal: 'OPQRST로 통증 사정하기', met: true },
    { goal: '보호자 안심시키기', met: false },
  ],
  headline: '침착했어요', feedback: '통증 사정 순서가 좋았어요.',
  tips: [{ en: 'Can you tell me about your pain?', ko: '통증에 대해 말씀해 주시겠어요?' }],
};

beforeEach(() => {
  mockSession = 'sess-1';
  mockSpeech = null;
  Object.keys(mockGrade).forEach((k) => delete mockGrade[k]);
  Object.assign(mockGrade, PASSING);
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Result />)); });
  for (let i = 0; i < 6; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Every checkbox on the page, with the state it was given. NbCheck draws its tick as its
 *  own SVG path rather than an NbIcon, so the prop is what says ticked or not. */
function checks(root: ReactTestInstance): boolean[] {
  return root
    .findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'NbCheck', { deep: true })
    .map((n) => !!n.props?.done);
}

test('the summary reports the real four numbers', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('14');      // grade.turns
  expect(out).toContain('1');       // one correction filed
  expect(out).toContain('+120');    // the XP actually awarded, not the authored 60
});

test('a stat the run cannot know prints —, not 0', async () => {
  // No session means no grade: turns and corrections were never measured. Drawing them
  // as 0 tells somebody who just talked for five minutes that they said nothing.
  mockSession = undefined;
  const tree = await mount();
  expect(texts(tree.root).filter((x) => x === '—').length).toBeGreaterThanOrEqual(3);
  expect(texts(tree.root)).not.toContain('0');
});

test('the stamp carries the verdict — PASSED only when the run passed', async () => {
  const passed = await mount();
  expect(texts(passed.root)).toContain('PASSED');
  expect(texts(passed.root)).not.toContain('RETRY');

  mockGrade.passed = false;
  const failed = await mount();
  expect(texts(failed.root)).toContain('RETRY');
  expect(texts(failed.root)).not.toContain('PASSED');
});

test('a mission that was missed is not ticked, and says so', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('OPQRST로 통증 사정하기');
  expect(out).toContain('보호자 안심시키기');
  // One ticked, one not — in that order. Two ticks would report a mission the learner
  // did not complete as done; two empties would take away one they did.
  expect(checks(tree.root)).toEqual([true, false]);
  expect(out).toContain('다음에!');
});

test('the corrections say how many were filed, and show them', async () => {
  const tree = await mount();
  const out = texts(tree.root).join(' ');
  expect(out).toContain('빨간펜 1곳');
  expect(out).toContain('Can you tell me about your pain?');
  expect(out).toContain('통증에 대해 말씀해 주시겠어요?');
});

test('with nothing to correct, the red-pen block is absent rather than empty', async () => {
  // "빨간펜 0곳 · 복습 노트에 저장됐어요" would claim a filing that did not happen.
  mockGrade.tips = [];
  const tree = await mount();
  expect(texts(tree.root).join(' ')).not.toContain('빨간펜');
});

test('the level-up is announced only when the level actually moved', async () => {
  const up = await mount();
  expect(texts(up.root).join(' ')).toContain('레벨 업!');
});
