// The character's line types out one letter at a time — and, crucially, works WITH the
// stream: it never runs ahead of the text it has been given, keeps going when that text
// grows (tokens arriving), and starts over only when the line is replaced (a new turn).
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { Typewriter } from './Typewriter';

function shown(tree: ReturnType<typeof create>): string {
  const t = tree.root.findAll((n: ReactTestInstance) => String(n.type) === 'Text', { deep: true })[0];
  return (t.children.filter((c): c is string => typeof c === 'string')).join('');
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('it reveals the line one character at a time', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<Typewriter text="hello" speedMs={10} />); });
  // Nothing yet — the first character is a tick away, so a line never flashes whole.
  expect(shown(tree)).toBe('');
  act(() => { jest.advanceTimersByTime(10); });
  expect(shown(tree)).toBe('h');
  act(() => { jest.advanceTimersByTime(30); });
  expect(shown(tree)).toBe('hell');
  act(() => { jest.advanceTimersByTime(10); });
  expect(shown(tree)).toBe('hello');
  // Caught up: it stops, rather than spinning a timer forever.
  act(() => { jest.advanceTimersByTime(100); });
  expect(shown(tree)).toBe('hello');
});

test('it never runs ahead of what has arrived, and resumes when more lands', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<Typewriter text="ab" speedMs={10} />); });
  act(() => { jest.advanceTimersByTime(100); }); // fully reveal "ab"
  expect(shown(tree)).toBe('ab');
  // The stream appends more of the SAME line — the reveal continues from where it was,
  // it does not restart from the first letter.
  act(() => { tree.update(<Typewriter text="abcd" speedMs={10} />); });
  act(() => { jest.advanceTimersByTime(10); });
  expect(shown(tree)).toBe('abc');
  act(() => { jest.advanceTimersByTime(10); });
  expect(shown(tree)).toBe('abcd');
});

test('a replaced line (a new turn) starts the reveal over', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<Typewriter text="first" speedMs={10} />); });
  act(() => { jest.advanceTimersByTime(100); });
  expect(shown(tree)).toBe('first');
  // A different line — not an extension — so it types from the beginning again.
  act(() => { tree.update(<Typewriter text="second" speedMs={10} />); });
  expect(shown(tree)).toBe('');
  act(() => { jest.advanceTimersByTime(20); });
  expect(shown(tree)).toBe('se');
});
