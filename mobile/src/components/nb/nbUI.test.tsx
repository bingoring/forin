// The 근무 수첩 kit, and specifically the three props that could not be translated.
//
// The prototype is CSS: the highlighter is a background gradient that starts 55% down the
// line, the pencil gauge is a repeating diagonal gradient, and the page is a repeating
// line gradient. React Native has none of those, so each is DRAWN — and a drawing that
// silently comes out flat is the failure this file exists to catch. A flat gauge still
// looks like a gauge; it just stops looking like pencil, and nothing else would notice.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { Animated, Text } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import {
  NbButton, NbCheck, NbChip, NbGauge, NbIndexTabs, NbMark, NbMemo, NbPaper, NbProgScale, NbProgSquares, NbSheet,
  NbStamp, NbTag, nbText,
} from './NbUI';
import { NbIcon } from './NbIcon';
import { RULE_H, nb } from '@/theme/nb';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}

/** Every HOST node whose flattened style matches.
 *
 *  Host only: RN's View is a component wrapping a host view and both carry the same style
 *  prop, so counting composites too doubles every result — which reads as the page being
 *  ruled twice rather than as a broken query. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll((n) => {
    if (typeof n.type !== 'string') return false;
    const st = n.props?.style;
    if (!st) return false;
    const flat = Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st;
    return typeof flat === 'object' && pred(flat as Record<string, unknown>);
  }, { deep: true });
}

test('each rule is the last point of its 28pt band', () => {
  // `repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)` — the line
  // occupies 27–28, 55–56, …
  const tree = mount(<NbSheet height={280} />);
  const tops = styled(tree.root, (s) => s.height === 1 && s.backgroundColor === 'rgba(62,54,43,.06)')
    .map((n) => readStyle(n).top as number);
  expect(tops.slice(0, 3)).toEqual([27, 55, 83]);
});

test('the page is actually ruled', () => {
  // A repeating background gradient in the prototype. Here it is a run of 1pt lines, and
  // if that run is empty the page is a blank cream rectangle — which reads as "the
  // notebook look did not load" rather than as a bug.
  const tree = mount(<NbSheet height={280} />);
  const rules = styled(tree.root, (s) => s.height === 1 && s.backgroundColor === 'rgba(62,54,43,.06)');
  expect(rules.length).toBe(Math.ceil(280 / RULE_H));
  // Spaced by the rule height, not bunched at the top.
  const tops = rules.map((n) => {
    const st = n.props.style;
    return (Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st).top as number;
  });
  expect(tops[1] - tops[0]).toBe(RULE_H);
});

test('the highlighter is a stroke along the lower half of each wrapped line', () => {
  // The prototype is `linear-gradient(transparent 55%, #F9E37B 55%)`: the wash covers the
  // LOWER part of the words, not the whole line box, and a two-line phrase gets a stroke
  // on BOTH lines. A plain text background floods the full height and a single band behind
  // the node caught only the last line — so the marker is drawn per measured line instead.
  const tree = mount(<NbMark>형광펜 강조</NbMark>);
  // The words live on a Text with NO fill of their own — the ink reads over the stroke.
  const textNode = tree.root.findAll((n) => String(n.type) === 'Text' && n.props.children === '형광펜 강조', { deep: true })[0];
  expect(textNode).toBeTruthy();
  const tflat = ((st) => (Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st))(textNode.props.style);
  expect(tflat.backgroundColor).toBeUndefined();

  // Before layout there are no bands: onTextLayout has not reported the lines yet.
  expect(styled(tree.root, (s) => s.backgroundColor === nb.marker).length).toBe(0);

  // Feed it a two-line measurement the way the platform would.
  act(() => {
    textNode.props.onTextLayout({
      nativeEvent: { lines: [
        { x: 0, y: 0, width: 120, height: 20 },
        { x: 0, y: 20, width: 80, height: 20 },
      ] },
    });
  });

  const bands = styled(tree.root, (s) => s.backgroundColor === nb.marker);
  // One stroke per line — the two-line case the old single band got wrong.
  expect(bands.length).toBe(2);
  const f = bands.map((band) => ((st) => (Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st))(band.props.style));
  for (const [i, band] of bands.entries()) {
    // A View, positioned — not the Text.
    expect(String(band.type)).toBe('View');
    // ui.jsx L95: `linear-gradient(transparent 55%, #F9E37B 55%)` — from 55% of the line to
    // its bottom, square-cornered.
    expect(f[i].top).toBeCloseTo(i * 20 + 20 * 0.55);
    expect(f[i].height).toBeCloseTo(20 * 0.45);
    expect(f[i].borderRadius).toBeUndefined();
  }
  // `padding: 0 2px` on an inline box: 2pt past the glyphs at the phrase's START (line 0's
  // left) and END (line 1's right) only. The Text itself is pushed in by the same 2pt.
  expect(f[0].left).toBe(0);
  expect(f[0].width).toBe(120 + 2);
  expect(f[1].left).toBe(2);
  expect(f[1].width).toBe(80 + 2);
});

test('the gauge is hatched in two tones, at the stylesheet\'s pitch', () => {
  // ui.jsx L105: `repeating-linear-gradient(-45deg, ${color}66 0 5px, ${color}3d 5px 10px)`.
  // Two tones with no paper between them, and the 10px period runs ACROSS the stripes —
  // so along the bar consecutive dark bands are 10·√2 apart.
  const tree = mount(<NbGauge value={40} color="#5F8D5A" height={9} />);
  const fill = styled(tree.root, (s) => s.width === '40%')[0];
  act(() => { fill.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 120, height: 6 } } }); });
  const after = styled(tree.root, (s) => s.width === '40%')[0];
  const flatFill = Object.assign({}, ...[after.props.style].flat().filter(Boolean));
  expect(flatFill.backgroundColor).toBe('#5F8D5A3d');
  const lines = tree.root.findAll((n) => String(n.type) === 'RNSVGLine', { deep: true });
  expect(lines.length).toBeGreaterThan(10);
  const x2 = lines.map((l) => Number(l.props.x2));
  expect(x2[0] - x2[1]).toBeCloseTo(10 * Math.SQRT2, 3);
  for (const l of lines) {
    expect(l.props.strokeWidth).toBe(5);
    // 0x66 alpha on the dark tone; react-native-svg packs colour as ARGB.
    expect((l.props.stroke.payload >>> 24) & 0xff).toBe(0x66);
  }
  // Phase: the -45° gradient starts at the fill's bottom-right corner, with a dark band
  // first — its centre line is 2.5 in from that corner (inner height 9 − 3 = 6).
  expect(x2[0]).toBeCloseTo(120 + 6 - Math.SQRT2 * 2.5, 3);
});

test('the gauge\'s hatch is clipped to the value', () => {
  const tree = mount(<NbGauge value={40} />);
  const lines = tree.root.findAll((n) => String(n.type) === 'RNSVGLine', { deep: true });
  expect(lines.length).toBeGreaterThan(10);
  // The fill's width is the value, and it clips — otherwise the hatch runs the whole bar
  // and the gauge always reads full.
  const fill = styled(tree.root, (s) => s.width === '40%');
  expect(fill.length).toBe(1);
  const st = fill[0].props.style;
  expect((Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st).overflow).toBe('hidden');
});

test('the gauge clamps rather than overflowing its box', () => {
  for (const [given, want] of [[-20, '0%'], [140, '100%']] as const) {
    const tree = mount(<NbGauge value={given} />);
    // `overflow` narrows it to the FILL: the Svg inside also carries width 100%.
    expect(styled(tree.root, (s) => s.width === want && s.overflow === 'hidden').length).toBe(1);
  }
});

/** Every host node, flattened, with Animated values read out. */
function readStyle(n: ReactTestInstance) {
  const flat = Object.assign({}, ...[n.props.style].flat(4).filter(Boolean)) as Record<string, unknown>;
  const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) out[k] = k === 'transform' ? (v as Record<string, unknown>[]).map((e) => Object.fromEntries(Object.entries(e).map(([a, b]) => [a, read(b)]))) : read(v);
  return out;
}

