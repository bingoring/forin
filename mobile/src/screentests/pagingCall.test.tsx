// 오늘의 호출 (v27). The rules it draws belong to the server; these are the ones the
// CARD owns — what it shows in each state, and what it refuses to do on its own.
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('@/lib/sfx', () => ({ playSfx: () => {}, primeSfx: () => {}, loadSfxPreference: async () => {} }));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PagingCall } from '@/components/home/PagingCall';
import type { HomePage } from '@/api/client';

const PAGE: HomePage = {
  scenarioId: 'SCN-ER-00002',
  line: '“3병동 환자 통증 호소!\n담당 간호사 응답 바랍니다.”',
  hint: '응답하면 통증 사정 단기 시나리오로 바로 입장 · 약 3분',
  secondsLeft: 2_592,
  totalSeconds: 3_600,
  answered: false,
  bonusXp: 40,
};

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
function lines(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .map((n) => n.children.filter((c): c is string => typeof c === 'string').join(''));
}
function flat(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flat));
  return (style ?? {}) as Record<string, unknown>;
}
function press(root: ReactTestInstance, label: string): ReactTestInstance {
  const hits = root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes(label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

const mounted: ReturnType<typeof create>[] = [];
function mount(over: Partial<HomePage> = {}, handlers: { onAnswer?: () => Promise<void>; onIgnore?: () => void } = {}) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(
      <PagingCall
        page={{ ...PAGE, ...over }}
        onAnswer={handlers.onAnswer ?? (async () => {})}
        onIgnore={handlers.onIgnore ?? (() => {})}
      />,
    );
  });
  mounted.push(tree);
  return tree;
}
afterEach(() => { for (const tree of mounted.splice(0)) act(() => { tree.unmount(); }); });

test('the pager shows the summons, the bonus and the countdown', () => {
  const tree = mount();
  const out = lines(tree.root);
  expect(out.some((x) => x.includes('통증 호소'))).toBe(true);
  expect(out.some((x) => x.includes('+40 XP'))).toBe(true);
  // mm:ss, from the server's secondsLeft — 2592s is 43:12, the handoff's own number.
  expect(out.some((x) => x.includes('43:12'))).toBe(true);
  expect(out.some((x) => x.includes('오늘 놓치면 소멸'))).toBe(true);
});

test('the time bar is a fraction of the WHOLE window, not of what is left', () => {
  // 2592 of 3600 is 72%, which is what the handoff draws. Measuring against
  // secondsLeft would make every bar start full however late the app was opened — and
  // the window is not a constant, since a call issued near midnight is clipped short.
  const tree = mount();
  const bar = tree.root.findAll((n) => {
    const st = flat(n.props?.style);
    return String(n.type) === 'View' && typeof st.width === 'string' && st.backgroundColor === '#FEF08A';
  }, { deep: true })[0];
  expect(parseFloat(String(flat(bar.props.style).width))).toBeCloseTo(72, 0);

  // A short window fills the bar the same way — the fraction is honest at any length.
  const clipped = mount({ secondsLeft: 300, totalSeconds: 600 });
  const bar2 = clipped.root.findAll((n) => {
    const st = flat(n.props?.style);
    return String(n.type) === 'View' && typeof st.width === 'string' && st.backgroundColor === '#FEF08A';
  }, { deep: true })[0];
  expect(parseFloat(String(flat(bar2.props.style).width))).toBeCloseTo(50, 0);
});

test('answering waits for the server before it counts as answered', async () => {
  let resolve!: () => void;
  const answered = new Promise<void>((r) => { resolve = r; });
  let calls = 0;
  const tree = mount({}, { onAnswer: () => { calls += 1; return answered; } });

  const button = () => tree.root.findAll((n) => n.props?.onPress !== undefined, { deep: true })[0];
  await act(async () => { button().props.onPress(); });
  expect(calls).toBe(1);

  // In flight: the label is replaced by a spinner, so the learner can see it is working.
  expect(tree.root.findAll((n) => String(n.type) === 'ActivityIndicator', { deep: true })).toHaveLength(1);
  // …and the button refuses a second tap. The bonus is paid once server-side, but a
  // second request would still be sent, and the navigation would fire twice.
  expect(button().props.disabled).toBe(true);
  await act(async () => { button().props.onPress(); });
  expect(calls).toBe(1);

  await act(async () => { resolve(); await answered; });
});

test('무시 hides it for now, and does not tell the server', () => {
  // "Not now", not "never": the call is still theirs until it expires, and reporting an
  // ignore would take the bonus away on a stray tap without saying so.
  let ignores = 0;
  const tree = mount({}, { onIgnore: () => { ignores += 1; } });
  act(() => { press(tree.root, '무시').props.onPress(); });
  expect(ignores).toBe(1);
  expect(tree.toJSON()).toBeNull();

  const src = readFileSync(join(__dirname, '..', 'components', 'home', 'PagingCall.tsx'), 'utf8');
  expect(src).not.toMatch(/api\./); // the card talks to nobody
});

test('an answered call collapses to a line rather than vanishing', () => {
  const out = lines(mount({ answered: true }).root);
  // Vanishing would leave the learner unsure whether they took it.
  expect(out.some((x) => x.includes('응답 완료'))).toBe(true);
  expect(out.some((x) => x.includes('+40 XP'))).toBe(true);
  // And no way to answer it again.
  expect(out).not.toContain('지금 응답');
});

test('an expired call is not drawn at all', () => {
  // A pager offering an action that cannot be taken is worse than no pager. The server
  // omits the field entirely once a call has expired unanswered; this covers the case
  // where the countdown ran out while the screen was open.
  expect(mount({ secondsLeft: 0 }).toJSON()).toBeNull();
});

test('the countdown runs while the card is open', async () => {
  jest.useFakeTimers();
  try {
    const tree = mount({ secondsLeft: 65, totalSeconds: 3_600 });
    expect(lines(tree.root).some((x) => x.includes('01:05'))).toBe(true);
    await act(async () => { jest.advanceTimersByTime(3_000); });
    expect(lines(tree.root).some((x) => x.includes('01:02'))).toBe(true);
  } finally {
    jest.useRealTimers();
  }
});
