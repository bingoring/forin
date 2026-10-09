// 모션 줄이기 — 켜져 있으면 모든 수첩 모션이 즉시 최종 상태로 가고, 끝 콜백은 바로 불린다.
//
// 따로 둔 파일인 이유: 설정은 앱 전체에 한 번 구독하는 모듈 값이라, 처음 묻는 순간의 답이 이
// 파일 전체의 답이 된다. 여기서는 처음부터 "켜짐"으로 답하게 한다.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { AccessibilityInfo, Animated, View } from 'react-native';
import { act, create } from 'react-test-renderer';
import { NbEnter, useNbPress, useNbShake, useNbTear } from './nbMotion';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

async function mount(el: React.ReactElement) {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(el)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

function now(view: ReturnType<typeof create>['root']) {
  const flat = Object.assign({}, ...[view.props.style].flat(3).filter(Boolean));
  const read = (v: unknown) => (v && typeof (v as { __getValue?: unknown }).__getValue === 'function' ? (v as { __getValue: () => unknown }).__getValue() : v);
  const t: Record<string, unknown> = {};
  for (const e of (flat.transform ?? []) as Record<string, unknown>[]) for (const [k, v] of Object.entries(e)) t[k] = read(v);
  return { opacity: read(flat.opacity), ...t } as Record<string, unknown>;
}

test('a sheet torn while motion is reduced is gone at once, and the next sheet is called for', async () => {
  // The first answer arrives after the first mount — the motion that started is cut to its
  // end rather than left playing.
  const ends: string[] = [];
  function Tearing() { return <Animated.View style={useNbTear('right', () => ends.push('torn'))} />; }
  const first = await mount(<Tearing />);
  expect(now(first.root.findByType(Animated.View))).toMatchObject({ rotate: '22deg', translateX: 300, opacity: 0 });
  expect(ends).toEqual(['torn']);

  // Once known, a new mount starts AT its end — no timing at all.
  const timing = jest.spyOn(Animated, 'timing');
  const second = await mount(<Tearing />);
  expect(now(second.root.findByType(Animated.View))).toMatchObject({ rotate: '22deg', translateX: 300, opacity: 0 });
  expect(ends).toEqual(['torn', 'torn']);
  expect(timing).not.toHaveBeenCalled();
  timing.mockRestore();
});

test('entrances land on their last frame, shakes and presses do not travel', async () => {
  const tree = await mount(<NbEnter kind="ok"><View /></NbEnter>);
  expect(now(tree.root.findByType(Animated.View))).toMatchObject({ scale: 1, rotate: '-10deg', opacity: 1 });

  let shake!: ReturnType<typeof useNbShake>;
  let press!: ReturnType<typeof useNbPress>;
  function Both() { shake = useNbShake(); press = useNbPress(); return <Animated.View style={shake.style} />; }
  const t2 = await mount(<Both />);
  const done = jest.fn();
  act(() => shake.shake(done));
  expect(done).toHaveBeenCalledTimes(1);
  expect(now(t2.root.findByType(Animated.View)).translateX).toBe(0);
  act(() => press.onPressIn());
  expect((press.p as unknown as { __getValue(): number }).__getValue()).toBe(1);
});
