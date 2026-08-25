// One scenario in the 모범답안 surfaces: its title, correction count, and — when
// expanded — its cards.
//
// `title` falls back to the scenario id: a card whose scenario left the served
// content set still belongs to the player, and a blank row would look like a bug.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PixelIcon } from '@/components/PixelIcon';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { ModelAnswerCardRow } from './ModelAnswerCardRow';
import { useT } from '@/i18n';
import type { ModelAnswerGroup } from '@/api/client';

export function ModelAnswerGroupRow({
  group,
  open,
  onToggle,
  divider = true,
}: {
  group: ModelAnswerGroup;
  open: boolean;
  /** Omitted where the row cannot be collapsed (the block's expanded panel). */
  onToggle?: () => void;
  divider?: boolean;
}) {
  const t = useT();
  const cards = group.cards ?? [];
  return (
    <View style={divider ? styles.divider : undefined}>
      <Pressable onPress={onToggle} disabled={!onToggle} style={styles.header}>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>{group.title || group.scenarioId}</Text>
          <View style={styles.meta}>
            <PixelIcon name="note" color={colors.textSoft} size={10} sw={1.6} />
            <Text style={styles.count}>{t('model.corrections', { n: group.corrections })}</Text>
          </View>
        </View>
        {onToggle && <DisclosureChevron open={open} color={colors.ink} />}
      </Pressable>

      {/* Children stay mounted and clipped (the shared Collapsible), so opening a
          row does not refetch or re-lay-out its cards. */}
      <Collapsible open={open}>
        {cards.map((c, i) => (
          <ModelAnswerCardRow key={`${c.said}-${i}`} card={c} divider={i < cards.length - 1} />
        ))}
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { borderBottomWidth: 2, borderStyle: 'dotted', borderBottomColor: colors.ink + '33' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  body: { flex: 1 },
  title: { fontFamily: fonts.heading, fontSize: fs(11.5), color: colors.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  count: { fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft },
});
