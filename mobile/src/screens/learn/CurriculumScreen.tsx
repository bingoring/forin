import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { curriculumApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';

export function CurriculumScreen({ navigation }: any) {
  const { data: curriculum, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const { data } = await curriculumApi.getCurriculum();
      return data.data;
    },
  });

  if (isLoading) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Curriculum</Text>

      {curriculum?.modules.map((mod) => (
        <View key={mod.id} style={styles.moduleCard}>
          <Text style={styles.moduleTitle}>{mod.title}</Text>
          {mod.description && <Text style={styles.moduleDesc}>{mod.description}</Text>}
          {mod.progress && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${mod.progress.completion_percentage}%` }]} />
            </View>
          )}

          {mod.units.map((unit) => (
            <View key={unit.id} style={styles.unitSection}>
              <Text style={styles.unitTitle}>{unit.title}</Text>
              {unit.stages.map((stage) => {
                const completed = stage.progress?.status === 'completed';
                const stars = stage.progress?.stars || 0;
                return (
                  <TouchableOpacity
                    key={stage.id}
                    style={[styles.stageRow, completed && styles.stageRowCompleted]}
                    onPress={() => navigation.navigate('HomeTab', {
                      screen: 'StageIntro',
                      params: { stageId: stage.id },
                    })}
                  >
                    <View style={styles.stageInfo}>
                      <Text style={styles.stageName}>{stage.title}</Text>
                      <Text style={styles.stageDifficulty}>
                        {'★'.repeat(stage.difficulty_level)}{'☆'.repeat(5 - stage.difficulty_level)}
                      </Text>
                    </View>
                    <Text style={styles.stageStars}>
                      {completed ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '🔒'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      ))}

      {(!curriculum?.modules || curriculum.modules.length === 0) && (
        <Text style={styles.emptyText}>Complete onboarding to see your curriculum</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  moduleCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moduleTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  moduleDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: spacing.md },
  progressFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  unitSection: { marginTop: spacing.sm },
  unitTitle: { ...typography.bodyBold, color: colors.textSecondary, marginBottom: spacing.xs },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: 2,
  },
  stageRowCompleted: { backgroundColor: '#F0FDF4' },
  stageInfo: { flex: 1 },
  stageName: { ...typography.body, color: colors.textPrimary },
  stageDifficulty: { ...typography.small, color: colors.textMuted },
  stageStars: { fontSize: 16, color: colors.starFilled },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
