// 부서 고르기 화면 (app/journey/pick-dept.tsx) — GoalDeptSheet.tsx(바텀시트)를 화면으로
// 옮긴 결과(2026-09-21 개정). @testing-library/react-native은 이 저장소에 없으므로
// (GoalDeptSheet.test.tsx가 이미 남긴 노트와 같다) react-test-renderer로 쓴다.
//
// 이 파일이 잠그는 것:
//  · journeyGoalPick.ts가 건넨 depts를 하나도 빠짐없이, 새로 만들지 않고 그린다 — 특히
//    29개처럼 긴 목록이 ScrollView 자신의 경계(`flex: 1`) 없이는 끝까지 스크롤되지
//    않는다는 것(StationSheet.tsx가 이미 겪은 함정. GoalDeptSheet.tsx는 겪지 않은 줄
//    알았지만 실기에서 드러났다 — 마지막 두 부서가 가려졌다).
//  · 잠금 없음(J1) — disabled가 참이 아니어야 한다, 우회가 아니라 애초에.
//  · 고르면 journeyGoalPick의 pickGoalDept를 통해 journey.tsx의 pickDept()로 이어지고
//    (J5, 한 가지 경로), 뒤로 간다 — 돌아갈 화면이 있으면 router.back(), 없으면
//    (딥링크) router.replace('/journey')(journey-binder-v42 Task J, task-J-brief.md §5).
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({
    back: () => { mockBack += 1; },
    push: () => {},
    canGoBack: () => mockCanGoBack,
    replace: (p: string) => mockReplaced.push(p),
  }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { ScrollView, Text } from 'react-native';
import PickDept from '@/app/(tabs)/journey/pick-dept';
import { clearGoalPickOffer, offerGoalPick } from '@/data/journeyGoalPick';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

let mockBack = 0;
let mockCanGoBack = true;
const mockReplaced: string[] = [];

// 29개 실제 부서 코드 — journey.tsx가 goalDept + freeRoam[].dept를 합쳐 건네는 것과
// 같은 모양(중복 없는 문자열 배열). 정확한 코드 값 자체보다 "29개, 끝까지"가 핵심이라
// 실재하는 카탈로그 코드를 쓰지 않고 번호를 매겨도 되지만, dept.<CODE> 번역 누락으로
// 라벨이 raw key로 보이는 회귀까지 같이 잠그기 위해 실제 카탈로그 코드를 쓴다.
// The real 29, copied from server/content/nurse/themes.yaml's `dept` values. An
// earlier draft of this list invented CARDIO/NEURO/ORTHO and dropped WARD/SURGWARD/
// ORTHOWARD — the same "client keeps its own department list" hazard this screen is
// built to avoid, reappearing in the test meant to guard it. The label assertion
// below no longer trusts this list: it asserts the PROPERTY (nothing renders as a
// raw `dept.` key), so a wrong roster here cannot make a missing label look fine.
const ALL_29_DEPTS = [
  'DERM', 'DIAL', 'ENDO', 'ER', 'GEN', 'GERI', 'HOSPICE', 'ICU', 'INFUSION', 'LD',
  'LOUNGE', 'MORGUE', 'NICU', 'NURSERY', 'ONCO', 'OR', 'ORTHOWARD', 'PEDS', 'PHARMA',
  'PICU', 'PSYCH', 'RAD', 'REHAB', 'SIM', 'SPD', 'SPECIALTY', 'SURGWARD', 'WARD',
  'WOMENKIDS',
];

function flatStyle(s: unknown): Record<string, unknown> {
  return Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : ((s ?? {}) as Record<string, unknown>);
}

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

function hostNodesWithTestId(root: ReactTestInstance, id: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.testID === id);
}

beforeEach(() => {
  mockBack = 0;
  mockCanGoBack = true;
  mockReplaced.length = 0;
  clearGoalPickOffer();
});
afterEach(() => { clearGoalPickOffer(); });

function mount() {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<PickDept />)); });
  return tree;
}

