// PixelButton — forin's chunky pixel button. A flat 3px-outlined cap sitting on
// a HARD offset shadow (forin's no-blur signature). Pressing drops the cap into
// its shadow (translate by the offset → the shadow is covered), which IS the
// press action. Flat fill, no inner bevel — matches the PixelBox/Chip aesthetic
// and lets the offset shadow do all the depth work.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { border, colors, fonts, radius, type as typeScale } from '@/theme/tokens';
import { playSfx } from '@/lib/sfx';

type Props = {
  label: string;
  /** Drawn before the label. Prefer this over putting a glyph in the label —
   *  the design system is line icons, and ▶/› in text sit on the font's own
   *  baseline and metrics rather than the icon grid. */
  icon?: IconName;
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
  /** Set false where the action plays its own, louder sound. */
  sfx?: boolean;
  style?: ViewStyle;
};

export function PixelButton({
  label,
  icon,
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
  sfx = true,
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const dx = pressed && !disabled ? offset : 0; // drop into the shadow on press
  return (
    <View style={[styles.wrap, full && styles.full, disabled && { opacity: 0.55 }]}>
      {/* hard offset shadow (solid, never blurred) — the cap drops into this.
          Sized via insets (not width/height:100%) so a percentage doesn't resolve
          against a stretched flex ancestor and smear past the button. */}
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: disabled ? colors.textFaint : shadowColor }} />
      <Pressable
        disabled={disabled}
        // The blip fires on press-IN, with the cap dropping into its shadow — the
        // sound and the movement are the same event, so a late sound would read
        // as lag. Callers can opt out (sfx={false}) where a button already has a
        // louder sound of its own, e.g. the result screen's reward.
        onPressIn={() => { setPressed(true); if (sfx) playSfx('tap'); }}
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
        <View style={styles.row}>
          {icon && (
            <PixelIcon
              name={icon}
              color={disabled ? colors.textFaint : textColor}
              size={(fontSize ?? typeScale.section) + 3}
              sw={1.9}
            />
          )}
          <Text numberOfLines={1} style={[styles.label, { color: disabled ? colors.textFaint : textColor }, fontSize != null && { fontSize }]}>{label}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
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
