// v48 신호 키트 — 부품마다 reference(forin-notebook-v48-kit.jsx)의 값이 그대로 나오는지.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { Animated, Text, View } from 'react-native';
import Svg from 'react-native-svg';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { NbDoubleRing } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { Chev, Done, Go, GoBar, IconDot, Locked, NewDot, Pill, Ring, V48_K } from './V48';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}
const byID = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type !== 'string');
const flat = (n: ReactTestInstance) => Object.assign({}, ...[n.props.style].flat(Infinity).filter(Boolean)) as Record<string, unknown>;
const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue(): unknown }).__getValue() : v);
const tf = (n: ReactTestInstance) => {
  const out: Record<string, unknown> = {};
  for (const e of ((flat(n).transform ?? []) as Record<string, unknown>[])) for (const [k, v] of Object.entries(e)) out[k] = read(v);
  return out;
};
const icons = (root: ReactTestInstance) => root.findAllByType(NbIcon).map((n) => n.props.name as string);
const texts = (root: ReactTestInstance) => root.findAll((n) => String(n.type) === 'Text', { deep: true }).flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));

test('the kit palette is the reference K', () => {
  expect(V48_K).toEqual({ ink: '#3E362B', paper: '#FFFdf4', yellow: '#F9E37B', green: '#5F8D5A', red: '#C75146', soft: '#9A8F7C' });
});

