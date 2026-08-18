// The pronunciation screens' surface: chunky ink border + HARD offset shadow
// (a solid ink layer behind the content, never a blur), stretching to the row.
//
// Why not PixelBox:
//   1. Its wrapper is `alignSelf: 'flex-start'`, which shrinks to content. Every
//      card in screen-pronunciation.jsx spans the row (margin 16 each side).
//   2. Its shadow layer is `{left: offset, top: offset, right: 0, bottom: 0}`,
//      which resolves to a rect INSET from the content on all sides — entirely
//      covered by the content painted over it. Offsetting outward (negative
//      right/bottom, as below) is what actually puts ink beside the card.
// PixelBox currently has ZERO call sites (only PixelButton's comment mentions
// it), so #2 is a latent bug in unused code rather than something visibly wrong
// in the app today — and fixing it there would have been risk-free. Left alone
// only to keep this task's diff to its own surface; recorded so the next person
// touching PixelBox knows.
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = {
  children?: ReactNode;
  /** Shadow offset in px — SoT uses 3 for most cards, 4 for emphasis. */
  offset?: number;
  shadowColor?: string;
  bg?: string;
  borderWidth?: number;
  style?: ViewStyle;
};

export function PronCard({
  children,
  offset = 3,
  shadowColor = colors.ink,
  bg = '#fff',
  borderWidth = 3,
  style,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.shadow,
          { left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor },
        ]}
      />
      <View style={[{ backgroundColor: bg, borderColor: colors.ink, borderWidth }, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  shadow: { position: 'absolute' },
});
