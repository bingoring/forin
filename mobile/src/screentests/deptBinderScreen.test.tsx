// 부서 간지(app/journey/dept/[dept].tsx)의 화면 배선. journey-binder-v42 Task G,
// task-G-brief.md §4·§5.
//
// 이 파일이 잠그는 것:
//  · GET /me/journey?dept=<라우트 파라미터>를 정확히 그 값으로, 한 번만 부른다(V4) —
//    부서 개수만큼 부르지 않는다.
//  · 저작된 주제가 없는 부서(서버 400)에는 오류 상태를 보여주고, 주제 카드를 지어내지
//    않는다.
//  · 주제를 누르면 `/journey/theme/<themeKey>`로 민다.
//  · 뒤로 가면 서가로 돌아간다(router.back()).
//
// DeptBinder.test.tsx가 이미 잠근 것(진행 격자, 인덱스 탭, 완료/이어하기 배지)은 여기서
// 다시 재지 않는다.
//
// @testing-library/react-native 미설치 — journeyScreen.test.tsx·journeyThemeScreen.test.tsx와
// 같은 react-test-renderer 관례를 따른다.
const mockPushed: string[] = [];
let mockBackCount = 0;
let mockDept = 'ICU';
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: (p: string) => mockPushed.push(p), back: () => { mockBackCount += 1; } }),
    useLocalSearchParams: () => ({ dept: mockDept }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});
jest.mock('@/api/client');

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Animated, Text } from 'react-native';
import DeptBinderScreen from '@/app/(tabs)/journey/dept/[dept]';
import { api, type JourneyView } from '@/api/client';
import type { JourneyCurriculum } from '@/components/journey/JourneyMap';
import { CURL_MS } from '@/components/nb/PageCurl';
import { CLOSE_CURL_MS, ENTER_MS, LEAVE_MS } from '@/components/journey/useBinderCoverFlight';
import { clearBinderFlyRect, setBinderFlyRect } from '@/data/journeyBinderFly';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

function findAllPressables(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

function themeCards(root: ReactTestInstance) {
  return findAllPressables(root).filter((n) => String(n.props?.testID ?? '').startsWith('theme-card-'));
}

const CURRICULA: JourneyCurriculum[] = [
  { themeKey: 't1', name: '체온 측정', track: 'core', done: 3, total: 3, resume: false },
  { themeKey: 't2', name: '투약 확인', track: 'core', done: 1, total: 4, resume: true },
] as unknown as JourneyCurriculum[];

const VIEW: JourneyView = {
  goalDept: 'ER', // 이 화면이 쓰지 않는 필드 — 있어도 화면에 드러나지 않아야 한다.
  track: { dept: 'ICU', curricula: CURRICULA },
  freeRoam: [],
} as unknown as JourneyView;

beforeEach(() => {
  mockPushed.length = 0;
  mockBackCount = 0;
  mockDept = 'ICU';
  jest.clearAllMocks();
  (api.journey as jest.Mock).mockResolvedValue(VIEW);
});

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<DeptBinderScreen />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

// 8. dept 파라미터가 'ICU'면 api.journey가 'ICU'로 한 번 불린다 — 인자 없이 부르지 않는다.
test('fetches the dept track by the exact route param, not the goal dept and not with no argument', async () => {
  mockDept = 'ICU';
  await mount();
  expect(api.journey).toHaveBeenCalledWith('ICU');
  expect(api.journey).not.toHaveBeenCalledWith();
  expect(api.journey).not.toHaveBeenCalledWith('ER'); // goalDept — this screen never asks for it
});

// 9. api.journey가 부서 개수만큼 불리지 않는다 — 화면이 서는 동안 호출이 정확히 1회다.
test('calls api.journey exactly once while the screen stands — not once per department', async () => {
  await mount();
  expect(api.journey).toHaveBeenCalledTimes(1);
});

test('shows the dept name in the header (the viewed dept, not the goal dept) and back returns to the shelf', async () => {
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'dept-binder-title' }).props.children).toBe('중환자실 ICU');
  await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
  expect(mockBackCount).toBe(1);
});

