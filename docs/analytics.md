# forin analytics

Mobile-side product analytics. Vendor-neutral by design — adding or
replacing a provider means writing a new adapter under
`mobile/src/analytics/` and nothing else.

## Architecture

```
┌──────────────┐
│  Screens /   │   call analytics.track({ name, properties })
│  stores      │          │
└──────────────┘          ▼
                 ┌──────────────────┐
                 │  Analytics proxy │   mobile/src/analytics/index.ts
                 │  (singleton)     │
                 └──────────────────┘
                          │
                          ▼
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
   ┌────────────────┐         ┌────────────────┐
   │ Noop (default) │         │ PostHog adapter│
   │                │         │                │
   └────────────────┘         └────────────────┘
                              swap via setAnalytics()
```

- `mobile/src/analytics/types.ts` — `AnalyticsEvent` discriminated union
  (the event registry) + `Analytics` interface + `UserTraits`.
- `mobile/src/analytics/index.ts` — re-exports the `analytics` singleton
  proxy and `setAnalytics(impl)`.
- `mobile/src/analytics/noop.ts` — default impl, silently drops events.
- `mobile/src/analytics/posthog.ts` — wraps `posthog-react-native`.
- `App.tsx` — calls `setAnalytics(createPostHogAnalytics(...))` when
  `EXPO_PUBLIC_POSTHOG_KEY` is present; otherwise the Noop impl stays.

## Configuration

Set these before building the mobile bundle (or in `.env` during dev):

```
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   # optional; defaults to US
```

Without `EXPO_PUBLIC_POSTHOG_KEY`, every `analytics.track()` is a no-op.
This is intentional for local dev so nothing hits PostHog until credentials
are set.

## Event registry

| Name | Fired from | Properties | Purpose |
|---|---|---|---|
| `session_start` | `App.tsx` on mount | — | Session-level retention denominator |
| `onboarding_complete` | (not yet wired) | `profession_slug`, `target_country` | Funnel tail for signup conversion |
| `stage_start` | (not yet wired) | `stage_id` | Entry to a learning session |
| `stage_complete` | `StageCompleteScreen` | `stage_id`, `stars`, `xp_earned`, `mistakes`, `duration_seconds` | Core engagement metric |
| `level_up` | `StageCompleteScreen` (when `result.level_up`) | `new_level`, `new_title` | Progression milestone |
| `gift_box_open` | `GiftBoxScreen` after successful open | `box_type`, `item_rarity`, `was_duplicate` | Reward funnel |
| `streak_milestone` | `StageCompleteScreen` | `milestone` (7/30/100) | Retention milestone |
| `shield_used` | `StageCompleteScreen` | `current_streak` | Shield feature usage |
| `shield_earned` | `StageCompleteScreen` | `current_streak`, `total_shields` | Shield economy |

## Identify / reset

- `authStore.login` and `authStore.register` call
  `analytics.identify(user.id, { native_language, current_level })`.
- `authStore.logout` calls `analytics.reset()`.

Identity traits are PII-free — we attach enum-ish traits (locale, level,
profession slug, target country, daily goal) and **never** the email
address or display name.

## Adding a new event

1. Extend the `AnalyticsEvent` union in `mobile/src/analytics/types.ts`
   with a new variant including its typed `properties` shape.
2. Call `analytics.track({ name: 'your_event', properties: { ... } })`
   from the site where the event fires. TypeScript will fail the build
   if the `properties` shape drifts.
3. Add a row to the table above.

## Swapping vendors

Replace PostHog with, say, Mixpanel:

1. Add `mobile/src/analytics/mixpanel.ts` that exports
   `createMixpanelAnalytics(opts): Analytics`.
2. In `App.tsx`, change the `setAnalytics(...)` call to use the new
   factory. Keep the `EXPO_PUBLIC_*` env contract stable or rename as
   appropriate.
3. Delete `posthog.ts` and the `posthog-react-native` dependency.

No screen code needs to change — the `analytics` proxy, event registry,
and identify/reset contract stay identical across vendors.
