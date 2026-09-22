// MilestoneFlag — 트랙 끝의 구간 시험 깃발 (Task 19).
//
// Station.test.tsx·ThemeList.test.tsx와 같은 이유로 react-test-renderer를 쓴다
// (@testing-library/react-native 미설치, task-19-brief.md 함정 1).
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { MilestoneFlag } from './MilestoneFlag';
import { NbPaper } from '@/components/nb/NbUI';
import { trackMounts } from '@/testing/mountRegistry';

const track = trackMounts(); // 함정 4: 단정이 던지면 언마운트를 건너뛰어 jest 환경이 무너진다

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

function texts(tree: ReturnType<typeof create>): string[] {
  return tree.root.findAllByType(Text).map((n) => String(n.props.children));
}

// ThemeList.test.tsx와 같은 이유로 이름으로 매칭한다 — 이 jest 환경은 Pressable을
// 두 개의 서로 다른 모듈 인스턴스로 로드해 참조 비교(findAllByType(Pressable), 함정 2)가
// 항상 0을 돌려준다.
function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

// NbPaper forwards `testID` to the host View it renders, so a testID-based lookup here
// would double-match the composite NbPaper node and its host child (함정 5's shape, one
// level up from the plural+.length case the brief names — the same doubling, singular
// findByProps would just throw instead of silently inflating a count). Matching on the
// composite TYPE instead — the same move JourneyMap.test.tsx already makes for
// `findAllByType(Station)` — finds exactly one node, and its `style` prop is the plain
// object MilestoneFlag.tsx passed in (not the array NbPaper builds for its own host View).
function paperOpacity(tree: ReturnType<typeof create>): number | undefined {
  const papers = tree.root.findAllByType(NbPaper);
  expect(papers).toHaveLength(1);
  return (papers[0].props.style as { opacity?: number }).opacity;
}

describe('MilestoneFlag', () => {
  // props에 onPress가 없다(정본): 누르는 것이 아니라 표시다. 실제로 눌리는 곳(Pressable)이
  // 트리 어디에도 없어야 한다 — 타입만으로는 나중에 누군가 감싸 넣는 회귀를 못 잡는다.
  it('is not pressable — a sign, not a button', () => {
    const tree = mount(<MilestoneFlag title="구간 시험" state="open" />);
    expect(findAllPressables(tree.root)).toHaveLength(0);
  });

  it('shows the title it was given and the localized state text', () => {
    const tree = mount(<MilestoneFlag title="구간 시험" state="open" />);
    expect(texts(tree)).toContain('구간 시험');
    // 기본 로케일(ko)에서 열린 상태의 손글씨 문구.
    expect(texts(tree)).toContain('응시 가능');
  });

  // 자물쇠가 아니라 흐림이다(J1/J3의 연장선, task-19-brief.md). open과 closed가 실제로
  // 다르게 보여야 한다 — 존재만으로는 부족하다.
  it('dims before it opens and is full-strength once open', () => {
    const closed = mount(<MilestoneFlag title="구간 시험" state="closed" />);
    expect(paperOpacity(closed)).toBe(0.55);

    const open = mount(<MilestoneFlag title="구간 시험" state="open" />);
    expect(paperOpacity(open)).toBe(1);
  });

  // `passed`는 지금 서버가 보내지 않지만(브리프), 타입이 받아 두는 값이라 최소한 흐리지
  // 않는다는 것만 잠근다 — closed와 같은 취급을 받으면 안 된다.
  it('does not dim a passed milestone', () => {
    const tree = mount(<MilestoneFlag title="구간 시험" state="passed" />);
    expect(paperOpacity(tree)).toBe(1);
  });

  // 정본 §5 원칙(J3)의 연장 — 이 화면 어디에도 자물쇠 그림을 쓰지 않는다. NbIcon을 쓰지
  // 않는 컴포넌트지만, 나중에 누가 자물쇠를 끌어와 붙이는 회귀를 이름으로 잡는다.
  it('never draws a lock', () => {
    const tree = mount(<MilestoneFlag title="구간 시험" state="closed" />);
    const locks = tree.root.findAll((n) => {
      const name = (n.props as { name?: string; testID?: string })?.name ?? (n.props as { testID?: string })?.testID;
      return typeof name === 'string' && name.toLowerCase().includes('lock');
    });
    expect(locks).toHaveLength(0);
  });

  // 상태 세 값이 서로 다른 손글씨 문구로 보여야 한다 — 하나로 뭉개면 open/closed/passed를
  // 눈으로 구별할 수 없다.
  it('gives each state its own text', () => {
    const seen = new Set<string>();
    for (const state of ['passed', 'open', 'closed'] as const) {
      const tree = mount(<MilestoneFlag title="구간 시험" state={state} />);
      const label = texts(tree).find((s) => s !== '구간 시험')!;
      expect(label).toBeTruthy();
      seen.add(label);
    }
    expect(seen.size).toBe(3);
  });
});