test('renders one theme card per curriculum entry and never mentions the goal dept', async () => {
  const tree = await mount();
  expect(themeCards(tree.root)).toHaveLength(CURRICULA.length);
});

test('pressing a theme card pushes the theme route for its exact themeKey', async () => {
  const tree = await mount();
  const card = themeCards(tree.root).find((n) => n.props?.testID === 'theme-card-t2')!;
  await act(async () => { card.props.onPress(); });
  expect(mockPushed).toEqual(['/journey/theme/t2']);
});

// 10. 불러오기가 400으로 실패하면 오류 상태가 뜨고, 주제 카드가 0개다.
test('a 400 (no authored topics for this dept) shows an error state with zero theme cards and a way back', async () => {
  (api.journey as jest.Mock).mockRejectedValueOnce({ response: { status: 400 } });
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'dept-binder-error' })).toBeTruthy();
  expect(themeCards(tree.root)).toHaveLength(0);
  // The header's own back button is still there as the way back to the shelf.
  await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
  expect(mockBackCount).toBe(1);
});

test('a load failure offers a retry that re-fetches the same dept', async () => {
  (api.journey as jest.Mock).mockRejectedValueOnce(new Error('network'));
  (api.journey as jest.Mock).mockResolvedValueOnce(VIEW);
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'dept-binder-error' })).toBeTruthy();

  const retry = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes('다시 시도'),
    { deep: true },
  )[0];
  expect(retry).toBeTruthy();
  await act(async () => { retry.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(themeCards(tree.root)).toHaveLength(CURRICULA.length);
  expect(api.journey).toHaveBeenCalledTimes(2);
  expect(api.journey).toHaveBeenLastCalledWith('ICU');
});

// ── 표지 날아오기 (journey-binder-v42 Task I, task-I-brief.md §7 items 1–8) ──────────
//
// `Animated.timing` is mocked here to capture every call rather than let it run — the
// state machine (`useBinderCoverFlight.ts`) advances phase by phase ONLY when the
// animation it started calls back "finished", and a test needs to trigger that at the
// exact moment it wants to inspect, not whenever this jest environment's approximation
// of the native clock happens to settle (which, checked by hand, resolves in well under a
// frame regardless of the requested duration — too fast to ever catch a phase in transit
// otherwise). `AccessibilityInfo.isReduceMotionEnabled` is mocked the same way
// `StationTrack.test.tsx` mocks it, for the identical reason (§5's own model).

/** 이 화면이 `Stack.Screen`에 건네는 전환 설정. */
function stackOptions(root: ReactTestInstance): { animation?: string } | undefined {
  const hit = root.findAll((n) => typeof n.type === 'function'
    && (n.type as { name?: string }).name === 'Screen')[0];
  return hit?.props?.options as { animation?: string } | undefined;
}

