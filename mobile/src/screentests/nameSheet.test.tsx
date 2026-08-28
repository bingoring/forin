// Editing the name other people see.
//
// Outside src/app because expo-router bundles every .ts/.tsx under the app root as a
// route (routeHygiene.test.ts enforces it).
jest.mock('react-native-worklets', () => ({ createWorkletRuntime: () => ({}), runOnJS: (f: unknown) => f, runOnUI: (f: unknown) => f, isWorkletFunction: () => false }));
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }) }));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} }));

// Records what was sent and controls what comes back. `mock`-prefixed so the hoisted
// jest.mock factory may close over it.
const mockCalls: string[] = [];
const mockServer = { reply: '김민아', fail: false };
jest.mock('@/api/client', () => ({
  api: {
    setDisplayName: async (name: string) => {
      mockCalls.push(name);
      if (mockServer.fail) throw new Error('rejected');
      return mockServer.reply;
    },
  },
}));

import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { MAX_NAME_LEN, NameSheet, nameLength } from '@/components/me/NameSheet';

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}
/** One string per Text node, children joined — for labels assembled from several
 *  interpolated pieces. */
function lines(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .map((n) => n.children.filter((c): c is string => typeof c === 'string').join(''));
}
const input = (root: ReactTestInstance) => root.findAll((n) => String(n.type) === 'TextInput', { deep: true })[0];
/** The pressable whose subtree holds `label`, innermost first. */
function button(root: ReactTestInstance, label: string): ReactTestInstance {
  const hits = root.findAll(
    (n) => typeof n.type === 'function' && n.props?.onPress !== undefined && texts(n).includes(label),
    { deep: true },
  );
  expect(hits.length).toBeGreaterThan(0);
  return hits[hits.length - 1];
}

beforeEach(() => {
  mockCalls.length = 0;
  mockServer.reply = '김민아';
  mockServer.fail = false;
});

async function open(current = '', onSaved: (n: string) => void = () => {}, onClose: () => void = () => {}) {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<NameSheet visible current={current} onClose={onClose} onSaved={onSaved} />);
  });
  return tree;
}

test('the count is in the same unit the server counts in', () => {
  // The server's limit is utf8.RuneCountInString. A .length-based counter would tell a
  // Korean learner nothing wrong here, but would count an emoji as two.
  expect(nameLength('김민아')).toBe(3);
  expect(nameLength('Emma')).toBe(4);
  expect(nameLength('🙂')).toBe(1);
  expect(MAX_NAME_LEN).toBe(20);
});

test('what the screen shows is what the SERVER saved, not what was typed', async () => {
  const saved: string[] = [];
  const tree = await open('', (n) => saved.push(n));
  await act(async () => { input(tree.root).props.onChangeText('  김민아  '); });
  await act(async () => { button(tree.root, '저장').props.onPress(); });

  // Sent verbatim — trimming is the server's job, and doing it here too would mean two
  // implementations that can disagree.
  expect(mockCalls).toEqual(['  김민아  ']);
  // Applied from the response. Echoing the input would leave this screen showing
  // "  김민아  " while every colleague list showed "김민아".
  expect(saved).toEqual(['김민아']);
});

test('an empty field clears the name, and says so first', async () => {
  const saved: string[] = [];
  mockServer.reply = '';
  const tree = await open('김민아', (n) => saved.push(n));
  await act(async () => { input(tree.root).props.onChangeText(''); });

  // The warning is only there when there is actually a name to lose.
  expect(texts(tree.root).some((x) => x.includes('이름이 지워지고'))).toBe(true);

  await act(async () => { button(tree.root, '저장').props.onPress(); });
  expect(mockCalls).toEqual(['']);
  expect(saved).toEqual(['']);
});

test('with no name set there is nothing to warn about', async () => {
  const tree = await open('');
  expect(texts(tree.root).some((x) => x.includes('이름이 지워지고'))).toBe(false);
});

test('a failed save keeps the sheet open with the text intact', async () => {
  mockServer.fail = true;
  const saved: string[] = [];
  let closed = 0;
  const tree = await open('', (n) => saved.push(n), () => { closed += 1; });
  await act(async () => { input(tree.root).props.onChangeText('Emma'); });
  await act(async () => { button(tree.root, '저장').props.onPress(); });

  // Closing on failure is indistinguishable from succeeding — the learner would walk
  // away believing the name was saved.
  expect(closed).toBe(0);
  expect(saved).toEqual([]);
  expect(input(tree.root).props.value).toBe('Emma');
  expect(texts(tree.root).some((x) => x.includes('저장하지 못했어요'))).toBe(true);
});

test('a name over the limit cannot be saved', async () => {
  const tree = await open('');
  await act(async () => { input(tree.root).props.onChangeText('가'.repeat(MAX_NAME_LEN + 1)); });
  await act(async () => { button(tree.root, '저장').props.onPress(); });
  // Not sent at all. The server would reject it, but spending a round trip to be told
  // what the counter already knows is not a good way to say "too long".
  expect(mockCalls).toEqual([]);
  // Joined per Text node: the counter is one line built from three string children
  // ("21", " / ", "20"), so a flat list of strings never contains the whole label.
  expect(lines(tree.root)).toContain(`${MAX_NAME_LEN + 1} / ${MAX_NAME_LEN}`);
});

test('reopening after a cancel shows the name in force, not the abandoned edit', async () => {
  let tree!: ReturnType<typeof create>;
  await act(async () => {
    tree = create(<NameSheet visible={false} current="김민아" onClose={() => {}} onSaved={() => {}} />);
  });
  await act(async () => {
    tree.update(<NameSheet visible current="김민아" onClose={() => {}} onSaved={() => {}} />);
  });
  await act(async () => { input(tree.root).props.onChangeText('typed then cancelled'); });
  // Close, then open again.
  await act(async () => {
    tree.update(<NameSheet visible={false} current="김민아" onClose={() => {}} onSaved={() => {}} />);
  });
  await act(async () => {
    tree.update(<NameSheet visible current="김민아" onClose={() => {}} onSaved={() => {}} />);
  });
  expect(input(tree.root).props.value).toBe('김민아');
});
