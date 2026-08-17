// "이 문장 내 점수" — the last three tries at this sentence. SoT L93-104.
//
// Always three rows, oldest first. A try that hasn't happened shows "—" with an
// empty bar rather than 0: not-yet-attempted and scored-zero are different
// facts, and the same distinction the server keeps for prosody.
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { syllableBand } from '@/lib/pronTokens';
import { PronCard } from './PronCard';

export type AttemptRow = { no: number; score: number | null };

const BAND_COLOR = { ok: colors.mint, weak: colors.yellow, bad: colors.red } as const;

export function AttemptHistory({ attempts }: { attempts: AttemptRow[] }) {
  return (
    <PronCard bg={colors.cream} style={styles.card}>
      <Text style={styles.header}>📈 이 문장 내 점수</Text>
      {attempts.map((a, i) => (
        <View key={a.no} style={[styles.row, i < attempts.length - 1 && styles.divider]}>
          <Text style={styles.no}>{a.no}차</Text>
          <View style={styles.track}>
            {a.score !== null ? (
              <View
                style={[
                  styles.fill,
                  { width: `${Math.max(0, Math.min(100, a.score))}%`, backgroundColor: BAND_COLOR[syllableBand(a.score)] },
                ]}
              />
            ) : null}
          </View>
          <Text style={styles.score}>{a.score !== null ? Math.round(a.score) : '—'}</Text>
        </View>
      ))}
    </PronCard>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: {
    fontFamily: fonts.heading,
    fontSize: 10.5,
    color: colors.ink,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderBottomColor: colors.ink + '33',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 7, paddingHorizontal: 12 },
  divider: { borderBottomWidth: 1.5, borderStyle: 'dotted', borderBottomColor: colors.ink + '22' },
  no: { fontFamily: fonts.heading, fontSize: 10, color: colors.text, width: 26 },
  track: { flex: 1, height: 9, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.ink },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  score: { fontFamily: fonts.heading, fontSize: 11, color: colors.ink, width: 22, textAlign: 'right' },
});
