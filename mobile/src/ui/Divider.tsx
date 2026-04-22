import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, sp } from '../theme';

// Divider — hair-line rule, optionally with an uppercase label in the
// middle ("— OR —" style). Matches the DesignDemo reference.

export interface DividerProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ label, style }: DividerProps) {
  if (!label) {
    return <View style={[styles.line, style]} />;
  }
  return (
    <View style={[styles.row, style]}>
      <View style={styles.fill} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fill} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: color.hair,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s3,
  },
  fill: {
    flex: 1,
    height: 1.5,
    backgroundColor: color.hair,
  },
  label: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.micro,
    color: color.inkFaint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
