// 낱장 묶음(제본) — 단어장과 문장장이 함께 쓰는 SheetStack.
//
// 정본: design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx L156–163 · L274–288 ·
// L290 (sent-live L107–113 · L200–216 같은 마크업). 두 가지를 본다:
//  · 그림 — 링 9개, 뒷장 2겹, 아래 깔린 다음 장(.85, 그림자 없음), 절취 조각(지그재그 16점),
//    점선 절취선, 낱장 그림자, 낱장 헤더, 스크롤 영역. 값은 참조 줄 그대로.
//  · 순서 — 뜯김(620ms) → 콜백(부모가 다음 장으로) → 다음 장 떠오름(rise)·절취 조각(stub).
//    핸드오프가 setTimeout 620으로 하는 일을 부품이 모션 끝에서 한다.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { createRef, useState } from 'react';
import { Animated, ScrollView, Text } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import {
  LessonSheet, SHEET, SheetIconCircle, SheetStack, STUB_POINTS, type SheetMode, type SheetStackHandle,
} from './SheetStack';
import { nb } from '@/theme/nb';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

const realTiming = Animated.timing;
beforeEach(() => {
  jest.useFakeTimers();
  // The native driver never steps in a test renderer; run the same timings on the JS driver.
  jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => realTiming(v, { ...cfg, useNativeDriver: false }));
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(el)); });
  return tree;
}
const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });

function flat(n: ReactTestInstance) {
  const f = Object.assign({}, ...[n.props.style].flat(5).filter(Boolean)) as Record<string, unknown>;
  const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(f)) {
    out[k] = k === 'transform' && Array.isArray(v)
      ? Object.assign({}, ...v.map((e) => Object.fromEntries(Object.entries(e as object).map(([a, b]) => [a, read(b)]))))
      : read(v);
  }
  return out;
}
const hosts = (root: ReactTestInstance, pred: (s: Record<string, unknown>, n: ReactTestInstance) => boolean) =>
  root.findAll((n) => typeof n.type === 'string' && !!n.props.style && pred(flat(n), n), { deep: true });
const byId = (root: ReactTestInstance, id: string) => root.findAll((n) => n.props?.testID === id && typeof n.type === 'string', { deep: true });

/** A screen in miniature: one sheet per index, a log of which mode each was drawn in. */
function Deck({ total = 4, start = 0, done: doneAt, stack, log }: {
  total?: number; start?: number; done?: boolean;
  stack: React.RefObject<SheetStackHandle | null>;
  log?: string[];
}) {
  const [i, setI] = useState(start);
  const render = (k: number, mode: SheetMode) => (
    <LessonSheet testID={`sheet-${k}-${mode}`} dim={mode === 'next'} tag="외상 인계" typeLabel="영어 고르기" n={k + 1} total={total}>
      <Text>{`body ${k}`}</Text>
    </LessonSheet>
  );
  return (
    <SheetStack
      ref={stack}
      index={i}
      total={total}
      done={doneAt ?? i >= total}
      renderSheet={render}
      renderDone={() => <Text testID="done-body">done</Text>}
      onAdvance={() => { log?.push('advance'); setI((n) => n + 1); }}
    />
  );
}

// ── 그림 ─────────────────────────────────────────────────────────────────

test('the scroll area is fixed between 172 and 182, 24 in from each side, with no scrollbar', () => {
  const stack = createRef<SheetStackHandle>();
  const tree = mount(<Deck stack={stack} />);
  const sv = tree.root.findByType(ScrollView);
  expect(flat(sv)).toMatchObject({ position: 'absolute', left: 24, right: 24, top: 172, bottom: 182 });
  expect(sv.props.showsVerticalScrollIndicator).toBe(false);
  expect(Object.assign({}, ...[sv.props.contentContainerStyle].flat())).toMatchObject({ paddingTop: 12, paddingBottom: 8 });
  // The screen can move the top (safe area) without touching the rest.
  const moved = mount(<SheetStack index={0} total={1} top={190} renderSheet={() => null} />);
  expect(flat(moved.root.findByType(ScrollView)).top).toBe(190);
});

