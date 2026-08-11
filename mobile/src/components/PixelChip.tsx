// PixelChip — small labeled pill with a 2px ink border + small hard shadow.
import { StyleSheet, Text, View } from 'react-native';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { border, colors, fonts, radius, type as typeScale } from '@/theme/tokens';

type Props = {
  label: string;
  bg?: string;
  /** Leading line icon. Prefer this to putting an emoji in the label. */
  icon?: IconName;
};

export function PixelChip({ label, bg = colors.blue, icon }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.shadow, { left: 2, top: 2, backgroundColor: colors.ink }]} />
      <View style={[styles.chip, { backgroundColor: bg }]}>
        {icon && <PixelIcon name={icon} color={colors.ink} size={12} sw={1.9} />}
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  shadow: { position: 'absolute', right: 0, bottom: 0 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: border.thin,
    borderColor: colors.ink,
    borderRadius: radius,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  label: { fontFamily: fonts.heading, fontSize: typeScale.label, color: colors.ink },
});