test('ink, yellow and danger buttons cast a HARD offset shadow; paper keeps its soft lift', () => {
  // ui.jsx L58–62. The printed variants cast `Xpx Ypx 0` — no blur — and the old port gave
  // every variant the blurred paper shadow, which is the one thing that made the ink CTA
  // read as a card instead of a block. Drawn as the strips outside the face.
  const strips = (variant: 'ink' | 'yellow' | 'danger' | 'paper' | 'dashed') => {
    const tree = mount(<NbButton variant={variant}>시작하기</NbButton>);
    return { tree, strips: tree.root.findAll((n) => typeof n.type === 'string' && readStyle(n).position === 'absolute' && (readStyle(n).left === '100%' || readStyle(n).top === '100%'), { deep: true }).map(readStyle) };
  };
  const ink = strips('ink').strips;
  expect(ink.length).toBe(2);
  const right = ink.find((s) => s.left === '100%')!;
  const bottom = ink.find((s) => s.top === '100%')!;
  expect(right.width).toBe(2.5);
  expect(bottom.height).toBe(2.5);
  expect(right.backgroundColor).toBe('rgba(62,54,43,.3)');
  // At rest the strips are offset by the full shadow: the right one starts 2.5 down, the
  // bottom one 2.5 right.
  expect(right.transform).toEqual(expect.arrayContaining([{ translateY: 2.5 }]));
  expect(bottom.transform).toEqual(expect.arrayContaining([{ translateX: 2.5 }]));
  expect(right.opacity).toBe(1);

  const yellow = strips('yellow').strips;
  expect(yellow.map((s) => [s.backgroundColor, s.width ?? s.height])).toEqual(expect.arrayContaining([['rgba(62,54,43,.25)', 2]]));
  const danger = strips('danger').strips;
  expect(danger[0].backgroundColor).toBe('rgba(199,81,70,.25)');
  // No blurred shadow anywhere on a printed button.
  const inkTree = strips('ink').tree;
  expect(styled(inkTree.root, (s) => typeof s.shadowRadius === 'number' && (s.shadowRadius as number) > 0).length).toBe(0);

  // Paper: no strips, the soft `0 2px 6px .14` lift instead. Dashed: nothing.
  const paper = strips('paper');
  expect(paper.strips.length).toBe(0);
  expect(styled(paper.tree.root, (s) => s.shadowRadius === 6 && s.shadowOpacity === 0.14).length).toBe(1);
  const dashed = strips('dashed');
  expect(dashed.strips.length).toBe(0);
  expect(styled(dashed.tree.root, (s) => typeof s.shadowOpacity === 'number').length).toBe(0);
});

