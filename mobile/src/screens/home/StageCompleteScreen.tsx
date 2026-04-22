import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Badge,
  Button,
  Card,
  CoinChip,
  Hatto,
  Icon,
  SpeechBubble,
  Toast,
  XPBar,
} from '../../ui';
import { CelebrationOverlay } from '../../components/celebration';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';
import { analytics } from '../../analytics';
import type { MapStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MapStackParamList, 'StageComplete'>;

export function StageCompleteScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const queryClient = useQueryClient();
  const [showFloorUnlock, setShowFloorUnlock] = useState<boolean>(
    !!result.unlocked_module_id,
  );

  useEffect(() => {
    analytics.track({
      name: 'stage_complete',
      properties: {
        stage_id: result.stage_id,
        stars: result.stars_earned,
        xp_earned: result.xp_earned,
        mistakes: result.mistakes_count,
        duration_seconds: result.duration_seconds,
      },
    });
    if (result.level_up) {
      analytics.track({
        name: 'level_up',
        properties: {
          new_level: result.level_up.new_level,
          new_title: result.level_up.new_title,
        },
      });
    }
    if (result.streak_update?.milestone_hit) {
      analytics.track({
        name: 'streak_milestone',
        properties: { milestone: result.streak_update.milestone_hit },
      });
    }
    if (result.streak_update?.shield_used) {
      analytics.track({
        name: 'shield_used',
        properties: { current_streak: result.streak_update.current_streak },
      });
    }
    if (result.streak_update?.shield_earned) {
      analytics.track({
        name: 'shield_earned',
        properties: {
          current_streak: result.streak_update.current_streak,
          total_shields: result.streak_update.streak_shields,
        },
      });
    }
  }, []);

  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    navigation.popToTop();
  };

  const minutes = Math.floor(result.duration_seconds / 60);
  const seconds = result.duration_seconds % 60;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="full" size={280} />
          <SpeechBubble tone="sky" style={styles.bubble}>
            {t('home.complete.title')}
          </SpeechBubble>
        </View>

        <View style={styles.starsRow}>
          {[0, 1, 2].map((i) => (
            <Icon
              key={i}
              name="star"
              size={40}
              color={i < result.stars_earned ? color.xp : color.hair}
            />
          ))}
        </View>

        <Card variant="paper">
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('home.complete.xpEarned')}</Text>
            <CoinChip amount={`+${result.xp_earned}`} tone="gold" />
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('home.complete.mistakes')}</Text>
            <Badge tone={result.mistakes_count === 0 ? 'mint' : 'rose'}>
              {String(result.mistakes_count)}
            </Badge>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{t('home.complete.duration')}</Text>
            <Text style={styles.statValue}>
              {minutes}m {seconds}s
            </Text>
          </View>
        </Card>

        {result.level_up && (
          <Card variant="sun">
            <Text style={[text.h3, styles.cardHeader]}>
              {t('home.complete.levelUp')}
            </Text>
            <Text style={text.body}>
              Lv.{result.level_up.previous_level} → Lv.{result.level_up.new_level}
            </Text>
            <Text style={[text.h2, styles.levelUpTitle]}>
              {result.level_up.new_title}
            </Text>
            <XPBar segments={5} filled={5} />
          </Card>
        )}

        {result.streak_update?.was_extended && (
          <Toast tone="warn" icon="flame">
            {t('home.complete.streak', {
              days: result.streak_update.current_streak,
            })}
            {result.streak_update.milestone_hit
              ? ' · ' +
                t('home.complete.milestone', {
                  milestone: result.streak_update.milestone_hit,
                })
              : ''}
          </Toast>
        )}

        {result.streak_update?.shield_used && (
          <Toast tone="info" icon="lock">
            {t('home.complete.shieldUsed', {
              days: result.streak_update.current_streak,
            })}
          </Toast>
        )}

        {result.streak_update?.shield_earned && (
          <Toast tone="success" icon="lock">
            {t('home.complete.shieldEarned', {
              total: result.streak_update.streak_shields,
            })}
          </Toast>
        )}

        {result.achievements.length > 0 && (
          <Card variant="coral">
            <Text style={[text.h3, styles.cardHeader]}>
              {t('home.complete.achievementUnlocked')}
            </Text>
            {result.achievements.map((a) => (
              <View key={a.id} style={styles.achievementRow}>
                <Icon name="trophy" size={18} color={color.accentDeep} />
                <Text style={text.bodyBold}>{a.name}</Text>
              </View>
            ))}
          </Card>
        )}

        {result.gift_box && (
          <Card
            variant="premium"
            onPress={() =>
              navigation.navigate('GiftBox', {
                boxId: result.gift_box!.id,
                boxType: result.gift_box!.box_type,
              })
            }
          >
            <View style={styles.giftRow}>
              <Icon name="gift" size={32} color={color.premiumDeep} />
              <Text style={[text.bodyBold, styles.giftText]}>
                {t('home.complete.giftPrompt', {
                  type: result.gift_box.box_type,
                })}
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button full size="lg" onPress={handleContinue}>
          {t('home.complete.continue')}
        </Button>
      </View>

      <CelebrationOverlay
        visible={showFloorUnlock}
        title={t('map.celebration.floorUnlockedTitle')}
        subtitle={t('map.celebration.floorUnlockedSubtitle')}
        onDismiss={() => setShowFloorUnlock(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: {
    padding: sp.s5,
    paddingBottom: sp.s8,
    gap: sp.s4,
  },
  hero: { alignItems: 'center', gap: sp.s3 },
  bubble: { maxWidth: 300 },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: sp.s3,
    paddingVertical: sp.s2,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sp.s2,
  },
  statLabel: { ...text.body, color: color.inkSoft },
  statValue: { ...text.bodyBold, color: color.ink },
  cardHeader: { marginBottom: sp.s1 },
  levelUpTitle: { marginTop: sp.s1, marginBottom: sp.s2, color: color.woodDark },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s2,
    marginTop: sp.s1,
  },
  giftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s3,
  },
  giftText: {
    flex: 1,
    color: color.premiumDeep,
  },
  footer: {
    padding: sp.s5,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.cream,
  },
});
