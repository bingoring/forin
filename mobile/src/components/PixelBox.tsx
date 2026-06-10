// PixelBox — the signature surface: chunky ink border + HARD offset shadow
// (a solid ink layer behind the content, no blur). See handoff "Pixel shadow in RN".
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { border, colors, radius } from '@/theme/tokens';

type Props = {
  children?: ReactNode;
  offset?: number; // shadow offset px
  shadowColor?: string;
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
};

export function PixelBox({
  children,
  offset = 4,
  shadowColor = colors.ink,
  bg = colors.cream,
  borderColor = colors.ink,
  borderWidth = border.card,
  style,
}: Props) {
  return (
    <View style={styles.wrap}>
      {/* solid offset shadow layer behind the content */}
      <View style={[styles.shadow, { left: offset, top: offset, backgroundColor: shadowColor }]} />
      <View style={[styles.content, { backgroundColor: bg, borderColor, borderWidth }, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  shadow: { position: 'absolute', right: 0, bottom: 0, borderRadius: radius },
  content: { borderRadius: radius },
});
