// 수첩 모션 — 값이 참조 CSS와 같은지, 그리고 CSS처럼 움직이는지.
//
// 값 대조는 손으로 옮긴 숫자를 다시 손으로 적지 않는다: 참조 JSX의 `@keyframes` 문자열을 직접
// 읽어서 nbMotion의 명세 표와 맞춘다(ficons.test와 같은 방식 — CI는 docs/dlc 서브모듈을 받는다).
// 움직임 대조는 화면에서 "움직이긴 하는데 다르다"로만 드러나는 둘을 잡는다: 구간마다 이징이 다시
// 걸리는지, 그리고 opacity처럼 중간 키프레임에 이름이 없는 속성이 그 키프레임에서 꺾이지 않는지.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { readFileSync } from 'fs';
import { join } from 'path';
import { Animated, Easing, Pressable, View } from 'react-native';
import { act, create } from 'react-test-renderer';
import {
  CSS_EASE, NB_BAR_TRANSITION, NB_CHIP_PRESS, NB_MOTION, NB_PRESS, NbEnter, nbPressTransform, swipeOutSpec,
  useNbColorTransition, useNbPress, useNbShake, useNbSwipeOut, useNbTear, type MotionSpec,
} from './nbMotion';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

const REF = join(__dirname, '..', '..', '..', '..', 'docs', 'dlc', 'projects', 'forin', 'inputs', 'design-handoff_v46', 'reference');
const css = [
  'forin-notebook-lesson-words-live.jsx',
  'forin-notebook-lesson-nuance.jsx',
  'forin-notebook-lesson.jsx',
  'forin-notebook-ui.jsx',
].map((f) => readFileSync(join(REF, f), 'utf8')).join('\n');

// ── 참조 CSS 읽기 ──────────────────────────────────────────────────────────

type Frame = { at: number; transform?: string; opacity?: number };

function keyframes(name: string): Frame[] {
  const start = css.indexOf(`@keyframes ${name}{`);
  if (start < 0) throw new Error(`no @keyframes ${name}`);
  let i = start + `@keyframes ${name}{`.length;
  let depth = 1;
  const bodyStart = i;
  while (depth > 0) { if (css[i] === '{') depth += 1; else if (css[i] === '}') depth -= 1; i += 1; }
  const body = css.slice(bodyStart, i - 1);
  const frames: Frame[] = [];
  for (const m of body.matchAll(/([\d%,\s]+)\{([^}]*)\}/g)) {
    const decls = Object.fromEntries(m[2].split(';').filter(Boolean).map((d) => {
      const k = d.indexOf(':');
      return [d.slice(0, k).trim(), d.slice(k + 1).trim()];
    }));
    for (const pct of m[1].split(',')) {
      frames.push({
        at: parseFloat(pct) / 100,
        transform: decls.transform,
        opacity: decls.opacity != null ? parseFloat(decls.opacity) : undefined,
      });
    }
  }
  return frames.sort((a, b) => a.at - b.at);
}

function cssRule(cls: string): string {
  const m = css.match(new RegExp(`\\.${cls}\\{([^}]*)\\}`));
  if (!m) throw new Error(`no .${cls}`);
  return m[1];
}

/** `rotate(22deg) translate(300px,-80px)` → [['rotate','22deg'],['translateX',300],['translateY',-80]] */
function fns(t: string | undefined): [string, number | string][] {
  if (!t || t === 'none') return [];
  const out: [string, number | string][] = [];
  for (const m of t.matchAll(/(\w+)\(([^)]*)\)/g)) {
    const args = m[2].split(',').map((a) => a.trim());
    const num = (a: string) => (a.endsWith('deg') ? `${parseFloat(a)}deg` : a.endsWith('%') ? a : parseFloat(a));
    if (m[1] === 'translate') { out.push(['translateX', num(args[0])], ['translateY', num(args[1] ?? '0')]); }
    else if (m[1] === 'rotate') out.push(['rotate', `${parseFloat(args[0])}deg`]);
    else out.push([m[1], num(args[0])]);
  }
  return out;
}

const IDENTITY: Record<string, number | string> = { translateX: 0, translateY: 0, scale: 1, scaleY: 1, rotate: '0deg' };

