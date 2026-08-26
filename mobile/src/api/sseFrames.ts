// Parsing SSE frames — extracted so it can be tested without an XMLHttpRequest.
//
// The dialogue stream carries three kinds of frame: unnamed `data:` (a text delta),
// `event: mood` / `event: moodImproved` (signals about the NPC), and `event: error`.
// A parser that reads only `data:` lines treats all of them as speech, which is how
// an AI failure used to type "ai unavailable" into the patient's mouth.
export type SseFrame =
  | { kind: 'delta'; text: string }
  | { kind: 'mood'; mood: string }
  | { kind: 'improved'; mood: string }
  | { kind: 'resolved' }
  | { kind: 'error' }
  | { kind: 'done' };

/** Parses whole lines into frames. `event:` binds to the `data:` that follows it and
 *  the binding ends at the blank line, exactly as the SSE spec says. */
export function parseSseLines(lines: string[]): SseFrame[] {
  const out: SseFrame[] = [];
  let event = '';
  for (const raw of lines) {
    const l = raw.trim();
    if (l === '') { event = ''; continue; }
    if (l.startsWith('event:')) { event = l.slice(6).trim(); continue; }
    if (!l.startsWith('data:')) continue;
    const payload = l.slice(5).trim();
    if (payload === '"[DONE]"' || payload === '[DONE]') { out.push({ kind: 'done' }); continue; }
    let value: unknown;
    try { value = JSON.parse(payload); } catch { continue; }
    if (typeof value !== 'string') continue;
    if (event === 'mood') out.push({ kind: 'mood', mood: value });
    else if (event === 'moodImproved') out.push({ kind: 'improved', mood: value });
    else if (event === 'resolved') out.push({ kind: 'resolved' });
    else if (event === 'error') out.push({ kind: 'error' });
    else if (event === '') out.push({ kind: 'delta', text: value });
    // An event name we do not know is dropped rather than shown: a future server
    // signal must not appear in a speech bubble.
  }
  return out;
}
