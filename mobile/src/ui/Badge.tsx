import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, radius, sp } from '../theme';

// Badge — tiny pill label. Use for taxonomy ("BETA", "NEW"), state
// ("LOCKED"), or counts. If the thing you're adding has a tap target,
// it's probably a Chip, not a Badge.

export type BadgeTone =
  | 'neutral'
  | 'sky'
  | 'coral'
  | 'mint'
  | 'sun'
  | 'rose'
  | 'lav'
  | 'ink';

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: color.hair,           fg: color.inkSoft },
  sky:     { bg: color.primaryLight,   fg: color.primaryDeep },
  coral:   { bg: color.accentLight,    fg: color.accentDeep },
  mint:    { bg: color.successLight,   fg: color.successDeep },
  sun:     { bg: color.xpLight,        fg: color.xpDeep },
  rose:    { bg: color.dangerLight,    fg: color.dangerDeep },
  lav:     { bg: color.premiumLight,   fg: color.premiumDeep },
  ink:     { bg: color.ink,            fg: color.paper },
};

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ children, tone = 'neutral', icon, style }: BadgeProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.text, { color: t.fg }] as TextStyle[]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: sp.s3,
    borderRadius: radius.pill,
  },
  icon: { marginRight: sp.s1 },
  text: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.micro,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
