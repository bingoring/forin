// A card that sinks when it is the chosen one.
//
// Two onboarding screens had grown opposite answers to the same question. The country
// cards raised their shadow from 3 to 4 on selection: the face stayed put while the plate
// behind it widened, which reads as the box having SHRUNK inside its frame — nothing had
// shrunk, the frame had grown. The level cards went the other way and created a shadow
// from nothing on selection, so the chosen card popped OUT.
//
// Both are the same control and should say the same thing. Choosing presses a card in:
// the face slides onto its shadow plate and covers it, which is what a pressed pixel
// button looks like everywhere else in this app. The plate never moves or resizes, so the
// footprint is identical in every state and neighbours never shift.
import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

/** How far the face sits above the plate — and how far it travels when pressed. */
const DEPTH = 3;

export function PressCard({
  selected,
  disabled,
  onPress,
  shadowColor,
  style,
  contentStyle,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  shadowColor: string;
  /** The footprint: width, flex, margins. */
  style?: ViewStyle;
  /** The face: background, border, padding, layout of the contents. */
  contentStyle: ViewStyle;
  children: ReactNode;
}) {
  const sunk = (selected || false) && !disabled;
  return (
    <View style={style}>
      {!disabled && (
        <View
          style={{
            position: 'absolute',
            left: DEPTH,
            top: DEPTH,
            right: -DEPTH,
            bottom: -DEPTH,
            backgroundColor: shadowColor,
          }}
        />
      )}
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{ selected, disabled: !!disabled }}
        style={({ pressed }) => ({
          ...contentStyle,
          // The same movement for "chosen" and "finger down", because they are the same
          // statement about this card. Translating rather than changing the plate keeps
          // every state the same size.
          transform:
            sunk || (pressed && !disabled)
              ? [{ translateX: DEPTH }, { translateY: DEPTH }]
              : [{ translateX: 0 }, { translateY: 0 }],
        })}
      >
        {children}
      </Pressable>
    </View>
  );
}
