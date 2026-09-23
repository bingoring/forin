// 일터 탭의 화면 배선 (journey-binder-v42 Task G, task-G-brief.md §3). 이 화면이 이제
// 그리는 것은 부서 서가(`BinderShelf`)뿐이고, 목표 부서의 주제 목록은
// `journey/dept/[dept].tsx`로 내려갔다(deptBinderScreen.test.tsx가 그 화면을 잠근다).
//
// 이 파일이 계속 지켜야 하는 것들:
//  - V3: `GET /me/journey`를 한 번만 부른다 — 부서마다 요청을 내지 않는다.
//  - V2: 바인더를 열면(내 부서든 서가의 다른 부서든) 부서 간지로 밀 뿐, 저장된 목표는
//    바뀌지 않는다. 목표를 바꾸는 유일한 자리는 `내 부서` 카드의 "목표 바꾸기"다.
//  - J5: 부서를 고르는 방법은 하나 — `onChangeGoal`이 여는 pick-dept 화면이 이
//    화면의 `pickDept()`로 이어지고, 그 함수가 쥔 요청 순서 카운터도 그대로다.
//  - 상단 목표 부서 바·자유 탐방 칩 줄은 이제 없다(J5) — 헤더에는 화면 이름만 남는다.
//
// BinderShelf.test.tsx가 이미 잠근 것(서가 레이아웃, 진행 바, 잠금 없음, 공통 필수
// 없음)은 여기서 다시 재지 않는다. 이 파일이 재는 것은 이 화면 자신의 몫뿐이다:
// 데이터를 어떻게 가져오고, BinderShelf에 무엇을 건네고, 그 콜백이 실제로 어디로
// 가는지.
//
// @testing-library/react-native is not installed in this repo, so this uses
// react-test-renderer throughout.
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
import { MEASURE_TIMEOUT_MS } from '@/components/journey/measureBinderRect';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

const CURRICULA: JourneyCurriculum[] = [
  { themeKey: 't1', name: '체온 측정', track: 'core', state: 'passed', resume: false, done: 3, total: 3 },
  { themeKey: 't2', name: '투약 확인', track: 'core', state: 'here', resume: true, dept: 'ER', done: 1, total: 4 },
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

function shelfCard(root: ReactTestInstance, dept: string) {
  return findAllPressables(root).find((n) => n.props?.testID === `binder-shelf-card-${dept}`);
}

/** Host-node-only testID lookup — a plain `<View testID=.../>` shows up twice under
 *  react-test-renderer (composite + host), so a raw count doubles what is actually on
 *  screen (journeyThemeScreen.test.tsx documents the same gotcha). */
function hostNodesWithTestId(root: ReactTestInstance, id: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
}

/** The "이어서" button on the 내 부서 card and the "목표 바꾸기" link both live inside
 *  `BinderShelf`, which is not mocked here — same reason `journeyPickDeptScreen.test.tsx`
 *  finds its rows by testID rather than mocking the screen it is wiring into. */
function pressByText(root: ReactTestInstance, label: string): ReactTestInstance {
  const hit = root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes(label),
    { deep: true },
  )[0];
  if (!hit) throw new Error(`no pressable with text "${label}"`);
  return hit;
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

// V3: 서가는 추가 요청을 하지 않는다 — 부서 개수만큼이 아니라 딱 한 번.
test('fetches GET /me/journey exactly once, with no department argument', async () => {
  await mount();
  expect(api.journey).toHaveBeenCalledTimes(1);
  expect(api.journey).toHaveBeenCalledWith();
});

test('the header shows only the screen name — no per-dept bar, no free-roam chip row', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('나의 여정');
  expect(hostNodesWithTestId(tree.root, 'journey-goal-dept-press')).toHaveLength(0);
  expect(findAllPressables(tree.root).some((n) => String(n.props?.testID ?? '').startsWith('chip-'))).toBe(false);
});

