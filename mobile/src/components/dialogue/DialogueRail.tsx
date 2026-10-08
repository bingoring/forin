// The dialogue's bottom rail — handoff v46 dialogue.jsx: D `▷ 보내기 · 듣기 · 노트`
// (L178–182), E `▷ 보내기 · 힌트 · 노트 3` (L99–103). Every button is a sheet of paper
// (`paper(rot)`: paper, 1px #E0D6C0, the soft lift) in Gaegu 15 — not the printed ink
// button the pixel-era rail used. Pressing is the kit's `.nb-press` (NbPressable).
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbPressable, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';

/** One paper button on the rail. */
export function RailButton({ testID, rot, padH, flex, icon, label, color = nb.ink, bg, dim, disabled, onPress, accessibilityLabel }: {
  testID?: string;
  rot: number;
  /** Horizontal padding; the vertical is always 9 (L100–102, L179–181). */
  padH: number;
  flex?: boolean;
  icon?: NbIconName;
  label?: ReactNode;
  color?: string;
  bg?: string;
  /** The handoff's inactive 보내기: `opacity .6`. */
  dim?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <NbPressable
      testID={testID}
      rot={rot}
      shadow="paper"
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={flex ? { flex: 1 } : undefined}
      faceStyle={{
        backgroundColor: bg ?? nb.paper, borderWidth: 1, borderColor: nb.paperEdge,
        paddingVertical: 9, paddingHorizontal: padH, opacity: dim ? 0.6 : 1,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}
    >
      {!!icon && <NbIcon name={icon} size={15} color={icon === 'play' ? color : undefined} />}
      {label != null && <Text numberOfLines={1} style={nbText.hand(15, color)}>{label}</Text>}
    </NbPressable>
  );
}

export function Rail({ children }: { children: ReactNode }) {
  // L99 / L178: gap 9.
  return <View style={{ flexDirection: 'row', gap: 9 }}>{children}</View>;
}
