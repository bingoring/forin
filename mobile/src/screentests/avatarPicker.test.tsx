// 초상화 만들기 (핸드오프 v32).
//
// The picker's whole job is that the face on screen is the face that gets saved.
// What can break, and therefore what renders here:
//
//  · A cell that previews a DIFFERENT axis than the one it changes — every cell wears
//    the learner's own current face with exactly one key swapped, and getting that
//    wrong makes the grid unreadable rather than throwing.
//  · Saving a face the learner did not choose (a stale draft, or the whole default
//    instead of the edit).
//  · Auto-saving on tap. Ten axes deep, a stray tap on 배경 would be permanent, and
//    주사위 would overwrite a face somebody built.
//  · A failed write reported as success — the learner then walks away believing the
//    server has this face.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

const mockSaved: Record<string, string>[] = [];
let mockFail = false;
jest.mock('@/api/client', () => ({
  api: {
    setAvatar: async (spec: Record<string, string>) => {
      if (mockFail) throw new Error('offline');
      mockSaved.push(spec);
      return spec;
    },
  },
}));

let mockBack = 0;
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => { mockBack += 1; } }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import AvatarPicker from '@/app/avatar/index';
import { AVATAR_AXES, DEFAULT_AVATAR_SPEC } from '@/data/nbAvatar';
import { adoptAvatar, clearAvatar, myAvatar } from '@/lib/nbAvatar';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  mockSaved.length = 0;
  mockFail = false;
  mockBack = 0;
  clearAvatar();
  // A learner who chose a face already: 'bob' hair, so a change is visible.
  adoptAvatar('user-1', { ...DEFAULT_AVATAR_SPEC, hair: 'bob', skin: 'olive' });
});

afterEach(() => { clearAvatar(); });

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<AvatarPicker />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** The pinned preview is the FIRST NbAvatar on the page; the rest are cells. */
const preview = (tree: ReturnType<typeof create>) => byName(tree.root, 'NbAvatar')[0];
const cells = (tree: ReturnType<typeof create>) => byName(tree.root, 'NbAvatar').slice(1);
const tab = (tree: ReturnType<typeof create>, i: number) =>
  act(() => { byName(tree.root, 'NbIndexTabs')[0].props.onSelect(i); });
const button = (tree: ReturnType<typeof create>, icon: string) =>
  byName(tree.root, 'NbButton').find((n) => n.props.icon === icon)!;

/**
 * The cell for one key, found by what it PREVIEWS rather than by position.
 *
 * Indexing into the page's Pressables was wrong twice over: the back chip is one, and
 * every NbButton renders one — so `Pressable[i + 1]` tapped the 주사위 button and the
 * assertion failed for a reason that had nothing to do with the code under test.
 */
function cellFor(tree: ReturnType<typeof create>, axisKey: string, key: string): ReactTestInstance {
  const cell = byName(tree.root, 'Pressable').find((p) => {
    const inner = byName(p, 'NbAvatar');
    return inner.length === 1 && (inner[0].props.spec as Record<string, string>)?.[axisKey] === key;
  });
  if (!cell) throw new Error(`no cell previews ${axisKey}=${key}`);
  return cell;
}

test('the picker opens on the learner’s stored face', async () => {
  const tree = await mount();
  expect(preview(tree).props.spec).toMatchObject({ hair: 'bob', skin: 'olive' });
});

test('every cell previews its own key on the learner’s face', async () => {
  const tree = await mount();
  await tab(tree, AVATAR_AXES.findIndex((a) => a.key === 'hair'));

  const specs = cells(tree).map((n) => n.props.spec as Record<string, string>);
  expect(specs.length).toBe(AVATAR_AXES.find((a) => a.key === 'hair')!.options.length);
  // Each cell differs from its neighbours ONLY in the axis being edited: the skin the
  // learner picked is worn by every one of them, or the grid is a lineup of strangers.
  expect(specs.map((s) => s.hair)).toEqual([...AVATAR_AXES.find((a) => a.key === 'hair')!.options]);
  for (const s of specs) expect(s.skin).toBe('olive');
});

test('tapping a cell changes the preview and nothing else', async () => {
  const tree = await mount();
  await tab(tree, AVATAR_AXES.findIndex((a) => a.key === 'eyes'));
  await act(async () => { cellFor(tree, 'eyes', 'wink').props.onPress(); });

  const spec = preview(tree).props.spec as Record<string, string>;
  expect(spec.eyes).toBe('wink');
  expect(spec.hair).toBe('bob');   // the axis they were not on
  expect(spec.skin).toBe('olive');
});

test('a tap does not save — 저장 does', async () => {
  const tree = await mount();
  await tab(tree, AVATAR_AXES.findIndex((a) => a.key === 'bg'));
  await act(async () => { cellFor(tree, 'bg', 'stamps').props.onPress(); });

  // Ten axes deep, an auto-save makes a stray tap permanent.
  expect(mockSaved).toHaveLength(0);
  expect(myAvatar()).toMatchObject({ hair: 'bob', bg: DEFAULT_AVATAR_SPEC.bg });
  expect(preview(tree).props.spec).toMatchObject({ bg: 'stamps' });

  await act(async () => { button(tree, 'check').props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(mockSaved).toHaveLength(1);
  expect(mockBack).toBe(1);
});

test('what is saved is the face on screen', async () => {
  const tree = await mount();
  await tab(tree, AVATAR_AXES.findIndex((a) => a.key === 'outfit'));
  await act(async () => { cellFor(tree, 'outfit', 'labCoat').props.onPress(); });

  const shown = preview(tree).props.spec as Record<string, string>;
  await act(async () => { button(tree, 'check').props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(mockSaved[0]).toEqual(shown);
  expect(mockSaved[0].outfit).toBe('labCoat');
  expect(mockSaved[0].hair).toBe('bob');
});

test('주사위 changes the whole face, and still needs saving', async () => {
  const tree = await mount();
  const before = JSON.stringify(preview(tree).props.spec);
  await act(async () => { button(tree, 'star').props.onPress(); });

  expect(JSON.stringify(preview(tree).props.spec)).not.toBe(before);
  expect(mockSaved).toHaveLength(0);
});

test('저장 is dead until something changes', async () => {
  const tree = await mount();
  expect(button(tree, 'check').props.disabled).toBe(true);

  await act(async () => { button(tree, 'star').props.onPress(); });
  expect(button(tree, 'check').props.disabled).toBe(false);
});

test('a failed save says so and stays on the screen', async () => {
  mockFail = true;
  const tree = await mount();
  await act(async () => { button(tree, 'star').props.onPress(); });
  await act(async () => { button(tree, 'check').props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(texts(tree.root).join(' ')).toContain('저장하지 못했어요');
  // Leaving would tell the learner the server has this face.
  expect(mockBack).toBe(0);
});

test('a learner who never chose a face is told theirs was rolled', async () => {
  clearAvatar();
  adoptAvatar('user-2', null);
  const tree = await mount();
  const out = texts(tree.root).join(' ');
  expect(out).toContain('처음 얼굴은 무작위로 골라뒀어요');
  // …and it is a real face, not the default one dressed up as a choice.
  expect(preview(tree).props.spec).toBeTruthy();
});
