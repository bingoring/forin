// One scenario in the 모범답안 surfaces: its department doodle, title, and the
// shift's shape at a glance — "오늘 · 3단계 · 모범 일치 2/3" — with an 개선 tag when
// not every turn matched the model (design-handoff v40 · 리뷰랩 C · 모범답안).
//
// `title` falls back to the scenario id: a card whose scenario left the served content set
// still belongs to the learner, and a blank row would look like a bug.
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { Collapsible } from '@/components/Collapsible';
import { deptNbIcon } from '@/data/campus';
import { ModelAnswerCardRow } from './ModelAnswerCardRow';
import { useT } from '@/i18n';
import type { ModelAnswerGroup } from '@/api/client';

/** How many whole days ago `iso` was, in the caller's timezone. Never negative. */
function daysAgo(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  const d = Math.floor((Date.now() - then) / 86_400_000);
  return d < 0 ? 0 : d;
}

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
  // 모범 일치: the turns that needed no correction. Corrections can outrun the
  // stored step count when a scenario was replayed and the earlier session's turns
  // aged out, so clamp at zero rather than showing a negative match.
  const matched = Math.max(0, group.steps - group.corrections);
  const when = useMemo(() => {
    const d = daysAgo(group.lastAt);
    if (d <= 0) return t('model.today');
    if (d === 1) return t('model.yesterday');
    return t('model.daysAgo', { n: d });
  }, [t, group.lastAt]);
  const meta = `${when} · ${t('model.steps', { n: group.steps })} · ${t('model.matched', { ok: matched, st: group.steps })}`;

  return (
    <View style={divider ? styles.divider : undefined}>
      <Pressable onPress={onToggle} disabled={!onToggle} style={styles.header}>
        <NbIcon name={deptNbIcon(group.scenarioId)} size={22} />
        <View style={styles.body}>
          <Text style={nbText.hand(16)} numberOfLines={1}>{group.title || group.scenarioId}</Text>
          <Text numberOfLines={1} style={styles.meta}>{meta}</Text>
        </View>
        {/* 개선 tag when at least one turn was corrected — the scenario is worth another pass. */}
        {matched < group.steps && (
          <View style={styles.improve}>
            <Text style={styles.improveText}>{t('model.improve')}</Text>
          </View>
        )}
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  body: { flex: 1, minWidth: 0 },
  meta: { fontFamily: nbFonts.mono, fontSize: 10, color: nb.soft, marginTop: 2 },
  improve: {
    borderWidth: 1.4, borderColor: '#C77E2E', borderRadius: 2, paddingHorizontal: 5, paddingVertical: 1,
    transform: [{ rotate: '-2deg' }],
  },
  improveText: { fontFamily: nbFonts.hand, fontSize: 12, color: '#C77E2E' },
});
