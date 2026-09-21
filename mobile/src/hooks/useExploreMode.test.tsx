// useExploreMode — device-local toggle for the department-interior demo (see the hook's
// own header comment for the "why").
//
// @testing-library/react-native's renderHook is NOT installed in this repo (task-15-brief.md
// assumed it; confirmed absent, zero uses anywhere in src/). The repo convention for testing
// a hook is CurrentStationBar.test.tsx's shape: mount a minimal component that calls the
// hook and hands its return value out, via react-test-renderer.
//
// The hook's state lives at MODULE scope (mirrors lib/wardPresence.ts — needed so a toggle
// in 나 tab is seen by the home tab without a remount). That means a fresh test needs a
// fresh module instance to check "defaults to on" or "a read failure falls back to the
// default" in isolation. jest.resetModules() alone is not enough here: this hook also calls
// React's own useSyncExternalStore, and resetting the WHOLE registry gives the hook a
// different 'react' module instance than the one react-test-renderer (imported once, at
// the top of this file) is already bound to — two React copies in one tree, which throws
// ("Cannot read properties of null (reading 'useSyncExternalStore')") the moment a hook
// runs. jest.isolateModules() sidesteps this by loading react, react-native,
// react-test-renderer, expo-secure-store's mock and the hook together, inside one sandboxed
// require pass, so everything in a given harness agrees on which 'react' it is.
import { trackMounts } from '@/testing/mountRegistry';
import type { ExploreMode } from './useExploreMode';

const mount = trackMounts();

type SecureStoreMock = { getItemAsync: jest.Mock; setItemAsync: jest.Mock };

type Harness = {
  React: typeof import('react');
  RTR: typeof import('react-test-renderer');
  Text: typeof import('react-native').Text;
  useExploreMode: () => ExploreMode;
};

/** Loads a self-consistent (React + renderer + hook) triple against the given
 *  expo-secure-store stand-in, as a fresh module registry — standing in for a fresh app
 *  launch, since the hook's hydration flag and in-memory value only ever run/reset once
 *  per module lifetime. */
function loadHarness(secureStore: SecureStoreMock): Harness {
  let harness!: Harness;
  jest.isolateModules(() => {
    jest.doMock('expo-secure-store', () => secureStore);
    harness = {
      React: require('react'),
      RTR: require('react-test-renderer'),
      Text: require('react-native').Text,
      useExploreMode: (require('./useExploreMode') as typeof import('./useExploreMode')).useExploreMode,
    };
  });
  return harness;
}

/** Mounts a probe component that calls the hook and exposes its live return value. */
function renderProbe(h: Harness) {
  let last!: ExploreMode;
  function Probe() {
    const r = h.useExploreMode();
    last = r;
    return h.React.createElement(h.Text, null, String(r.enabled));
  }
  let tree!: ReturnType<typeof h.RTR.create>;
  h.RTR.act(() => {
    tree = h.RTR.create(h.React.createElement(Probe));
  });
  // Registered so a thrown assertion later in the test still gets this tree torn down
  // (mountRegistry.ts — a tree left mounted keeps its effects alive into the next suite).
  mount(tree);
  return { tree, get result() { return last; } };
}

function okStore(): SecureStoreMock {
  return {
    getItemAsync: jest.fn().mockResolvedValue(null),
    setItemAsync: jest.fn().mockResolvedValue(undefined),
  };
}

describe('useExploreMode', () => {
  it('defaults to on', () => {
    const h = loadHarness(okStore());
    const { tree, result } = renderProbe(h);
    expect(result.enabled).toBe(true);
  });

  // 저장소가 막힌 기기(프라이빗 모드 등)에서도 화면이 죽지 않아야 한다: 쓰기가 던져도
  // 메모리는 이번 실행에 한해 반영된다.
  it('survives a storage that throws on write — the change still lands in memory', async () => {
    const h = loadHarness({
      getItemAsync: jest.fn().mockResolvedValue(null),
      setItemAsync: jest.fn().mockRejectedValue(new Error('blocked')),
    });
    // NOT destructured: `result` is a getter that re-reads the latest render each time it
    // is accessed, and destructuring it once would snapshot the pre-toggle value instead.
    const probe = renderProbe(h);
    await h.RTR.act(async () => {
      probe.result.setEnabled(false);
    });
    expect(probe.result.enabled).toBe(false);
  });

  // 읽기가 던져도 기본값(켬)으로 떨어질 뿐 화면은 그대로 그려진다.
  it('survives a storage that throws on read — falls back to the default (on)', async () => {
    const getItemAsync = jest.fn().mockRejectedValue(new Error('blocked'));
    const h = loadHarness({ getItemAsync, setItemAsync: jest.fn().mockResolvedValue(undefined) });
    const probe = renderProbe(h);
    // let hydrate()'s rejected read settle
    await h.RTR.act(async () => {});
    // The default alone can't tell a caught failure from a read that never ran — assert the
    // mocked read was actually reached, so this is not a stub that would pass unmounted.
    expect(getItemAsync).toHaveBeenCalledWith('forin.exploreMode');
    expect(probe.result.enabled).toBe(true);
  });

  // A stubbed store that always answers a fixed value would pass every test above without
  // ever exercising the real read/write path — this branch's own "hidden bug" lesson
  // (task-15-report.md). This proves an OFF choice round-trips through the same functions a
  // real device would use: write on one "launch", then read it back on the next.
  it('a turned-off state written to the device is read back on the next launch', async () => {
    const backing: Record<string, string> = {};
    const store = (): SecureStoreMock => ({
      getItemAsync: jest.fn(async (k: string) => (k in backing ? backing[k] : null)),
      setItemAsync: jest.fn(async (k: string, v: string) => { backing[k] = v; }),
    });

    const first = loadHarness(store());
    const probe1 = renderProbe(first);
    await first.RTR.act(async () => {
      probe1.result.setEnabled(false);
    });
    expect(backing['forin.exploreMode']).toBe('0');

    // A fresh module registry stands in for the next app launch, reading the same
    // device-backed store.
    const second = loadHarness(store());
    const probe2 = renderProbe(second);
    expect(probe2.result.enabled).toBe(true); // nothing hydrated yet — default still shows
    await second.RTR.act(async () => {}); // flush the hydrate() effect's read
    expect(probe2.result.enabled).toBe(false);
  });

  // This is the actual reason the hook keeps its state at MODULE scope (subscribe via
  // useSyncExternalStore) instead of a plain useState: a toggle in 나 tab has to reach the
  // home tab's own mounted instance of this hook without either screen remounting. None of
  // the tests above exercise that — they each load a fresh harness (a fresh module registry
  // stands in for a fresh app LAUNCH), so two mounts inside the SAME run were never proven
  // to see each other. Two independent trees from the SAME harness are two independent
  // mounted instances of the hook sharing the one module's state, same as index.tsx and
  // me.tsx do inside one running app.
  it('a change in one mounted instance reaches another mounted instance in the same run, without remounting either', async () => {
    const h = loadHarness(okStore());
    const probeA = renderProbe(h);
    const probeB = renderProbe(h);
    expect(probeA.result.enabled).toBe(true);
    expect(probeB.result.enabled).toBe(true);

    // Toggled from A's instance only — B is never touched, unmounted, or recreated.
    await h.RTR.act(async () => {
      probeA.result.setEnabled(false);
    });

    expect(probeB.result.enabled).toBe(false);
  });
});
