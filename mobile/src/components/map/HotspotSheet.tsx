import React, { useMemo, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Icon, type HeroIconName } from '../common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { CurriculumUnit, StageOverview } from '../../types/api';

interface Props {
  unit: CurriculumUnit | null;
  onStagePress: (stage: StageOverview) => void;
}

export const HotspotSheet = forwardRef<BottomSheetModal, Props>(({ unit, onStagePress }, ref) => {
  const snapPoints = useMemo(() => ['55%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  if (!unit) {
    return (
      <BottomSheetModal ref={ref} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
        <View />
      </BottomSheetModal>
    );
  }

  const label =
    unit.hotspot_label_override ??
    t(`map.locations.${unit.location_type}`) ??
    t('map.locations.generic');

  const iconName = (unit.location_type as HeroIconName) ?? 'pin';

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Icon name={iconName} size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{label}</Text>
            {unit.description ? <Text style={styles.description}>{unit.description}</Text> : null}
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('map.hotspot.stagesLabel')}</Text>
        <FlatList
          data={unit.stages}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <StageRow stage={item} onPress={onStagePress} />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      </View>
    </BottomSheetModal>
  );
});

function StageRow({ stage, onPress }: { stage: StageOverview; onPress: (s: StageOverview) => void }) {
  const completed = stage.progress?.status === 'completed';
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(stage)} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={styles.stageTitle}>{stage.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{t('map.hotspot.difficulty', { level: stage.difficulty_level })}</Text>
          <Text style={styles.meta}>· {t('map.hotspot.heartCost')}</Text>
        </View>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>{completed ? '✓' : t('map.stageStart')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.md },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { ...typography.h2, color: colors.textPrimary },
  description: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  sectionLabel: { ...typography.small, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stageTitle: { ...typography.bodyBold, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: spacing.xs, marginTop: 2 },
  meta: { ...typography.caption, color: colors.textSecondary },
  cta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accent,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});

HotspotSheet.displayName = 'HotspotSheet';