test('nine spring rings across the top, and two back sheets that follow the stack\'s height', () => {
  const stack = createRef<SheetStackHandle>();
  const tree = mount(<Deck stack={stack} />);
  const wrap = byId(tree.root, 'sheet-stack')[0];
  expect(flat(wrap)).toMatchObject({ position: 'relative', minHeight: 360 });

  const rings = hosts(tree.root, (s) => s.width === 12 && s.height === 18);
  expect(rings).toHaveLength(9);
  expect(flat(rings[0])).toMatchObject({ borderWidth: 2, borderColor: nb.ink, borderRadius: 6, backgroundColor: nb.cream });
  const row = byId(tree.root, 'sheet-rings')[0];
  expect(flat(row)).toMatchObject({ position: 'absolute', left: 14, right: 14, top: -9, flexDirection: 'row', justifyContent: 'space-between', zIndex: 5 });

  // Insets, not heights: the back sheets grow with whatever the current sheet is.
  const deep = hosts(tree.root, (s) => s.backgroundColor === '#F7F1E1')[0];
  const near = hosts(tree.root, (s) => s.backgroundColor === '#FBF6E8')[0];
  expect(flat(deep)).toMatchObject({ position: 'absolute', left: 4, right: -4, top: 8, bottom: 0, borderWidth: 1, borderColor: '#E0D6C0' });
  expect(flat(near)).toMatchObject({ position: 'absolute', left: 2, right: -2, top: 4, bottom: 4, borderWidth: 1, borderColor: '#E0D6C0' });
  expect(flat(deep).height).toBeUndefined();
});

test('the next sheet lies under the current one, dimmed and without a shadow', () => {
  const stack = createRef<SheetStackHandle>();
  const tree = mount(<Deck stack={stack} />);
  const next = byId(tree.root, 'sheet-1-next')[0];
  const cur = byId(tree.root, 'sheet-0-current')[0];
  expect(flat(next).opacity).toBe(0.85);
  expect(flat(next).shadowOpacity).toBeUndefined();
  expect(flat(next).elevation).toBeUndefined();
  expect(flat(cur).opacity).toBe(1);
  expect(flat(cur)).toMatchObject({ shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } });
  // Underneath: positioned at the top of the stack, BEFORE the current sheet's layer.
  const order = tree.root.findAll((n) => typeof n.props?.testID === 'string' && /^sheet-\d-/.test(n.props.testID) && typeof n.type === 'string', { deep: true }).map((n) => n.props.testID);
  expect(order).toEqual(['sheet-1-next', 'sheet-0-current']);
  const nextLayer = byId(tree.root, 'sheet-next-layer')[0];
  expect(flat(nextLayer)).toMatchObject({ position: 'absolute', left: 0, right: 0, top: 0 });
  const curLayer = byId(tree.root, 'sheet-current-layer')[0];
  expect(flat(curLayer)).toMatchObject({ position: 'relative', zIndex: 3 });
  // T8 사용자 결정(§7): 다음 장은 현재 장이 잰 높이로 잘려, 더 길어도 현재 장 아래로 비어져 나오지 않는다.
  act(() => { curLayer.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 330, height: 318 } } }); });
  expect(flat(byId(tree.root, 'sheet-next-layer')[0])).toMatchObject({ height: 318, overflow: 'hidden' });
  // The last sheet has nothing under it.
  const last = mount(<Deck stack={createRef<SheetStackHandle>()} start={3} />);
  expect(byId(last.root, 'sheet-next-layer')).toHaveLength(0);
});

test('a loose leaf: paper, edge, shadow, padding, perforation and header', () => {
  const tree = mount(
    <LessonSheet testID="leaf" tag="바이탈" typeLabel="조각 맞추기 · 해설" n={2} total={6}>
      <Text>x</Text>
    </LessonSheet>,
  );
  const leaf = flat(byId(tree.root, 'leaf')[0]);
  expect(leaf).toMatchObject({
    backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge,
    paddingTop: 22, paddingHorizontal: 18, paddingBottom: 16, minHeight: 300,
  });
  // `top: 13`, edge to edge, `1.5px dashed rgba(62,54,43,.3)` — drawn as an SVG line
  // because iOS turns a one-sided dashed border solid.
  const perf = flat(byId(tree.root, 'sheet-perforation')[0]);
  expect(perf).toMatchObject({ position: 'absolute', left: 0, right: 0, top: 13 });
  const dash = tree.root.findAll((n) => String(n.type) === 'RNSVGLine', { deep: true })[0];
  expect(dash.props.strokeWidth).toBe(1.5);
  expect(dash.props.strokeDasharray).toEqual(SHEET.dash(1.5));

  // Header: blue tag at -1°, the type label (never wraps), and n / N pushed right in bold mono.
  const header = flat(byId(tree.root, 'sheet-header')[0]);
  expect(header).toMatchObject({ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 });
  const tag = hosts(tree.root, (s) => s.borderColor === nb.blue && s.borderWidth === 1.4)[0];
  expect(JSON.stringify(flat(tag).transform)).toContain('-1deg');
  const label = tree.root.findAll((n) => String(n.type) === 'Text' && n.props.children === '조각 맞추기 · 해설', { deep: true })[0];
  expect(label.props.numberOfLines).toBe(1);
  expect(flat(label)).toMatchObject({ fontFamily: 'Gaegu', fontSize: 12.5, color: nb.soft });
  const count = tree.root.findAll((n) => String(n.type) === 'Text' && n.props.children === '2 / 6', { deep: true })[0];
  expect(count.props.numberOfLines).toBe(1);
  expect(flat(count)).toMatchObject({ fontFamily: 'IBMPlexMono-Bold', fontSize: 11, color: nb.soft, letterSpacing: 0, flexShrink: 0 });
});

