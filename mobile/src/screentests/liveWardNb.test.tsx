// 라이브 병동 (notebook line, 핸드오프 v37) — the three moods, and that the learner walks it.
//
// The mood comes from the DEVICE clock (data/wardMood), the same source the shift badge
// reads. The figures are NbCharacter, and the FLOOR width — which decides their lanes — is
// only known after layout, so these tests fire onLayout by hand (react-test-renderer never
// lays out) before looking for the walkers.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t, step0: (t: number) => t, linear: (t: number) => t },
  };
});
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { LiveWardNb } from '@/components/home/LiveWardNb';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

const at = (h: number) => () => new Date(2026, 7, 28, h, 30, 0);

const mounted: ReturnType<typeof create>[] = [];
function mount(props: Parameters<typeof LiveWardNb>[0] = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<LiveWardNb {...props} />); });
  // The room's onLayout hands the lanes a width; without it no figure mounts.
  act(() => {
    const room = tree.root.findAll((n) => typeof n.props?.onLayout === 'function', { deep: true })[0];
    room?.props.onLayout({ nativeEvent: { layout: { width: 300, height: 78 } } });
  });
  mounted.push(tree);
  return tree;
}
afterEach(() => { for (const tree of mounted.splice(0)) act(() => { tree.unmount(); }); });

function svgCount(tree: ReturnType<typeof create>): number {
  return tree.root.findAll((n) => String(n.type) === 'RNSVGSvgView', { deep: true }).length;
}

test('각 근무가 자기 하늘을 그리고, 무엇이 바뀌는지 말한다', () => {
  expect(texts(mount({ now: at(10) }).root).join(' ')).toContain('DAY');
  expect(texts(mount({ now: at(18) }).root).join(' ')).toContain('EVENING');
  expect(texts(mount({ now: at(2) }).root).join(' ')).toContain('NIGHT');
  // The bar under the ward is the reason the mood matters — it names what today is likelier.
  expect(texts(mount({ now: at(18) }).root).join(' ')).toContain('SBAR');
});

test('내 캐릭터가 병동을 순회한다', () => {
  // Even with no roster and no chosen avatar, self is always on the floor (a default face).
  expect(svgCount(mount({ now: at(10) }))).toBeGreaterThan(0);
});

test('로스터가 오면 그만큼 더 걷는다(자기 + 로스터)', () => {
  const solo = svgCount(mount({ now: at(10) }));
  const withRoster = svgCount(mount({
    now: at(10),
    roster: [
      { id: 'a', avatar: { skin: 'tan', outfitColor: 'navy' } as never },
      { id: 'b', avatar: { skin: 'deep', outfitColor: 'rose' } as never },
    ],
  }));
  expect(withRoster).toBeGreaterThan(solo);
});
