// 2단계 — 주제 화면(app/journey/theme/[themeKey].tsx)의 화면 배선. curriculum-v3-journey-ia/
// build-spec-index.md §6~§7.
//
// StationTrack.test.tsx가 이미 잠근 것(정거장 개수, 잠금 게이팅, 걷기 시간, 모션 줄이기,
// 깃발)은 여기서 다시 재지 않는다. 이 파일이 잠그는 것은 이 화면 자신의 몫뿐이다:
//  · GET /me/journey/stations/{themeKey}를 라우트 파라미터로 부른다.
//  · 스텝을 눌렀을 때 실제 라우팅 — QZ- 접두는 퀴즈로, 나머지는 시나리오로(guide 유지),
//    옛 openStep 규칙(커밋 d36bfa1) 그대로.
//  · 뒤로 가면 일터 탭으로 돌아간다(router.back()).
//  · 로드 실패 시 다시 시도할 수 있다.
//
// @testing-library/react-native 미설치 — 이 저장소의 다른 화면 테스트(journeyScreen.test.tsx,
// journeyPickDeptScreen.test.tsx)와 같은 react-test-renderer 관례를 따른다.
const mockPushed: string[] = [];
let mockBackCount = 0;
let mockThemeKey = 't1';
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: (p: string) => mockPushed.push(p), back: () => { mockBackCount += 1; } }),
  useLocalSearchParams: () => ({ themeKey: mockThemeKey }),
}));
jest.mock('@/api/client');

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { AccessibilityInfo, Text } from 'react-native';
import ThemeScreen from '@/app/journey/theme/[themeKey]';
import { api, type JourneyStep, type StationDetail } from '@/api/client';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function step(over: Partial<JourneyStep>): JourneyStep {
  return { kind: 'dlg', state: 'lock', scenarioId: 'SCN-ER-00001', name: '스텝', ...over } as JourneyStep;
}

// StationTrack.test.tsx와 같은 이유의 이중 카운트 함정(findAllByProps가 컴포짓+호스트를
// 모두 센다) — 컴포짓 Pressable만 남긴다.
function stationPresses(root: ReactTestInstance) {
  return root.findAllByProps({ testID: 'station-press' })
    .filter((n) => typeof n.type === 'function' && (n.type as { name?: string }).name === 'Pressable');
}

// journeyScreen.test.tsx의 같은 이름 헬퍼와 같은 이유 — props.children을 JSON.stringify
// 하면 react-test-renderer의 fiber(순환 참조)까지 걸려 죽는다. Text로만 좁힌다.
function texts(root: ReactTestInstance): string[] {
  return root.findAllByType(Text).map((n) => String(n.props.children));
}

const DETAIL: StationDetail = {
  station: { themeKey: 't1', name: '투약 확인', done: 1, total: 3, track: 'core' },
  steps: [
    step({ kind: 'dlg', state: 'done', scenarioId: 'SCN-ER-00001', name: '문진' }),
    step({ kind: 'dlg', state: 'now', scenarioId: 'SCN-ER-00002', name: '투약', guide: 'choices' }),
    step({ kind: 'quiz', state: 'lock', scenarioId: 'QZ-ER-00001', name: '퀴즈' }),
    step({ kind: 'boss', state: 'lock', scenarioId: undefined, name: '구간 시험' }),
  ],
} as unknown as StationDetail;

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<ThemeScreen />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

beforeEach(() => {
  mockPushed.length = 0;
  mockBackCount = 0;
  mockThemeKey = 't1';
  jest.clearAllMocks();
  (api.station as jest.Mock).mockResolvedValue(DETAIL);
  // 이 화면의 배선(라우팅·재시도·뒤로가기)을 재는 파일이다 — 걷기 자체(속도/상한)는
  // StationTrack.test.tsx의 몫이므로, 여기서는 모션 줄이기를 켜 도입 걷기를 즉시 이동으로
  // 만들어 실제 애니메이션 프레임이 테스트 시간 밖으로 새는 것을 아예 막는다.
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove: jest.fn() } as any);
});

test('fetches the station detail for the route themeKey', async () => {
  mockThemeKey = 't7';
  await mount();
  expect(api.station).toHaveBeenCalledWith('t7');
});

test('shows the theme name and back button, and back returns to the 일터 tab', async () => {
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'theme-title' }).props.children).toBe('투약 확인');
  await act(async () => { tree.root.findByProps({ testID: 'theme-back' }).props.onPress(); });
  expect(mockBackCount).toBe(1);
});

test('pressing the now step routes to /scenario with its guide carried through', async () => {
  const tree = await mount();
  const presses = stationPresses(tree.root);
  await act(async () => { presses[1].props.onPress(); }); // index 1 = 'now', SCN-ER-00002, guide choices
  expect(mockPushed).toEqual(['/scenario/SCN-ER-00002?guide=choices']);
});

test('a QZ- scenarioId routes to /quiz instead of /scenario', async () => {
  // 퀴즈 스텝을 눌러 볼 수 있도록 'lock'이 아니라 'now'로 바꿔 둔다(그대로면 K5에 막힌다).
  const detail: StationDetail = {
    ...DETAIL,
    steps: [
      step({ kind: 'dlg', state: 'done', scenarioId: 'SCN-ER-00001' }),
      step({ kind: 'quiz', state: 'now', scenarioId: 'QZ-ER-00001', name: '퀴즈' }),
      step({ kind: 'boss', state: 'lock', scenarioId: undefined }),
    ],
  } as unknown as StationDetail;
  (api.station as jest.Mock).mockResolvedValue(detail);
  const tree = await mount();
  const presses = stationPresses(tree.root);
  await act(async () => { presses[1].props.onPress(); });
  expect(mockPushed).toEqual(['/quiz/QZ-ER-00001']);
});

test('a locked step does not route anywhere (K5)', async () => {
  const tree = await mount();
  const presses = stationPresses(tree.root);
  await act(async () => { presses[2].props.onPress(); }); // index 2 = 'lock' quiz
  expect(mockPushed).toEqual([]);
});

test('a load failure offers a retry that re-fetches', async () => {
  (api.station as jest.Mock).mockRejectedValueOnce(new Error('network'));
  (api.station as jest.Mock).mockResolvedValueOnce(DETAIL);
  const tree = await mount();

  const retry = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).includes('다시 시도'),
    { deep: true },
  )[0];
  expect(retry).toBeTruthy();
  await act(async () => { retry.props.onPress(); });
  await act(async () => { await Promise.resolve(); });
  expect(tree.root.findByProps({ testID: 'theme-title' }).props.children).toBe('투약 확인');
});

test('an empty step list still stands the screen up — no crash, no fabricated station', async () => {
  (api.station as jest.Mock).mockResolvedValue({ station: { themeKey: 't1', name: '빈 주제' }, steps: [] } as unknown as StationDetail);
  const tree = await mount();
  expect(tree.root.findByProps({ testID: 'theme-title' }).props.children).toBe('빈 주제');
  expect(stationPresses(tree.root)).toHaveLength(0);
});
