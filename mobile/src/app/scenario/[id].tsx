// Scenario briefing — full screen is Stage 2-6. This stub exists so the
// interior hotspot → scenario navigation (2-5) is wired and demoable.
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { PixelButton } from '@/components/PixelButton';
import { PixelBox } from '@/components/PixelBox';
import { RoleFace } from '@/characters/Face';
import { colors, fonts, space, type as t } from '@/theme/tokens';

export default function ScenarioRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, padding: space.xl, gap: space.lg, justifyContent: 'center' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={{ fontFamily: fonts.heading, fontSize: t.screenHeading, color: colors.ink }}>시나리오 브리핑</Text>

      {/* Portrait preview (Face component). Full briefing/dialogue UI is Stage 2-6. */}
      <PixelBox style={{ padding: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
        <RoleFace kind="patient" expression="pain" size={88} />
        <View style={{ flex: 1, gap: space.xs }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: t.section, color: colors.ink }}>흉통 환자</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: t.caption, color: colors.textSoft }}>
            "가슴이 너무 아파요…"
          </Text>
        </View>
      </PixelBox>

      <Text style={{ fontFamily: fonts.body, fontSize: t.body, color: colors.text }}>
        {id} — 브리핑/대화 화면은 Stage 2-6에서 구현됩니다.
      </Text>
      <PixelButton label="‹ 돌아가기" onPress={() => router.back()} />
    </View>
  );
}
