// RecallPrompt pieces the screen test does not reach: the scale dot's `transition: all .15s`,
// the single-word fill hint, and the inert copies (dim next sheet · torn copy) that must not
// answer or carry test ids.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-speech', () => ({ speak: () => {}, stop: () => {} }));

import { Animated } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { RecallPrompt, SliderDot } from './RecallPrompt';
import type { LessonWord } from '@/api/client';
import type { RecallCard } from '@/data/recall';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
const realTiming = Animated.timing;
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => realTiming(v, { ...cfg, useNativeDriver: false }));
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
const style = (n: ReactTestInstance) => Object.fromEntries(Object.entries(Object.assign({}, ...[n.props.style].flat(5).filter(Boolean))).map(([k, v]) => [k, read(v)]));
const texts = (root: ReactTestInstance) => root.findAll((n) => String(n.type) === 'Text', { deep: true }).flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));

test('the scale dot grows 18 → 26 over .15s, its centre held on the axis (margin 13 → 9), the colours following', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<SliderDot big={false} border="#000000" fill="#ffffff" />)); });
  const dot = () => tree.root.findAll((n) => n.props.testID === 'recall-scale-dot' && typeof n.type === 'string')[0];
  expect(style(dot())).toMatchObject({ width: 18, height: 18, marginTop: 13, shadowOpacity: 0 });
  act(() => { tree.update(<SliderDot big border="#ff0000" fill="#ff0000" />); });
  act(() => { jest.advanceTimersByTime(75); });
  const mid = style(dot()) as { width: number; marginTop: number };
  expect(mid.width).toBeGreaterThan(18);
  expect(mid.width).toBeLessThan(26);
  expect(mid.width / 2 + mid.marginTop).toBeCloseTo(22, 5);
  act(() => { jest.advanceTimersByTime(100); });
  expect(style(dot())).toMatchObject({ width: 26, height: 26, marginTop: 9, borderRadius: 13, shadowOpacity: 0.3, backgroundColor: 'rgba(255, 0, 0, 1)' });
});

const word = (chips: string[][]): LessonWord => ({ id: 'w', en: chips.map((c) => c.join('')).join(' '), ko: '뜻', chips, decoyChips: ['zz'] });

test('fill: the hint adds 띄어쓰기는 자동 only when the answer is more than one word', () => {
  const one: RecallCard = { kind: 'word', word: word([['hypo', 'tens', 'ive']]), type: 'fill' };
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<RecallPrompt card={one} pool={[]} answer={null} onAnswer={() => {}} result={null} />)); });
  expect(texts(tree.root)).toContain('조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요');
  const two: RecallCard = { kind: 'word', word: word([['en'], ['route']]), type: 'fill' };
  act(() => { tree.update(<RecallPrompt card={two} pool={[]} answer={null} onAnswer={() => {}} result={null} />); });
  expect(texts(tree.root)).toContain('조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요 · 띄어쓰기는 자동');
});

test('an inert copy answers nothing and carries no test ids', () => {
  const card: RecallCard = { kind: 'word', word: word([['en'], ['route']]), type: 'fill' };
  const got: unknown[] = [];
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<RecallPrompt card={card} pool={[]} answer={['en']} onAnswer={(a) => got.push(a)} result={null} inert />)); });
  expect(tree.root.findAll((n) => String(n.props.testID ?? '').startsWith('recall-'))).toHaveLength(0);
  const pressables = tree.root.findAll((n) => typeof n.props.onPress === 'function' && n.props.disabled === false);
  expect(pressables).toHaveLength(0);
  expect(got).toEqual([]);
});
