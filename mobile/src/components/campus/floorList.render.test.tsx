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
