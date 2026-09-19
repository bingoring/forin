// 상황 준비(the briefing screen), in the 근무 수첩 line.
//
// This file used to also cover the 층 바텀시트 (DeptSheet) — the curriculum-v3-journey
// rebuild (Task 13) replaced that screen with the journey map, and DeptSheet went with
// it (frontend-components.md §7). The briefing screen it shares this file with is
// untouched, so its tests stay: a briefing that does not say what the learner will be
// graded on is still a way to be wrong that renders, so the checks are on the rendered
// output, not on the source.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('react-native-worklets', () => ({
  createWorkletRuntime: () => ({}), createSerializable: (v: unknown) => v,
  runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false,
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));
// The briefing's polaroid draws a RoleFace, which comes through @engine and pulls in
// reanimated. The face's motion is not what these tests are about; where the states show
// on the page is.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native') as typeof import('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    Easing: { inOut: (f: unknown) => f, quad: (t: number) => t, linear: (t: number) => t },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (f: () => unknown) => f(),
    useAnimatedProps: (f: () => unknown) => f(),
    useDerivedValue: (f: () => unknown) => ({ value: f() }),
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: (v: unknown) => v,
    withSequence: (v: unknown) => v,
    withTiming: (v: unknown) => v,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

const mockSits = [
  { scenarioId: 'SCN-ER-00001', name: '흉통 환자 트리아지', tag: '완료', tagCode: 'cleared', lv: 'B1', min: 6, room: 'ER · TRIAGE', urgent: false },
  { scenarioId: 'SCN-ER-00004', name: '자해 위험 환자 사정', tag: '긴급', tagCode: 'new', lv: 'B2', min: 8, room: 'ER · QUIET ROOM', urgent: true },
];
jest.mock('@/api/client', () => ({
  api: {
    deptSituations: async () => ({ situations: mockSits, hasMore: false }),
    scenario: async () => ({
      id: 'SCN-ER-00002',
      title: '통증 사정 — Mrs. Hopkins',
      tagline: 'It hurts here.',
      persona: { name: 'Mrs. Hopkins', role: 'patient', mood: 'pain', personality: '날카로운 통증으로 예민한 상태' },
      goals: ['자기소개하고 환자 본인 확인', '통증 위치와 양상 묻기', '0~10 척도로 강도 확인', '다음에 무엇이 일어날지 설명하고 마무리'],
      briefing: {
        dept: 'ER · TRAUMA BAY #4', difficulty: 2, timeLabel: '약 5분',
        brief: '허리 통증을 호소하는 환자.', skills: ['통증 사정', 'SBAR'],
        rewards: [{ icon: '⭐', label: '경험치', value: '+ 60 XP' }],
        reqs: [{ label: 'Lv.B1', metric: 'level', threshold: 2 }],
      },
    }),
  },
}));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: (p: unknown) => { mockNav.push(String(typeof p === 'string' ? p : JSON.stringify(p))); }, replace: () => {}, back: () => {}, canGoBack: () => true }),
  useLocalSearchParams: () => ({ id: 'SCN-ER-00002', guide: 'choices' }),
}));
const mockNav: string[] = [];

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Briefing from '@/app/scenario/[id]';
import { nb } from '@/theme/nb';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** RN style props NEST: a component that takes `style` and puts it last in its own array
 *  produces [base, shadow, [mine, alsoMine]]. A one-level Object.assign then copies the
 *  inner array's INDICES as keys and loses every property in it — which reads as "the
 *  card has no border" on exactly the cards whose border is the thing being checked. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

/** Every HOST node whose style matches. Host only: RN's View wraps a host view and both
 *  carry the style, so counting composites doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

/** The Text node carrying a label, and its own flattened style. */
function labelStyle(root: ReactTestInstance, label: string): Record<string, unknown> {
  const hit = root.findAll(
    (n) => String(n.type) === 'Text' && n.children.some((c) => c === label),
    { deep: true },
  )[0];
  expect(hit).toBeTruthy();
  return flatten(hit.props.style);
}

test('the briefing says what the learner will be graded on', async () => {
  // The pixel briefing showed skills, rewards and entry requirements and never the goals —
  // so someone walked in without knowing what counted, and those same goals are what the
  // dialogue screen's tracker fills in.
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Briefing />)); });
  await act(async () => { await Promise.resolve(); });

  const out = texts(tree.root);
  expect(out).toContain('통증 위치와 양상 묻기');
  expect(out).toContain('0~10 척도로 강도 확인');
  // Four unchecked boxes, one per goal: a checklist you have not started.
  const boxes = styled(tree.root, (s) => s.borderColor === nb.soft && s.width === 18);
  expect(boxes.length).toBe(4);
});

test('the briefing carries the chosen rung into the conversation', async () => {
  // `guide` is which of two rows was tapped in the curriculum list. The server can only
  // infer a rung from what has been cleared, and inference cannot know which row — so
  // dropping it here is how "보기 중에서" opened the unguided run.
  mockNav.length = 0;
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Briefing />)); });
  await act(async () => { await Promise.resolve(); });

  const cta = tree.root.findAll(
    (n) => typeof n.props?.onPress === 'function' && texts(n).some((x) => x.includes('출근해서 시작하기')),
    { deep: true },
  );
  expect(cta.length).toBeGreaterThan(0);
  await act(async () => { cta[cta.length - 1].props.onPress(); });
  expect(mockNav.join(' ')).toContain('guide=choices');
});

test('the mood is in red pen, because it changes how the learner opens their mouth', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Briefing />)); });
  await act(async () => { await Promise.resolve(); });

  expect(texts(tree.root).join(' ')).toContain('PAIN');
  // Dashed peach memo, not a chip in a row of chips.
  expect(styled(tree.root, (s) => s.backgroundColor === '#FFF3EE' && s.borderStyle === 'dashed').length).toBe(1);
  expect(labelStyle(tree.root, '완료 보상').color).toBe(nb.soft);
});
