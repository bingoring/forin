// The 근무 수첩 (work-notebook) design line — v28/v29.
//
// A different visual language from the pixel one, not a variation of it. The pixel tokens
// (theme/tokens.ts) describe chunky outlines, hard offset shadows and square corners; this
// describes paper. Lined cream stock, cards cut from a lighter sheet and taped or pinned
// down, ink and red pen, a highlighter, and round rubber stamps.
//
// Kept in its own file rather than added to `tokens` because the two are not
// interchangeable: a screen belongs to one line or the other, and a mixed screen looks
// like a mistake rather than a blend. Screens are ported one at a time (see
// components/nb), and until a screen is ported it keeps the pixel tokens.
//
// Source of truth: docs/dlc/projects/forin/inputs/design-handoff_v29/07_NOTEBOOK_REDESIGN.md
// and reference/forin-notebook-ui.jsx (window.NbUI).

export const nb = {
  /** Pen ink — borders and primary text. */
  ink: '#3E362B',
  /** Pencil grey — secondary text, dashed rules. */
  soft: '#9A8F7C',
  /** Red pen — corrections, urgency, the "지금" tag. */
  red: '#C75146',
  /** Blue pen — explanations, info memos. */
  blue: '#4A6FA5',
  /** Green pen — passes, progress, local-staff badge. */
  green: '#5F8D5A',

  /** The notebook itself: cream stock with ruled lines. */
  cream: '#F1EBDD',
  /** A card cut from a lighter sheet and laid on the notebook. */
  paper: '#FFFdf4',
  /** The cut edge of that card. */
  paperEdge: '#E0D6C0',
  /** Masking tape — translucent sky blue. */
  tape: 'rgba(160,200,220,.55)',
  /** Highlighter, as it sits over text: the bottom 45% of the line. */
  marker: '#F9E37B',
  /** Placeholder handwriting in a blank field. */
  placeholder: '#B4A88F',
  /** Dark mode — used by the recording screen and the immigration desk. */
  dark: '#2E2823',

  /** Watercolour fills inside the doodle icons. Deliberately weak: the drawing is the
   *  stroke, and a strong fill turns a pen sketch into a sticker. */
  wash: {
    red: 'rgba(199,81,70,.18)',
    blue: 'rgba(74,111,165,.18)',
    green: 'rgba(95,141,90,.2)',
    yellow: 'rgba(233,196,90,.3)',
    peach: 'rgba(233,150,100,.22)',
  },
} as const;

/** The ruled lines: one every 28pt, the line itself 1pt. */
export const RULE_H = 28;
export const RULE_COLOR = 'rgba(62,54,43,.06)';

/** Card shadow. Soft and low — paper on paper, not a pixel block.
 *
 *  This is the one place the notebook line uses a BLURRED shadow, which the pixel line
 *  forbids. Different material: a pixel card has a hard offset because it is a sprite; a
 *  sheet of paper lifts a millimetre off the page. */
export const paperShadow = {
  shadowColor: '#3E362B',
  shadowOpacity: 0.14,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

/** Three faces, three jobs.
 *
 *  · hand  — Gaegu. Headings, labels, buttons, anything a nurse would have written.
 *  · body  — Pretendard. Sentences, Korean prose, anything that has to be READ.
 *  · mono  — IBM Plex Mono. Codes, IPA, timestamps, the passport's MRZ — anything
 *            that is machine-printed in the fiction.
 *
 *  The handwriting face is not used for body text on purpose: Gaegu at 12pt over three
 *  lines of Korean is charming and unreadable. */
export const nbFonts = {
  hand: 'Gaegu',
  handBold: 'Gaegu-Bold',
  body: 'Pretendard',
  bodyMid: 'Pretendard-SemiBold',
  bodyBold: 'Pretendard-Bold',
  mono: 'IBMPlexMono',
  monoBold: 'IBMPlexMono-SemiBold',
} as const;
