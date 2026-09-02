// One correction, in the 근무 수첩 line: what the learner SAID struck through in red pen,
// the model answer highlighted, and a blue "왜?" memo.
//
// The strike-through is the whole point: this is a sentence the learner actually said. It
// is why 'grade' cards — suggestions for sentences never spoken — are filtered out
// server-side rather than mixed in here.
import { StyleSheet, Text, View } from 'react-native';
import { NbMark, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import type { ModelAnswerCard } from '@/api/client';

export function ModelAnswerCardRow({ card, divider = true }: { card: ModelAnswerCard; divider?: boolean }) {
  const t = useT();
  return (
    <View style={[styles.row, divider && styles.divider]}>
      <View style={styles.line}>
        <Text numberOfLines={1} style={styles.label}>{t('model.mine')}</Text>
        <Text style={styles.said}>{card.said}</Text>
      </View>
      <View style={styles.line}>
        <Text numberOfLines={1} style={styles.label}>{t('model.answer')}</Text>
        <View style={{ flex: 1, minWidth: 0 }}>
          <NbMark textStyle={styles.model}>{card.model}</NbMark>
        </View>
      </View>
      {/* Absent, not empty: an explanation box with nothing in it reads as a missing
          explanation rather than as "there is nothing to explain". */}
      {!!card.note?.trim() && (
        <View style={styles.whyBox}>
          <Text numberOfLines={1} style={styles.whyLabel}>{t('model.why')}</Text>
          <Text style={[nbText.hand(14.5), { marginTop: 1 }]}>{card.note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 10, gap: 6 },
  divider: { borderBottomWidth: 1.3, borderStyle: 'dashed', borderBottomColor: 'rgba(62,54,43,.15)' },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  label: { width: 46, flexShrink: 0, fontFamily: nbFonts.mono, fontSize: 9, color: nb.soft, paddingTop: 3, letterSpacing: 0.5 },
  /** Struck through in RED — the correction pen, not a grey "deleted". */
  said: {
    flex: 1, minWidth: 0, fontFamily: nbFonts.body, fontSize: 12.5, color: nb.soft, lineHeight: 18,
    textDecorationLine: 'line-through', textDecorationColor: nb.red,
  },
  /** The model answer is English to be read, so the reading face — under the marker. */
  model: { fontFamily: nbFonts.bodyBold, fontSize: 13, color: nb.ink, lineHeight: 19 },
  whyBox: {
    marginLeft: 54, paddingVertical: 6, paddingHorizontal: 9,
    borderLeftWidth: 2.5, borderLeftColor: nb.blue, backgroundColor: 'rgba(74,111,165,.06)',
  },
  whyLabel: { fontFamily: nbFonts.bodyBold, fontSize: 9.5, color: nb.blue, letterSpacing: 1 },
});
