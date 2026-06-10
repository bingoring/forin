// PixelChip — small labeled pill with a 2px ink border + small hard shadow.
import { StyleSheet, Text, View } from 'react-native';
import { border, colors, fonts, radius, type as typeScale } from '@/theme/tokens';

type Props = { label: string; bg?: string };

export function PixelChip({ label, bg = colors.blue }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { left: 2, top: 2, backgroundColor: colors.ink }]} />
      <View style={[styles.chip, { backgroundColor: bg }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  shadow: { position: 'absolute', right: 0, bottom: 0 },
  chip: {
    borderWidth: border.thin,
    borderColor: colors.ink,
    borderRadius: radius,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  label: { fontFamily: fonts.heading, fontSize: typeScale.label, color: colors.ink },
});
