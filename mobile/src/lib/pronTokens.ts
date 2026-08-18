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

// ── CorrectionPoints — business-logic-model.md §2 ───────────────────────────
//
// Structural (not imported from @/api/client) so this stays a dependency-free
// pure-logic module; the shapes line up with WordScore/SyllableScore/
// PhonemeScore there by construction.
export type CorrectionPhoneme = TimedSpan & { phoneme: string; accuracy: number };
export type CorrectionSyllable = TimedSpan & { syllable: string };
export type CorrectionWord = { syllables?: CorrectionSyllable[]; phonemes?: CorrectionPhoneme[] };

/** The Korean coaching for one phoneme. Sourced from the server's phoneme-tip
 *  mapping (server/internal/content/phonemetips) — NEVER hand-authored here.
 *  As of this task that mapping is not yet wired into any HTTP response, so
 *  every real caller's lookup returns undefined for every phoneme; this
 *  function still has to behave correctly (render fewer than 2, never a fake
 *  one) once it is. */
export type CorrectionTip = { ipa: string; message: string };

/**
 * Adapts POST /pronunciation's `phonemeTips` field (Task 11) into the
 * `lookupTip` callback buildCorrectionPoints already expected — T7 stubbed
 * that callback as `() => undefined` because nothing populated the field
 * yet; this is the real implementation.
 *
 * A plain object index, not a re-derivation: the server (content/
 * phonemetips) is the only thing that should interpret phoneme notation
 * (SAPI vs IPA vs dictionary spelling — see that package's own doc), and it
 * already sends one deduplicated entry per distinct phoneme keyed by the
 * SAME raw spelling that appears in this response's words[].phonemes[]
 * (phonemeTipsFor's own doc on the server). Re-normalizing here would risk
 * silently drifting from that logic.
 *
 * Returns undefined for a phoneme with no entry — business-rules R5, same as
 * every other lookupTip caller: skip it, never fabricate a tip.
 */
export function phonemeTipLookup(
  tips: Record<string, CorrectionTip> | undefined
): (phoneme: string) => CorrectionTip | undefined {
  return (phoneme: string) => tips?.[phoneme];
}

export type CorrectionPoint = {
  /** The SYLLABLE the worst phoneme sits in (SoT's "min"/"li") — not the
   *  phoneme itself; business-logic-model §2. */
  syllable: string;
  /** Assembled from every phoneme whose time window falls in that same
   *  syllable (SyllableResult itself carries no ipa field), not just the one
   *  flagged phoneme — see CorrectionCard.tsx's doc comment. */
  ipa: string;
  message: string;
  /** true → red label (accuracy < 60), false → yellow (business-rules R1's
   *  bad/weak split, reused here since CorrectionCard has no third color). */
  severe: boolean;
};

export type CorrectionResult = {
  points: CorrectionPoint[];
  /** OR'd across every word's matchPhonemesToSyllables call. See that
   *  function's doc for what this means and why it must not be silently
   *  swallowed — the caller (the route) is responsible for surfacing it
   *  (requirement: __DEV__ warning + an on-screen, distinguishable marker),
   *  never just rendering an empty correction-points section as if there
   *  were genuinely nothing to correct. */
  suspectAllZero: boolean;
};

/**
 * Picks the (up to) 2 lowest-accuracy phonemes across the whole sentence that
 * both (a) land inside a syllable window and (b) have a Korean tip mapped,
 * per business-logic-model §2 `CorrectionPoints`:
 *
 *   1. flatten every word's phonemes, tagged with sentence order
 *   2. sort by accuracy ascending, ties broken by that order
 *   3. walk the sorted list; skip anything with no syllable match (R5's
 *      spirit — nothing to label) or no tip (R5 itself); stop at `max`
 *
 * Never pads to `max` with a placeholder: business-rules R5 explicitly
 * prefers fewer real cards over any empty one.
 */
export function buildCorrectionPoints(
  words: CorrectionWord[],
  lookupTip: (phoneme: string) => CorrectionTip | undefined,
  max = 2
): CorrectionResult {
  type Candidate = { wordIdx: number; phonemeIdx: number; phoneme: string; accuracy: number; order: number };

  const candidates: Candidate[] = [];
  const syllableIndexByWord: (number | null)[][] = [];
  let order = 0;
  let suspectAllZero = false;

  words.forEach((w, wi) => {
    const phonemes = w.phonemes ?? [];
    const syllables = w.syllables ?? [];
    const { matches, suspectAllZero: sus } = matchPhonemesToSyllables(phonemes, syllables);
    syllableIndexByWord[wi] = matches;
    if (sus) suspectAllZero = true;
    phonemes.forEach((p, pi) => {
      candidates.push({ wordIdx: wi, phonemeIdx: pi, phoneme: p.phoneme, accuracy: p.accuracy, order: order++ });
    });
  });

  candidates.sort((a, b) => a.accuracy - b.accuracy || a.order - b.order);

  const points: CorrectionPoint[] = [];
  for (const c of candidates) {
    if (points.length >= max) break;

    const sylIdx = syllableIndexByWord[c.wordIdx]?.[c.phonemeIdx];
    if (sylIdx === null || sylIdx === undefined) continue; // no window contains it — can't label

    const tip = lookupTip(c.phoneme);
    if (!tip) continue; // R5: no Korean tip for this phoneme, move down the list

    const syllable = words[c.wordIdx].syllables?.[sylIdx];
    if (!syllable) continue;

    const wordPhonemes = words[c.wordIdx].phonemes ?? [];
    const wordMatches = syllableIndexByWord[c.wordIdx];
    const sylPhonemes = wordPhonemes.filter((_, pi) => wordMatches[pi] === sylIdx).map((p) => p.phoneme);

    points.push({
      syllable: syllable.syllable,
      ipa: `/${sylPhonemes.length ? sylPhonemes.join('') : c.phoneme}/`,
      message: tip.message,
      severe: c.accuracy < 60,
    });
  }

  return { points, suspectAllZero };
}

// ── downsampleAmplitude — collapse a full recording's amplitude samples into
// a fixed-length bar array for retrospective display ────────────────────────
//
// The live WavePanel keeps only a short rolling window of recent samples (a
// real-time meter, by design). That same rolling array is NOT what the result
// screen's "내 발음" waveform should show — a 10s utterance rendered from only
// its last ~2s of samples silently mislabels the whole clip as its tail
// (review finding, task-8-report.md). This is the retrospective counterpart:
// call it once, at stop time, over every sample collected during the
// recording, to get a fixed-size array spanning the FULL clip.
export function downsampleAmplitude(samples: number[], count: number): number[] {
  if (count <= 0) return [];
  if (samples.length === 0) return Array(count).fill(0.05);

  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor((i / count) * samples.length);
    const end = Math.max(start + 1, Math.floor(((i + 1) / count) * samples.length));
    const bucket = samples.slice(start, Math.min(end, samples.length));
    const avg = bucket.length ? bucket.reduce((a, b) => a + b, 0) / bucket.length : samples[samples.length - 1];
    out.push(avg);
  }
  return out;
}
