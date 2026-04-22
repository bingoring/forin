import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { Button, Hatto, OptionCard, SectionHeader, SpeechBubble } from '../../ui';
import { color, sp } from '../../theme';
import { setAppLocale, t } from '../../locales';

type LocaleOption = {
  code: string;
  label: string;
  supported: boolean;
};

const OPTIONS: LocaleOption[] = [
  { code: 'ko', label: '한국어', supported: true },
  { code: 'en', label: 'English', supported: false },
  { code: 'vi', label: 'Tiếng Việt', supported: false },
  { code: 'tl', label: 'Filipino', supported: false },
  { code: 'ja', label: '日本語', supported: false },
  { code: 'zh', label: '中文', supported: false },
];

interface Props {
  onComplete: () => void;
}

export function LanguageSelectScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<string>('ko');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await userApi.updateProfile({ native_language: selected } as any);
      setAppLocale(selected);
      if (currentUser) {
        setUser({ ...currentUser, native_language: selected });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onComplete();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message || t('onboarding.errors.generic');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="face" size={96} />
          <SpeechBubble style={styles.bubble}>
            {t('onboarding.language.subtitle')}
          </SpeechBubble>
        </View>

        <SectionHeader title={t('onboarding.language.title')} />

        <View style={styles.list}>
          {OPTIONS.map((opt) => (
            <OptionCard
              key={opt.code}
              title={opt.label}
              subtitle={
                opt.supported
                  ? undefined
                  : t('onboarding.language.comingSoonBadge')
              }
              tone="sky"
              state={selected === opt.code ? 'selected' : 'default'}
              onPress={opt.supported ? () => setSelected(opt.code) : undefined}
              style={!opt.supported ? styles.disabled : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button full size="lg" onPress={handleContinue} loading={loading}>
          {t('onboarding.language.continue')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: {
    padding: sp.s5,
    gap: sp.s5,
    paddingBottom: sp.s8,
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
  disabled: {
    opacity: 0.5,
  },
  footer: {
    padding: sp.s5,
    backgroundColor: color.cream,
    borderTopWidth: 1,
    borderTopColor: color.hair,
  },
});
