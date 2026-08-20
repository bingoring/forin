// Renders the real sheet and drives real gestures at it.
//
// bottomSheet.test.ts asserts on source text, which can only say where the drag is
// wired. Everything about how the sheet BEHAVES lives here: which gestures dismiss it,
// which ones are treated as slack, and which detent it lands on. Those are the things
// that were wrong on the device, and a string match cannot see any of them.
import { Animated, Dimensions, Text } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { BottomSheet } from '@/components/BottomSheet';
import { panDriver } from '@/testing/panDriver';

const SCREEN_H = Dimensions.get('window').height;

/** Host nodes carrying pan handlers. Composite wrappers pass the same props down, so
 *  filtering to string types is what keeps the count honest. */
function draggables(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true }
  );
}

/** The sheet's resting height — the observable form of "how big did it open". */
function restingHeight(root: ReactTestInstance): number {
  const node = root.findAll(
    (n) =>
      typeof n.type === 'string' &&
      (typeof n.props?.style?.height === 'number' || typeof n.props?.style?.maxHeight === 'number'),
    { deep: true }
  )[0];
  return node.props.style.height ?? node.props.style.maxHeight;
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

function mount(onClose = () => {}, size: 'content' | 'tall' = 'content') {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <BottomSheet visible onClose={onClose} size={size}>
        <Text>content</Text>
      </BottomSheet>
    );
  });
  return tree;
}

/** Tell the sheet its content has laid out, the way the platform would. */
function reportLayout(tree: ReturnType<typeof create>, height = 400) {
  const node = tree.root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onLayout === 'function',
    { deep: true }
  )[0];
  act(() => node.props.onLayout({ nativeEvent: { layout: { height, width: 320, x: 0, y: 0 } } }));
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

describe('a tall sheet', () => {
  it('opens at the top rather than partway', () => {
    // The floor sheet's content IS the point: a middle stop showed a slice of a long
    // list and asked for a second gesture to see the rest.
    const spring = instantSprings();
    try {
      const content = restingHeight(mount(() => {}, 'content').root);
      const tall = restingHeight(mount(() => {}, 'tall').root);
      expect(tall).toBeGreaterThan(content);
      // Not flush to the top: pinned there, tapping outside — one of the two exits people
      // already reach for — has no outside left to tap.
      expect(tall).toBeLessThan(SCREEN_H);
    } finally {
      spring.mockRestore();
    }
  });

  it('springs back to the top from most of the way down', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      // Well past the 90px that dismisses a content sheet, and still nowhere near the
      // middle of the screen. On a tall sheet that is a haul, not a decision.
      drag(mount(onClose, 'tall'), SCREEN_H * 0.3, 400);
      expect(onClose).not.toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });

  it('closes once its top edge is dragged past the middle of the screen', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      drag(mount(onClose, 'tall'), SCREEN_H * 0.55, 400);
      expect(onClose).toHaveBeenCalled();
    } finally {
      spring.mockRestore();
    }
  });

  it('still closes on a flick, without the haul', () => {
    const spring = instantSprings();
    const onClose = jest.fn();
    try {
      drag(mount(onClose, 'tall'), 80, 16); // 80px at 1px/ms
      expect(onClose).toHaveBeenCalled();
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
      reportLayout(tree);
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
      reportLayout(tree);
      const first = entries(spring);
      render(false);
      render(true);
      reportLayout(tree);
      expect(entries(spring)).toBeGreaterThan(first);
    } finally {
      spring.mockRestore();
    }
  });
});

describe('entering', () => {
  const entries = (spring: jest.SpyInstance) =>
    spring.mock.calls.filter(([, cfg]) => (cfg as { toValue: number }).toValue === 0).length;

  it('waits offscreen until the content exists before travelling', () => {
    // The bug this pins: the spring started the moment the sheet opened, while a floor's
    // worth of content was still mounting. Its clock does not wait, so the sheet seemed to
    // appear a quarter of the way up — the first stretch of the trip had been played to an
    // empty stage.
    const spring = instantSprings();
    try {
      const tree = mount(() => {}, 'tall');
      expect(entries(spring)).toBe(0);
      reportLayout(tree);
      expect(entries(spring)).toBe(1);
    } finally {
      spring.mockRestore();
    }
  });

  it('travels anyway if layout never reports', () => {
    // Waiting must not be able to strand the sheet offscreen.
    jest.useFakeTimers();
    const spring = instantSprings();
    try {
      mount(() => {}, 'tall');
      expect(entries(spring)).toBe(0);
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(entries(spring)).toBe(1);
    } finally {
      spring.mockRestore();
      jest.useRealTimers();
    }
  });

  it('does not travel twice when layout reports more than once', () => {
    const spring = instantSprings();
    try {
      const tree = mount(() => {}, 'content');
      reportLayout(tree, 300);
      reportLayout(tree, 320); // content settling, not a second opening
      expect(entries(spring)).toBe(1);
    } finally {
      spring.mockRestore();
    }
  });
});
