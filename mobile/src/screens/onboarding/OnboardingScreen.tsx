import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingApi, userApi } from '../../api';
import {
  Button,
  Hatto,
  OptionCard,
  ProgressBar,
  SectionHeader,
  SpeechBubble,
  TextInput,
  type IconName,
} from '../../ui';
import { color, sp } from '../../theme';
import { t } from '../../locales';
import type { Profession, Country } from '../../types/api';

interface Props {
  onComplete: () => void;
}

type Step = 'profession' | 'country' | 'goal' | 'catName';
const STEP_ORDER: Step[] = ['profession', 'country', 'goal', 'catName'];

// Profession slug → an icon from the DS set. The old hero icons (nurse /
// doctor / pharmacist) lived in the legacy Icon component; the new DS
// icon set is deliberately smaller, so we fall back to a sensible
// generic icon and let the label carry the identity.
const PROFESSION_ICON: Record<string, IconName> = {
  nurse: 'person',
  doctor: 'person',
  pharmacist: 'person',
};

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
      await onboardingApi.submitAssessment({
        profession_id: selectedProfession.id,
        target_country: selectedCountry.code,
        answers: [
          {
            question_id: '00000000-0000-0000-0000-000000000001',
            selected_option: 'A',
          },
        ],
      });
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

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const goalOptions = [
    { key: 'casual',    label: t('onboarding.goal.casual'),    desc: t('onboarding.goal.casualDesc') },
    { key: 'regular',   label: t('onboarding.goal.regular'),   desc: t('onboarding.goal.regularDesc') },
    { key: 'intensive', label: t('onboarding.goal.intensive'), desc: t('onboarding.goal.intensiveDesc') },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.progressBar}>
        <ProgressBar value={progress} showValue={false} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 'profession' && (
          <View style={styles.block}>
            <View style={styles.hero}>
              <Hatto variant="face" size={96} />
              <SpeechBubble style={styles.bubble}>
                {t('onboarding.profession.title')}
              </SpeechBubble>
            </View>
            <View style={styles.list}>
              {professions?.map((p) => (
                <OptionCard
                  key={p.id}
                  icon={PROFESSION_ICON[p.slug] ?? 'person'}
                  title={p.name}
                  tone="sky"
                  state={selectedProfession?.id === p.id ? 'selected' : 'default'}
                  onPress={() => {
                    setSelectedProfession(p);
                    setStep('country');
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {step === 'country' && (
          <View style={styles.block}>
            <SectionHeader title={t('onboarding.country.title')} />
            <View style={styles.list}>
              {countries?.map((c) => (
                <OptionCard
                  key={c.code}
                  title={c.name}
                  subtitle={c.accent}
                  tone="coral"
                  state={selectedCountry?.code === c.code ? 'selected' : 'default'}
                  onPress={() => {
                    setSelectedCountry(c);
                    setStep('goal');
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.block}>
            <SectionHeader title={t('onboarding.goal.title')} />
            <View style={styles.list}>
              {goalOptions.map((g) => (
                <OptionCard
                  key={g.key}
                  title={g.label}
                  subtitle={g.desc}
                  tone="sun"
                  state={dailyGoal === g.key ? 'selected' : 'default'}
                  onPress={() => setDailyGoal(g.key)}
                />
              ))}
            </View>
            <Button full size="lg" onPress={() => setStep('catName')}>
              {t('onboarding.goal.next')}
            </Button>
          </View>
        )}

        {step === 'catName' && (
          <View style={styles.block}>
            <View style={styles.hero}>
              <Hatto variant="full" size={240} />
              <SpeechBubble style={styles.bubble}>
                {t('onboarding.catName.description')}
              </SpeechBubble>
            </View>
            <SectionHeader title={t('onboarding.catName.title')} />
            <TextInput
              placeholder={t('onboarding.catName.placeholder')}
              value={catName}
              onChangeText={setCatName}
              maxLength={20}
            />
            <Button full size="lg" onPress={handleFinish} loading={loading}>
              {t('onboarding.catName.submit')}
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  progressBar: {
    paddingHorizontal: sp.s5,
    paddingTop: sp.s3,
  },
  content: {
    padding: sp.s5,
    paddingBottom: sp.s8,
    gap: sp.s5,
  },
  block: {
    gap: sp.s4,
  },
  hero: {
    alignItems: 'center',
    gap: sp.s3,
  },
  bubble: {
    maxWidth: 280,
  },
  list: {
    gap: sp.s3,
  },
});
