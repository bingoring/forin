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

// ListRow — the canonical row for settings lists, inventory items,
// achievement lists. Hair-line border on the bottom. Leading/trailing
// slots take any ReactNode (icon, avatar, badge, button, etc.) so the
// row never imposes decoration.

export interface ListRowProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
  last,
  style,
}: ListRowProps) {
  const content = (
    <View
      style={[
        styles.row,
        !last && styles.border,
        style,
      ]}
    >
      {leading && <View>{leading}</View>}
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
      {trailing && <View>{trailing}</View>}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} android_ripple={{ color: color.hair }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s3,
    paddingHorizontal: sp.s3 + 2,
    paddingVertical: sp.s3,
    backgroundColor: color.paper,
  },
  border: {
    borderBottomWidth: 1.5,
    borderBottomColor: color.hair,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.body - 1,
    color: color.ink,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.micro + 1,
    color: color.inkSoft,
    marginTop: 1,
  },
});
