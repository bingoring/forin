import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import type { NPCCategory } from '../../data/npcs';

interface Props {
  category: NPCCategory;
  displayName: string;
  size?: number;
}

/**
 * Placeholder NPC avatar: a category-tinted circular silhouette with the
 * name underneath. Swap internals to <SvgXml /> when real art arrives;
 * the `category` + `displayName` props stay.
 */
export function NPCAvatar({ category, displayName, size = 72 }: Props) {
  const ringColor =
    category === 'patient' ? colors.heart
    : category === 'peer' ? colors.accent
    : colors.gem;

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={46} fill={colors.surface} stroke={ringColor} strokeWidth={4} />
        <G>
          {/* Simple silhouette — head + shoulders */}
          <Circle cx={50} cy={40} r={14} fill={ringColor} opacity={0.85} />
          <Path d="M20 82 Q50 58 80 82 Z" fill={ringColor} opacity={0.75} />
        </G>
        {/* Category chip dot */}
        <Circle cx={78} cy={22} r={9} fill={ringColor} />
      </Svg>
      <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  name: { ...typography.caption, color: colors.textPrimary, marginTop: 4 },
});
