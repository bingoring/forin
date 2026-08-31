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
        opacity={1}
        {...over}
      />,
    );
  });
  mounted.push(tree);
  return tree;
}
afterEach(() => { for (const tree of mounted.splice(0)) act(() => { tree.unmount(); }); });

test('every link of the width chain is definite', () => {
  // The FIRST version of this test checked the two ends — a number on the cluster, a
  // stretch on the panel — and passed while the panel was still laying out at no width,
  // because Collapsible sits between them and its own width stayed auto. jest has no
  // layout engine, so the honest check is the CHAIN: walk from the panel up to the
  // cluster and refuse any link that neither has a width nor stretches to its parent.
  const tree = mount({ open: true });
  const cluster = tree.root.findByProps({ testID: 'mission-cluster' });
  const panel = tree.root.findByProps({ testID: 'mission-panel' });

  expect(flat(cluster.props.style).width).toBe(MISSION_CLUSTER_W);
  expect(flat(cluster.props.style).maxWidth).toBeUndefined();

  const weak: string[] = [];
  for (let n: ReactTestInstance | null = panel; n && n !== cluster; n = n.parent) {
    if (typeof n.type !== 'string' && n !== panel) continue; // composites carry no style
    const st = flat(n.props?.style);
    const sized = typeof st.width === 'number' || st.alignSelf === 'stretch' || st.flex === 1;
    if (!sized) weak.push(`${String(n.type)} ${JSON.stringify(st).slice(0, 80)}`);
  }
  expect(weak).toEqual([]);
});

test('every mission is rendered, so opening shows something', () => {
  const tree = mount({ open: true });
  const drawn = texts(tree.root.findByProps({ testID: 'mission-panel' }));
  for (const g of GOALS) expect(drawn).toContain(g);
});

test('상황 종료 is centred on the SCREEN, in the same top row as the exit', () => {
  // It used to sit inside this cluster, which put it wherever the right-hand column
  // left it — "almost centred", and drifting as the mission count changed the chip's
  // width. It is its own child of the status row now, pinned across the full width so
  // the centre is the screen's centre.
  const src = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');
  expect(src).toMatch(/position: 'absolute', left: 0, right: 0, top: 52, alignItems: 'center'/);
  expect(src).toMatch(/label=\{t\('dialogue\.endSituation'\)\}/);
  // …and it is a real button, not a hand-drawn box.
  expect(src).toMatch(/<PixelButton\s+icon="check"/);
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

test('no missions, no chip', () => {
  // A scenario with no goals draws nothing here at all — an empty panel behind a chip
  // reading "미션 0" is a control that opens onto nothing.
  const tree = mount({ goals: [] });
  expect(tree.root.findAllByProps({ testID: 'mission-panel' })).toHaveLength(0);
  expect(texts(tree.root)).toEqual([]);
});

test('faded chrome does not take touches', () => {
  // While the keyboard is up the cluster is faded out; a faded control that still
  // accepts a tap is worse than one that is gone.
  const tree = mount({ disabled: true });
  expect(tree.root.findByProps({ testID: 'mission-cluster' }).props.pointerEvents).toBe('none');
});

test('the exit is pinned to the top, and presses', () => {
  const src = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');
  // The row centred its children vertically, so growing this cluster re-centred the ×
  // and slid it down. It pins to the top now.
  const row = /paddingTop: 52[^}]*alignItems: '([a-z-]+)'/.exec(src);
  expect(row?.[1]).toBe('flex-start');
  // And the × had a shadow but no press — tapping it moved nothing, so on a slow frame
  // there was no sign the tap had landed. Same mechanic as PixelButton now.
  expect(src).toMatch(/onPressIn=\{\(\) => setExitDown\(true\)\}/);
  expect(src).toMatch(/translateX: exitDown \? 2 : 0/);
});
