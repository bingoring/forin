// Measuring a shelf binder's on-screen rect for the fly-in cover (journey-binder-v42
// Task I, task-I-brief.md §2 point 1). Pulled out of BinderShelf.tsx into its own module
// for one reason: BinderShelf.test.tsx has to be able to fake a SUCCESSFUL measurement,
// and there is no way to do that against the real bridge call — `View#measureInWindow`
// exists on a host component instance under jest-expo (`typeof` it is `'function'`), but
// its native side is stubbed to a no-op that never invokes the callback, not even after a
// real wall-clock wait (confirmed by hand before writing this). Mocking this module is
// the only way to exercise "measurement succeeded" in a test.
//
// 측정은 누를 때마다 한다. 마운트 때 한 번 재어 두는 쪽이 간단하지만 서가가 스크롤되는
// 순간 그 값이 거짓이 된다 — 부서가 29개라 여덟 줄이고, 아래쪽 줄의 바인더를 누르면
// 마운트 당시의 좌표, 곧 화면 밖 한참 아래에서 표지가 날아온다.
//
// 그러면서도 이동을 막지 않는다(task-I-brief.md §1: "측정이 실패하거나 늦으면 연출 없이
// 그냥 연다"). 제한 시간이 그 약속을 지킨다.
import type { RefObject } from 'react';
import type { View } from 'react-native';
import type { BinderRect } from '@/data/journeyBinderFly';

/** The shape `View#measureInWindow` actually has — not exported by `react-native`'s own
 *  types on every RN version, so this is spelled out rather than imported. */
type Measurable = { measureInWindow?: (cb: (x: number, y: number, width: number, height: number) => void) => void };

/** 콜백이 돌아오지 않을 때 연출 없이 그냥 열기까지 기다리는 최대 시간. 기기에서는
 *  브리지가 한 프레임 안에 답하므로 이 시간이 쓰이는 일은 거의 없고, 답이 없는 환경
 *  (jest, 브리지가 멈춘 경우)에서 이동이 막히지 않게 하는 것이 이 값의 유일한 일이다. */
export const MEASURE_TIMEOUT_MS = 60;

/**
 * 바인더의 화면 좌표를 재어 `onDone`을 **정확히 한 번** 부른다. 네이티브 콜백이
 * 먼저 오면 좌표와 함께, 제한 시간이 먼저 지나면 좌표 없이 부른다.
 *
 * 누를 때마다 다시 재는 것이 핵심이다. 마운트 때 한 번만 재어 두면 서가가 스크롤되는
 * 순간 그 값이 거짓이 된다 — 부서가 29개라 여덟 줄이고, 아래쪽 줄의 바인더를 누르면
 * 마운트 당시의 좌표, 즉 화면 밖 한참 아래에서 표지가 날아온다.
 *
 * 그러면서도 이동을 막지 않는다. 좌표를 기다리느라 화면이 안 넘어가는 것은 연출이
 * 비용이 되는 자리이고, 연출은 지연을 가리는 데 써야지 지연을 만드는 데 쓰면 안 된다.
 */
export function measureBinderRect(
  ref: RefObject<View | null>,
  onDone: (rect?: BinderRect) => void,
  timeoutMs: number = MEASURE_TIMEOUT_MS,
): void {
  let settled = false;
  const settle = (rect?: BinderRect) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    onDone(rect);
  };
  const timer = setTimeout(() => settle(), timeoutMs);

  const view = ref.current as unknown as Measurable | null;
  if (!view || typeof view.measureInWindow !== 'function') { settle(); return; }
  try {
    view.measureInWindow((x, y, width, height) => settle({ x, y, width, height }));
  } catch {
    settle();
  }
}
