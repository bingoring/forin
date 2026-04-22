import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, sp } from '../theme';

// SpeechBubble — Hatto's dialogue balloon. Two stacked triangles
// form the tail: an outer border triangle + a fill triangle inset by
// 2px, producing a clean bordered nub. Tail side defaults to left
// bottom; flip to 'right' for the mascot-on-right layouts.
//
// `tone='paper'` is the default (white on hair); `sky`/`coral` add
// semantic tint for "correct" / "wrong" beats in the learning loop.

export type SpeechBubbleTone = 'paper' | 'sky' | 'coral';

interface ToneStyle {
  bg: string;
  border: string;
}

const TONES: Record<SpeechBubbleTone, ToneStyle> = {
  paper: { bg: color.paper, border: color.hair },
  sky: { bg: color.primaryLight, border: color.primary },
  coral: { bg: color.accentLight, border: color.accent },
};

export interface SpeechBubbleProps {
  children: React.ReactNode;
  tailSide?: 'left' | 'right' | 'none';
  tone?: SpeechBubbleTone;
  style?: StyleProp<ViewStyle>;
}

export function SpeechBubble({
  children,
  tailSide = 'left',
  tone = 'paper',
  style,
}: SpeechBubbleProps) {
  const t = TONES[tone];

  const borderTriStyle: ViewStyle = {
    borderTopColor: t.border,
  };
  const fillTriStyle: ViewStyle = {
    borderTopColor: t.bg,
  };
  const sidePos: ViewStyle =
    tailSide === 'right' ? { right: 18 } : { left: 18 };
  const sidePosInner: ViewStyle =
    tailSide === 'right' ? { right: 20 } : { left: 20 };

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: t.bg,
          borderColor: t.border,
        },
        style,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
      {tailSide !== 'none' && (
        <>
          <View style={[styles.borderTri, borderTriStyle, sidePos]} />
          <View style={[styles.fillTri, fillTriStyle, sidePosInner]} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: 16,
    paddingHorizontal: sp.s4,
    paddingVertical: sp.s3,
  },
  text: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body - 1,
    color: color.ink,
    lineHeight: 20,
  },
  borderTri: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  fillTri: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
