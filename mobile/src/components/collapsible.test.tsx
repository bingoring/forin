// The app's one disclosure. Two properties matter and neither is visible in a diff.
import { Animated, Text, View } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { trackMounts } from '../testing/mountRegistry';

/** Unmounts every tree this file mounts — see mountRegistry for why. */
const track = trackMounts();

function timings() {
  return jest.spyOn(Animated, 'timing').mockImplementation(
    ((v: Animated.Value, cfg: { toValue: number }) => ({
      start: (cb?: () => void) => {
        v.setValue(cfg.toValue);
        cb?.();
      },
      stop: () => {},
    })) as never
  );
}

function clipper(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'string' && n.props?.style?.overflow === 'hidden', { deep: true })[0];
}

it('keeps its children mounted when closed, and clips them', () => {
  // `open && children` is the version this replaced: it made the height change in one frame
  // AND made the height unknowable, which is what an animation needs.
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(
      <Collapsible open={false}>
        <Text>hidden but present</Text>
      </Collapsible>
    ));
  });
  expect(clipper(tree.root)).toBeDefined();
  expect(tree.root.findAll((n) => typeof n.type === 'string' && n.props?.children === 'hidden but present', { deep: true })).toHaveLength(1);
});

it('animates height on the JS driver, quickly', () => {
  const timing = timings();
  try {
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = track(create(<Collapsible open={false}><View /></Collapsible>));
    });
    act(() => {
      tree.update(<Collapsible open><View /></Collapsible>);
    });
    expect(timing.mock.calls.length).toBeGreaterThan(0);
    for (const [, cfg] of timing.mock.calls) {
      // Height is a layout property: the native driver cannot touch it, and mixing drivers
      // on one view throws.
      expect((cfg as { useNativeDriver: boolean }).useNativeDriver).toBe(false);
      // Never stands between a tap and the content.
      expect((cfg as { duration: number }).duration).toBeLessThanOrEqual(250);
    }
  } finally {
    timing.mockRestore();
  }
});

it('turns the chevron on the UI thread — a transform belongs there', () => {
  const timing = timings();
  try {
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = track(create(<DisclosureChevron open={false} color="#000" />));
    });
    act(() => {
      tree.update(<DisclosureChevron open color="#000" />);
    });
    expect(timing.mock.calls.length).toBeGreaterThan(0);
    for (const [, cfg] of timing.mock.calls) {
      expect((cfg as { useNativeDriver: boolean }).useNativeDriver).toBe(true);
      // The same beat as the block it describes, or it reads as two separate events.
      expect((cfg as { duration: number }).duration).toBe(190);
    }
  } finally {
    timing.mockRestore();
  }
});

/** The clipping container's height, and the measured child's opacity. */
function boxAndContent(tree: ReturnType<typeof create>) {
  const flat = (st: unknown) => (Array.isArray(st) ? Object.assign({}, ...st) : (st ?? {})) as Record<string, unknown>;
  const box = tree.root.findAll(
    (n) => typeof n.type === 'string' && flat(n.props?.style).overflow === 'hidden',
    { deep: true },
  )[0];
  const inner = tree.root.findAll((n) => typeof n.props?.onLayout === 'function', { deep: true })[0];
  return { height: flat(box.props.style).height, opacity: flat(inner.props.style).opacity, inner };
}

test('a dropdown that mounts CLOSED can still open', () => {
  // This is the regression that broke every dropdown in the app — building, floor and
  // curriculum all at once.
  //
  // An attempt at killing the open-flash pinned the height to 0 until a measurement
  // arrived. But the block is CLIPPED to that height, so onLayout reports 0, the `h > 0`
  // guard rejects it, and the content's real height is never learned. The natural-height
  // frame was not decoration: it was the only frame in which the content could be
  // measured at all.
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<Collapsible open={false}><Text>c</Text></Collapsible>)); });

  // Shut, and a device reports the clipped child as zero-height.
  expect(boxAndContent(tree).height).toBe(0);
  act(() => { boxAndContent(tree).inner.props.onLayout({ nativeEvent: { layout: { height: 0, width: 300 } } }); });

  act(() => { tree.update(<Collapsible open><Text>c</Text></Collapsible>); });
  const open = boxAndContent(tree);
  // Natural height — i.e. there is a frame in which the content can be measured. Zero
  // here is the bug: the dropdown would never open.
  expect(open.height).toBeUndefined();
  // …and that frame is INVISIBLE, which is what stops it flashing.
  expect(open.opacity).toBe(0);

  // The measurement lands and the slide takes over.
  act(() => { open.inner.props.onLayout({ nativeEvent: { layout: { height: 140, width: 300 } } }); });
  const sliding = boxAndContent(tree);
  expect(typeof sliding.height).toBe('number');
  expect(sliding.height as number).toBeLessThan(140);
  expect(sliding.opacity).toBe(1);
});

test('opening slides — it does not flash at full height first', () => {
  // Reported as "한번 빠르게 깜빡하고 스르륵 내려와", and that is exactly what it was.
  // Before the content had been measured the height was `undefined`, which means
  // NATURAL height: the block rendered whole for one frame, then the effect animated it
  // from 0. A flash followed by a slide.
  //
  // Zero until measured. Clipping does not change layout, so the children are still
  // measured at height 0 and the animation starts the moment the number lands.
  const heights: unknown[] = [];
  const record = (tree: ReturnType<typeof create>) => {
    const box = tree.root.findAll((n) => {
      const st = Array.isArray(n.props?.style) ? Object.assign({}, ...n.props.style) : (n.props?.style ?? {});
      return typeof n.type === 'string' && st.overflow === 'hidden';
    }, { deep: true })[0];
    const st = Array.isArray(box.props.style) ? Object.assign({}, ...box.props.style) : box.props.style;
    heights.push(st.height);
  };

  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = track(create(
      <Collapsible open>
        <Text>content</Text>
      </Collapsible>,
    ));
  });
  // The frame before any measurement is at natural height — that is where the content
  // gets measured — but its CONTENT is invisible, so nothing flashes. Asserted in "a
  // dropdown that mounts CLOSED can still open"; here we only need the slide.
  record(tree);

  // The measurement lands, and now there is something to travel to.
  const inner = tree.root.findAll((n) => typeof n.props?.onLayout === 'function', { deep: true })[0];
  act(() => { inner.props.onLayout({ nativeEvent: { layout: { height: 120, width: 240 } } }); });
  record(tree);
  // The height is resolved to a NUMBER on the host node (Animated does that), which is
  // better than checking for an interpolation: it lets the test read where the slide
  // starts. It starts near zero and travels — a jump would already be at 120 here, and
  // the flash was the frame where it read 120 before any of this.
  expect(typeof heights[1]).toBe('number');
  expect(heights[1] as number).toBeLessThan(120);
});
