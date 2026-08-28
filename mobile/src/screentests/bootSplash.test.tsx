// The launch screen: forin's plane bobbing in a pixel sky, with clouds.
//
// It replaced a bare ActivityIndicator, which was the first thing anyone saw of the app
// and belonged to no product in particular — and which was on screen longest exactly
// when the wait mattered most, on a cold start.
// reanimated is stubbed rather than shimmed at the worklets layer: the art uses
// withRepeat/withTiming, which pull in the whole serialization machinery at import
// time, and none of it is what these tests are about. They check that the pixel art
// renders — the bobbing is verified by looking at the app.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    withRepeat: (v: unknown) => v,
    withTiming: (v: unknown) => v,
  };
});

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BootSplash } from '@/components/BootSplash';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
/** Rect count is a decent proxy for "the pixel art is actually here" — both the plane
 *  and the clouds are drawn as rows of Rects. */
const rects = (root: ReactTestInstance) => root.findAll((n) => String(n.type) === 'RNSVGRect', { deep: true }).length;

function mount(slow = false) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<BootSplash slow={slow} />); });
  return tree;
}

test('the plane and the clouds are on screen', () => {
  const tree = mount();
  expect(texts(tree.root)).toContain('forin');
  // A spinner would render no Rects at all. This is the assertion that would have
  // failed for the whole life of the previous splash.
  expect(rects(tree.root)).toBeGreaterThan(30);
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

test('the native splash background matches the sky it hands over to', () => {
  // The OS splash is a static PNG on a flat colour; if that colour differs from the
  // first JS frame, launch flashes. Same token, both sides.
  const appJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'app.json'), 'utf8'));
  const plugin = (appJson.expo.plugins as unknown[]).find(
    (p) => Array.isArray(p) && p[0] === 'expo-splash-screen',
  ) as [string, { backgroundColor: string }];
  const tokens = readFileSync(join(__dirname, '..', 'theme', 'tokens.ts'), 'utf8');
  const peach = /peach:\s*'([^']+)'/.exec(tokens)?.[1];
  expect(plugin[1].backgroundColor.toUpperCase()).toBe(peach?.toUpperCase());
});
