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

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import {
  NbButton, NbCheck, NbChip, NbGauge, NbIndexTabs, NbMark, NbPaper, NbProgSquares, NbSheet, NbStamp,
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
  for (const [i, band] of bands.entries()) {
    const f = ((st) => (Array.isArray(st) ? Object.assign({}, ...st.filter(Boolean)) : st))(band.props.style);
    // A View, positioned — not the Text.
    expect(String(band.type)).toBe('View');
    // It starts in the LOWER half of its line (top past the line's own y), not at the top.
    const lineY = i * 20;
    expect(f.top).toBeGreaterThan(lineY + 20 * 0.4);
    // …and it is shorter than the full line height — a stroke, not a block.
    expect(f.height).toBeLessThan(20);
    // …and only as wide as that line's glyphs: line 0 is wider than line 1.
    expect(f.width).toBe(i === 0 ? 120 : 80);
  }
});

test('the gauge is hatched, and the hatch is clipped to the value', () => {
  // Drawn with SVG lines because the hatch is what makes it read as pencil. A gauge that
  // lost its lines is still a gauge, so nothing but this would notice.
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

test('a button sinks when pressed and loses its shadow', () => {
  // The whole kit's interaction. In the prototype it is a global stylesheet, which a
  // caller can forget by building a button out of a div; here it is the component's own
  // pressed state, so it cannot be forgotten.
  const tree = mount(<NbButton onPress={() => {}}>시작하기</NbButton>);
  const press = tree.root.findAll((n) => typeof n.props?.style === 'function', { deep: true })[0];
  const up = Object.assign({}, ...(press.props.style({ pressed: false }) as unknown[]).filter(Boolean));
  const down = Object.assign({}, ...(press.props.style({ pressed: true }) as unknown[]).filter(Boolean));
  expect(down.transform).toEqual(expect.arrayContaining([{ translateY: 2 }]));
  expect(up.shadowOpacity).toBeGreaterThan(0);
  expect(down.shadowOpacity).toBeUndefined();
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

  // The rubber stamp's двойной ring: RN has no `border: double`, so it is two circles.
  const stamp = mount(<NbStamp top="연속출근" bottom="12일" />);
  expect(styled(stamp.root, (s) => s.borderWidth === 1.4 && typeof s.borderRadius === 'number').length).toBe(2);

  // Countable progress, and a tick that overshoots its box the way a pen does.
  const prog = mount(<NbProgSquares done={3} total={7} />);
  expect(styled(prog.root, (s) => s.width === 8).length).toBe(7);
  expect(styled(prog.root, (s) => s.width === 8 && s.backgroundColor !== 'transparent').length).toBe(3);
  expect(mount(<NbCheck done />).root.findAll((n) => String(n.type) === 'RNSVGPath', { deep: true }).length).toBe(1);
  expect(mount(<NbCheck />).root.findAll((n) => String(n.type) === 'RNSVGPath', { deep: true }).length).toBe(0);
});

test('a chip reports which way it is set', () => {
  const on = mount(<NbChip on>전체 14</NbChip>);
  const off = mount(<NbChip>SBAR 3</NbChip>);
  const bg = (t: ReturnType<typeof create>) => {
    const p = t.root.findAll((n) => typeof n.props?.style === 'function', { deep: true })[0];
    return Object.assign({}, ...(p.props.style({ pressed: false }) as unknown[]).filter(Boolean)).backgroundColor;
  };
  expect(bg(on)).toBe(nb.ink);
  expect(bg(off)).toBe(nb.paper);
});
