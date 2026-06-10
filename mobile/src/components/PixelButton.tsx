// PixelButton — on press it "drops" into its shadow (translate by the offset).
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
  style,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const dx = pressed ? offset : 0;
  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { left: offset, top: offset, backgroundColor: disabled ? colors.textFaint : shadowColor }]} />
      <Pressable
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={[
          styles.btn,
          { backgroundColor: disabled ? colors.cream : bg, borderColor: colors.ink, transform: [{ translateX: dx }, { translateY: dx }] },
          style,
        ]}
      >
        <Text style={[styles.label, { color: disabled ? colors.textFaint : textColor }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  shadow: { position: 'absolute', right: 0, bottom: 0 },
  btn: {
    borderWidth: border.card,
    borderRadius: radius,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fonts.heading, fontSize: typeScale.section, letterSpacing: 0.4 },
});
