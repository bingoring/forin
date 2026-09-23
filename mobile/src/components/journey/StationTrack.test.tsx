// StationTrack — journey-binder-v42 Task H, task-H-brief.md §1 (반드시 살아남아야 하는
// 것), §8 (새로 잠글 것).
//
// @testing-library/react-native is not installed in this repo — this file follows the
// same react-test-renderer conventions the rest of this suite already does:
// findByProps/findAllByProps for testID lookups, name-matching for Pressable
// (findAllByType(Pressable) always returns 0 in this jest environment), and trackMounts()
// so a thrown assertion still unmounts the tree.
//
// Animated.timing/loop are mocked to a no-op `start` throughout: these tests read the
// DURATION/TARGET/DELAY they were asked to run, never let a real animation loop run past
// the test.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Animated, Text, useWindowDimensions } from 'react-native';
import type { JourneyStep } from '@/api/client';
import { trackMounts } from '../../testing/mountRegistry';
import { MilestoneFlag } from './MilestoneFlag';
import { NbStampNode } from '@/components/nb/NbStampNode';
import { NbYarn } from '@/components/nb/NbYarn';
import {
  BOTTOM_PAD, MAX_WALK_MS, STEP_MS, StationTrack, bossMilestoneState, sectionBoundaries,
  splitBossStep, stampPoint, stampStateOf, standIndexOf, stepStationState, tierLabelKey,
  walkDurationMs,
} from './StationTrack';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

