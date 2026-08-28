// The colleague screen must survive a response that omits `relation`.
//
// Lives here, NOT beside the screen it tests, and that is not a style choice:
// expo-router bundles every .ts/.tsx under the app root as a route
// (expo-router/_ctx.js matches `.*\.[tj]sx?$`, excluding only +api/+html/
// +middleware). A test file inside src/app therefore ships in the app bundle,
// and its top-level jest.mock calls crash the app on launch with
// "Property 'jest' doesn't exist" — before any screen renders. Tests that must
// import a route belong outside src/app; routeHygiene.test.ts enforces it.
//
// This is the crash: the detail endpoint built its JSON as a map and never set `relation`,
// while the client's type declared it as always present. The label helper did
// `rel[0].toUpperCase()`, which throws on undefined — before anything rendered, so the
// screen did not fail gracefully, the app went down.
//
// Both halves are fixed: the server sends it now, and the type is optional so the compiler
// points at anyone who assumes otherwise. This test is the third: a value that crossed a
// network is not guaranteed by a type, and the screen has to hold either way.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));
// useFocusEffect RUNS. Mocking it as a no-op is why this crash could not be reproduced
// for several rounds: the screen mounted, never loaded, and rendered its loading state —
// so every "it renders fine" was a test of the spinner.
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
    useLocalSearchParams: () => ({ id: 'c1' }),
    useNavigation: () => ({ getState: () => ({ index: 0, routes: [{ name: 'x' }] }), addListener: () => () => {} }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

// Exactly what the endpoint used to send: no `relation` anywhere in it.
jest.mock('@/api/client', () => ({
  api: {
    colleague: async () => ({
      id: 'c1',
      name: '김민아',
      targetLevel: 'B1',
      destination: 'us',
      level: 4,
      streak: 3,
      activeDates: ['2026-08-23'],
      cheers: [],
    }),
  },
}));

import { act, create } from 'react-test-renderer';
import ColleagueDetail from '@/app/colleagues/[id]';
import { RelTag } from '@/app/colleagues/index';

/** Trees mounted by this file, torn down in afterEach.
 *
 *  A tree left mounted keeps whatever it scheduled alive past the end of the test — the
 *  screen it renders has timers and animations — and when those fire jest has already
 *  torn the module registry down, so an UNRELATED suite takes the crash. This file was
 *  caught doing exactly that: a full run went red with a failure reported here that did
 *  not reproduce when the file ran on its own. */
const mountedTrees: ReturnType<typeof create>[] = [];
afterEach(() => {
  for (const tree of mountedTrees.splice(0)) act(() => { tree.unmount(); });
});

it('renders a colleague whose relation the server did not send', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<ColleagueDetail />);
    mountedTrees.push(tree);
  });
  expect(tree.toJSON()).toBeTruthy();
  // The name still shows — the screen degrades by omitting the relation, not by failing.
  // Collected from the rendered tree rather than from props: Text children arrive nested
  // and as arrays, and reading props.children found nothing while the screen was fine.
  const text = (node: unknown): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(text).join('');
    if (node && typeof node === 'object') return text((node as { children?: unknown }).children);
    return '';
  };
  expect(text(tree.toJSON())).toContain('김민아');
});

it('the relation tag renders nothing rather than inventing "peer"', async () => {
  // Falling back to peer would state a relationship the server never claimed.
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<RelTag relation={undefined} />);
    mountedTrees.push(tree);
  });
  expect(tree.toJSON()).toBeNull();
});
