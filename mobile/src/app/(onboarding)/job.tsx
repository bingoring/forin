// Onboarding 2/4 — career path (handoff ScreenJob). MVP ships the nurse track;
// others show t('job.comingSoon') and aren't selectable. Carries selections to the level step.
import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { saveDraft } from '@/lib/onboardingDraft';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { OnbTopBar, Shadowed } from './locale';
import { t, useLocale, useT } from '@/i18n';

const C = colors.ink;
// nameKey, not t(...): this array is evaluated once at import, so a call here
// would pin the labels to whatever language was active at startup.
const JOBS = [
  { code: 'nurse', nameKey: 'job.nurse', sub: 'Nurse · General hospital', scenarios: 124, icon: 'hospital' as IconName, ready: true },
  { code: 'swe', nameKey: 'job.swe', sub: 'SW Engineer · Startup', icon: 'chart' as IconName, ready: false },
  { code: 'barista', nameKey: 'job.barista', sub: 'Barista · Café', icon: 'cup' as IconName, ready: false },
  { code: 'hotelier', nameKey: 'job.hotelier', sub: 'Hotelier · Front desk', icon: 'pin' as IconName, ready: false },
];

export default function Job() {
  // Back has to work when there is nothing to pop.
  //
  // `router.back()` on its own throws when this screen is the whole stack, and it is the
  // whole stack more often than the happy path suggests: a reload during development
  // restores the current URL and nothing else, and a deep link into the middle of
  // onboarding does the same to a real user. The step before this one is a known place,
  // so naming it is better than asking the navigator to remember.
  const t = useT();
  const router = useRouter();
  const params = useLocalSearchParams<{ nativeLang: string; destination: string; targetLang: string }>();

  const next = async () => {
    await saveDraft({ job: 'nurse' });
    router.push({ pathname: '/level', params: { ...params, job: 'nurse' } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      <OnbTopBar title="CAREER PATH" step="2/4" onBack={() => (router.canGoBack() ? router.back() : router.replace('/locale'))} />
      <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(21), color: C, lineHeight: 30 }}>어떤 일터로 떠날까요?</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 6, marginBottom: 18 }}>직무에 맞춘 현장 시나리오가 열립니다.</Text>

        <View style={{ gap: 12 }}>
          {JOBS.map((j) => (
            <Shadowed key={j.code} offset={j.ready ? 4 : 2} shadowColor={j.ready ? colors.peachShadow : C + '22'}>
              <View style={{ backgroundColor: j.ready ? colors.peach : '#fff', borderWidth: 3, borderColor: C, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: j.ready ? 1 : 0.7 }}>
                <View style={{ width: 52, height: 52, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <PixelIcon name={j.icon} color={C} size={26} sw={1.6} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{t(j.nameKey)}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginTop: 2 }}>{j.sub}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                    {j.ready
                      ? <><PixelChip label={t('job.scenarioCount', { n: j.scenarios ?? 0 })} bg={colors.mint} /><PixelChip label="MVP" bg={colors.yellow} /></>
                      : <PixelChip label={t('job.comingSoon')} bg="#fff" />}
                  </View>
                </View>
                {j.ready && <PixelIcon name="play" color={C} size={16} sw={1.8} />}
              </View>
            </Shadowed>
          ))}
        </View>

        <View style={{ marginTop: 22 }}>
          <PixelButton label={t('job.continueNurse')} icon="play" bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={next} />
        </View>
      </View>
    </View>
  );
}