/** 참조 keyframes → 속성별 (stops, values). 이름 없는 끝 키프레임은 요소 자신의 값. */
function tracksOf(name: string) {
  const frames = keyframes(name);
  const props = new Map<string, { stops: number[]; values: (number | string)[] }>();
  const order: string[] = [];
  for (const f of frames) for (const [p] of fns(f.transform)) if (!order.includes(p)) order.push(p);
  for (const p of order) {
    const stops: number[] = [], values: (number | string)[] = [];
    for (const f of frames) {
      if (f.transform == null) continue;
      const hit = fns(f.transform).find(([q]) => q === p);
      stops.push(f.at); values.push(hit ? hit[1] : IDENTITY[p]);
    }
    props.set(p, { stops, values });
  }
  const op = frames.filter((f) => f.opacity != null);
  if (op.length) {
    const stops = op.map((f) => f.at), values: (number | string)[] = op.map((f) => f.opacity as number);
    if (stops[0] !== 0) { stops.unshift(0); values.unshift(1); }
    if (stops[stops.length - 1] !== 1) { stops.push(1); values.push(1); }
    props.set('opacity', { stops, values });
  }
  return { order, props };
}

function timingOf(cls: string) {
  const rule = cssRule(cls);
  const m = rule.match(/animation:[\w-]+\s+([\d.]+)s\s+(cubic-bezier\(([^)]*)\)|ease-out|ease-in-out|ease)/);
  if (!m) throw new Error(`no animation in .${cls}`);
  const easing = m[3] ? Easing.bezier(...(m[3].split(',').map(Number) as [number, number, number, number]))
    : m[2] === 'ease-out' ? Easing.bezier(0, 0, 0.58, 1)
    : m[2] === 'ease-in-out' ? Easing.bezier(0.42, 0, 0.58, 1)
    : Easing.bezier(0.25, 0.1, 0.25, 1);
  const o = rule.match(/transform-origin:([^;]*)/)?.[1].trim();
  const origin = o == null ? undefined : ({ 'top left': '0% 0%', 'top right': '100% 0%', top: '50% 0%' } as Record<string, string>)[o];
  return { duration: Math.round(parseFloat(m[1]) * 1000), easing, origin };
}

function sameEasing(a: (t: number) => number, b: (t: number) => number) {
  for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) expect(a(t)).toBeCloseTo(b(t), 4);
}

function expectSpecMatches(spec: MotionSpec, kf: string, cls: string) {
  const ref = tracksOf(kf);
  const tm = timingOf(cls);
  expect(spec.duration).toBe(tm.duration);
  sameEasing(spec.easing, tm.easing);
  expect(spec.origin).toBe(tm.origin);
  // transform 함수 순서 = 트랙 순서.
  expect(spec.tracks.filter((t) => t.prop !== 'opacity').map((t) => t.prop)).toEqual(ref.order);
  for (const t of spec.tracks) {
    const r = ref.props.get(t.prop);
    expect({ prop: t.prop, has: !!r }).toEqual({ prop: t.prop, has: true });
    expect({ prop: t.prop, stops: t.stops, values: t.values }).toEqual({ prop: t.prop, stops: r!.stops, values: r!.values });
  }
  expect(spec.tracks.length).toBe(ref.props.size);
}

// ── 값 대조 ───────────────────────────────────────────────────────────────

test.each([
  ['tearRight', 'nb-tear-r', 'nb-tear-r'],
  ['tearLeft', 'nb-tear-l', 'nb-tear-l'],
  ['rise', 'nb-rise', 'nb-rise'],
  ['stub', 'nb-stub', 'nb-stub'],
  ['shake', 'nb-shake', 'nb-shake'],
  ['ok', 'nb-ok', 'nb-ok'],
  ['reveal', 'nb-reveal', 'nb-reveal'],
  ['swipeIn', 'nb-swipe-in', 'nb-swipe-in'],
  ['pop', 'nbl-pop', 'nbl-pop'],
] as const)('%s is the reference %s, value for value', (key, kf, cls) => {
  expectSpecMatches(NB_MOTION[key], kf, cls);
});

test('swipe-out flies -120% of the card, measured', () => {
  // translateX(-120%) — RN transform takes no percent, so the card's width is measured.
  const ref = tracksOf('nb-swipe-out');
  expect(ref.props.get('translateX')!.values).toEqual([0, '-120%']);
  const spec = swipeOutSpec(300);
  const tm = timingOf('nb-swipe-out');
  expect(spec.duration).toBe(tm.duration);
  sameEasing(spec.easing, tm.easing);
  expect(spec.tracks.find((t) => t.prop === 'translateX')!.values).toEqual([0, -360]);
  expect(spec.tracks.find((t) => t.prop === 'rotate')!.values).toEqual(ref.props.get('rotate')!.values);
  expect(spec.tracks.find((t) => t.prop === 'opacity')!.values).toEqual(ref.props.get('opacity')!.values);
});

