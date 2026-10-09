// 모션 줄이기가 켜져 있으면 뜯김은 기다리지 않는다 — 콜백과 다음 장이 바로 온다.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));

import { createRef, useState } from 'react';
import { AccessibilityInfo, Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import { LessonSheet, SheetStack, type SheetStackHandle } from './SheetStack';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

test('tear with reduced motion: torn, advanced and the next sheet at rest, without waiting', async () => {
  const stack = createRef<SheetStackHandle>();
  const log: string[] = [];
  function Deck() {
    const [i, setI] = useState(0);
    return (
      <SheetStack
        ref={stack}
        index={i}
        total={3}
        renderSheet={(k, mode) => <LessonSheet testID={`sheet-${k}-${mode}`} typeLabel="t" n={k + 1} total={3}><Text>{k}</Text></LessonSheet>}
        onAdvance={() => { log.push('advance'); setI((n) => n + 1); }}
      />
    );
  }
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Deck />)); });
  await act(async () => { await Promise.resolve(); });
  await act(async () => { stack.current!.tear('right', () => log.push('torn')); });
  expect(log).toEqual(['torn', 'advance']);
  expect(tree.root.findAll((n) => n.props?.testID === 'sheet-1-current', { deep: true }).length).toBeGreaterThan(0);
  const rise = tree.root.findAll((n) => n.props?.testID === 'sheet-current-rise' && typeof n.type === 'string', { deep: true })[0];
  const flat = Object.assign({}, ...[rise.props.style].flat(5).filter(Boolean));
  const v = (flat.transform as Record<string, unknown>[]).find((e) => 'translateY' in e)!.translateY as number | { __getValue(): number };
  const ty = typeof v === 'number' ? v : v.__getValue();
  expect(ty).toBe(0);
});
