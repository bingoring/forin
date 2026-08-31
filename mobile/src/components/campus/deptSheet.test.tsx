// Suspending the sheet must not throw away what it was showing.
//
// The floor sheet used to be cleared on the way to a briefing, because a RN Modal
// renders above the pushed screen and an open sheet would cover it. That fixed the
// covering and broke the way back: coming out of a briefing you decided against left you
// at the building list, having to pick the floor again to get back to the list you were
// reading a second ago. Hiding the view while keeping the subject is the difference, and
// the observable form of "the subject survived" is that nothing is fetched again.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { DeptSheet, type DeptTarget } from '@/components/campus/DeptSheet';
import { trackMounts } from '../../testing/mountRegistry';

/** Unmounts every tree this file mounts — see mountRegistry for why. */
const track = trackMounts();

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

// The fn lives INSIDE the factory and is fetched back out afterwards. Closing over an
// outer const does not work here: jest hoists the mock above the declaration, and the
// factory runs when DeptSheet's own import of the client resolves — before the const
// exists — so the module would install `undefined` as the method.
jest.mock('@/api/client', () => ({
  api: { deptSituations: jest.fn(async () => ({ situations: [], hasMore: false })) },
}));
const { api } = jest.requireMock('@/api/client') as { api: { deptSituations: jest.Mock } };

const TARGET: DeptTarget = {
  deptCode: 'ER',
  place: '응급의료센터',
  where: '본관 1F 응급의료센터',
  accent: '#F6B8B8',
  curricula: [],
};

/** The sheet is on screen when its grabber is. */
function onScreen(root: ReactTestInstance): boolean {
  return (
    root.findAll(
      (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
      { deep: true }
    ).length > 0
  );
}

const noop = () => {};

beforeEach(() => api.deptSituations.mockClear());

it('hides while suspended and comes back without refetching', () => {
  let tree!: ReturnType<typeof create>;
  const render = (suspended: boolean) =>
    act(() => {
      const el = (
        <DeptSheet target={TARGET} suspended={suspended} onClose={noop} onStart={noop} onWalk={noop} />
      );
      if (tree) tree.update(el);
      else tree = track(create(el));
    });

  render(false);
  expect(onScreen(tree.root)).toBe(true);
  expect(api.deptSituations).toHaveBeenCalledTimes(1);

  // Navigating away: out of sight, so the Modal cannot cover the pushed screen.
  render(true);
  expect(onScreen(tree.root)).toBe(false);

  // Coming back. One fetch total — the list is the one that was already there, not a
  // fresh load of the same floor.
  render(false);
  expect(onScreen(tree.root)).toBe(true);
  expect(api.deptSituations).toHaveBeenCalledTimes(1);
});

it('starts over when the floor itself changes', () => {
  // The counterpart: suspending is not the same as picking a different floor, and that
  // one does have to reload. Without this the test above would pass on a sheet that
  // never fetches at all.
  let tree!: ReturnType<typeof create>;
  const render = (target: DeptTarget) =>
    act(() => {
      const el = <DeptSheet target={target} onClose={noop} onStart={noop} onWalk={noop} />;
      if (tree) tree.update(el);
      else tree = track(create(el));
    });

  render(TARGET);
  expect(api.deptSituations).toHaveBeenCalledTimes(1);
  render({ ...TARGET, deptCode: 'ICU' });
  expect(api.deptSituations).toHaveBeenCalledTimes(2);
});

/** Text of every Text node under `root`. */
function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

it('lists a dialogue twice, and says which rung each entry is', () => {
  // This is the list the learner picks from: the floor sheet's curriculum dropdown. A
  // dialogue appears twice — the same situation guided, then alone — so the entries have
  // to name their rung or the list reads as one title repeated.
  const target: DeptTarget = {
    deptCode: 'RAD',
    place: '영상의학과',
    where: '본관 2F 영상의학과',
    accent: '#BAE6FD',
    curricula: [{
      key: 'K', name: '촬영 협조', building: '본관', floor: '2F', where: '본관 2F 영상의학과',
      state: 'doing', done: 0, total: 2, next: 'X-ray 자세 협조',
      steps: [
        { kind: 'dlg', name: 'X-ray 자세 협조', scenarioId: 'SCN-RAD-1', state: 'now', guide: 'choices', pass: 1, passes: 2 },
        { kind: 'dlg', name: 'X-ray 자세 협조', scenarioId: 'SCN-RAD-1', state: 'lock', guide: 'free', pass: 2, passes: 2 },
      ],
    }],
  };

  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(<DeptSheet target={target} onClose={noop} onStart={noop} onWalk={noop} />));
  });

  // The curriculum's dropdown starts closed; open it.
  const toggle = tree.root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined
      && texts(n).some((x) => x.includes('촬영 협조')),
    { deep: true },
  ).slice(-1)[0];
  act(() => { toggle.props.onPress(); });

  const out = texts(tree.root);
  // The same title twice…
  expect(out.filter((x) => x === 'X-ray 자세 협조')).toHaveLength(2);
  // …told apart by the rung.
  const joined = out.join(' ');
  expect(joined).toContain('1/2 보기 중에서');
  expect(joined).toContain('2/2 직접 대화');
});
