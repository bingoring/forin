// The mood signal on screen: the border, the portrait, and the celebration.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { MoodLift, liftKey } from '@/components/dialogue/MoodLift';

// Outside src/app on purpose — expo-router bundles every file under the app root as
// a route (see routeHygiene.test.ts).
const SRC = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((n) => String(n.type) === 'Text', { deep: true })
    .flatMap((n) => n.children.filter((c): c is string => typeof c === 'string'));
}

test('the celebration is silent without an improvement', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<MoodLift mood={undefined} onDone={() => {}} />); });
  // Not a hidden banner — nothing at all. A strip that renders at opacity 0 still
  // takes layout, which would shift the input up and down between turns.
  expect(tree.toJSON()).toBeNull();
});

test('the celebration names what changed, not how well the learner did', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = create(<MoodLift mood="happy" onDone={() => {}} />); });
  const out = texts(tree.root);
  expect(out).toContain('환자가 안심했어요');
  // "잘했어요" belongs to the result screen. Mid-conversation the situation reports
  // itself; grading the learner here would break the role-play.
  expect(out.some((x) => x.includes('잘했어요'))).toBe(false);
});

test('each kind of improvement gets its own words', () => {
  // Reaching `happy` is relief; reaching `focused` is having been calmed; anything
  // else is a step out of something worse. Collapsing them would praise a patient
  // still in pain for being "relieved".
  expect(liftKey('happy')).toBe('mood.lift.relieved');
  expect(liftKey('focused')).toBe('mood.lift.calmed');
  expect(liftKey('thinking')).toBe('mood.lift.calmed');
  expect(liftKey('neutral')).toBe('mood.lift.settled');
  expect(liftKey('worried')).toBe('mood.lift.eased');
});

test('only the newest NPC bubble carries the mood colour', () => {
  // Colouring the whole history would repaint lines whose mood is no longer known —
  // this screen keeps the transcript as text, not as moods — and turn the thread
  // into a colour chart.
  expect(SRC).toMatch(/borderColor: !mine && last \? moodBorder\(turnMood\) : C/);
});

test('the portrait falls back to the authored mood rather than blanking', () => {
  // A reply the model did not tag must not wipe the patient's face to neutral.
  expect(SRC).toMatch(/const expr = moodExpression\(turnMood\) \?\? authored;/);
});

test('the mood is applied before the text and survives the wait for the next reply', () => {
  // onMood fires ahead of the first delta, so the face is right as the words appear.
  expect(SRC).toMatch(/onMood: \(m\) => setTurnMood\(asMood\(m\)\)/);
  // Sending clears the CELEBRATION but not the mood: blanking the portrait while the
  // learner waits for an answer reads as the patient going vacant.
  expect(SRC).toMatch(/setImproved\(undefined\);/);
  expect(SRC).not.toMatch(/setTurnMood\(undefined\)/);
});

test('a mood the portrait cannot draw is rejected at the boundary', () => {
  // asMood, not a cast: a version skew that sends a new mood must leave the face on
  // the authored expression rather than painting a blank one.
  expect(SRC).toMatch(/onImproved: \(m\) => setImproved\(asMood\(m\)\)/);
});

test('the bubble does not open with the space the mood tag left behind', () => {
  // The server strips the tag at its `]`, so the next chunk usually starts with the
  // space that separated tag from sentence. Only the FIRST chunk is trimmed —
  // trimming every chunk would glue words together.
  expect(SRC).toMatch(/prev \? prev \+ chunk : chunk\.replace\(\/\^\\s\+\/, ''\)/);
});
