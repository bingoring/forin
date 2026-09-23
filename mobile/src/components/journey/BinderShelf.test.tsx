// BinderShelf — 일터 탭 부서 서가 (journey-binder-v42 Task G, task-G-brief.md §5;
// 표지 날아오기의 좌표 측정은 Task I, task-I-brief.md §2 point 1·§7 item 10).
//
// @testing-library/react-native is not installed in this repo — react-test-renderer
// throughout, same convention as DeptBinder.test.tsx.
//
// `measureBinderRect.ts`(정확히는 그 안의 `watchBinderRect`)는 여기서 모킹한다 — 그
// 파일 자신의 주석이 이유를 적어 뒀다: 실제 `measureInWindow`의 콜백은 이 jest 환경에서
// 절대 불리지 않는다(직접 확인한 사실이지 추측이 아니다), 그래서 "측정이 성공했다"는
// 경우를 이 브리지로는 흉내낼 방법이 없다. 기본(구현 없는 `jest.fn()`)은 "콜백을 아예
// 부르지 않는다"와 같은 모양이라 — 아래 4번 테스트("측정 실패")는 이 모듈을 건드리지
// 않고도 그대로 지나간다.
jest.mock('./measureBinderRect', () => ({ watchBinderRect: jest.fn() }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { BinderShelf } from './BinderShelf';
import { watchBinderRect } from './measureBinderRect';
import type { FreeRoamEntry } from '@/api/client';
import type { JourneyCurriculum } from './JourneyMap';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  (watchBinderRect as jest.Mock).mockReset();
});

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

// react-test-renderer's `findAllByType(Pressable)` compares by reference across two
// loaded module instances (DeptBinder.test.tsx documents the same trap) — matching by
// name is what actually finds the node.
function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function shelfCards(root: ReactTestInstance): ReactTestInstance[] {
  return findAllPressables(root).filter((n) => String(n.props?.testID ?? '').startsWith('binder-shelf-card-'));
}

function shelfCard(root: ReactTestInstance, dept: string): ReactTestInstance | undefined {
  return findAllPressables(root).find((n) => n.props?.testID === `binder-shelf-card-${dept}`);
}

// Host-node-only testID lookup (journeyScreen.test.tsx documents the same
// composite/host double-count gotcha for a plain testID).
function hostNodesWithTestId(root: ReactTestInstance, id: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
}

function entry(over: Partial<FreeRoamEntry>): FreeRoamEntry {
  return { dept: 'D', passed: 0, total: 10, ...over } as FreeRoamEntry;
}

function curriculum(over: Partial<JourneyCurriculum>): JourneyCurriculum {
  return { themeKey: 't', name: '주제', track: 'core', done: 0, total: 4, resume: false, ...over } as JourneyCurriculum;
}

function entries(n: number): FreeRoamEntry[] {
  return Array.from({ length: n }, (_, i) => entry({ dept: `D${String(i).padStart(2, '0')}`, passed: i, total: 10 }));
}

const GOAL_CURRICULA: JourneyCurriculum[] = [
  curriculum({ themeKey: 't1', done: 3, total: 3 }), // 완료 — done >= total > 0
  curriculum({ themeKey: 't2', done: 1, total: 4 }), // 진행 중
  curriculum({ themeKey: 't3', done: 0, total: 0 }), // total 0 — 완료로 세지 않는다
];


/** 실제 부서 코드 몇 개 — 등 색이 부서마다 다른지 재려면 진짜 코드가 필요하다
 *  (픽스처의 D00 같은 가짜 코드는 전부 같은 대체 색으로 떨어진다). */
const REAL_DEPTS = ['ER', 'ICU', 'OR', 'PHARMA', 'PEDS', 'LD', 'WARD', 'PSYCH'];

/** RN의 style은 배열로 겹쳐 올 수 있다 — 한 겹으로 편다. */
function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}

function baseProps() {
  return {
    goalDept: 'ER',
    goalCurricula: GOAL_CURRICULA,
    entries: entries(28),
    inferred: false,
    onOpen: jest.fn(),
    onChangeGoal: jest.fn(),
  };
}

