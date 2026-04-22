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
import { color, fontFamily, fontSize, radius, sp } from '../theme';

// OptionCard — the big tappable selection card used in multiple-choice
// exercises. Four reviewable states:
//   - default   (white, hair border)
//   - selected  (tinted bg + tinted border + check mark on right)
//   - correct   (mint tint, lock border so it can't be toggled)
//   - wrong     (rose tint, same lock behaviour)
//
// Tone controls the "selected" highlight colour; the correct/wrong
// states ignore tone and always use mint/rose respectively.

export type OptionCardTone = 'sky' | 'coral' | 'mint' | 'sun' | 'lav';

export type OptionCardState = 'default' | 'selected' | 'correct' | 'wrong';

interface ToneStyle {
  bg: string;
  border: string;
  fg: string;
}

const TONES: Record<OptionCardTone, ToneStyle> = {
  sky:   { bg: color.primaryLight, border: color.primary,  fg: color.primaryDeep },
  coral: { bg: color.accentLight,  border: color.accent,   fg: color.accentDeep },
  mint:  { bg: color.successLight, border: color.success,  fg: color.successDeep },
  sun:   { bg: color.xpLight,      border: color.xp,       fg: '#9A7B1A' },
  lav:   { bg: color.premiumLight, border: color.premium,  fg: color.premiumDeep },
};

export interface OptionCardProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  tone?: OptionCardTone;
  state?: OptionCardState;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OptionCard({
  icon,
  title,
  subtitle,
  tone = 'sky',
  state = 'default',
  onPress,
  style,
}: OptionCardProps) {
  const t = TONES[tone];
  const correct = state === 'correct';
  const wrong = state === 'wrong';
  const selected = state === 'selected';
  const locked = correct || wrong;

  const bg = correct
    ? TONES.mint.bg
    : wrong
    ? TONES.coral.bg
    : selected
    ? t.bg
    : color.paper;
  const border = correct
    ? TONES.mint.border
    : wrong
    ? color.danger
    : selected
    ? t.border
    : color.hair;
  const iconFg = correct
    ? TONES.mint.fg
    : wrong
    ? color.dangerDeep
    : selected
    ? t.fg
    : color.inkSoft;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress || locked}
      style={[
        styles.root,
        { backgroundColor: bg, borderColor: border, borderBottomColor: border },
        style,
      ]}
    >
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} size={26} color={iconFg} />
        </View>
      )}
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {(selected || correct) && (
        <View style={[styles.check, { backgroundColor: correct ? TONES.mint.border : t.border }]}>
          <Icon name="check" size={14} color={color.paper} />
        </View>
      )}
      {wrong && (
        <View style={[styles.check, { backgroundColor: color.danger }]}>
          <Icon name="x" size={14} color={color.paper} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s3,
    padding: sp.s3 + 2,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radius.r2,
  },
  icon: {
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.body,
    color: color.ink,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption - 1,
    color: color.inkSoft,
    marginTop: 2,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
