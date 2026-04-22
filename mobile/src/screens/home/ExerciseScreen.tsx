import React, { useEffect, useState } from 'react';
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
  Button,
  Card,
  CoinChip,
  Hatto,
  Hearts,
  Icon,
  ProgressBar,
  SpeechBubble,
} from '../../ui';
import {
  SentenceArrangement,
  WordPuzzle,
  MeaningMatch,
  ConversationPractice,
  SynonymMatch,
} from '../../components/exercises';
import { SceneOpener, SceneEnding } from '../../components/scene';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';
import type { MapStackParamList } from '../../navigation/types';
import type { Exercise, SubmitExerciseResponse } from '../../types/api';

type Props = NativeStackScreenProps<MapStackParamList, 'Exercise'>;
type Phase = 'opener' | 'exercise' | 'ending';

export function ExerciseScreen({ route, navigation }: Props) {
  const { stageId, attemptId } = route.params;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [lives, setLives] = useState(5);
  const [lastResult, setLastResult] = useState<SubmitExerciseResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [phase, setPhase] = useState<Phase>('exercise');

  const { data: stage } = useQuery({
    queryKey: ['stage', stageId],
    queryFn: async () => {
      const { data } = await curriculumApi.getStageDetail(stageId);
      return data.data;
    },
  });

  useEffect(() => {
    if (!stage) return;
    setPhase(stage.scene_opener_md ? 'opener' : 'exercise');
  }, [stage?.id]);

  if (!stage) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  const exercises = stage.exercises;
  const current = exercises[currentIdx];
  const isLast = currentIdx >= exercises.length - 1;

  if (phase === 'opener' && stage.scene_opener_md) {
    return (
      <SceneOpener
        npcKey={stage.scene_npc_key}
        openerMd={stage.scene_opener_md}
        tensionLevel={stage.tension_level}
        onContinue={() => setPhase('exercise')}
      />
    );
  }

  if (phase === 'ending' && stage.scene_ending_md) {
    return (
      <SceneEnding
        endingMd={stage.scene_ending_md}
        onContinue={async () => {
          try {
            const { data } = await learningApi.completeAttempt(attemptId);
            navigation.replace('StageComplete', { result: data.data });
          } catch (err: any) {
            Alert.alert(
              t('common.error'),
              err?.response?.data?.error?.message ?? t('exercise.errors.completion'),
            );
          }
        }}
      />
    );
  }

  const handleExerciseSubmit = async (response: any) => {
    try {
      const { data } = await learningApi.submitExercise(attemptId, current.id, response);
      const result = data.data;
      setTotalXP((prev) => prev + result.xp_earned);
      setLives(result.lives_after);
      setLastResult(result);
      setShowFeedback(true);
    } catch (err: any) {
      Alert.alert(
        t('common.error'),
        err?.response?.data?.error?.message ?? t('exercise.errors.submission'),
      );
    }
  };

  const handleNext = async () => {
    setShowFeedback(false);
    setLastResult(null);

    if (isLast) {
      if (stage.scene_ending_md && phase !== 'ending') {
        setPhase('ending');
        return;
      }
      try {
        const { data } = await learningApi.completeAttempt(attemptId);
        navigation.replace('StageComplete', { result: data.data });
      } catch (err: any) {
        Alert.alert(
          t('common.error'),
          err?.response?.data?.error?.message ?? t('exercise.errors.completion'),
        );
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  if (showFeedback && lastResult) {
    const kind =
      lastResult.is_correct === true ? 'correct'
      : lastResult.is_correct === false ? 'wrong'
      : 'graded';

    const bubbleTone = kind === 'correct' ? 'sky' : kind === 'wrong' ? 'coral' : 'paper';
    const headline =
      kind === 'correct' ? t('exercise.feedback.correct')
      : kind === 'wrong' ? t('exercise.feedback.wrong')
      : t('exercise.feedback.graded', { score: lastResult.score });

    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.feedbackBody}>
          <Hatto variant="face" size={128} />
          <SpeechBubble tone={bubbleTone} style={styles.feedbackBubble}>
            {headline}
          </SpeechBubble>

          <Card variant="paper" style={styles.feedbackCard}>
            <View style={styles.feedbackRow}>
              <Text style={text.body}>{t('exercise.feedback.xp')}</Text>
              <CoinChip amount={`+${lastResult.xp_earned}`} tone="gold" />
            </View>
            {lastResult.lives_lost > 0 && (
              <View style={styles.feedbackRow}>
                <Text style={text.body}>{t('exercise.feedback.lives')}</Text>
                <Hearts total={5} filled={lastResult.lives_after} />
              </View>
            )}
          </Card>
        </View>

        <View style={styles.footer}>
          <Button
            full
            size="lg"
            variant={kind === 'wrong' ? 'coral' : 'primary'}
            onPress={handleNext}
          >
            {isLast ? t('exercise.seeResults') : t('exercise.next')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((currentIdx) / exercises.length) * 100;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.progressTop}>
          <Icon name="arrow-left" size={22} color={color.inkSoft} />
          <View style={styles.progressFill}>
            <ProgressBar value={progress} showValue={false} color={color.accent} />
          </View>
          <Hearts total={5} filled={lives} size={18} />
        </View>
        <View style={styles.xpChipRow}>
          <CoinChip amount={`${totalXP} XP`} tone="gold" />
          <Text style={styles.typeLabel}>
            {formatType(current.exercise_type)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.exerciseScroll}
        keyboardShouldPersistTaps="handled"
      >
        {renderExercise(current, handleExerciseSubmit)}
      </ScrollView>
    </SafeAreaView>
  );
}

function renderExercise(
  exercise: Exercise,
  onSubmit: (response: any) => void,
) {
  switch (exercise.exercise_type) {
    case 'sentence_arrangement':
      return <SentenceArrangement content={exercise.content} onSubmit={onSubmit} />;
    case 'word_puzzle':
      return <WordPuzzle content={exercise.content} onSubmit={onSubmit} />;
    case 'meaning_match':
      return <MeaningMatch content={exercise.content} onSubmit={onSubmit} />;
    case 'conversation':
      return <ConversationPractice content={exercise.content} onSubmit={onSubmit} />;
    case 'synonym_match':
      return <SynonymMatch content={exercise.content} onSubmit={onSubmit} />;
    default:
      return <Text style={text.body}>Unknown exercise type</Text>;
  }
}

function formatType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.cream },
  header: {
    paddingHorizontal: sp.s5,
    paddingTop: sp.s2,
    paddingBottom: sp.s3,
    gap: sp.s3,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s3,
  },
  progressFill: { flex: 1 },
  xpChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeLabel: {
    ...text.captionBold,
    color: color.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseScroll: {
    flexGrow: 1,
    padding: sp.s5,
  },
  feedbackBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: sp.s5,
    gap: sp.s4,
  },
  feedbackBubble: { maxWidth: 320 },
  feedbackCard: { width: '100%', gap: sp.s3 },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sp.s2,
  },
  footer: {
    padding: sp.s5,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.cream,
  },
});
