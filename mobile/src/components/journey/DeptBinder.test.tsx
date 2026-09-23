// DeptBinder — 일터 탭 부서 간지 (journey-binder-v42 Task E, task-E-brief.md §테스트).
//
// @testing-library/react-native is not installed in this repo — react-test-renderer
// throughout, same convention as ThemeList.test.tsx (its history: `git log -- ThemeList.test.tsx`).
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import Svg from 'react-native-svg';
import { DeptBinder, groupByTrack, indexTabTop } from './DeptBinder';
import type { JourneyCurriculum } from './JourneyMap';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

// react-test-renderer's `findAllByType(Pressable)` compares by reference, and this
// jest environment loads two distinct instances of the `Pressable` export (a
// jest/react-native module-registry quirk) — matching by name is what actually finds
// the node (ThemeList.test.tsx documented the same trap).
function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function card(root: ReactTestInstance, themeKey: string) {
  return root.findAll((n) => typeof n.type === 'function'
    && (n.type as { name?: string }).name === 'Pressable'
    && n.props?.testID === `theme-card-${themeKey}`)[0];
}

function progressRows(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'dept-binder-progress-row');
}

function progressCells(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'dept-binder-progress-cell');
}

function stampGrids(root: ReactTestInstance, themeKey: string): ReactTestInstance[] {
  const c = card(root, themeKey);
  return c.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'theme-stamp-grid');
}

function curriculum(overrides: Partial<JourneyCurriculum>): JourneyCurriculum {
  return {
    themeKey: 't', name: '주제', state: 'open', track: 'core', done: 0, total: 4, resume: false,
    ...overrides,
  } as JourneyCurriculum;
}

describe('groupByTrack (moved from ThemeList.tsx, K3)', () => {
  it('buckets track === "core" into core and everything else into depth', () => {
    const items = [
      curriculum({ themeKey: 'a', track: 'core' }),
      curriculum({ themeKey: 'b', track: 'depth' }),
      curriculum({ themeKey: 'c', track: 'collab' as unknown as string }),
      curriculum({ themeKey: 'd', track: undefined }),
    ];
    const { core, depth } = groupByTrack(items);
    expect(core.map((c) => c.themeKey)).toEqual(['a']);
    expect(depth.map((c) => c.themeKey)).toEqual(['b', 'c', 'd']);
  });
});

