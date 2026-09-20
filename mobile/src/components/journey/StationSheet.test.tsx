// StationSheet — the one legitimate lock on the journey map (J2). task-12-brief.md is
// written against `@testing-library/react-native` (render/waitFor/queryAllByText),
// which this repo does not install (Station.test.tsx, FreeRoamRow.test.tsx,
// CurrentStationBar.test.tsx already left the same note). The two properties the brief
// asks for are kept exactly; they are just expressed with react-test-renderer
// (act/create/findAllByType/findByProps), the repo's own convention.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { ScrollView, Text } from 'react-native';
import { StationSheet } from './StationSheet';
import { api } from '@/api/client';
import { t } from '@/i18n';
import { trackMounts } from '../../testing/mountRegistry';

jest.mock('@/api/client');

// BottomSheet schedules real timers/rAFs (its entry animation, a 250ms layout
// fallback). A tree left mounted when an assertion above throws keeps those alive
// past this file's teardown, and the crash then lands on some UNRELATED suite —
// exactly what mountRegistry.ts exists to prevent. `track` unmounts every tree this
// file created in an `afterEach`, whether or not the test that created it passed.
const track = trackMounts();

async function mount(themeKey: string, onStepPress: () => void = jest.fn()) {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = track(create(<StationSheet themeKey={themeKey} onClose={jest.fn()} onStepPress={onStepPress} />));
  });
  // Flush the api.station() promise the effect kicked off on mount.
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(tree: ReturnType<typeof create>): string[] {
  return tree.root.findAllByType(Text).map((n) => String(n.props.children));
}

function stepRow(root: ReactTestInstance, index: number) {
  return root.findByProps({ testID: `step-row-${index}` });
}

function flatStyle(s: unknown): Record<string, unknown> {
  return Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : ((s ?? {}) as Record<string, unknown>);
}

