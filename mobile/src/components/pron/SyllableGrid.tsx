// Per-syllable result chips + the legend that reads them.
//
// Renders nothing when the scorer returned no syllables (business-rules R10: a
// word-granularity response must still show the total, just without this block). An empty
// grid with a legend would imply "all syllables fine".
//
// The chips are stamped, not written: each one is a phonetic fragment, and Gaegu at 11pt
// does not distinguish ə from a — see nbPron.ts on why the three bands are also stronger
// here than anywhere else in the notebook.
import { StyleSheet, Text, View } from 'react-native';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import { BAND, BAND_SWATCH } from './nbPron';

export type SyllableChip = { label: string; band: 'ok' | 'weak' | 'bad' };

// Keys, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const LEGEND: [string, string][] = [
  ['pron.bandOk', BAND_SWATCH.ok],
  ['pron.bandWeak', BAND_SWATCH.weak],
  ['pron.bandBad', BAND_SWATCH.bad],
];

export function SyllableGrid({ syllables }: { syllables: SyllableChip[] }) {
  const t = useT();
  if (syllables.length === 0) return null;

  return (
    <NbPaper rot={0.4} style={styles.card}>
      <Text style={nbText.hand(16)}>{t('pron.syllableResult')}</Text>
      <View style={styles.chips}>
        {syllables.map((s, i) => (
          <View
            key={i}
            style={[styles.chip, { backgroundColor: BAND[s.band], transform: [{ rotate: `${(s.label.length % 3) - 1}deg` }] }]}
          >
            <Text style={styles.chipText}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {LEGEND.map(([labelKey, color]) => (
          <View key={labelKey} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: color }]} />
            <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{t(labelKey)}</Text>
          </View>
        ))}
      </View>
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 13, paddingHorizontal: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { borderWidth: 1.4, borderColor: nb.ink, borderRadius: 2, paddingVertical: 4, paddingHorizontal: 7 },
  chipText: { fontFamily: nbFonts.monoBold, fontSize: 11.5, color: nb.ink },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  swatch: { width: 10, height: 10, borderWidth: 1.2, borderColor: nb.ink },
});
