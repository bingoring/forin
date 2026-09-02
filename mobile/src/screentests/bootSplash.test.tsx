// The launch screen: the passport's cover, in the dark.
//
// It replaced a bare ActivityIndicator, which was the first thing anyone saw of the app
// and belonged to no product in particular — and which was on screen longest exactly
// when the wait mattered most, on a cold start.
//
// v30 replaced the pixel sky that stood in for it with the document's own cover, because
// the screen AFTER this one is now that cover too (the passport, whose first page is the
// sign-in). So what these tests watch changed with it: the emblem and the wordmark are on
// screen, in the cover's green and gold rather than the notebook's cream, and the two
// screens are ONE component so they cannot drift apart.
//
// jest-secure-store is stubbed because the tagline comes from the catalog now, and i18n
// reads the stored language choice at import.
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BootSplash } from '@/components/BootSplash';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
/** RN style props NEST, so a one-level flatten loses whatever is in the inner array. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

/** Every HOST node whose style matches. Host only: RN's View wraps a host view and both
 *  carry the style, so counting composites doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

/** Trees mounted by this file, torn down in afterEach. */
const mounted: ReturnType<typeof create>[] = [];

function mount(slow = false) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<BootSplash slow={slow} />); });
  mounted.push(tree);
  return tree;
}

// Every tree this file mounts gets torn down.
//
// Not hygiene — correctness of the SUITE. BottomSheet schedules its entry animation in
// a requestAnimationFrame, and jest's preset polyfills rAF with setTimeout. A tree left
// mounted keeps that timer alive past the end of the test, and when it finally fires
// jest has already torn down the module registry: `Animated.spring` is undefined and
// whichever unrelated test happens to be running gets the crash. Locally the ordering
// happened to be benign; CI caught it.
afterEach(() => {
  for (const tree of mounted.splice(0)) {
    act(() => { tree.unmount(); });
  }
});


test('the cover is on screen — emblem, wordmark, and the walking dots', () => {
  const tree = mount();
  expect(texts(tree.root)).toContain('FORIN');
  expect(texts(tree.root)).toContain('f');
  // Green ground and a gold emblem ring. A spinner on a flat background — what this
  // screen used to be — has neither, and so would fail here.
  expect(styled(tree.root, (s) => s.backgroundColor === '#2E4636').length).toBeGreaterThan(0);
  expect(styled(tree.root, (s) => s.borderColor === '#D4B46A' && s.borderRadius === 54).length).toBe(1);
  // Three dots, which are what say the app is working rather than stuck.
  expect(styled(tree.root, (s) => s.backgroundColor === '#D4B46A' && s.borderRadius === 4).length).toBe(3);
});

test('the launch screen and the onboarding splash are the same component', () => {
  // Not a style check — a continuity one. They are the same cover, and two copies of a
  // drawing drift the moment either is touched.
  const src = readFileSync(join(__dirname, '..', 'app', '(onboarding)', 'splash.tsx'), 'utf8');
  expect(src).toMatch(/<BootSplash \/>/);
});

test('the wait is silent until it is long enough to wonder about', () => {
  // A warm launch is over in well under the slow threshold; telling that learner the
  // server is waking up would be noise, and untrue.
  expect(texts(mount(false).root).some((x) => x.includes('서버를 깨우고'))).toBe(false);
  expect(texts(mount(true).root).some((x) => x.includes('서버를 깨우고'))).toBe(true);
});

test('it says what is happening, not "loading"', () => {
  const out = texts(mount(true).root).join(' ');
  // The server scales to zero, so the first launch after an idle period genuinely is
  // waking something up. "로딩중" describes the spinner, not the situation.
  expect(out).not.toMatch(/로딩/);
});

test('the root layout shows it while booting, not a spinner', () => {
  const src = readFileSync(join(__dirname, '..', 'app', '_layout.tsx'), 'utf8');
  expect(src).toMatch(/return <BootSplash slow=\{slow\} \/>;/);
  // The old gate. Its absence is the point — a render test on _layout would need the
  // whole boot sequence mocked to observe the same thing.
  expect(src).not.toMatch(/ActivityIndicator/);
  // The slow flag has to be cancelled when boot finishes, or a fast launch flashes the
  // "waking the server" line onto whatever screen came next.
  expect(src).toMatch(/clearTimeout\(slowTimer\)/);
});

test('the native splash background matches the frame it hands over to', () => {
  // The OS splash is a static PNG on a flat colour; if that colour differs from the first
  // JS frame, launch flashes. It did, for exactly as long as this test compared against
  // the peach sky the screen no longer draws — so it is read from the cover token both
  // sides now.
  const appJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'app.json'), 'utf8'));
  const plugin = (appJson.expo.plugins as unknown[]).find(
    (p) => Array.isArray(p) && p[0] === 'expo-splash-screen',
  ) as [string, { backgroundColor: string }];
  const nbTokens = readFileSync(join(__dirname, '..', 'theme', 'nb.ts'), 'utf8');
  const green = /green:\s*'(#2E[^']+)'/.exec(nbTokens)?.[1];
  expect(green).toBeTruthy();
  expect(plugin[1].backgroundColor.toUpperCase()).toBe(green!.toUpperCase());
});
