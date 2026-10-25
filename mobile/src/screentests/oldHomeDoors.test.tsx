// The old home's doors, rehoused (handoff v48 · home-calendar-v47 F2·F3).
//
// v47 took them off the home; without a new door each of these screens would simply be
// unreachable. So the tests are about the doors existing and going where they say.
//  · 리뷰랩 자료 선반 — 인계 노트(→ /handoff, badge = unread) · 슬랭(→ /slang, badge = today's
//    card not yet collected); no badge at zero; a failed count is no badge, not no shelf
//  · 라운지 휴게실 → /games, the two real games only and no invented rank (결정 4)
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
const mockNav: string[] = [];
const mockApi: { unread: number; collectable: boolean; fail?: boolean } = { unread: 2, collectable: true };
jest.mock('@/api/client', () => ({
  api: {
    handoff: async () => { if (mockApi.fail) throw new Error('x'); return { notes: [], unread: mockApi.unread }; },
    slang: async () => { if (mockApi.fail) throw new Error('x'); return { collectableToday: mockApi.collectable, collectedCount: 0, total: 205, masterAt: 100, master: false, collected: [] }; },
  },
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    useRouter: () => ({ push: (p: string) => { mockNav.push(String(p)); } }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { MaterialShelf } from '@/components/lab/MaterialShelf';
import { RestRoomCard } from '@/components/lounge/RestRoomCard';
import { trackMounts } from '@/testing/mountRegistry';

// The shelf's NewDot wiggles once on mount (v49, .4s delay): a tree left mounted fires that
// native-driver animation after this file's module registry is gone, and it crashed an
// unrelated suite on master CI (guidedTarget, `findNodeHandle` of undefined).
const track = trackMounts();

const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id);
const has = (root: ReactTestInstance, id: string) => byID(root, id).length > 0;
const texts = (root: ReactTestInstance) => root.findAll((n) => String(n.type) === 'Text', { deep: true })
  .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));

async function draw(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(el)); });
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  return tree;
}

beforeEach(() => { mockNav.length = 0; mockApi.unread = 2; mockApi.collectable = true; mockApi.fail = false; });

test('the shelf counts what is new on each tile, and opens it', async () => {
  const tree = await draw(<MaterialShelf />);
  expect(texts(byID(tree.root, 'lab-shelf-handoff-badge')[0])).toContain('2');
  expect(texts(byID(tree.root, 'lab-shelf-slang-badge')[0])).toContain('1');
  await act(async () => { byID(tree.root, 'lab-shelf-handoff')[0].props.onPress(); });
  await act(async () => { byID(tree.root, 'lab-shelf-slang')[0].props.onPress(); });
  expect(mockNav).toEqual(['/handoff', '/slang']);
});

test('nothing new draws no badge', async () => {
  mockApi.unread = 0; mockApi.collectable = false;
  const tree = await draw(<MaterialShelf />);
  expect(has(tree.root, 'lab-shelf-handoff-badge')).toBe(false);
  expect(has(tree.root, 'lab-shelf-slang-badge')).toBe(false);
});

test('a failed count is no badge — the doors stay', async () => {
  mockApi.fail = true;
  const tree = await draw(<MaterialShelf />);
  expect(has(tree.root, 'lab-shelf-handoff')).toBe(true);
  expect(has(tree.root, 'lab-shelf-slang')).toBe(true);
  expect(has(tree.root, 'lab-shelf-handoff-badge')).toBe(false);
});

test('the break room opens the games, with the real games only and no rank', async () => {
  const tree = await draw(<RestRoomCard />);
  const icons = tree.root.findAll((n) => typeof n.type === 'function' && typeof n.props?.name === 'string' && n.props?.size === 17)
    .map((n) => n.props.name);
  expect([...new Set(icons)]).toEqual(['compass', 'trophy']);
  expect(texts(tree.root).join(' ')).not.toMatch(/#\d/);
  await act(async () => { byID(tree.root, 'lounge-restroom')[0].props.onPress(); });
  expect(mockNav).toEqual(['/games']);
});
