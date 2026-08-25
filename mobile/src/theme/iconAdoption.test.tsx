// v23 makes FIcon the global icon system. This tests the CHOKEPOINT that makes
// that true, rather than scanning call sites for stragglers.
//
// The history matters: the first attempt ported the 87-icon set and converted call
// sites one at a time, and left 92% of the app's icons on the retired line set. A
// source scan can only ever say "these 134 sites look right today"; resolving
// inside PixelIcon means a site cannot be wrong, including sites nobody has
// written yet. So the assertions here are about what PixelIcon RENDERS.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { PixelIcon } from '@/components/PixelIcon';
import { colors } from './tokens';
import { FICONS } from './ficons';
import { LINE_TO_FICON } from './lineToFIcon';

function draw(node: React.ReactElement): ReactTestInstance {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(node); });
  return tree.root;
}

/** FIcon draws <Rect>s; the line set draws <Path>/<Circle>. Which primitives came
 *  out is therefore which artwork rendered. */
function artwork(root: ReactTestInstance): 'ficon' | 'line' {
  const rects = root.findAll((n) => String(n.type) === 'RNSVGRect', { deep: true }).length;
  const paths = root.findAll((n) => ['RNSVGPath', 'RNSVGCircle'].includes(String(n.type)), { deep: true }).length;
  if (rects > 0 && paths === 0) return 'ficon';
  if (paths > 0 && rects === 0) return 'line';
  throw new Error(`ambiguous render: ${rects} rects, ${paths} paths`);
}

function opacityOf(root: ReactTestInstance): number {
  const views = root.findAll((n) => String(n.type) === 'View', { deep: true });
  for (const v of views) {
    const style = [v.props.style].flat(Infinity).filter(Boolean) as Record<string, number>[];
    const o = style.map((s) => s.opacity).find((x) => typeof x === 'number');
    if (o !== undefined) return o;
  }
  return 1;
}

test('every alias points at an icon the set actually has', () => {
  expect(Object.entries(LINE_TO_FICON).filter(([, f]) => !FICONS[f])).toEqual([]);
});

test('an aliased name in ink renders the v23 artwork', () => {
  // The plain case, and the one the whole adoption rests on.
  expect(artwork(draw(<PixelIcon name="mic" color={colors.ink} />))).toBe('ficon');
  expect(artwork(draw(<PixelIcon name="note" color={colors.ink} />))).toBe('ficon');
  expect(artwork(draw(<PixelIcon name="volume" color={colors.ink} />))).toBe('ficon');
});

test('a de-emphasised shade of ink renders the same artwork, dimmed', () => {
  // These greys are the same ink, quieter — a faded tab, an empty-state placeholder.
  const faint = draw(<PixelIcon name="mic" color={colors.textFaint} />);
  expect(artwork(faint)).toBe('ficon');
  expect(opacityOf(faint)).toBeCloseTo(0.42, 2);

  const soft = draw(<PixelIcon name="note" color={colors.textSoft} />);
  expect(artwork(soft)).toBe('ficon');
  expect(opacityOf(soft)).toBeCloseTo(0.62, 2);

  // The app writes half-strength ink as C + '44'.
  const alpha = draw(<PixelIcon name="volume" color={colors.ink + '66'} />);
  expect(artwork(alpha)).toBe('ficon');
  expect(opacityOf(alpha)).toBeCloseTo(0x66 / 255, 2);
});

test('ink at full strength is not wrapped in a needless opacity layer', () => {
  expect(opacityOf(draw(<PixelIcon name="mic" color={colors.ink} />))).toBe(1);
});

test('a colour the artwork cannot become keeps the line icon', () => {
  // An accent: a mint check, a blue drop. Recolouring pastel artwork is not available.
  expect(artwork(draw(<PixelIcon name="check" color={colors.mintShadow} />))).toBe('line');
  expect(artwork(draw(<PixelIcon name="droplet" color={colors.blue} />))).toBe('line');
  // Light on a dark ground: ink-outlined artwork would vanish into the button.
  expect(artwork(draw(<PixelIcon name="play" color={colors.cream} />))).toBe('line');
});

test('a two-state fill keeps the line icon', () => {
  // Any name with a fill is using presence-of-fill to say something one fixed
  // drawing cannot.
  expect(artwork(draw(<PixelIcon name="heart" color={colors.ink} fill={colors.pink} />))).toBe('line');
});

