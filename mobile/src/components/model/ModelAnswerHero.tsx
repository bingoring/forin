// 최근 1건 펼침 — the worked example at the top of 모범답안 (핸드오프 v31 07 · 리뷰랩 C).
//
// The list below it is a list; this is the one correction the learner is most likely
// to still remember saying. It is taped to the page rather than pinned, carries the
// 최근 stamp, and ends in the two things you can actually do with a model answer:
// hear it, and say it.
//
// Only the FIRST card of the most recent scenario. A hero that scrolls through four
// corrections is the list again, one indent deeper.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbMark, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useReferenceAudio } from '@/hooks/useReferenceAudio';
import { useT } from '@/i18n';
import type { ModelAnswerGroup } from '@/api/client';

export function ModelAnswerHero({ group, onPractise }: {
  group: ModelAnswerGroup;
  /** Opens the pronunciation screen on the model sentence. */
  onPractise: (model: string) => void;
}) {
  const t = useT();
  const card = group.cards?.[0];
  const { play, busy } = useReferenceAudio(card?.model ?? '');
  // No cards means nothing to work through — the row in the list still says how many
  // corrections the scenario has, and a hero with an empty body is worse than none.
  if (!card) return null;

  return (
    <NbPaper rot={-0.5} tape tapeLeft={100} style={styles.card}>
      <View style={styles.head}>
        <NbTag color={nb.green} fill rot={-2}>{t('model.recent')}</NbTag>
        <Text numberOfLines={1} style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>
          {group.title || group.scenarioId}
        </Text>
        <Text numberOfLines={1} style={nbText.body(10.5, nb.soft)}>
          {t('model.corrections', { n: group.corrections })}
        </Text>
      </View>

      {/* What was said, struck through in the correction pen. */}
      <Text style={styles.said}>{card.said}</Text>

      <View style={styles.modelLine}>
        {/* The red pen's arrow, drawn as an icon: a typographic → renders at whatever
            weight the font decides next to 1.7px line work (theme/glyphs.test.ts). */}
        <View style={styles.arrow}><NbIcon name="chevronRight" size={15} color={nb.red} /></View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <NbMark textStyle={styles.model}>{card.model}</NbMark>
        </View>
      </View>

      {!!card.note?.trim() && (
        <View style={styles.whyBox}>
          <Text numberOfLines={1} style={styles.whyLabel}>{t('model.why')}</Text>
          <Text style={[nbText.hand(14), { marginTop: 1 }]}>{card.note}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={play} disabled={busy} style={[styles.action, busy && styles.actionBusy]}>
          <NbIcon name="speaker" size={14} />
          <Text numberOfLines={1} style={nbText.hand(14)}>{t('model.listenAll')}</Text>
        </Pressable>
        <Pressable onPress={() => onPractise(card.model)} style={[styles.action, styles.actionYellow]}>
          <NbIcon name="mic" size={14} />
          <Text numberOfLines={1} style={nbText.hand(14)}>{t('model.repeatAfter')}</Text>
        </Pressable>
      </View>
    </NbPaper>
  );
}

const styles = StyleSheet.create({
  card: { paddingTop: 15, paddingBottom: 13, paddingHorizontal: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  said: {
    marginTop: 9, fontFamily: nbFonts.body, fontSize: 13, color: nb.soft, lineHeight: 19,
    textDecorationLine: 'line-through', textDecorationColor: nb.red,
  },
  modelLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 6 },
  arrow: { flexShrink: 0, paddingTop: 2, transform: [{ rotate: '-4deg' }] },
  model: { fontFamily: nbFonts.bodyBold, fontSize: 13.5, color: nb.ink, lineHeight: 20 },
  whyBox: {
    marginTop: 9, paddingVertical: 6, paddingHorizontal: 9,
    borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue,
    backgroundColor: 'rgba(74,111,165,.07)',
  },
  whyLabel: { fontFamily: nbFonts.bodyBold, fontSize: 9.5, color: nb.blue, letterSpacing: 1 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 11 },
  action: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderWidth: 1.6, borderColor: nb.ink, borderRadius: 3, paddingVertical: 7,
  },
  actionYellow: { backgroundColor: 'rgba(249,227,123,.4)' },
  actionBusy: { opacity: 0.55 },
});
