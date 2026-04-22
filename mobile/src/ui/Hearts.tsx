import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { color } from '../theme';

// A row of hearts (filled = alive, hollow = lost). Cheap, stateless.
// Use wherever a life-count matters: top of exercise screen, game-over
// modal, profile summary.

interface HeartsProps {
  total?: number;
  filled?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Hearts({ total = 5, filled = 3, size = 20, style }: HeartsProps) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: total }).map((_, i) => (
        <Icon
          key={i}
          name="heart"
          size={size}
          color={i < filled ? color.danger : color.hairDark}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, alignItems: 'center' },
});
