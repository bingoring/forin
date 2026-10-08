// A line of text with a highlighted run INSIDE it — the handoff's inline `<NbMark>` in a
// sentence ("구급대 인계 — 뜻을 보고 [영어를 떠올려]보세요", words-live L270).
//
// NbMark marks a whole Text: it reads the wrapped lines back from `onTextLayout` and lays a
// band under each. A run in the middle of a sentence has no lines of its own — RN reports the
// lines of the whole Text, not where a nested span starts or ends. So the span's two ends are
// measured: invisible copies of the text, cut where the run starts and ends, are laid out at
// the same width, and the end of each copy's last line is where the cut fell.
//
// Cut at word ends, not inside the word: a prefix ending mid-word can fit on a line the whole
// word does not (the full text breaks the word to the next line; the cut copy does not). So
// the copy runs to the end of the word, and the part of that word outside the run is measured
// alone and taken off.
//
// The band itself is NbMark's (ui.jsx L94–96): 55%→100% of each line, square, 2pt past the
// glyphs at the run's two ends. The `<mark>`'s padding also pushes the words 2pt apart there;
// that 2pt is not reproduced (the words are one Text, which a gap cannot be put inside).
import { useState } from 'react';
import { StyleSheet, Text, View, type NativeSyntheticEvent, type StyleProp, type TextLayoutEventData, type TextLayoutLine, type TextStyle, type ViewStyle } from 'react-native';
import { MARK } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';

export type MarkPart = { text: string; mark?: boolean };

/** `'뜻을 보고 [영어를 떠올려]보세요'` → parts. The catalog marks the highlighted run with [ ]. */
export function parseMarked(s: string): MarkPart[] {
  const out: MarkPart[] = [];
  const re = /\[([^\]]*)\]/g;
  let at = 0;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m.index > at) out.push({ text: s.slice(at, m.index) });
    if (m[1]) out.push({ text: m[1], mark: true });
    at = m.index + m[0].length;
  }
  if (at < s.length) out.push({ text: s.slice(at) });
  return out;
}

const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c);
/** The index just past the word that the character at `i` belongs to. */
export function wordEnd(s: string, i: number): number {
  let k = i;
  while (k < s.length && !isSpace(s[k])) k++;
  return k;
}

/** Where to cut the invisible copies for one marked run [start, end). */
export function cuts(full: string, start: number, end: number) {
  const startWordEnd = wordEnd(full, start);
  const endWordEnd = Math.max(end, wordEnd(full, Math.max(start, end - 1)));
  return {
    /** text up to the end of the word the run starts in */
    a: full.slice(0, startWordEnd),
    /** the run's part of that word — taken off the end of `a` */
    b: full.slice(start, startWordEnd),
    /** text up to the end of the word the run ends in */
    c: full.slice(0, endWordEnd),
    /** the rest of that word after the run — taken off the end of `c` */
    d: full.slice(end, endWordEnd),
  };
}

type Line = Pick<TextLayoutLine, 'x' | 'y' | 'width' | 'height'>;
export type Band = { left: number; top: number; width: number; height: number };

const lastEnd = (ls: Line[]) => {
  const l = ls[ls.length - 1];
  return { line: ls.length - 1, x: l.x + l.width };
};

/** The bands under one run, from the full text's lines and the four measured copies. */
export function markBands(full: Line[], a: Line[], bWidth: number, c: Line[], dWidth: number): Band[] {
  if (!full.length || !a.length || !c.length) return [];
  const s = lastEnd(a);
  const e = lastEnd(c);
  const startLine = Math.min(s.line, full.length - 1);
  const endLine = Math.min(e.line, full.length - 1);
  const out: Band[] = [];
  for (let k = startLine; k <= endLine; k++) {
    const ln = full[k];
    const x0 = k === startLine ? s.x - bWidth - MARK.padX : ln.x;
    const x1 = k === endLine ? e.x - dWidth + MARK.padX : ln.x + ln.width;
    if (x1 <= x0) continue;
    out.push({ left: x0, top: ln.y + ln.height * MARK.from, width: x1 - x0, height: ln.height * (1 - MARK.from) });
  }
  return out;
}

type Measure = { a?: Line[]; b?: number; c?: Line[]; d?: number };

export function MarkedText({ parts, textStyle, style, testID }: {
  parts: MarkPart[];
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const full = parts.map((p) => p.text).join('');
  const ranges: { start: number; end: number }[] = [];
  let at = 0;
  for (const p of parts) {
    if (p.mark) ranges.push({ start: at, end: at + p.text.length });
    at += p.text.length;
  }
  const [lines, setLines] = useState<Line[]>([]);
  const [m, setM] = useState<Record<string, Measure>>({});
  const put = (r: number, k: keyof Measure, v: Line[] | number) =>
    setM((prev) => ({ ...prev, [r]: { ...prev[r], [k]: v } }));
  const linesOf = (e: NativeSyntheticEvent<TextLayoutEventData>) => e.nativeEvent.lines as Line[];
  const widthOf = (e: NativeSyntheticEvent<TextLayoutEventData>) => e.nativeEvent.lines.reduce((w, l) => w + l.width, 0);

  const bands = ranges.flatMap((r, i) => {
    const mm = m[i];
    if (!mm?.a || !mm.c || mm.b == null || mm.d == null) return [];
    return markBands(lines, mm.a, mm.b, mm.c, mm.d);
  });

  return (
    <View testID={testID} style={[{ position: 'relative' }, style]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {bands.map((b, k) => (
          <View key={k} testID="marked-band" style={{ position: 'absolute', left: b.left, top: b.top, width: b.width, height: b.height, backgroundColor: nb.marker }} />
        ))}
      </View>
      <Text style={textStyle} onTextLayout={(e) => setLines(linesOf(e))}>
        {parts.map((p, k) => <Text key={k}>{p.text}</Text>)}
      </Text>
      {/* The invisible copies. Same width and type as the line above, so they wrap the same. */}
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, { opacity: 0 }]}>
        {ranges.map((r, i) => {
          const x = cuts(full, r.start, r.end);
          return (
            <View key={i} style={StyleSheet.absoluteFill}>
              <Text style={[textStyle, styles.ghost]} onTextLayout={(e) => put(i, 'a', linesOf(e))}>{x.a}</Text>
              <Text style={[textStyle, styles.ghost]} onTextLayout={(e) => put(i, 'c', linesOf(e))}>{x.c}</Text>
              <View style={styles.free}>
                <Text style={textStyle} onTextLayout={(e) => put(i, 'b', widthOf(e))}>{x.b}</Text>
              </View>
              {x.d ? (
                <View style={styles.free}>
                  <Text style={textStyle} onTextLayout={(e) => put(i, 'd', widthOf(e))}>{x.d}</Text>
                </View>
              ) : <ZeroWidth onReady={() => { if (m[i]?.d !== 0) put(i, 'd', 0); }} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** No tail to measure: report 0 once laid out. */
function ZeroWidth({ onReady }: { onReady: () => void }) {
  return <View onLayout={onReady} />;
}

const styles = StyleSheet.create({
  ghost: { position: 'absolute', left: 0, right: 0, top: 0 },
  // Unconstrained: a fragment measured alone must not wrap at the line's width.
  free: { position: 'absolute', left: 0, top: 0, width: 2000, flexDirection: 'row', alignItems: 'flex-start' },
});
