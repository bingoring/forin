// The inline highlighter — the handoff's `<NbMark>` inside a sentence (words-live L270).
// RN reports only the whole Text's lines, so the run's ends are measured from cut copies;
// these pin where the bands go.
import { act, create } from 'react-test-renderer';
import { MarkedText, cuts, markBands, parseMarked, wordEnd } from './MarkedText';
import { nb } from '@/theme/nb';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

test('the catalog marks the run with [ ]', () => {
  expect(parseMarked('뜻을 보고 [영어를 떠올려]보세요')).toEqual([
    { text: '뜻을 보고 ' }, { text: '영어를 떠올려', mark: true }, { text: '보세요' },
  ]);
  expect(parseMarked('이제 [뉘앙스]를 느껴봐요')).toEqual([{ text: '이제 ' }, { text: '뉘앙스', mark: true }, { text: '를 느껴봐요' }]);
  expect(parseMarked('no mark')).toEqual([{ text: 'no mark' }]);
});

test('copies are cut at word ends, the part outside the run taken off', () => {
  const full = '통증 사정 — 뜻을 보고 영어를 떠올려보세요';
  const start = full.indexOf('영어를');
  const end = start + '영어를 떠올려'.length;
  expect(wordEnd(full, start)).toBe(start + 3);
  expect(cuts(full, start, end)).toEqual({
    a: '통증 사정 — 뜻을 보고 영어를', b: '영어를',
    c: '통증 사정 — 뜻을 보고 영어를 떠올려보세요', d: '보세요',
  });
});

const L = (x: number, y: number, width: number, height = 20) => ({ x, y, width, height });

test('one line: the band runs from the run start to its end, 55%→100%, 2 past each end', () => {
  const bands = markBands([L(0, 0, 300)], [L(0, 0, 150)], 40, [L(0, 0, 260)], 30);
  expect(bands).toEqual([{ left: 150 - 40 - 2, top: 11, width: (260 - 30 + 2) - (150 - 40 - 2), height: 9 }]);
});

test('a run that wraps gets a band on each line, padded only at its two ends', () => {
  const full = [L(0, 0, 300), L(0, 26, 120)];
  const bands = markBands(full, [L(0, 0, 280)], 40, [L(0, 0, 300), L(0, 26, 90)], 30);
  expect(bands).toEqual([
    { left: 238, top: 26 * 0 + 20 * 0.55, width: 300 - 238, height: 20 * 0.45 },
    { left: 0, top: 26 + 20 * 0.55, width: 62, height: 20 * 0.45 },
  ]);
});

test('the component lays the bands under the words once the copies report', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<MarkedText parts={parseMarked('ab [cd] ef')} textStyle={{ fontSize: 10 }} />)); });
  expect(tree.root.findAll((n) => n.props.testID === 'marked-band' && typeof n.type === 'string')).toHaveLength(0);
  const withLayout = tree.root.findAll((n) => typeof n.type === 'string' && typeof n.props.onTextLayout === 'function');
  // [visible, a, c, b] — d is empty ('cd' ends the word), reported by its zero-width stand-in.
  const ev = (lines: object[]) => ({ nativeEvent: { lines } });
  act(() => {
    withLayout[0].props.onTextLayout(ev([L(0, 0, 80)]));
    withLayout[1].props.onTextLayout(ev([L(0, 0, 40)])); // 'ab cd'
    withLayout[2].props.onTextLayout(ev([L(0, 0, 40)])); // 'ab cd'
    withLayout[3].props.onTextLayout(ev([L(0, 0, 16)])); // 'cd'
  });
  const zero = tree.root.findAll((n) => typeof n.type === 'string' && typeof n.props.onLayout === 'function');
  act(() => { zero[zero.length - 1].props.onLayout({ nativeEvent: { layout: { width: 0, height: 0 } } }); });
  const bands = tree.root.findAll((n) => n.props.testID === 'marked-band' && typeof n.type === 'string');
  expect(bands).toHaveLength(1);
  expect(bands[0].props.style).toMatchObject({ left: 22, width: 20, backgroundColor: nb.marker });
});
