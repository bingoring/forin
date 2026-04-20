import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi, learningApi } from '../../api';
import { SentenceArrangement, WordPuzzle, MeaningMatch, ConversationPractice, SynonymMatch } from '../../components/exercises';
import { SceneOpener, SceneEnding } from '../../components/scene';
import { Icon } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
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

  // Initial phase selection: show the opener first when the stage has one.
  // Keyed off stage.id so retries / back-nav reset the gate consistently.
  useEffect(() => {
    if (!stage) return;
    setPhase(stage.scene_opener_md ? 'opener' : 'exercise');
  }, [stage?.id]);

  if (!stage) {
    return <View style={styles.loading}><Text>Loading...</Text></View>;
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
            Alert.alert('Error', err?.response?.data?.error?.message || 'Completion failed');
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
      Alert.alert('Error', err?.response?.data?.error?.message || 'Submission failed');
    }
  };

  const handleNext = async () => {
    setShowFeedback(false);
    setLastResult(null);

    if (isLast) {
      // If the stage has a scene ending, route through it first.
      if (stage.scene_ending_md && phase !== 'ending') {
        setPhase('ending');
        return;
      }
      try {
        const { data } = await learningApi.completeAttempt(attemptId);
        navigation.replace('StageComplete', { result: data.data });
      } catch (err: any) {
        Alert.alert('Error', err?.response?.data?.error?.message || 'Completion failed');
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  // Feedback overlay
  if (showFeedback && lastResult) {
    const feedbackIcon =
      lastResult.is_correct === true ? 'check'
      : lastResult.is_correct === false ? 'x'
      : 'menu'; // placeholder — AI-graded conversation has no clean hero match
    const feedbackColor =
      lastResult.is_correct === true ? colors.success
      : lastResult.is_correct === false ? colors.error
      : colors.primary;
    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackIcon}>
            <Icon name={feedbackIcon} size={56} color={feedbackColor} />
          </View>

          <Text style={styles.feedbackTitle}>
            {lastResult.is_correct === true ? 'Correct!' :
             lastResult.is_correct === false ? 'Not quite...' :
             `Score: ${lastResult.score}/100`}
          </Text>

          <Text style={styles.feedbackXP}>+{lastResult.xp_earned} XP</Text>

          {lastResult.lives_lost > 0 && (
            <View style={styles.feedbackLivesRow}>
              <Icon name="heart" size={16} color={colors.error} />
              <Text style={styles.feedbackLives}>
                {' '}−{lastResult.lives_lost} (remaining: {lastResult.lives_after})
              </Text>
            </View>
          )}

          <View style={{ height: spacing.lg }} />

          <Text style={styles.nextBtn} onPress={handleNext}>
            {isLast ? 'See Results' : 'Next Exercise'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.header}>
        <View style={styles.progressRow}>
          {exercises.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < currentIdx && styles.progressDotDone,
                i === currentIdx && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="heart" size={16} color={colors.heart} />
            <Text style={styles.livesText}> {lives}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="xp" size={16} color={colors.xp} />
            <Text style={styles.xpText}> {totalXP} XP</Text>
          </View>
        </View>
      </View>

      {/* Exercise type label */}
      <Text style={styles.typeLabel}>{formatType(current.exercise_type)}</Text>

      {/* Exercise component */}
      <View style={styles.exerciseArea}>
        {renderExercise(current, handleExerciseSubmit)}
      </View>
    </View>
  );
}

function renderExercise(exercise: Exercise, onSubmit: (response: any) => void) {
  // audioUrl + exerciseId are threaded into the three exercise types
  // that have a clear "one-liner to speak". MeaningMatch and
  // SynonymMatch are multi-word card exercises — per-card playback
  // is a later UX; skipping them keeps autoplay from spamming TTS.
  const audioUrl = exercise.audio_url;
  const exerciseId = exercise.id;
  switch (exercise.exercise_type) {
    case 'sentence_arrangement':
      return (
        <SentenceArrangement
          content={exercise.content}
          audioUrl={audioUrl}
          exerciseId={exerciseId}
          onSubmit={onSubmit}
        />
      );
    case 'word_puzzle':
      return (
        <WordPuzzle
          content={exercise.content}
          audioUrl={audioUrl}
          exerciseId={exerciseId}
          onSubmit={onSubmit}
        />
      );
    case 'meaning_match':
      return <MeaningMatch content={exercise.content} onSubmit={onSubmit} />;
    case 'conversation':
      return (
        <ConversationPractice
          content={exercise.content}
          audioUrl={audioUrl}
          exerciseId={exerciseId}
          onSubmit={onSubmit}
        />
      );
    case 'synonym_match':
      return <SynonymMatch content={exercise.content} onSubmit={onSubmit} />;
    default:
      return <Text>Unknown exercise type</Text>;
  }
}

function formatType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: spacing.md },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: spacing.sm },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  progressDotDone: { backgroundColor: colors.success },
  progressDotActive: { backgroundColor: colors.primary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  livesText: { ...typography.bodyBold, color: colors.heart },
  xpText: { ...typography.bodyBold, color: colors.xp },
  typeLabel: {
    ...typography.small,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  exerciseArea: { flex: 1 },
  feedbackContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.lg },
  feedbackCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackIcon: { marginBottom: spacing.md },
  feedbackLivesRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  feedbackTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  feedbackXP: { ...typography.h3, color: colors.xp },
  feedbackLives: { ...typography.body, color: colors.error },
  nextBtn: {
    ...typography.button,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
