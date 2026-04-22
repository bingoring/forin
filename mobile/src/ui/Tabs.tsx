import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { color, fontFamily, fontSize, sp } from '../theme';

// Tabs — segmented pill control. The active pill is a white chip
// floating on a hair-coloured track. The activeColor controls the
// active label tint only; the track itself is always hair.

export interface TabItem<V extends string = string> {
  value: V;
  label: string;
}

export interface TabsProps<V extends string = string> {
  items: ReadonlyArray<TabItem<V>>;
  value: V;
  onChange: (next: V) => void;
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tabs<V extends string = string>({
  items,
  value,
  onChange,
  activeColor = color.primary,
  style,
}: TabsProps<V>) {
  return (
    <View style={[styles.track, style]}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <Pressable
            key={it.value}
            onPress={() => onChange(it.value)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? activeColor : color.inkSoft },
              ]}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: color.hair,
    borderRadius: 999,
    padding: 4,
    gap: 2,
  },
  tab: {
    paddingHorizontal: sp.s4,
    paddingVertical: sp.s2,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: color.paper,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.caption,
  },
});
