// 듣고 뜻 고르기 파형 — 소리가 나는 동안만 움직이고, 끝나면 핸드오프 높이(SL:29)로 돌아온다(사용자 결정 2026-10-09).
import { AccessibilityInfo, Animated } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { WAVE, Wave, type Voice } from './SentPrompt';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

const realTiming = Animated.timing;
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  // The native driver never steps in a test renderer; run the same timings on the JS driver.
  jest.spyOn(Animated, 'timing').mockImplementation((v, cfg) => realTiming(v, { ...cfg, useNativeDriver: false }));
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });
const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => number }).__getValue() : v) as number;
const scales = (root: ReactTestInstance) => root
  .findAll((n) => typeof n.type === 'string' && n.props.testID === 'sent-wave-bar')
  .map((n) => read([n.props.style].flat(5).find((x) => x && x.transform)!.transform[0].scaleY));

test('rests at the handoff heights, moves while speaking (each word kicks it), and settles back when done', () => {
  let tree!: ReturnType<typeof create>;
  const render = (v: Voice) => act(() => { if (tree) tree.update(<Wave voice={v} />); else tree = track(create(<Wave voice={v} />)); });
  render({ speaking: false, beat: 0 });
  const rest = WAVE.map((h) => h / 24);
  scales(tree.root).forEach((v, k) => expect(v).toBeCloseTo(rest[k]));
  // one colour — no fixed 'played so far' split (사용자 결정 2026-10-09)
  const colours = tree.root.findAll((n) => typeof n.type === 'string' && n.props.testID === 'sent-wave-bar')
    .map((n) => [n.props.style].flat(5).find((x) => x && x.backgroundColor)!.backgroundColor);
  expect(new Set(colours).size).toBe(1);

  render({ speaking: true, beat: 1 });
  advance(300);
  const moving = scales(tree.root);
  expect(moving.some((v, k) => Math.abs(v - rest[k]) > 0.01)).toBe(true);
  moving.forEach((v) => { expect(v).toBeGreaterThanOrEqual(4 / 24 - 1e-6); expect(v).toBeLessThanOrEqual(1 + 1e-6); });

  render({ speaking: true, beat: 2 }); // a word boundary
  advance(100);
  expect(scales(tree.root)).not.toEqual(moving);

  render({ speaking: false, beat: 2 });
  advance(400);
  scales(tree.root).forEach((v, k) => expect(v).toBeCloseTo(rest[k]));
});
