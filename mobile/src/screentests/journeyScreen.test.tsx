// 일터 탭의 화면 배선 (P3-C — 여정 지도 2단 구조, curriculum-v3-journey-ia/
// build-spec-index.md). 1단계로 바뀐 뒤에도 이 화면이 계속 지켜야 하는 것들:
//
//  - K1: 여기서는 길을 그리지 않는다 — Station/JourneyMap이 그리던 지그재그 지도는
//    더 이상 이 화면에 없다(그 컴포넌트 자체는 2단계가 쓸 것이라 지우지 않았을 뿐이다).
//  - K8/J5: 목표 부서 바와 자유 탐방 칩은 여전히 같은 경로(`pickDept`)를 타고, 같은
//    요청 순서 카운터의 보호를 받는다 — 이 화면이 바뀐 것은 가운데 자리뿐이다.
//  - 카드를 누르면 2단계 라우트(`/journey/theme/<themeKey>`)로 민다.
//
// @testing-library/react-native is not installed in this repo (Station.test.tsx,
// CurrentStationBar.test.tsx, StationSheet.test.tsx already note the same thing), so
// this uses react-test-renderer throughout.
const mockPushed: string[] = [];
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    useRouter: () => ({ push: (p: string) => mockPushed.push(p) }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});
jest.mock('@/api/client');

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import JourneyScreen from '@/app/(tabs)/journey';
import { api, type JourneyView } from '@/api/client';
import { clearGoalPickOffer, goalPickOffer, pickGoalDept } from '@/data/journeyGoalPick';
import type { JourneyCurriculum } from '@/components/journey/JourneyMap';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

// t3 comes right after the 'here' entry but carries no resume flag of its own; t4 is
// the one this file uses as "an untouched, non-recommended card" (J1/J3 — still has to
// press through).
const CURRICULA: JourneyCurriculum[] = [
  { themeKey: 't1', name: '체온 측정', track: 'core', state: 'passed', resume: false, done: 3, total: 3 },
  { themeKey: 't2', name: '투약 확인', track: 'core', state: 'here', resume: true, dept: 'ER', done: 1, total: 4 },
  { themeKey: 't3', name: '낙상 예방', track: 'depth', state: 'open', resume: false },
  { themeKey: 't4', name: '욕창 관리', track: 'depth', state: 'open', resume: false },
] as unknown as JourneyCurriculum[];

const VIEW: JourneyView = {
  goalDept: 'ER',
  inferred: false,
  track: { dept: 'ER', curricula: CURRICULA },
  freeRoam: [{ dept: 'ICU', passed: 2, total: 30 }, { dept: 'OR', passed: 0, total: 20 }],
} as unknown as JourneyView;

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function themeCard(root: ReactTestInstance, themeKey: string) {
  return findAllPressables(root).find((n) => n.props?.testID === `theme-card-${themeKey}`);
}

/** The header's own dept-name text, distinct from a free-roam chip that happens to name
 *  the same department — the fixture's free-roam row always shows "중환자실 ICU" as a
 *  chip label regardless of which department is the current GOAL, so a bare substring
 *  check over the whole tree's text cannot tell "the goal is ICU" from "ICU is one of
 *  the chips". */
function headerDeptText(root: ReactTestInstance): string | undefined {
  const hit = root.findAll((n) => n.props?.testID === 'journey-goal-dept')[0];
  return hit && String(hit.props.children);
}

/** Host-node-only testID lookup. react-test-renderer's `findAllByProps` matches every
 *  fibre carrying a prop, and a plain `<View testID=.../>` shows up twice — once as the
 *  composite View component, once as the host node underneath — so a raw count doubles
 *  what is actually on screen (the same gotcha `briefingGrading.test.tsx`'s `styled`
 *  helper documents for `style`). Host-only (`typeof n.type === 'string'`) counts once. */
function hostNodesWithTestId(root: ReactTestInstance, id: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
}

