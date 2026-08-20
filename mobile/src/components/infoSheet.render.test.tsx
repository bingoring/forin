// InfoSheet's handle used to be paint. This mounts it and grabs the bar.
import { Animated } from 'react-native';

// PixelButton pulls in the sfx module, which touches expo-audio's native side at
// import time. The sheet under test has nothing to do with sound.
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { InfoSheet } from '@/components/InfoSheet';
import { panDriver } from '@/testing/panDriver';

function draggables(root: ReactTestInstance) {
  return root.findAll(
    (n) => typeof n.type === 'string' && typeof n.props?.onMoveShouldSetResponder === 'function',
    { deep: true }
  );
}

const DATA = { icon: '*', title: 'Night Owl', what: 'a title', how: 'work nights' };

it('has a handle that actually drags, and closes on a downward fling', () => {
  const onClose = jest.fn();
  // Native-driver springs never finish under jest; stand in so the decision is visible.
  const spring = jest.spyOn(Animated, 'spring').mockImplementation(
    (() => ({
      start: (cb?: (r: { finished: boolean }) => void) => cb?.({ finished: true }),
      stop: () => {},
    })) as never
  );
  try {
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = create(<InfoSheet data={DATA} onClose={onClose} />);
    });
    const nodes = draggables(tree.root);
    expect(nodes).toHaveLength(1);

    const pan = panDriver(nodes[0].props);
    act(() => {
      pan.down();
      pan.claim(12);
    });
    act(() => pan.move(12));
    act(() => pan.up());
    expect(onClose).toHaveBeenCalled();
  } finally {
    spring.mockRestore();
  }
});
