import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { color, radius } from '../theme';

// Base container — the Duolingo-style "card with a coloured bottom
// border" sits behind almost every grouped set of content in the app.
// The `bottom` border is 2px thicker than the rest to mimic the
// pushable shadow. Don't replace with a plain `<View>` — you lose the
// brand silhouette.

export type CardVariant =
  | 'paper'    // white, hair border — default surface
  | 'cream'    // cozy surface — profile/shop/room
  | 'sky'      // sky tint — active/learning highlight
  | 'coral'    // accent tint
  | 'mint'     // success tint
  | 'sun'      // XP tint
  | 'premium'  // lavender tint
  | 'ink';     // dark — heavy emphasis

const VARIANTS: Record<CardVariant, { bg: string; border: string; isDark: boolean }> = {
  paper:   { bg: color.paper,        border: color.hair,        isDark: false },
  cream:   { bg: color.cream,        border: color.hair,        isDark: false },
  sky:     { bg: color.primaryLight, border: color.primary,     isDark: false },
  coral:   { bg: color.accentLight,  border: color.accent,      isDark: false },
  mint:    { bg: color.successLight, border: color.success,     isDark: false },
  sun:     { bg: color.xpLight,      border: color.xp,          isDark: false },
  premium: { bg: color.premiumLight, border: color.premium,     isDark: false },
  ink:     { bg: color.ink,          border: color.ink,         isDark: true  },
};

export interface CardProps {
  variant?: CardVariant;
  padding?: number;
  /** Tap handler — turns the card into a Pressable with a11y button role. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export function Card({
  variant = 'paper',
  padding = 16,
  onPress,
  style,
  children,
  accessibilityLabel,
}: CardProps) {
  const v = VARIANTS[variant];
  const boxStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.border,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderRadius: radius.r2,
    padding,
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [boxStyle, pressed ? styles.pressed : null, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[boxStyle, style]}>{children}</View>;
}

/**
 * Dark variant keeps children legible. Use this helper when a child
 * needs to detect the surface it's rendering on.
 */
export function isDarkCardVariant(v: CardVariant | undefined): boolean {
  return v === 'ink';
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
});