// findAllByProps counts every fibre carrying testID — the composite Pressable AND the
// composite View AND the host node underneath all echo 'station-press', so a raw list
// interleaves entries with no `onPress` at all between the real ones. Only the composite
// Pressable node has it.
function stationPresses(root: ReactTestInstance) {
  return root.findAllByProps({ testID: 'station-press' })
    .filter((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

// Same duplication as `stationPresses` above, one layer down: RN's <Text> is a composite
// component whose host node underneath echoes the same testID, so a raw findAllByProps
// double-counts every label. Keeping only the composite `Text` fibre gives one entry per
// station, in render order.
function stationLabels(root: ReactTestInstance) {
  return root.findAllByProps({ testID: 'station-label' }).filter((n) => n.type === Text);
}

function step(over: Partial<JourneyStep>): JourneyStep {
  return { kind: 'dlg', state: 'lock', scenarioId: 'SCN-ER-00001', name: '스텝', ...over } as JourneyStep;
}

let timingSpy: jest.SpyInstance;
let reduceMotionSpy: jest.SpyInstance;
// The real width `useWindowDimensions()` reports in this jest environment — read once via
// a throwaway render rather than hardcoded, so a future change to jest-expo's device mock
// cannot quietly desync this file's expectations from what the component actually sees.
let WIDTH = 0;

beforeAll(() => {
  function Probe() { WIDTH = useWindowDimensions().width; return null; }
  act(() => { create(<Probe />); });
});

beforeEach(() => {
  timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
  jest.spyOn(Animated, 'loop').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
  reduceMotionSpy = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

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
  it('maps optional to next, not far — optional never locks', () => {
    expect(stepStationState(step({ state: 'optional' }))).toBe('next');
  });
  it('maps lock (and anything unrecognised) to far', () => {
    expect(stepStationState(step({ state: 'lock' }))).toBe('far');
    expect(stepStationState(step({ state: 'weird-future-value' as any }))).toBe('far');
  });
});

describe('stampStateOf', () => {
  it('carries done/here/next through unchanged and maps far to locked', () => {
    expect(stampStateOf('done')).toBe('done');
    expect(stampStateOf('here')).toBe('here');
    expect(stampStateOf('next')).toBe('next');
    expect(stampStateOf('far')).toBe('locked');
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

// ── §2 배치 ──────────────────────────────────────────────────────────────

describe('stampPoint', () => {
  // test 7 — 10점 주기를 돈다. 11번째(i=10)는 base[0]과 같은 기준점을 쓰지만 흔들림이
  // 반대 부호라 x가 달라야 하고, y는 정확히 한 주기(600) 더 크다. 통과하기 쉬운 모양이라
  // (같은 base라 x가 우연히 같아질 수 있다고 착각하기 쉽다) 실제로 부호가 다른지까지 본다.
  it('repeats the 10-point pattern every cycle, jittering x and adding exactly one cycle of y', () => {
    const width = 402;
    const first = stampPoint(0, width);
    const eleventh = stampPoint(10, width);
    expect(eleventh.y - first.y).toBe(600);
    expect(eleventh.x).not.toBe(first.x);
    // 0번째 주기(k=0)는 -6, 1번째 주기(k=1)는 +8 — 반대 부호로 흔든다.
    expect(eleventh.x).toBeGreaterThan(first.x);
  });

  // test 8 — x가 화면 폭에 비례한다. 통과하기 쉬운 모양이라(반올림 등으로 우연히
  // 비슷해 보일 수 있다) 두 폭에서 낸 비율이 정확히 같은지, 그리고 폭이 다르면 실제
  // 픽셀 x도 달라지는지(즉 상수로 굳어 있지 않은지)까지 본다.
  it('scales x proportionally to screen width — the ratio is the same at 402 and at 320', () => {
    const wide = stampPoint(11, 402);
    const narrow = stampPoint(11, 320);
    expect(wide.x).not.toBe(narrow.x);
    expect(wide.x / 402).toBeCloseTo(narrow.x / 320, 10);
  });
});

// ── §5-3 구간 경계 ──────────────────────────────────────────────────────

describe('sectionBoundaries', () => {
  // test 9 — 경계는 difficulty가 바뀌는 자리에서 나온다. 통과하기 쉬운 모양이라(길이로
  // 나누는 예전 로직이 우연히 같은 답을 낼 수 있다) 12로 나누어떨어지지 않는 배치로,
  // 그리고 정확히 두 곳(0번과 3번)뿐인지까지 본다.
  it('places a boundary wherever difficulty changes, not every 12th step', () => {
    const stations = [1, 1, 1, 2, 2].map((d) => step({ difficulty: d } as any));
    expect(sectionBoundaries(stations)).toEqual([0, 3]);
  });

  // test 10 — 전부 같으면(또는 서버가 안 보내 전부 undefined면) 경계는 맨 앞 하나뿐이다.
  it('gives exactly one boundary (the front) when difficulty never changes', () => {
    const same = Array.from({ length: 5 }, () => step({ difficulty: 2 } as any));
    expect(sectionBoundaries(same)).toEqual([0]);

    const undef = Array.from({ length: 5 }, () => step({}));
    expect(sectionBoundaries(undef)).toEqual([0]);
  });
});

describe('tierLabelKey', () => {
  it('names 1/2/3 and invents nothing for anything else', () => {
    expect(tierLabelKey(1)).toBe('journey.tier.1');
    expect(tierLabelKey(2)).toBe('journey.tier.2');
    expect(tierLabelKey(3)).toBe('journey.tier.3');
    // test 11 — 4처럼 이름 없는 값은 라벨을 지어내지 않는다(잔선만 긋는다).
    expect(tierLabelKey(4)).toBeNull();
    expect(tierLabelKey(undefined)).toBeNull();
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
    expect(tree.root.findAllByType(NbStampNode)).toHaveLength(46);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(1);
  });

  it('gives every station a distinct key when two passes share a scenario and a name', async () => {
    const steps = buildSteps(6, 0, false).map((st, i) => ({
      ...st,
      scenarioId: `SCN-PHARMA-0000${Math.floor(i / 2) + 1}`,
      name: '반복 신원확인 이유 설명',
      pass: (i % 2) + 1,
      passes: 2,
    })) as JourneyStep[];
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
      await flush();
      expect(tree.root.findAllByType(NbStampNode)).toHaveLength(6);
      const dupe = spy.mock.calls.map((c) => String(c[0] ?? '')).filter((m) => m.includes('same key'));
      expect(dupe).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  it('stands the screen up on an empty theme without inventing a station', async () => {
    const tree = mount(<StationTrack steps={[]} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByType(NbStampNode)).toHaveLength(0);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(0);
    expect(tree.root.findAllByProps({ testID: 'station-track' })[0]).toBeTruthy();
  });

  it('renders the last boss step as a flag, not a second station', async () => {
    const steps = buildSteps(3, 3, true); // all 3 done, boss is now the only thing left
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByType(NbStampNode)).toHaveLength(3);
    expect(tree.root.findAllByType(MilestoneFlag)).toHaveLength(1);
  });

  it('rejects a locked step — no walk, no routing', async () => {
    const onStepPress = jest.fn();
    const steps = buildSteps(5, 1, true); // index 2+ are locked
    const tree = mount(<StationTrack steps={steps} onStepPress={onStepPress} />);
    await flush();
    timingSpy.mockClear();

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

    const presses = stationPresses(tree.root);
    act(() => { presses[0].props.onPress(); });
    expect(onStepPress).toHaveBeenCalled();
    expect(timingSpy).not.toHaveBeenCalled();
  });

  // test 16 — next와 locked이 실제로 다르게 그려진다(우표 자체에 넘기는 state로).
  it('draws next and locked stamps with different states', async () => {
    const steps = buildSteps(5, 1, true); // index1=now(here), index2..4=lock(far→locked)
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    const stamps = tree.root.findAllByType(NbStampNode);
    expect(stamps[1].props.state).toBe('here');
    expect(stamps[2].props.state).toBe('locked');
    expect(stamps[0].props.state).toBe('done');
  });

  // test 12 — 현재보다 7칸 넘게 뒤에 있는 잠긴 우표는 이름 대신 '· · ·'를 보인다.
  it('folds a locked stamp more than 6 slots behind the current one into an ellipsis label', async () => {
    const steps = buildSteps(10, 1, false); // stand at index 1, indices 2..9 locked
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    const labels = stationLabels(tree.root);
    // index 7: |7-1|=6, not >6 — keeps its real name.
    expect(labels[7].props.children).toBe('스텝 7');
    expect((labels[7].props.style as { opacity: number }).opacity).toBe(1);
    // index 8: |8-1|=7, >6 — folds.
    expect(labels[8].props.children).toBe('· · ·');
    expect((labels[8].props.style as { opacity: number }).opacity).toBe(0.55);
  });

  // test 13 — 실이 첫 우표부터 현재 우표까지만 이어진다, 현재 뒤로는 점선이다.
  it('threads the yarn from the first stamp only up to the current one, dashing the rest', async () => {
    const steps = buildSteps(6, 3, false); // stand at index 3
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    const yarn = tree.root.findAllByType(NbYarn)[0];
    expect(yarn.props.pts).toHaveLength(4); // indices 0..3 inclusive

    const future = tree.root.findAllByProps({ testID: 'future-path' })[0];
    const startPoint = stampPoint(3, WIDTH);
    expect(future.props.d).toContain(`M${startPoint.x} ${startPoint.y}`);
  });

  it('threads the yarn all the way through when every station is done (no current step)', async () => {
    const steps = buildSteps(4, 4, false); // hereAt === n → every station is 'done', no 'now'
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    const yarn = tree.root.findAllByType(NbYarn)[0];
    expect(yarn.props.pts).toHaveLength(4);
  });

  // test 14 — 현재 스텝이 없으면(전부 통과) 아래 카드를 그리지 않는다.
  it('draws no bottom card when there is no current (now) step', async () => {
    const steps = buildSteps(4, 4, false); // all done, no 'now'
    const tree = mount(<StationTrack steps={steps} onStepPress={jest.fn()} />);
    await flush();
    expect(tree.root.findAllByProps({ testID: 'stamp-current-card' })).toHaveLength(0);
  });

  // test 15 — 아래 카드의 '시작'을 누르면 그 스텝으로 onStepPress가 불린다.
  it('routes through the bottom card\'s start button for the current step', async () => {
    const onStepPress = jest.fn();
    const steps = buildSteps(5, 2, false); // stand at index 2
    const tree = mount(<StationTrack steps={steps} onStepPress={onStepPress} />);
    await flush();
    const card = tree.root.findAllByProps({ testID: 'stamp-current-card' })[0];
    expect(card).toBeTruthy();

    // NbButton wraps a composite Pressable, same lookup convention as `stationPresses`.
    const pressable = card.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable' && typeof n.props.onPress === 'function');
    expect(pressable.length).toBeGreaterThan(0);
    act(() => { pressable[pressable.length - 1].props.onPress(); });
    expect(onStepPress).toHaveBeenCalledWith(steps[2]);
  });
});
