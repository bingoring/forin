// The journey map's screen-level wiring (Task 13) — this is where the pieces Tasks
// 9~12 built get handed real data, and where the "how do we pick the one station the
// bar points at" decision lives (frontend-components.md never assigned that logic to
// any of the components themselves).
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
import JourneyScreen, { pickCurrent } from '@/app/(tabs)/journey';
import { api, type JourneyView } from '@/api/client';
import { Station } from '@/components/journey/Station';
import { clearGoalPickOffer, goalPickOffer, pickGoalDept } from '@/data/journeyGoalPick';
import type { JourneyCurriculum } from '@/components/journey/JourneyMap';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

// ── pickCurrent — the "which one station" decision ─────────────────────────
//
// J6/J7: the bar's target is read straight off the server's `resume` flag, rescoped
// into this track server-side (business-logic-model.md A2). This file's job is only to
// prove the CLIENT read of that flag does not fabricate anything of its own.
describe('pickCurrent', () => {
  it('points at the one entry the server flagged resume, reading "resume" when it is also here', () => {
    const curricula = [
      { themeKey: 'a', state: 'passed', resume: false },
      { themeKey: 'b', state: 'here', resume: true },
      { themeKey: 'c', state: 'open', resume: false },
    ] as unknown as JourneyCurriculum[];
    expect(pickCurrent(curricula)).toEqual({ station: curricula[1], kind: 'resume' });
  });

  // A2: when the global `here` lands outside this track, the server substitutes the
  // first non-passed entry and leaves ITS state as 'open' rather than promoting it to
  // 'here' — "here를 지어내지 않는다". The client must read that substitution as 'next',
  // not invent a 'resume' reading of its own.
  it('reads "next" when the flagged entry is not the here one', () => {
    const curricula = [
      { themeKey: 'a', state: 'passed', resume: false },
      { themeKey: 'b', state: 'open', resume: true },
      { themeKey: 'c', state: 'open', resume: false },
    ] as unknown as JourneyCurriculum[];
    expect(pickCurrent(curricula)).toEqual({ station: curricula[1], kind: 'next' });
  });

  // 트랙 전부 통과 — server sets no resume flag at all. Exactly zero targets, not a
  // fabricated one.
  it('points at nothing when the track is fully passed', () => {
    const curricula = [
      { themeKey: 'a', state: 'passed', resume: false },
      { themeKey: 'b', state: 'passed', resume: false },
    ] as unknown as JourneyCurriculum[];
    expect(pickCurrent(curricula)).toEqual({ station: null, kind: 'next' });
  });

  // The payload can only ever carry one resume flag (server invariant), but this
  // function must still answer with exactly one station if it is ever handed more —
  // "가리킬 곳은 정확히 하나" is a property of what the SCREEN shows, and a function
  // that could return two would be the seam that broke it.
  it('never resolves to more than one station', () => {
    const curricula = [
      { themeKey: 'a', state: 'open', resume: true },
      { themeKey: 'b', state: 'open', resume: true },
    ] as unknown as JourneyCurriculum[];
    const { station } = pickCurrent(curricula);
    expect([curricula[0], curricula[1]]).toContain(station);
    expect(station).not.toBe(null);
  });
});

