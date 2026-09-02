// One scenario in the 모범답안 surfaces: its title, correction count, and — when
// expanded — its cards.
//
// `title` falls back to the scenario id: a card whose scenario left the served content set
// still belongs to the learner, and a blank row would look like a bug.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { Collapsible } from '@/components/Collapsible';
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
          <Text style={nbText.hand(17)} numberOfLines={1}>{group.title || group.scenarioId}</Text>
          <View style={styles.meta}>
            <NbIcon name="pencil" size={12} color={nb.soft} />
            <Text numberOfLines={1} style={styles.count}>{t('model.corrections', { n: group.corrections })}</Text>
          </View>
        </View>
        {onToggle && <NbIcon name={open ? 'chevronUp' : 'chevronDown'} size={14} />}
      </Pressable>

      {/* Children stay mounted and clipped (the shared Collapsible), so opening a row
          does not refetch or re-lay-out its cards. */}
      <Collapsible open={open}>
        {cards.map((c, i) => (
          <ModelAnswerCardRow key={`${c.said}-${i}`} card={c} divider={i < cards.length - 1} />
        ))}
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { borderBottomWidth: 1.5, borderStyle: 'dashed', borderBottomColor: 'rgba(62,54,43,.2)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11 },
  body: { flex: 1, minWidth: 0 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  count: { fontFamily: nbFonts.mono, fontSize: 9.5, color: nb.soft },
});
