// NbYarn — journey-binder-v42 Task H, task-H-brief.md §4, §7, §8 (test 17).
import { act, create } from 'react-test-renderer';
import { Animated } from 'react-native';
import { Circle, Path } from 'react-native-svg';
import { NbYarn } from './NbYarn';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

let timingSpy: jest.SpyInstance;

beforeEach(() => {
  timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NbYarn', () => {
  // 브리프 §8 test 17 — 점 하나뿐이면 아무것도 그리지 않는다.
  it('draws nothing with fewer than two points', () => {
    const zero = mount(<NbYarn pts={[]} />);
    expect(zero.root.findAllByType(Path)).toHaveLength(0);

    const one = mount(<NbYarn pts={[{ x: 0, y: 0 }]} />);
    expect(one.root.findAllByType(Path)).toHaveLength(0);
  });

  it('draws exactly two paths (thread + highlight) and one pin per point', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }];
    const tree = mount(<NbYarn pts={pts} />);
    expect(tree.root.findAllByType(Path)).toHaveLength(2);
    // 각 점마다 핀 원 + 광택 원 = 2개, endPin 기본 true라 마지막 점도 포함.
    expect(tree.root.findAllByType(Circle)).toHaveLength(pts.length * 2);
  });

  it('skips the last pin when endPin is false', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }];
    const tree = mount(<NbYarn pts={pts} endPin={false} />);
    expect(tree.root.findAllByType(Circle)).toHaveLength((pts.length - 1) * 2);
  });

  it('colours only the last pin nb.marker, the rest nb.red', () => {
    const pts = [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }];
    const tree = mount(<NbYarn pts={pts} />);
    // 핀(광택 원이 아닌) 원은 r=4.2 — 그 fill로 마지막/그 외를 가른다.
    const pins = tree.root.findAllByType(Circle).filter((c) => c.props.r === 4.2);
    expect(pins).toHaveLength(3);
    expect(pins[2].props.fill).toBe('#F9E37B'); // nb.marker
    expect(pins[0].props.fill).toBe('#C75146'); // nb.red
    expect(pins[1].props.fill).toBe('#C75146');
  });

  it('animates the draw with a 1.4s, 0.2s-delayed Animated.timing unless reduceMotion', () => {
    mount(<NbYarn pts={[{ x: 0, y: 0 }, { x: 10, y: 0 }]} />);
    expect(timingSpy).toHaveBeenCalledTimes(1);
    const call = timingSpy.mock.calls[0];
    expect((call[1] as { duration: number }).duration).toBe(1400);
    expect((call[1] as { delay: number }).delay).toBe(200);
  });

  it('never calls Animated.timing when reduceMotion is on (K7)', () => {
    mount(<NbYarn pts={[{ x: 0, y: 0 }, { x: 10, y: 0 }]} reduceMotion />);
    expect(timingSpy).not.toHaveBeenCalled();
  });
});
