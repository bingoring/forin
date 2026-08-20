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
 * They rise from the bottom and drop back down, which is the same motion as the sheets:
 * a card is brought out, used, and set down. They used to cross-fade, which reads as a
 * dissolve — and nothing else in this app dissolves. The design has 4px borders, flat
 * fills and pixel type; a soft opacity ramp is the one gesture that has no counterpart
 * anywhere in it.
 */
export const TASK_SCREEN: ScreenOptions = {
  headerShown: false,
  animation: 'slide_from_bottom',
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
