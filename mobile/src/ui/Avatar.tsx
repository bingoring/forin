import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { color, fontFamily } from '../theme';

// Avatar — circle with either an image or initials. The optional
// yellow "sun" ring flags selection/active state. The optional badge
// (a tiny rose pill bottom-right) carries a count or a single glyph.
//
// Hatto (mascot) has its own component — this primitive is for
// patient/teammate/user chrome.

export interface AvatarProps {
  size?: number;
  source?: ImageSourcePropType;
  initials?: string;
  ring?: boolean;
  badge?: string | number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({
  size = 48,
  source,
  initials,
  ring,
  badge,
  style,
}: AvatarProps) {
  const ringWidth = ring ? 3 : 0;
  const inner = size - ringWidth * 2;

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor: color.xp,
          backgroundColor: color.cream,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            { fontSize: Math.round(size * 0.42) },
          ]}
        >
          {initials?.slice(0, 2).toUpperCase() ?? '??'}
        </Text>
      )}
      {badge !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fontFamily.display,
    color: color.woodDark,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 999,
    backgroundColor: color.danger,
    borderWidth: 2,
    borderColor: color.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamily.display,
    color: color.paper,
    fontSize: 10,
  },
});
