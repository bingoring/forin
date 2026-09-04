// The character's line, revealed one letter at a time — the way the immigration officer's
// question types out in onboarding. A line that appears all at once reads as a caption; a
// line that types reads as someone speaking, which is the whole fiction of the dialogue.
//
// It works with the streamed reply, not against it: while `text` grows (tokens arriving),
// the reveal keeps going from where it was and never runs AHEAD of what has arrived — a
// streamed line types no faster than it is received, and then finishes typing after the
// stream is done. A `text` that is not an extension of the last one (a new turn) restarts
// the reveal from the first letter.
import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

export function Typewriter({ text, style, speedMs = 20 }: {
  text: string;
  style?: StyleProp<TextStyle>;
  /** Milliseconds per character. Lower is faster. */
  speedMs?: number;
}) {
  const [n, setN] = useState(0);
  const prev = useRef('');
  // The latest text, read inside the interval so one interval can serve a line that keeps
  // growing without being torn down and rebuilt on every token.
  const textRef = useRef(text);
  textRef.current = text;

  // A brand-new line (not a growth of the last) starts the reveal over; a growth keeps it.
  useEffect(() => {
    if (!text.startsWith(prev.current)) setN(0);
    prev.current = text;
  }, [text]);

  // One interval for the component's life: each tick reveals one more character, up to
  // whatever has ARRIVED. It idles (returns the same count) once caught up, and picks back
  // up on its own when more text lands or the line is replaced — a setTimeout re-scheduled
  // per character stalled behind React's batching instead.
  useEffect(() => {
    const id = setInterval(() => {
      setN((v) => (v < textRef.current.length ? v + 1 : v));
    }, speedMs);
    return () => clearInterval(id);
  }, [speedMs]);

  return <Text style={style}>{text.slice(0, Math.min(n, text.length))}</Text>;
}
