// The three answers onboarding asks for — and the settings screen lets you change.
//
// Lifted out of the passport when the answers became editable (Build Spec learning-tracks
// P1). Two screens reading two lists is the drift this project keeps paying for: the
// second copy is the one nobody updates, and here it would offer a destination the
// curriculum does not have.
import type { NbIconName } from '@/components/nb/NbIcon';

/**
 * The four destinations, and what each one changes downstream.
 *
 * `code` is the profile's destination — the codes the rest of the app already uses, not
 * the prototype's usa/aus/can/gbr. Only some are open: `isDestinationReady` is fed by the
 * server, and a country with no authored curriculum behind it must not be selectable, or
 * onboarding ends by committing someone to a hospital that does not exist yet.
 */
export const DESTS = [
  { id: 'us', nameKey: 'onb.dest.us', stampCode: 'USA', apt: 'JFK', sub: 'NCLEX-RN · EN-US', flag: '🇺🇸', rot: -0.5 },
  { id: 'au', nameKey: 'onb.dest.au', stampCode: 'AUS', apt: 'SYD', sub: 'OBA · EN-AU', flag: '🇦🇺', rot: 0.5 },
  { id: 'ca', nameKey: 'onb.dest.ca', stampCode: 'CAN', apt: 'YVR', sub: 'NCLEX · EN-CA', flag: '🇨🇦', rot: -0.4 },
  { id: 'gb', nameKey: 'onb.dest.gb', stampCode: 'GBR', apt: 'LHR', sub: 'NMC · EN-GB', flag: '🇬🇧', rot: 0.4 },
] as const;

export const JOBS = [
  { code: 'nurse', icon: 'stetho' as NbIconName, nameKey: 'onb.job.nurse', subKey: 'onb.job.nurseSub', ready: true, rot: -0.4 },
  { code: 'hotel', icon: 'bell' as NbIconName, nameKey: 'onb.job.hotel', subKey: 'onb.job.hotelSub', ready: false, rot: 0.4 },
  { code: 'service', icon: 'coffee' as NbIconName, nameKey: 'onb.job.service', subKey: 'onb.job.serviceSub', ready: false, rot: -0.3 },
  { code: 'engineer', icon: 'gear' as NbIconName, nameKey: 'onb.job.engineer', subKey: 'onb.job.engineerSub', ready: false, rot: 0.3 },
] as const;

/**
 * The immigration officer's three answers, and the CEFR band each one means.
 *
 * The prototype labels them a/b/c; the profile stores a CEFR band, because that is what
 * the server interprets (domain/user/level.go: speech register, grading calibration,
 * scenario weighting). The mapping is the whole point of the question, so it lives here
 * as one table rather than being spread across a switch.
 *
 * A2/B1/B2 rather than A1..C1: someone who can say words is past A1, and someone
 * comfortable in daily conversation but lost in a hospital is B2 — C1 would calibrate the
 * examiner against a level the answer does not claim.
 */
export const LEVELS = [
  { id: 'a', cefr: 'A2', titleKey: 'onb.lvl.a', subKey: 'onb.lvl.aSub', rot: -0.3 },
  { id: 'b', cefr: 'B1', titleKey: 'onb.lvl.b', subKey: 'onb.lvl.bSub', rot: 0.3 },
  { id: 'c', cefr: 'B2', titleKey: 'onb.lvl.c', subKey: 'onb.lvl.cSub', rot: -0.3 },
] as const;

