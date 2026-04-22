import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Icon, type IconName } from './Icon';
import { color, fontFamily, fontSize, sp } from '../theme';

// Chip — small tappable tag, usually for filter pills.
//
// Selected → tinted background + tinted border; unselected → white with
// hair border. Tone picks the tint family. For a purely taxonomic tag
// (non-interactive), use `Badge` instead.

export type ChipTone = 'sky' | 'coral' | 'mint';

interface ToneStyle {
  bg: string;
  border: string;
  fg: string;
}

const TONES: Record<ChipTone, ToneStyle> = {
  sky: { bg: color.primaryLight, border: color.primary, fg: color.primaryDeep },
  coral: { bg: color.accentLight, border: color.accent, fg: color.accentDeep },
  mint: { bg: color.successLight, border: color.success, fg: color.successDeep },
};

export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  children,
  selected,
  onPress,
  icon,
  tone = 'sky',
  style,
}: ChipProps) {
  const t = TONES[tone];
  const bg = selected ? t.bg : color.paper;
  const bd = selected ? t.border : color.hair;
  const fg = selected ? t.fg : color.inkSoft;

  const content = (
    <View
      style={[
        styles.pill,
        { backgroundColor: bg, borderColor: bd },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={14} color={fg} />}
      <Text style={[styles.label, { color: fg }]}>{children}</Text>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: sp.s3 + 2,
    paddingVertical: sp.s2,
    borderWidth: 2,
    borderRadius: 999,
  },
  label: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.caption,
  },
});
