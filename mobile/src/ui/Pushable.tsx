import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { duration, pushable as pushableSizes, type PushableSize } from '../theme';

// The "pushable" primitive is forin's signature interaction: a button
// that sits on a coloured drop-shadow and visibly collapses into it when
// pressed. It's the base for Button, IconButton, StageNode and anything
// else that needs to feel tappable in a Duolingo way.
//
// Why we rebuild it: RN doesn't give us CSS pseudo-classes, so we drive
// the press state with `Pressable` + a single `Animated.Value` that
// translates the face by (depth − 1) px. A 1-pixel residual keeps it
// from feeling dead on release.

export interface PushableProps {
  /** Size controls depth + default radius. */
  size?: PushableSize;
  /** Color the face rests on — visible along the bottom edge. */
  shadowColor: string;
  /** Tapping handler. Undefined = disabled visual. */
  onPress?: () => void;
  disabled?: boolean;
  /** Stretch to the parent's width. */
  full?: boolean;
  /** Optional override — lets callers build circular/odd-shaped pushables. */
  radius?: number;
  /** Wrapper style. `face` receives the same inner layout the caller passes. */
  style?: StyleProp<ViewStyle>;
  /** Face style — typically padding + background color + alignment. */
  faceStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
}

export function Pushable({
  size = 'md',
  shadowColor,
  onPress,
  disabled = false,
  full = false,
  radius,
  style,
  faceStyle,
  children,
  accessibilityLabel,
}: PushableProps) {
  const s = pushableSizes[size];
  const drop = Math.max(s.depth - 1, 1);
  const translate = useRef(new Animated.Value(0)).current;
  const effectiveRadius = radius ?? s.radius;

  const animateTo = useCallback(
    (value: number, ms: number) => {
      Animated.timing(translate, {
        toValue: value,
        duration: ms,
        useNativeDriver: true,
      }).start();
    },
    [translate],
  );

  const onPressIn = useCallback(() => {
    if (disabled) return;
    animateTo(drop, 40);
  }, [animateTo, drop, disabled]);

  const onPressOut = useCallback(() => {
    if (disabled) return;
    animateTo(0, duration.fast);
  }, [animateTo, disabled]);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={[
        styles.wrap,
        full ? styles.full : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {/* The coloured "shadow" strip — visible along the bottom edge. */}
      <View
        pointerEvents="none"
        style={[
          styles.shadow,
          {
            top: s.depth,
            backgroundColor: shadowColor,
            borderRadius: effectiveRadius,
          },
        ]}
      />
      {/* The face — transforms on press. */}
      <Animated.View
        style={[
          { borderRadius: effectiveRadius, transform: [{ translateY: translate }] },
          faceStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start', position: 'relative' },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.55 },
  shadow: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
