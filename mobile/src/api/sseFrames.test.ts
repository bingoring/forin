// The stream's named frames must never reach the bubble as speech.
//
// The parser used to read `data:` lines and ignore `event:` entirely, so every
// frame's payload was appended to the NPC's line. That was already wrong before
// moods existed — `event: error` typed "ai unavailable" into the patient's mouth —
// and the mood word would have landed there too.
import { parseSseLines } from './sseFrames';

test('an unnamed data frame is a text delta', () => {
  expect(parseSseLines(['data: "Hello"', '', 'data: " there"', ''])).toEqual([
    { kind: 'delta', text: 'Hello' },
    { kind: 'delta', text: ' there' },
  ]);
});

test('a named frame is not speech', () => {
  const frames = parseSseLines([
    'event: mood', 'data: "worried"', '',
    'data: "Where is"', '',
    'data: " the doctor?"', '',
    'event: moodImproved', 'data: "happy"', '',
    'event: done', 'data: "[DONE]"', '',
  ]);
  expect(frames).toEqual([
    { kind: 'mood', mood: 'worried' },
    { kind: 'delta', text: 'Where is' },
    { kind: 'delta', text: ' the doctor?' },
    { kind: 'improved', mood: 'happy' },
    { kind: 'done' },
  ]);
  // The mood word never becomes text.
  expect(frames.filter((f) => f.kind === 'delta').map((f) => (f as { text: string }).text).join(''))
    .toBe('Where is the doctor?');
});

test('an error frame is not spoken by the patient', () => {
  const frames = parseSseLines(['event: error', 'data: "ai unavailable"', '']);
  expect(frames).toEqual([{ kind: 'error' }]);
});

// The binding ends at the blank line. Without that, one `event: mood` would silence
// every delta after it — the NPC would say nothing for the rest of the turn.
test('an event name does not leak into the following frames', () => {
  const frames = parseSseLines([
    'event: mood', 'data: "happy"', '',
    'data: "Thank you."', '',
  ]);
  expect(frames).toEqual([
    { kind: 'mood', mood: 'happy' },
    { kind: 'delta', text: 'Thank you.' },
  ]);
});

// A server signal this build has not heard of must not appear in a speech bubble.
test('an unknown event is dropped, not shown', () => {
  expect(parseSseLines(['event: somethingNew', 'data: "payload"', ''])).toEqual([]);
});

test('a partial or non-string payload is ignored', () => {
  expect(parseSseLines(['data: {"half'])).toEqual([]);
  expect(parseSseLines(['data: 42'])).toEqual([]);
});
