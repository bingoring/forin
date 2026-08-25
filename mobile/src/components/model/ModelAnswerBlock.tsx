// Review Lab's 📄 시나리오 모범답안 block (04_SCREENS ⑨). Summary-only by design:
// the completed-scenario count, the most recent scenario expanded, three
// collapsed rows, and "+ N개 더" handing the rest to ScreenModelAnswerList.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PixelIcon } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { Shadowed } from '@/components/campus/parts';
import { ModelAnswerGroupRow } from './ModelAnswerGroupRow';
import { useT } from '@/i18n';
import type { ModelAnswerSummary } from '@/api/client';

export function ModelAnswerBlock({
  summary,
  onOpenAll,
}: {
  summary: ModelAnswerSummary;
  onOpenAll: () => void;
}) {
  const t = useT();
  const [first, ...collapsed] = summary.groups;
  return (
    <Shadowed offset={4}>
      <View style={styles.card}>
        <View style={styles.header}>
          <FIcon name="doc" size={13} />
          <Text style={styles.title}>{t('model.blockTitle')}</Text>
          <View style={styles.spacer} />
          <Pressable onPress={onOpenAll} hitSlop={8} style={styles.allLink}>
            <Text style={styles.allText}>{t('model.seeAll')}</Text>
            <PixelIcon name="chevron-right" color={colors.ink} size={10} sw={2} />
          </Pressable>
        </View>

        <Text style={styles.count}>{t('model.scenarioCount', { n: summary.total })}</Text>

        {/* The most recent scenario, always open: the block's whole job is to put
            one worked example in front of the player without a tap. It carries no
            toggle, so it cannot be collapsed into an empty-looking block. */}
        {first && <ModelAnswerGroupRow group={first} open divider={collapsed.length > 0} />}

        {collapsed.map((g, i) => (
          <ModelAnswerGroupRow key={g.scenarioId} group={g} open={false} divider={i < collapsed.length - 1} />
        ))}

        {/* Omitted at 0 rather than rendering "+ 0개 더". */}
        {summary.more > 0 && (
          <Pressable onPress={onOpenAll} style={styles.moreRow}>
            <Text style={styles.moreText}>{t('model.more', { n: summary.more })}</Text>
            <PixelIcon name="chevron-right" color={colors.ink} size={10} sw={2} />
          </Pressable>
        )}
      </View>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderWidth: 3, borderColor: colors.ink },
  header: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingTop: 10 },
  title: { fontFamily: fonts.heading, fontSize: fs(12), color: colors.ink },
  spacer: { flex: 1 },
  allLink: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  allText: { fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft },
  count: {
    fontFamily: fonts.body,
    fontSize: fs(9.5),
    color: colors.textSoft,
    paddingHorizontal: 12,
    paddingTop: 3,
    paddingBottom: 8,
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderTopColor: colors.ink + '33',
    backgroundColor: colors.cream,
  },
  moreText: { fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.ink },
});
