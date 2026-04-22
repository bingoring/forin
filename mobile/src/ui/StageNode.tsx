import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Pushable } from './Pushable';
import { Icon, type IconName } from './Icon';
import { color, fontFamily } from '../theme';

// StageNode — the circular map node on the learning path. Four states:
//   - locked    (dead, gray)
//   - active    (primary sky, glow ring)
//   - complete  (sun yellow, star/check)
//   - crown     (coral, end-of-chapter crown)
//
// Built on Pushable so the same press physics apply. The glow ring on
// `active` is a single outer View with a 6px translucent sky border —
// cheaper than a shadow spread and RN-consistent.

export type StageNodeState = 'locked' | 'active' | 'complete' | 'crown';

interface StateSpec {
  bg: string;
  shadow: string;
  fg: string;
  icon: IconName;
  glow?: boolean;
}

const STATES: Record<StageNodeState, StateSpec> = {
  locked:   { bg: color.hairDark,      shadow: '#8A7A5E',       fg: color.inkFaint, icon: 'lock' },
  active:   { bg: color.primary,       shadow: color.primaryDeep, fg: color.paper,  icon: 'play', glow: true },
  complete: { bg: color.xp,            shadow: color.xpDeep,    fg: color.paper,    icon: 'star' },
  crown:    { bg: color.accent,        shadow: color.accentDeep, fg: color.paper,   icon: 'trophy' },
};

export interface StageNodeProps {
  state?: StageNodeState;
  size?: number;
  icon?: IconName;
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StageNode({
  state = 'locked',
  size = 68,
  icon,
  label,
  onPress,
  style,
}: StageNodeProps) {
  const s = STATES[state];
  const disabled = state === 'locked';
  const iconName = icon ?? s.icon;
  const iconSize = Math.round(size * 0.42);

  return (
    <View style={[styles.wrap, style]}>
      {s.glow && (
        <View
          pointerEvents="none"
          style={[styles.glow, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]}
        />
      )}
      <Pushable
        shadowColor={s.shadow}
        onPress={onPress}
        disabled={disabled}
        radius={size / 2}
        faceStyle={[
          styles.face,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: s.bg },
        ]}
      >
        <Icon name={iconName} size={iconSize} color={s.fg} />
      </Pushable>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    top: -6,
    backgroundColor: 'rgba(79, 184, 255, 0.22)',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 6,
    fontFamily: fontFamily.heading,
    fontSize: 12,
    color: color.inkSoft,
  },
});