test('the amber circle: 58, 2pt amber ring on its own wash, tilted -4°, icon 32 — and the listen variant', () => {
  const amber = mount(<SheetIconCircle icon="siren" />);
  const ring = flat(byId(amber.root, 'sheet-icon')[0]);
  expect(ring).toMatchObject({ width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: nb.amber, backgroundColor: `${nb.amber}22` });
  expect(JSON.stringify(ring.transform)).toContain('-4deg');
  expect(amber.root.findAll((n) => String(n.type) === 'RNSVGSvgView', { deep: true })[0].props.width).toBe(32);

  // sent-live L117: the listen sheet's circle is the speaker button — blue, its own wash,
  // a small shadow, and it plays.
  const play = jest.fn();
  const listen = mount(<SheetIconCircle tone="listen" onPress={play} />);
  const btn = flat(byId(listen.root, 'sheet-icon')[0]);
  expect(btn).toMatchObject({ borderColor: nb.blue, backgroundColor: 'rgba(74,111,165,.1)', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } });
  act(() => { listen.root.findAll((n) => typeof n.props?.onPress === 'function', { deep: true })[0].props.onPress(); });
  expect(play).toHaveBeenCalledTimes(1);
});

test('no stub on the first sheet; a zigzag stub once one has been torn off', () => {
  const first = mount(<Deck stack={createRef<SheetStackHandle>()} />);
  expect(byId(first.root, 'sheet-stub')).toHaveLength(0);
  const later = mount(<Deck stack={createRef<SheetStackHandle>()} start={2} />);
  const stub = byId(later.root, 'sheet-stub')[0];
  expect(flat(stub)).toMatchObject({ position: 'absolute', left: 0, right: 0, top: 0, height: 13, zIndex: 4, transformOrigin: '50% 0%' });
  // The handoff's clip-path, point for point.
  expect(STUB_POINTS).toEqual([
    [0, 0], [100, 0], [100, 70], [94, 100], [88, 70], [80, 100], [72, 68], [64, 100],
    [55, 72], [47, 100], [40, 70], [31, 100], [23, 72], [15, 100], [8, 68], [0, 100],
  ]);
  act(() => { byId(later.root, 'sheet-stub-measure')[0].props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 13 } } }); });
  const poly = later.root.findAll((n) => String(n.type) === 'RNSVGPath' && String(n.props.d).startsWith('M0 0 L200 0'), { deep: true });
  expect(poly).toHaveLength(1);
  // 94% of 200 = 188, 70% of 13 = 9.1.
  expect(poly[0].props.d).toContain('188 13');
  expect(poly[0].props.d).toContain('200 9.1');
});

// ── 순서 ─────────────────────────────────────────────────────────────────

