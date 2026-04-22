// Public surface of the theme module.
//
// New code reads from the named exports below:
//   • `color` — semantic palette
//   • `palette` — brand palette (rarely needed; prefer `color`)
//   • `radius`, `sp`, `elevation`, `pushable`, `duration`, `easing`
//   • `fontFamily`, `fontSize`, `text`
//
// Legacy screens still import the old bridges (`colors`, `typography`,
// `spacing`, `borderRadius`) during the design-system migration; those
// re-exports disappear once every screen is on the new tokens.

export {
  palette,
  color,
  radius,
  elevation,
  pushable,
  duration,
  easing,
  fontFamily,
  fontSize,
} from './tokens';
export type { PushableSize } from './tokens';

// Rename the new 4pt-grid spacing to `sp` on the way out so it doesn't
// collide with the legacy `spacing` alias (xs/sm/md/lg/xl) still used by
// un-migrated screens. New components use `sp.s4`; migrated screens will
// update their imports when they adopt the new design system.
export { spacing as sp } from './tokens';

export { text } from './text';
export type { TextVariant } from './text';

// — Legacy bridges (removed as each screen migrates) ——————————
export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
