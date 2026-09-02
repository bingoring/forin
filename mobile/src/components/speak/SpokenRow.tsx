// One sentence the learner said out loud: its score, the text, how many tries it took, and
// the department it came from. Shared by the Scenario Clear read-back, the Review Lab's
// 말하기 tab, and the full list — three places that must render the same fact the same way.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { bandColor, bandOf, deptOf, scoreLabel } from '@/data/speakBands';
import { useT } from '@/i18n';
import type { SpokenSentence } from '@/api/client';

export function SpokenRow({
  sentence,
  onPractise,
  divider = true,
  /** v31 draws the 말하기 tab as a stack of paper cards; the result screen's read-back
   *  keeps them as ruled rows inside one card, which is what `card={false}` is for. */
  card = false,
  rot = 0,
}: {
  sentence: SpokenSentence;
  /** Omitted where the row is not actionable (the result screen's read-back). */
  onPractise?: (s: SpokenSentence) => void;
  divider?: boolean;
  card?: boolean;
  rot?: number;
}) {
  const t = useT();
  const dept = deptOf(sentence);
  const body = (
    <>
      {/* The score is stamped, in the band's colour — the same three the pronunciation
          screen uses, so 42 looks like 42 wherever the learner meets it again. */}
      <View style={[styles.badge, { backgroundColor: bandColor(bandOf(sentence.overall)) }]}>
        <Text style={styles.badgeText}>{scoreLabel(sentence.overall)}</Text>
      </View>
      <View style={styles.body}>
        {/* Two lines, then ellipsis: a long utterance must not push the score badge and
            the practise button out of a fixed-height list row. */}
        <Text style={styles.text} numberOfLines={2}>{sentence.referenceText}</Text>
        <View style={styles.meta}>
          {!!dept && <Text style={styles.dept}>{dept}</Text>}
          <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{t('speak.tries', { n: sentence.attempts })}</Text>
        </View>
      </View>
      {onPractise && (
        <Pressable onPress={() => onPractise(sentence)} hitSlop={8}>
          {card
            ? <NbIcon name="mic" size={18} />
            : (
              <NbPaper rot={-1.5} bg="rgba(143,199,232,.3)" style={styles.practise}>
                <NbIcon name="mic" size={15} />
              </NbPaper>
            )}
        </Pressable>
      )}
    </>
  );
  if (!card) return <View style={[styles.row, divider && styles.divider]}>{body}</View>;
  return <NbPaper rot={rot} style={[styles.row, styles.card]}>{body}</NbPaper>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 2 },
  card: { paddingVertical: 9, paddingHorizontal: 11 },
  divider: { borderBottomWidth: 1.3, borderStyle: 'dashed', borderBottomColor: 'rgba(62,54,43,.15)' },
  badge: {
    minWidth: 34, paddingVertical: 4, paddingHorizontal: 5, alignItems: 'center', flexShrink: 0,
    borderWidth: 1.4, borderColor: nb.ink, borderRadius: 2, transform: [{ rotate: '-2deg' }],
  },
  badgeText: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.ink },
  body: { flex: 1, minWidth: 0 },
  /** The sentence itself is the ENGLISH the learner is learning, so it is set in the
   *  reading face rather than the handwriting one. */
  text: { fontFamily: nbFonts.bodyMid, fontSize: 13, color: nb.ink, lineHeight: 19 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2 },
  dept: { fontFamily: nbFonts.mono, fontSize: 9, color: nb.soft, letterSpacing: 1 },
  practise: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
