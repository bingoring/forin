import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Button } from '../../components/common';

export function NotificationSettingsScreen() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notification-prefs'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/notification-preferences');
      return data.data;
    },
  });

  const [local, setLocal] = useState<any>(null);
  const current = local || prefs;

  const toggle = (key: string) => {
    setLocal({ ...current, [key]: !current[key] });
  };

  const handleSave = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await api.put('/users/me/notification-preferences', local);
      queryClient.invalidateQueries({ queryKey: ['notification-prefs'] });
      Alert.alert('Saved', 'Notification preferences updated.');
      setLocal(null);
    } catch {
      Alert.alert('Error', 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !current) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.card}>
        <SettingRow
          label="Daily Reminder"
          desc="Get reminded to study each day"
          value={current.daily_reminder_enabled}
          onToggle={() => toggle('daily_reminder_enabled')}
        />
        <SettingRow
          label="Streak Warning"
          desc="Alert when your streak is at risk"
          value={current.streak_warning_enabled}
          onToggle={() => toggle('streak_warning_enabled')}
        />
        <SettingRow
          label="Achievements"
          desc="Notify when you unlock achievements"
          value={current.achievement_enabled}
          onToggle={() => toggle('achievement_enabled')}
        />
        <SettingRow
          label="New Content"
          desc="Alert when new stages are available"
          value={current.new_content_enabled}
          onToggle={() => toggle('new_content_enabled')}
        />
        <SettingRow
          label="Lives Restored"
          desc="Notify when hearts are fully charged"
          value={current.lives_restored_enabled}
          onToggle={() => toggle('lives_restored_enabled')}
        />
        <SettingRow
          label="Weekly Summary"
          desc="Receive a weekly learning report"
          value={current.weekly_summary_enabled}
          onToggle={() => toggle('weekly_summary_enabled')}
        />
      </View>

      {local && (
        <Button title="Save Changes" onPress={handleSave} loading={saving} />
      )}
    </ScrollView>
  );
}

function SettingRow({
  label, desc, value, onToggle,
}: {
  label: string; desc: string; value: boolean; onToggle: () => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: { flex: 1, marginRight: spacing.md },
  settingLabel: { ...typography.bodyBold, color: colors.textPrimary },
  settingDesc: { ...typography.small, color: colors.textMuted, marginTop: 2 },
});