describe('binder cover flight', () => {
  type TimingRec = { duration?: number; toValue: number; value: Animated.Value; cb?: (r: { finished: boolean }) => void };
  let timingRecs: TimingRec[];
  let timingSpy: jest.SpyInstance;
  let reduceMotionSpy: jest.SpyInstance;

  const RECT = { x: 12, y: 500, width: 80, height: 121 };

  beforeEach(() => {
    clearBinderFlyRect();
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
    reduceMotionSpy = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>);
  });

  afterEach(() => {
    timingSpy.mockRestore();
    reduceMotionSpy.mockRestore();
    clearBinderFlyRect();
  });

  /** Finishes the `Animated.timing` call this hook/PageCurl started with this exact
   *  duration — the one lever these tests have to move the phase machine forward. */
  function findTiming(duration: number): TimingRec {
    const rec = timingRecs.find((r) => r.duration === duration);
    if (!rec) throw new Error(`no Animated.timing call with duration ${duration} (have: ${timingRecs.map((r) => r.duration).join(', ')})`);
    return rec;
  }
  function finish(rec: TimingRec) {
    rec.value.setValue(rec.toValue);
    rec.cb?.({ finished: true });
  }

  /** Mounts with a rect waiting, then plays ①(640ms) and ②(the default 1250ms open
   *  curl) all the way through, landing on 'settled' — the state the learner is
   *  actually reading the dept screen in. */
  async function mountSettled() {
    setBinderFlyRect('ICU', RECT);
    const tree = await mount();
    await act(async () => { finish(findTiming(ENTER_MS)); });
    await act(async () => { finish(findTiming(CURL_MS.out)); });
    return tree;
  }

  // 1. 스토어에 좌표가 있으면 표지 레이어가 그려진다.
  test('draws the cover layer when the shelf handed off a rect for this dept', async () => {
    setBinderFlyRect('ICU', RECT);
    const tree = await mount();
    expect(tree.root.findByProps({ testID: 'binder-cover-face' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'binder-cover-flight' })).toBeTruthy();
  });

  // 2. 스토어가 비어 있으면(서가를 거치지 않은 진입) 표지 없이 바로 간지가 선다.
  test('shows the dept screen directly, no cover, when the store has nothing for this dept', async () => {
    const tree = await mount();
    expect(tree.root.findAllByProps({ testID: 'binder-cover-face' })).toHaveLength(0);
    expect(tree.root.findByProps({ testID: 'dept-binder-title' })).toBeTruthy();
  });

  // 3. 연출과 무관하게 api.journey는 화면에 들어오는 즉시 한 번 불린다 — 연출이 끝난
  //    뒤가 아니다. 여기서 어떤 Animated.timing 콜백도 끝내지 않은 채로 확인한다 —
  //    표지가 여전히 날아오는 중이어도 요청은 이미 나가 있어야 한다.
  test('fetches api.journey immediately — before the cover animation has finished, not after', async () => {
    setBinderFlyRect('ICU', RECT);
    await mount();
    expect(api.journey).toHaveBeenCalledTimes(1);
    expect(api.journey).toHaveBeenCalledWith('ICU');
  });

  // 4. 모션 줄이기가 켜지면 표지 레이어가 아예 그려지지 않는다.
  test('draws no cover at all when reduce motion is on, even with a rect waiting', async () => {
    setBinderFlyRect('ICU', RECT);
    reduceMotionSpy.mockResolvedValue(true);
    const tree = await mount();
    expect(tree.root.findAllByProps({ testID: 'binder-cover-face' })).toHaveLength(0);
    expect(tree.root.findAllByProps({ testID: 'binder-cover-flight' })).toHaveLength(0);
  });

  // 5. ‹ 서가를 누르면 닫기가 시작되고, 끝나야 router.back()이 불린다.
  test('pressing back starts closing, and router.back() only fires once ④→⑤ both finish', async () => {
    const tree = await mountSettled();
    expect(mockBackCount).toBe(0);

    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    expect(mockBackCount).toBe(0); // 닫기(④)가 막 시작됐을 뿐이다
    // PageCurl은 표지를 12조각으로 복제해 그린다(하나의 페이지를 곡면으로 보이려는
    // 장치, PageCurl.tsx 자신의 주석 참고) — findByProps는 정확히 하나를 요구하니
    // findAllByProps로 "적어도 하나(닫는 표지가 다시 섰다)"만 확인한다.
    expect(tree.root.findAllByProps({ testID: 'binder-cover-face' }).length).toBeGreaterThan(0);

    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); }); // ④ 끝
    expect(mockBackCount).toBe(0); // 이제 날아 돌아가는 중(⑤) — 아직이다

    await act(async () => { finish(findTiming(LEAVE_MS)); }); // ⑤ 끝
    expect(mockBackCount).toBe(1);
  });

  // 6. 닫기를 연속으로 두 번 눌러도 router.back()은 한 번만 불린다.
  test('pressing back twice in a row while closing calls router.back() only once', async () => {
    const tree = await mountSettled();
    const back = tree.root.findByProps({ testID: 'dept-binder-back' });
    await act(async () => { back.props.onPress(); });
    await act(async () => { back.props.onPress(); }); // 두 번째는 무시된다 — 두 번째 닫기 넘김이 새로 생기지 않는다
    expect(timingRecs.filter((r) => r.duration === CLOSE_CURL_MS)).toHaveLength(1);

    // ④가 끝나 이제 ⑤(날아 돌아가기, phase 'leaving')가 도는 중이다 — 이 시점에서
    // 또 눌러도 새 'closing'으로 되돌아가지 않는다는 것까지 확인한다. 이 3번째 누름은
    // "같은 값으로 다시 setPhase('closing')"이 아니라 '"leaving' 도중에 setPhase
    // ('closing')"이라 리액트의 동일-값 state bail-out으로는 가려지지 않는 경우다
    // — 여기서 실제로 closingRef 가드가 하는 일이 드러난다.
    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); });
    await act(async () => { back.props.onPress(); });
    expect(timingRecs.filter((r) => r.duration === CLOSE_CURL_MS)).toHaveLength(1);

    await act(async () => { finish(findTiming(LEAVE_MS)); });
    expect(mockBackCount).toBe(1);
  });

  // 7. 표지에 그 부서의 코드와 짧은 이름이 찍힌다.
  test('the cover shows the dept code and its short name', async () => {
    setBinderFlyRect('ICU', RECT);
    const tree = await mount();
    expect(tree.root.findByProps({ testID: 'binder-cover-code' }).props.children).toBe('ICU');
    expect(tree.root.findByProps({ testID: 'binder-cover-name' }).props.children).toBe('중환자실');
  });

  // 8. 닫는 넘김에 800밀리초가 넘어간다 — 온보딩 기본값(1100)이 아니다.
  test('the closing curl runs at 800ms, not the onboarding default of 1100ms', async () => {
    const tree = await mountSettled();
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    expect(findTiming(CLOSE_CURL_MS).duration).toBe(800);
    expect(timingRecs.some((r) => r.duration === CURL_MS.in)).toBe(false);
  });

  // 좌표를 들고 오지 않은 진입(딥링크, 측정이 안 닿은 경우)에서는 기본 밀기가 그대로
  // 있어야 한다. 이 라우트에 `animation: 'none'`을 조건 없이 걸어 두면 그런 진입이
  // 아무 움직임 없는 뚝 끊김이 된다.
  it('좌표가 있으면 기본 밀기를 끄고, 없으면 켜 둔다', async () => {
    setBinderFlyRect('ICU', RECT);
    const withRect = await mount();
    expect(stackOptions(withRect.root)?.animation).toBe('none');

    clearBinderFlyRect();
    const withoutRect = await mount();
    expect(stackOptions(withoutRect.root)?.animation).toBe('slide_from_right');
  });

  // 도착 연출이 끝나면 기본 전환을 돌려준다. 계속 'none'으로 두면 iOS가 왼쪽 가장자리
  // 스와이프로 뒤로 가는 동작을 내주지 않아, 화면에 갇힌 것처럼 보인다 — 실기에서
  // 뒤로가기가 안 되는 것처럼 보인 원인이다.
  it('표지가 다 펼쳐지면 기본 전환을 돌려준다 — 스와이프로 뒤로 갈 수 있게', async () => {
    const tree = await mountSettled();
    expect(stackOptions(tree.root)?.animation).toBe('slide_from_right');
  });

  // 모션 줄이기가 켜지면 연출 자체가 없으므로 처음부터 기본 전환이어야 한다.
  it('모션 줄이기가 켜져 있으면 좌표가 있어도 기본 전환이다', async () => {
    (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(true);
    setBinderFlyRect('ICU', RECT);
    const tree = await mount();
    expect(stackOptions(tree.root)?.animation).toBe('slide_from_right');
  });

});
