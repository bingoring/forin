// One sentence the player said out loud: its score, the text, how many tries it
// took, and the department it came from. Shared by the Scenario Clear review
// list, the Review Lab block's 가장 급한 문장, and ScreenSpeakList — three places
// that must render the same fact the same way.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';

import { FIcon } from '@/components/FIcon';
import { bandColor, bandOf, deptOf, scoreLabel } from '@/data/speakBands';
import { useT } from '@/i18n';
import type { SpokenSentence } from '@/api/client';

export function SpokenRow({
  sentence,
  onPractise,
  divider = true,
}: {
  sentence: SpokenSentence;
  /** Omitted where the row is not actionable (the result screen's read-back). */
  onPractise?: (s: SpokenSentence) => void;
  divider?: boolean;
}) {
  const t = useT();
  const dept = deptOf(sentence);
  return (
    <View style={[styles.row, divider && styles.divider]}>
      <View style={[styles.badge, { backgroundColor: bandColor(bandOf(sentence.overall)) }]}>
        <Text style={styles.badgeText}>{scoreLabel(sentence.overall)}</Text>
      </View>
      <View style={styles.body}>
        {/* Two lines, then ellipsis: a long utterance must not push the score
            badge and the practise button out of a fixed-height list row. */}
        <Text style={styles.text} numberOfLines={2}>{sentence.referenceText}</Text>
        <View style={styles.meta}>
          {!!dept && (
            <View style={styles.deptChip}>
              <Text style={styles.deptText}>{dept}</Text>
            </View>
          )}
          <Text style={styles.tries}>{t('speak.tries', { n: sentence.attempts })}</Text>
        </View>
      </View>
      {onPractise && (
        <Pressable onPress={() => onPractise(sentence)} hitSlop={8} style={styles.practise}>
          <FIcon name="mic" size={14} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 12 },
  divider: { borderBottomWidth: 1.5, borderStyle: 'dotted', borderBottomColor: colors.ink + '22' },
  badge: {
    minWidth: 34,
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
  },
  badgeText: { fontFamily: fonts.heading, fontSize: fs(12), color: colors.ink },
  body: { flex: 1 },
  text: { fontFamily: fonts.body, fontSize: fs(12), color: colors.ink, lineHeight: 17 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  deptChip: { borderWidth: 1.5, borderColor: colors.ink, paddingHorizontal: 4, paddingVertical: 1 },
  deptText: { fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.ink },
  tries: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
  practise: { padding: 6, borderWidth: 2, borderColor: colors.ink, backgroundColor: '#fff' },
});
