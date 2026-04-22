import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { color, fontFamily, fontSize, radius, sp } from '../theme';

// Toast — inline alert strip, *not* the animated snackbar.
//
// This component is a pure visual shell; sliding/timer logic lives in
// whatever container mounts it (we don't impose a presentation layer
// at the primitive level). Tone drives the icon, border, and colour.

export type ToastTone = 'success' | 'info' | 'warn' | 'error';

interface ToneSpec {
  bg: string;
  border: string;
  fg: string;
  icon: IconName;
}

const TONES: Record<ToastTone, ToneSpec> = {
  success: { bg: color.successLight, border: color.success,  fg: color.successDeep, icon: 'check' },
  info:    { bg: color.primaryLight, border: color.primary,  fg: color.primaryDeep, icon: 'chat' },
  warn:    { bg: color.xpLight,      border: color.xp,       fg: '#9A7B1A',         icon: 'flame' },
  error:   { bg: color.dangerLight,  border: color.danger,   fg: color.dangerDeep,  icon: 'x' },
};

export interface ToastProps {
  children: React.ReactNode;
  tone?: ToastTone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

export function Toast({ children, tone = 'success', icon, style }: ToastProps) {
  const t = TONES[tone];
  const iconName = icon ?? t.icon;
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: t.bg,
          borderColor: t.border,
          borderLeftColor: t.border,
        },
        style,
      ]}
    >
      <View style={[styles.iconBubble, { backgroundColor: t.border }]}>
        <Icon name={iconName} size={14} color={color.paper} />
      </View>
      <Text style={[styles.text, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s2 + 2,
    paddingHorizontal: sp.s3 + 2,
    paddingVertical: sp.s3,
    borderWidth: 2,
    borderLeftWidth: 6,
    borderRadius: radius.r1,
  },
  iconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body - 1,
  },
});
