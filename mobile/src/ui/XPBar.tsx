import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { color } from '../theme';

// Segmented XP bar — each segment is a self-contained box so the user
// sees discrete gains rather than a sliding line. Used for per-session
// XP (stages within a unit, problems within a stage).

interface XPBarProps {
  segments?: number;
  filled?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function XPBar({
  segments = 5,
  filled = 0,
  color: fillColor = color.xp,
  trackColor = color.hair,
  style,
}: XPBarProps) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.seg,
            { backgroundColor: i < filled ? fillColor : trackColor },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  seg: {
    flex: 1,
    height: 8,
    borderRadius: 8,
  },
});
