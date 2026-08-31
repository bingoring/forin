// The mood signal on screen: the border, the portrait, and the celebration.
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { readFileSync } from 'fs';
import { join } from 'path';

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => ({ play: () => {}, pause: () => {}, seekTo: () => {}, remove: () => {} }),
}));

import { MoodLift, liftKey } from '@/components/dialogue/MoodLift';
import { trackMounts } from '../testing/mountRegistry';

/** Unmounts every tree this file mounts — see mountRegistry for why. */
const track = trackMounts();

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
  act(() => { tree = track(create(<MoodLift mood={undefined} onDone={() => {}} />)); });
  // Not a hidden banner — nothing at all. A strip that renders at opacity 0 still
  // takes layout, which would shift the input up and down between turns.
  expect(tree.toJSON()).toBeNull();
});

test('the celebration names what changed, not how well the learner did', () => {
  let tree!: ReturnType<typeof create>;
  act(() => { tree = track(create(<MoodLift mood="happy" onDone={() => {}} />)); });
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

// The wrap-up prompt: asked once, never deciding.
//
// The learner could not tell when a situation was resolved and kept talking past it.
// But the character's "everything is handled" is not the grade — that is goal
// coverage, computed at the end — so the two can disagree, and the honest move is a
// question rather than ending the conversation for them.
test('the wrap-up prompt is asked at most once per conversation', () => {
  // A ref, not state: it must survive the re-render that showing the sheet causes,
  // and declining must not re-arm it.
  expect(SRC).toMatch(/askedWrapUp = useRef\(false\)/);
  expect(SRC).toMatch(/if \(askedWrapUp\.current\) return;\s*\n\s*askedWrapUp\.current = true;/);
});

test('declining keeps the conversation open, and it never asks again', () => {
  // Keep-talking only closes the sheet — it does not end, and does not reset the ref.
  expect(SRC).toMatch(/wrapUpKeepGoing[\s\S]{0,400}?onPress=\{\(\) => setWrapUp\(false\)\}/);
  expect(SRC).not.toMatch(/askedWrapUp\.current = false/);
});

test('accepting grades the conversation rather than abandoning it', () => {
  // endSituation is the same path as the 상황 종료 button: it routes to the result
  // screen with the session, which is what gets graded.
  expect(SRC).toMatch(/setWrapUp\(false\); endSituation\(\)/);
});

test('the prompt is driven by the server signal, not by a turn count', () => {
  // Guessing from turn count would fire on conversations that were nowhere near
  // resolved, and miss ones that resolved in three lines.
  expect(SRC).toMatch(/onResolved: \(\) => \{/);
});

// The mission tracker must not claim progress it does not have.
//
// It read `MISSION 1/{goals.length}` with a hardcoded 1 and showed only goals[0]: the
// position never moved and the other goals were never named. A learner watching it had
// no way to know what was still outstanding — the reported "언제 해소됐는지 모른다" in
// its most literal form.
test('missions accumulate and are never un-ticked', () => {
  // A turn where the character does not mention mission 1 must not undo it: the
  // learner did that thing, and a tracker that flickers backwards is worse than one
  // that is slightly generous.
  expect(SRC).toMatch(/const next = new Set\(prev\);\s*\n\s*for \(const n of numbers\) next\.add\(n\);/);
  expect(SRC).not.toMatch(/setDoneMissions\(new Set\(numbers\)\)/);
});

test('an unchanged tick does not re-render the tracker', () => {
  // This fires every turn, and re-rendering behind a streaming reply is churn.
  expect(SRC).toMatch(/next\.size === prev\.size \? prev : next/);
});

test('the mission tracker is delegated, not re-inlined', () => {
  // It lived here as 70 lines and carried three defects nothing could reach: a panel
  // that laid out at no width (so it showed nothing, and measured taller than it looked),
  // and an exit in the opposite corner that moved when it opened. It is a component with
  // its own render tests now — missionCluster.test.tsx — and this is the guard that it
  // stays one.
  expect(SRC).toMatch(/<MissionCluster/);
  const code = SRC.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  expect(code).not.toMatch(/goals\.map\(/);
  expect(code).not.toMatch(/<Collapsible open=\{missionsOpen\}>/);
  // The lie this replaced, in either file: a hardcoded "MISSION 1/N" that showed only
  // the first goal.
  const cluster = readFileSync(join(__dirname, '..', 'components', 'dialogue', 'MissionCluster.tsx'), 'utf8');
  for (const src of [code, cluster]) {
    expect(src).not.toMatch(/MISSION 1\//);
    expect(src).not.toMatch(/const mission = goals\[0\]/);
  }
});
