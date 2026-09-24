// BinderExitOverlay.tsx — journey-binder-v42 Task J, task-J-brief.md §7 items 6–10.
//
// This component is mounted once, permanently, beside the journey tab's Stack
// (journey/_layout.tsx) — it is never mounted fresh per test the way a screen is. Every
// test here mounts it once and drives the shared `journeyBinderExit` store instead.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Animated } from 'react-native';
import { BinderExitOverlay } from '@/components/journey/BinderExitOverlay';
import { LEAVE_MS } from '@/components/journey/useBinderCoverFlight';
import { clearBinderExit, requestBinderExit } from '@/data/journeyBinderExit';
import { trackMounts } from '../../testing/mountRegistry';

const track = trackMounts();

const REQUEST = { dept: 'ICU', rect: { x: 12, y: 500, width: 80, height: 121 }, doneTopics: 1, totalTopics: 4 };

type TimingRec = { duration?: number; toValue: number; value: Animated.Value; cb?: (r: { finished: boolean }) => void };

describe('BinderExitOverlay', () => {
  let timingRecs: TimingRec[];
  let timingSpy: jest.SpyInstance;

  beforeEach(() => {
    clearBinderExit(); // isolation between tests — nothing left over from a prior request
    timingRecs = [];
    timingSpy = jest.spyOn(Animated, 'timing').mockImplementation(((value: Animated.Value, config: { toValue: number; duration?: number }) => {
      const rec: TimingRec = { duration: config.duration, toValue: config.toValue, value };
      timingRecs.push(rec);
      return {
        start: (cb?: (r: { finished: boolean }) => void) => { rec.cb = cb; },
        stop: jest.fn(),
        reset: jest.fn(),
      };
    }) as unknown as typeof Animated.timing);
    // Not under test here (this overlay never reads reduce motion — the dept screen
    // already decided whether a flight ever started, before it ever called
    // requestBinderExit), mocked only so nothing this file mounts leaves a stray
    // unresolved promise behind.
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>);
  });

  afterEach(() => {
    timingSpy.mockRestore();
    jest.restoreAllMocks();
    // Wrapped in act() — the tree this describe's tests mounted is still standing here
    // (trackMounts's own afterEach, registered at file scope, unmounts it AFTER this
    // one runs), so clearing a store a test left non-empty (e.g. one that never played
    // ⑤ to completion) is a real state update on a live component.
    act(() => { clearBinderExit(); });
  });

  function findTiming(duration: number): TimingRec {
    const rec = timingRecs.find((r) => r.duration === duration);
    if (!rec) throw new Error(`no Animated.timing call with duration ${duration} (have: ${timingRecs.map((r) => r.duration).join(', ')})`);
    return rec;
  }
  function finish(rec: TimingRec) {
    rec.value.setValue(rec.toValue);
    rec.cb?.({ finished: true });
  }

  function mount() {
    let tree!: ReturnType<typeof create>;
    act(() => { tree = track(create(<BinderExitOverlay />)); });
    return tree;
  }

  /** `Animated.View` renders as a composite wrapper around nested host `View`s, and all
   *  of them carry whatever `testID` was passed — a plain (deep) `findAllByProps` walks
   *  into an already-matched node's children and counts those too. `{ deep: false }`
   *  stops descending the moment a node matches, which is what `findByProps` itself uses
   *  under the hood — this is "how many flight LAYERS are on screen", not "how many
   *  nodes happen to carry this testID". */
  function exitFlightNodes(root: ReactTestInstance) {
    return root.findAllByProps({ testID: 'binder-exit-flight' }, { deep: false });
  }

  // 6. 스토어가 비어 있으면 아무것도 그리지 않는다.
  test('draws nothing while the store is empty', () => {
    const tree = mount();
    expect(tree.toJSON()).toBeNull();
  });

  // 7. 요청이 들어오면 표지가 서고, 그 부서의 코드가 보인다.
  test('a request stands the cover up, showing that dept\'s code', async () => {
    const tree = mount();
    await act(async () => { requestBinderExit(REQUEST); });
    expect(tree.root.findByProps({ testID: 'binder-exit-flight' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'binder-cover-code' }).props.children).toBe('ICU');
  });

  // 8. 600ms 애니메이션이 끝나면 스토어가 비고 표지가 사라진다.
  test('once the 600ms flight finishes, the store empties and the cover disappears', async () => {
    const tree = mount();
    await act(async () => { requestBinderExit(REQUEST); });
    expect(exitFlightNodes(tree.root)).toHaveLength(1);

    await act(async () => { finish(findTiming(LEAVE_MS)); });
    expect(exitFlightNodes(tree.root)).toHaveLength(0);
    expect(tree.toJSON()).toBeNull();
  });

  // 9. 애니메이션이 LEAVE_MS로 돈다 — 값이 훅과 같은 상수에서 온다 (import한 그 상수가
  //    실제로 Animated.timing에 실린 값인지 — 복사된 별도의 600이 아니라).
  test('the flight runs for exactly LEAVE_MS — the same constant the hook exports, not a copy', async () => {
    mount();
    await act(async () => { requestBinderExit(REQUEST); });
    expect(LEAVE_MS).toBe(600);
    expect(findTiming(LEAVE_MS).duration).toBe(LEAVE_MS);
  });

  // 10. 요청이 연달아 두 번 들어와도 표지가 두 겹으로 서지 않는다.
  test('two requests back to back never stack two covers', async () => {
    const tree = mount();
    await act(async () => { requestBinderExit(REQUEST); });
    await act(async () => { requestBinderExit({ ...REQUEST, dept: 'ER' }); });
    expect(exitFlightNodes(tree.root)).toHaveLength(1);
    expect(tree.root.findByProps({ testID: 'binder-cover-code' }).props.children).toBe('ER');
  });
});
