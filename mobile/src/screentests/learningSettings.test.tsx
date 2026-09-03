// 학습 설정 — the answers onboarding asked for, changeable (Build Spec learning-tracks P1).
//
// Until this screen existed there was no path at all: PATCH /me/profile has always
// accepted job / destination / level, and nothing after onboarding called it. What can
// go wrong here is specific:
//
//  · Offering a job or a country with no authored content behind it — onboarding
//    refuses those, and a settings screen that does not would commit somebody to a
//    hospital that does not exist.
//  · Saving a partial profile. The write is an UPSERT with onboarding defaults for
//    anything omitted, so a patch that forgets targetLang silently resets it.
//  · Saving on tap, or losing the draft on the way back from somewhere.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

const mockSaved: Record<string, unknown>[] = [];
let mockFail = false;
let mockProfile: Record<string, string> = { job: 'nurse', destination: 'us', targetLevel: 'B1', targetLang: 'en' };
jest.mock('@/api/client', () => ({
  api: {
    me: async () => ({ profile: mockProfile }),
    updateProfile: async (body: Record<string, unknown>) => {
      if (mockFail) throw new Error('offline');
      mockSaved.push(body);
      return { onboarded: true };
    },
  },
}));

// Only the US has authored content, which is what the server reports today.
jest.mock('@/data/destinations', () => ({ isDestinationReady: (c: string) => c === 'us' }));

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
import LearningSettings from '@/app/settings/learning';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

beforeEach(() => {
  mockSaved.length = 0;
  mockFail = false;
  mockBack = 0;
  mockProfile = { job: 'nurse', destination: 'us', targetLevel: 'B1', targetLang: 'en' };
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<LearningSettings />)); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
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

/** The row whose subtree carries this label. */
function row(root: ReactTestInstance, label: string): ReactTestInstance {
  const hits = byName(root, 'Row').filter((n) => texts(n).some((x) => x.includes(label)));
  expect(hits.length).toBe(1);
  return hits[0];
}

const save = (tree: ReturnType<typeof create>) =>
  byName(tree.root, 'NbButton').find((n) => n.props.icon === 'check')!;

test('it opens on what the profile actually says', async () => {
  mockProfile = { job: 'nurse', destination: 'us', targetLevel: 'B2', targetLang: 'en' };
  const tree = await mount();
  // The chosen rows are the ones the server holds, not the first of each list.
  expect(row(tree.root, '간호사').props.on).toBe(true);
  expect(row(tree.root, '미국').props.on).toBe(true);
  expect(row(tree.root, '일상 대화 OK').props.on).toBe(true);
  expect(row(tree.root, '더듬더듬').props.on).toBe(false);
});

test('nothing without content behind it can be chosen', async () => {
  const tree = await mount();
  // Onboarding refuses these; a settings screen that accepted them would commit
  // somebody to a hospital that does not exist yet.
  for (const label of ['호텔리어', '엔지니어', '호주', '캐나다', '영국']) {
    expect(row(tree.root, label).props.soon).toBe(true);
  }
  expect(row(tree.root, '간호사').props.soon).toBe(false);
  expect(row(tree.root, '미국').props.soon).toBe(false);
});

test('a tap changes the draft and nothing is saved until 저장', async () => {
  const tree = await mount();
  expect(save(tree).props.disabled).toBe(true);   // nothing has changed yet

  await act(async () => { row(tree.root, '일상 대화 OK').props.onPress(); });
  expect(row(tree.root, '일상 대화 OK').props.on).toBe(true);
  expect(mockSaved).toHaveLength(0);
  expect(save(tree).props.disabled).toBe(false);
});

test('the whole profile is written, not only what moved', async () => {
  const tree = await mount();
  await act(async () => { row(tree.root, '일상 대화 OK').props.onPress(); });
  await act(async () => { save(tree).props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  // PATCH /me/profile is an UPSERT that fills omitted columns with onboarding
  // defaults, so a partial body silently resets the fields it left out.
  expect(mockSaved).toEqual([{ job: 'nurse', destination: 'us', targetLevel: 'B2', targetLang: 'en' }]);
  expect(mockBack).toBe(1);
});

test('a failed save says so and stays on the screen', async () => {
  mockFail = true;
  const tree = await mount();
  await act(async () => { row(tree.root, '일상 대화 OK').props.onPress(); });
  await act(async () => { save(tree).props.onPress(); });
  await act(async () => { await Promise.resolve(); });

  expect(texts(tree.root).join(' ')).toContain('저장하지 못했어요');
  expect(mockBack).toBe(0);
});

test('it says what happens to the progress already earned', async () => {
  const tree = await mount();
  // Before the tap, not after: what happens to three weeks of work is the thing
  // somebody wants to know BEFORE they change their subject. The sentence is only
  // true until tracks land (P2), and it has to change in that same commit.
  expect(texts(tree.root).join(' ')).toContain('그대로 이어져요');
});
