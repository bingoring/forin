// Resuming a saved guided conversation must come back WHOLE and still guided.
//
// Three defects, all in resumePrevious:
//
//  1. The guided choices were fetched on a fresh start but not on resume, so after picking
//     up a saved conversation the option list never came back — the guided pass was dead.
//  2. The scenario's OPENING line is authored and shown client-side; the server never
//     stored it, so the restored turns began with the learner's first message and the
//     character's first utterance was simply missing from the thread.
//  3. The last assistant line is the CURRENT line being answered — it belongs in npcLine,
//     not the transcript. Leaving it in both would duplicate it the moment the learner
//     sent their next turn (threadOf depends on "npcLine is not in the transcript").
import { readFileSync } from 'fs';
import { join } from 'path';

const SRC = readFileSync(join(__dirname, '..', 'app', 'dialogue', '[id].tsx'), 'utf8');
const resume = SRC.slice(SRC.indexOf('const resumePrevious'), SRC.indexOf('const startFresh'));

test('resume re-fetches the guided choices', () => {
  expect(resume).toMatch(/void loadChoices\(\)/);
});

test('resume puts the missing opening line back at the front of the thread', () => {
  expect(SRC).toMatch(/function openingLineOf\(/);
  expect(resume).toMatch(/const opening = openingLineOf\(scenario\)/);
  expect(resume).toMatch(/opening \? \[\{ role: 'npc' as const, text: opening \}\] : \[\]/);
});

test('resume holds the current NPC line OUT of the transcript', () => {
  // Split the last assistant line off the body and into npcLine, so a later send does not
  // park a line that is already in the transcript.
  expect(resume).toMatch(/const endsWithNpc = turns\.length > 0 && turns\[turns\.length - 1\]\.role !== 'user'/);
  expect(resume).toMatch(/body = endsWithNpc \? turns\.slice\(0, -1\) : turns/);
  expect(resume).toMatch(/setNpcLine\(endsWithNpc \? turns\[turns\.length - 1\]\.content : ''\)/);
});
