// The overlay path: a sheet rendered somewhere other than where it was written.
//
// Worth testing separately because the existing sheet tests mount BottomSheet with no
// host, so they exercise the Modal fallback and say nothing about this. And the mechanism
// has two failure modes that are invisible in a diff: the sheet not arriving in the
// outlet at all, and the registration re-rendering whatever registered it, which loops.
import { Text, View } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { BottomSheet } from '@/components/BottomSheet';
import { SheetOverlayHost } from '@/components/SheetOverlay';
import { trackMounts } from '../testing/mountRegistry';

/** Unmounts every tree this file mounts. Not optional here: a mounted BottomSheet holds a
 *  250ms entry fallback whose frame starts a spring, and a tree left up keeps that alive
 *  past the end of the suite — so it fires after jest has torn the module registry down
 *  and crashes whichever UNRELATED suite is running then, as `Cannot read properties of
 *  undefined (reading 'spring')`. That is exactly what this file was doing. */
const track = trackMounts();

function grabbers(root: ReactTestInstance) {
  return root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true }
  );
}

/** Modals in the RENDERED tree. Counting composite nodes named Modal double-counts: RN
 *  wraps its own Modal, so the component appears twice for one rendered host view. */
function modalCount(json: unknown): number {
  const node = json as { type?: string; children?: unknown[] } | null;
  if (!node || typeof node !== 'object') return 0;
  const here = node.type === 'Modal' ? 1 : 0;
  return here + (node.children ?? []).reduce<number>((n, c) => n + modalCount(c), 0);
}

const sheet = (props: { visible?: boolean; suspended?: boolean } = {}) => (
  <BottomSheet visible={props.visible ?? true} suspended={props.suspended} overlay onClose={() => {}}>
    <Text>content</Text>
  </BottomSheet>
);

it('renders the sheet into the host instead of a Modal', () => {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(<SheetOverlayHost>{sheet()}</SheetOverlayHost>));
  });
  // Present, exactly once — a sheet that registered but also rendered itself would be two.
  expect(grabbers(tree.root)).toHaveLength(1);
  expect(modalCount(tree.toJSON())).toBe(0);
});

it('falls back to a Modal when there is no host', () => {
  // Sheets on screens outside the tab layout still have to present themselves.
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(sheet()));
  });
  expect(grabbers(tree.root)).toHaveLength(1);
  expect(modalCount(tree.toJSON())).toBe(1);
});

it('paints above everything else the host wraps', () => {
  // The whole point of the host: the sheet has to cover the tab bar, which is inside the
  // children. Being the LAST child is what puts it there, for painting and for touches.
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(
      <SheetOverlayHost>
        <View testID="tab-bar" />
        {sheet()}
      </SheetOverlayHost>
    ));
  });
  const root = tree.toJSON() as { children: { props?: Record<string, unknown> }[] };
  const last = root.children[root.children.length - 1];
  expect(grabbers(tree.root)).toHaveLength(1);
  // The tab bar is somewhere earlier; the sheet's container is the final child.
  expect(last.props?.testID).toBeUndefined();
});

it('leaves nothing behind when suspended or unmounted', () => {
  let tree!: ReturnType<typeof create>;
  const render = (node: React.ReactNode) =>
    act(() => {
      const el = <SheetOverlayHost>{node}</SheetOverlayHost>;
      if (tree) tree.update(el);
      else tree = track(create(el));
    });

  render(sheet());
  expect(grabbers(tree.root)).toHaveLength(1);

  render(sheet({ suspended: true }));
  expect(grabbers(tree.root)).toHaveLength(0);

  render(sheet());
  expect(grabbers(tree.root)).toHaveLength(1);

  // Unmounting the owner has to clear the slot, or the sheet outlives the screen.
  render(null);
  expect(grabbers(tree.root)).toHaveLength(0);
  expect(tree.toJSON()).toBeTruthy();
});

it('does not re-render the registering component in a loop', () => {
  // The registration happens in an effect with no dependency array, on purpose: the node
  // is a fresh element every render. That is only safe because the outlet is a SIBLING of
  // the children, never an ancestor. If it were an ancestor this would exhaust React's
  // update depth rather than settle.
  let renders = 0;
  function Owner() {
    renders++;
    return sheet();
  }
  act(() => {
    track(create(
      <SheetOverlayHost>
        <Owner />
      </SheetOverlayHost>
    ));
  });
  expect(renders).toBeLessThan(5);
});
