// How every sentence the learner has said out loud is spread across 60↓ / 60–79 / 80+.
//
// v33 draws this as ONE inked gauge with a legend below, not three paper tiles. The
// tiles were the same material — a pastel paper chip — as the section tabs sitting right
// above them, so the two rows read as one block and the eye could not tell "which tab am
// I on" from "how are my scores spread". A single filled bar cannot be mistaken for a row
// of tabs.
//
// The change does NOT drop the counts, which is the number somebody opens this tab to
// find ("how many are still bad"): they move into the legend, so the gauge answers "what
// proportion" and the legend still answers "how many". The colours are the same three the
// pronunciation screen stamps its syllables with (BAND_SWATCH / BAND_INK), so a sentence
// scored 42 reads as the same group wherever the learner meets it.
import { StyleSheet, Text, View } from 'react-native';
import { nbText } from '@/components/nb/NbUI';
import { BAND_INK, BAND_SWATCH } from '@/components/pron/nbPron';
import { nb } from '@/theme/nb';
import { bandLabelKey, bandWidths, type Band } from '@/data/speakBands';
import { useT } from '@/i18n';

export type BandCounts = { total: number; low: number; mid: number; high: number };

const ORDER: Band[] = ['low', 'mid', 'high'];
/** band → the swatch key the pronunciation palette uses: low needs work (bad),
 *  mid is getting there (weak), high is good (ok). Same mapping as bandColor. */
const SWATCH: Record<Band, 'bad' | 'weak' | 'ok'> = { low: 'bad', mid: 'weak', high: 'ok' };

export function BandBar({ counts }: { counts: BandCounts }) {
  const t = useT();
  const w = bandWidths(counts);
  // Only the bands that actually take up space are drawn as segments — a 0-width
  // segment would still paint its 1.4px divider, a stray line inside the bar. The
  // divider sits on every segment after the first VISIBLE one.
  const segments = ORDER.filter((b) => w[b] > 0);

  return (
    <View>
      <View style={styles.gauge}>
        {segments.map((b, i) => (
          <View
            key={b}
            style={{
              width: `${w[b]}%`,
              backgroundColor: BAND_SWATCH[SWATCH[b]],
              borderLeftWidth: i === 0 ? 0 : 1.4,
              borderLeftColor: nb.ink,
            }}
          />
        ))}
      </View>

      {/* All three, even a band with a count of 0 — "80점 이상 0" is a fact worth
          seeing, and the legend is where the actual numbers live now. */}
      <View style={styles.legend}>
        {ORDER.map((b) => (
          <View key={b} style={styles.legendItem}>
            <View style={[styles.dot, { borderColor: BAND_INK[SWATCH[b]] }]} />
            <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>
              {`${t(bandLabelKey(b))} ${counts[b]}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: {
    flexDirection: 'row',
    height: 13,
    borderWidth: 1.6,
    borderColor: nb.ink,
    borderRadius: 3,
    overflow: 'hidden',
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, marginTop: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  /** Ring, not a filled dot: the fill is in the bar above, and a hollow ring next to
   *  it reads as "this colour" rather than as a second data mark. */
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.4, backgroundColor: 'transparent' },
});
