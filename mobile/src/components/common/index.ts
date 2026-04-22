// Legacy surface during the design-system migration.
//
// Only the legacy `Icon` remains — it's still read by inner components
// that haven't been redesigned yet (scene/exercises/map). New code uses
// `../ui` exclusively. This barrel disappears when those inner
// components get rebuilt.

export { Icon } from './Icon';
export type { HeroIconName, UtilIconName, IconName } from './Icon';
