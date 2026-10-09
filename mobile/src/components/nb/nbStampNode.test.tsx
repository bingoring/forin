// NbStampNode — journey-binder-v42 Task H, task-H-brief.md §3, §7, §8.
//
// Same react-test-renderer conventions as StationTrack.test.tsx (this repo has no
// @testing-library/react-native): findAllByType/findAllByProps for lookups, and
// Animated.timing/loop spied to a no-op `start` so no real animation clock runs past a
// test (trackMounts() below guards the same leak StationTrack.test.tsx documents).
import { act, create } from 'react-test-renderer';
import { Animated } from 'react-native';
import { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { NbIcon } from './NbIcon';
import { NbStampNode } from './NbStampNode';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

let timingSpy: jest.SpyInstance;
let loopSpy: jest.SpyInstance;

beforeEach(() => {
  timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
  loopSpy = jest.spyOn(Animated, 'loop').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NbStampNode — 톱니 테두리', () => {
  // 이빨 간격 6, 개수 round(size/6) — 자리마다 네 변(위/아래/왼쪽/오른쪽)에 구멍이
  // 하나씩이라 원 개수는 그 4배다. 기본 62px → round(62/6)=10 → 원 40개.
  it('punches teeth/6 holes on every one of the four edges', () => {
    const tree = mount(<NbStampNode state="next" icon="speech" n={1} animate={false} />);
    const circles = tree.root.findAllByType(Circle).filter((c) => c.props.r === 2.6);
    expect(circles).toHaveLength(40);
  });
});

describe('NbStampNode — 본체 채움·테두리', () => {
  it('fills done with the given wash, or the default green wash when none is passed', () => {
    const withWash = mount(<NbStampNode state="done" icon="speech" n={1} wash="rgba(1,2,3,.5)" animate={false} />);
    const bodyWith = withWash.root.findAllByType(Rect).find((r) => r.props.width === 60)!;
    expect(bodyWith.props.fill).toBe('rgba(1,2,3,.5)');

    const noWash = mount(<NbStampNode state="done" icon="speech" n={1} animate={false} />);
    const bodyNo = noWash.root.findAllByType(Rect).find((r) => r.props.width === 60)!;
    expect(bodyNo.props.fill).toBe('rgba(95,141,90,.16)');
  });

  it('draws `here` with the marker-coloured 2px border and `locked` with a dashed, softer one', () => {
    const here = mount(<NbStampNode state="here" icon="speech" n={1} animate={false} />);
    const hereBody = here.root.findAllByType(Rect).find((r) => r.props.width === 60)!;
    expect(hereBody.props.strokeWidth).toBe(2);

    const locked = mount(<NbStampNode state="locked" icon="speech" n={1} animate={false} />);
    const lockedBody = locked.root.findAllByType(Rect).find((r) => r.props.width === 60)!;
    expect(lockedBody.props.strokeWidth).toBe(1.4);
    expect(lockedBody.props.strokeDasharray).toBe('3 3');
  });

  // locked는 전체 투명도 .5 — 그 밖은 온전한 1.
  it('dims the whole stamp to .5 opacity only when locked', () => {
    const locked = mount(<NbStampNode state="locked" icon="speech" n={1} animate={false} />);
    expect((locked.root.findAllByType(Animated.View)[0].props.style as { opacity: number }).opacity).toBe(0.5);

    const next = mount(<NbStampNode state="next" icon="speech" n={1} animate={false} />);
    expect((next.root.findAllByType(Animated.View)[0].props.style as { opacity: number }).opacity).toBe(1);
  });
});

describe('NbStampNode — 번호 도장 · 아이콘', () => {
  it('pads the stamp number to two digits', () => {
    const tree = mount(<NbStampNode state="next" icon="speech" n={7} animate={false} />);
    expect(tree.root.findAllByType(SvgText)[0].props.children).toBe('07');
  });

  it('shows the lock icon (not the given one) once locked', () => {
    const locked = mount(<NbStampNode state="locked" icon="speech" n={1} animate={false} />);
    const icons = locked.root.findAllByType(NbIcon);
    expect(icons.some((i) => i.props.name === 'lock')).toBe(true);
    expect(icons.some((i) => i.props.name === 'speech')).toBe(false);

    const next = mount(<NbStampNode state="next" icon="board" n={1} animate={false} />);
    const nextIcons = next.root.findAllByType(NbIcon);
    expect(nextIcons.some((i) => i.props.name === 'board')).toBe(true);
    expect(nextIcons.some((i) => i.props.name === 'lock')).toBe(false);
  });
});

describe('NbStampNode — done 도장 · here 깃발', () => {
  it('draws the double-ring check stamp only for done', () => {
    // Drawn (NbIcon name="check"), not a typographic ✓ — theme/glyphs.test.ts bans the
    // latter in src/components.
    const done = mount(<NbStampNode state="done" icon="speech" n={1} animate={false} />);
    expect(done.root.findAllByProps({ name: 'check' }).length).toBeGreaterThan(0);

    const here = mount(<NbStampNode state="here" icon="speech" n={1} animate={false} />);
    expect(here.root.findAllByProps({ name: 'check' })).toHaveLength(0);
  });

  it('draws the flag only for here', () => {
    // Animated.View is composite over a host node that echoes the same testID (the same
    // duplication StationTrack.test.tsx documents for Pressable/Text), so this only checks
    // presence/absence rather than an exact count.
    const here = mount(<NbStampNode state="here" icon="speech" n={1} animate={false} />);
    expect(here.root.findAllByProps({ testID: 'stamp-here-flag' }).length).toBeGreaterThan(0);

    const done = mount(<NbStampNode state="done" icon="speech" n={1} animate={false} />);
    expect(done.root.findAllByProps({ testID: 'stamp-here-flag' })).toHaveLength(0);
  });
});

describe('NbStampNode — 연출(§7) · K7', () => {
  it('pops in with a delayed, 400ms Animated.timing when animate is true', () => {
    mount(<NbStampNode state="next" icon="speech" n={1} delay={0.24} animate />);
    const call = timingSpy.mock.calls.find((c) => (c[1] as { duration?: number }).duration === 400)!;
    expect(call).toBeTruthy();
    expect((call[1] as { delay: number }).delay).toBeCloseTo(240);
  });

  // K7 / "처음 보이는 범위만 애니메이션한다"(§7) — 둘 다 이 하나의 스위치로 들어온다.
  // false면 도입 pop도, here 깃발의 bob·wag 루프도 전혀 돌지 않는다.
  it('starts no Animated.timing or Animated.loop at all when animate is false, even for a here stamp', () => {
    mount(<NbStampNode state="here" icon="speech" n={1} animate={false} />);
    expect(timingSpy).not.toHaveBeenCalled();
    expect(loopSpy).not.toHaveBeenCalled();
  });

  it('starts the flag bob/wag loops when a here stamp animates', () => {
    mount(<NbStampNode state="here" icon="speech" n={1} animate />);
    expect(loopSpy).toHaveBeenCalledTimes(2); // bob + wag
  });
});
