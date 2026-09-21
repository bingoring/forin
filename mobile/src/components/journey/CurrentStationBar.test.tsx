// CurrentStationBar — 화면 하단 고정 바 (Task 11). task-11-brief.md는 이 컴포넌트의 테스트
// 파일을 지정하지 않지만, 정본이 못박은 전역 제약("하단 바가 가리킬 곳은 정확히 하나")과
// resume/next 문구(J6·J7)는 깨지면 실제로 조용히 깨지는 성질이라 여기서 직접 잠근다.
//
// Station.test.tsx·FreeRoamRow.test.tsx와 같은 이유로 react-test-renderer를 쓴다
// (@testing-library/react-native 미설치).
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { CurrentStationBar } from './CurrentStationBar';
import type { JourneyCurriculum } from './JourneyMap';

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(el); });
  return tree;
}

function texts(tree: ReturnType<typeof create>): string[] {
  return tree.root.findAllByType(Text).map((n) => String(n.props.children));
}

// `react-test-renderer`'s `findAllByType(Pressable)` compares the element's `type` by
// reference, and this jest environment loads two distinct instances of the
// `Pressable` export (a jest/react-native module-registry quirk confirmed by logging
// `n.type === Pressable` — false — right next to `n.type.name` — 'Pressable' — true).
// Matching by name is what actually finds the node here; the failure mode this file
// cares about (a second interactive target) would still fail this filter the same way
// a reference match would.
function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