test('press and chip timings are the stylesheet\'s', () => {
  expect(css).toContain('.nb-press{cursor:pointer;transition:transform .06s ease,box-shadow .06s ease;user-select:none}');
  expect(css).toContain('.nb-press:active{transform:translate(1.5px,2px) rotate(0deg)!important;box-shadow:none!important}');
  expect(css).toContain('.nb-chip:active{transform:scale(.94)!important}');
  expect([NB_PRESS.duration, NB_PRESS.dx, NB_PRESS.dy]).toEqual([60, 1.5, 2]);
  expect([NB_CHIP_PRESS.duration, NB_CHIP_PRESS.scale]).toEqual([60, 0.94]);
  sameEasing(NB_PRESS.easing, CSS_EASE.ease);
  expect(NB_BAR_TRANSITION.duration).toBe(300);
  sameEasing(NB_BAR_TRANSITION.easing, CSS_EASE.ease);
});

// ── 움직임 ────────────────────────────────────────────────────────────────

// The native driver runs on the UI thread, which a test renderer does not have: a natively
// driven value never moves in JS. So each timing is recorded (to prove it ASKED for the native
// driver) and then run on the JS driver, where the clock below can step it.
const realTiming = Animated.timing;
let timings: Animated.TimingAnimationConfig[] = [];
beforeEach(() => {
  jest.useFakeTimers();
  timings = [];
  jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => {
    timings.push(cfg);
    return realTiming(v, { ...cfg, useNativeDriver: false });
  });
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}
const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });

/** Animated.View의 지금 값 — opacity와 transform 하나하나. */
function now(view: ReturnType<typeof create>['root']) {
  const style = view.props.style;
  const flat = Object.assign({}, ...[style].flat(3).filter(Boolean));
  const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
  const t: Record<string, unknown> = {};
  for (const e of (flat.transform ?? []) as Record<string, unknown>[]) for (const [k, v] of Object.entries(e)) t[k] = read(v);
  return { opacity: read(flat.opacity) as number | undefined, ...t } as Record<string, number | string | undefined>;
}

test('a mount motion starts at its 0% frame and ends at its 100% frame (`both`)', () => {
  const tree = mount(<NbEnter kind="rise"><View /></NbEnter>);
  const view = tree.root.findByType(Animated.View);
  // First frame is already the 0% frame — no flash of the resting sheet before it rises.
  expect(now(view).translateY).toBeCloseTo(6);
  expect(now(view).scale).toBeCloseTo(0.985);
  advance(450);
  expect(now(view).translateY).toBeCloseTo(0);
  expect(now(view).scale).toBeCloseTo(1);
  // transform + opacity only, so every leg asked for the native driver.
  expect(timings.length).toBeGreaterThan(0);
  expect(timings.every((t) => t.useNativeDriver === true)).toBe(true);
});

test('the stamp pops in segments: it is AT its 70% overshoot at 70% of the time', () => {
  // One timing over a three-stop interpolate would pass 70% of the clock at 70% of the run
  // and land mid-way between the stops after the easing warped it; CSS eases each
  // segment, so at 245ms the first segment has just ended — exactly scale 1.08.
  const tree = mount(<NbEnter kind="ok"><View /></NbEnter>);
  const view = tree.root.findByType(Animated.View);
  expect(now(view).scale).toBeCloseTo(0.6);
  expect(now(view).rotate).toBe('-20deg');
  advance(245);
  expect(now(view).scale).toBeCloseTo(1.08, 2);
  expect(now(view).opacity).toBeCloseTo(1, 2);
  advance(200);
  expect(now(view).scale).toBeCloseTo(1);
  expect(now(view).rotate).toBe('-10deg');
});

test('a torn sheet fades on ONE curve while its transform has two', () => {
  // `nb-tear-r` names opacity only at 100%, so opacity does not stop at 18%: it is one
  // eased run over 620ms. Driving it from the transform's segmented clock would put a
  // kink at 18%.
  const ends: string[] = [];
  function Tearing() {
    const style = useNbTear('right', () => ends.push('torn'));
    return <Animated.View style={style} />;
  }
  const tree = mount(<Tearing />);
  const view = tree.root.findByType(Animated.View);
  expect(now(view)).toMatchObject({ rotate: '0deg', translateX: 0, translateY: 0, opacity: 1 });
  expect(flatStyle(view).transformOrigin).toBe('0% 0%');
  // 18% of 620ms: the transform has reached its 18% frame exactly…
  advance(Math.round(620 * 0.18));
  expect(String(now(view).rotate)).toMatch(/^-2\.9\d*deg$|^-3deg$/);
  expect(now(view).translateX as number).toBeCloseTo(3, 0);
  // …and the opacity sits where the single curve puts it, not at a segment boundary.
  const curve = Easing.bezier(0.3, 0.6, 0.4, 1);
  expect(now(view).opacity as number).toBeCloseTo(1 - curve(0.18), 1);
  expect(ends).toEqual([]);
  advance(620);
  expect(now(view)).toMatchObject({ rotate: '22deg', translateX: 300, translateY: -80, opacity: 0 });
  expect(ends).toEqual(['torn']);
});

