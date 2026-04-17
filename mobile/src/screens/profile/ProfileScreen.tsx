import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { userApi, gamificationApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';

export function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data.data;
    },
  });

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data } = await gamificationApi.getInventory();
      return data.data;
    },
  });

  if (!profile) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.header}>
        <Text style={styles.catEmoji}>🐱</Text>
        <Text style={styles.catName}>{profile.cat_name}</Text>
        <Text style={styles.displayName}>{profile.display_name}</Text>
        <Text style={styles.levelBadge}>
          Lv.{profile.current_level} {profile.level_title}
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Total XP" value={`${profile.total_xp}`} color={colors.xp} />
        <StatCard label="Streak" value={`${profile.streak.current_streak}d`} color={colors.streak} />
        <StatCard label="Gems" value={`${profile.gems}`} color={colors.gem} />
        <StatCard label="Catnip" value={`${profile.catnip}`} color={colors.catnip} />
      </View>

      {/* XP Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Level Progress</Text>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, {
            width: `${profile.xp_to_next_level > 0
              ? Math.min(100, (1 - profile.xp_to_next_level / (profile.xp_to_next_level + profile.current_xp)) * 100)
              : 100}%`,
          }]} />
        </View>
        <Text style={styles.xpText}>{profile.xp_to_next_level} XP to next level</Text>
      </View>

      {/* Inventory summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inventory</Text>
        <Text style={styles.cardBody}>
          {inventory?.total_items || 0} items collected
        </Text>
      </View>

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        <SettingsRow label="Daily Goal" value={profile.daily_goal} />
        <SettingsRow label="Timezone" value={profile.timezone} />
        {profile.profession && <SettingsRow label="Profession" value={profile.profession.name} />}
        {profile.target_country && <SettingsRow label="Country" value={profile.target_country} />}
      </View>

      <Button title="Log Out" onPress={logout} variant="outline" style={styles.logoutBtn} />
    </ScrollView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingsRow}>
      <Text style={styles.settingsLabel}>{label}</Text>
      <Text style={styles.settingsValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.lg, paddingTop: spacing.lg },
  catEmoji: { fontSize: 64, marginBottom: spacing.xs },
  catName: { ...typography.h3, color: colors.textPrimary },
  displayName: { ...typography.body, color: colors.textSecondary },
  levelBadge: { ...typography.caption, color: colors.xp, marginTop: spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { ...typography.h2 },
  statLabel: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  cardBody: { ...typography.body, color: colors.textSecondary },
  xpBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, marginBottom: spacing.xs },
  xpFill: { height: 8, backgroundColor: colors.xp, borderRadius: 4 },
  xpText: { ...typography.small, color: colors.textMuted },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsLabel: { ...typography.body, color: colors.textSecondary },
  settingsValue: { ...typography.bodyBold, color: colors.textPrimary },
  logoutBtn: { marginTop: spacing.md, marginBottom: spacing.xxl },
});
