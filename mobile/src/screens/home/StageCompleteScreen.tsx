import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useQueryClient } from '@tanstack/react-query';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'StageComplete'>;

export function StageCompleteScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const queryClient = useQueryClient();

  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Stage Complete!</Text>

      {/* Stars */}
      <Text style={styles.stars}>
        {'★'.repeat(result.stars_earned)}
        {'☆'.repeat(3 - result.stars_earned)}
      </Text>

      {/* Stats */}
      <View style={styles.statsCard}>
        <StatRow label="XP Earned" value={`+${result.xp_earned}`} color={colors.xp} />
        <StatRow label="Mistakes" value={`${result.mistakes_count}`} color={result.mistakes_count === 0 ? colors.success : colors.error} />
        <StatRow label="Duration" value={`${Math.floor(result.duration_seconds / 60)}m ${result.duration_seconds % 60}s`} color={colors.textSecondary} />
      </View>

      {/* Level Up */}
      {result.level_up && (
        <View style={styles.levelUpCard}>
          <Text style={styles.levelUpTitle}>Level Up!</Text>
          <Text style={styles.levelUpText}>
            Lv.{result.level_up.previous_level} → Lv.{result.level_up.new_level}
          </Text>
          <Text style={styles.levelUpNewTitle}>{result.level_up.new_title}</Text>
        </View>
      )}

      {/* Streak */}
      {result.streak_update?.was_extended && (
        <Text style={styles.streakText}>
          🔥 {result.streak_update.current_streak} day streak!
          {result.streak_update.milestone_hit
            ? ` ${result.streak_update.milestone_hit}-day milestone!`
            : ''}
        </Text>
      )}

      {/* Achievements */}
      {result.achievements.length > 0 && (
        <View style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
          {result.achievements.map((a) => (
            <Text key={a.id} style={styles.achievementName}>🏆 {a.name}</Text>
          ))}
        </View>
      )}

      {/* Gift Box */}
      {result.gift_box && (
        <Text style={styles.giftBoxText}>🎁 You earned a {result.gift_box.box_type} gift box!</Text>
      )}

      <Button title="Continue" onPress={handleContinue} style={styles.btn} />
    </View>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  stars: { fontSize: 40, color: colors.starFilled, marginBottom: spacing.lg },
  statsCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  statLabel: { ...typography.body, color: colors.textSecondary },
  statValue: { ...typography.bodyBold },
  levelUpCard: {
    width: '100%',
    backgroundColor: colors.xp,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  levelUpTitle: { ...typography.h3, color: colors.white },
  levelUpText: { ...typography.body, color: colors.white },
  levelUpNewTitle: { ...typography.h2, color: colors.white },
  streakText: { ...typography.bodyBold, color: colors.streak, marginBottom: spacing.md },
  achievementCard: {
    width: '100%',
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  achievementTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  achievementName: { ...typography.body, color: colors.textPrimary },
  giftBoxText: { ...typography.bodyBold, color: colors.primary, marginBottom: spacing.lg },
  btn: { width: '100%' },
});
