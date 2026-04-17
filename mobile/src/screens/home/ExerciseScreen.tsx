import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi, learningApi } from '../../api';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Exercise'>;

export function ExerciseScreen({ route, navigation }: Props) {
  const { stageId, attemptId } = route.params;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const { data: stage } = useQuery({
    queryKey: ['stage', stageId],
    queryFn: async () => {
      const { data } = await curriculumApi.getStageDetail(stageId);
      return data.data;
    },
  });

  if (!stage) return <View style={styles.loading}><Text>Loading...</Text></View>;

  const exercises = stage.exercises;
  const current = exercises[currentIdx];
  const isLast = currentIdx >= exercises.length - 1;

  const handleSubmitPlaceholder = async () => {
    // Placeholder: auto-submit a correct answer based on type
    let response: any;
    switch (current.exercise_type) {
      case 'sentence_arrangement':
        response = { answer: current.content.target_sentence?.split(' ') || ['placeholder'] };
        break;
      case 'word_puzzle':
        response = {
          answers: (current.content.blanks || []).map((b: any) => ({
            blank_index: b.index,
            selected_option: b.correct_answer,
          })),
        };
        break;
      case 'meaning_match':
        response = { total_time_seconds: 45, mismatch_count: 0 };
        break;
      case 'conversation':
        response = { user_response_text: 'I understand your concern. Let me help you.' };
        break;
    }

    try {
      const { data } = await learningApi.submitExercise(attemptId, current.id, response);
      const result = data.data;
      setTotalXP((prev) => prev + result.xp_earned);
      if (result.is_correct === false) setMistakes((prev) => prev + 1);

      if (isLast) {
        // Complete the attempt
        const { data: completeData } = await learningApi.completeAttempt(attemptId);
        const completion = completeData.data;
        navigation.replace('StageComplete', { result: completion });
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message || 'Submission failed');
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
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

      {/* Exercise Info */}
      <View style={styles.content}>
        <Text style={styles.typeLabel}>{current.exercise_type.replace('_', ' ')}</Text>
        <Text style={styles.exerciseTitle}>
          Exercise {currentIdx + 1} of {exercises.length}
        </Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {current.exercise_type === 'conversation'
              ? '💬 Conversation Practice'
              : current.exercise_type === 'meaning_match'
              ? '🃏 Match the pairs'
              : current.exercise_type === 'word_puzzle'
              ? '📝 Fill in the blanks'
              : '🧩 Arrange the sentence'}
          </Text>
          <Text style={styles.xpLabel}>+{current.xp_reward} XP</Text>
        </View>
      </View>

      {/* Submit (placeholder) */}
      <View style={styles.footer}>
        <Text style={styles.xpTotal}>Total XP: {totalXP}</Text>
        <Button title={isLast ? 'Finish' : 'Next'} onPress={handleSubmitPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: spacing.lg },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  progressDotDone: { backgroundColor: colors.success },
  progressDotActive: { backgroundColor: colors.primary },
  content: { flex: 1 },
  typeLabel: {
    ...typography.small,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseTitle: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.xs, marginBottom: spacing.lg },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderText: { fontSize: 48, marginBottom: spacing.md },
  xpLabel: { ...typography.bodyBold, color: colors.xp },
  footer: { gap: spacing.sm },
  xpTotal: { ...typography.caption, color: colors.xp, textAlign: 'center' },
});