beforeEach(() => {
  mockPushed.length = 0;
  jest.clearAllMocks();
  (api.journey as jest.Mock).mockResolvedValue(VIEW);
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<JourneyScreen />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

test('renders one card per curriculum entry, split into 부서 코어/부서 심화, no path between them', async () => {
  const tree = await mount();
  expect(findAllPressables(tree.root).filter((n) => String(n.props?.testID ?? '').startsWith('theme-card-'))).toHaveLength(CURRICULA.length);
  expect(texts(tree.root)).toContain('공통 코어');
  expect(texts(tree.root)).toContain('심화');
});

// K2: t2 is the only entry carrying `resume: true` — exactly one card shows the
// recommendation.
test('shows the recommendation on exactly the one card the server flagged resume', async () => {
  const tree = await mount();
  expect(texts(tree.root).filter((s) => s === '이어하기')).toHaveLength(1);
});

// J1/J3: a topic the learner has not touched yet still presses through — no lock, no
// `disabled`.
test('an untouched topic card still presses — not disabled', async () => {
  const tree = await mount();
  const farCard = themeCard(tree.root, 't4')!;
  expect(farCard).toBeTruthy();
  expect(farCard.props.disabled).not.toBe(true);
  await act(async () => { farCard.props.onPress(); });
  expect(mockPushed).toContain('/journey/theme/t4');
});

// 카드를 누르면 그 주제 키로 2단계 경로를 민다 — 다른 주제로 새지 않는다.
test('tapping a card pushes the 2단계 route for that exact themeKey', async () => {
  const tree = await mount();
  await act(async () => { themeCard(tree.root, 't2')!.props.onPress(); });
  expect(mockPushed).toEqual(['/journey/theme/t2']);
});

test('a free-roam chip switches the goal department and redraws the list (J5)', async () => {
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);
  const tree = await mount();
  const chip = tree.root.findByProps({ testID: 'chip-ICU' });
  await act(async () => { chip.props.onPress(); });
  // pickDept chains setGoalDept().then(journey).then(setView) — two hops to flush.
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  expect(api.setGoalDept).toHaveBeenCalledWith('ICU');
  // W3: the screen re-requests the journey after the PATCH lands, rather than
  // assuming what the new path looks like.
  expect((api.journey as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2);
});

// Code review follow-up (2nd pass, pre-P3-C): `load()`/`pickDept()` used to have no
// defence against out-of-order responses — the LAST-STARTED request has to win, not
// the last-ARRIVED one.
test('a fast double-tap on two chips renders the later pick even if its response answers first', async () => {
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);

  let resolveFirst!: (v: JourneyView) => void;
  let resolveSecond!: (v: JourneyView) => void;
  const firstJourney = new Promise<JourneyView>((res) => { resolveFirst = res; });
  const secondJourney = new Promise<JourneyView>((res) => { resolveSecond = res; });
  (api.journey as jest.Mock)
    .mockResolvedValueOnce(VIEW)         // the initial load() on mount
    .mockReturnValueOnce(firstJourney)   // pickDept('ICU')'s journey() call — left hanging
    .mockReturnValueOnce(secondJourney); // pickDept('OR')'s journey() call — left hanging

  const tree = await mount();

  await act(async () => { tree.root.findByProps({ testID: 'chip-ICU' }).props.onPress(); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept('ICU') -> journey() called

  await act(async () => { tree.root.findByProps({ testID: 'chip-OR' }).props.onPress(); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept('OR') -> journey() called

  // The SECOND (later-started) request answers first.
  await act(async () => { resolveSecond({ ...VIEW, goalDept: 'OR' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });
  // The FIRST (earlier-started) request's now-stale response arrives late.
  await act(async () => { resolveFirst({ ...VIEW, goalDept: 'ICU' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });

  // Whichever was tapped LAST has to be what is on screen, regardless of arrival order.
  expect(headerDeptText(tree.root)).toBe('수술실 OR');
});

// §4: "목록 자리에 스켈레톤" — not the whole screen. A refresh (here: picking a new
// goal dept) must not make the header or the free-roam row disappear out from under
// the learner while the new path loads.
test('a refresh blanks only the list area — the header and free-roam row stay put (§4)', async () => {
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);
  const pending = new Promise<JourneyView>(() => {}); // never resolves — freezes mid-load
  (api.journey as jest.Mock)
    .mockResolvedValueOnce(VIEW)
    .mockReturnValueOnce(pending);

  const tree = await mount();
  await act(async () => { tree.root.findByProps({ testID: 'chip-ICU' }).props.onPress(); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept -> journey() called, now loading

  // Header still shows the last-known goal dept (ER hasn't been replaced yet) and the
  // chip row is still there — neither should vanish just because a refresh is in flight.
  expect(headerDeptText(tree.root)).toBe('응급실 ER');
  expect(tree.root.findByProps({ testID: 'chip-ICU' })).toBeTruthy();
  // Only the list area itself goes to the loading placeholder.
  expect(hostNodesWithTestId(tree.root, 'journey-topics-loading')).toHaveLength(1);
  expect(findAllPressables(tree.root).filter((n) => String(n.props?.testID ?? '').startsWith('theme-card-'))).toHaveLength(0);
});

// J4: an inferred goal is not yet the learner's choice, so the screen has to say so;
// once they pick one (or the server already has a saved choice), the tag must not
// linger and imply a choice was never made.
test('the inferred tag shows only when the goal department is inferred, not chosen (J4)', async () => {
  (api.journey as jest.Mock).mockResolvedValueOnce({ ...VIEW, inferred: true } as JourneyView);
  const tree = await mount();
  expect(texts(tree.root)).toContain('추정');
});

test('a learner-chosen goal department (inferred: false) shows no inferred tag', async () => {
  const tree = await mount(); // default VIEW has inferred: false
  expect(texts(tree.root)).not.toContain('추정');
});

// ── 부서 고르기: 목표 부서 바를 눌러 부서 고르기 화면으로 (K8/J5) ───────────
//
// 부서 목록은 화면이 새로 만들지 않는다 — `goalDept`와 `freeRoam[].dept`를 합친 것이
// 그대로 넘어간다.
test('tapping the goal-dept header offers goalDept + every free-roam dept, no more and no fewer', async () => {
  clearGoalPickOffer();
  const tree = await mount();
  expect(goalPickOffer()).toBeNull(); // 안 눌렀으면 아무것도 건네지 않는다

  const header = tree.root.findByProps({ testID: 'journey-goal-dept-press' });
  await act(async () => { header.props.onPress(); });

  const offered = goalPickOffer();
  expect(offered).not.toBeNull();
  // VIEW: goalDept 'ER' + freeRoam ['ICU', 'OR'] — 서버가 이미 목표를 뺀 나머지 전부를
  // 보낸다는 전제이므로 합치면 정확히 이 셋, 순서·중복 상관없이 집합이 같아야 한다.
  expect(new Set(offered!.depts)).toEqual(new Set(['ER', 'ICU', 'OR']));
  expect(offered!.depts).toHaveLength(3); // 중복 없음
  expect(offered!.current).toBe('ER');
  // 화살표가 약속한 대로 실제로 그 화면을 민다.
  expect(mockPushed).toContain('/journey/pick-dept');
});

test('the offer carries inferred as the screen last knows it', async () => {
  clearGoalPickOffer();
  (api.journey as jest.Mock).mockResolvedValueOnce({ ...VIEW, inferred: true } as JourneyView);
  const tree = await mount();
  await act(async () => { tree.root.findByProps({ testID: 'journey-goal-dept-press' }).props.onPress(); });
  expect(goalPickOffer()!.inferred).toBe(true);
});

// K8/J5: 부서를 고르는 방법은 하나다 — 고르기 화면이 부르는 것은 이 화면의 pickDept()
// 그 자체다(자유 탐방 칩과 같은 함수, 같은 요청 순서 보호). 미리보기·확정 분리 없음.
test('picking a department calls setGoalDept with that department and redraws (J5)', async () => {
  clearGoalPickOffer();
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);
  const tree = await mount();
  await act(async () => { tree.root.findByProps({ testID: 'journey-goal-dept-press' }).props.onPress(); });
  expect(goalPickOffer()).not.toBeNull(); // 건네진 뒤라야 부를 수 있다
  await act(async () => { pickGoalDept('OR'); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  expect(api.setGoalDept).toHaveBeenCalledWith('OR');
  expect(api.journey).toHaveBeenCalledTimes(2); // 저장한 뒤 그 응답으로 다시 그린다
});

test('a picker choice started after a chip tap wins even if the chip’s response answers later', async () => {
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);

  let resolveChip!: (v: JourneyView) => void;
  let resolveSheet!: (v: JourneyView) => void;
  const chipJourney = new Promise<JourneyView>((res) => { resolveChip = res; });
  const sheetJourney = new Promise<JourneyView>((res) => { resolveSheet = res; });
  (api.journey as jest.Mock)
    .mockResolvedValueOnce(VIEW)        // initial load()
    .mockReturnValueOnce(chipJourney)   // pickDept('ICU') via chip
    .mockReturnValueOnce(sheetJourney); // pickDept('OR') via the picker screen

  const tree = await mount();

  await act(async () => { tree.root.findByProps({ testID: 'chip-ICU' }).props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  await act(async () => { tree.root.findByProps({ testID: 'journey-goal-dept-press' }).props.onPress(); });
  await act(async () => { pickGoalDept('OR'); });
  await act(async () => { await Promise.resolve(); });

  // 나중에 시작된(피커) 쪽이 먼저 응답하고, 먼저 시작된(칩) 쪽이 뒤늦게 도착한다 — "나중에
  // 시작한 것"이 이겨야 하므로, 늦게 도착한 칩의 응답이 화면을 덮어쓰면 안 된다.
  await act(async () => { resolveSheet({ ...VIEW, goalDept: 'OR' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { resolveChip({ ...VIEW, goalDept: 'ICU' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });

  expect(headerDeptText(tree.root)).toBe('수술실 OR');
});

test('a load failure offers a retry that re-fetches instead of leaving the screen stuck', async () => {
  (api.journey as jest.Mock).mockRejectedValueOnce(new Error('network'));
  (api.journey as jest.Mock).mockResolvedValueOnce(VIEW);
  const tree = await mount();
  expect(texts(tree.root).join(' ')).toContain('여정을 불러오지 못했어요');

  const retry = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes('다시 시도'),
    { deep: true },
  )[0];
  await act(async () => { retry.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(findAllPressables(tree.root).filter((n) => String(n.props?.testID ?? '').startsWith('theme-card-'))).toHaveLength(CURRICULA.length);
});