describe('PickDept', () => {
  // 부서 목록은 이 화면이 만들지 않는다 — journeyGoalPick이 건넨 depts 그대로, 하나도
  // 빠지거나 중복되지 않아야 한다. 29개는 이 작업의 핵심 증상(마지막 두 개가 잘림)을
  // 재현하는 크기다.
  it('renders exactly one row for every department the offer handed it, all 29, no more and no fewer', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    for (const dept of ALL_29_DEPTS) {
      expect(hostNodesWithTestId(tree.root, `goal-dept-row-${dept}`)).toHaveLength(1);
    }
    expect(
      tree.root.findAll((n) => typeof n.type === 'string' && typeof n.props?.testID === 'string' && n.props.testID.startsWith('goal-dept-row-')),
    ).toHaveLength(ALL_29_DEPTS.length);
    // The TAIL of the list is what the old bottom sheet cut off — the learner scrolled
    // to the end and the last two departments were still behind the sheet's edge. Take
    // the last two from the list itself rather than naming codes: naming them is how
    // this file already went wrong once (it asserted on ORTHO, which does not exist).
    for (const dept of ALL_29_DEPTS.slice(-2)) {
      expect(hostNodesWithTestId(tree.root, `goal-dept-row-${dept}`)).toHaveLength(1);
    }
  });

  // 라벨이 raw key로 보이면 안 된다 — 네 언어 카탈로그 모두 29개 부서 라벨을 갖췄다.
  it('names every department instead of falling back to the raw key', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    // The property, not a roster: no row may fall through to its raw i18n key. This
    // catches a department the catalogs forgot without depending on this file
    // holding an accurate list of what those catalogs should contain.
    const raw = texts(tree.root).filter((t) => /^dept\./.test(t));
    expect(raw).toEqual([]);
  });

  // 이 화면 전체의 핵심 수정: 목록이 ScrollView 하나에 담기고, 그 ScrollView 자신이
  // `flex: 1`로 경계를 갖는다. 없으면 ScrollView가 평범한 View처럼 콘텐츠 크기만큼
  // 자라기만 하고 스스로 스크롤할 것이 없어진다 — GoalDeptSheet.tsx가 겪은 것과 정확히
  // 같은 함정(StationSheet.tsx의 코멘트 참고)이고, 이번 작업이 고치는 그 증상이다.
  it('scrolls the department list inside a ScrollView bounded by flex: 1', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    const scrolls = tree.root.findAllByType(ScrollView);
    expect(scrolls).toHaveLength(1);
    expect(flatStyle(scrolls[0].props.style).flex).toBe(1);
  });

  // J1: 잠금 없음. 아직 가 보지 않은 부서(목표도 아니고, 이 테스트가 current로 넘긴
  // 부서와도 다른 임의의 부서)도 눌려야 하고, disabled가 우회되는 게 아니라 애초에
  // 참이 아니어야 한다.
  it('leaves an unvisited department pressable — disabled is never true (J1, no lock)', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    const row = tree.root.findByProps({ testID: 'goal-dept-row-DERM' });
    expect(row.props.disabled).not.toBe(true);
  });

  // 지금 목표인 부서만 체크로 구별된다.
  it('marks only the current goal department, not the others', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ICU', inferred: false }, jest.fn());
    const tree = mount();
    expect(hostNodesWithTestId(tree.root, 'goal-dept-current-mark')).toHaveLength(1);
    const icuRow = tree.root.findByProps({ testID: 'goal-dept-row-ICU' });
    expect(hostNodesWithTestId(icuRow, 'goal-dept-current-mark')).toHaveLength(1);
  });

  // §2: inferred가 참이면 고르라고 권하는 어조여야 한다.
  it('reads with an inviting tone when the goal is only inferred, not chosen', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: true }, jest.fn());
    const inferredTree = mount();
    const inferredText = texts(inferredTree.root).join(' ');

    clearGoalPickOffer();
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const chosenTree = mount();
    const chosenText = texts(chosenTree.root).join(' ');

    expect(inferredText).not.toEqual(chosenText);
  });

  // J5: 부서를 고르는 방법은 하나다. 이 화면은 journeyGoalPick이 건넨 pick 함수를
  // 그대로 부른다 — journey.tsx의 pickDept()가 실제로 그 자리에 온다는 것은
  // journeyScreen.test.tsx가 잠근다. 여기서는 그 이어짐 자체(호출·인자)만 본다.
  it('tapping a row calls the offered pick function with exactly that department, then goes back', () => {
    const pick = jest.fn();
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, pick);
    const tree = mount();
    act(() => { tree.root.findByProps({ testID: 'goal-dept-row-ICU' }).props.onPress(); });
    expect(pick).toHaveBeenCalledWith('ICU');
    expect(pick).not.toHaveBeenCalledWith('ER');
    expect(mockBack).toBe(1);
  });

  // 뒤로 가기 버튼 자체도 일터 탭으로 돌아간다 — 아무것도 고르지 않고 나가는 길.
  // 정상 경로(일터 탭 → 화살표)로는 목록 없이 열릴 일이 없지만, 딥링크로 곧장 열거나
  // 앱이 되살아나며 이 라우트로 복원되면 실제로 그렇게 열린다 — 실기에서 확인했다.
  // 그때 빈 화면을 내놓으면 학습자는 부서가 하나도 없다고 읽는다.
  it('says so and offers a way back when it was handed no list at all', async () => {
    clearGoalPickOffer();
    const tree = mount();
    const shown = texts(tree.root).join(' ');
    expect(shown).toContain('부서 목록을 불러오지 못했어요');
    expect(hostNodesWithTestId(tree.root, 'pick-dept-empty-back')).toHaveLength(1);
    const before = mockBack;
    act(() => { tree.root.findByProps({ testID: 'pick-dept-empty-back' }).props.onPress(); });
    expect(mockBack).toBe(before + 1);
  });

  it('the back button returns without picking anything', () => {
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    act(() => { tree.root.findByProps({ testID: 'pick-dept-back' }).props.onPress(); });
    expect(mockBack).toBe(1);
  });

  // 11. 딥링크로 곧장 들어와 돌아갈 화면이 없으면 서가로 보낸다(task-J-brief.md §5).
  it('sends the learner to the shelf, not nowhere, when there is no screen to go back to', () => {
    mockCanGoBack = false;
    offerGoalPick({ depts: ALL_29_DEPTS, current: 'ER', inferred: false }, jest.fn());
    const tree = mount();
    act(() => { tree.root.findByProps({ testID: 'pick-dept-back' }).props.onPress(); });
    expect(mockReplaced).toEqual(['/journey']);
    expect(mockBack).toBe(0);
  });
});
