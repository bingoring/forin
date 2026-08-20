// Screen transitions, in one place.
//
// These used to be written inline on every screen, and drifted exactly the way that
// invites: eight screens on 'fade', two on 'slide_from_right', and no statement anywhere
// of which was the rule. Naming the vocabulary is what keeps the next screen from picking
// a third answer.
import type { ComponentProps } from 'react';
import type { Stack } from 'expo-router';

// Taken from the component that consumes them rather than from
// @react-navigation/native-stack, which is a transitive dependency here and not ours to
// import: the day expo-router changes what it wraps, this follows.
type ScreenOptions = Extract<NonNullable<ComponentProps<typeof Stack.Screen>['options']>, object>;

/**
 * Screens you enter to DO something and then put away — briefing, role-play, quiz,
 * result, review, pronunciation.
 *
 * A fade, quicker than the platform's.
 *
 * The one thing that was definitely wrong here is gone: these screens are launched FROM
 * the bottom sheet, which is travelling DOWN as they arrive, so a slide up from the
 * bottom put two motions on the same axis pulling opposite ways and the screen appeared
 * to fight the thing that opened it. A fade shares no axis with that, so it does not
 * collide — what it needed was to stop lingering.
 *
 * animationDuration is milliseconds and iOS-only. The platform default is 500ms, of
 * which a fade uses roughly 0.57 (RNSFadeOpenTransitionDurationProportion), so ~285ms of
 * visible dissolve; 250 brings that to ~145ms. Android has no equivalent knob and keeps
 * its own fade timing.
 */
export const TASK_SCREEN: ScreenOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 250,
};

/**
 * Screens you navigate INTO as a place — the growth report, the route map.
 *
 * These push sideways, the standard "went somewhere" motion, because that is what they
 * are: another page of the same book rather than a card pulled out of it.
 */
export const PLACE_SCREEN: ScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};
