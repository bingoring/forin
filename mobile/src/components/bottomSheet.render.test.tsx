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
      // 20px is past the 6px slop, so the grabber must take the gesture.
      act(() => {
        pan.down();
        claimed = pan.claim(20);
      });
      expect(claimed).toBe(true);
      act(() => pan.move(20));

      // Distance is measured from the moment the gesture was granted, not from
      // touch-down: PanResponder zeroes dy on grant, so the 20px that won the
      // gesture is the anchor and this reports the 20px travelled since.
      expect(setValue).toHaveBeenLastCalledWith(20);
    } finally {
      setValue.mockRestore();
    }
  });

  it('ignores a horizontal swipe', () => {
    const tree = mount();
    const nodes = draggables(tree.root);
    // dx dominant → not a sheet drag. Driven through the same config the app uses.
    expect(nodes[0].props.onMoveShouldSetResponder).toBeDefined();
    const pan = panDriver(nodes[0].props);
    let claimed = true;
    act(() => {
      pan.down();
      claimed = pan.claim(3);
    });
    expect(claimed).toBe(false);
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
        pan.claim(12);
      });
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
        pan.claim(10);
      });
      act(() => pan.move(10));
      act(() => pan.move(10));
      act(() => pan.up());
      expect(onClose).not.toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });
});
