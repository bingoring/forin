// Event taxonomy — the single source of truth for what can be tracked.
//
// Adding a new event:
//   1. Add a variant to `AnalyticsEvent` with its typed properties.
//   2. Call `analytics.track({ name: '...', properties: { ... } })` from
//      the firing site. TypeScript enforces the name + property shape.
//   3. Document it in docs/analytics.md.
//
// Changing vendors (PostHog → Mixpanel / Amplitude) only requires a new
// adapter under this folder; call sites stay unchanged.

export type AnalyticsEvent =
  | { name: 'session_start'; properties?: Record<string, never> }
  | { name: 'onboarding_complete'; properties: { profession_slug: string; target_country: string } }
  | { name: 'stage_start'; properties: { stage_id: string } }
  | {
      name: 'stage_complete';
      properties: {
        stage_id: string;
        stars: number;
        xp_earned: number;
        mistakes: number;
        duration_seconds: number;
      };
    }
  | { name: 'level_up'; properties: { new_level: number; new_title: string } }
  | { name: 'gift_box_open'; properties: { box_type: string; item_rarity: string; was_duplicate: boolean } }
  | { name: 'streak_milestone'; properties: { milestone: number } }
  | { name: 'shield_used'; properties: { current_streak: number } }
  | { name: 'shield_earned'; properties: { current_streak: number; total_shields: number } };

// User traits attached on identify. Keep PII-free — internal ids and
// enum-ish values only.
export interface UserTraits {
  profession_slug?: string;
  target_country?: string;
  native_language?: string;
  current_level?: number;
  daily_goal?: string;
}

export interface Analytics {
  identify(userId: string, traits?: UserTraits): void;
  reset(): void;
  track(event: AnalyticsEvent): void;
}
