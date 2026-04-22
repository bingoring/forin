import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// Hatto — the forin mascot (tuxedo cat, PNG-based).
//
// Two variants:
//   - `face` for chat / speech-bubble situations (small, reads at 48px+)
//   - `full` for celebrations / empty states (landscape composition)
//
// The PNGs ship native resolution; `size` scales uniformly. `face` keeps
// its square aspect ratio; `full` keeps the artwork's 2238×1888 ratio
// (≈ 1.185) so the scene doesn't stretch on narrow devices.

const FACE = require('../../assets/mascot/hatto-face.png');
const FULL = require('../../assets/mascot/hatto-full.png');

export type HattoVariant = 'face' | 'full';

export interface HattoProps {
  variant?: HattoVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const FULL_RATIO = 2238 / 1888;

export function Hatto({ variant = 'face', size = 96, style }: HattoProps) {
  if (variant === 'full') {
    const width = size;
    const height = Math.round(size / FULL_RATIO);
    return (
      <View style={[styles.wrap, { width, height }, style]}>
        <Image source={FULL} style={{ width, height }} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Image
        source={FACE}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
