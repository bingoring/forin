import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Pushable } from './Pushable';
import { color, pushable, text as textStyles } from '../theme';
import type { PushableSize } from '../theme';

// The brand button. Nine variants cover every CTA forin needs — any
// screen that reaches for "just a <Pressable>" is wrong. If a new
// variant is required, add it here rather than open-coding it.

export type ButtonVariant =
  | 'primary'    // sky — default positive CTA
  | 'coral'      // coral — accent CTA
  | 'success'    // mint — confirm / check
  | 'danger'     // rose — destructive
  | 'premium'    // lavender — premium / special
  | 'secondary'  // white card w/ ink text
  | 'ghost'      // no background, no shadow — tertiary action
  | 'dark';      // ink background — heavy emphasis

type VariantPalette = {
  bg: string;
  shadow: string;
  text: string;
  border?: string;
};

const VARIANTS: Record<ButtonVariant, VariantPalette> = {
  primary:   { bg: color.primary,    shadow: color.primaryDeep, text: color.paper },
  coral:     { bg: color.accent,     shadow: color.accentDeep,  text: color.paper },
  success:   { bg: color.success,    shadow: color.successDeep, text: color.paper },
  danger:    { bg: color.danger,     shadow: color.dangerDeep,  text: color.paper },
  premium:   { bg: color.premium,    shadow: color.premiumDeep, text: color.paper },
  secondary: { bg: color.paper,      shadow: color.hair,        text: color.primary, border: color.hair },
  ghost:     { bg: 'transparent',    shadow: 'transparent',     text: color.inkSoft },
  dark:      { bg: color.ink,        shadow: '#1D1710',         text: color.paper },
};

// Size → padding + font size, reusing the pushable depth table.
const SIZES: Record<PushableSize, { padV: number; padH: number; fontSize: number; gap: number }> = {
  sm: { padV: 8,  padH: 14, fontSize: 13, gap: 6 },
  md: { padV: 14, padH: 22, fontSize: 15, gap: 8 },
  lg: { padV: 16, padH: 28, fontSize: 17, gap: 10 },
  xl: { padV: 20, padH: 32, fontSize: 19, gap: 12 },
};

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: PushableSize;
  /** Icons stay flush with the label, respecting the size's gap. */
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  full = false,
  loading = false,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const depth = pushable[size].depth;
  const isGhost = variant === 'ghost';
  const busy = loading;
  const finallyDisabled = disabled || busy;

  const face = (
    <View
      style={[
        {
          paddingVertical: s.padV,
          paddingHorizontal: s.padH,
          backgroundColor: v.bg,
          borderRadius: pushable[size].radius,
          gap: s.gap,
          borderWidth: v.border ? 2 : 0,
          borderColor: v.border,
        },
        styles.face,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <>
          {iconLeft ? <View style={styles.iconWrap}>{iconLeft}</View> : null}
          <Text
            style={[
              textStyles.button,
              { color: v.text, fontSize: s.fontSize },
            ]}
          >
            {children}
          </Text>
          {iconRight ? <View style={styles.iconWrap}>{iconRight}</View> : null}
        </>
      )}
    </View>
  );

  // Ghost variant opts out of the pushable mechanic entirely — it's a
  // text-like action that should feel weightless.
  if (isGhost) {
    return (
      <View style={[full ? styles.full : null, finallyDisabled ? styles.disabled : null, style]}>
        <Pushable
          size={size}
          shadowColor="transparent"
          onPress={onPress}
          disabled={finallyDisabled}
          full={full}
          accessibilityLabel={accessibilityLabel}
        >
          {face}
        </Pushable>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, full ? styles.full : null, { paddingBottom: depth }]}>
      <Pushable
        size={size}
        shadowColor={v.shadow}
        onPress={onPress}
        disabled={finallyDisabled}
        full={full}
        style={style}
        accessibilityLabel={accessibilityLabel}
      >
        {face}
      </Pushable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.55 },
  face: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { flexDirection: 'row', alignItems: 'center' },
});
