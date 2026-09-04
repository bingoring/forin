// 오늘의 근무 브리핑 + 이어서 하기 진행 바 (v37 홈 개편).
//
// The brief is three daily tasks; two are checked from the server payload (review,
// curriculum) and one from the device (the phrase — false here, since nothing was
// practiced). The continue card leads with the chapter and shows the server's progress.
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
      date: '2026-09-04', done: false, firstRun: false, streak: 3, week: [1, 1, 1, 1, 1, 1, 1],
      level: 4, xp: 420, situationsWaiting: 0, colleagues: [], colleagueTotal: 0, unreadCheers: 0, pendingRequests: 0,
      todayOne: { chapter: '응급실 · 첫 출근', title: '통증 사정', kind: 'scenario', scenarioId: 'SCN-ER-1', progress: { done: 2, total: 4 } },
      brief: { reviewCount: 5, reviewTarget: 5, reviewDone: true, curriculumDone: false },
      phrase: { id: 'p1', en: 'How are you feeling?', ko: '기분이 어떠세요?' },
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

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Home from '@/app/(tabs)/index';
import { trackMounts } from '@/testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Home />)); });
  for (let i = 0; i < 4; i++) await act(async () => { await Promise.resolve(); });
  return tree;
}

test('근무 브리핑은 세 칸에 완료 개수를 센다', async () => {
  const all = texts((await mount()).root).join('');
  expect(all).toContain('오늘의 근무 브리핑');
  expect(all).toContain('복습 5/5장'); // reviewCount/target interpolated
  // review done, curriculum + phrase not → 1 of 3.
  expect(all).toContain('1/3');
});

test('이어서 하기 카드가 챕터와 서버 진행률을 보여준다', async () => {
  const all = texts((await mount()).root).join('');
  expect(all).toContain('이어서 하기');    // resumeLabel, not "진행중인 커리큘럼"
  expect(all).not.toContain('진행중인 커리큘럼');
  expect(all).toContain('응급실 · 첫 출근'); // the coordinate, on the label line
  expect(all).toContain('2/4 단계');        // the step count, in the title line
});