test('every favourites star says its state with a fill', () => {
  // Lost twice: the codemod dropped `fill` on its way to FIcon, and restoring the
  // star did not put it back — so a pinned ward showed a hollow star, which reads
  // as not pinned. The mark is the whole feedback for the toggle.
  const walkAll = (d: string): string[] => {
    const o: string[] = [];
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) o.push(...walkAll(p));
      else if (p.endsWith('.tsx') && !p.includes('.test.')) o.push(p);
    }
    return o;
  };
  const bare: string[] = [];
  for (const f of walkAll(join(__dirname, '..'))) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<PixelIcon\b[^>]*name="star"[^>]*?\/>/gs)) {
      if (!/fill=/.test(m[0])) bare.push(`${relative(join(__dirname, '..'), f)}: ${m[0].replace(/\s+/g, ' ')}`);
    }
  }
  expect(bare).toEqual([]);
});

test('the favourites star is never swapped for the reward badge', () => {
  // The regression this exists for: aliasing star → xp turned every favourite —
  // the pinned-list heading, each pinned situation, the toggles — into an XP badge.
  // v25 retires the star as the REWARD symbol (⭐🌟★ → xp), which the reward
  // surfaces draw directly; favourites is a different mark and stays a star.
  for (const color of [colors.ink, colors.ink + '44', colors.textFaint]) {
    expect(artwork(draw(<PixelIcon name="star" color={color} />))).toBe('line');
  }
  expect(artwork(draw(<PixelIcon name="star" color={colors.ink} fill={colors.yellowDeep} />))).toBe('line');
});

test('a name FIcon has no equivalent for keeps the line icon even in ink', () => {
  // Chevrons are the clearest case: FIcon has one right-pointing `arrow` and the
  // app needs four directions.
  for (const n of ['chevron-right', 'chevron-left', 'chevron-down', 'tag', 'share', 'plus'] as const) {
    expect(artwork(draw(<PixelIcon name={n} color={colors.ink} />))).toBe('line');
  }
});

// The remaining line icons at aliased names are the accent/light sites above. A
// ratchet, so the list is visible and can only shrink.
const UNCONVERTIBLE_CEILING = 5;

function sitesKeptForColour(): string[] {
  const walk = (d: string): string[] => {
    const o: string[] = [];
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) o.push(...walk(p));
      else if (p.endsWith('.tsx') && !p.includes('.test.')) o.push(p);
    }
    return o;
  };
  const inkish = new Set(['ink', 'textSoft', 'textFaint']);
  const out: string[] = [];
  for (const f of walk(join(__dirname, '..'))) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<PixelIcon\b[^>]*?\/>/gs)) {
      const name = /name="([a-z-]+)"/.exec(m[0])?.[1];
      const color = (/color=\{([^}]+)\}/.exec(m[0])?.[1] ?? /color="([^"]+)"/.exec(m[0])?.[1] ?? '').trim();
      if (!name || !LINE_TO_FICON[name]) continue;
      // Only flag a colour this scan can PROVE is not a shade of ink: a
      // `colors.<accent>` or a hex literal. Everything else — a conditional, a
      // cast, a prop threaded from a caller — resolves at runtime, where the
      // render tests above are what decide, and guessing from source text here
      // would report the tab bar (`color as string`, which arrives as ink or
      // textFaint) as unconverted when it is not.
      const token = /^colors\.([A-Za-z]+)$/.exec(color)?.[1];
      const literal = /^#[0-9a-fA-F]{3,8}$/.test(color);
      if (!token && !literal) continue;
      if (token && inkish.has(token)) continue;
      out.push(`${relative(join(__dirname, '..'), f)}: ${name} (${color})`);
    }
  }
  return out;
}

test(`at most ${UNCONVERTIBLE_CEILING} sites keep the line icon for a colour FIcon cannot be`, () => {
  const kept = sitesKeptForColour();
  expect({ count: kept.length, ceiling: UNCONVERTIBLE_CEILING, within: kept.length <= UNCONVERTIBLE_CEILING, kept })
    .toEqual({ count: kept.length, ceiling: UNCONVERTIBLE_CEILING, within: true, kept });
});

// The tab bar is the most-seen icon row in the app and it threads a runtime colour
// (`color as string`, active ink or inactive textFaint). Both are shades of ink, so
// both must resolve to the v23 artwork — a static reading of that call site cannot
// tell, which is exactly why it is asserted here.
test('the tab bar renders v23 artwork in both its states', () => {
  const active = draw(<PixelIcon name="home" color={colors.ink} size={22} sw={1.8} />);
  expect(artwork(active)).toBe('ficon');
  const inactive = draw(<PixelIcon name="home" color={colors.textFaint} size={22} sw={1.8} />);
  expect(artwork(inactive)).toBe('ficon');
  // And the inactive one reads as secondary rather than as a different icon.
  expect(opacityOf(inactive)).toBeLessThan(1);
  expect(opacityOf(active)).toBe(1);
});