/** Every HOST node whose flattened style matches — the same host-only convention
 *  nbUI.test.tsx uses, since a composite (like `View`) and the host node it wraps both
 *  carry the same style prop and counting both doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll((n) => {
    if (typeof n.type !== 'string') return false;
    const st = n.props?.style;
    if (!st) return false;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st;
    return pred(flat);
  });
}

const STATION = { themeKey: 't1', name: '중증 응대', dept: 'ER', done: 2, total: 5 } as JourneyCurriculum;

describe('CurrentStationBar', () => {
  it('reads "이어하기" when kind is resume', () => {
    const tree = mount(<CurrentStationBar station={STATION} kind="resume" onPress={jest.fn()} />);
    expect(texts(tree)).toContain('이어하기');
    expect(texts(tree)).not.toContain('다음 정거장');
    act(() => { tree.unmount(); });
  });

  it('reads "다음 정거장" when kind is next', () => {
    const tree = mount(<CurrentStationBar station={STATION} kind="next" onPress={jest.fn()} />);
    expect(texts(tree)).toContain('다음 정거장');
    expect(texts(tree)).not.toContain('이어하기');
    act(() => { tree.unmount(); });
  });

  // J6/J7: 하단 바가 가리킬 곳은 정확히 하나다. 두 라벨이 동시에 뜨면 "다음"이 둘이라는
  // 뜻이 되어 버린다.
  it('never shows both the resume and the next label at once', () => {
    for (const kind of ['resume', 'next'] as const) {
      const tree = mount(<CurrentStationBar station={STATION} kind={kind} onPress={jest.fn()} />);
      const rendered = texts(tree);
      expect(rendered.includes('이어하기') && rendered.includes('다음 정거장')).toBe(false);
      act(() => { tree.unmount(); });
    }
  });

  // 트랙 전부 통과 = station이 null. resume/next 어느 라벨도 지어내지 않고 구간
  // 시험·자유 탐방을 권하는 문구로 완전히 바뀐다.
  it('recommends a milestone test or free roam when there is no next station', () => {
    const tree = mount(<CurrentStationBar station={null} kind="next" onPress={jest.fn()} />);
    const rendered = texts(tree);
    expect(rendered).not.toContain('다음 정거장');
    expect(rendered).not.toContain('이어하기');
    expect(rendered.join(' ')).toContain('구간 시험');
    act(() => { tree.unmount(); });
  });

  // 하단 바가 가리킬 곳은 정확히 하나다: Pressable이 정확히 하나여야 하고, 그 하나를
  // 누르면 전달된 onPress가 불려야 한다 — 둘이면 두 곳을 "다음"이라 부르는 셈이다.
  it('exposes exactly one pressable target, station present or absent', () => {
    for (const station of [STATION, null]) {
      const onPress = jest.fn();
      const tree = mount(<CurrentStationBar station={station} kind="next" onPress={onPress} />);
      const pressables = findAllPressables(tree.root);
      expect(pressables).toHaveLength(1);
      act(() => { pressables[0].props.onPress(); });
      expect(onPress).toHaveBeenCalledTimes(1);
      act(() => { tree.unmount(); });
    }
  });

  it('does not crash on a sparsely-populated station', () => {
    const sparse = { state: 'here' } as unknown as JourneyCurriculum;
    const tree = mount(<CurrentStationBar station={sparse} kind="resume" onPress={jest.fn()} />);
    expect(findAllPressables(tree.root)).toHaveLength(1);
    act(() => { tree.unmount(); });
  });

  // 한 주제에 코스가 24개쯤 되자 코스마다 네모 하나를 그리던 것(`NbProgSquares`)이 행을
  // 넘쳐 옆의 Resume pill 위에 그려졌다 — 실기에서 확인한 그 증상에 대한 수정이다.
  // 네모는 유지하되 개수가 total을 따라가지 않아야 한다 — 따라가던 것이 Resume pill을
  // 덮은 원인이었다. 8×8 정사각형 호스트 노드를 세면 그게 곧 네모 수다.
  const boxCount = (total: number, done: number) => {
    const station = { ...STATION, total, done } as JourneyCurriculum;
    const tree = mount(<CurrentStationBar station={station} kind="resume" onPress={jest.fn()} />);
    const n = styled(tree.root, (st) => st.width === 8 && st.height === 8).length;
    act(() => { tree.unmount(); });
    return n;
  };
  const litCount = (total: number, done: number) => {
    const station = { ...STATION, total, done } as JourneyCurriculum;
    const tree = mount(<CurrentStationBar station={station} kind="resume" onPress={jest.fn()} />);
    const n = styled(tree.root, (st) => st.width === 8 && st.height === 8
      && st.backgroundColor !== 'transparent').length;
    act(() => { tree.unmount(); });
    return n;
  };

  it('draws the same number of progress boxes for a 40-course topic as a 5-course one', () => {
    expect(boxCount(40, 1)).toBe(boxCount(5, 1));
    expect(boxCount(40, 1)).toBeGreaterThan(0);
  });

  // 양 끝을 반올림에 맡기지 않는다. 24개 중 1개는 4%라 반올림하면 0칸이 되어 "시작도
  // 안 함"으로 읽히고, 99%는 올림하면 전 칸이 되어 "다 끝냄"으로 읽힌다. 둘 다 거짓이다.
  it('lights at least one box for any progress, and fills the row only when everything is done', () => {
    expect(litCount(24, 0)).toBe(0);
    expect(litCount(24, 1)).toBeGreaterThanOrEqual(1);
    expect(litCount(24, 23)).toBeLessThan(boxCount(24, 23));
    expect(litCount(24, 24)).toBe(boxCount(24, 24));
  });

  // The whole point of the fixed-width bar: however many courses a topic has, the Resume
  // pill still renders and is still the thing a tap on this bar activates.
  it('still renders and responds to a press on the Resume pill when a topic has 40 courses', () => {
    const many = { ...STATION, done: 10, total: 40 } as JourneyCurriculum;
    const onPress = jest.fn();
    const tree = mount(<CurrentStationBar station={many} kind="resume" onPress={onPress} />);
    expect(texts(tree)).toContain('이어하기');
    expect(texts(tree)).toContain('25%');
    const pressables = findAllPressables(tree.root);
    expect(pressables).toHaveLength(1);
    act(() => { pressables[0].props.onPress(); });
    expect(onPress).toHaveBeenCalledTimes(1);
    act(() => { tree.unmount(); });
  });
});
