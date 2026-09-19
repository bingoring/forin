// JourneyMap — path layout + station-state mapping (Task 10).
//
// Same constraint as Station.test.tsx: this repo has no @testing-library/react-native, so
// assertions go through react-test-renderer (act/create/findAllByType), the pattern
// screentests/missionCluster.test.tsx and Station.test.tsx already use.
//
// Beyond the three `stationStates` cases the brief hands over verbatim, this file also
// locks in the properties the global constraints call out by name:
//   - J1/J3: a station the learner hasn't reached yet ("far") still presses through —
//     the map must not be the place that quietly turns the dashed outline into a lock.
//   - "here" is never invented: the map only shows one if the server sent one.
//   - a path segment is only drawn "done" when BOTH stations it joins are done.
import { act, create } from 'react-test-renderer';
import { ScrollView } from 'react-native';
import { BOTTOM_PAD, JourneyMap, stationPoint, stationStates, type JourneyCurriculum } from './JourneyMap';
import { PathSegment } from './PathSegment';
import { Station } from './Station';

describe('stationStates', () => {
  // 서버의 셋(passed/here/open)을 화면의 넷으로 옮긴다. 처음 만나는 open만 next이고
  // 그 뒤는 흐린 점선이다 — 경로가 어디까지 왔는지 한눈에 읽히게 하려는 것이다.
  it('maps the first open station to next and dims the rest', () => {
    expect(stationStates([
      { state: 'passed' }, { state: 'here' }, { state: 'open' }, { state: 'open' },
    ] as any)).toEqual(['done', 'here', 'next', 'far']);
  });

  it('has a next even when nothing has been started', () => {
    expect(stationStates([{ state: 'open' }, { state: 'open' }] as any)).toEqual(['next', 'far']);
  });

  it('has no next when everything is passed', () => {
    expect(stationStates([{ state: 'passed' }, { state: 'passed' }] as any)).toEqual(['done', 'done']);
  });
});

describe('stationPoint', () => {
  // 서버는 좌표를 모른다(J10) — 이 함수가 읽는 건 인덱스와 폭뿐이다. 짝수 줄은 왼쪽,
  // 홀수 줄은 오른쪽으로 스윙하고, 세로 간격은 고정 108이다.
  it('zigzags left on even rows, right on odd rows, 108px apart vertically', () => {
    const width = 400;
    expect(stationPoint(0, width)).toEqual({ x: 200 - 400 * 0.28, y: 56 });
    expect(stationPoint(1, width)).toEqual({ x: 200 + 400 * 0.28, y: 164 });
    expect(stationPoint(2, width)).toEqual({ x: 200 - 400 * 0.28, y: 272 });
  });
});

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(el); });
  return tree;
}

const CURRICULA: JourneyCurriculum[] = [
  { themeKey: 't1', name: '체온 측정', state: 'passed' },
  { themeKey: 't2', name: '투약 확인', state: 'here' },
  { themeKey: 't3', name: '낙상 예방', state: 'open' },
  { themeKey: 't4', name: '욕창 관리', state: 'open' },
] as any;

describe('JourneyMap', () => {
  it('renders one Station per curriculum entry, in the mapped state', () => {
    const tree = mount(<JourneyMap track={{ curricula: CURRICULA }} onStationPress={jest.fn()} />);
    const states = tree.root.findAllByType(Station).map((n) => n.props.state);
    expect(states).toEqual(['done', 'here', 'next', 'far']);
    act(() => { tree.unmount(); });
  });

  // J1/J3: "far" is not-yet-visited, not locked. If the wiring here ever special-cased
  // it (e.g. swallowing the press for anything but `here`), this is what would catch it —
  // Station's own test only proves Station itself stays pressable, not that JourneyMap
  // passes a live handler through for every station.
  it('presses through to onStationPress for every station, including a far one', () => {
    const onStationPress = jest.fn();
    const tree = mount(<JourneyMap track={{ curricula: CURRICULA }} onStationPress={onStationPress} />);
    const stations = tree.root.findAllByType(Station);
    act(() => { stations[3].props.onPress(); }); // t4, state 'far'
    expect(onStationPress).toHaveBeenCalledWith('t4');
    act(() => { stations[0].props.onPress(); }); // t1, state 'done'
    expect(onStationPress).toHaveBeenCalledWith('t1');
    act(() => { tree.unmount(); });
  });

  // "here"는 정확히 하나이거나 없다 — 지도가 지어내면 안 된다. 서버가 하나도 안 준 경우
  // (여기서는 전부 'open') Station 중 어느 것도 'here' 상태로 그려지지 않아야 한다.
  it('never fabricates a here station when the server sent none', () => {
    const noHere = [
      { themeKey: 'a', name: 'A', state: 'open' },
      { themeKey: 'b', name: 'B', state: 'open' },
      { themeKey: 'c', name: 'C', state: 'open' },
    ] as any;
    const tree = mount(<JourneyMap track={{ curricula: noHere }} onStationPress={jest.fn()} />);
    const states = tree.root.findAllByType(Station).map((n) => n.props.state);
    expect(states).not.toContain('here');
    expect(states).toEqual(['next', 'far', 'far']);
    act(() => { tree.unmount(); });
  });

  // 경로 선의 done은 양쪽 정거장이 모두 done일 때만 참이다. done,done,here → [true, false].
  it('marks a path segment done only when both endpoints are done', () => {
    const twoDoneOneHere = [
      { themeKey: 'a', state: 'passed' },
      { themeKey: 'b', state: 'passed' },
      { themeKey: 'c', state: 'here' },
    ] as any;
    const tree = mount(<JourneyMap track={{ curricula: twoDoneOneHere }} onStationPress={jest.fn()} />);
    const segments = tree.root.findAllByType(PathSegment).map((n) => n.props.done);
    expect(segments).toEqual([true, false]);
    act(() => { tree.unmount(); });
  });

  // 핸드오프 §5: 지도 스크롤 콘텐츠의 하단 패딩이 96px 이상이어야 고정 바에 가리지 않는다.
  it('keeps the fixed bar clear with a scroll content bottom padding of at least 96', () => {
    expect(BOTTOM_PAD).toBeGreaterThanOrEqual(96);
    const tree = mount(<JourneyMap track={{ curricula: CURRICULA }} onStationPress={jest.fn()} />);
    const scroll = tree.root.findAllByType(ScrollView)[0];
    expect((scroll.props.contentContainerStyle as { paddingBottom?: number }).paddingBottom).toBe(BOTTOM_PAD);
    act(() => { tree.unmount(); });
  });

  // 계약 타입은 전부 optional이다 — 실제로는 거의 항상 채워지는 필드(name/themeKey/done/total)가
  // 빠져도 지도가 죽지 않아야 한다.
  it('does not crash on sparsely-populated curricula', () => {
    const sparse = [{ state: 'open' }, { state: 'passed' }] as any;
    const onStationPress = jest.fn();
    const tree = mount(<JourneyMap track={{ curricula: sparse }} onStationPress={onStationPress} />);
    expect(tree.root.findAllByType(Station)).toHaveLength(2);
    act(() => { tree.root.findAllByType(Station)[0].props.onPress(); });
    expect(onStationPress).toHaveBeenCalledWith('');
    act(() => { tree.unmount(); });
  });

  it('renders nothing on an empty track without crashing', () => {
    const tree = mount(<JourneyMap track={{ curricula: [] }} onStationPress={jest.fn()} />);
    expect(tree.root.findAllByType(Station)).toHaveLength(0);
    expect(tree.root.findAllByType(PathSegment)).toHaveLength(0);
    act(() => { tree.unmount(); });
  });
});
