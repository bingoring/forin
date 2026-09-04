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

// The character saying "everything I needed is handled". Its payload is a JSON string
// like every other frame's — the parser has one rule, and a bare `true` would be
// dropped by it silently.
test('the resolved frame is recognised and is not speech', () => {
  expect(parseSseLines(['event: resolved', 'data: "resolved"', ''])).toEqual([{ kind: 'resolved' }]);
});

// Live mission progress. Comma-joined string, not a JSON array — the server keeps this
// stream's one rule (every frame's data is a JSON string) because that rule is what
// caught a bare `true` being dropped here silently.
test('the missions frame parses its numbers', () => {
  expect(parseSseLines(['event: missions', 'data: "1,3"', ''])).toEqual([
    { kind: 'missions', numbers: [1, 3] },
  ]);
});

test('the missions frame tolerates whitespace and drops nonsense', () => {
  expect(parseSseLines(['event: missions', 'data: " 2 , 4 "', ''])).toEqual([
    { kind: 'missions', numbers: [2, 4] },
  ]);
  // Nothing usable in it: no frame at all rather than a frame that ticks nothing.
  expect(parseSseLines(['event: missions', 'data: "x,,0,-1"', ''])).toEqual([]);
});

test('a missions frame never becomes speech', () => {
  const frames = parseSseLines([
    'event: missions', 'data: "1"', '',
    'data: "Thank you."', '',
  ]);
  expect(frames.filter((f) => f.kind === 'delta')).toEqual([{ kind: 'delta', text: 'Thank you.' }]);
});

test('the correction frame is parsed as an object, ahead of the reply', () => {
  // The one frame whose payload is a JSON OBJECT, not a string: it carries the immediate
  // correction (original/corrected/note) and must survive the string-only rule the rest
  // of the stream keeps, landing before the NPC's delta text.
  const frames = parseSseLines([
    'event: correction', 'data: {"original":"Where pain?","corrected":"Where is the pain?","note":"관사를 넣으면 자연스러워요"}', '',
    'data: "I see."', '',
  ]);
  expect(frames[0]).toEqual({ kind: 'correction', original: 'Where pain?', corrected: 'Where is the pain?', note: '관사를 넣으면 자연스러워요' });
  expect(frames[1]).toEqual({ kind: 'delta', text: 'I see.' });
});

test('a correction with missing fields degrades rather than crashing', () => {
  // A model that returned only a note (already-correct utterance) still parses — the
  // fields it omitted come back as empty strings, not undefined.
  expect(parseSseLines(['event: correction', 'data: {"note":"자연스러워요"}', ''])).toEqual([
    { kind: 'correction', original: '', corrected: '', note: '자연스러워요' },
  ]);
});

test('a correction frame never leaks into speech', () => {
  // Its object payload must not be treated as a delta and typed into the NPC's mouth.
  const frames = parseSseLines([
    'event: correction', 'data: {"corrected":"Where is the pain?","note":"x"}', '',
    'data: "It hurts here."', '',
  ]);
  expect(frames.filter((f) => f.kind === 'delta')).toEqual([{ kind: 'delta', text: 'It hurts here.' }]);
});
