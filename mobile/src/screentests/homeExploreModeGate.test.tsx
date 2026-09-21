// 홈의 "과별 출근 카드"(부서 인테리어로 들어가는 유일한 진입점 —
// /interior/INT-<code>-00001)가 탐험 모드 토글(Task 15, useExploreMode)을 실제로 따르는지.
//
// useExploreMode.test.tsx는 훅 자체(기본값·저장 실패 내성·기기 간 왕복·같은 실행 안에서의
// 인스턴스 간 반영)를 잠근다. 하지만 index.tsx가 그 훅의 반환값을 실제로 읽어 카드를
// 그리거나 숨기는 "연결부"는 훅 테스트만으로는 보장되지 않는다 — 코드 리뷰에서 지적된
// 지점이자, 15.4의 핵심이다.
//
// useExploreMode를 모킹하는 이유: 이 화면(index.tsx)은 LiveWardNb의 실제 Animated.View를
// 물고 있고, 훅의 진짜 SecureStore 하이드레이션을 끝까지 밟으려면(useExploreMode.test.tsx가
// 하듯) React·react-test-renderer·Home을 전부 같은 격리된 모듈 레지스트리에서 새로 불러와야
// 하는데, react-native의 Animated 내부가 그 격리를 견디지 못하고
// ("Cannot read properties of null (reading 'useReducer')" — useAnimatedProps) 화면 전체가
// 죽는다. 그래서 여기서는 훅의 반환값만 통제하고(두 값 사이를 실제로 오가며 렌더 차이를
// 확인 — 고정된 스텁이 아니다), 훅 자신의 저장소 왕복은 위 파일이 이미 진짜 경로로
// 검증한다.
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
jest.mock('@/api/client', () => ({
  api: {
    home: async () => ({
      date: '2026-09-20', done: false, firstRun: false, streak: 1, week: [0, 0, 0, 0, 0, 0, 0],
      level: 1, xp: 0, situationsWaiting: 0, colleagues: [], colleagueTotal: 0, unreadCheers: 0, pendingRequests: 0,
      todayOne: null,
      brief: { reviewCount: 0, reviewTarget: 0, reviewDone: false, curriculumDone: false },
      phrase: null,
    }),
    me: async () => ({ profile: { displayName: '지민' } }),
    colleaguePrefs: async () => ({ shareStatus: true, shareWeekly: true, shareWard: true }),
    handoff: async () => ({ notes: [], unread: 0 }),
  },
}));
jest.mock('expo-router', () => {
  const React = require('react') as typeof import('react');
  return {
    Stack: { Screen: () => null },
    useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
    useLocalSearchParams: () => ({}),
    useFocusEffect: (cb: () => void | (() => void)) => React.useEffect(cb, []),
  };
});

// The one dependency this file controls directly. Not a fixed stub: the two tests set it
// to opposite values and check the rendered output actually differs, which is what tells
// them apart from a stub that would pass either way.
let mockExploreEnabled = true;
jest.mock('@/hooks/useExploreMode', () => ({
  useExploreMode: () => ({ enabled: mockExploreEnabled, setEnabled: jest.fn() }),
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Home from '@/app/(tabs)/index';
import { trackMounts } from '@/testing/mountRegistry';

const mount = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

async function mountHome() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = mount(create(<Home />)); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

describe('home ward cards follow explore mode (Task 15)', () => {
  it('renders the department cards when explore mode is on', async () => {
    mockExploreEnabled = true;
    const tree = await mountHome();
    const rendered = texts(tree.root);
    expect(rendered).toContain('ER');
    expect(rendered).toContain('OR');
  });

  it('hides the department cards when explore mode is off', async () => {
    mockExploreEnabled = false;
    const tree = await mountHome();
    const rendered = texts(tree.root);
    expect(rendered).not.toContain('ER');
    expect(rendered).not.toContain('OR');
  });
});
