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
  /** Red embroidery thread — the journey trail's yarn (Task H, journey-binder-v42).
   *  Distinct from `red` (`#C75146`, the pen): this is a physical thread colour, not ink,
   *  and the two screens that use them side by side (the stamp trail's yarn against its
   *  pencil-dashed future segment, which reuses `nb.ink` at low opacity) never need to
   *  tell `red` and `yarn` apart, but a component reading the wrong token would still be
   *  a silent colour bug — hence its own name rather than reusing `red`. */
  yarn: '#D3574B',
  /** Amber and purple pens — the words and guided-dialogue steps of a lesson
   *  (StepTrack, v44). The other two steps reuse `blue` and `red`. */
  amber: '#C77E2E',
  purple: '#7A5C9E',

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

/**
 * The passport's cover — deep green and gold leaf.
 *
 * Kept apart from `nb` because it is not the notebook: `nb` describes paper a nurse writes
 * on, and this describes a document an authority issued. It is shared by the three screens
 * that show that cover (the launch screen, the onboarding splash and the passport's first
 * page), which is the whole reason it is not three sets of local constants — they have to
 * be the same green.
 */
export const cover = {
  green: '#2E4636',
  gold: '#D4B46A',
  goldSoft: 'rgba(212,180,106,.75)',
  goldFaint: 'rgba(212,180,106,.6)',
  cream: '#F3E6C8',
  creamSoft: 'rgba(243,230,200,.7)',
  creamFaint: 'rgba(243,230,200,.55)',
} as const;

/**
 * How far below the top of the screen a page's first line sits.
 *
 * The notebook screens draw their own headers inside a ScrollView rather than using a
 * navigation bar, so nothing reserves the status bar for them — without this the title
 * lands under the notch. 52 is what every screen in the app has used since the pixel line;
 * it is a floor rather than a measurement, and a screen that needs the exact inset should
 * read it from react-native-safe-area-context instead.
 */
export const TOP_INSET = 52;

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

/** Hard offset shadows — the handoff's `Xpx Ypx 0 color` (no blur), per variant.
 *
 *  NbUI (reference/forin-notebook-ui.jsx L58–62): ink `2.5px 2.5px 0 rgba(62,54,43,.3)`,
 *  yellow `2px 2px 0 rgba(62,54,43,.25)`, danger `2px 2px 0 rgba(199,81,70,.25)`. Lesson chips
 *  (forin-notebook-lesson-words-live.jsx L147, -sent-live.jsx L57) `1px 2px 0 rgba(62,54,43,.2)`.
 *
 *  Not `paperShadow`: these are printed blocks, not paper lifting off the page. RN has no
 *  offset-only shadow on Android (elevation always blurs) and an iOS shadow on a see-through
 *  face (yellow, danger) would show through it, so NbUI draws them as the strip outside the
 *  face (see NbHardShadow). */
export const hardShadow = {
  ink: { dx: 2.5, dy: 2.5, color: 'rgba(62,54,43,.3)' },
  yellow: { dx: 2, dy: 2, color: 'rgba(62,54,43,.25)' },
  danger: { dx: 2, dy: 2, color: 'rgba(199,81,70,.25)' },
  chip: { dx: 1, dy: 2, color: 'rgba(62,54,43,.2)' },
} as const;
export type HardShadow = { dx: number; dy: number; color: string };

/** A loose leaf in the lesson's binder — `0 4px 10px rgba(62,54,43,.16)`
 *  (forin-notebook-lesson-words-live.jsx L156, -sent-live.jsx L107). Blur mapped 1:1 to
 *  shadowRadius, the same convention as `paperShadow`. */
export const sheetShadow = {
  shadowColor: '#3E362B',
  shadowOpacity: 0.16,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
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
  bodyHeavy: 'Pretendard-ExtraBold', // 800 — the stamp's top line (ui.jsx L85–92)
  mono: 'IBMPlexMono',
  monoBold: 'IBMPlexMono-Bold', // the handoff's MONO is always 700
} as const;
