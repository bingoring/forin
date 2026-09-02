// Scenario Clear's read-back of what the learner said out loud: the sentences from this
// run with per-sentence scores, an average, and 낮은 점수 N문장 다시 연습하기.
//
// Renders an explicit empty state for a run answered entirely by typing — "no score" and
// "score 0" are different facts, so a run with no spoken lines must not show a 0 badge.
import { StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { bandColor, bandOf, scoreLabel } from '@/data/speakBands';
import { SpokenRow } from './SpokenRow';
import { useT } from '@/i18n';
import type { SessionSpeechReview, SpokenSentence } from '@/api/client';

export function SessionSpeechReviewCard({
  review,
  onPractise,
}: {
  review: SessionSpeechReview;
  /** Practises the run's weakest sentences, in order. */
  onPractise: (sentences: SpokenSentence[]) => void;
}) {
  const t = useT();
  const spoken = review.sentences.length > 0;
  return (
    <NbPaper rot={0.4} style={styles.card}>
      <View style={styles.header}>
        <NbIcon name="mic" size={16} />
        <Text numberOfLines={1} style={[nbText.hand(16), { flex: 1, minWidth: 0 }]}>{t('speak.reviewTitle')}</Text>
        {spoken && (
          <>
            <Text numberOfLines={1} style={nbText.body(10, nb.soft)}>{t('speak.reviewAverage')}</Text>
            <View style={[styles.avgBadge, { backgroundColor: bandColor(bandOf(review.average)) }]}>
              <Text style={styles.avgText}>{scoreLabel(review.average)}</Text>
            </View>
          </>
        )}
      </View>

      {spoken ? (
        review.sentences.map((s, i) => (
          <SpokenRow key={s.sentenceKey} sentence={s} divider={i < review.sentences.length - 1} />
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={[nbText.hand(16), { textAlign: 'center' }]}>{t('speak.empty')}</Text>
          <Text style={[nbText.body(11, nb.soft), { textAlign: 'center', marginTop: 3 }]}>{t('speak.emptyHint')}</Text>
        </View>
      )}

      {/* The button is offered only when there is actually something weak to practise:
          with every line at 80+ it would send the learner to drill sentences they have
          already mastered. */}
      {review.weakest.length > 0 && review.weakest.some((s) => bandOf(s.overall) !== 'high') && (
        <View style={styles.footer}>
          <NbButton variant="yellow" full icon="mic" onPress={() => onPractise(review.weakest)}>
            {t('speak.practiceWeak', { n: review.weakest.length })}
          </NbButton>
        </View>
      )}
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { alignSelf: 'stretch', marginTop: 14, paddingVertical: 12, paddingHorizontal: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingBottom: 6 },
  avgBadge: {
    minWidth: 32, paddingVertical: 3, paddingHorizontal: 5, alignItems: 'center', flexShrink: 0,
    borderWidth: 1.4, borderColor: nb.ink, borderRadius: 2, transform: [{ rotate: '-2deg' }],
  },
  avgText: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.ink },
  empty: { paddingVertical: 16, alignItems: 'center' },
  footer: { marginTop: 11, paddingTop: 11, borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.18)' },
});
