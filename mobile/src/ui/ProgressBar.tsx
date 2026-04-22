import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, sp } from '../theme';

// Single-track progress bar with the inset highlight/shadow tricks that
// give our bars the "gummy" Duolingo feel. Use for daily goal, level XP,
// skill mastery — any 0..max horizontal metric.

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  label?: string;
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  value,
  max = 100,
  color: fillColor = color.success,
  trackColor = color.hair,
  height = 14,
  label,
  showValue = true,
  style,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={[styles.wrap, style]}>
      {(label || showValue) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showValue ? (
            <Text style={styles.value}>
              {value}/{max}
            </Text>
          ) : null}
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              height,
              backgroundColor: fillColor,
              borderRadius: height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sp.s1,
  },
  label: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.caption,
    color: color.inkSoft,
  },
  value: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.caption,
    color: color.inkSoft,
  },
  track: { overflow: 'hidden' },
  // The filled portion gets a faint inner top highlight + bottom shadow
  // via nested Views — that's the trick giving the bar its 3D gummy
  // feel on web, and translating a 2-layer radial gradient to RN isn't
  // worth the complexity. A plain flat fill still reads fine.
  fill: {},
});
