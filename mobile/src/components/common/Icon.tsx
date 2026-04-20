import React from 'react';
import type { IconProps, IconWeight } from 'phosphor-react-native';
import {
  BedIcon,
  StethoscopeIcon,
  PillIcon,
  SyringeIcon,
  FirstAidIcon,
  HospitalIcon,
  CouchIcon,
  ChatsCircleIcon,
  DoorIcon,
  StarIcon,
  HeartIcon,
  FireIcon,
  LeafIcon,
  DiamondIcon,
  GiftIcon,
  UserIcon,
  UsersThreeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XIcon,
  CheckIcon,
  ListIcon,
  PlusIcon,
  GearIcon,
  MagnifyingGlassIcon,
  CaretRightIcon,
  CaretLeftIcon,
  CaretUpIcon,
  CaretDownIcon,
  LockIcon,
  LockOpenIcon,
  MapPinIcon,
  ElevatorIcon,
} from 'phosphor-react-native';
import { colors } from '../../theme';

// Hero icons carry semantic meaning in map hotspots, gamification,
// and celebration flows. Swap to Flaticon SVGs later by extending
// `heroIconRegistry`; callers' `name` prop doesn't change.
const heroIconRegistry = {
  // locations
  desk: UsersThreeIcon,
  bedside: BedIcon,
  bathroom: DoorIcon,
  triage: FirstAidIcon,
  pharmacy: PillIcon,
  ward: HospitalIcon,
  consult: ChatsCircleIcon,
  waiting: CouchIcon,
  generic: MapPinIcon,
  // professions (best-available Phosphor match — a nurse glyph doesn't
  // exist so we use User and pair it with role-specific tooling icons)
  nurse: UserIcon,
  doctor: StethoscopeIcon,
  pharmacist: PillIcon,
  // gamification
  xp: StarIcon,
  heart: HeartIcon,
  streak: FireIcon,
  catnip: LeafIcon,
  gem: DiamondIcon,
  gift: GiftIcon,
  // map helpers
  elevator: ElevatorIcon,
  pin: MapPinIcon,
  syringe: SyringeIcon,
} as const;

const utilIconRegistry = {
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  x: XIcon,
  check: CheckIcon,
  menu: ListIcon,
  plus: PlusIcon,
  settings: GearIcon,
  search: MagnifyingGlassIcon,
  'caret-right': CaretRightIcon,
  'caret-left': CaretLeftIcon,
  'caret-up': CaretUpIcon,
  'caret-down': CaretDownIcon,
  lock: LockIcon,
  'lock-open': LockOpenIcon,
} as const;

export type HeroIconName = keyof typeof heroIconRegistry;
export type UtilIconName = keyof typeof utilIconRegistry;
export type IconName = HeroIconName | UtilIconName;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  weight?: IconWeight;
}

type PhosphorIcon = React.ComponentType<IconProps>;

export function Icon({ name, size = 24, color = colors.textPrimary, weight }: Props) {
  const hero = (heroIconRegistry as Record<string, PhosphorIcon>)[name];
  const util = (utilIconRegistry as Record<string, PhosphorIcon>)[name];
  const Component = hero ?? util;

  // Hero icons render as duotone by default for a warmer feel; utility
  // icons render as regular strokes to stay quiet.
  const resolvedWeight: IconWeight = weight ?? (hero ? 'duotone' : 'regular');

  if (!Component) {
    return null;
  }

  return <Component size={size} color={color} weight={resolvedWeight} />;
}
