// Renders the real sheet and drives a real gesture at it.
//
// bottomSheet.test.ts asserts on the SOURCE TEXT — that the handlers are spelled
// once, inside the grabber. Worth keeping, but it cannot answer the only question
// that matters to someone holding the phone: does grabbing the bar move the sheet?
// This mounts the component and replays the platform's own gesture sequence.
import { Animated, Text } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { BottomSheet } from '@/components/BottomSheet';
import { panDriver } from '@/testing/panDriver';

/** Host nodes carrying pan handlers. Composite wrappers pass the same props down, so
 *  filtering to string types is what keeps the count honest. */
function draggables(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true }
  );
}

function mount(onClose = () => {}) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <BottomSheet visible onClose={onClose}>
        <Text>content</Text>
      </BottomSheet>
    );
  });
  return tree;
}

describe('BottomSheet drag', () => {
  it('attaches the drag to exactly one node, and it is the grabber', () => {
    const nodes = draggables(mount().root);
    expect(nodes).toHaveLength(1);
    // The grabber is the centred strip wrapping the 5px bar. If the handlers ever
    // migrate back to the sheet body, this node has maxHeight and a transform.
    expect(nodes[0].props.style).toMatchObject({ alignItems: 'center' });
    expect(nodes[0].props.style.transform).toBeUndefined();
  });

  it('follows the finger down when the grabber is dragged', () => {
    // The sheet moves on the NATIVE driver, so its position never reaches the
    // JS-rendered style — reading the rendered transform would report the value it
    // was mounted with no matter what the finger did, and pass either way. What the
    // drag actually does is push the offset into the animated value, so that is what
    // gets watched.
    const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');
    try {
      const tree = mount();
      const pan = panDriver(draggables(tree.root)[0].props);

      let claimed = false;
      // The grabber takes the touch the moment it lands — it is a dedicated strip.
      act(() => {
        claimed = pan.down();
      });
      expect(claimed).toBe(true);
      act(() => pan.move(20));

      expect(setValue).toHaveBeenLastCalledWith(20);
    } finally {
      setValue.mockRestore();
    }
  });

  it('takes the touch on contact rather than waiting to win a negotiation', () => {
    // The previous version claimed only during the move phase, which means the drag
    // works only if every view above the grabber declines the touch first. On a strip
    // with nothing to tap and nothing to scroll there is no reason to depend on that.
    const tree = mount();
    let claimed = false;
    act(() => {
      claimed = panDriver(draggables(tree.root)[0].props).down();
    });
    expect(claimed).toBe(true);
  });

  it('closes when the grabber is flung down a short distance', () => {
    const onClose = jest.fn();
    // The spring runs on the native driver, which never completes under jest. Stand in
    // for it so the *decision* is observable: what it animates to, and what it calls.
    const spring = jest.spyOn(Animated, 'spring').mockImplementation(
      ((_v: unknown, cfg: { toValue: number }) => ({
        start: (cb?: (r: { finished: boolean }) => void) => {
          (spring.mock.results.at(-1) as unknown as { toValue: number }).toValue = cfg.toValue;
          cb?.({ finished: true });
        },
        stop: () => {},
      })) as never
    );
    try {
      const tree = mount(onClose);
      const pan = panDriver(draggables(tree.root)[0].props);
      act(() => {
      pan.down();
    });
      act(() => pan.move(12));
      act(() => pan.move(12));
      // 24px total — well under the 90px distance threshold — but thrown at
      // 12px/16ms = 0.75, past the 0.6 flick. Velocity alone has to be enough.
      act(() => pan.up());
      expect(onClose).toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });

  it('does not close when the grabber is nudged down slowly', () => {
    const onClose = jest.fn();
    const spring = jest.spyOn(Animated, 'spring').mockImplementation(
      (() => ({ start: (cb?: (r: { finished: boolean }) => void) => cb?.({ finished: true }), stop: () => {} })) as never
    );
    try {
      const tree = mount(onClose);
      // 400ms per 10px = 0.025 px/ms, and 30px total: neither threshold is met.
      const pan = panDriver(draggables(tree.root)[0].props, { frameMs: 400 });
      act(() => {
      pan.down();
    });
      act(() => pan.move(10));
      act(() => pan.move(10));
      act(() => pan.move(10));
      act(() => pan.up());
      expect(onClose).not.toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });
});
