import { threadOf, type Turn } from '@/data/thread';

const npc = (text: string): Turn => ({ role: 'npc', text });
const me = (text: string): Turn => ({ role: 'user', text });

test('shows the arriving reply after everything already said', () => {
  expect(threadOf([npc('Hello.'), me('Hi.')], 'How are you?')).toEqual([
    npc('Hello.'), me('Hi.'), npc('How are you?'),
  ]);
});

test('an empty reply adds nothing', () => {
  // The waiting state is a row of its own, not an empty bubble.
  expect(threadOf([npc('Hello.')], '')).toEqual([npc('Hello.')]);
});

test('does not show the same reply twice', () => {
  // The hazard: npcLine is appended to the transcript when the learner answers, so for the
  // moment before it is replaced it is both the last transcript entry AND npcLine.
  const t = [npc('Hello.'), me('Hi.'), npc('How are you?')];
  expect(threadOf(t, 'How are you?')).toEqual(t);
});

test('a repeat the NPC actually said is still shown', () => {
  // Same words, but the last transcript entry is the learner's — so this is a new turn,
  // not the duplicate above.
  const t = [npc('Take a breath.'), me('Okay.')];
  expect(threadOf(t, 'Take a breath.')).toEqual([...t, npc('Take a breath.')]);
});

test('an empty transcript is just the arriving reply', () => {
  expect(threadOf([], 'Hello.')).toEqual([npc('Hello.')]);
});
