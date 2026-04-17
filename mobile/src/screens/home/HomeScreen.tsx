import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { userApi, curriculumApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export function HomeScreen({ navigation }: Props) {
  const logout = useAuthStore((s) => s.logout);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data.data;
    },
  });

  const { data: curriculum } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const { data } = await curriculumApi.getCurriculum();
      return data.data;
    },
    enabled: !!profile?.profession,
  });

  if (isLoading || !profile) {
    return (
      <View style={styles.loading}>
        <Text style={typography.body}>Loading...</Text>
      </View>
    );
  }

  // Find next available stage
  let nextStage: { id: string; title: string; unitTitle: string } | null = null;
  if (curriculum?.modules) {
    for (const mod of curriculum.modules) {
      for (const unit of mod.units) {
        for (const stage of unit.stages) {
          if (!stage.progress || stage.progress.status !== 'completed') {
            nextStage = { id: stage.id, title: stage.title, unitTitle: unit.title };
            break;
          }
        }
        if (nextStage) break;
      }
      if (nextStage) break;
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {profile.display_name}</Text>
          <Text style={styles.levelTitle}>
            Lv.{profile.current_level} {profile.level_title}
          </Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBadge icon="♥" value={`${profile.lives.current}/${profile.lives.max}`} color={colors.heart} />
        <StatBadge icon="🔥" value={`${profile.streak.current_streak}`} color={colors.streak} />
        <StatBadge icon="⭐" value={`${profile.current_xp} XP`} color={colors.xp} />
      </View>

      {/* Daily Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Goal</Text>
        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarInner,
              {
                width: `${Math.min(100, (profile.daily_progress.xp_today / profile.daily_progress.xp_target) * 100)}%`,
                backgroundColor: profile.daily_progress.goal_met ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {profile.daily_progress.xp_today} / {profile.daily_progress.xp_target} XP
          {profile.daily_progress.goal_met ? ' ✓' : ''}
        </Text>
      </View>

      {/* Next Stage Card */}
      {nextStage ? (
        <TouchableOpacity
          style={styles.nextStageCard}
          onPress={() => navigation.navigate('StageIntro', { stageId: nextStage!.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.nextStageLabel}>Continue Learning</Text>
          <Text style={styles.nextStageTitle}>{nextStage.title}</Text>
          <Text style={styles.nextStageUnit}>{nextStage.unitTitle}</Text>
        </TouchableOpacity>
      ) : !profile.profession ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome!</Text>
          <Text style={styles.cardBody}>
            Complete the onboarding to start your learning journey.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All done!</Text>
          <Text style={styles.cardBody}>You have completed all available stages.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatBadge({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <View style={[styles.statBadge, { borderColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: { ...typography.h2, color: colors.textPrimary },
  levelTitle: { ...typography.caption, color: colors.xp },
  logoutText: { ...typography.caption, color: colors.textMuted },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  statIcon: { fontSize: 18 },
  statValue: { ...typography.bodyBold },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  cardBody: { ...typography.body, color: colors.textSecondary },
  progressBarOuter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  progressBarInner: { height: 8, borderRadius: 4 },
  progressText: { ...typography.caption, color: colors.textSecondary },
  nextStageCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  nextStageLabel: { ...typography.small, color: colors.primaryLight, marginBottom: spacing.xs },
  nextStageTitle: { ...typography.h2, color: colors.white },
  nextStageUnit: { ...typography.caption, color: colors.primaryLight, marginTop: spacing.xs },
});
