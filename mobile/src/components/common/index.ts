// Legacy surface during the design-system migration.
// New screens import primitives from `src/ui/` instead. Items listed
// here are still read by un-migrated screens; each one disappears from
// this barrel as its call sites flip to the new module.

export { Input } from './Input';
export { Icon } from './Icon';
export type { HeroIconName, UtilIconName, IconName } from './Icon';
