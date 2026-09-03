// The sort dropdown that opens in place — not a bottom sheet.
//
// It measures its trigger and floats the option list at that spot inside a transparent
// Modal. Three things could each silently regress: the trigger could stop naming the
// current ordering, the list could open showing fewer than every option (a toggle that
// hides the one you are not on is exactly what this replaced), and a tap could fail to
// report the choice or fail to close. measureInWindow is a native call, so the test
// supplies it through createNodeMock — without that the menu never opens and every
// assertion below would be vacuous.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbInlineSelect } from './NbInlineSelect';

const OPTIONS = [
  { value: 'weak' as const, label: '낮은순' },
  { value: 'high' as const, label: '높은순' },
  { value: 'recent' as const, label: '최신순' },
];

// Every host node reports a fixed box so openMenu's measureInWindow callback fires.
function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(el, { createNodeMock: () => ({ measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => cb(0, 100, 90, 26) }) }); });
  return tree;
}

/** The label text nodes currently rendered (trigger + any open menu). */
function labels(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** The Pressable carrying a given label — climb from the text to the first onPress. */
function pressFor(root: ReactTestInstance, label: string): () => void {
  const text = root.findAll((n) => String(n.type) === 'Text' && n.children[0] === label, { deep: true })[0];
  let node: ReactTestInstance | null = text;
  while (node) {
    if (typeof node.props?.onPress === 'function') return node.props.onPress;
    node = node.parent;
  }
  throw new Error(`no pressable for ${label}`);
}

test('the trigger names the current ordering, not the first option', () => {
  const tree = mount(<NbInlineSelect title="정렬" value="recent" options={OPTIONS} onSelect={() => {}} />);
  // Closed: only the trigger's own label is on screen, and it is the current value.
  expect(labels(tree.root)).toContain('최신순');
  expect(labels(tree.root)).not.toContain('낮은순');
});

test('opening lists every ordering, so an unseen one is still reachable', () => {
  const tree = mount(<NbInlineSelect title="정렬" value="weak" options={OPTIONS} onSelect={() => {}} />);
  act(() => { pressFor(tree.root, '낮은순')(); }); // the trigger
  const shown = labels(tree.root);
  for (const o of OPTIONS) expect(shown).toContain(o.label);
});

test('tapping an option reports it and closes the menu', () => {
  const picked: string[] = [];
  const tree = mount(<NbInlineSelect title="정렬" value="weak" options={OPTIONS} onSelect={(v) => picked.push(v)} />);
  act(() => { pressFor(tree.root, '낮은순')(); }); // open
  act(() => { pressFor(tree.root, '높은순')(); }); // choose 높은순
  expect(picked).toEqual(['high']);
  // Closed again: the menu's other options are gone, only the trigger remains.
  expect(labels(tree.root)).not.toContain('최신순');
});

test('re-choosing the current ordering is a no-op, not a reload', () => {
  const picked: string[] = [];
  const tree = mount(<NbInlineSelect title="정렬" value="high" options={OPTIONS} onSelect={(v) => picked.push(v)} />);
  act(() => { pressFor(tree.root, '높은순')(); }); // open (trigger shows 높은순)
  // Two 높은순 on screen now — trigger and the menu row. Press the menu row (the last).
  const rows = tree.root.findAll((n) => String(n.type) === 'Text' && n.children[0] === '높은순', { deep: true });
  let node: ReactTestInstance | null = rows[rows.length - 1];
  let onPress!: () => void;
  while (node) { if (typeof node.props?.onPress === 'function') { onPress = node.props.onPress; break; } node = node.parent; }
  act(() => { onPress(); });
  expect(picked).toEqual([]); // nothing fired: it was already the value
});
