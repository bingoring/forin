import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { color, fontFamily, fontSize, radius, sp } from '../theme';

// CoinChip — a currency/count pill that matches the map/shop style.
// Tones map to the semantic palette. If you need a one-off colour,
// reach for `Badge` instead; chips are for in-game currencies.

export type CoinChipTone = 'gold' | 'gem' | 'heart';

const TONES: Record<CoinChipTone, { bg: string; border: string; fg: string; icon: IconName }> = {
  gold:  { bg: color.xpLight,      border: '#F0D98A',     fg: '#9A7B1A',    icon: 'coin' },
  gem:   { bg: color.primaryLight, border: color.primary, fg: color.primaryDeep, icon: 'gem' },
  heart: { bg: color.dangerLight,  border: color.danger,  fg: color.dangerDeep,  icon: 'heart' },
};

interface CoinChipProps {
  amount: number | string;
  tone?: CoinChipTone;
  style?: StyleProp<ViewStyle>;
}

export function CoinChip({ amount, tone = 'gold', style }: CoinChipProps) {
  const t = TONES[tone];
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: t.bg, borderColor: t.border },
        style,
      ]}
    >
      <Icon name={t.icon} size={14} color={t.fg} />
      <Text style={[styles.amount, { color: t.fg }] as TextStyle[]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: sp.s1 + 2,
    paddingHorizontal: sp.s3 - 2,
    borderWidth: 1.5,
    borderRadius: radius.pill,
  },
  amount: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.body,
  },
});
