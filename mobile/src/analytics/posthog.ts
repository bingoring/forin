import PostHog from 'posthog-react-native';
import type { Analytics, AnalyticsEvent, UserTraits } from './types';

interface PostHogOptions {
  apiKey: string;
  host?: string; // e.g. 'https://us.i.posthog.com' or EU host
}

/**
 * Creates a PostHog-backed Analytics implementation. The PostHog SDK is
 * the only spot in the codebase that knows the vendor name; the rest of
 * the app reads/writes through the `Analytics` interface.
 */
export function createPostHogAnalytics(opts: PostHogOptions): Analytics {
  const client = new PostHog(opts.apiKey, {
    host: opts.host ?? 'https://us.i.posthog.com',
    // Default autocapture is noisy and can blow through the free-tier
    // event budget fast. Track explicitly from the typed event registry.
    captureAppLifecycleEvents: false,
  });

  return {
    identify(userId: string, traits?: UserTraits) {
      // PostHog accepts a JSON-serialisable property map. Cast is safe
      // because UserTraits only contains primitive strings/numbers.
      client.identify(userId, (traits ?? {}) as Record<string, string | number>);
    },
    reset() {
      client.reset();
    },
    track(event: AnalyticsEvent) {
      // PostHog's capture signature is (event, properties). The event
      // taxonomy in types.ts already constrains property shapes, so the
      // cast here stays narrow.
      const props =
        (event as { properties?: Record<string, string | number | boolean> }).properties ?? {};
      client.capture(event.name, props);
    },
  };
}
