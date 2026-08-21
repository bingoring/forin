// The app's one disclosure. Two properties matter and neither is visible in a diff.
import { Animated, Text, View } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';

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
    tree = create(
      <Collapsible open={false}>
        <Text>hidden but present</Text>
      </Collapsible>
    );
  });
  expect(clipper(tree.root)).toBeDefined();
  expect(tree.root.findAll((n) => typeof n.type === 'string' && n.props?.children === 'hidden but present', { deep: true })).toHaveLength(1);
});

it('animates height on the JS driver, quickly', () => {
  const timing = timings();
  try {
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = create(<Collapsible open={false}><View /></Collapsible>);
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
      tree = create(<DisclosureChevron open={false} color="#000" />);
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
