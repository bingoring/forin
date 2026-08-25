// Which of the app's original line-icon names v23's FIcon set replaces.
//
// v23 makes FIcon the global icon system, so a surface drawing a line icon for
// something FIcon has is drawing the retired artwork. This table is the mapping,
// and iconAdoption.test.ts uses it to keep call sites from drifting back.
//
// Names ABSENT from this table are absent on purpose — FIcon's 87 icons have no
// equivalent, so PixelIcon remains correct for them:
//
//   chevron-right/left/up/down  navigation chrome; FIcon has only a bare `arrow`,
//                               which points right and cannot serve four directions
//   tag, share, copy, shift     UI affordances the catalogue does not cover
//   plus                        FIcon has no plus
//   crown, shield, sprout, ...  title badges with no FIcon counterpart
//   star                        the FAVOURITES mark. v25 retires the star as the
//                               REWARD symbol (⭐🌟★ → xp, now a yellow XP badge),
//                               and the reward surfaces draw that. Favourites is a
//                               different thing: it needs filled and unfilled states,
//                               and aliasing it turned every pin into an XP badge —
//                               a real regression this table caused once already.
//
// The other reason a call site legitimately keeps PixelIcon is COLOUR. FIcon
// artwork carries its own fixed palette and takes no tint, so anywhere the icon
// must be white on a dark bar, faded for a disabled state, or an accent colour,
// the line icon is still the right tool. Those sites are the ones passing
// something other than ink.
export const LINE_TO_FICON: Record<string, string> = {
  // Straight renames — same drawing, FIcon's name for it.
  check: 'check',
  mic: 'mic',
  play: 'play',
  target: 'target',
  pin: 'pin',
  lock: 'lock',
  home: 'home',
  moon: 'moon',
  pill: 'pill',
  speech: 'speech',
  sparkle: 'sparkle',
  handshake: 'handshake',
  calendar: 'calendar',
  clock: 'clock',
  heart: 'heart',
  bolt: 'bolt',
  trophy: 'trophy',
  baby: 'baby',
  bed: 'bed',
  brain: 'brain',
  eye: 'eye',
  ribbon: 'ribbon',
  teddy: 'teddy',
  syringe: 'syringe',
  scalpel: 'scalpel',
  box: 'box',
  flower: 'flower',

  // Renames where FIcon calls it something else.
  volume: 'speaker',
  alert: 'warn',
  x: 'cross',
  bulb: 'hint',
  search: 'magnify',
  chart: 'chartup',
  clipboard: 'board',
  stethoscope: 'stetho',
  'nurse-cap': 'nurse',
  medal: 'badge',
  cup: 'coffee',
  cap: 'gradcap',
  xray: 'dx',
  microscope: 'flask',
  prosthesis: 'bone',
  refresh: 'retry',

  // Judged, not obvious:
  // `note` is a document with a folded corner, which is FIcon's `doc`. The Review
  // Lab's own notebook is `lab`, and that one is chosen per-site rather than here.
  note: 'doc',
  // `people` draws a single bust, and v23 maps 👤/👥 to `me`.
  people: 'me',
  // v23 maps 👏 to sparkle — applause is celebration, and FIcon has no hands.
  clap: 'sparkle',
  // v23 maps 🗺 and 🧭 both to compass; our folded map is the same affordance.
  map: 'compass',
  // v23 maps 💧 to wave.
  droplet: 'wave',
  flame: 'fire',
};

/** FIcon's name for a line-icon name, or undefined when FIcon has no equivalent. */
export function ficonFor(lineName: string): string | undefined {
  return LINE_TO_FICON[lineName];
}
