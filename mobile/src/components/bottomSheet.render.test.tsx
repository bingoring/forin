// Renders the real sheet and drives real gestures at it.
//
// bottomSheet.test.ts asserts on source text, which can only say where the drag is
// wired. Everything about how the sheet BEHAVES lives here: which gestures dismiss it,
// which ones are treated as slack, and which detent it lands on. Those are the things
// that were wrong on the device, and a string match cannot see any of them.
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

/** The sheet's animated height cap — the observable form of "which detent is it on". */
function detentHeight(root: ReactTestInstance): number {
  const node = root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.style?.maxHeight === 'number',
    { deep: true }
  )[0];
  return node.props.style.maxHeight;
}

/**
 * Springs finish instantly AND apply their end value.
 *
 * Under jest a real spring never completes, so without this nothing that depends on the
 * animation settling is observable. Applying `toValue` matters as much as calling back:
 * the detent assertions read the height the spring was aiming at.
 */
function instantSprings() {
  return jest.spyOn(Animated, 'spring').mockImplementation(
    ((v: Animated.Value, cfg: { toValue: number }) => ({
      start: (cb?: (r: { finished: boolean }) => void) => {
        v.setValue(cfg.toValue);
        cb?.({ finished: true });
      },
      stop: () => {},
    })) as never
  );
}

function mount(onClose = () => {}, expandable = true) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <BottomSheet visible onClose={onClose} expandable={expandable}>
        <Text>content</Text>
      </BottomSheet>
    );
  });
  return tree;
}

/** Drag the grabber by `total` px, delivered in `steps` frames of `frameMs`. */
function drag(tree: ReturnType<typeof create>, total: number, frameMs = 16, steps = 4) {
  const pan = panDriver(draggables(tree.root)[0].props, { frameMs });
  act(() => {
    pan.down();
  });
  for (let i = 0; i < steps; i++) act(() => pan.move(total / steps));
  act(() => pan.up());
}

describe('where the drag lives', () => {
  it('attaches to exactly one node, and it is the grabber', () => {
    const nodes = draggables(mount().root);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].props.style).toMatchObject({ alignItems: 'center' });
    expect(nodes[0].props.style.transform).toBeUndefined();
  });

  it('takes the touch on contact rather than waiting to win a negotiation', () => {
    // Claiming only on move means the drag works only if every view above the grabber
    // declines the touch first. On a strip with nothing to tap there is no reason to
    // depend on that.
    const tree = mount();
    let claimed = false;
    act(() => {
      claimed = panDriver(draggables(tree.root)[0].props).down();
    });
    expect(claimed).toBe(true);
  });

  it('follows the finger down', () => {
    // The offset is what the drag writes; the rendered transform is not a witness to it.
    const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');
    try {
      const tree = mount();
      const pan = panDriver(draggables(tree.root)[0].props);
      act(() => {
        pan.down();
      });
      act(() => pan.move(20));
      expect(setValue).toHaveBeenLastCalledWith(20);
    } finally {
      setValue.mockRestore();
    }
  });
});

describe('dismissing from the collapsed detent', () => {
  it('closes on a long slow drag', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      drag(mount(onClose), 160, 400); // 160px, far past the 90px threshold, no velocity
      expect(onClose).toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });

  it('closes on a fast flick that has actually travelled', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      drag(mount(onClose), 64, 16); // 64px at 1px/ms: under 90px, but a real flick
      expect(onClose).toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });

  it('ignores a fast twitch that went nowhere', () => {
    // The bug this pins: velocity alone dismissed the sheet, so a 24px jerk on the
    // handle — a movement people read as "I barely touched it" — threw the sheet away.
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      drag(mount(onClose), 24, 16); // high velocity, below the travel gate
      expect(onClose).not.toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });
});

describe('the expanded detent', () => {
  /** Fling up, then confirm the sheet actually grew. */
  function expand(onClose = () => {}) {
    const tree = mount(onClose);
    const collapsed = detentHeight(tree.root);
    drag(tree, -160, 16);
    const grown = detentHeight(tree.root);
    expect(grown).toBeGreaterThan(collapsed);
    return { tree, collapsed, grown };
  }

  it('expands smoothly by animating height, not by switching it', () => {
    const spring = instantSprings();
    try {
      const { grown } = expand();
      // Height reaching the taller detent through Animated.spring is what makes the
      // expansion a motion at all: as a plain style switch it was an instant layout
      // change, and the sheet appeared to teleport however the spring was tuned.
      const heightSprings = spring.mock.calls.filter(([, cfg]) => (cfg as { toValue: number }).toValue === grown);
      expect(heightSprings.length).toBeGreaterThan(0);
      expect((heightSprings[0][1] as { useNativeDriver: boolean }).useNativeDriver).toBe(false);
    } finally {
      spring.mockRestore();
    }
  });

  it('springs back to the top when nudged down within the slack', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      const { tree, grown } = expand(onClose);
      drag(tree, 90, 400); // ~1.5cm, slowly: inside the slack
      expect(onClose).not.toHaveBeenCalled();
      expect(detentHeight(tree.root)).toBe(grown); // still pinned to the top
    } finally {
      spring.mockRestore();
    }
  });

  it('steps down to the collapsed detent past the slack, without closing', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      const { tree, collapsed } = expand(onClose);
      drag(tree, 200, 400); // past the slack
      // Two steps out of a sheet you deliberately expanded: the first one is not the exit.
      expect(onClose).not.toHaveBeenCalled();
      expect(detentHeight(tree.root)).toBe(collapsed);
    } finally {
      spring.mockRestore();
    }
  });
});

describe('being covered is not being closed', () => {
  /** Entry animations are the springs aimed at the resting position. */
  const entries = (spring: jest.SpyInstance) =>
    spring.mock.calls.filter(([, cfg]) => (cfg as { toValue: number }).toValue === 0).length;

  it('slides up when opened, and is simply there when uncovered', () => {
    const spring = instantSprings();
    const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');
    try {
      let tree!: ReturnType<typeof create>;
      const render = (suspended: boolean) =>
        act(() => {
          const el = (
            <BottomSheet visible suspended={suspended} onClose={() => {}}>
              <Text>content</Text>
            </BottomSheet>
          );
          if (tree) tree.update(el);
          else tree = create(el);
        });

      render(false);
      const onOpen = entries(spring);
      expect(onOpen).toBeGreaterThan(0); // opening is an arrival and animates

      render(true); // a screen was pushed on top
      expect(draggables(tree.root)).toHaveLength(0);

      setValue.mockClear();
      render(false); // that screen went away
      expect(draggables(tree.root)).toHaveLength(1);
      // No new arrival: sliding up again would claim it had been dismissed and would
      // announce itself on the way back from a screen the person just declined.
      expect(entries(spring)).toBe(onOpen);
      expect(setValue).toHaveBeenCalledWith(0);
    } finally {
      setValue.mockRestore();
      spring.mockRestore();
    }
  });

  it('does animate in again after a real dismissal', () => {
    // The counterpart: without this, a sheet that never animates at all would pass above.
    const spring = instantSprings();
    try {
      let tree!: ReturnType<typeof create>;
      const render = (visible: boolean) =>
        act(() => {
          const el = (
            <BottomSheet visible={visible} onClose={() => {}}>
              <Text>content</Text>
            </BottomSheet>
          );
          if (tree) tree.update(el);
          else tree = create(el);
        });

      render(true);
      const first = entries(spring);
      render(false);
      render(true);
      expect(entries(spring)).toBeGreaterThan(first);
    } finally {
      spring.mockRestore();
    }
  });
});
