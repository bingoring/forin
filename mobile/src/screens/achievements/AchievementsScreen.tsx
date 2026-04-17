import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';

export function AchievementsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data } = await gamificationApi.getAchievements();
      return data.data.achievements;
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Achievements</Text>

      {isLoading && <Text>Loading...</Text>}

      {data?.map((a: any) => (
        <View key={a.id} style={[styles.card, a.is_unlocked && styles.cardUnlocked]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{a.is_unlocked ? '🏆' : '🔒'}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, !a.is_unlocked && styles.nameLocked]}>{a.name}</Text>
            <Text style={styles.description}>{a.description}</Text>
            {a.is_unlocked && a.unlocked_at && (
              <Text style={styles.date}>
                Unlocked {new Date(a.unlocked_at).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      ))}

      {data?.length === 0 && (
        <Text style={styles.emptyText}>Complete stages to unlock achievements</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.6,
  },
  cardUnlocked: { opacity: 1, borderColor: colors.accent },
  iconContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 28 },
  info: { flex: 1, marginLeft: spacing.sm },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  nameLocked: { color: colors.textMuted },
  description: { ...typography.caption, color: colors.textSecondary },
  date: { ...typography.small, color: colors.success, marginTop: 2 },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
