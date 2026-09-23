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
import { Text } from 'react-native';
import DeptBinderScreen from '@/app/journey/dept/[dept]';
import { api, type JourneyView } from '@/api/client';
import type { JourneyCurriculum } from '@/components/journey/JourneyMap';
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
