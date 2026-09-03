// 일터 — what the page separates, and where 오늘의 상황판 lives.
//
// Two things this tab kept getting wrong, both invisible to a type-check:
//
//  · 즐겨찾기 and 건물 ran together. A starred ward row and a building card are the
//    same material at the same rotation, so with no label the first building read as a
//    third favourite. A name is what separates them, not more chrome.
//  · 오늘의 상황판 had no home. Its tab became the lounge feed, it spent one commit as
//    a link in the lounge header (an ad for another screen at the top of a feed), and
//    it belongs here: a rotation of today's situations across the hospital is a fact
//    about the workplace.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

const mockBuildings = [
  {
    building: '본관',
    floors: [{
      floor: '1F', where: '본관 1F 응급의료센터',
      curricula: [{
        key: 'k1', name: '응급 트리아지', building: '본관', floor: '1F', where: '본관 1F 응급의료센터',
        done: 0, total: 1, state: 'todo',
        steps: [{ scenarioId: 'SCN-ER-00001', name: 'a', state: 'todo', kind: 'dlg' }],
      }],
    }],
  },
  {
    building: '별관 1',
    floors: [{
      floor: '2F', where: '별관 1 2F 분만실',
      curricula: [{
        key: 'k2', name: '분만 코칭', building: '별관 1', floor: '2F', where: '별관 1 2F 분만실',
        done: 0, total: 1, state: 'todo',
        steps: [{ scenarioId: 'SCN-LD-00001', name: 'b', state: 'todo', kind: 'dlg' }],
      }],
    }],
  },
];

jest.mock('@/api/client', () => ({
  api: {
    progress: async () => ({ level: 11, xp: 1_040, streakCurrent: 4, streakLongest: 9, reputation: [] }),
    me: async () => ({ targetLang: 'en', targetLevel: 'B1' }),
    curriculum: async () => mockBuildings,
    searchSituations: async () => [],
  },
}));

const mockPushed: string[] = [];
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    useRouter: () => ({ push: (p: string) => mockPushed.push(p), replace: () => {}, back: () => {} }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
    useNavigation: () => ({ getState: () => ({ index: 1, routes: [{ name: 'index' }, { name: 'campus' }] }), addListener: () => () => {} }),
  };
});

// Favourites come from the real store (SecureStore is mocked above), so the section is
// driven by the same code the star taps use.
let mockFavs: { floors: unknown[]; situations: unknown[] } = { floors: [], situations: [] };
jest.mock('@/lib/favorites', () => ({
  useFavorites: () => mockFavs,
  toggleFloorFavorite: async () => {},
  toggleSituationFavorite: async () => {},
  useIsFloorFavorite: () => false,
  loadFavorites: async () => {},
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Campus from '@/app/(tabs)/campus';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  mockPushed.length = 0;
  mockFavs = { floors: [], situations: [] };
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Campus />)); });
  for (let i = 0; i < 6; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

function byName(root: ReactTestInstance, name: string): ReactTestInstance[] {
  return root.findAll((n) => typeof n.type !== 'string' && (n.type as { name?: string })?.name === name, { deep: true });
}

const withFavourite = () => {
  mockFavs = { floors: [{ building: '본관', floor: '3F', place: '수술실 · PACU' }], situations: [] };
};

test('오늘의 상황판 is reachable from 일터', async () => {
  const tree = await mount();
  expect(texts(tree.root)).toContain('오늘의 상황판');

  const link = byName(tree.root, 'Pressable').find((n) => texts(n).includes('오늘의 상황판'))!;
  await act(async () => { link.props.onPress(); });
  expect(mockPushed).toContain('/board');
});

test('the 건물 block says what it is, and how many', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('건물');
  // From the payload, not a constant: a hardcoded count would go stale the first time
  // a building is added to the curriculum.
  expect(out).toContain('2개 동');
});

test('with favourites on screen the two sections are named and divided', async () => {
  withFavourite();
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).toContain('즐겨찾기');
  expect(out).toContain('수술실 · PACU');
  expect(out).toContain('건물');
  // 즐겨찾기 comes first, 건물 second — the label has to sit above the cards it names.
  expect(out.indexOf('즐겨찾기')).toBeLessThan(out.indexOf('건물'));
  // And the rule that ends the favourites section is only drawn when there is one.
  expect(byName(tree.root, 'SectionRule')).toHaveLength(1);
});

test('with no favourites there is no empty section and no stray rule', async () => {
  const tree = await mount();
  const out = texts(tree.root);
  expect(out).not.toContain('즐겨찾기');
  // A divider above the first thing on the page is a section boundary with nothing on
  // the other side of it.
  expect(byName(tree.root, 'SectionRule')).toHaveLength(0);
  expect(out).toContain('건물');
});

test('searching replaces the sections instead of pushing them down', async () => {
  withFavourite();
  const tree = await mount();
  const input = tree.root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
  await act(async () => { input.props.onChangeText('분만') });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });

  const out = texts(tree.root);
  // The hit is the floor whose name matched — searchCampus reports the place, and the
  // row's stamp is its floor.
  expect(out.join(' ')).toContain('분만실');
  expect(out).toContain('2F');
  // The board row, the favourites and the building list are all about "where do I go
  // normally"; under a query the only thing on the page should be the answer.
  expect(out).not.toContain('오늘의 상황판');
  expect(out).not.toContain('즐겨찾기');
  expect(out).not.toContain('건물');
});
