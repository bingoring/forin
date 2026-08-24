// Scenario Clear's comprehensive read-back of what the player said out loud
// (04_SCREENS ⑤ → ⑨): the sentences from this run with per-sentence scores, an
// average badge, and 낮은 점수 N문장 다시 연습하기.
//
// Renders nothing at all while loading, and an explicit empty state for a run
// answered entirely by typing — "no score" and "score 0" are different facts, so
// a run with no spoken lines must not show a 0 badge.
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PixelButton } from '@/components/PixelButton';
import { PixelIcon } from '@/components/PixelIcon';
// The shared drop-shadow wrapper lives in campus/parts (extracted there when
// campus.tsx was split); reused rather than re-declared for a fourth time.
import { Shadowed } from '@/components/campus/parts';
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
    <Shadowed offset={4} style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.header}>
          <PixelIcon name="mic" color={colors.ink} size={13} sw={1.8} />
          <Text style={styles.headerText}>{t('speak.reviewTitle')}</Text>
          <View style={styles.spacer} />
          {spoken && (
            <>
              <Text style={styles.avgLabel}>{t('speak.reviewAverage')}</Text>
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
            <Text style={styles.emptyText}>{t('speak.empty')}</Text>
            <Text style={styles.emptyHint}>{t('speak.emptyHint')}</Text>
          </View>
        )}

        {/* The button is offered only when there is actually something weak to
            practise: with every line at 80+ it would send the player to drill
            sentences they have already mastered. */}
        {review.weakest.length > 0 && review.weakest.some((s) => bandOf(s.overall) !== 'high') && (
          <View style={styles.footer}>
            <PixelButton
              icon="target"
              label={t('speak.practiceWeak', { n: review.weakest.length })}
              bg={colors.yellow}
              shadowColor={colors.yellowShadow}
              fontSize={11}
              paddingV={8}
              borderWidth={2}
              offset={2}
              onPress={() => onPractise(review.weakest)}
              full
            />
          </View>
        )}
      </View>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', marginTop: 14 },
  card: { backgroundColor: '#fff', borderWidth: 3, borderColor: colors.ink },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 7,
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderBottomColor: colors.ink + '33',
  },
  headerText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.ink },
  spacer: { flex: 1 },
  avgLabel: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
  avgBadge: { minWidth: 32, paddingVertical: 2, paddingHorizontal: 4, borderWidth: 2, borderColor: colors.ink, alignItems: 'center' },
  avgText: { fontFamily: fonts.heading, fontSize: fs(12), color: colors.ink },
  empty: { paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center' },
  emptyText: { fontFamily: fonts.heading, fontSize: fs(11), color: colors.ink },
  emptyHint: { fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 4, textAlign: 'center' },
  footer: { padding: 10, borderTopWidth: 2, borderStyle: 'dotted', borderTopColor: colors.ink + '33' },
});
