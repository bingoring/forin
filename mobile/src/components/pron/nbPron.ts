// The pronunciation screens' own palette, in the 근무 수첩 line.
//
// Two things here are NOT nb tokens, deliberately:
//
//  · The three bands (good / shaky / again) are stronger than nb.wash, because they are
//    read as a group of sixteen small chips rather than as a fill behind a drawing. At
//    wash strength the difference between "좋아요" and "다시!" disappears at chip size,
//    which is the one thing the syllable grid exists to show.
//  · The audio panel is an INSTRUMENT, not paper. A waveform is a readout from a machine,
//    and drawing it on cream stock with a pen border would say the nurse sketched her own
//    voice. So it keeps the reference's dark blue-grey slab and the cyan trace.
//
// SoT: design-handoff_v29/reference/forin-notebook-pron.jsx
import { nb } from '@/theme/nb';

/** How a syllable came out. Same three bands the server's scores are bucketed into
 *  (lib/pronTokens syllableBand), so the chip, the legend and the history bar agree. */
export const BAND = {
  ok: 'rgba(168,217,151,.7)',
  weak: 'rgba(249,227,123,.7)',
  bad: 'rgba(244,164,155,.7)',
} as const;

/** The legend's swatches, one step stronger — an 11pt square at .7 reads as paper. */
export const BAND_SWATCH = {
  ok: 'rgba(168,217,151,.9)',
  weak: 'rgba(249,227,123,.9)',
  bad: 'rgba(244,164,155,.9)',
} as const;

/** The bars in a gauge, which are hatched rather than filled — see NbGauge. */
export const BAND_INK = {
  ok: nb.green,
  weak: '#C99A1E',
  bad: nb.red,
} as const;

/** The audio slab. */
export const AUDIO = {
  bg: '#1D2B33',
  edge: '#0F1B21',
  /** Every fourth bar of the trace, so the wave has a beat instead of a texture. */
  waveLit: '#8FC7E8',
  wave: '#4E7A8E',
  label: '#9BB8C6',
  rec: '#E4574B',
  quiet: '#9BA8A0',
} as const;