function flatStyle(view: ReturnType<typeof create>['root']) {
  return Object.assign({}, ...[view.props.style].flat(3).filter(Boolean)) as Record<string, unknown>;
}

test('a left tear pivots on the top right and flies left', () => {
  function Tearing() { return <Animated.View style={useNbTear('left')} />; }
  const tree = mount(<Tearing />);
  const view = tree.root.findByType(Animated.View);
  expect(flatStyle(view).transformOrigin).toBe('100% 0%');
  advance(700);
  expect(now(view)).toMatchObject({ rotate: '-22deg', translateX: -300, translateY: -80, opacity: 0 });
});

test('shake replays from the start each time it is asked', () => {
  let api!: ReturnType<typeof useNbShake>;
  function Shaky() { api = useNbShake(); return <Animated.View style={api.style} />; }
  const tree = mount(<Shaky />);
  const view = tree.root.findByType(Animated.View);
  expect(now(view).translateX).toBe(0);
  act(() => api.shake());
  advance(75); // 25%
  expect(now(view).translateX as number).toBeCloseTo(-5, 1);
  advance(150); // 75%
  expect(now(view).translateX as number).toBeCloseTo(5, 1);
  advance(100);
  expect(now(view).translateX as number).toBeCloseTo(0);
  act(() => api.shake());
  advance(75);
  expect(now(view).translateX as number).toBeCloseTo(-5, 1);
});

test('swipe-out uses the measured width', () => {
  let api!: ReturnType<typeof useNbSwipeOut>;
  const done = jest.fn();
  function Card() { api = useNbSwipeOut(); return <Animated.View onLayout={api.onLayout} style={api.style} />; }
  const tree = mount(<Card />);
  const view = tree.root.findByType(Animated.View);
  act(() => api.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 200 } } } as never));
  act(() => api.swipe(done));
  advance(400);
  expect(now(view)).toMatchObject({ translateX: -360, rotate: '-8deg', opacity: 0 });
  expect(done).toHaveBeenCalledTimes(1);
});

test('a colour change eases from the colour on screen to the new one', () => {
  let color!: Animated.AnimatedInterpolation<string>;
  function Bar({ c }: { c: string }) { color = useNbColorTransition(c); return <Animated.View style={{ backgroundColor: color }} />; }
  const tree = mount(<Bar c="rgba(62,54,43,.15)" />);
  const rgba = () => (color as unknown as { __getValue(): string }).__getValue().replace(/\s/g, '');
  expect(rgba()).toMatch(/^rgba\(62,54,43,0\.1[45]\d*\)$/);
  act(() => tree.update(<Bar c="#3E362B" />));
  // Not snapped — the old colour still shows at the start.
  expect(rgba()).toMatch(/^rgba\(62,54,43,0\.1[45]\d*\)$/);
  advance(150);
  const mid = Number(rgba().match(/,([\d.]+)\)$/)![1]);
  expect(mid).toBeGreaterThan(0.2);
  expect(mid).toBeLessThan(1);
  advance(200);
  expect(rgba()).toBe('rgba(62,54,43,1)');
  // Colour cannot run on the native driver; it must not claim to.
  expect(timings.every((t) => t.useNativeDriver === false)).toBe(true);
  expect(timings[0].duration).toBe(300);
});

test('press sinks over 60ms and comes back the same way', () => {
  let api!: ReturnType<typeof useNbPress>;
  function Btn() {
    api = useNbPress();
    return <Pressable onPressIn={api.onPressIn} onPressOut={api.onPressOut}><Animated.View style={{ transform: nbPressTransform(api.p, -1) }} /></Pressable>;
  }
  const tree = mount(<Btn />);
  const view = tree.root.findByType(Animated.View);
  expect(now(view)).toMatchObject({ translateX: 0, translateY: 0, rotate: '-1deg' });
  act(() => api.onPressIn());
  // Not instant: CSS transitions it.
  expect(now(view).translateY).toBe(0);
  advance(80);
  expect(now(view)).toMatchObject({ translateX: 1.5, translateY: 2, rotate: '0deg' });
  act(() => api.onPressOut());
  advance(80);
  expect(now(view)).toMatchObject({ translateX: 0, translateY: 0, rotate: '-1deg' });
});
