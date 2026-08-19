// The three sub-scores beside the total. SoT screen-pronunciation.jsx L160-168.
//
// 억양 (prosody) is conditional on purpose: Azure only scores it when
// EnableProsodyAssessment is on AND the locale supports it, so the server sends
// `prosodyAvailable` alongside the number. Rendering an unscored prosody as 0
// would tell the learner their intonation failed when it was never measured —
// the row is dropped instead, leaving two bars.
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';

type Props = {
  accuracy: number;
  fluency: number;
  prosody: number;
  prosodyAvailable: boolean;
};

export function ScoreBars({ accuracy, fluency, prosody, prosodyAvailable }: Props) {
  const rows: [string, number][] = [
    [t('pron.accuracy'), accuracy],
    [t('pron.fluency'), fluency],
  ];
  if (prosodyAvailable) rows.push([t('pron.prosody'), prosody]);

  return (
    <View style={styles.wrap}>
      {rows.map(([label, value], i) => (
        <View key={label} style={[styles.row, i < rows.length - 1 && styles.gap]}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${clamp(value)}%` }]} />
          </View>
          <Text style={styles.value}>{Math.round(value)}</Text>
        </View>
      ))}
    </View>
  );
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  gap: { marginBottom: 6 },
  label: { fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.ink, width: 34 },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.ink,
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.ink },
  value: { fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.ink, width: 18, textAlign: 'right' },
});
