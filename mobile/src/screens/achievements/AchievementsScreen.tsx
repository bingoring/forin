import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '../../api';
import {
  Card,
  Hatto,
  Icon,
  ListRow,
  SectionHeader,
  SpeechBubble,
  Tabs,
} from '../../ui';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';

type Filter = 'all' | 'unlocked' | 'locked';

export function AchievementsScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data } = await gamificationApi.getAchievements();
      return data.data.achievements;
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'unlocked') return data.filter((a: any) => a.is_unlocked);
    if (filter === 'locked') return data.filter((a: any) => !a.is_unlocked);
    return data;
  }, [data, filter]);

  const unlockedCount = data?.filter((a: any) => a.is_unlocked).length ?? 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="face" size={80} />
          <SpeechBubble tone="sky" style={styles.bubble}>
            {t('achievements.hatto', {
              count: unlockedCount,
              total: data?.length ?? 0,
            })}
          </SpeechBubble>
        </View>

        <SectionHeader title={t('achievements.title')} />

        <Tabs<Filter>
          items={[
            { value: 'all',       label: t('achievements.tabs.all') },
            { value: 'unlocked',  label: t('achievements.tabs.done') },
            { value: 'locked',    label: t('achievements.tabs.locked') },
          ]}
          value={filter}
          onChange={setFilter}
        />

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator color={color.primary} />
          </View>
        )}

        {!isLoading && filtered.length === 0 && (
          <Card variant="cream">
            <Text style={[text.body, styles.emptyText]}>
              {t('achievements.empty')}
            </Text>
          </Card>
        )}

        {filtered.length > 0 && (
          <Card variant="paper" padding={0} style={styles.list}>
            {filtered.map((a: any, idx: number) => (
              <ListRow
                key={a.id}
                leading={
                  <Icon
                    name={a.is_unlocked ? 'trophy' : 'lock'}
                    size={24}
                    color={a.is_unlocked ? color.xp : color.inkFaint}
                  />
                }
                title={a.name}
                subtitle={
                  a.is_unlocked && a.unlocked_at
                    ? t('achievements.unlockedAt', {
                        date: new Date(a.unlocked_at).toLocaleDateString(),
                      })
                    : a.description
                }
                last={idx === filtered.length - 1}
              />
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: { padding: sp.s5, gap: sp.s4, paddingBottom: sp.s8 },
  hero: { alignItems: 'center', gap: sp.s3 },
  bubble: { maxWidth: 280 },
  loading: { paddingVertical: sp.s6, alignItems: 'center' },
  list: { overflow: 'hidden' },
  emptyText: { color: color.inkSoft, textAlign: 'center' },
});
