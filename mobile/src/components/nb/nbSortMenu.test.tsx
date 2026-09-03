// 정렬 드롭다운 (핸드오프 v33 — 리뷰랩 정렬이 두 번째 탭 줄이던 것을 대체).
//
// The point of this control is that it is NOT a tab row: the review lab already has one,
// and a second stacked under it read as a nested tab bar. So what has to hold is:
//
//  · The trigger shows the CURRENT ordering, not a fixed label — a dropdown that always
//    says "정렬" tells the learner nothing about how the list is ordered right now.
//  · Every ordering is reachable. A two-way toggle hides the option you are not on, so a
//    learner who has never seen "개선 필요" could not find it; the sheet lists them all.
//  · Choosing one reports it and closes.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbSortMenu } from '@/components/nb/NbSortMenu';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

const OPTIONS = [
  { value: 'weak', label: '약한 순' },
  { value: 'recent', label: '최신' },
];

function mount(value: string, onSelect: (v: string) => void = () => {}) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(
      <NbSortMenu title="정렬" value={value} options={OPTIONS} onSelect={onSelect} />,
    ));
  });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** The trigger names itself with the title; the sheet's options are the other pressables. */
function trigger(root: ReactTestInstance): ReactTestInstance {
  return root.findAll(
    (n) => typeof n.props?.onPress === 'function' && n.props?.accessibilityLabel === '정렬',
    { deep: true },
  )[0];
}

test('the trigger shows the current ordering', () => {
  const tree = mount('recent');
  // Before it is opened, the visible text is the label of the selected option — the
  // learner reads how the list is sorted without tapping anything.
  expect(texts(tree.root)).toContain('최신');
  expect(texts(tree.root)).not.toContain('약한 순');
});

test('opening it lists every ordering as a choice, current one included', async () => {
  const tree = mount('recent');
  await act(async () => { trigger(tree.root).props.onPress(); });

  // Each ordering must be its own SELECTABLE row, not merely text somewhere on screen —
  // the current label already shows on the trigger, so checking for the text alone
  // would pass even if the sheet dropped the selected option. A two-way toggle that
  // hides the option you are already on is how "개선 필요" becomes undiscoverable.
  for (const o of OPTIONS) {
    const rows = tree.root.findAll(
      (n) => typeof n.props?.onPress === 'function'
        && n.props?.accessibilityLabel !== '정렬'
        && texts(n).includes(o.label),
      { deep: true },
    );
    expect(rows.length).toBeGreaterThan(0);
  }
});

test('choosing an ordering reports it', async () => {
  const picked: string[] = [];
  const tree = mount('recent', (v) => picked.push(v));
  await act(async () => { trigger(tree.root).props.onPress(); });

  const weak = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes('약한 순'),
    { deep: true },
  );
  await act(async () => { weak[weak.length - 1].props.onPress(); });

  expect(picked).toEqual(['weak']);
});