test('a button sinks over 0.06s when pressed, and its shadow goes with it', () => {
  // `.nb-press` (ui.jsx L17–18): translate(1.5px,2px) rotate(0) and `box-shadow: none`,
  // transitioned over .06s ease — not snapped.
  jest.useFakeTimers();
  const realTiming = Animated.timing;
  const asked: Animated.TimingAnimationConfig[] = [];
  const spy = jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => { asked.push(cfg); return realTiming(v, { ...cfg, useNativeDriver: false }); });
  try {
    const tree = mount(<NbButton rot={-1} onPress={() => {}}>시작하기</NbButton>);
    const press = tree.root.findAll((n) => typeof n.props?.onPressIn === 'function', { deep: true })[0];
    const face = () => tree.root.findAll((n) => typeof n.type === 'string' && Array.isArray(readStyle(n).transform) && (readStyle(n).transform as Record<string, unknown>[]).some((e) => 'rotate' in e && 'rotate' in e) && readStyle(n).position !== 'absolute', { deep: true }).map(readStyle)[0];
    const strip = () => tree.root.findAll((n) => typeof n.type === 'string' && readStyle(n).left === '100%', { deep: true }).map(readStyle)[0];
    expect(face().transform).toEqual([{ translateX: 0 }, { translateY: 0 }, { rotate: '-1deg' }]);
    act(() => { press.props.onPressIn(); });
    expect(face().transform).toEqual([{ translateX: 0 }, { translateY: 0 }, { rotate: '-1deg' }]);
    act(() => { jest.advanceTimersByTime(80); });
    expect(face().transform).toEqual([{ translateX: 1.5 }, { translateY: 2 }, { rotate: '0deg' }]);
    // The shadow strip has shrunk into the face's edge and faded.
    expect(strip().opacity).toBe(0);
    expect(strip().transform).toEqual(expect.arrayContaining([{ translateY: 0 }, { scaleX: 0 }]));
    act(() => { press.props.onPressOut(); jest.advanceTimersByTime(80); });
    expect(face().transform).toEqual([{ translateX: 0 }, { translateY: 0 }, { rotate: '-1deg' }]);
    expect(strip().opacity).toBe(1);
    expect(asked.map((c) => [c.duration, c.useNativeDriver])).toEqual([[60, true], [60, true]]);
  } finally {
    spy.mockRestore();
    jest.useRealTimers();
  }
});

