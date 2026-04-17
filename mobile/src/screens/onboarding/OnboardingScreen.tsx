import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingApi, userApi } from '../../api';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { Profession, Country } from '../../types/api';

interface Props {
  onComplete: () => void;
}

type Step = 'profession' | 'country' | 'goal' | 'catName' | 'done';

export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('profession');
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dailyGoal, setDailyGoal] = useState('regular');
  const [catName, setCatName] = useState('Mittens');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: professions } = useQuery({
    queryKey: ['professions'],
    queryFn: async () => {
      const { data } = await onboardingApi.getProfessions();
      return data.data.professions;
    },
    enabled: step === 'profession',
  });

  const { data: countries } = useQuery({
    queryKey: ['countries', selectedProfession?.slug],
    queryFn: async () => {
      const { data } = await onboardingApi.getCountries(selectedProfession!.slug);
      return data.data.countries;
    },
    enabled: step === 'country' && !!selectedProfession,
  });

  const handleFinish = async () => {
    if (!selectedProfession || !selectedCountry) return;
    setLoading(true);
    try {
      // Submit assessment (simplified: empty answers for now)
      await onboardingApi.submitAssessment({
        profession_id: selectedProfession.id,
        target_country: selectedCountry.code,
        answers: [{ question_id: '00000000-0000-0000-0000-000000000001', selected_option: 'A' }],
      });

      // Update profile
      await userApi.updateProfile({
        daily_goal: dailyGoal,
        cat_name: catName,
      } as any);

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum'] });
      onComplete();
    } catch (err: any) {
      Alert.alert(t('common.error'), t('onboarding.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const professionIcons: Record<string, string> = { nurse: '👩‍⚕️', doctor: '🩺', pharmacist: '💊' };
  const goalOptions = [
    { key: 'casual', label: t('onboarding.goal.casual'), desc: t('onboarding.goal.casualDesc') },
    { key: 'regular', label: t('onboarding.goal.regular'), desc: t('onboarding.goal.regularDesc') },
    { key: 'intensive', label: t('onboarding.goal.intensive'), desc: t('onboarding.goal.intensiveDesc') },
  ];

  return (
    <View style={styles.container}>
      {/* Step 1: Profession */}
      {step === 'profession' && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{t('onboarding.profession.title')}</Text>
          <View style={styles.cardsRow}>
            {professions?.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.professionCard}
                onPress={() => { setSelectedProfession(p); setStep('country'); }}
              >
                <Text style={styles.professionIcon}>{professionIcons[p.slug] || '🏥'}</Text>
                <Text style={styles.professionName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Step 2: Country */}
      {step === 'country' && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{t('onboarding.country.title')}</Text>
          {countries?.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.countryRow, selectedCountry?.code === c.code && styles.countryRowSelected]}
              onPress={() => { setSelectedCountry(c); setStep('goal'); }}
            >
              <Text style={styles.countryName}>{c.name}</Text>
              <Text style={styles.countryAccent}>{c.accent}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Step 3: Daily Goal */}
      {step === 'goal' && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{t('onboarding.goal.title')}</Text>
          {goalOptions.map((g) => (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalCard, dailyGoal === g.key && styles.goalCardSelected]}
              onPress={() => setDailyGoal(g.key)}
            >
              <Text style={[styles.goalLabel, dailyGoal === g.key && styles.goalLabelSelected]}>{g.label}</Text>
              <Text style={styles.goalDesc}>{g.desc}</Text>
            </TouchableOpacity>
          ))}
          <Button title={t('onboarding.goal.next')} onPress={() => setStep('catName')} style={styles.nextBtn} />
        </View>
      )}

      {/* Step 4: Cat Name */}
      {step === 'catName' && (
        <View style={styles.stepContent}>
          <Text style={styles.catEmoji}>🐱</Text>
          <Text style={styles.stepTitle}>{t('onboarding.catName.title')}</Text>
          <Text style={styles.stepDesc}>{t('onboarding.catName.description')}</Text>
          <TextInput
            style={styles.nameInput}
            value={catName}
            onChangeText={setCatName}
            placeholder={t('onboarding.catName.placeholder')}
            maxLength={20}
          />
          <Button title={t('onboarding.catName.submit')} onPress={handleFinish} loading={loading} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  stepContent: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  stepTitle: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.lg },
  stepDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  cardsRow: { gap: spacing.md },
  professionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  professionIcon: { fontSize: 48, marginBottom: spacing.sm },
  professionName: { ...typography.h3, color: colors.textPrimary },
  countryRow: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryRowSelected: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  countryName: { ...typography.bodyBold, color: colors.textPrimary },
  countryAccent: { ...typography.caption, color: colors.textSecondary },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  goalCardSelected: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  goalLabel: { ...typography.h3, color: colors.textPrimary },
  goalLabelSelected: { color: colors.primary },
  goalDesc: { ...typography.caption, color: colors.textSecondary },
  nextBtn: { marginTop: spacing.md },
  catEmoji: { fontSize: 80, textAlign: 'center', marginBottom: spacing.md },
  nameInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.h3,
    textAlign: 'center',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});
