// Station — 정거장 노드 4상태.
//
// task-9-brief.md는 `@testing-library/react-native`의 render/getByTestId로 쓰여 있지만, 이
// 저장소는 그 패키지를 설치하지 않았다(devDependencies에 없음 — @testing-library/dom만 있고,
// 이는 다른 용도다). 그래서 이 저장소의 기존 컴포넌트 테스트가 실제로 쓰는 방식
// (react-test-renderer + testID로 findByProps, 예: screentests/missionCluster.test.tsx의
// `tree.root.findByProps({ testID: ... })`)으로 같은 단정을 옮겼다. 단정 내용은 브리프와 같다:
// RADIUS 고정값, far에 station-lock 부재 + 누르면 onPress, here에서만 station-flag, done에
// PASSED 도장.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { RADIUS, Station } from './Station';

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(el); });
  return tree;
}

function findAllByTestId(root: ReactTestInstance, testID: string) {
  return root.findAll((n) => n.props?.testID === testID);
}

// react-test-renderer's toJSON() flattens RN <Text> children as strings or nested arrays —
// walking it is how screentests/colleagueRelation.test.tsx also reads rendered text. An
// SvgText's string, though, never reaches `children`: react-native-svg lowers it to a host
// RNSVGTSpan node whose text lives in `props.content` instead (confirmed by dumping the
// PASSED stamp's toJSON tree), so that is read too.
function allText(node: unknown): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(allText).join('');
  if (node && typeof node === 'object') {
    const { children, props } = node as { children?: unknown; props?: { content?: unknown } };
    const content = typeof props?.content === 'string' ? props.content : '';
    return content + allText(children);
  }
  return '';
}

describe('Station', () => {
  // 핸드오프가 고정한 반지름이다. 손글씨 4자가 들어가는 최소치라 줄이면 라벨이 깨진다.
  it('keeps the handoff radii', () => {
    expect(RADIUS).toEqual({ here: 30, next: 26, far: 25, done: 24 });
  });

  // 흐린 점선은 "아직 가지 않은 곳"이지 잠금이 아니다(J3). 누를 수 있는 것에
  // 자물쇠를 그리면 화면이 거짓말을 한다.
  it('draws no padlock on a far station and stays pressable', () => {
    const onPress = jest.fn();
    const tree = mount(<Station state="far" label="수혈 관리" onPress={onPress} />);
    expect(findAllByTestId(tree.root, 'station-lock')).toHaveLength(0);
    act(() => { tree.root.findByProps({ testID: 'station-press' }).props.onPress(); });
    expect(onPress).toHaveBeenCalled();
    act(() => { tree.unmount(); });
  });

  it('flies the HERE flag only on here', () => {
    // testID lands on the composite `G` AND the host node react-native-svg lowers it to,
    // so a present flag shows up more than once — the assertion is presence, not count.
    const here = mount(<Station state="here" label="a" onPress={jest.fn()} />);
    expect(findAllByTestId(here.root, 'station-flag').length).toBeGreaterThan(0);
    act(() => { here.unmount(); });

    const next = mount(<Station state="next" label="a" onPress={jest.fn()} />);
    expect(findAllByTestId(next.root, 'station-flag')).toHaveLength(0);
    act(() => { next.unmount(); });
  });

  it('stamps PASSED on done', () => {
    const tree = mount(<Station state="done" label="a" onPress={jest.fn()} />);
    expect(allText(tree.toJSON())).toContain('PASSED');
    act(() => { tree.unmount(); });
  });
});
