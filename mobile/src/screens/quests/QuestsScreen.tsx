import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { QuestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<QuestsStackParamList, 'QuestsMain'>;

export function QuestsScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const { data } = await curriculumApi.getCurriculum();
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const modules = data?.modules ?? [];
  const allStages = modules.flatMap((m) =>
    m.units.flatMap((u) => u.stages.map((s) => ({ module: m, unit: u, stage: s }))),
  );
  const inProgress = allStages.filter((x) => x.stage.progress?.status !== 'completed');
  const recommended = inProgress.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('quests.title')}</Text>

      {recommended.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('quests.allClear')}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionLabel}>{t('quests.recommended')}</Text>
          {recommended.map(({ module, unit, stage }) => (
            <TouchableOpacity
              key={stage.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('StageIntro', { stageId: stage.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                <Text style={styles.meta}>
                  {module.floor_label} · {unit.title}
                </Text>
              </View>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>{t('quests.cta')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  sectionLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageTitle: { ...typography.bodyBold, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  cta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accent,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
