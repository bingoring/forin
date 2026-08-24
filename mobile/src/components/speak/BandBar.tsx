// The 60↓ / 60–79 / 80+ distribution bar of the Review Lab 직접 말하기 연습 block
// (04_SCREENS ⑨). One filled row plus a legend — a summary the block can show at
// 100+ sentences without growing.
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
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
            // A zero-count band is omitted, not rendered at width 0: a 0%-wide
            // view still paints its 1.5px border and shows as a stray tick.
            w[b] > 0 ? <View key={b} style={[styles.seg, { width: `${w[b]}%`, backgroundColor: bandColor(b) }]} /> : null
          )
        ) : null}
      </View>
      <View style={styles.legend}>
        {ORDER.map((b) => (
          <View key={b} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: bandColor(b) }]} />
            <Text style={styles.legendText}>{t(bandLabelKey(b))}</Text>
            <Text style={styles.legendCount}>{counts[b]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 14,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  seg: { height: '100%' },
  legend: { flexDirection: 'row', marginTop: 7, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  swatch: { width: 9, height: 9, borderWidth: 1.5, borderColor: colors.ink },
  legendText: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
  legendCount: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.ink },
});
