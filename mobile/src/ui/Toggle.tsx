import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { color, duration, easing } from '../theme';

// Toggle — iOS-style pill switch.
//
// The knob animates horizontally via Animated.Value; the track swaps
// background via native driver opacity on an overlay (can't animate
// backgroundColor natively without useNativeDriver: false).

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const KNOB = 24;
const INSET = 2;
const KNOB_END = TRACK_WIDTH - KNOB - INSET;

export interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Toggle({
  value,
  onChange,
  disabled,
  color: activeColor = color.primary,
  style,
}: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: duration.medium,
      easing: Easing.bezier(...easing.out),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [INSET, KNOB_END],
  });
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [color.hairDark, activeColor],
  });

  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      hitSlop={8}
    >
      <Animated.View style={[styles.track, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.knob, { left: knobLeft }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 999,
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    top: INSET,
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
});
