// "이 문장 내 점수" — the last three tries at this sentence.
//
// Always three rows, oldest first. A try that hasn't happened shows "—" with an empty
// gauge rather than 0: not-yet-attempted and scored-zero are different facts, and the same
// distinction the server keeps for prosody.
//
// The rise line at the bottom only appears when there IS a rise. On a try that went
// backwards, a green "올랐어요" would be a lie, and a red "내려갔어요" would be the app
// telling somebody who just practised that they got worse — so it says nothing, which is
// what the three gauges above already show honestly.
import { StyleSheet, Text, View } from 'react-native';
import { NbGauge, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { syllableBand } from '@/lib/pronTokens';
import { NbIcon } from '@/components/nb/NbIcon';
import { useT } from '@/i18n';
import { BAND_INK } from './nbPron';

export type AttemptRow = { no: number; score: number | null };

export function AttemptHistory({ attempts }: { attempts: AttemptRow[] }) {
  const t = useT();
  const scored = attempts.filter((a) => a.score !== null).map((a) => a.score as number);
  const gain = scored.length > 1 ? Math.round(scored[scored.length - 1] - scored[0]) : 0;

  return (
    <NbPaper rot={0.4} style={styles.card}>
      <View style={styles.header}>
        <NbIcon name="chartup" size={15} />
        <Text style={nbText.hand(16)}>{t('pron.myScores')}</Text>
      </View>
      {attempts.map((a, i) => (
        <View key={a.no} style={[styles.row, i > 0 && styles.gap]}>
          <Text numberOfLines={1} style={styles.no}>{t('pron.attemptNo', { n: a.no })}</Text>
          <View style={styles.track}>
            <NbGauge value={a.score ?? 0} color={BAND_INK[syllableBand(a.score ?? 0)]} height={10} />
          </View>
          <Text style={styles.score}>{a.score !== null ? Math.round(a.score) : '—'}</Text>
        </View>
      ))}
      {gain > 0 && (
        <Text style={[nbText.hand(13, nb.green), styles.gain]}>{t('pron.gained', { n: gain })}</Text>
      )}
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 13, paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10 },
  gap: { marginTop: 7 },
  no: { ...nbText.hand(14, nb.soft), width: 26, flexShrink: 0 },
  track: { flex: 1, minWidth: 0 },
  score: { fontFamily: nbFonts.monoBold, fontSize: 12.5, color: nb.ink, width: 26, textAlign: 'right', flexShrink: 0 },
  gain: { marginTop: 9 },
});
