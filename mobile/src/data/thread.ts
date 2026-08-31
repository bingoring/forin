// What the conversation shows, from what the screen holds.
//
// Two sources: `transcript`, the turns that have been exchanged, and `npcLine`, the reply
// currently arriving — which is NOT in the transcript yet. It is appended there when the
// learner answers, which is exactly where a duplicate comes from: show both without
// thinking and the newest NPC line appears twice the moment the turn completes.
//
// A function rather than three inline lines because that duplicate is the one thing here
// that can be wrong, and it is invisible until a conversation is two turns long.
export type Turn = {
  role: 'user' | 'npc';
  text: string;
  /** Why this reply was the reply, for a line the learner PICKED from an authored
   *  conversation. Shown under their own bubble, because on that pass the pick is sent
   *  immediately and the card carrying the reason is gone before they read it. */
  note?: string;
};

export function threadOf(transcript: Turn[], npcLine: string): Turn[] {
  if (!npcLine) return transcript;
  const last = transcript[transcript.length - 1];
  // Already the last thing in the transcript: it was appended when the learner answered,
  // and npcLine has not been replaced yet.
  if (last && last.role === 'npc' && last.text === npcLine) return transcript;
  return [...transcript, { role: 'npc', text: npcLine }];
}