test('Go: a yellow 2px-ink circle with a ▶ and a halo', () => {
  const tree = mount(<Go size={44} />);
  const circle = tree.root.findAll((n) => String(n.type) === 'View' && flat(n).backgroundColor === '#F9E37B')[0];
  expect(flat(circle)).toMatchObject({ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#3E362B' });
  expect(byID(tree.root, 'v48-halo').length).toBeGreaterThan(0);
  // the ▶ is half the circle
  expect(tree.root.findAll((n) => String(n.type) === 'RNSVGSvgView')[0].props.width).toBe(22);
});

test('GoBar: ink bar, tilted -0.5deg at rest, a 46 ▶ with a paper rim', () => {
  const tree = mount(<GoBar left={<Text>L</Text>}><Text>body</Text></GoBar>);
  const bar = tree.root.findAll((n) => String(n.type) === 'View' && flat(n).backgroundColor === '#3E362B')[0];
  expect(flat(bar)).toMatchObject({ gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6 });
  const tilt = tree.root.findAllByType(Animated.View).find((n) => tf(n).rotate !== undefined)!;
  expect(tf(tilt).rotate).toBe('-0.5deg');
  const go = byID(tree.root, 'v48-gobar-go')[0];
  expect(go).toBeTruthy();
  const dot = tree.root.findAll((n) => String(n.type) === 'View' && flat(n).borderColor === '#FFFdf4' && flat(n).width === 46)[0];
  expect(flat(dot)).toMatchObject({ backgroundColor: '#F9E37B', borderWidth: 2, borderRadius: 23 });
  expect(texts(tree.root)).toEqual(['L', 'body']);
});

test('GoBar fires onPress', () => {
  const press = jest.fn();
  const tree = mount(<GoBar onPress={press} testID="bar"><Text>x</Text></GoBar>);
  act(() => byID(tree.root, 'bar')[0].props.onPress());
  expect(press).toHaveBeenCalledTimes(1);
});

test('Ring: the arc is pct of the circumference of r21 (viewBox 50, stroke 4.5)', () => {
  const tree = mount(<Ring pct={0.25} size={46}><Text>7</Text></Ring>);
  const arc = byID(tree.root, 'v48-ring-arc')[0];
  expect(arc.props.strokeWidth).toBe(4.5);
  expect(arc.props.stroke).toBe('#F9E37B');
  expect(Number(String(arc.props.strokeDasharray).split(' ')[0])).toBeCloseTo(2 * Math.PI * 21 * 0.25, 4);
  expect(tree.root.findAllByType(Svg)[0].props.viewBox).toBe('0 0 50 50');
  expect(texts(tree.root)).toEqual(['7']);

  const full = mount(<Ring pct={1} />);
  expect(Number(String(byID(full.root, 'v48-ring-arc')[0].props.strokeDasharray).split(' ')[0])).toBeCloseTo(2 * Math.PI * 21, 4);
  // nothing done → no arc, only the track
  expect(byID(mount(<Ring pct={0} />).root, 'v48-ring-arc')).toHaveLength(0);
});

test('Locked: a dashed 1.6 circle at .55, the padlock inside', () => {
  const tree = mount(<Locked size={34} />);
  const v = tree.root.findAll((n) => String(n.type) === 'View' && flat(n).borderStyle === 'dashed')[0];
  expect(flat(v)).toMatchObject({ width: 34, height: 34, borderWidth: 1.6, borderStyle: 'dashed', opacity: 0.55, borderColor: 'rgba(62,54,43,.4)' });
  expect(icons(tree.root)).toEqual(['lock']);
  // with an icon: the icon, and a small lock at the corner
  expect(icons(mount(<Locked icon="run" />).root)).toEqual(['run', 'lock']);
});

test('Done: a green 2.5px double ring, a check, and the stamp keeps its tilt', () => {
  const tree = mount(<Done size={34} rot={-10} />);
  const ring = tree.root.findByType(NbDoubleRing);
  expect(ring.props).toMatchObject({ color: '#5F8D5A', line: 1, gap: 0.5 }); // 1 + .5 + 1 = 2.5
  expect(icons(tree.root)).toEqual(['check']);
  const d = byID(tree.root, 'v48-done')[0];
  expect(flat(d)).toMatchObject({ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(95,141,90,.08)' });
  expect(tf(tree.root.findAllByType(Animated.View).find((n) => n.props.testID === 'v48-done')!).rotate).toBe('-10deg');
  // with an icon, the check rides the corner
  expect(icons(mount(<Done icon="trophy" />).root)).toEqual(['trophy', 'check']);
});

test('IconDot: a 1.7 ring, tilted', () => {
  const tree = mount(<IconDot name="pencil" size={40} rot={-4} />);
  const v = byID(tree.root, 'v48-icondot')[0];
  // the composite's own props carry no style; read the host view
  const host = tree.root.findAll((n) => String(n.type) === 'View' && n.props.testID === 'v48-icondot')[0];
  expect(flat(host)).toMatchObject({ width: 40, height: 40, borderRadius: 20, borderWidth: 1.7, borderColor: '#3E362B', backgroundColor: '#FFFdf4' });
  expect(tf(host).rotate).toBe('-4deg');
  expect(v).toBeTruthy();
  expect(icons(tree.root)).toEqual(['pencil']);
  expect(tree.root.findByType(NbIcon).props.size).toBeCloseTo(40 * 0.58);
});

test('NewDot: a red count circle with a paper rim', () => {
  const tree = mount(<NewDot n={3} />);
  const host = tree.root.findAllByType(Animated.View).find((n) => n.props.testID === 'v48-newdot')!;
  expect(flat(host)).toMatchObject({ position: 'absolute', right: -7, top: -6, minWidth: 18, height: 18, borderRadius: 99, backgroundColor: '#C75146', borderWidth: 2, borderColor: '#FFFdf4' });
  expect(texts(tree.root)).toEqual(['3']);
  // wiggle: at rest while it waits out its .4s delay
  expect(tf(host).rotate).toBe('0deg');
});

test('Pill: an icon and a Gaegu 19 number in a 1.6 ink capsule', () => {
  const tree = mount(<Pill icon="fire" n={12} />);
  const host = tree.root.findAll((n) => String(n.type) === 'View' && n.props.testID === 'v48-pill')[0];
  expect(flat(host)).toMatchObject({ borderWidth: 1.6, borderColor: '#3E362B', borderRadius: 99, backgroundColor: '#FFFdf4', paddingLeft: 7, paddingRight: 11, paddingVertical: 4, gap: 4 });
  expect(icons(tree.root)).toEqual(['fire']);
  expect(tree.root.findByType(NbIcon).props.size).toBe(19);
  const num = tree.root.findAll((n) => String(n.type) === 'Text')[0];
  expect(flat(num)).toMatchObject({ fontFamily: 'Gaegu', fontSize: 19 });
  expect(texts(tree.root)).toEqual(['12']);
});

test('Chev: ⌄ at 0°, 180° once open (and eases there)', () => {
  jest.useFakeTimers();
  try {
    const tree = mount(<Chev open={false} />);
    const host = () => tree.root.findAllByType(Animated.View).find((n) => n.props.testID === 'v48-chev')!;
    expect(tf(host()).rotate).toBe('0deg');
    expect(icons(tree.root)).toEqual(['chevronDown']);
    act(() => tree.update(<Chev open />));
    act(() => { jest.advanceTimersByTime(250); });
    // the native driver does not run in a test renderer; the value is bound all the same
    expect(host().props.style.transform[0].rotate).toBeDefined();
    const opened = mount(<Chev open />);
    expect(tf(opened.root.findAllByType(Animated.View)[0]).rotate).toBe('180deg');
  } finally { jest.useRealTimers(); }
});
