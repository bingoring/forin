// The 60↓ / 60–79 / 80+ distribution of every sentence the learner has said out loud —
// one filled row plus a legend, a summary that does not grow past 100 sentences.
//
// In the notebook line the row is a strip of paper with the three bands laid along it in
// the same colours the pronunciation screen stamps its syllables with.
import { StyleSheet, Text, View } from 'react-native';
import { nb, nbFonts } from '@/theme/nb';
import { nbText } from '@/components/nb/NbUI';
import { bandColor, bandLabelKey, bandWidths, type Band } from '@/data/speakBands';
import { useT } from '@/i18n';

export type BandCounts = { total: number; low: number; mid: number; high: number };

const ORDER: Band[] = ['low', 'mid', 'high'];

export function BandBar({ counts }: { counts: BandCounts }) {
  const t = useT();
  const w = bandWidths(counts);
  return (
    <View>
      <View style={styles.track}>
        {counts.total > 0 ? (
          ORDER.map((b) =>
            // A zero-count band is omitted, not rendered at width 0: a 0%-wide view still
            // paints its border and shows as a stray tick.
            w[b] > 0 ? <View key={b} style={[styles.seg, { width: `${w[b]}%`, backgroundColor: bandColor(b) }]} /> : null
          )
        ) : null}
      </View>
      <View style={styles.legend}>
        {ORDER.map((b) => (
          <View key={b} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: bandColor(b) }]} />
            <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{t(bandLabelKey(b))}</Text>
            <Text numberOfLines={1} style={styles.count}>{counts[b]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row', height: 13, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 2,
    backgroundColor: nb.paper, overflow: 'hidden',
  },
  seg: { height: '100%' },
  legend: { flexDirection: 'row', marginTop: 7, gap: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swatch: { width: 10, height: 10, borderWidth: 1.2, borderColor: nb.ink },
  /** The count is printed: it is a measurement, and it sits beside two others to be
   *  compared. */
  count: { fontFamily: nbFonts.monoBold, fontSize: 10.5, color: nb.ink },
});
