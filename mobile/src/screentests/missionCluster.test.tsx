// The dialogue screen's top-right cluster: the way out, and the missions under it.
//
// Three reported defects, and two of them were one bug:
//
//  - the mission panel showed nothing when opened
//  - 상황 종료 moved far below the panel's visible bottom when it opened
//
// Both because the panel's text is a `flex: 1` child and the cluster sized itself to its
// content: a flex child of an auto-width parent resolves to a basis of zero, so the panel
// laid out at ~0pt wide — invisible, and measured several times taller than it looked
// because every word wrapped onto its own line.
//
// jest has no layout engine, so these tests assert the STYLE that decides the layout
// rather than a resolved width. That is the honest limit here: what they can hold is
// "the width is a definite number and the panel stretches to it", which is precisely
// what was missing.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MISSION_CLUSTER_W, MissionCluster } from '@/components/dialogue/MissionCluster';

const GOALS = [
  '환자 본인 확인',
  '통증 양상 사정 — 어디가, 어떻게, 언제부터',
  '방사통 여부 확인',
  '다음 단계 안내',
];

function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}
function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

const mounted: ReturnType<typeof create>[] = [];
function mount(over: Partial<Parameters<typeof MissionCluster>[0]> = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <MissionCluster
        goals={GOALS}
        done={new Set()}
        open={false}
        onToggle={() => {}}
        onEnd={() => {}}
        opacity={1}
        {...over}
      />,
    );
  });
  mounted.push(tree);
  return tree;
}
afterEach(() => { for (const tree of mounted.splice(0)) act(() => { tree.unmount(); }); });

test('the panel has a width to lay out in', () => {
  const tree = mount({ open: true });
  const cluster = tree.root.findByProps({ testID: 'mission-cluster' });
  const panel = tree.root.findByProps({ testID: 'mission-panel' });

  // A NUMBER, not maxWidth. With only a maximum, the width comes from the content, and
  // the content is a flex child — which then has nothing to flex into.
  expect(typeof flat(cluster.props.style).width).toBe('number');
  expect(flat(cluster.props.style).width).toBe(MISSION_CLUSTER_W);
  expect(flat(cluster.props.style).maxWidth).toBeUndefined();

  // …and the panel takes that width, rather than hugging its own (zero-width) content.
  // The cluster pins its other children to the right wall, so without this the panel
  // would size itself.
  expect(flat(panel.props.style).alignSelf).toBe('stretch');
});

test('every mission is rendered, so opening shows something', () => {
  const tree = mount({ open: true });
  const drawn = texts(tree.root.findByProps({ testID: 'mission-panel' }));
  for (const g of GOALS) expect(drawn).toContain(g);
});

test('the missions come AFTER the way out', () => {
  const tree = mount({ open: true });
  const order = texts(tree.root);
  // Asked for directly. It also puts the exit at a fixed distance from the corner
  // instead of one that moves with the mission count.
  expect(order.indexOf('상황 종료')).toBeGreaterThan(-1);
  expect(order.indexOf(GOALS[0])).toBeGreaterThan(order.indexOf('상황 종료'));
});

test('a covered mission is ticked and struck through', () => {
  const tree = mount({ open: true, done: new Set([2]) });
  const rows = tree.root.findByProps({ testID: 'mission-panel' })
    .findAll((n) => String(n.type) === 'Text' && n.children.includes(GOALS[1]), { deep: true });
  expect(flat(rows[0].props.style).textDecorationLine).toBe('line-through');
  // The bullet is replaced rather than joined — two marks in a row would be noise.
  const bullets = texts(tree.root.findByProps({ testID: 'mission-panel' })).filter((x) => x === '·');
  expect(bullets).toHaveLength(GOALS.length - 1);
});

test('no missions, no chip — but still a way out', () => {
  const tree = mount({ goals: [] });
  expect(texts(tree.root)).toContain('상황 종료');
  expect(tree.root.findAllByProps({ testID: 'mission-panel' })).toHaveLength(0);
});

test('faded chrome does not take touches', () => {
  // While the keyboard is up the cluster is faded out; a faded control that still
  // accepts a tap is worse than one that is gone.
  const tree = mount({ disabled: true });
  expect(tree.root.findByProps({ testID: 'mission-cluster' }).props.pointerEvents).toBe('none');
});

test('the exit in the opposite corner is pinned to the top', () => {
  // The × is not in this component — it is the other child of the screen's status row,
  // which centred its children vertically. Growing this cluster therefore re-centred the
  // exit and slid it down. The row pins to the top now.
  const src = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');
  const row = /paddingTop: 52[^}]*alignItems: '([a-z-]+)'/.exec(src);
  expect(row?.[1]).toBe('flex-start');
});
