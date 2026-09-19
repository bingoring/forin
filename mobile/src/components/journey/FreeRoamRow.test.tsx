// FreeRoamRow — 자유 탐방 칩 줄 (Task 11).
//
// task-11-brief.md는 `@testing-library/react-native`의 render/getByTestId/queryByText로
// 쓰여 있지만, 이 저장소는 그 패키지를 설치하지 않았다(Station.test.tsx·JourneyMap.test.tsx가
// 이미 같은 이유로 남긴 메모 참고). 그래서 기존 관례대로 react-test-renderer
// (act/create/findByProps/findAllByType)로 같은 단정을 옮겼다. 브리프의 세 단정은 그대로이고,
// 이 파일이 지키는 성질 중 브리프에 없는 것도 있다:
//   - 도장은 통과한 정거장 수(passed)다 — 시나리오 총량(total)이 아니다.
//   - 칩마다 독립적으로 눌린다: OR 칩을 누르면 ICU가 아니라 OR이 넘어간다.
//   - 클라이언트 카탈로그에 빠져 있던 WARD·SURGWARD·ORTHOWARD·DERM 네 부서도 raw key가
//     아니라 실제 이름으로 보인다.
import { act, create } from 'react-test-renderer';
import { Text } from 'react-native';
import { FreeRoamRow } from './FreeRoamRow';

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(el); });
  return tree;
}

function texts(tree: ReturnType<typeof create>): string[] {
  return tree.root.findAllByType(Text).map((n) => String(n.props.children));
}

describe('FreeRoamRow', () => {
  // 부서를 고르는 방법은 하나다(J5): 칩을 누르면 목표가 바뀐다. 미리보기와 확정을
  // 나누면 학습자가 "지금 보는 게 내 목표인가"를 매번 판단해야 한다.
  it('picks the department it was tapped on', () => {
    const onPick = jest.fn();
    const tree = mount(<FreeRoamRow entries={[{ dept: 'ICU', passed: 3, total: 35 }]} onPick={onPick} />);
    act(() => { tree.root.findByProps({ testID: 'chip-ICU' }).props.onPress(); });
    expect(onPick).toHaveBeenCalledWith('ICU');
    act(() => { tree.unmount(); });
  });

  it('shows the stamp count', () => {
    const tree = mount(<FreeRoamRow entries={[{ dept: 'ICU', passed: 3, total: 35 }]} onPick={jest.fn()} />);
    expect(texts(tree)).toContain('3');
    act(() => { tree.unmount(); });
  });

  it('draws no lock — free roam is free', () => {
    const tree = mount(<FreeRoamRow entries={[{ dept: 'ICU', passed: 0, total: 35 }]} onPick={jest.fn()} />);
    expect(tree.root.findAll((n) => n.props?.testID === 'chip-lock')).toHaveLength(0);
    act(() => { tree.unmount(); });
  });

  // 도장은 통과한 정거장 수다. total(시나리오 총량)을 도장인 양 보여주면 학습자가 "35개나
  // 갔다 왔다"고 잘못 읽는다.
  it('never shows the scenario total as if it were the stamp count', () => {
    const tree = mount(<FreeRoamRow entries={[{ dept: 'ICU', passed: 3, total: 35 }]} onPick={jest.fn()} />);
    expect(texts(tree)).not.toContain('35');
    act(() => { tree.unmount(); });
  });

  // 칩은 각각 자기 부서로만 통한다 — 어느 칩을 눌러도 같은 곳으로 가면 자유 탐방이 아니다.
  it('renders one chip per entry, each independently pressable to its own dept', () => {
    const onPick = jest.fn();
    const tree = mount(<FreeRoamRow entries={[
      { dept: 'ICU', passed: 3, total: 35 },
      { dept: 'OR', passed: 0, total: 12 },
    ]} onPick={onPick} />);
    act(() => { tree.root.findByProps({ testID: 'chip-OR' }).props.onPress(); });
    expect(onPick).toHaveBeenCalledWith('OR');
    expect(onPick).not.toHaveBeenCalledWith('ICU');
    act(() => { tree.unmount(); });
  });

  // 클라이언트 카탈로그에 빠져 있던 네 부서 — 빠진 채면 t()가 raw key를 그대로 돌려줘
  // 칩에 "dept.WARD" 같은 코드가 보인다(i18n/index.ts의 fallback 규칙).
  it('names the four newly-added departments instead of falling back to the raw key', () => {
    const tree = mount(<FreeRoamRow entries={[
      { dept: 'WARD', passed: 1, total: 10 },
      { dept: 'SURGWARD', passed: 0, total: 10 },
      { dept: 'ORTHOWARD', passed: 0, total: 10 },
      { dept: 'DERM', passed: 0, total: 10 },
    ]} onPick={jest.fn()} />);
    const rendered = texts(tree);
    for (const code of ['WARD', 'SURGWARD', 'ORTHOWARD', 'DERM']) {
      expect(rendered).not.toContain(`dept.${code}`);
    }
    act(() => { tree.unmount(); });
  });

  it('renders nothing on an empty free-roam list without crashing', () => {
    const tree = mount(<FreeRoamRow entries={[]} onPick={jest.fn()} />);
    expect(tree.root.findAll((n) => typeof n.props?.testID === 'string' && n.props.testID.startsWith('chip-'))).toHaveLength(0);
    act(() => { tree.unmount(); });
  });
});
