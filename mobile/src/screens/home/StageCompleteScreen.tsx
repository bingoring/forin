import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon } from '../../components/common';
import { CelebrationOverlay } from '../../components/celebration';
import { Mascot } from '../../components/mascot';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useQueryClient } from '@tanstack/react-query';
import { t } from '../../locales';
import type { MapStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MapStackParamList, 'StageComplete'>;

export function StageCompleteScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const queryClient = useQueryClient();
  const [showFloorUnlock, setShowFloorUnlock] = useState<boolean>(
    !!result.unlocked_module_id,
  );

  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrap}>
        <Mascot pose="cheer" size={96} />
      </View>
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
        <View style={styles.streakRow}>
          <Icon name="streak" size={18} color={colors.streak} />
          <Text style={styles.streakText}>
            {' '}{result.streak_update.current_streak} day streak!
            {result.streak_update.milestone_hit
              ? ` ${result.streak_update.milestone_hit}-day milestone!`
              : ''}
          </Text>
        </View>
      )}

      {/* Achievements */}
      {result.achievements.length > 0 && (
        <View style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
          {result.achievements.map((a) => (
            <View key={a.id} style={styles.achievementRow}>
              <Icon name="xp" size={18} color={colors.accent} />
              <Text style={styles.achievementName}> {a.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Gift Box */}
      {result.gift_box && (
        <TouchableOpacity
          style={styles.giftBoxCard}
          onPress={() => navigation.navigate('GiftBox', { boxId: result.gift_box!.id, boxType: result.gift_box!.box_type })}
        >
          <Icon name="gift" size={32} color={colors.accent} />
          <Text style={styles.giftBoxText}>Tap to open your {result.gift_box.box_type} gift box!</Text>
        </TouchableOpacity>
      )}

      <Button title="Continue" onPress={handleContinue} style={styles.btn} />

      <CelebrationOverlay
        visible={showFloorUnlock}
        title={t('map.celebration.floorUnlockedTitle')}
        subtitle={t('map.celebration.floorUnlockedSubtitle')}
        onDismiss={() => setShowFloorUnlock(false)}
      />
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
  mascotWrap: { marginBottom: spacing.sm, alignItems: 'center' },
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
  streakRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  streakText: { ...typography.bodyBold, color: colors.streak },
  achievementRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  achievementCard: {
    width: '100%',
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  achievementTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  achievementName: { ...typography.body, color: colors.textPrimary },
  giftBoxCard: {
    width: '100%',
    backgroundColor: colors.accent + '15',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  giftBoxText: { ...typography.bodyBold, color: colors.accent, marginTop: spacing.xs },
  btn: { width: '100%' },
});
