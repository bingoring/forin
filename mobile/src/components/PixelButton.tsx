// PixelButton — forin's chunky pixel button. A flat 3px-outlined cap sitting on
// a HARD offset shadow (forin's no-blur signature). Pressing drops the cap into
// its shadow (translate by the offset → the shadow is covered), which IS the
// press action. Flat fill, no inner bevel — matches the PixelBox/Chip aesthetic
// and lets the offset shadow do all the depth work.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { border, colors, fonts, radius, type as typeScale } from '@/theme/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  bg?: string;
  shadowColor?: string;
  textColor?: string;
  disabled?: boolean;
  offset?: number;
  full?: boolean; // stretch to the parent width
  fontSize?: number; // override label size (handoff buttons vary 11/12/13)
  borderWidth?: number; // override border weight (some handoff buttons are 2px)
  paddingV?: number;
  paddingH?: number;
  style?: ViewStyle;
};

export function PixelButton({
  label,
  onPress,
  bg = colors.yellow,
  shadowColor = colors.yellowShadow,
  textColor = colors.ink,
  disabled = false,
  offset = 4,
  full = false,
  fontSize,
  borderWidth,
  paddingV,
  paddingH,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const dx = pressed && !disabled ? offset : 0; // drop into the shadow on press
  return (
    <View style={[styles.wrap, full && styles.full, disabled && { opacity: 0.55 }]}>
      {/* hard offset shadow (solid, never blurred) — the cap drops into this */}
      <View style={{ position: 'absolute', left: offset, top: offset, width: '100%', height: '100%', backgroundColor: disabled ? colors.textFaint : shadowColor }} />
      <Pressable
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={[
          styles.btn,
          full && styles.full,
          {
            backgroundColor: disabled ? colors.cream : bg,
            transform: [{ translateX: dx }, { translateY: dx }],
            ...(borderWidth != null && { borderWidth }),
            ...(paddingV != null && { paddingVertical: paddingV }),
            ...(paddingH != null && { paddingHorizontal: paddingH }),
          },
          style,
        ]}
      >
        <Text numberOfLines={1} style={[styles.label, { color: disabled ? colors.textFaint : textColor }, fontSize != null && { fontSize }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  full: { width: '100%', alignSelf: 'stretch' },
  btn: {
    borderWidth: border.card,
    borderColor: colors.ink,
    borderRadius: radius,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fonts.heading, fontSize: typeScale.section, letterSpacing: 0.4 },
});