test('a tag has no vertical padding and takes a type size', () => {
  // ui.jsx L74: `padding: '0 6px'`. The hub sets 10.5pt tags through the prototype's style.
  const tree = mount(<NbTag textStyle={{ fontSize: 10.5 }}>기초</NbTag>);
  expect(styled(tree.root, (s) => s.paddingHorizontal === 6 && s.paddingVertical === 0).length).toBe(1);
  const text = tree.root.findAll((n) => String(n.type) === 'Text', { deep: true })[0];
  expect(readStyle(text).fontSize).toBe(10.5);
});

test('masking tape casts its faint shadow', () => {
  // ui.jsx L36: `boxShadow: '0 1px 2px rgba(0,0,0,.08)'`.
  const tree = mount(<NbPaper tape />);
  const tape = styled(tree.root, (s) => s.backgroundColor === nb.tape)[0];
  expect(readStyle(tape)).toMatchObject({ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } });
});

test('mono type: tracking is the caller\'s, bold has none by default', () => {
  expect(nbText.mono(11).letterSpacing).toBe(1);
  expect(nbText.mono(11, nb.soft, 0).letterSpacing).toBe(0);
  expect(nbText.monoBold(11)).toMatchObject({ fontFamily: 'IBMPlexMono-SemiBold', letterSpacing: 0, fontSize: 11 });
});

test('the index tab in front joins the page instead of closing its box', () => {
  // Inactive tabs are stickers tucked behind; the active one comes forward in the page's
  // own colour and drops its bottom edge. Without that the three read as buttons, which
  // is exactly what this device replaced.
  const tree = mount(<NbIndexTabs tabs={[['교정 노트', 14], ['말하기', 128], ['모범답안', 34]]} active={1} />);
  const tabs = tree.root.findAll((n) => typeof n.props?.style === 'function', { deep: true });
  expect(tabs.length).toBe(3);
  const at = (i: number) => tabs[i].props.style({ pressed: false }) as Record<string, unknown>;
  expect(at(1).backgroundColor).toBe(nb.paper);
  expect(at(1).borderBottomColor).toBe(nb.paper);
  expect(at(1).marginBottom).toBeLessThan(0);
  // …and the ones behind are pastel and off-square.
  expect(at(0).backgroundColor).not.toBe(nb.paper);
  expect(at(0).transform).not.toEqual([]);
});

test('an icon draws its own shape, and an unknown name falls back rather than blanking', () => {
  const drawn = (name: string) =>
    mount(<NbIcon name={name} />).root.findAll(
      (n) => String(n.type).startsWith('RNSVG') && String(n.type) !== 'RNSVGSvgView',
      { deep: true },
    ).length;
  expect(drawn('hospital')).toBeGreaterThan(0);
  // The handoff warns that a missing name is silent. It falls back to the star — so the
  // fallback must at least be a drawing, or a typo produces an invisible icon.
  expect(drawn('no-such-icon')).toBe(drawn('star'));
});

test('the tick has its green wash under the ink, as drawn', () => {
  // forin-notebook.jsx L43: a 5pt wash.green stroke `M6 13.5 L10 17.5 L18.5 7.5` under a
  // 2.2pt ink stroke `M5 12.5 L10 17.5 L19 7`. The wash is a STROKE, not a fill.
  const paths = mount(<NbIcon name="check" />).root.findAll((n) => String(n.type) === 'RNSVGPath', { deep: true });
  expect(paths.map((p) => [p.props.d, p.props.strokeWidth])).toEqual([
    ['M6 13.5 L10 17.5 L18.5 7.5', 5],
    ['M5 12.5 L10 17.5 L19 7', 2.2],
  ]);
  const alpha = (p: ReactTestInstance) => (p.props.stroke.payload >>> 24) & 0xff;
  // wash.green is rgba(95,141,90,.2) — translucent; the ink line is opaque.
  expect(alpha(paths[0])).toBe(Math.round(0.2 * 255));
  expect(alpha(paths[1])).toBe(255);
});

test('faceWorried is its own drawing, not the star fallback', () => {
  // The sentence deck names it (sent-live L15, L17) and the handoff set lacks it, so the
  // prototype silently drew a star. Drawn here on faceAngry's rules: r=8 peach face, 1.7 ink.
  const kinds = (name: string) => mount(<NbIcon name={name} />).root
    .findAll((n) => String(n.type).startsWith('RNSVG') && String(n.type) !== 'RNSVGSvgView' && String(n.type) !== 'RNSVGGroup', { deep: true })
    .map((n) => String(n.type));
  expect(kinds('faceWorried')).not.toEqual(kinds('star'));
  expect(kinds('faceWorried')).toEqual(kinds('faceAngry'));
  const face = mount(<NbIcon name="faceWorried" />).root.findAll((n) => String(n.type) === 'RNSVGCircle', { deep: true })[0];
  expect([face.props.r, face.props.strokeWidth]).toEqual(['8', 1.7]);
});

