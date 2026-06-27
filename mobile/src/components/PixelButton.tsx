// PixelButton — forin's chunky pixel button. A 3px-outlined cap with a bright
// top-edge highlight (light hitting the cap) sitting on a HARD offset shadow
// (forin's no-blur signature). Pressing drops the cap into its shadow (translate
// by the offset → the shadow is covered), which IS the press action. No inner
// bottom shading: the back shadow already conveys depth, so it'd be redundant.
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
  style?: ViewStyle;
};

// lerp two #rrggbb colors (DS mixHex) for the bevel highlight/shade strips
function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return '#' + [c(ar, br), c(ag, bg), c(ab, bb)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function PixelButton({
  label,
  onPress,
  bg = colors.yellow,
  shadowColor = colors.yellowShadow,
  textColor = colors.ink,
  disabled = false,
  offset = 4,
  full = false,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const dx = pressed && !disabled ? offset : 0; // drop into the shadow on press
  const lite = mix(bg, '#FFFFFF', 0.45); // lit top edge
  return (
    <View style={[styles.wrap, full && styles.full, disabled && { opacity: 0.55 }]}>
      {/* hard offset shadow (solid, never blurred) — the cap drops into this */}
      <View style={{ position: 'absolute', left: offset, top: offset, width: '100%', height: '100%', backgroundColor: disabled ? colors.textFaint : shadowColor }} />
      <Pressable
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={[styles.btn, full && styles.full, { backgroundColor: disabled ? colors.cream : bg, transform: [{ translateX: dx }, { translateY: dx }] }, style]}
      >
        {/* top-edge highlight (light on the cap) — no bottom shade (the offset
            shadow already conveys depth) */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 4, right: 4, top: 3, height: 3, backgroundColor: lite }} />
        <Text style={[styles.label, { color: disabled ? colors.textFaint : textColor }]}>{label}</Text>
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