describe('BinderShelf', () => {
  // 1. entries 28개 → 바인더 28개, 7줄(한 줄 4개). 줄당 개수 규칙이 깨지면 실패해야 한다.
  it('lays out 28 entries as 28 binders across exactly 7 rows of 4', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    expect(shelfCards(tree.root)).toHaveLength(28);
    const rows = hostNodesWithTestId(tree.root, 'binder-shelf-row');
    expect(rows).toHaveLength(7);
    const perRow = rows.map((r) => r.findAll(
      (n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable'
        && String(n.props?.testID ?? '').startsWith('binder-shelf-card-'),
    ).length);
    expect(perRow).toEqual([4, 4, 4, 4, 4, 4, 4]);
  });

  // 2. entries 3개 → 1줄, 바인더 3개. 빈 자리를 지어내지 않는다.
  it('renders exactly 3 binders in a single row for 3 entries — no fabricated empty slots', () => {
    const tree = mount(<BinderShelf {...baseProps()} entries={entries(3)} />);
    expect(shelfCards(tree.root)).toHaveLength(3);
    expect(hostNodesWithTestId(tree.root, 'binder-shelf-row')).toHaveLength(1);
  });

  // 3. 목표 부서가 서가에 다시 그려지지 않는다 — `내 부서` 카드에만 나온다.
  it('never redraws the goal department in the shelf — only the 내 부서 card shows it', () => {
    const shelfEntries = [entry({ dept: 'ER', passed: 1, total: 1 }), ...entries(3)];
    const tree = mount(<BinderShelf {...baseProps()} goalDept="ER" entries={shelfEntries} />);
    // 방어적 중복 제거: entries에 목표 부서가 섞여 들어와도 서가 카드로는 나오지 않는다.
    expect(shelfCard(tree.root, 'ER')).toBeUndefined();
    expect(tree.root.findByProps({ testID: 'binder-shelf-goal-card' })).toBeTruthy();
    expect(shelfCards(tree.root)).toHaveLength(3);
  });

  // 4. 아무 바인더나 눌러도 onOpen이 그 부서 코드로 불린다 — 잠긴 부서가 없다.
  it('pressing any binder calls onOpen with that exact department code — nothing is locked', () => {
    const onOpen = jest.fn();
    const tree = mount(<BinderShelf {...baseProps()} entries={entries(5)} onOpen={onOpen} />);
    const card = shelfCard(tree.root, 'D03')!;
    expect(card).toBeTruthy();
    expect(card.props.disabled).not.toBe(true);
    act(() => { card.props.onPress(); });
    expect(onOpen).toHaveBeenCalledWith('D03');
  });

  // 5. total이 0인 항목 → 진행 바가 비어 있고 예외가 나지 않는다.
  it('renders an empty progress bar for a total of 0 without throwing', () => {
    const zero = [entry({ dept: 'D00', passed: 0, total: 0 })];
    expect(() => mount(<BinderShelf {...baseProps()} entries={zero} />)).not.toThrow();
    const tree = mount(<BinderShelf {...baseProps()} entries={zero} />);
    expect(texts(tree.root)).toContain('0/0');
  });

  // 6. 목표를 바꾸는 동작을 누르면 onChangeGoal이 불리고, 이어서를 누르면 onOpen(goalDept)가
  //    불린다 — 두 동작이 서로 다르다.
  it('separates changing the goal from resuming it', () => {
    const onOpen = jest.fn();
    const onChangeGoal = jest.fn();
    const tree = mount(<BinderShelf {...baseProps()} onOpen={onOpen} onChangeGoal={onChangeGoal} />);

    const changeGoal = tree.root.findByProps({ testID: 'binder-shelf-change-goal' });
    act(() => { changeGoal.props.onPress(); });
    expect(onChangeGoal).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    const resume = tree.root.findAll(
      (n) => typeof n.props?.onPress === 'function' && texts(n).includes('이어서'),
      { deep: true },
    )[0];
    expect(resume).toBeTruthy();
    act(() => { resume.props.onPress(); });
    expect(onOpen).toHaveBeenCalledWith('ER');
    expect(onChangeGoal).toHaveBeenCalledTimes(1); // 여전히 한 번뿐 — 이어서가 목표를 바꾸지 않는다
  });

  // 7. 화면 어디에도 `공통 필수`에 해당하는 문자열이 없다(X1).
  it('never shows a shared/common-required binder (X1)', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    expect(texts(tree.root).join(' ')).not.toContain('공통 필수');
  });

  it('shows the inferred tag only when inferred is true (J4)', () => {
    const inferredTree = mount(<BinderShelf {...baseProps()} inferred />);
    expect(texts(inferredTree.root)).toContain('추정');

    const chosenTree = mount(<BinderShelf {...baseProps()} inferred={false} />);
    expect(texts(chosenTree.root)).not.toContain('추정');
  });

  it('computes the goal card’s topic progress from completed topics, not total situations', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    // 3개 주제 중 완료(done>=total>0)는 t1 하나뿐 — t3은 total 0이라 완료로 세지 않는다.
    expect(texts(tree.root)).toContain('주제 1/3 완료');
  });

  // ── 핸드오프 v42 BinderShelf와 맞춰야 하는 것들 ───────────────────────────

  // 참조는 부서마다 다른 등 색을 쓴다. 네 색을 돌려 쓰면 색이 아무 뜻도 없다고 말하는
  // 셈이고, 화면에서도 서가가 아니라 되풀이되는 무늬로 읽힌다.
  it('부서마다 다른 등 색을 쓴다 — 몇 색을 돌려 쓰지 않는다', () => {
    // 목표 부서는 서가에 안 그려지므로(위 규칙) 목록에 없는 부서를 목표로 둔다.
    const tree = mount(
      <BinderShelf {...baseProps()} goalDept="SIM" entries={REAL_DEPTS.map((d) => entry({ dept: d }))} />,
    );
    const spines = REAL_DEPTS.map((d) => {
      const card = shelfCard(tree.root, d)!;
      const spine = card.findAll((n) => typeof n.type === 'string' && n.props?.testID === 'binder-spine')[0];
      return flat(spine.props.style).backgroundColor as string;
    });
    expect(new Set(spines).size).toBe(REAL_DEPTS.length);
  });

  // 참조는 책을 조금씩 삐뚤게 꽂는다.
  it('책이 조금씩 삐뚤게 꽂힌다 — 각이 하나로 고정되지 않는다', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    const angles = shelfCards(tree.root).map((n) => {
      const tr = flat(n.props?.style).transform as { rotate?: string }[] | undefined;
      return tr?.[0]?.rotate;
    });
    expect(angles.every((a) => typeof a === 'string')).toBe(true);
    expect(new Set(angles).size).toBeGreaterThan(1);
    // 삐뚤되 쓰러지지는 않는다.
    for (const a of angles) expect(Math.abs(parseFloat(a as string))).toBeLessThanOrEqual(3);
  });

  // 참조의 등 라벨은 부서 코드(mono)와 이름(hand) 두 줄이다.
  it('등 라벨에 부서 코드와 이름을 함께 찍는다', () => {
    const tree = mount(<BinderShelf {...baseProps()} entries={[entry({ dept: 'ICU' })]} />);
    const shown = texts(shelfCard(tree.root, 'ICU')!);
    expect(shown).toContain('ICU');        // 코드
    expect(shown).toContain('중환자실');    // 짧은 이름
  });

  // 참조의 바인더는 78×118이다. 폭이 어떻든 그 비율을 지킨다.
  it('바인더가 핸드오프의 78:118 비율을 지킨다', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    const st = flat(shelfCards(tree.root)[0].props?.style);
    expect((st.height as number) / (st.width as number)).toBeCloseTo(118 / 78, 2);
  });

  // 참조의 내 부서 카드는 주제마다 막대 하나를 둔다.
  it('내 부서 카드가 주제 하나당 막대 하나를 그린다', () => {
    const tree = mount(<BinderShelf {...baseProps()} />);
    expect(hostNodesWithTestId(tree.root, 'goal-topic-segment').length).toBe(GOAL_CURRICULA.length);
  });

  // 주제가 35개여도 막대가 획보다 얇아지지 않게 줄을 접는다(V5).
  it('주제가 35개면 막대 줄이 세 줄로 접힌다', () => {
    const many = Array.from({ length: 35 }, (_, i) => curriculum({ themeKey: `t${i}` }));
    const tree = mount(<BinderShelf {...baseProps()} goalCurricula={many} />);
    expect(hostNodesWithTestId(tree.root, 'goal-topic-segment').length).toBe(35);
    expect(hostNodesWithTestId(tree.root, 'goal-topic-row').length).toBe(3);
  });

  // 진행 중인 주제가 없으면 '지금 …' 부분을 지어내지 않는다.
  it('진행 중인 주제가 없으면 현재 주제를 지어내지 않는다', () => {
    const tree = mount(<BinderShelf {...baseProps()} goalCurricula={[curriculum({ done: 3, total: 3 })]} />);
    expect(texts(tree.root).some((s) => s.includes('지금'))).toBe(false);
  });

  it('진행 중인 주제가 있으면 그 이름과 진도를 함께 말한다', () => {
    const cur = curriculum({ themeKey: 'x', name: '중증 응대', resume: true, done: 13, total: 34 });
    const tree = mount(<BinderShelf {...baseProps()} goalCurricula={[cur]} />);
    expect(texts(tree.root).some((s) => s.includes('중증 응대') && s.includes('13/34'))).toBe(true);
  });

  // 바인더 라벨은 짧은 쪽을 쓴다. `dept.ICU`는 '중환자실 ICU'라 한 줄에 4개인 바인더
  // 안쪽 폭(56px 남짓)에서 잘리고, `dept.short.ICU`는 '중환자실'이라 들어간다.
  // 라벨 값 자체가 지켜야 할 성질(모든 로케일에 있을 것·폭·중복 없음)은
  // `i18n/deptShort.test.ts`가 따로 잠근다.
  it('바인더에 짧은 부서 라벨을 그린다 — 영문이 붙은 전체 라벨이 아니다', () => {
    const tree = mount(<BinderShelf {...baseProps()} entries={[entry({ dept: 'ICU', passed: 2, total: 35 })]} />);
    const card = shelfCard(tree.root, 'ICU')!;
    const shown = texts(card);
    expect(shown).toContain('중환자실');
    expect(shown).not.toContain('중환자실 ICU');
  });

  // 눈에 보이는 글자는 짧아지지만 스크린 리더는 온전한 이름을 읽어야 한다.
  it('접근성 라벨에는 전체 부서 이름을 남긴다', () => {
    const tree = mount(<BinderShelf {...baseProps()} entries={[entry({ dept: 'ICU', passed: 2, total: 35 })]} />);
    expect(shelfCard(tree.root, 'ICU')!.props.accessibilityLabel).toBe('중환자실 ICU');
  });

  // ── 표지 날아오기의 좌표(journey-binder-v42 Task I, task-I-brief.md §7 item 10) ────

  it('바인더를 누르면 부서 코드와 함께 재어 둔 좌표가 onOpen으로 넘어간다', () => {
    const rect = { x: 12, y: 340, width: 80, height: 121 };
    (watchBinderRect as jest.Mock).mockImplementation((_ref, onRect) => onRect(rect));
    const onOpen = jest.fn();
    const tree = mount(<BinderShelf {...baseProps()} entries={entries(5)} onOpen={onOpen} />);
    act(() => { shelfCard(tree.root, 'D03')!.props.onPress(); });
    expect(onOpen).toHaveBeenCalledWith('D03', rect);
  });

  it('측정이 안 되면(콜백이 안 오면) 좌표 없이 부서만 넘어가고, 그래도 열리는 것은 막히지 않는다', () => {
    // 기본 모킹 그대로다 — `watchBinderRect`가 구현 없는 jest.fn()이라 콜백이 아예
    // 안 온다. 이것이 이 jest 환경에서 실제 `measureInWindow`가 하는 일과 같다.
    const onOpen = jest.fn();
    const tree = mount(<BinderShelf {...baseProps()} entries={entries(5)} onOpen={onOpen} />);
    act(() => { shelfCard(tree.root, 'D03')!.props.onPress(); });
    // 두 번째 인자 자체가 없다 — `onOpen('D03', undefined)`이 아니다(그 둘은 이 화면
    // 다음 단인 journey.tsx·dept 화면에게 다른 신호다).
    expect(onOpen).toHaveBeenCalledWith('D03');
    expect(onOpen.mock.calls[0]).toHaveLength(1);
  });

});