test('the watercolour fill survives the port', () => {
  // The prototype spreads its stroke props AFTER the fill, so JSX overwrote every wash
  // with 'none' and the reference renders outline-only. The handoff defines the set as
  // stroke PLUS wash, so the order was fixed — this is what says it stayed fixed.
  //
  // react-native-svg hands the renderer a packed ARGB int rather than the string, so the
  // check is on the ALPHA: a wash is translucent, and 'none' or an opaque fill would both
  // fail it. That is the actual claim — not "a fill prop exists" but "a see-through fill
  // reached the drawing".
  const tree = mount(<NbIcon name="home" />);
  const alphas = tree.root
    .findAll((n) => String(n.type).startsWith('RNSVG') && n.props?.fill?.payload != null, { deep: true })
    .map((n) => (n.props.fill.payload >>> 24) & 0xff);
  expect(alphas.some((a) => a > 0 && a < 255)).toBe(true);
});

test('paper, stamps and checks carry the props the look depends on', () => {
  // A card that is perfectly square reads as a form rather than a scrapbook, so the
  // rotation is not decoration — it is the device.
  const paper = mount(<NbPaper rot={-0.6} tape pinned={40} />);
  expect(styled(paper.root, (s) => Array.isArray(s.transform) && JSON.stringify(s.transform).includes('-0.6deg')).length).toBeGreaterThan(0);
  expect(styled(paper.root, (s) => s.backgroundColor === nb.tape).length).toBe(1);

  // The rubber stamp's double ring: RN has no `border: 3px double`, so it is two circles —
  // CSS draws 3px double as a 1px line, a 1px gap, a 1px line (ui.jsx L87).
  const stamp = mount(<NbStamp size={54} top="연속출근" bottom="12일" />);
  const rings = styled(stamp.root, (s) => s.borderWidth === 1 && typeof s.borderRadius === 'number');
  expect(rings.length).toBe(2);
  const inner = rings.map(readStyle).find((s) => s.position === 'absolute')!;
  expect([inner.left, inner.top, inner.right, inner.bottom]).toEqual([1, 1, 1, 1]);
  expect(inner.borderRadius).toBe(27 - 2);
  // `lineHeight: 1` on the bottom line.
  const bottomLine = stamp.root.findAll((n) => String(n.type) === 'Text' && n.props.children === '12일', { deep: true })[0];
  expect(readStyle(bottomLine).lineHeight).toBeCloseTo(54 * 0.32);

  // Countable progress, and a tick that overshoots its box the way a pen does.
  const prog = mount(<NbProgSquares done={3} total={7} />);
  expect(styled(prog.root, (s) => s.width === 8).length).toBe(7);
  expect(styled(prog.root, (s) => s.width === 8 && s.backgroundColor !== 'transparent').length).toBe(3);
  expect(mount(<NbCheck done />).root.findAll((n) => String(n.type) === 'RNSVGPath', { deep: true }).length).toBe(1);
  expect(mount(<NbCheck />).root.findAll((n) => String(n.type) === 'RNSVGPath', { deep: true }).length).toBe(0);
});

test('a fixed-count progress scale keeps the same box count whatever the total is, and clamps both ends', () => {
  // NbProgSquares (above) draws one box per item, which is right for a handful but ran
  // past whatever sat beside it once a journey topic hit twenty-odd courses — the
  // now-retired CurrentStationBar drew over its own Resume pill this way. NbProgScale is
  // the fix: the box COUNT must stay fixed no matter how large `total` gets (still used
  // today by ThemeList.tsx and the theme screen's header, both journey topic progress).
  const boxes = (done: number, total: number) => mount(<NbProgScale done={done} total={total} />).root;
  expect(styled(boxes(1, 40), (s) => s.width === 8).length).toBe(styled(boxes(1, 5), (s) => s.width === 8).length);

  // Neither end is left to rounding: 1 of 24 (4%) still lights at least one box, and only
  // finishing every one of them fills the row — 23/24 (96%) must not round up to full.
  const lit = (done: number, total: number) => styled(boxes(done, total), (s) => s.width === 8 && s.backgroundColor !== 'transparent').length;
  const all = styled(boxes(24, 24), (s) => s.width === 8).length;
  expect(lit(0, 24)).toBe(0);
  expect(lit(1, 24)).toBeGreaterThanOrEqual(1);
  expect(lit(23, 24)).toBeLessThan(all);
  expect(lit(24, 24)).toBe(all);
});

