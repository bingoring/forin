import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, sp } from '../theme';

// SectionHeader — eyebrow + title with an optional right-aligned action
// slot (typically a small ghost Button or a tappable "See all" link).

export interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ eyebrow, title, action, style }: SectionHeaderProps) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.titleCol}>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: sp.s3,
  },
  titleCol: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.micro,
    color: color.inkSoft,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.h2,
    color: color.ink,
  },
});
