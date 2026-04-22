import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { curriculumApi, learningApi } from '../../api';
import {
  Badge,
  Button,
  Card,
  Hatto,
  Icon,
  ProgressBar,
  SectionHeader,
  SpeechBubble,
} from '../../ui';
import { color, fontFamily, fontSize, sp, text } from '../../theme';
import { t } from '../../locales';
import type { MapStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MapStackParamList, 'StageIntro'>;

export function StageIntroScreen({ route, navigation }: Props) {
  const { stageId } = route.params;

  const { data: stage, isLoading } = useQuery({
    queryKey: ['stage', stageId],
    queryFn: async () => {
      const { data } = await curriculumApi.getStageDetail(stageId);
      return data.data;
    },
  });

  const handleStart = async () => {
    try {
      const { data } = await learningApi.startStage(stageId);
      navigation.replace('Exercise', {
        stageId,
        attemptId: data.data.attempt_id,
      });
    } catch (err: any) {
      const code = err?.response?.data?.error?.code;
      if (code === 'NO_LIVES') {
        Alert.alert(t('common.error'), t('home.stage.noLives'));
      }
    }
  };

  if (isLoading || !stage) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  const stars = stage.progress?.stars ?? 0;
  const attempts = stage.progress?.attempts ?? 0;
  const difficultyPct = (stage.difficulty_level / 5) * 100;

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="face" size={96} />
          <SpeechBubble style={styles.bubble}>
            {stage.scenario_description}
          </SpeechBubble>
        </View>

        <SectionHeader
          eyebrow={t('home.stage.eyebrow')}
          title={stage.title}
          action={<Badge tone="sun">XP {stage.xp_base}</Badge>}
        />

        <Card variant="paper">
          <View style={styles.statRow}>
            <Stat label={t('home.stage.exercises')} value={`${stage.exercises.length}`} />
            <Stat label={t('home.stage.attempts')} value={`${attempts}`} />
            <Stat label={t('home.stage.stars')} value={'★'.repeat(stars) + '☆'.repeat(3 - stars)} />
          </View>
          <View style={styles.diffRow}>
            <Text style={styles.diffLabel}>{t('home.stage.difficulty')}</Text>
            <ProgressBar value={difficultyPct} showValue={false} color={color.accent} />
          </View>
        </Card>

        {stage.progress?.status === 'completed' && (
          <Card variant="mint">
            <View style={styles.prevRow}>
              <Icon name="check" size={20} color={color.successDeep} />
              <Text style={styles.prevText}>{t('home.stage.bestRecorded')}</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button full size="lg" onPress={handleStart}>
          {t('home.stage.start')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.cream },
  content: { padding: sp.s5, paddingBottom: sp.s8, gap: sp.s5 },
  hero: { alignItems: 'center', gap: sp.s3 },
  bubble: { maxWidth: 300 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: sp.s2,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.micro,
    color: color.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.h3,
    color: color.ink,
  },
  diffRow: { gap: sp.s2, marginTop: sp.s3 },
  diffLabel: {
    ...text.captionBold,
    color: color.inkSoft,
  },
  prevRow: { flexDirection: 'row', alignItems: 'center', gap: sp.s2 },
  prevText: { ...text.bodyBold, color: color.successDeep },
  footer: {
    padding: sp.s5,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.cream,
  },
});
