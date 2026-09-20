// GoalDeptSheet — 목표 부서 고르기 시트 (Task 18).
//
// StationSheet.test.tsx·FreeRoamRow.test.tsx와 같은 이유로 react-test-renderer를 쓴다
// (@testing-library/react-native 미설치). BottomSheet가 타이머·rAF를 예약하므로
// mountRegistry.ts의 trackMounts()로 매 테스트가 자기 트리를 정리하게 한다.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { GoalDeptSheet } from './GoalDeptSheet';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

async function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(el)); });
  return tree;
}

function texts(tree: ReturnType<typeof create>): string[] {
  return tree.root.findAllByType(Text).map((n) => String(n.props.children));
}

/** Host-node-only testID lookup. `Pressable` forwards `testID` through its own
 *  wrapping `View` down to the host node, so a plain `findAllByProps({testID})` counts
 *  the SAME row three times (the composite `Pressable`, RN's own `View` wrapper, and
 *  the host node) — this repo's own trap #5 (see task-18-brief.md and
 *  journeyScreen.test.tsx's `hostNodesWithTestId`). Host-only counts the row once. */
function hostNodesWithTestId(root: ReactTestInstance, id: string) {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
}

// A realistic union — a goal plus what free roam would list once it excludes the goal
// (Task 17 — J9 개정: freeRoam은 목표 부서만 빼고 나머지 전부를 층 조건 없이 낸다).
const DEPTS = ['ER', 'ICU', 'OR', 'GEN'];

describe('GoalDeptSheet', () => {
  // 부서 목록은 이 컴포넌트가 만들지 않는다 — 호출부가 건넨 `depts` 그대로, 빠지거나
  // 중복되지 않고 하나씩 그려져야 한다.
  it('renders exactly one row per department it was handed, no more and no fewer', async () => {
    const tree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred={false} onPick={jest.fn()} onClose={jest.fn()} />,
    );
    for (const dept of DEPTS) {
      expect(hostNodesWithTestId(tree.root, `goal-dept-row-${dept}`)).toHaveLength(1);
    }
    expect(tree.root.findAll((n) => typeof n.type === 'string' && typeof n.props?.testID === 'string' && n.props.testID.startsWith('goal-dept-row-')))
      .toHaveLength(DEPTS.length);
  });

  // 네 언어 카탈로그 모두 29개 부서 라벨을 갖췄다고 확인됐다 — raw key가 보이면 안 된다.
  it('names every department instead of falling back to the raw key', async () => {
    const tree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred={false} onPick={jest.fn()} onClose={jest.fn()} />,
    );
    const rendered = texts(tree);
    for (const dept of DEPTS) {
      expect(rendered).not.toContain(`dept.${dept}`);
    }
  });

  // J1: 잠금 없음. 아직 가 보지 않은 부서(GEN, 목표도 자유 탐방 목록의 실제 진도도 아닌
  // 임의의 부서)도 눌러야 하고, `disabled`가 우회되는 게 아니라 애초에 참이 아니어야 한다.
  it('leaves an unvisited department pressable — disabled is never true (J1, no lock)', async () => {
    const tree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred={false} onPick={jest.fn()} onClose={jest.fn()} />,
    );
    const row = tree.root.findByProps({ testID: 'goal-dept-row-GEN' });
    expect(row.props.disabled).not.toBe(true);
  });

  // J5: 부서를 고르는 방법은 하나다 — 자유 탐방 칩과 같은 경로. 이 컴포넌트는 그 경로를
  // 시작만 한다: 고른 부서 그대로 onPick에 넘긴다.
  it('calls onPick with exactly the department that was tapped', async () => {
    const onPick = jest.fn();
    const tree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred={false} onPick={onPick} onClose={jest.fn()} />,
    );
    act(() => { tree.root.findByProps({ testID: 'goal-dept-row-OR' }).props.onPress(); });
    expect(onPick).toHaveBeenCalledWith('OR');
    expect(onPick).not.toHaveBeenCalledWith('ER');
  });

  // 지금 목표인 부서만 구별되어야 한다 — 다른 행에는 체크가 없다.
  it('marks only the current goal department, not the others', async () => {
    const tree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ICU" inferred={false} onPick={jest.fn()} onClose={jest.fn()} />,
    );
    expect(hostNodesWithTestId(tree.root, 'goal-dept-current-mark')).toHaveLength(1); // 딱 하나 — 지금 목표뿐
    const icuRow = tree.root.findByProps({ testID: 'goal-dept-row-ICU' });
    expect(hostNodesWithTestId(icuRow, 'goal-dept-current-mark')).toHaveLength(1);
  });

  // §2: inferred가 참이면 고르라고 권하는 어조여야 한다 — 아직 학습자의 선택이 아니므로.
  it('reads with an inviting tone when the goal is only inferred, not chosen', async () => {
    const inferredTree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred onPick={jest.fn()} onClose={jest.fn()} />,
    );
    const chosenTree = await mount(
      <GoalDeptSheet depts={DEPTS} current="ER" inferred={false} onPick={jest.fn()} onClose={jest.fn()} />,
    );
    expect(texts(inferredTree).join(' ')).not.toEqual(texts(chosenTree).join(' '));
  });
});
