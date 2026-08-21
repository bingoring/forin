// The star has to change under the finger.
//
// A favourite that only shows up after leaving the screen and coming back is
// indistinguishable from a tap that did nothing.
let mockStore: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: async (k: string) => mockStore[k] ?? null,
  setItemAsync: async (k: string, v: string) => {
    mockStore[k] = v;
  },
}));
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { Animated } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { FloorList } from '@/components/campus/FloorList';
import { loadFavorites } from '@/lib/favorites';
import { colors } from '@/theme/tokens';
import type { CurriculumBuilding } from '@/api/client';

const BUILDINGS = [
  {
    building: '본관',
    floors: [
      {
        floor: '5F',
        where: '본관 5F 중환자실',
        curricula: [
          {
            key: 'k', name: '중환자 투약', building: '본관', floor: '5F', where: '본관 5F 중환자실',
            done: 0, total: 1, state: 'todo',
            steps: [{ scenarioId: 'SCN-ICU-00001', name: 'a', state: 'todo', kind: 'dlg' }],
          },
        ],
      },
    ],
  },
] as unknown as CurriculumBuilding[];

/** Two buildings: only one can be open, so the other's rows test the clipping. */
const TWO = [
  ...(BUILDINGS as unknown as { building: string; floors: unknown[] }[]),
  {
    building: '여성의료',
    floors: [
      {
        floor: '3F',
        where: '여성의료 3F 분만실',
        curricula: [
          {
            key: 'k2', name: '분만 투약', building: '여성의료', floor: '3F', where: '여성의료 3F 분만실',
            done: 0, total: 1, state: 'todo',
            steps: [{ scenarioId: 'SCN-LD-00001', name: 'a', state: 'todo', kind: 'dlg' }],
          },
        ],
      },
    ],
  },
] as unknown as CurriculumBuilding[];

/** Every star drawn in the tree, as { color, fill }. */
function stars(root: ReactTestInstance): { color: string; fill?: string }[] {
  return root
    .findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === 'PixelIcon', { deep: true })
    .filter((n) => n.props.name === 'star')
    .map((n) => ({ color: n.props.color as string, fill: n.props.fill as string | undefined }));
}

/** The star's Pressable.
 *
 *  The COMPOSITE node, not the host View it renders: Pressable hands the host its
 *  responder props, so `onPress` only exists on the component. Reaching for the host is
 *  how a test ends up pressing nothing and reporting the component broken. */
function starButton(root: ReactTestInstance): ReactTestInstance {
  const btn = root.findAll(
    (n) => typeof n.type !== 'string' && typeof n.props?.onPress === 'function' && n.props?.accessibilityRole === 'switch',
    { deep: true }
  )[0];
  expect(btn).toBeDefined();
  return btn;
}

beforeEach(async () => {
  mockStore = {};
  await loadFavorites();
});

it('fills the star the moment it is tapped', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<FloorList buildings={BUILDINGS} onOpenFloor={() => {}} />);
  });

  expect(stars(tree.root)).toHaveLength(1);
  // Off: hollow. Not "a different outline colour" — that is the state that was reported
  // as no change at all, because at 17px it is a couple of pixels.
  expect(stars(tree.root)[0].fill).toBe('none');

  await act(async () => {
    await starButton(tree.root).props.onPress();
  });

  expect(stars(tree.root)[0].fill).toBe(colors.yellowDeep);
});

it('empties it again on a second tap', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<FloorList buildings={BUILDINGS} onOpenFloor={() => {}} />);
  });
  await act(async () => { await starButton(tree.root).props.onPress(); });
  await act(async () => { await starButton(tree.root).props.onPress(); });
  expect(stars(tree.root)[0].fill).toBe('none');
});

it('does not open the floor when the star is tapped', async () => {
  // The star sits inside the row's own Pressable. If the tap fell through, starring a
  // ward would also send you into it.
  const opened: string[] = [];
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<FloorList buildings={BUILDINGS} onOpenFloor={(f) => opened.push(f.floor)} />);
  });
  await act(async () => { await starButton(tree.root).props.onPress(); });
  expect(opened).toEqual([]);
});

describe('the building dropdown', () => {
  /** The clipping container: the only view with overflow hidden and an animated height. */
  function drawer(root: ReactTestInstance) {
    return root.findAll(
      (n) => typeof n.type === 'string' && n.props?.style?.overflow === 'hidden',
      { deep: true }
    )[0];
  }

  it('keeps a CLOSED building\'s floors mounted, and clips them', () => {
    // `isOpen && rows` attached and detached the rows, so the list changed height in one
    // frame and the rows arrived already in place — and the height was unknowable, which is
    // what an animation needs.
    //
    // Two buildings on purpose: only one is open, so a test with one building would find
    // its rows mounted either way and say nothing. That is exactly what the first version
    // of this test did.
    let tree!: ReturnType<typeof create>;
    act(() => {
      tree = create(<FloorList buildings={TWO} onOpenFloor={() => {}} />);
    });
    expect(drawer(tree.root)).toBeDefined();
    // One star per floor across BOTH buildings, including the collapsed one.
    expect(stars(tree.root)).toHaveLength(2);
  });

  it('animates the height on the JS driver, because height is a layout property', () => {
    const spring = jest.spyOn(Animated, 'timing').mockImplementation(
      ((v: Animated.Value, cfg: { toValue: number }) => ({
        start: (cb?: () => void) => {
          v.setValue(cfg.toValue);
          cb?.();
        },
        stop: () => {},
      })) as never
    );
    try {
      let tree!: ReturnType<typeof create>;
      act(() => {
        tree = create(<FloorList buildings={BUILDINGS} onOpenFloor={() => {}} />);
      });
      // Report a content height, then collapse the building.
      const inner = drawer(tree.root).children[0] as ReactTestInstance;
      act(() => {
        inner.props.onLayout({ nativeEvent: { layout: { height: 220, width: 320, x: 0, y: 0 } } });
      });
      const header = tree.root.findAll(
        (n) => typeof n.type !== 'string' && typeof n.props?.onPress === 'function' && n.props?.accessibilityRole === 'button',
        { deep: true }
      )[0];
      act(() => header.props.onPress());

      expect(spring.mock.calls.length).toBeGreaterThan(0);
      for (const [, cfg] of spring.mock.calls) {
        // The native driver cannot touch height, and mixing drivers on one view throws.
        expect((cfg as { useNativeDriver: boolean }).useNativeDriver).toBe(false);
        // Fast enough not to stand between a tap and the list.
        expect((cfg as { duration: number }).duration).toBeLessThanOrEqual(250);
      }
    } finally {
      spring.mockRestore();
    }
  });
});