test('renders the shelf with the goal card plus one binder per free-roam department', async () => {
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'binder-shelf-goal-card' })).toBeTruthy();
  expect(shelfCard(tree.root, 'ICU')).toBeTruthy();
  expect(shelfCard(tree.root, 'OR')).toBeTruthy();
  // The goal department itself is not drawn a second time as a shelf binder.
  expect(shelfCard(tree.root, 'ER')).toBeUndefined();
});

// V2: 여는 것과 정하는 것은 다르다. 서가의 바인더를 열면 부서 간지로 밀 뿐이다.
test('opening a shelf binder pushes the dept screen — the saved goal is not touched', async () => {
  const tree = await mount();
  await act(async () => { shelfCard(tree.root, 'ICU')!.props.onPress(); });
  // 누름은 바인더 좌표를 재는 것으로 시작하고, 이 환경의 브리지는 그 콜백을 영영
  // 부르지 않는다(`measureBinderRect.ts`의 주석). 이 테스트가 진짜 모듈을 쓰는 이유가
  // 거기 있다 — 답이 없는 브리지에서도 이동이 **반드시** 일어난다는 약속을 재는
  // 자리이고, 그 약속을 지키는 것이 제한 시간이다. 그래서 그 시간을 넘긴다.
  await act(async () => { await new Promise((r) => setTimeout(r, MEASURE_TIMEOUT_MS + 10)); });
  expect(mockPushed).toEqual(['/journey/dept/ICU']);
  expect(api.setGoalDept).not.toHaveBeenCalled();
});

test('the goal card’s 이어서 pushes the dept screen for the goal department itself', async () => {
  const tree = await mount();
  await act(async () => { pressByText(tree.root, '이어서').props.onPress(); });
  expect(mockPushed).toEqual(['/journey/dept/ER']);
  expect(api.setGoalDept).not.toHaveBeenCalled();
});

// V2가 말하는 유일한 자리 — "목표 바꾸기".
test('tapping 목표 바꾸기 offers goalDept + every free-roam dept and pushes the picker', async () => {
  clearGoalPickOffer();
  const tree = await mount();
  expect(goalPickOffer()).toBeNull(); // 안 눌렀으면 아무것도 건네지 않는다

  await act(async () => { pressByText(tree.root, '목표 바꾸기').props.onPress(); });

  const offered = goalPickOffer();
  expect(offered).not.toBeNull();
  expect(new Set(offered!.depts)).toEqual(new Set(['ER', 'ICU', 'OR']));
  expect(offered!.depts).toHaveLength(3);
  expect(offered!.current).toBe('ER');
  expect(mockPushed).toContain('/journey/pick-dept');
});

test('the offer carries inferred as the screen last knows it', async () => {
  clearGoalPickOffer();
  (api.journey as jest.Mock).mockResolvedValueOnce({ ...VIEW, inferred: true } as JourneyView);
  const tree = await mount();
  await act(async () => { pressByText(tree.root, '목표 바꾸기').props.onPress(); });
  expect(goalPickOffer()!.inferred).toBe(true);
});

// J5/K8: 부서를 고르는 방법은 하나다 — 고르기 화면이 부르는 것은 이 화면의 pickDept()
// 그 자체다.
test('picking a department calls setGoalDept with that department and redraws (J5)', async () => {
  clearGoalPickOffer();
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);
  const tree = await mount();
  await act(async () => { pressByText(tree.root, '목표 바꾸기').props.onPress(); });
  expect(goalPickOffer()).not.toBeNull();
  await act(async () => { pickGoalDept('OR'); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await Promise.resolve(); });
  expect(api.setGoalDept).toHaveBeenCalledWith('OR');
  expect(api.journey).toHaveBeenCalledTimes(2); // 저장한 뒤 그 응답으로 다시 그린다
});

