// StationTrack — 2단계(주제 화면)의 정거장 뷰. curriculum-v3-journey-ia/build-spec-index.md
// §6~§8.
//
// @testing-library/react-native is not installed in this repo — Station.test.tsx·
// JourneyMap.test.tsx already document the same thing, so this file follows their
// react-test-renderer conventions: findByProps/findAllByProps for testID lookups,
// name-matching for Pressable (findAllByType(Pressable) always returns 0 in this jest
// environment), and trackMounts() so a thrown assertion still unmounts the tree (a tree
// left mounted keeps its Animated timers alive past the test and crashes an unrelated
// suite later — mountRegistry.ts's own warning).
//
// Animated.timing is mocked to a no-op `start` throughout: these tests read the
// DURATION/TARGET it was asked to run, never let a real animation loop run past the
// test (the same leak trackMounts() guards against, one layer earlier).
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Animated } from 'react-native';
import type { JourneyStep } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';
import { MilestoneFlag } from './MilestoneFlag';
import { Station } from './Station';
import {
  MAX_WALK_MS, STEP_MS, StationTrack, bossMilestoneState, splitBossStep, standIndexOf,
  stepStationState, walkDurationMs,
} from './StationTrack';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

// findAllByProps counts every fibre carrying testID — the composite Pressable AND the
// composite View AND the host node underneath all echo 'station-press' (debugged by
// logging each match's `typeof n.type`/`.name`), so a raw list interleaves entries with
// no `onPress` at all between the real ones. Only the composite Pressable node has it.
function stationPresses(root: ReactTestInstance) {
  return root.findAllByProps({ testID: 'station-press' })
    .filter((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function step(over: Partial<JourneyStep>): JourneyStep {
  return { kind: 'dlg', state: 'lock', scenarioId: 'SCN-ER-00001', name: '스텝', ...over } as JourneyStep;
}

let timingSpy: jest.SpyInstance;
let reduceMotionSpy: jest.SpyInstance;

beforeEach(() => {
  // 진짜 애니메이션(리퀘스트 애니메이션 프레임)을 돌리지 않는다 — start()가 아무 일도
  // 하지 않는 가짜만 반환해, 어떤 duration/toValue로 불렀는지만 잰다.
  timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
  reduceMotionSpy = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// 모션 줄이기 확인(AccessibilityInfo.isReduceMotionEnabled)이 끝날 때까지 마운트를 흘려
// 보낸다 — 그래야 도입 걷기(useEffect)가 실행된다.
async function flush() {
  await act(async () => { await Promise.resolve(); });
}

describe('stepStationState', () => {
  it('maps now to here — the one value the brief pins directly', () => {
    expect(stepStationState(step({ state: 'now' }))).toBe('here');
  });
  it('maps done to done', () => {
    expect(stepStationState(step({ state: 'done' }))).toBe('done');
  });
  // optional은 언제든 풀 수 있다 — far(점선/흐림)로 그리면 잠긴 것처럼 보여 그 정의와
  // 모순되므로 next로 그린다.
  it('maps optional to next, not far — optional never locks', () => {
    expect(stepStationState(step({ state: 'optional' }))).toBe('next');
  });
  it('maps lock (and anything unrecognised) to far', () => {
    expect(stepStationState(step({ state: 'lock' }))).toBe('far');
    expect(stepStationState(step({ state: 'weird-future-value' as any }))).toBe('far');
  });
});

describe('splitBossStep', () => {
  it('pulls the trailing boss step out, leaving the rest as stations', () => {
    const steps = [step({ kind: 'dlg' }), step({ kind: 'quiz' }), step({ kind: 'boss', scenarioId: undefined })];
    const { stations, boss } = splitBossStep(steps);
    expect(stations).toHaveLength(2);
    expect(boss?.kind).toBe('boss');
  });
  it('leaves everything as stations when the last step is not a boss', () => {
    const steps = [step({ kind: 'dlg' }), step({ kind: 'quiz' })];
    const { stations, boss } = splitBossStep(steps);
    expect(stations).toHaveLength(2);
    expect(boss).toBeUndefined();
  });
  it('does not invent a boss on an empty list', () => {
    expect(splitBossStep([])).toEqual({ stations: [] });
  });
});

describe('bossMilestoneState', () => {
  it('maps done/now/lock to passed/open/closed, and anything else to closed (never invents open)', () => {
    expect(bossMilestoneState('done')).toBe('passed');
    expect(bossMilestoneState('now')).toBe('open');
    expect(bossMilestoneState('lock')).toBe('closed');
    expect(bossMilestoneState(undefined)).toBe('closed');
  });
});

describe('standIndexOf', () => {
  it('stands at the now step when one exists', () => {
    const stations = [step({ state: 'done' }), step({ state: 'now' }), step({ state: 'lock' })];
    expect(standIndexOf(stations, true)).toBe(1);
  });
  it('stands in front of the flag when everything is done and a boss exists', () => {
    const stations = [step({ state: 'done' }), step({ state: 'done' })];
    expect(standIndexOf(stations, true)).toBe(2);
  });
  it('stands at the last station when everything is done and there is no boss', () => {
    const stations = [step({ state: 'done' }), step({ state: 'done' })];
    expect(standIndexOf(stations, false)).toBe(1);
  });
});

describe('walkDurationMs', () => {
  it('is zero distance, zero time', () => {
    expect(walkDurationMs(0)).toBe(0);
  });
  // 1칸과 40칸이 서로 달라야 하고, 40칸이 상한에 묶여야 한다 — 비례만 두면
  // 40*STEP_MS(220)=8800ms로 "견딜 수 없이 길어진다"(브리프 §7).
  it('gives a one-station hop and a 40-station hop different durations, with the far one capped', () => {
    const near = walkDurationMs(1);
    const far = walkDurationMs(40);
    expect(near).toBe(STEP_MS);
    expect(far).toBeLessThan(1 * STEP_MS * 40);
    expect(far).toBe(MAX_WALK_MS);
    expect(near).not.toBe(far);
  });
  it('never exceeds MAX_WALK_MS regardless of distance', () => {
    expect(walkDurationMs(1000)).toBe(MAX_WALK_MS);
  });
});

// ── component ──────────────────────────────────────────────────────────────

function buildSteps(n: number, hereAt: number, withBoss: boolean): JourneyStep[] {
  const stations = Array.from({ length: n }, (_, i) => step({
    kind: i % 3 === 0 ? 'quiz' : 'dlg',
    state: i < hereAt ? 'done' : i === hereAt ? 'now' : 'lock',
    scenarioId: `SCN-ER-000${i}`,
    name: `스텝 ${i}`,
  }));
  if (!withBoss) return stations;
  return [...stations, step({ kind: 'boss', state: 'lock', scenarioId: undefined, name: '구간 시험' })];
}

describe('StationTrack', () => {
  it('draws every station for a 47-step theme (46 stations + the trailing boss as one flag) — nothing dropped or merged', async () => {
    const steps = buildSteps(46, 10, true); // 46 stations + 1 boss = 47 steps total
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByType(Station)).toHaveLength(46);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(1);
  });

  // 한 대화는 도움받는 판과 혼자 하는 판 두 회차로 나뉘어 오고, 두 회차는 같은
  // scenarioId와 같은 name을 갖는다. 그것으로 키를 만들면 한 주제 안에서 겹치는데,
  // 실제로 겹쳤다 — 실기에서 "two children with the same key" 경고가 화면에 떴다.
  //
  // 개수를 세는 단정으로는 못 잡는다. React는 키가 겹쳐도 노드를 합치지 않고 경고만
  // 낸다(그렇게 써 봤고 옛 키로 되돌려도 통과했다). 그래서 그 경고를 직접 듣는다.
  it('gives every station a distinct key when two passes share a scenario and a name', async () => {
    const steps = buildSteps(6, 0, false).map((st, i) => ({
      ...st,
      // 서버가 실제로 보내는 모양: 같은 대화의 두 회차가 번호와 이름을 공유한다.
      scenarioId: `SCN-PHARMA-0000${Math.floor(i / 2) + 1}`,
      name: '반복 신원확인 이유 설명',
      pass: (i % 2) + 1,
      passes: 2,
    })) as JourneyStep[];
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
      await flush();
      expect(tree.root.findAllByType(Station)).toHaveLength(6);
      const dupe = spy.mock.calls.map((c) => String(c[0] ?? '')).filter((m) => m.includes('same key'));
      expect(dupe).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  it('stands the screen up on an empty theme without inventing a station', async () => {
    const tree = mount(<StationTrack steps={[]} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByType(Station)).toHaveLength(0);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(0);
    expect(tree.root.findAllByProps({ testID: 'station-track' })[0]).toBeTruthy();
  });

  it('renders the last boss step as a flag, not a second station', async () => {
    const steps = buildSteps(3, 3, true); // all 3 done, boss is now the only thing left
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByType(Station)).toHaveLength(3);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(1);
  });

  it('rejects a locked step — no walk, no routing', async () => {
    const onStepPress = jest.fn();
    const steps = buildSteps(5, 1, true); // index 2+ are locked
    const tree = mount(<StationTrack steps={steps} onStepPress={onStepPress} />);
    await flush();
    timingSpy.mockClear(); // 도입 걷기가 이미 한 번 불렀을 수 있으니 여기서부터 다시 센다

    const presses = stationPresses(tree.root);
    act(() => { presses[4].props.onPress(); }); // locked
    expect(onStepPress).not.toHaveBeenCalled();
    expect(timingSpy).not.toHaveBeenCalled();
  });

  it('presses through an unlocked (now) step — routes immediately and starts a walk in the same tick', async () => {
    const onStepPress = jest.fn();
    const steps = buildSteps(5, 1, true); // stand at index 1
    const tree = mount(<StationTrack steps={steps} onStepPress={onStepPress} />);
    await flush();
    timingSpy.mockClear();

    const presses = stationPresses(tree.root);
    act(() => { presses[1].props.onPress(); }); // the 'now' step itself
    expect(onStepPress).toHaveBeenCalledWith(steps[1]);
  });

  it('gives a nearby move and a 40-station move different (capped) durations', async () => {
    // stand at index 2 ('now'); index 1 is a 'done' neighbour one step away, index 42 is
    // marked 'optional' (never locks — StationSheet.tsx's own reasoning) so it is a real,
    // pressable target 41 stations away, well past the cap.
    const steps = buildSteps(45, 2, true);
    steps[42] = { ...steps[42], state: 'optional' };
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    timingSpy.mockClear();

    const presses = stationPresses(tree.root);
    act(() => { presses[1].props.onPress(); }); // |1-2| = 1
    const nearCall = timingSpy.mock.calls.at(-1)!;
    expect((nearCall[1] as { duration: number }).duration).toBe(walkDurationMs(1));

    act(() => { presses[42].props.onPress(); }); // |42-1| = 41, well past the cap
    const farCall = timingSpy.mock.calls.at(-1)!;
    expect((farCall[1] as { duration: number }).duration).toBe(MAX_WALK_MS);
    expect((farCall[1] as { duration: number }).duration).not.toBe((nearCall[1] as { duration: number }).duration);
  });

  it('honours reduce motion — no Animated.timing call at all, on entrance or on press', async () => {
    reduceMotionSpy.mockResolvedValue(true);
    const onStepPress = jest.fn();
    const steps = buildSteps(5, 1, true);
    const tree = mount(<StationTrack steps={steps} onStepPress={onStepPress} />);
    await flush();
    expect(timingSpy).not.toHaveBeenCalled(); // entrance was instant

    // hereAt=1 → index 0 is 'done' (unlocked, pressable).
    const presses = stationPresses(tree.root);
    act(() => { presses[0].props.onPress(); });
    expect(onStepPress).toHaveBeenCalled();
    expect(timingSpy).not.toHaveBeenCalled();
  });
});
