import type { Analytics } from './types';

/**
 * Noop analytics is the default impl when no vendor is configured. It
 * silently drops calls so dev builds without a PostHog key don't spam
 * the console. Keep this as the baseline implementation; every real
 * vendor adapter is swapped in via setAnalytics().
 */
export function createNoopAnalytics(): Analytics {
  return {
    identify() {},
    reset() {},
    track() {},
  };
}
