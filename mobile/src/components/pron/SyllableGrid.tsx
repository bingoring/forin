// Per-syllable result chips + the legend that reads them. SoT L171-184.
//
// Renders nothing when the scorer returned no syllables (business-rules R10:
// a word-granularity response must still show the total, just without this
// block). An empty grid with a legend would imply "all syllables fine".
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PronCard } from './PronCard';
import { t, useLocale, useT } from '@/i18n';

export type SyllableChip = { label: string; band: 'ok' | 'weak' | 'bad' };

const BAND_COLOR: Record<SyllableChip['band'], string> = {
  ok: colors.mint,
  weak: colors.yellow,
  bad: colors.red,
};

// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const LEGEND: [string, string][] = [
  ['pron.bandOk', colors.mint],
  ['pron.bandWeak', colors.yellow],
  ['pron.bandBad', colors.red],
];

export function SyllableGrid({ syllables }: { syllables: SyllableChip[] }) {
  const t = useT();
  if (syllables.length === 0) return null;

  return (
    <PronCard style={styles.card}>
      <Text style={styles.title}>음절별 결과</Text>
      <View style={styles.chips}>
        {syllables.map((s, i) => (
          <View key={i} style={[styles.chip, { backgroundColor: BAND_COLOR[s.band] }]}>
            <Text style={styles.chipText}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {LEGEND.map(([labelKey, color]) => (
          <View key={labelKey} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{t(labelKey)}</Text>
          </View>
        ))}
      </View>
    </PronCard>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 12, paddingHorizontal: 11 },
  title: { fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.ink, marginBottom: 9 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: { borderWidth: 2, borderColor: colors.ink, paddingVertical: 4, paddingHorizontal: 6 },
  chipText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.ink },
  legend: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 11,
    paddingTop: 9,
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderTopColor: colors.ink + '22',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swatch: { width: 11, height: 11, borderWidth: 2, borderColor: colors.ink },
  legendText: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.text },
});
