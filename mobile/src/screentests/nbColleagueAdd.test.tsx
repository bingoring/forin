// 동료 추가, in the 근무 수첩 line.
//
// Two rules on this screen are worth watching, and both fail silently:
//
//  1. The request button must stay dead until a real person has been found. A live
//     button with nobody behind it sends a request into the dark — the learner gets a
//     failure alert and no way to tell whether the code or the app was wrong.
//  2. The invite code is TYPED and the code you were given is WRITTEN. That is not
//     decoration: your own code exists to be read out to somebody, and a handwriting
//     face at that size loses the difference between O and 0.
//
// Outside src/app deliberately: expo-router bundles every file under the app root as a
// route (routeHygiene.test.ts).
jest.mock('expo-secure-store', () => ({
  getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {},
}));
jest.mock('expo-clipboard', () => ({ setStringAsync: async () => {} }));
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {}, canGoBack: () => true }),
}));
const mockPreview: { hit: boolean } = { hit: true };
jest.mock('@/api/client', () => ({
  api: {
    inviteCode: async () => ({ code: 'AB12-CD34', maxUses: 5, uses: 1 }),
    lookupCode: async () => {
      if (!mockPreview.hit) throw new Error('not found');
      return { name: '지민', targetLevel: 'B1', destination: 'us', streak: 3 };
    },
    addColleague: async () => ({}),
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import Add from '@/app/colleagues/add';
import { trackMounts } from '../testing/mountRegistry';

const track = trackMounts();

async function mount() {
  let tree!: ReturnType<typeof create>;
  await act(async () => { tree = track(create(<Add />)); });
  await act(async () => { await Promise.resolve(); });
  return tree;
}

/** RN style props NEST: a component that takes `style` and puts it last in its own array
 *  produces [base, shadow, [mine]]. A one-level flatten copies the inner array's INDICES
 *  as keys and loses every property in it. */
function flatten(st: unknown): Record<string, unknown> {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(flatten));
  return st as Record<string, unknown>;
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

/** Every HOST node whose style matches. Host only: RN's View wraps a host view and both
 *  carry the style, so counting composites doubles every result. */
function styled(root: ReactTestInstance, pred: (s: Record<string, unknown>) => boolean) {
  return root.findAll(
    (n) => typeof n.type === 'string' && !!n.props?.style && pred(flatten(n.props.style)),
    { deep: true },
  );
}

/** The one field on the page. `Pressable`'s style can be a function, so read the input's
 *  own style off the host TextInput and its wrapper separately. */
function field(root: ReactTestInstance) {
  return root.findAll((n) => typeof n.props?.onChangeText === 'function', { deep: true })[0];
}

/** The 동료 요청 보내기 button, by its label. Composites only: `Pressable` turns `disabled`
 *  into responder behaviour, so no HOST node carries the prop and a host-only search finds
 *  nothing at all — which is a search that "passes" whatever the button does. */
function cta(root: ReactTestInstance) {
  const hits = root.findAll(
    (n) => typeof n.type !== 'string' && n.props?.disabled !== undefined && texts(n).includes('동료 요청 보내기'),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

/** Six characters, entered the way the field is actually filled. */
async function fill(tree: ReturnType<typeof create>, code: string) {
  await act(async () => { field(tree.root).props.onChangeText(code); });
  await act(async () => { await Promise.resolve(); });
}

test('your own code is on the page, set in type', async () => {
  const tree = await mount();
  const mono = tree.root.findAll(
    (n) => String(n.type) === 'Text' && String(flatten(n.props?.style).fontFamily).startsWith('IBMPlexMono'),
    { deep: true },
  ).flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
  expect(mono).toContain('AB12-CD34');
});

test('the request button is dead until somebody has been found', async () => {
  mockPreview.hit = true;
  const tree = await mount();
  // Nothing typed: there is nobody to send to.
  expect(cta(tree.root).props.disabled).toBe(true);

  await fill(tree, 'CD34EF');
  expect(texts(tree.root)).toContain('지민');
  expect(cta(tree.root).props.disabled).toBe(false);
});

test('a code that matches nobody says so, and leaves the button dead', async () => {
  // The failure the learner can act on: the code, not the request. Sending anyway would
  // turn a typo into a server round trip and an alert.
  mockPreview.hit = false;
  const tree = await mount();
  await fill(tree, 'ZZ99ZZ');
  expect(texts(tree.root).join(' ')).toContain('코드를 찾을 수 없어요');
  expect(cta(tree.root).props.disabled).toBe(true);
});

test('the code line marks itself while it is being filled', async () => {
  // The notebook's own "you are writing here". Without it the field is an unruled gap in
  // the page, which is the one thing on this screen that must look fillable.
  mockPreview.hit = true;
  const tree = await mount();
  const line = (t: ReturnType<typeof create>) =>
    styled(t.root, (s) => s.borderBottomWidth === 2 && typeof s.backgroundColor === 'string')[0];

  expect(flatten(line(tree)?.props.style).backgroundColor).toBe('transparent');
  await fill(tree, 'CD');
  expect(flatten(line(tree)?.props.style).backgroundColor).toBe('rgba(249,227,123,.35)');
  expect(flatten(line(tree)?.props.style).borderBottomColor).toBe('#C99A1E');
});