// ── the assembled screen ─────────────────────────────────────────────────
// t3 is the first 'open' entry after 'here', so it maps to 'next' (stationStates does
// not let 'here' consume the next slot); t4 is the one that actually lands on 'far'.
const CURRICULA: JourneyCurriculum[] = [
  { themeKey: 't1', name: '체온 측정', state: 'passed', resume: false, done: 3, total: 3 },
  { themeKey: 't2', name: '투약 확인', state: 'here', resume: true, dept: 'ER', done: 1, total: 4 },
  { themeKey: 't3', name: '낙상 예방', state: 'open', resume: false },
  { themeKey: 't4', name: '욕창 관리', state: 'open', resume: false },
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

test('renders one Station per curriculum entry and the bar reads the resume label', async () => {
  const tree = await mount();
  expect(tree.root.findAllByType(Station)).toHaveLength(CURRICULA.length);
  // t2 is 'here' and carries the resume flag — the bar should read 이어하기, not
  // 다음 정거장 (never both — CurrentStationBar.test.tsx already locks that property;
  // this only checks the SCREEN feeds it the right one).
  expect(texts(tree.root)).toContain('이어하기');
  expect(texts(tree.root)).not.toContain('다음 정거장');
});

test('a free-roam chip switches the goal department and redraws the path (J5)', async () => {
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

test('the current-station bar opens that station’s own sheet, not any other', async () => {
  (api.station as jest.Mock).mockResolvedValue({
    station: { themeKey: 't2', name: '투약 확인', done: 1, total: 4, tiers: [] },
    steps: [],
  });
  const tree = await mount();
  const bar = tree.root.findByProps({ testID: 'current-station-press' });
  await act(async () => { bar.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  // §5: tapping the bar opens the sheet rather than sending the learner straight into
  // a scenario — it does not know which rung to pick without asking.
  expect(mockPushed).toEqual([]);
  expect(api.station).toHaveBeenCalledWith('t2');
});

test('a far (not-yet-visited) station still opens on tap — J1/J3, no lock on the map', async () => {
  (api.station as jest.Mock).mockResolvedValue({
    station: { themeKey: 't4', name: '욕창 관리', done: 0, total: 2, tiers: [] },
    steps: [],
  });
  const tree = await mount();
  const farStation = tree.root.findAllByType(Station).find((n) => n.props.state === 'far')!;
  expect(farStation).toBeTruthy();
  await act(async () => { farStation.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(api.station).toHaveBeenCalledWith('t4');
});

// Code review follow-up (2nd pass): `load()`/`pickDept()` used to have no defence
// against out-of-order responses — the LAST-STARTED request has to win, not the
// last-ARRIVED one, or a fast double-tap on two different chips can end up rendering
// whichever department's response happened to come back first.
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

// §4: "지도 자리에 스켈레톤, 하단 바는 비워 둔다" — not the whole screen. A refresh
// (here: picking a new goal dept) must not make the header or the free-roam row
// disappear out from under the learner while the new path loads.
test('a refresh blanks only the map area — the header and free-roam row stay put (§4)', async () => {
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
  // Only the map area itself goes to the loading placeholder.
  expect(hostNodesWithTestId(tree.root, 'journey-map-loading')).toHaveLength(1);
  expect(tree.root.findAllByType(Station)).toHaveLength(0);
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

// ── Task 18: 목표 부서 바를 눌러 부서 고르기 ─────────────────────────────
//
// 부서 목록은 화면이 새로 만들지 않는다 — `goalDept`와 `freeRoam[].dept`를 합친 것이
// 그대로 시트로 건네져야 한다(J9 개정, Task 17: freeRoam은 이미 목표 부서를 뺀 나머지
// 전부다).
test('tapping the goal-dept header offers goalDept + every free-roam dept, no more and no fewer', async () => {
  clearGoalPickOffer();
  const tree = await mount();
  expect(goalPickOffer()).toBeNull(); // 안 눌렀으면 아무것도 건네지 않는다

  const header = tree.root.findByProps({ testID: 'journey-goal-dept-press' });
  await act(async () => { header.props.onPress(); });

  const offered = goalPickOffer();
  expect(offered).not.toBeNull();
  // VIEW: goalDept 'ER' + freeRoam ['ICU', 'OR'] — 서버가 이미 목표를 뺀 나머지 전부를
  // 보낸다는 전제(Task 17)이므로 합치면 정확히 이 셋, 순서·중복 상관없이 집합이 같아야 한다.
  expect(new Set(offered!.depts)).toEqual(new Set(['ER', 'ICU', 'OR']));
  expect(offered!.depts).toHaveLength(3); // 중복 없음
  expect(offered!.current).toBe('ER');
  // 화살표가 약속한 대로 실제로 그 화면을 민다.
  expect(mockPushed).toContain('/journey/pick-dept');
});

// §2: inferred일 때와 아닐 때 건네는 `inferred`가 달라야 한다 — 고르기 화면 안의
// 권유형 문구는 journeyPickDeptScreen.test.tsx가 잠근다.
test('the offer carries inferred as the screen last knows it', async () => {
  clearGoalPickOffer();
  (api.journey as jest.Mock).mockResolvedValueOnce({ ...VIEW, inferred: true } as JourneyView);
  const tree = await mount();
  await act(async () => { tree.root.findByProps({ testID: 'journey-goal-dept-press' }).props.onPress(); });
  expect(goalPickOffer()!.inferred).toBe(true);
});

// J5: 부서를 고르는 방법은 하나다 — 고르기 화면이 부르는 것은 이 화면의 pickDept()
// 그 자체다(자유 탐방 칩과 같은 함수, 같은 요청 순서 보호). 미리보기·확정 분리 없음.
//
// 시트를 쓰던 때는 컴포넌트 prop을 직접 불러 확인했다. 화면으로 옮기면서 그 연결이
// 모듈 스토어를 거치게 됐으므로, 여기서는 건네진 함수를 실제로 불러 본다 — 건네기만
// 하고 그것이 pickDept가 아니면 이 단정이 잡는다.
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

// 같은 요청 순서 카운터를 나눠 쓴다는 전제 — 고르기 화면에서 고른 요청이 자유 탐방 칩
// 요청보다 늦게 시작됐다면, 먼저 시작된 칩 요청의 응답이 늦게 와도 나중 선택이 이겨야
// 한다. 도착 순서를 뒤집어야 진짜 경합이 된다 — 시작 순서와 도착 순서가 같으면 보호
// 장치를 우회한 구현도 우연히 통과한다(실제로 한 번 그렇게 가짜 통과한 적이 있다).
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
  // 고르기 화면이 부르는 것과 같은 자리 — 건네진 pickDept를 그대로 부른다.
  await act(async () => { pickGoalDept('OR'); });
  await act(async () => { await Promise.resolve(); });

  // 나중에 시작된(시트) 쪽이 먼저 응답하고, 먼저 시작된(칩) 쪽이 뒤늦게 도착한다 — "나중에
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
  expect(tree.root.findAllByType(Station)).toHaveLength(CURRICULA.length);
});
