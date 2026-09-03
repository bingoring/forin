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
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
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
  // One animated width per band, so changing the department filter slides the bars to
  // the new department's spread instead of snapping ("분포 변화는 부드럽게"). Seeded at the
  // first render's widths, so the initial paint is the real distribution rather than a
  // grow-from-zero. Not the native driver: a percentage width cannot run on it.
  const anim = useRef({ low: new Animated.Value(w.low), mid: new Animated.Value(w.mid), high: new Animated.Value(w.high) }).current;
  useEffect(() => {
    Animated.parallel(
      ORDER.map((b) => Animated.timing(anim[b], { toValue: w[b], duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: false })),
    ).start();
    // The primitives, not the object: `w` is a fresh object every render, so depending on
    // it would re-fire the animation on every unrelated re-render.
  }, [w.low, w.mid, w.high, anim]);

  return (
    <View>
      <View style={styles.gauge}>
        {/* All three segments always mounted so the animation has something to grow from
            and shrink into — a band that filters down to nothing narrows to 0 rather than
            popping out. Its divider narrows with it (borderLeft → 0 at width 0), so a
            collapsed band leaves no stray line inside the bar. */}
        {ORDER.map((b, i) => {
          // The divider sits between two VISIBLE bands, so a band draws its left divider
          // only when it has width AND something before it does. A 0-width leading band
          // (e.g. no 60↓ sentences) must not leave the first visible band with a stray
          // line at the bar's start. Driven by the target widths, not the animation, so a
          // band appearing/disappearing flips its divider cleanly rather than fading a line.
          const dividerLeft = w[b] > 0 && ORDER.slice(0, i).some((x) => w[x] > 0);
          return (
            <Animated.View
              key={b}
              style={{
                width: anim[b].interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }),
                backgroundColor: BAND_SWATCH[SWATCH[b]],
                borderLeftWidth: dividerLeft ? 1.4 : 0,
                borderLeftColor: nb.ink,
              }}
            />
          );
        })}
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
