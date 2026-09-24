// 부서 간지(app/journey/dept/[dept].tsx)의 화면 배선. journey-binder-v42 Task G,
// task-G-brief.md §4·§5.
//
// 이 파일이 잠그는 것:
//  · GET /me/journey?dept=<라우트 파라미터>를 정확히 그 값으로, 한 번만 부른다(V4) —
//    부서 개수만큼 부르지 않는다.
//  · 저작된 주제가 없는 부서(서버 400)에는 오류 상태를 보여주고, 주제 카드를 지어내지
//    않는다.
//  · 주제를 누르면 `/journey/theme/<themeKey>`로 민다.
//  · 뒤로 가면 서가로 돌아간다 — 돌아갈 화면이 있으면 router.back(), 없으면(딥링크)
//    router.replace('/journey')(journey-binder-v42 Task J, task-J-brief.md §5).
//
// DeptBinder.test.tsx가 이미 잠근 것(진행 격자, 인덱스 탭, 완료/이어하기 배지)은 여기서
// 다시 재지 않는다.
//
// @testing-library/react-native 미설치 — journeyScreen.test.tsx·journeyThemeScreen.test.tsx와
// 같은 react-test-renderer 관례를 따른다.
const mockPushed: string[] = [];
const mockReplaced: string[] = [];
let mockBackCount = 0;
let mockCanGoBack = true;
let mockDept = 'ICU';
// Shared with the `requestBinderExit` mock below — records which of the two fired
// first, for the "hand-off before departure" ordering test (task-J-brief.md §7 item 3).
const callOrder: string[] = [];
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({
      push: (p: string) => mockPushed.push(p),
      back: () => { mockBackCount += 1; callOrder.push('back'); },
      canGoBack: () => mockCanGoBack,
      replace: (p: string) => { mockReplaced.push(p); callOrder.push('replace'); },
    }),
    useLocalSearchParams: () => ({ dept: mockDept }),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});
