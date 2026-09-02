// The three sub-scores beside the total, as pencil-hatched gauges.
//
// 억양 (prosody) is conditional on purpose: Azure only scores it when
// EnableProsodyAssessment is on AND the locale supports it, so the server sends
// `prosodyAvailable` alongside the number. Rendering an unscored prosody as 0
// would tell the learner their intonation failed when it was never measured —
// the row is dropped instead, leaving two bars.
import { StyleSheet, Text, View } from 'react-native';
import { NbGauge, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';

type Props = {
  accuracy: number;
  fluency: number;
  prosody: number;
  prosodyAvailable: boolean;
};

export function ScoreBars({ accuracy, fluency, prosody, prosodyAvailable }: Props) {
  const t = useT();
  const rows: [string, number, string][] = [
    [t('pron.accuracy'), accuracy, nb.green],
    [t('pron.fluency'), fluency, nb.blue],
  ];
  if (prosodyAvailable) rows.push([t('pron.prosody'), prosody, '#C77E2E']);

  return (
    <View style={styles.wrap}>
      {rows.map(([label, value, color], i) => (
        <View key={label} style={[styles.row, i > 0 && styles.gap]}>
          <Text numberOfLines={1} style={styles.label}>{label}</Text>
          <View style={styles.track}><NbGauge value={value} color={color} height={9} /></View>
          <Text style={styles.value}>{Math.round(value)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gap: { marginTop: 6 },
  label: { ...nbText.hand(13.5), width: 44, flexShrink: 0 },
  track: { flex: 1, minWidth: 0 },
  /** The number is printed: it is a measurement, and 72 in a handwriting face beside a
   *  hand-drawn gauge stops reading as a value. */
  value: { fontFamily: nbFonts.monoBold, fontSize: 11, color: nb.ink, width: 22, textAlign: 'right', flexShrink: 0 },
});