// Code review follow-up (2nd pass, pre-P3-C), still true after Task G: the LAST-STARTED
// request has to win, not the last-ARRIVED one. Reproduced here by picking twice through
// the same pickDept() the picker calls into, since the shelf itself no longer has a
// second way to change the goal.
test('a fast double-pick resolves to the later pick even if its response answers first', async () => {
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
  // pickGoalDept() only reaches this screen's pickDept() once the module store holds
  // it — the same registration `목표 바꾸기` performs on every real press.
  await act(async () => { pressByText(tree.root, '목표 바꾸기').props.onPress(); });

  await act(async () => { pickGoalDept('ICU'); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept('ICU') -> journey() called

  await act(async () => { pickGoalDept('OR'); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept('OR') -> journey() called

  // The SECOND (later-started) request answers first.
  await act(async () => { resolveSecond({ ...VIEW, goalDept: 'OR' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });
  // The FIRST (earlier-started) request's now-stale response arrives late.
  await act(async () => { resolveFirst({ ...VIEW, goalDept: 'ICU' } as JourneyView); });
  await act(async () => { await Promise.resolve(); });

  // Whichever was tapped LAST has to be what is on screen, regardless of arrival order.
  expect(tree.root.findByProps({ testID: 'binder-shelf-goal-card' })).toBeTruthy();
  expect(shelfCard(tree.root, 'OR')).toBeUndefined(); // OR is now the goal — not a shelf binder
  expect(shelfCard(tree.root, 'ICU')).toBeTruthy();   // ICU fell back to a shelf binder
});

// §4와 같은 원칙: 목록 자리에 스켈레톤, 나머지는 비워 두지 않는다 — 여기서는 헤더가
// 화면 이름 하나뿐이라, 그것만은 새로고침 중에도 사라지지 않는다.
test('a refresh blanks only the shelf area — the header title stays put (§4)', async () => {
  (api.setGoalDept as jest.Mock).mockResolvedValue(undefined);
  const pending = new Promise<JourneyView>(() => {}); // never resolves — freezes mid-load
  (api.journey as jest.Mock)
    .mockResolvedValueOnce(VIEW)
    .mockReturnValueOnce(pending);

  const tree = await mount();
  await act(async () => { pressByText(tree.root, '목표 바꾸기').props.onPress(); });
  await act(async () => { pickGoalDept('ICU'); });
  await act(async () => { await Promise.resolve(); }); // flush setGoalDept -> journey() called, now loading

  expect(texts(tree.root)).toContain('나의 여정');
  expect(hostNodesWithTestId(tree.root, 'journey-shelf-loading')).toHaveLength(1);
  expect(tree.root.findAllByProps({ testID: 'binder-shelf-goal-card' })).toHaveLength(0);
});

test('a load failure offers a retry that re-fetches', async () => {
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
  expect(tree.root.findByProps({ testID: 'binder-shelf-goal-card' })).toBeTruthy();

});

// 참조(v42 BinderShelf)의 머리줄 — 화면 이름 옆에 서가 규모가 한 줄로 붙는다. 두 숫자는
// 응답에서 센다: 바인더 수는 목표 부서 + 자유 탐방, 통과한 주제 수는 자유 탐방의
// `passed` 합과 목표 부서에서 끝난 주제 수의 합이다.
test('the header line states how many binders and how many topics are cleared', async () => {
  const tree = await mount();
  const line = tree.root.findAll((n) => n.props?.testID === 'journey-shelf-summary')[0];
  // 픽스처: 바인더는 목표 ER + 자유 탐방 ICU·OR = 3권. 통과한 주제는 자유 탐방의
  // passed 합(2 + 0)에 목표 ER에서 끝난 주제 t1 하나를 더해 3이다 — t2는 1/4이라
  // 세지 않는다. 두 숫자가 우연히 같으므로 조각이 아니라 문장 전체로 잰다.
  expect(texts(line).join(' ')).toBe('바인더 3권 · 통과한 주제 3');
});
