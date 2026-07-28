// Onboarding 2/4 — career path (handoff ScreenJob). MVP ships the nurse track;
// others show "곧 열림" and aren't selectable. Carries selections to the level step.
import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { colors, fonts } from '@/theme/tokens';
import { OnbTopBar, Shadowed } from './locale';

const C = colors.ink;
const JOBS = [
  { code: 'nurse', name: '간호사', sub: 'Nurse · 종합병원', scenarios: 124, icon: '🏥', ready: true },
  { code: 'swe', name: '소프트웨어 엔지니어', sub: 'SW Engineer · 스타트업', icon: '💻', ready: false },
  { code: 'barista', name: '바리스타', sub: 'Barista · 카페', icon: '☕', ready: false },
  { code: 'hotelier', name: '호텔리어', sub: 'Hotelier · 프론트', icon: '🛎', ready: false },
];

export default function Job() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nativeLang: string; destination: string; targetLang: string }>();

  const next = () => router.push({ pathname: '/level', params: { ...params, job: 'nurse' } });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      <OnbTopBar title="CAREER PATH" step="2/4" onBack={() => router.back()} />
      <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: 21, color: C, lineHeight: 30 }}>어떤 일터로 떠날까요?</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft, marginTop: 6, marginBottom: 18 }}>직무에 맞춘 현장 시나리오가 열립니다.</Text>

        <View style={{ gap: 12 }}>
          {JOBS.map((j) => (
            <Shadowed key={j.code} offset={j.ready ? 4 : 2} shadowColor={j.ready ? colors.peachShadow : C + '22'}>
              <View style={{ backgroundColor: j.ready ? colors.peach : '#fff', borderWidth: 3, borderColor: C, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: j.ready ? 1 : 0.7 }}>
                <View style={{ width: 52, height: 52, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 26 }}>{j.icon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{j.name}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, marginTop: 2 }}>{j.sub}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                    {j.ready
                      ? <><PixelChip label={`● ${j.scenarios}개 시나리오`} bg={colors.mint} /><PixelChip label="MVP" bg={colors.yellow} /></>
                      : <PixelChip label="곧 열림" bg="#fff" />}
                  </View>
                </View>
                {j.ready && <Text style={{ fontFamily: fonts.heading, fontSize: 18, color: C }}>▶</Text>}
              </View>
            </Shadowed>
          ))}
        </View>

        <View style={{ marginTop: 22 }}>
          <PixelButton label="간호사로 계속 ▶" bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={next} />
        </View>
      </View>
    </View>
  );
}
