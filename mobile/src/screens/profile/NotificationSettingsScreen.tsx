import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Button, Card, ListRow, SectionHeader, Toggle } from '../../ui';
import { color, sp } from '../../theme';
import { t } from '../../locales';

type Prefs = {
  daily_reminder_enabled: boolean;
  streak_warning_enabled: boolean;
  achievement_enabled: boolean;
  new_content_enabled: boolean;
  lives_restored_enabled: boolean;
  weekly_summary_enabled: boolean;
};

type PrefKey = keyof Prefs;

export function NotificationSettingsScreen() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notification-prefs'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Prefs }>(
        '/users/me/notification-preferences',
      );
      return data.data;
    },
  });

  const [local, setLocal] = useState<Prefs | null>(null);
  const current = local || prefs;

  const toggle = (key: PrefKey) => {
    if (!current) return;
    setLocal({ ...current, [key]: !current[key] });
  };

  const handleSave = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await api.put('/users/me/notification-preferences', local);
      queryClient.invalidateQueries({ queryKey: ['notification-prefs'] });
      Alert.alert(t('common.save'), t('profile.notifications.saved'));
      setLocal(null);
    } catch {
      Alert.alert(t('common.error'), t('profile.notifications.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !current) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  const items: Array<{ key: PrefKey; label: string; desc: string }> = [
    {
      key: 'daily_reminder_enabled',
      label: t('profile.notifications.daily.label'),
      desc: t('profile.notifications.daily.desc'),
    },
    {
      key: 'streak_warning_enabled',
      label: t('profile.notifications.streak.label'),
      desc: t('profile.notifications.streak.desc'),
    },
    {
      key: 'achievement_enabled',
      label: t('profile.notifications.achievement.label'),
      desc: t('profile.notifications.achievement.desc'),
    },
    {
      key: 'new_content_enabled',
      label: t('profile.notifications.newContent.label'),
      desc: t('profile.notifications.newContent.desc'),
    },
    {
      key: 'lives_restored_enabled',
      label: t('profile.notifications.lives.label'),
      desc: t('profile.notifications.lives.desc'),
    },
    {
      key: 'weekly_summary_enabled',
      label: t('profile.notifications.weekly.label'),
      desc: t('profile.notifications.weekly.desc'),
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          eyebrow={t('profile.notifications.eyebrow')}
          title={t('profile.notifications.title')}
        />

        <Card variant="paper" padding={0} style={styles.list}>
          {items.map((item, idx) => (
            <ListRow
              key={item.key}
              title={item.label}
              subtitle={item.desc}
              trailing={
                <Toggle
                  value={current[item.key]}
                  onChange={() => toggle(item.key)}
                />
              }
              last={idx === items.length - 1}
            />
          ))}
        </Card>

        {local && (
          <Button full size="lg" onPress={handleSave} loading={saving}>
            {t('profile.notifications.save')}
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.cream,
  },
  content: { padding: sp.s5, gap: sp.s4, paddingBottom: sp.s8 },
  list: { overflow: 'hidden' },
});
