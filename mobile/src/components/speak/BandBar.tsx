// How every sentence the learner has said out loud is spread across 60↓ / 60–79 / 80+.
//
// v31 draws this as THREE tiles rather than one filled bar, and the difference is what it
// answers. A bar answers "what proportion"; three counts answer "how many are still bad",
// which is the number somebody opens this tab to find. The tile carries the band's own
// wash so the score chips in the list below read as the same three groups.
import { StyleSheet, Text, View } from 'react-native';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { bandColor, bandLabelKey, type Band } from '@/data/speakBands';
import { useT } from '@/i18n';

export type BandCounts = { total: number; low: number; mid: number; high: number };

const ORDER: Band[] = ['low', 'mid', 'high'];

export function BandBar({ counts }: { counts: BandCounts }) {
  const t = useT();
  return (
    <View style={styles.row}>
      {ORDER.map((b, i) => (
        <View key={b} style={{ flex: 1 }}>
          <NbPaper rot={i % 2 ? 0.5 : -0.5} bg={bandColor(b)} style={styles.tile}>
            {/* The count is the point, so it is the big thing; printed, because it is a
                measurement. */}
            <Text numberOfLines={1} style={styles.count}>{counts[b]}</Text>
            <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>{t(bandLabelKey(b))}</Text>
          </NbPaper>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 9 },
  tile: { paddingVertical: 7, alignItems: 'center' },
  count: { fontFamily: nbFonts.monoBold, fontSize: 18, color: nb.ink, lineHeight: 21 },
});
