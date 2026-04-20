import type { Analytics, AnalyticsEvent, UserTraits } from './types';
import { createNoopAnalytics } from './noop';

// Module-level singleton — every import shares the same proxy. The
// proxy forwards to whichever impl is currently installed via
// `setAnalytics()`. Call sites never touch a vendor SDK directly.
let current: Analytics = createNoopAnalytics();

export function setAnalytics(impl: Analytics) {
  current = impl;
}

export const analytics: Analytics = {
  identify(userId: string, traits?: UserTraits) {
    current.identify(userId, traits);
  },
  reset() {
    current.reset();
  },
  track(event: AnalyticsEvent) {
    current.track(event);
  },
};

export type { Analytics, AnalyticsEvent, UserTraits } from './types';
