import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { userApi, gamificationApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import {
  Badge,
  Button,
  Card,
  CoinChip,
  Hatto,
  Icon,
  ListRow,
  ProgressBar,
  SectionHeader,
  Toast,
} from '../../ui';
import { color, fontFamily, fontSize, sp, text } from '../../theme';
import { t } from '../../locales';

export function ProfileScreen({ navigation }: any) {
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

  if (!profile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  const levelPct =
    profile.xp_to_next_level > 0
      ? Math.min(
          100,
          (profile.current_xp /
            (profile.current_xp + profile.xp_to_next_level)) *
            100,
        )
      : 100;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Hatto variant="face" size={96} />
          <Text style={[text.h2, styles.catName]}>{profile.cat_name}</Text>
          <Text style={styles.displayName}>{profile.display_name}</Text>
          <Badge tone="sun">
            Lv.{profile.current_level} · {profile.level_title}
          </Badge>
        </View>

        <View style={styles.chipRow}>
          <CoinChip amount={profile.total_xp} tone="gold" />
          <CoinChip amount={profile.gems} tone="gem" />
          <CoinChip amount={profile.catnip} tone="heart" />
        </View>

        <Card variant="paper">
          <SectionHeader
            title={t('profile.levelProgress')}
            action={
              <Text style={styles.smallCaption}>
                {profile.xp_to_next_level} XP →
              </Text>
            }
          />
          <ProgressBar value={levelPct} showValue={false} color={color.xp} />
        </Card>

        {profile.streak.streak_shields > 0 && (
          <Toast tone="info" icon="lock">
            {t('profile.streakShields', {
              count: profile.streak.streak_shields,
            })}
          </Toast>
        )}

        <Card variant="paper" padding={0} style={styles.list}>
          <ListRow
            leading={<Icon name="gift" size={20} color={color.primary} />}
            title={t('profile.inventory')}
            subtitle={t('profile.inventoryHint', {
              count: inventory?.total_items ?? 0,
            })}
            onPress={() => navigation.navigate('Inventory')}
          />
          <ListRow
            leading={<Icon name="shop" size={20} color={color.accent} />}
            title={t('profile.shop')}
            onPress={() => navigation.navigate('Shop')}
          />
          <ListRow
            leading={<Icon name="chat" size={20} color={color.primary} />}
            title={t('profile.alerts')}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <ListRow
            leading={<Icon name="trophy" size={20} color={color.xp} />}
            title={t('stats.link')}
            onPress={() => navigation.navigate('WeeklyStats')}
            last
          />
        </Card>

        <Card variant="cream">
          <SectionHeader title={t('profile.settings')} />
          <Row
            label={t('profile.dailyGoal')}
            value={profile.daily_goal}
          />
          <Row label={t('profile.timezone')} value={profile.timezone} />
          {profile.profession && (
            <Row
              label={t('profile.profession')}
              value={profile.profession.name}
            />
          )}
          {profile.target_country && (
            <Row
              label={t('profile.country')}
              value={profile.target_country}
            />
          )}
        </Card>

        <View style={styles.actions}>
          <Button full size="lg" variant="secondary" onPress={logout}>
            {t('profile.logout')}
          </Button>
          {__DEV__ && (
            <Button
              full
              size="md"
              variant="ghost"
              onPress={() => navigation.navigate('DesignPlayground')}
            >
              Open design playground
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
  content: { padding: sp.s5, paddingBottom: sp.s9, gap: sp.s4 },
  header: {
    alignItems: 'center',
    gap: sp.s2,
    paddingBottom: sp.s3,
  },
  catName: { color: color.ink, marginTop: sp.s2 },
  displayName: { ...text.body, color: color.inkSoft },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: sp.s2,
  },
  list: { overflow: 'hidden' },
  smallCaption: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.micro,
    color: color.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sp.s2,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  rowLabel: { ...text.body, color: color.inkSoft },
  rowValue: { ...text.bodyBold, color: color.ink },
  actions: { gap: sp.s2, marginTop: sp.s3 },
});
