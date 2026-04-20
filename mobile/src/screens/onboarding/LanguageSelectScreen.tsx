import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
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
      const msg = err?.response?.data?.error?.message || t('onboarding.errors.generic');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('onboarding.language.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.language.subtitle')}</Text>
        <View style={styles.list}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.code}
              disabled={!opt.supported}
              onPress={() => setSelected(opt.code)}
              style={[
                styles.card,
                !opt.supported && styles.cardDisabled,
                selected === opt.code && styles.cardSelected,
              ]}
            >
              <Text style={[styles.label, !opt.supported && styles.labelDisabled]}>
                {opt.label}
              </Text>
              {!opt.supported && (
                <Text style={styles.badge}>{t('onboarding.language.comingSoonBadge')}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={t('onboarding.language.continue')}
          onPress={handleContinue}
          loading={loading}
          style={styles.continue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  list: { gap: spacing.sm, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  cardDisabled: { opacity: 0.5 },
  label: { ...typography.h3, color: colors.textPrimary },
  labelDisabled: { color: colors.textMuted },
  badge: { ...typography.caption, color: colors.textMuted },
  continue: {},
});