jest.mock('@/api/client');
// Task J — journeyBinderExit is the hand-off THIS screen makes to the overlay
// (BinderExitOverlay.tsx, mounted only in journey/_layout.tsx, not here). Auto-mocked so
// `requestBinderExit` is a plain jest.fn() this file can assert on directly, the same way
// `@/api/client` is mocked above.
jest.mock('@/data/journeyBinderExit');

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Animated, Text } from 'react-native';
import DeptBinderScreen from '@/app/(tabs)/journey/dept/[dept]';
import { api, type JourneyView } from '@/api/client';
import type { JourneyCurriculum } from '@/components/journey/JourneyMap';
import { CURL_MS } from '@/components/nb/PageCurl';
import { CLOSE_CURL_MS, ENTER_MS, LEAVE_MS } from '@/components/journey/useBinderCoverFlight';
import { clearBinderFlyRect, setBinderFlyRect } from '@/data/journeyBinderFly';
import { requestBinderExit } from '@/data/journeyBinderExit';
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
  mockReplaced.length = 0;
  callOrder.length = 0;
  mockBackCount = 0;
  mockCanGoBack = true;
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
    (requestBinderExit as jest.Mock).mockImplementation(() => callOrder.push('request'));
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

  // 5. 서가를 누르면 닫기(④)가 시작되고, ④가 끝나는 그 자리에서 router.back()이
  //    불린다 — ⑤(600ms, task-J-brief.md 이후로는 BinderExitOverlay의 몫)를
  //    기다리지 않는다.
  test('pressing back starts closing, and router.back() fires the instant ④ finishes — not after LEAVE_MS', async () => {
    const tree = await mountSettled();
    expect(mockBackCount).toBe(0);

    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    expect(mockBackCount).toBe(0); // 닫기(④)가 막 시작됐을 뿐이다
    // PageCurl은 표지를 12조각으로 복제해 그린다(하나의 페이지를 곡면으로 보이려는
    // 장치, PageCurl.tsx 자신의 주석 참고) — findByProps는 정확히 하나를 요구하니
    // findAllByProps로 "적어도 하나(닫는 표지가 다시 섰다)"만 확인한다.
    expect(tree.root.findAllByProps({ testID: 'binder-cover-face' }).length).toBeGreaterThan(0);

    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); }); // ④ 끝
    expect(mockBackCount).toBe(1); // 곧바로 — LEAVE_MS 타이밍은 이 화면에 아예 없다
    expect(timingRecs.some((r) => r.duration === LEAVE_MS)).toBe(false);
  });

  // 6. 닫기를 연속으로 두 번 눌러도(그리고 ④가 끝난 뒤 또 한 번 눌러도) router.back()은
  //    한 번만 불린다.
  test('pressing back twice in a row while closing calls router.back() only once', async () => {
    const tree = await mountSettled();
    const back = tree.root.findByProps({ testID: 'dept-binder-back' });
    await act(async () => { back.props.onPress(); });
    await act(async () => { back.props.onPress(); }); // 두 번째는 무시된다 — 두 번째 닫기 넘김이 새로 생기지 않는다
    expect(timingRecs.filter((r) => r.duration === CLOSE_CURL_MS)).toHaveLength(1);

    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); }); // ④ 끝 — 곧바로 router.back()
    expect(mockBackCount).toBe(1);

    // ④가 끝난 뒤에도 또 눌러 봤자 두 번째 router.back()이 생기지 않는다 —
    // closingRef가 'closing' 이후에도 참으로 남아 있다(이 훅은 'closing'에서 다른
    // phase로 옮겨가지 않고 그 자리에서 곧바로 onExit을 부른다). 이 3번째 누름은
    // startedRef가 참인 채로 closingRef만으로 걸러지는 경우라 실제로 그 가드가
    // 일하는 자리가 드러난다.
    await act(async () => { back.props.onPress(); });
    expect(mockBackCount).toBe(1);
    expect(timingRecs.filter((r) => r.duration === CLOSE_CURL_MS)).toHaveLength(1);
  });

  // task-J-brief.md §7 items 1–5 (아래 넷은 Task J가 새로 요구하는 단언; item 1 — "④가
  // 끝나면 router.back()이 그 자리에서 불린다, ⑤를 기다리지 않는다" — 은 바로 위 5번
  // 테스트가 이미 잰다).

  // 2. ④가 끝나면 requestBinderExit에 그 부서와 좌표가 실린다.
  test('④가 끝나면 requestBinderExit에 이 부서와 눌린 자리가 실린다', async () => {
    const tree = await mountSettled();
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); });
    expect(requestBinderExit).toHaveBeenCalledWith(
      expect.objectContaining({ dept: 'ICU', rect: RECT }),
    );
  });

  // 3. 넘기는 것(requestBinderExit)이 뜨는 것(router.back())보다 먼저다 — 순서 자체를
  //    잰다, 둘 다 불렸다는 것만으로는 부족하다.
  test('hands the cover to the overlay BEFORE calling router.back() — order, not just both happening', async () => {
    const tree = await mountSettled();
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); });
    expect(callOrder).toEqual(['request', 'back']);
  });

  // 4. 돌아갈 화면이 없으면(딥링크로 곧장 들어온 경우) router.replace('/journey')가
  //    불린다 — router.back()은 불리지 않는다.
  test('돌아갈 화면이 없으면 router.replace(\'/journey\')가 불린다(그리고 back은 안 불린다)', async () => {
    mockCanGoBack = false;
    const tree = await mountSettled();
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    await act(async () => { finish(findTiming(CLOSE_CURL_MS)); });
    expect(mockReplaced).toEqual(['/journey']);
    expect(mockBackCount).toBe(0);
  });

  // 5. 연출이 없었으면(좌표 없음, 또는 모션 줄이기) 스토어에 아무것도 넘기지 않는다 —
  //    requestClose가 startedRef를 보고 곧바로 onExit으로 새는 경로다(연출이 아예
  //    시작되지 않았으므로 handoff도 없다).
  test('연출이 없었으면(좌표 없음) 스토어에 아무것도 넘기지 않는다', async () => {
    const tree = await mount(); // clearBinderFlyRect가 beforeEach에서 이미 돈 상태 — 좌표 없음
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    expect(requestBinderExit).not.toHaveBeenCalled();
    expect(mockBackCount).toBe(1);
  });

  test('연출이 없었으면(모션 줄이기) 스토어에 아무것도 넘기지 않는다', async () => {
    setBinderFlyRect('ICU', RECT);
    reduceMotionSpy.mockResolvedValue(true);
    const tree = await mount();
    await act(async () => { tree.root.findByProps({ testID: 'dept-binder-back' }).props.onPress(); });
    expect(requestBinderExit).not.toHaveBeenCalled();
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
