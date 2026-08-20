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
 * No transition at all, and that is the considered answer rather than an omission.
 *
 * These screens are launched FROM the bottom sheet, which closes itself on the way out.
 * A cross-fade was wrong because nothing else in this app dissolves — 4px borders, flat
 * fills, pixel type, and one soft opacity ramp with no counterpart anywhere. But sliding
 * up from the bottom was wrong for a more specific reason: the sheet is travelling DOWN
 * that same axis at that same moment, so the two motions collide and the screen appears
 * to fight the thing that opened it. Cutting also happens to be how the games this looks
 * like change screens.
 */
export const TASK_SCREEN: ScreenOptions = {
  headerShown: false,
  animation: 'none',
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