describe('StationSheet', () => {
  // 대화 하나는 두 행이다 — 도움 있는 회차와 혼자 하는 회차. 이 사다리가 보이는 곳은
  // 여기뿐이고, 지도의 개수는 상황 단위다.
  it('shows both rungs of a dialogue', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: '수혈 관리', done: 0, total: 2, tiers: [] },
      steps: [
        { kind: 'dlg', name: '수혈 전 확인', state: 'now', guide: 'choices', pass: 1, passes: 2 },
        { kind: 'dlg', name: '수혈 전 확인', state: 'lock', guide: 'free', pass: 2, passes: 2 },
      ],
    });
    const tree = await mount('k');
    const rendered = texts(tree);
    expect(rendered.filter((x) => x === '수혈 전 확인')).toHaveLength(2);
    expect(rendered).toContain('1/2');
    expect(rendered).toContain('2/2');
  });

  // 자물쇠는 여기에 붙는다(J2) — 정거장이 아니라 스텝에. `.props.onPress()`를 직접
  // 부르는 것만으로는 `disabled`를 우회하므로, 잠긴 행은 `disabled`가 참임을 직접
  // 단정하고, 열린 첫 행은 `disabled`가 참이 아니면서 실제로 `onStepPress`를
  // 부르는 것까지 함께 본다 — 둘 다 봐야 "눌린다"는 주장이 성립한다.
  it('locks the second rung until the first is cleared', async () => {
    const first = { kind: 'dlg', name: 'x', state: 'now', pass: 1, passes: 2 };
    const second = { kind: 'dlg', name: 'x', state: 'lock', pass: 2, passes: 2 };
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 0, total: 2, tiers: [] },
      steps: [first, second],
    });
    const onStepPress = jest.fn();
    const tree = await mount('k', onStepPress);
    expect(tree.root.findAll((n) => n.props?.testID === 'step-lock', { deep: false })).toHaveLength(1);

    expect(stepRow(tree.root, 1).props.disabled).toBe(true);

    expect(stepRow(tree.root, 0).props.disabled).not.toBe(true);
    act(() => { stepRow(tree.root, 0).props.onPress(); });
    expect(onStepPress).toHaveBeenCalledWith(expect.objectContaining(first));
  });

  // 이미 통과했거나 잠긴 행에는 "시도함(다시)" 표시가 절대 붙지 않는다 — 붙으면 서로
  // 모순이다. `attempted`는 `now` 행에서만 말이 된다.
  it('shows the attempted badge only on the now row, never on a done or locked one', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 1, total: 3, tiers: [] },
      steps: [
        { kind: 'dlg', name: 'done-row', state: 'done', pass: 1, passes: 1, attempted: true },
        { kind: 'dlg', name: 'now-row', state: 'now', pass: 1, passes: 1, attempted: true },
        { kind: 'dlg', name: 'lock-row', state: 'lock', pass: 1, passes: 1, attempted: true },
      ],
    });
    const tree = await mount('k');
    expect(texts(tree).filter((x) => x === '다시')).toHaveLength(1);
  });

  // done + attempted는 실사용에서 나올 수 있는 조합이다(위 테스트의 목 데이터도 이미 쓴다) —
  // 이미 통과한 행은 배지만이 아니라 배경색도 재도전 강조색(`rgba(143,199,232,.22)`)으로
  // 물들면 안 된다. 배지 쪽 조건과 배경색 쪽 조건은 서로 다른 자리(JSX 렌더 조건 vs
  // `retry` 계산)에서 각각 지켜지므로, 배지만 보는 단정으로는 이 성질을 못 잡는다.
  it('never tints an already-passed row with the retry accent, even when attempted is set', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 1, total: 1, tiers: [] },
      steps: [
        { kind: 'dlg', name: 'done-row', state: 'done', pass: 1, passes: 1, attempted: true },
      ],
    });
    const tree = await mount('k');
    expect(stepRow(tree.root, 0).props.style.backgroundColor).not.toBe('rgba(143,199,232,.22)');
  });

  // `now`는 한 주제에 정확히 하나다 — 시트가 그것을 지어내면 안 된다. done과 lock만 있고
  // `now`가 전혀 없는 목록을 주면 NOW 배지가 어디에도 뜨면 안 된다. 리터럴 'NOW'가 아니라
  // `t('step.now')` 자체를 보는 이유: 문구가 바뀌어도(예: 'JETZT') 이 가드가 계속 지켜야
  // 하는 것은 "그 배지가 없다"이지 "그 리터럴이 없다"가 아니다.
  it('never invents a now row when the server sent none', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 1, total: 2, tiers: [] },
      steps: [
        { kind: 'dlg', name: 'done-row', state: 'done', pass: 1, passes: 1 },
        { kind: 'dlg', name: 'lock-row', state: 'lock', pass: 1, passes: 1 },
      ],
    });
    const tree = await mount('k');
    expect(texts(tree).filter((x) => x === t('step.now'))).toHaveLength(0);
  });

  // 위 테스트의 짝: `now` 행이 있으면 그 배지가 실제로 그려진다는 양성 단정. 이게 없으면
  // 위 음성 단정은 "배지를 아예 안 그린다"로도 통과해 아무것도 지키지 못한다.
  it('draws the now badge on the row whose state is `now`', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 0, total: 2, tiers: [] },
      steps: [
        { kind: 'dlg', name: 'now-row', state: 'now', pass: 1, passes: 1 },
        { kind: 'dlg', name: 'lock-row', state: 'lock', pass: 1, passes: 1 },
      ],
    });
    const tree = await mount('k');
    expect(texts(tree).filter((x) => x === t('step.now'))).toHaveLength(1);
  });

  // 시트는 즉시 열고 행 자리에 스켈레톤을 둔다 — 열림이 지연되면 탭이 씹힌 것처럼
  // 읽힌다. 네트워크가 아직 돌아오지 않은 첫 렌더에서도 스켈레톤이 이미 있어야 한다.
  it('opens immediately with a skeleton, before the network call resolves', async () => {
    let resolve!: (v: unknown) => void;
    (api.station as jest.Mock).mockReturnValue(new Promise((r) => { resolve = r; }));
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = track(create(<StationSheet themeKey="k" onClose={jest.fn()} onStepPress={jest.fn()} />));
    });
    expect(tree.root.findAll((n) => n.props?.testID === 'station-sheet-skeleton', { deep: false })).toHaveLength(1);
    await act(async () => { resolve({ station: { name: 'a', done: 0, total: 0, tiers: [] }, steps: [] }); await Promise.resolve(); });
  });

  // 시트는 `size="tall"`로 고정 높이다(BottomSheet.tsx) — 스텝이 40행을 넘는 주제는 그
  // 높이를 훌쩍 넘고, 예전에는 목록이 그냥 View라 넘친 몫이 시트의 `overflow: hidden`에
  // 잘려 나간 채로 돌아올 방법이 없었다. 이 테스트는 그 defect를 구조적으로 잠근다:
  // ScrollView가 실제로 쓰이는지, 그리고 (GoalDeptSheet.tsx와 달리) `flex: 1`로 스스로
  // 경계를 갖는지 — 경계가 없으면 ScrollView도 평범한 View와 똑같이 콘텐츠 크기만큼
  // 커져서 스크롤할 것이 아예 없어진다(파일 상단 주석 참고).
  it('scrolls a long step list inside a bounded ScrollView, with room for the last row', async () => {
    (api.station as jest.Mock).mockResolvedValue({
      station: { themeKey: 'k', name: 'a', done: 0, total: 0, tiers: [] },
      steps: Array.from({ length: 40 }, (_, i) => (
        { kind: 'dlg', name: `step-${i}`, state: 'done', pass: 1, passes: 1 }
      )),
    });
    const tree = await mount('k');

    const scrolls = tree.root.findAllByType(ScrollView);
    expect(scrolls).toHaveLength(1);
    expect(flatStyle(scrolls[0].props.style).flex).toBe(1);

    // All 40 rows exist — there is really something past the fold for a scroll to reveal.
    expect(() => stepRow(tree.root, 39)).not.toThrow();

    // Generous clearance past the last row, not just whatever padding happened to already
    // be there — a StepRow is two lines of text plus an optional tag, taller than the
    // one-line rows GoalDeptSheet.tsx budgets 24px for.
    expect(flatStyle(scrolls[0].props.contentContainerStyle).paddingBottom).toBeGreaterThanOrEqual(40);
  });
});
