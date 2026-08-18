// Pure helpers for the pronunciation loop. Kept out of the components so the
// rules that actually decide what a learner sees are testable without a
// renderer (this repo has no RN render-test harness).
//
// The scoring shape these work against comes from the server:
//   words[].syllables[] and words[].phonemes[] are two FLAT SIBLING ARRAYS with
//   no index linking them. Azure only relates them by timing.

export type TargetToken = { w: string; hi?: 'drug' | 'num' };

/** A span carrying Azure's 100-ns ticks. Both fields are optional because a
 *  response that omits them must still parse (server business-rules R10). */
export type TimedSpan = { offset?: number; duration?: number };

export type SyllableMatch = {
  /** Index into `syllables` per phoneme, or null when no window contains it. */
  matches: (number | null)[];
  /** True when timing data is present in name only — see matchPhonemesToSyllables. */
  suspectAllZero: boolean;
};

// Dose units that appear in the curriculum's medication lines. Deliberately not
// exhaustive: an unmatched unit degrades to plain text, which is correct — a
// wrong highlight is worse than none.
const UNIT =
  '(?:mg|mcg|ug|kg|g|mL|ml|L|cc|units?|milligrams?|micrograms?|milliliters?|millilitres?|grams?|liters?|litres?)';
const NUM_UNIT = new RegExp(`\\d+(?:[.,]\\d+)?\\s*${UNIT}\\b`, 'gi');

type Range = { start: number; end: number; hi: 'drug' | 'num' };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split a target sentence into render tokens, marking the two spans SoT
 * highlights: drug names (lilac) and dose amounts (yellow) — L77/L43 of
 * screen-pronunciation.jsx.
 *
 * A sentence with nothing to highlight comes back as ONE plain token, not an
 * empty array: the card always renders the line.
 */
export function splitTargetTokens(text: string, drugNames: string[]): TargetToken[] {
  const ranges: Range[] = [];

  // Drug names win over dose spans: they are explicit input, the dose regex is
  // a heuristic. Collect them first so the overlap check below drops the guess.
  //
  // Longest first, and every candidate is overlap-checked — including against
  // OTHER drug names. Combination products share substrings ("amoxicillin
  // clavulanate" contains "clavulanate"), and without this the shared part gets
  // emitted twice, so joining the tokens no longer reproduces the sentence.
  const byLength = [...drugNames].filter(Boolean).sort((a, b) => b.length - a.length);
  const claim = (start: number, end: number, hi: 'drug' | 'num'): void => {
    if (ranges.some((r) => start < r.end && end > r.start)) return;
    ranges.push({ start, end, hi });
  };

  for (const name of byLength) {
    const re = new RegExp(`\\b${escapeRe(name)}\\b`, 'gi');
    for (let m = re.exec(text); m !== null; m = re.exec(text)) {
      claim(m.index, m.index + m[0].length, 'drug');
    }
  }

  NUM_UNIT.lastIndex = 0;
  for (let m = NUM_UNIT.exec(text); m !== null; m = NUM_UNIT.exec(text)) {
    claim(m.index, m.index + m[0].length, 'num');
  }

  if (ranges.length === 0) return [{ w: text }];

  ranges.sort((a, b) => a.start - b.start);

  const out: TargetToken[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) out.push({ w: text.slice(cursor, r.start) });
    out.push({ w: text.slice(r.start, r.end), hi: r.hi });
    cursor = r.end;
  }
  if (cursor < text.length) out.push({ w: text.slice(cursor) });
  return out;
}

/**
 * Colour band for a syllable chip. Boundaries belong to the UPPER band
 * (server business-rules R1) — 80 is ok, 60 is weak.
 */
export function syllableBand(accuracy: number): 'ok' | 'weak' | 'bad' {
  if (accuracy >= 80) return 'ok';
  if (accuracy >= 60) return 'weak';
  return 'bad';
}

/**
 * Join phonemes to the syllable that contains them, by time window:
 * `phoneme.offset ∈ [syllable.offset, syllable.offset + syllable.duration)`.
 *
 * FALLBACK POLICY — deliberately none. A phoneme no window contains comes back
 * as `null`, and the caller must skip that correction point rather than label
 * it. Falling back to "the first syllable" would produce a screen that looks
 * perfectly fine while every label is wrong, which is the exact silent failure
 * this join exists to avoid.
 *
 * `suspectAllZero` flags the case that motivated the policy: whether Azure's
 * REST response actually carries these offsets is UNVERIFIED (the documented
 * example JSON is SDK-shaped). If it does not, every value arrives as 0.
 *
 * The detection rule is physical, not structural: spans of real speech are
 * strictly ordered in time, so TWO OR MORE spans all reporting offset 0 means
 * the field is absent, not that they genuinely coincide. Checking each array
 * independently matters — if only the phonemes lose their offsets while the
 * syllables keep real timing, every phoneme still lands inside the first
 * syllable's window (which usually starts at 0) and would be mislabeled with
 * no complaint at all. When the flag is up we return no matches rather than
 * those plausible-looking ones: refusing to guess is the whole point.
 */
export function matchPhonemesToSyllables(
  phonemes: TimedSpan[],
  syllables: TimedSpan[]
): SyllableMatch {
  const allAtZero = (spans: TimedSpan[]): boolean =>
    spans.length > 1 && spans.every((s) => !s.offset);
  // Durations get the same treatment for a simpler reason: a syllable that lasts
  // zero ticks has an empty window and can hold nothing, so an array where every
  // one of them is zero produces the identical "no correction points" silence.
  const noDurations = syllables.length > 0 && syllables.every((s) => !s.duration);
  const suspectAllZero = allAtZero(phonemes) || allAtZero(syllables) || noDurations;

  if (suspectAllZero) {
    return { matches: phonemes.map(() => null), suspectAllZero: true };
  }

  const matches = phonemes.map((p) => {
    const at = p.offset ?? 0;
    const i = syllables.findIndex((s) => {
      const start = s.offset ?? 0;
      const end = start + (s.duration ?? 0);
      return at >= start && at < end;
    });
    return i === -1 ? null : i;
  });

  return { matches, suspectAllZero: false };
}
