// ThemeList — 일터 탭 1단계 (P3-C, build-spec-index.md §5·§8).
//
// @testing-library/react-native is not installed in this repo — react-test-renderer
// throughout, same convention as CurrentStationBar.test.tsx/Station.test.tsx.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Pressable, Text } from 'react-native';
import Svg from 'react-native-svg';
import { groupByTrack, ThemeList } from './ThemeList';
import { PathSegment } from './PathSegment';
import type { JourneyCurriculum } from './JourneyMap';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

// react-test-renderer's `findAllByType(Pressable)` compares by reference, and this
// jest environment loads two distinct instances of the `Pressable` export (the same
// module-registry quirk CurrentStationBar.test.tsx documents). Matching by name is
// what actually finds the node here.
function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function card(root: ReactTestInstance, themeKey: string) {
  return root.findAll((n) => typeof n.type === 'function'
    && (n.type as { name?: string }).name === 'Pressable'
    && n.props?.testID === `theme-card-${themeKey}`)[0];
}

function curriculum(overrides: Partial<JourneyCurriculum>): JourneyCurriculum {
  return {
    themeKey: 't', name: '주제', state: 'open', track: 'core', done: 0, total: 4, resume: false,
    ...overrides,
  } as JourneyCurriculum;
}

describe('groupByTrack', () => {
  it('buckets track === "core" into core and everything else into depth', () => {
    const items = [
      curriculum({ themeKey: 'a', track: 'core' }),
      curriculum({ themeKey: 'b', track: 'depth' }),
      // a value the app has no content for yet (business-rules.md: collab is 0
      // items today) must still land somewhere — "core가 아니면 심화".
      curriculum({ themeKey: 'c', track: 'collab' as unknown as string }),
      curriculum({ themeKey: 'd', track: undefined }),
    ];
    const { core, depth } = groupByTrack(items);
    expect(core.map((c) => c.themeKey)).toEqual(['a']);
    expect(depth.map((c) => c.themeKey)).toEqual(['b', 'c', 'd']);
  });
});

describe('ThemeList', () => {
  // §8: 1단계에 주제 35개 → 두 묶음으로 나뉘고, 주제 사이를 잇는 선이 하나도 없다.
  it('splits 35 topics into exactly two bundles and draws no line between any of them', () => {
    const core = Array.from({ length: 20 }, (_, i) => curriculum({ themeKey: `core-${i}`, name: `코어 ${i}`, track: 'core' }));
    const depth = Array.from({ length: 15 }, (_, i) => curriculum({ themeKey: `depth-${i}`, name: `심화 ${i}`, track: 'depth' }));
    const curricula = [...core, ...depth];
    expect(curricula).toHaveLength(35);

    const tree = mount(<ThemeList curricula={curricula} onPress={jest.fn()} />);

    // Two bundle labels, no more — the section headers are the only grouping signal.
    const rendered = texts(tree.root);
    expect(rendered).toContain('공통 코어');
    expect(rendered).toContain('심화');

    // One card per topic.
    expect(findAllPressables(tree.root)).toHaveLength(35);

    // K1: 길을 그리지 않는다 — no Svg, no PathSegment anywhere in this screen's tree.
    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
    expect(tree.root.findAllByType(PathSegment)).toHaveLength(0);
  });

  // §8: resume가 참인 주제 → 정확히 하나만 권유 표시를 받는다 (K2).
  it('marks exactly one card as the recommended one when the server flags exactly one resume', () => {
    const curricula = [
      curriculum({ themeKey: 'a', track: 'core', resume: false }),
      curriculum({ themeKey: 'b', track: 'core', resume: true }),
      curriculum({ themeKey: 'c', track: 'depth', resume: false }),
    ];
    const tree = mount(<ThemeList curricula={curricula} onPress={jest.fn()} />);
    expect(texts(tree.root).filter((s) => s === '이어하기')).toHaveLength(1);
    // It has to be attached to the flagged card, not any other.
    const badges = tree.root.findAll((n) => n.props?.testID === 'theme-resume-badge');
    // (composite View + host node both carry the testID — count host only to avoid
    // doubling, same trap CurrentStationBar.test.tsx's `styled` helper documents.)
    const hostBadges = badges.filter((n) => typeof n.type === 'string');
    expect(hostBadges).toHaveLength(1);
  });

  // §8: resume가 없는 트랙(전부 통과) → 권유 표시가 0개. 지어내지 않는다.
  it('shows zero recommendation badges when the track has no resume flag at all', () => {
    const curricula = [
      curriculum({ themeKey: 'a', track: 'core', state: 'passed', resume: false }),
      curriculum({ themeKey: 'b', track: 'depth', state: 'passed', resume: false }),
    ];
    const tree = mount(<ThemeList curricula={curricula} onPress={jest.fn()} />);
    expect(texts(tree.root).filter((s) => s === '이어하기')).toHaveLength(0);
  });

  // §8: 아직 안 간 주제 카드 탭 → 2단계로 이동한다(잠기지 않는다). J1: disabled가 참이면
  // 안 된다 — `.props.onPress()`를 직접 부르는 것만으로는 disabled를 우회해 버리므로
  // disabled 자체도 직접 들여다본다.
  it('presses a not-yet-visited (far/open, non-resume) card — never disabled', () => {
    const onPress = jest.fn();
    const curricula = [
      curriculum({ themeKey: 'untouched', name: '아직 안 간 주제', track: 'depth', state: 'open', resume: false }),
    ];
    const tree = mount(<ThemeList curricula={curricula} onPress={onPress} />);
    const pressable = card(tree.root, 'untouched');
    expect(pressable.props.disabled).not.toBe(true);
    act(() => { pressable.props.onPress(); });
    expect(onPress).toHaveBeenCalledWith('untouched');
  });

  // §8: 카드를 누르면 그 주제 키로 2단계 경로를 민다 — ThemeList's own contract is just
  // "call onPress with this card's themeKey"; journeyScreen.test.tsx locks the actual
  // router.push wiring on top of this.
  it('calls onPress with the tapped card’s own themeKey, not another', () => {
    const onPress = jest.fn();
    const curricula = [
      curriculum({ themeKey: 'a', name: 'A', track: 'core' }),
      curriculum({ themeKey: 'b', name: 'B', track: 'depth' }),
    ];
    const tree = mount(<ThemeList curricula={curricula} onPress={onPress} />);
    act(() => { card(tree.root, 'b').props.onPress(); });
    expect(onPress).toHaveBeenCalledWith('b');
    expect(onPress).not.toHaveBeenCalledWith('a');
  });

  it('does not render an empty bundle heading when a track has no core (or no depth) topics', () => {
    const curricula = [curriculum({ themeKey: 'a', track: 'depth' })];
    const tree = mount(<ThemeList curricula={curricula} onPress={jest.fn()} />);
    expect(texts(tree.root)).not.toContain('공통 코어');
    expect(texts(tree.root)).toContain('심화');
  });

  it('renders nothing on an empty track without crashing', () => {
    const tree = mount(<ThemeList curricula={[]} onPress={jest.fn()} />);
    expect(findAllPressables(tree.root)).toHaveLength(0);
  });
});
