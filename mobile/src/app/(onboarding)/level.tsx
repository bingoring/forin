// Onboarding 3/4 — target-language level (handoff ScreenLevel). Picking a CEFR
// band tunes scenario difficulty. "이대로 시작" saves the whole onboarding profile
// (PATCH /me/profile → onboarded=true) and enters the app.
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { api } from '@/api/client';
import { clearDraft, loadDraft } from '@/lib/onboardingDraft';
import { syncOnboarded } from '@/lib/auth';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { PressCard } from '@/components/PressCard';
import { colors, fonts, fs } from '@/theme/tokens';
import { OnbTopBar, Shadowed } from './locale';
import { t, useLocale, useT } from '@/i18n';

const C = colors.ink;
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
// descKey, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const LEVELS = [
  { code: 'A1', name: 'Beginner', descKey: 'level.a1', tone: colors.peach },
  { code: 'A2', name: 'Elementary', descKey: 'level.a2', tone: colors.peach },
  { code: 'B1', name: 'Intermediate', descKey: 'level.b1', tone: colors.mint },
  { code: 'B2', name: 'Upper-Int', descKey: 'level.b2', tone: colors.mint },
  { code: 'C1', name: 'Advanced', descKey: 'level.c1', tone: colors.yellow },
];

export default function Level() {
  const t = useT();
  const router = useRouter();
  const params = useLocalSearchParams<{ nativeLang: string; destination: string; targetLang: string; job: string }>();
  const [level, setLevel] = useState('B1');
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Params win (this run's answers); the draft covers a resumed wizard where
      // the earlier screens were never revisited.
      const d = await loadDraft();
      await api.updateProfile({
        job: params.job || d.job || 'nurse',
        nativeLang: params.nativeLang || d.nativeLang || 'ko',
        targetLang: params.targetLang || d.targetLang || 'en',
        destination: params.destination || d.destination || 'us',
        targetLevel: level,
      });
      await syncOnboarded();
      // The draft has done its job; leaving it behind would prefill a wizard the
      // user will never see again.
      await clearDraft();
      // Home, not the career tab — the first thing after onboarding should be
      // today's ONE thing, not the curriculum list (handoff v21 §①b).
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert(t('onboarding.saveFailed'), e instanceof Error ? e.message : t('common.retryHint'));
      setBusy(false);
    }
  };

  const activeIdx = CEFR.indexOf(level);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      <OnbTopBar title="LEVEL CHECK" step="3/4" onBack={() => (router.canGoBack() ? router.back() : router.replace('/job'))} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(21), color: C, lineHeight: 30 }}>지금 영어 실력은?</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 6, marginBottom: 18 }}>시나리오 난이도가 자동으로 맞춰져요.</Text>

        {/* CEFR bar visualization */}
        <Shadowed offset={3} shadowColor={C + '22'}>
          <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              {CEFR.map((l) => <Text key={l} style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{l}</Text>)}
            </View>
            <View style={{ height: 14, flexDirection: 'row', borderWidth: 2, borderColor: C, backgroundColor: colors.cream }}>
              {CEFR.map((l, i) => (
                <View key={l} style={{ flex: 1, borderRightWidth: i < 5 ? 2 : 0, borderColor: C, backgroundColor: i <= activeIdx ? colors.mint : 'transparent' }} />
              ))}
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, marginTop: 8 }}>추정 레벨 · <Text style={{ fontFamily: fonts.heading }}>{level}</Text> 정도부터 시작해볼게요</Text>
          </View>
        </Shadowed>

        <View style={{ gap: 8, marginTop: 18 }}>
          {LEVELS.map((l) => {
            const sel = level === l.code;
            return (
              <PressCard
                key={l.code}
                selected={sel}
                onPress={() => setLevel(l.code)}
                shadowColor={colors.mintShadow}
                contentStyle={{ backgroundColor: sel ? l.tone : '#fff', borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                  <View style={{ width: 36, height: 36, backgroundColor: l.tone, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{l.code}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{l.name}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginTop: 2 }}>{t(l.descKey)}</Text>
                  </View>
                  {sel && (
                    <View style={{ width: 20, height: 20, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                      <PixelIcon name="check" color={C} size={12} sw={2.2} />
                    </View>
                  )}
              </PressCard>
            );
          })}
        </View>

        <View style={{ marginTop: 24 }}>
          <PixelButton label={busy ? '' : t('onboarding.startNow')} icon={busy ? undefined : 'play'} bg={colors.yellow} shadowColor={colors.yellowShadow} full disabled={busy} onPress={start} />
          {busy && <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>}
        </View>
      </ScrollView>
    </View>
  );
}
