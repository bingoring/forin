// Pronunciation assessment result display: the recognized utterance, four score
// bars (accuracy / fluency / completeness / overall), and per-word chips colored
// by error type. Pure/presentational — takes a PronunciationResult.
import { Text, View } from 'react-native';
import type { PronunciationResult } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

function scoreColor(v: number): string {
  if (v >= 80) return colors.mint;
  if (v >= 60) return colors.yellow;
  return '#FCA5A5';
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>{label}</Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>{Math.round(value)}</Text>
      </View>
      <View style={{ height: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: C }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: scoreColor(value) }} />
      </View>
    </View>
  );
}

export function PronunciationScore({ result }: { result: PronunciationResult }) {
  return (
    <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <View style={{ width: 44, height: 44, backgroundColor: scoreColor(result.overall), borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C }}>{Math.round(result.overall)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.textSoft }}>발음 점수 · OVERALL</Text>
          {!!result.recognized && (
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, marginTop: 2 }} numberOfLines={2}>
              "{result.recognized}"
            </Text>
          )}
        </View>
      </View>

      <ScoreBar label="정확도 ACCURACY" value={result.accuracy} />
      <ScoreBar label="유창성 FLUENCY" value={result.fluency} />
      <ScoreBar label="완성도 COMPLETENESS" value={result.completeness} />

      {!!result.words?.length && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
          {result.words.map((w, i) => {
            const ok = (w.errorType ?? 'None') === 'None' && w.accuracy >= 60;
            return (
              <View key={i} style={{ backgroundColor: ok ? colors.mint : '#FEE2E2', borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C }}>{w.word}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
