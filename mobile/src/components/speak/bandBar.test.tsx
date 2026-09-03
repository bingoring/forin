// 점수 분포 게이지 (핸드오프 v33 · 리뷰랩 말하기).
//
// The tiles became one inked gauge, and three things about that gauge are wrong in a
// way that still renders:
//
//  · A segment sized by the wrong count — the bar answers "what proportion", and a
//    high-band gauge painted mostly red is a lie about the learner's standing.
//  · A 0-count band still drawing its divider, a stray 1.4px line inside the bar.
//  · The counts vanishing. They moved from the tiles into the legend on purpose —
//    "how many are still bad" is the number this tab exists to show, and a gauge that
//    is only proportions dropped it.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { BandBar } from '@/components/speak/BandBar';
import { BAND_SWATCH } from '@/components/pron/nbPron';
import { bandWidths } from '@/data/speakBands';

function render(counts: { total: number; low: number; mid: number; high: number }) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<BandBar counts={counts} />); });
  const root = tree.root;
  const out = { root, unmount: () => act(() => tree.unmount()) };
  return out;
}

/** RN style props nest; flatten so `width` / `borderLeftWidth` are readable. */
function flat(style: unknown): Record<string, unknown> {
  const acc: Record<string, unknown> = {};
  const walk = (s: unknown) => {
    if (Array.isArray(s)) s.forEach(walk);
    else if (s && typeof s === 'object') Object.assign(acc, s as Record<string, unknown>);
  };
  walk(style);
  return acc;
}

/** The filled segments: host Views with a percentage width and a band swatch fill. */
function segments(root: ReactTestInstance) {
  const fills: string[] = Object.values(BAND_SWATCH);
  return root
    .findAll((n) => String(n.type) === 'View', { deep: true })
    .map((n) => flat(n.props.style))
    .filter((s) => typeof s.width === 'string' && fills.includes(s.backgroundColor as string));
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('each segment is sized by ITS band, matching bandWidths', () => {
  const counts = { total: 128, low: 10, mid: 40, high: 78 };
  const { root, unmount } = render(counts);
  const w = bandWidths(counts);

  const widths = segments(root).map((s) => s.width);
  // The high band is the biggest share, so the biggest segment must carry the high
  // swatch — a gauge that painted the widest slice red would misreport the standing.
  expect(widths).toEqual([`${w.low}%`, `${w.mid}%`, `${w.high}%`]);
  const highSeg = segments(root).find((s) => s.backgroundColor === BAND_SWATCH.ok);
  expect(highSeg?.width).toBe(`${w.high}%`);
  unmount();
});

test('an empty band collapses to zero width and draws no stray divider', () => {
  // All three segments stay MOUNTED now, so the distribution can animate between filters
  // rather than pop segments in and out. An empty band is therefore a 0%-wide segment —
  // and, crucially, it and the first VISIBLE band carry no left divider, or a 0-count
  // low/mid would leave a 1.4px line floating at the start of the bar.
  const { root, unmount } = render({ total: 5, low: 0, mid: 0, high: 5 });
  const segs = segments(root);
  expect(segs).toHaveLength(3);
  expect(segs.map((s) => s.width)).toEqual(['0%', '0%', '100%']);
  // The empty bands, and the first visible one (high), all draw no divider.
  expect(segs[0].borderLeftWidth).toBe(0); // low, empty
  expect(segs[1].borderLeftWidth).toBe(0); // mid, empty
  expect(segs[2].borderLeftWidth).toBe(0); // high, first visible → no stray line
  unmount();
});

test('the divider sits before a visible band only when a visible band precedes it', () => {
  // With the low band empty, mid is the FIRST visible segment — so the divider is absent
  // on mid and present on high, following visibility rather than a fixed index.
  const { root, unmount } = render({ total: 10, low: 0, mid: 4, high: 6 });
  const segs = segments(root);
  expect(segs).toHaveLength(3);
  expect(segs[0].width).toBe('0%');                    // low, empty
  expect(segs[0].borderLeftWidth).toBe(0);
  expect(segs[1].backgroundColor).toBe(BAND_SWATCH.weak); // mid, first visible
  expect(segs[1].borderLeftWidth).toBe(0);
  expect(segs[2].borderLeftWidth).toBeGreaterThan(0);  // high, divided from mid
  unmount();
});

test('the counts survive in the legend, all three bands', () => {
  const { root, unmount } = render({ total: 128, low: 10, mid: 40, high: 78 });
  const joined = texts(root).join(' ');
  // The number, next to its band — this is what the tiles used to show and the tab
  // exists to answer.
  expect(joined).toContain('60점 미만 10');
  expect(joined).toContain('60–79점 40');
  expect(joined).toContain('80점 이상 78');
  unmount();
});

test('a band at zero still appears in the legend', () => {
  // "80점 이상 0" is information — no sentence has reached the top band yet — and the
  // legend is where every band is accounted for even when the bar cannot show it.
  const { root, unmount } = render({ total: 5, low: 3, mid: 2, high: 0 });
  expect(texts(root).join(' ')).toContain('80점 이상 0');
  unmount();
});
