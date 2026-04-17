import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi, learningApi } from '../../api';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'StageIntro'>;

export function StageIntroScreen({ route, navigation }: Props) {
  const { stageId } = route.params;

  const { data: stage, isLoading } = useQuery({
    queryKey: ['stage', stageId],
    queryFn: async () => {
      const { data } = await curriculumApi.getStageDetail(stageId);
      return data.data;
    },
  });

  const handleStart = async () => {
    try {
      const { data } = await learningApi.startStage(stageId);
      const attempt = data.data;
      navigation.replace('Exercise', {
        stageId,
        attemptId: attempt.attempt_id,
      });
    } catch (err: any) {
      const code = err?.response?.data?.error?.code;
      if (code === 'NO_LIVES') {
        alert('No lives remaining. Wait for refill.');
      }
    }
  };

  if (isLoading || !stage) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{stage.title}</Text>
        <Text style={styles.scenario}>{stage.scenario_description}</Text>

        <View style={styles.infoRow}>
          <InfoChip label="Exercises" value={`${stage.exercises.length}`} />
          <InfoChip label="Difficulty" value={`${'★'.repeat(stage.difficulty_level)}${'☆'.repeat(5 - stage.difficulty_level)}`} />
          <InfoChip label="XP" value={`${stage.xp_base}`} />
        </View>

        {stage.progress && stage.progress.status === 'completed' && (
          <View style={styles.prevResult}>
            <Text style={styles.prevResultText}>
              Best: {'★'.repeat(stage.progress.stars)}{'☆'.repeat(3 - stage.progress.stars)} ({stage.progress.attempts} attempts)
            </Text>
          </View>
        )}
      </View>

      <Button title="Start Stage" onPress={handleStart} style={styles.startBtn} />
    </View>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  scenario: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipLabel: { ...typography.small, color: colors.textMuted },
  chipValue: { ...typography.bodyBold, color: colors.textPrimary, marginTop: 2 },
  prevResult: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  prevResultText: { ...typography.caption, color: colors.textPrimary, textAlign: 'center' },
  startBtn: { marginBottom: spacing.lg },
});