test('a memo wraps a bare string child in Text so it is not dropped', () => {
  // A raw string sitting directly in a View renders nothing in a release build — only the
  // dashed box shows. The v38 pages passed the copy as a bare string, so the memo must
  // wrap a string (or number) child itself.
  const tree = mount(<NbMemo>10장마다 히든 카드 개봉</NbMemo>);
  const textNode = tree.root.findAll(
    (n) => String(n.type) === 'Text' && n.props.children === '10장마다 히든 카드 개봉',
    { deep: true },
  );
  expect(textNode.length).toBe(1);
  // An element child (a caller passing its own <Text>) is not double-wrapped.
  const withEl = mount(<NbMemo><Text>이미 감쌈</Text></NbMemo>);
  const texts = withEl.root.findAll((n) => String(n.type) === 'Text', { deep: true });
  expect(texts.length).toBe(1);
});

test('a chip reports which way it is set', () => {
  const on = mount(<NbChip on>전체 14</NbChip>);
  const off = mount(<NbChip>SBAR 3</NbChip>);
  const bg = (t: ReturnType<typeof create>) =>
    styled(t.root, (s) => s.paddingHorizontal === 11 && s.paddingVertical === 4).map(readStyle)[0].backgroundColor;
  expect(bg(on)).toBe(nb.ink);
  expect(bg(off)).toBe(nb.paper);
});

test('a chip shrinks to .94 over 0.06s while held', () => {
  // `.nb-chip{transition: transform .06s ease}` `:active{transform: scale(.94)}` (ui.jsx L19–20).
  jest.useFakeTimers();
  const realTiming = Animated.timing;
  const spy = jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => realTiming(v, { ...cfg, useNativeDriver: false }));
  try {
    const tree = mount(<NbChip rot={1}>SBAR 3</NbChip>);
    const chip = () => styled(tree.root, (s) => s.paddingHorizontal === 11).map(readStyle)[0];
    expect(chip().transform).toEqual([{ scale: 1 }, { rotate: '1deg' }]);
    act(() => { tree.root.findAll((n) => typeof n.props?.onPressIn === 'function', { deep: true })[0].props.onPressIn(); });
    expect(chip().transform).toEqual([{ scale: 1 }, { rotate: '1deg' }]);
    act(() => { jest.advanceTimersByTime(80); });
    expect(chip().transform).toEqual([{ scale: 0.94 }, { rotate: '0deg' }]);
  } finally {
    spy.mockRestore();
    jest.useRealTimers();
  }
});

// lesson-fidelity-v46 T6 — the hub's tags carry an icon before the words (lesson.jsx L110 ·
// L122 `<NbIcon name="siren" size={11}/> ER BAY 2`), and its done stamp a drawn ✓ (L103).
const str = (n: ReactTestInstance): string => n.children.map((c) => (typeof c === 'string' ? c : str(c))).join('');

describe('NbTag icon', () => {
  it('draws the icon at 11, then a space, then the words', () => {
    const tree = mount(<NbTag icon="siren" textStyle={{ fontSize: 10.5 }}>ER BAY 2</NbTag>);
    const icon = tree.root.findAllByType(NbIcon);
    expect(icon.map((i) => [i.props.name, i.props.size])).toEqual([['siren', 11]]);
    expect(str(tree.root.findAllByType(Text)[0])).toBe(' ER BAY 2');
  });
  it('is the plain pill without one', () => {
    const tree = mount(<NbTag>Lv.B1</NbTag>);
    expect(tree.root.findAllByType(NbIcon)).toHaveLength(0);
    expect(str(tree.root.findAllByType(Text)[0])).toBe('Lv.B1');
  });
});

describe('NbStamp topIcon', () => {
  it('draws the top line as an icon in the stamp colour, inked like the glyph', () => {
    const tree = mount(<NbStamp color={nb.green} size={40} topIcon="check" bottom="완료" />);
    const icon = tree.root.findAllByType(NbIcon);
    expect(icon).toHaveLength(1);
    expect(icon[0].props).toMatchObject({ name: 'check', color: nb.green });
    expect(icon[0].props.size).toBeCloseTo(40 * 0.17 * 1.25, 5);
  });
});
