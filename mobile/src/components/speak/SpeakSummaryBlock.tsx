// Review Lab's 🎙 직접 말하기 연습 block (04_SCREENS ⑨). Deliberately
// summary-only: the handoff bounds this block because the underlying list passes
// 100 items, so it shows the score-band distribution plus 가장 급한 2문장 and
// hands everything else to ScreenSpeakList.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PixelIcon } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { Shadowed } from '@/components/campus/parts';
import { BandBar } from './BandBar';
import { SpokenRow } from './SpokenRow';
import { useT } from '@/i18n';
import type { SpeakSummary, SpokenSentence } from '@/api/client';

export function SpeakSummaryBlock({
  summary,
  onOpenAll,
  onPractise,
}: {
  summary: SpeakSummary;
  /** 전체 N › — opens ScreenSpeakList. */
  onOpenAll: (sort: 'weak' | 'recent') => void;
  onPractise: (s: SpokenSentence) => void;
}) {
  const t = useT();
  return (
    <Shadowed offset={4}>
      <View style={styles.card}>
        <View style={styles.header}>
          <FIcon name="mic" size={13} />
          <Text style={styles.title}>{t('speak.blockTitle')}</Text>
          <View style={styles.spacer} />
          {/* 전체 N › — the entry the handoff specifies for this block. */}
          <Pressable onPress={() => onOpenAll('recent')} hitSlop={8} style={styles.allLink}>
            <Text style={styles.allText}>{t('speak.seeAll', { n: summary.total })}</Text>
            <PixelIcon name="chevron-right" color={colors.ink} size={10} sw={2} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <BandBar counts={summary} />
        </View>

        {summary.weakest.length > 0 && (
          <>
            <View style={styles.urgentHeader}>
              <FIcon name="target" size={11} />
              <Text style={styles.urgentText}>{t('speak.urgent', { n: summary.weakest.length })}</Text>
            </View>
            {summary.weakest.map((s, i) => (
              <SpokenRow key={s.sentenceKey} sentence={s} onPractise={onPractise} divider={i < summary.weakest.length - 1} />
            ))}
            <Pressable onPress={() => onOpenAll('weak')} style={styles.weakEntry}>
              <FIcon name="target" size={11} />
              <Text style={styles.weakEntryText}>{t('speak.weakestFirst', { n: summary.low + summary.mid })}</Text>
              <PixelIcon name="chevron-right" color={colors.ink} size={10} sw={2} />
            </Pressable>
          </>
        )}
      </View>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderWidth: 3, borderColor: colors.ink },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: { fontFamily: fonts.heading, fontSize: fs(12), color: colors.ink },
  spacer: { flex: 1 },
  allLink: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  allText: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft },
  body: { paddingHorizontal: 12, paddingBottom: 10 },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderTopColor: colors.ink + '33',
  },
  urgentText: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.ink },
  weakEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderTopColor: colors.ink + '33',
    backgroundColor: colors.cream,
  },
  weakEntryText: { flex: 1, fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.ink },
});