describe('DeptBinder', () => {
  // 1. 주제 35개 → 진행 격자가 35칸이고 3줄로 접힌다(한 줄 12개 규칙이 깨지면 실패해야
  //    한다 — 행 단위로 명시적으로 잘라 그리므로, 행마다 담긴 칸 수를 직접 센다).
  it('folds a 35-topic progress grid into exactly 3 rows of 12/12/11 cells', () => {
    const curricula = Array.from({ length: 35 }, (_, i) => curriculum({ themeKey: `t${i}`, name: `주제 ${i}` }));
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);

    expect(progressCells(tree.root)).toHaveLength(35);
    const rows = progressRows(tree.root);
    expect(rows).toHaveLength(3);
    const perRow = rows.map((r) => r.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'dept-binder-progress-cell').length);
    expect(perRow).toEqual([12, 12, 11]);
  });

  // 2. 주제 15개 → 같은 화면이 서고 칸이 15개다. 빈 칸을 지어내지 않는다.
  it('renders exactly 15 grid cells for 15 topics — never pads to a round number', () => {
    const curricula = Array.from({ length: 15 }, (_, i) => curriculum({ themeKey: `t${i}` }));
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    expect(progressCells(tree.root)).toHaveLength(15);
    // 15 = 12 + 3 → two rows, not one padded-to-24 row.
    const rows = progressRows(tree.root);
    expect(rows).toHaveLength(2);
  });

  // 3. total이 23인 주제 → 우표 격자가 23개다.
  it('draws a 23-cell stamp grid for a topic whose total is 23', () => {
    const curricula = [curriculum({ themeKey: 'big', total: 23, done: 5 })];
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    const grid = stampGrids(tree.root, 'big')[0];
    // Each stamp square is a direct child of the grid's own host node.
    expect(grid.children.length).toBe(23);
  });

  // 4. total이 0인 주제 → 격자가 0개이고 예외가 나지 않는다.
  it('draws no stamp grid at all for a topic with total 0, and does not throw', () => {
    const curricula = [curriculum({ themeKey: 'empty', total: 0, done: 0 })];
    expect(() => {
      const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
      expect(stampGrids(tree.root, 'empty')).toHaveLength(0);
    }).not.toThrow();
  });

  // 5. resume가 참인 주제가 하나 → 진행중 표시가 정확히 하나.
  it('shows the resume tag on exactly one card when exactly one is flagged', () => {
    const curricula = [
      curriculum({ themeKey: 'a', resume: false }),
      curriculum({ themeKey: 'b', resume: true }),
      curriculum({ themeKey: 'c', track: 'depth', resume: false }),
    ];
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    expect(texts(tree.root).filter((s) => s === '이어하기')).toHaveLength(1);
    const badges = tree.root.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'theme-resume-badge');
    expect(badges).toHaveLength(1);
    // Attached to the flagged card, not any other.
    expect(card(tree.root, 'b').findAll((n) => n.props?.testID === 'theme-resume-badge').length).toBeGreaterThan(0);
  });

  // 6. resume가 하나도 없음 → 진행중 표시가 0개. 지어내지 않는다.
  it('shows zero resume tags when nothing is flagged', () => {
    const curricula = [
      curriculum({ themeKey: 'a', resume: false, state: 'passed', done: 4, total: 4 }),
      curriculum({ themeKey: 'b', track: 'depth', resume: false }),
    ];
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    expect(texts(tree.root).filter((s) => s === '이어하기')).toHaveLength(0);
    expect(tree.root.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'theme-resume-badge')).toHaveLength(0);
  });

  // 7. 어떤 주제를 눌러도 onPress가 그 themeKey로 불린다 — 잠긴 주제가 없다.
  it('presses through on every card regardless of state — never disabled, always the right themeKey', () => {
    const onPress = jest.fn();
    const curricula = [
      curriculum({ themeKey: 'done-one', state: 'passed', done: 4, total: 4, resume: false }),
      curriculum({ themeKey: 'resuming', state: 'here', done: 1, total: 4, resume: true }),
      curriculum({ themeKey: 'untouched', track: 'depth', state: 'open', done: 0, total: 0, resume: false }),
    ];
    const tree = mount(<DeptBinder curricula={curricula} onPress={onPress} />);
    for (const key of ['done-one', 'resuming', 'untouched']) {
      const p = card(tree.root, key);
      expect(p).toBeTruthy();
      expect(p.props.disabled).not.toBe(true);
      act(() => { p.props.onPress(); });
      expect(onPress).toHaveBeenLastCalledWith(key);
    }
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  // 8. 화면 어디에도 잠금을 뜻하는 문자열이 없다.
  it('renders no locking vocabulary anywhere on screen', () => {
    const curricula = [
      curriculum({ themeKey: 'a', state: 'passed', done: 4, total: 4 }),
      curriculum({ themeKey: 'b', track: 'depth', state: 'open', resume: false }),
    ];
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    const joined = texts(tree.root).join(' ');
    for (const banned of ['잠금', '잠긴', '잠겨', '열림', '다음', '미리보기', '추천 순서', 'locked']) {
      expect(joined).not.toContain(banned);
    }
  });

  // 제약: react-native-svg를 쓰지 않는다 — 이 화면 어디에도 Svg가 없다.
  it('draws nothing with react-native-svg', () => {
    const curricula = [curriculum({ themeKey: 'a' })];
    const tree = mount(<DeptBinder curricula={curricula} onPress={jest.fn()} />);
    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
  });

  it('splits topics into 공통 코어/심화 bundles and numbers index tabs across the whole screen, not per bundle', () => {
    const core = Array.from({ length: 2 }, (_, i) => curriculum({ themeKey: `core-${i}`, track: 'core' }));
    const depth = Array.from({ length: 2 }, (_, i) => curriculum({ themeKey: `depth-${i}`, track: 'depth' }));
    const tree = mount(<DeptBinder curricula={[...core, ...depth]} onPress={jest.fn()} />);
    expect(texts(tree.root)).toContain('공통 코어');
    expect(texts(tree.root)).toContain('심화');
    // First depth card continues the numbering from core (3), not restarting at 01.
    const tabTexts = tree.root
      .findAll((n) => typeof n.type === 'string' && n.props?.testID === 'dept-binder-index-tab')
      .map((n) => texts(n)[0]);
    expect(tabTexts).toEqual(['01', '02', '03', '04']);
  });

  it('renders nothing on an empty track without crashing', () => {
    const tree = mount(<DeptBinder curricula={[]} onPress={jest.fn()} />);
    expect(findAllPressables(tree.root)).toHaveLength(0);
    expect(progressCells(tree.root)).toHaveLength(0);
  });
});

// 색 인덱스 탭은 계단을 이루되 종이 안에 머문다. 참조 코드의 `14 + i * 4`는 주제가
// 5개라는 전제에서 나온 값이라, 35개에 그대로 쓰면 열네 번째부터 탭이 간지 아래로
// 흘러내린다(V6). 여기서 지키는 성질은 두 가지다 — 계단이 실제로 보이고(값이 하나로
// 고정되지 않는다), 가장 깊이 내려간 탭도 간지 한 장 안에 들어온다.
describe('indexTabTop — 탭 계단은 주기를 돈다', () => {
  // 간지 한 장의 최소 높이: NbPaper 위아래 padding 12 + 제목 한 줄 약 22 +
  // 우표 격자 위 여백 9 + 한 줄 9 + 아랫줄 위 여백 8 + 아랫줄 약 20 = 약 92.
  // 탭(높이 42)이 그 안에 들어와야 한다.
  const CARD_MIN_H = 92;
  const TAB_H = 42;

  it('35개 전부에서 탭 아래끝이 간지 안에 머문다', () => {
    for (let i = 0; i < 35; i++) {
      expect(indexTabTop(i) + TAB_H).toBeLessThanOrEqual(CARD_MIN_H);
    }
  });

  it('계단이 실제로 보인다 — 값이 하나로 고정되지 않는다', () => {
    const tops = new Set(Array.from({ length: 35 }, (_, i) => indexTabTop(i)));
    expect(tops.size).toBeGreaterThan(1);
  });
});
