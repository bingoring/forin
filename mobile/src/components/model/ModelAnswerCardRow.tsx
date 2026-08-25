// One correction, drawn the way the handoff describes the 모범답안 panel:
// 내 답변 struck through, the 모범 highlighted, and a "왜?" box.
//
// The strike-through is the whole point: this is a sentence the learner actually
// said. It is why 'grade' cards — suggestions for sentences never spoken — are
// filtered out server-side rather than mixed in here.
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { useT } from '@/i18n';
import type { ModelAnswerCard } from '@/api/client';

export function ModelAnswerCardRow({ card, divider = true }: { card: ModelAnswerCard; divider?: boolean }) {
  const t = useT();
  return (
    <View style={[styles.row, divider && styles.divider]}>
      <View style={styles.line}>
        <Text style={styles.label}>{t('model.mine')}</Text>
        <Text style={styles.said}>{card.said}</Text>
      </View>
      <View style={styles.line}>
        <Text style={styles.label}>{t('model.answer')}</Text>
        <Text style={styles.model}>{card.model}</Text>
      </View>
      {/* Absent, not empty: an explanation box with nothing in it reads as a
          missing explanation rather than as "there is nothing to explain". */}
      {!!card.note?.trim() && (
        <View style={styles.whyBox}>
          <Text style={styles.whyLabel}>{t('model.why')}</Text>
          <Text style={styles.whyText}>{card.note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 9, paddingHorizontal: 12, gap: 5 },
  divider: { borderBottomWidth: 1.5, borderStyle: 'dotted', borderBottomColor: colors.ink + '22' },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  label: { width: 52, fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, paddingTop: 2 },
  said: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fs(12),
    color: colors.textSoft,
    textDecorationLine: 'line-through',
    lineHeight: 17,
  },
  model: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: fs(12),
    color: colors.ink,
    backgroundColor: colors.yellow,
    lineHeight: 18,
  },
  whyBox: {
    marginTop: 2,
    marginLeft: 59,
    backgroundColor: colors.cream,
    borderLeftWidth: 3,
    borderLeftColor: colors.ink,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  whyLabel: { fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft },
  whyText: { fontFamily: fonts.body, fontSize: fs(10.5), color: colors.ink, lineHeight: 16, marginTop: 2 },
});