test('tear right: the sheet flies for 620ms, THEN the screen advances, THEN the next sheet rises', () => {
  const stack = createRef<SheetStackHandle>();
  const log: string[] = [];
  const tree = mount(<Deck stack={stack} log={log} />);

  act(() => { stack.current!.tear('right', () => log.push('torn')); });
  // The current sheet is replaced by its tearing copy, above everything (zIndex 6).
  expect(byId(tree.root, 'sheet-0-current')).toHaveLength(0);
  const copy = byId(tree.root, 'sheet-0-tearing')[0];
  expect(copy).toBeTruthy();
  const layer = flat(byId(tree.root, 'sheet-tearing-layer')[0]);
  expect(layer).toMatchObject({ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6, transformOrigin: '0% 0%' });
  expect(byId(tree.root, 'sheet-tearing-layer')[0].props.pointerEvents).toBe('none');
  // The next sheet is still lying underneath — the tear uncovers it.
  expect(byId(tree.root, 'sheet-1-next')).toHaveLength(1);

  advance(600);
  expect(log).toEqual([]);
  advance(40);
  expect(log).toEqual(['torn', 'advance']);
  expect(byId(tree.root, 'sheet-tearing-layer')).toHaveLength(0);

  // Sheet 1 is now current, and it is RISING from its 0% frame — not already at rest.
  const cur = byId(tree.root, 'sheet-current-rise')[0];
  expect(byId(tree.root, 'sheet-1-current')).toHaveLength(1);
  expect(flat(cur).transform).toMatchObject({ translateY: 6, scale: 0.985 });
  // …and the stub appears, from its own 0% frame, for the first time.
  expect(flat(byId(tree.root, 'sheet-stub')[0])).toMatchObject({ opacity: 0 });
  advance(420);
  expect(flat(byId(tree.root, 'sheet-current-rise')[0]).transform).toMatchObject({ translateY: 0, scale: 1 });
  expect(flat(byId(tree.root, 'sheet-stub')[0])).toMatchObject({ opacity: 1 });

  // Every tear re-runs both: the stub is a new stub (key 'stub'+i), the sheet a new sheet.
  act(() => { stack.current!.tear('left'); });
  advance(640);
  expect(byId(tree.root, 'sheet-2-current')).toHaveLength(1);
  expect(flat(byId(tree.root, 'sheet-stub')[0])).toMatchObject({ opacity: 0 });
  expect(flat(byId(tree.root, 'sheet-current-rise')[0]).transform).toMatchObject({ translateY: 6 });
});

test('a new index rises even when the screen moves on without a tear (key \'cur\'+i)', () => {
  const sheet = (k: number) => <LessonSheet testID={`sheet-${k}`} typeLabel="t" n={k + 1} total={3}><Text>{k}</Text></LessonSheet>;
  const tree = mount(<SheetStack index={0} total={3} renderSheet={(k) => sheet(k)} />);
  advance(450);
  expect(flat(byId(tree.root, 'sheet-current-rise')[0]).transform).toMatchObject({ translateY: 0 });
  act(() => { tree.update(<SheetStack index={1} total={3} renderSheet={(k) => sheet(k)} />); });
  expect(flat(byId(tree.root, 'sheet-current-rise')[0]).transform).toMatchObject({ translateY: 6 });
});

test('tear left pivots on the top right and flies left', () => {
  const stack = createRef<SheetStackHandle>();
  const tree = mount(<Deck stack={stack} />);
  act(() => { stack.current!.tear('left'); });
  expect(flat(byId(tree.root, 'sheet-tearing-layer')[0]).transformOrigin).toBe('100% 0%');
  advance(310);
  expect((flat(byId(tree.root, 'sheet-tearing-layer')[0]).transform as Record<string, number>).translateX).toBeLessThan(-100);
});

test('a second tear while one is in the air is ignored', () => {
  const stack = createRef<SheetStackHandle>();
  const log: string[] = [];
  mount(<Deck stack={stack} log={log} />);
  const second = jest.fn();
  act(() => { stack.current!.tear('right'); });
  act(() => { stack.current!.tear('left', second); });
  advance(700);
  expect(log).toEqual(['advance']);
  expect(second).not.toHaveBeenCalled();
  expect(stack.current!.isTearing()).toBe(false);
});

test('a wrong answer shakes the current sheet in place', () => {
  const stack = createRef<SheetStackHandle>();
  const tree = mount(<Deck stack={stack} />);
  const layer = () => flat(byId(tree.root, 'sheet-current-layer')[0]);
  expect(layer().transform).toMatchObject({ translateX: 0 });
  act(() => { stack.current!.shake(); });
  advance(75);
  expect((layer().transform as Record<string, number>).translateX).toBeCloseTo(-5, 1);
  advance(260);
  expect((layer().transform as Record<string, number>).translateX).toBeCloseTo(0);
});

test('when the deck is done, the done leaf rises in the binder and nothing lies under it', () => {
  const tree = mount(<Deck stack={createRef<SheetStackHandle>()} start={4} />);
  expect(byId(tree.root, 'sheet-next-layer')).toHaveLength(0);
  expect(byId(tree.root, 'sheet-current-layer')).toHaveLength(0);
  const leaf = byId(tree.root, 'sheet-done')[0];
  expect(flat(leaf)).toMatchObject({
    position: 'relative', zIndex: 3, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge,
    paddingTop: 28, paddingHorizontal: 18, paddingBottom: 20, alignItems: 'center', shadowOpacity: 0.16,
  });
  expect(flat(leaf).transform).toMatchObject({ translateY: 6 });
  expect(byId(tree.root, 'done-body')).toHaveLength(1);
  // Still in the binder: rings and back sheets are drawn.
  expect(hosts(tree.root, (s) => s.width === 12 && s.height === 18)).toHaveLength(9);
});
