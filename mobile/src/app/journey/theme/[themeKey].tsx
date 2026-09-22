// 2단계 — 주제 화면(정거장 뷰)의 자리.
//
// 이 파일은 아직 채워지지 않았다. P3-C(curriculum-v3-journey-ia/build-spec-index.md)가
// 두 단계로 나눈 작업 중 1단계(일터 탭 = 주제 목록, `(tabs)/journey.tsx`)만 이 라운드에서
// 끝났고, 이 화면의 실제 내용(§6~§7 — 정거장이 스텝이 된 `JourneyMap`, `StationSheet`를
// 흡수한 스텝 목록, 걸어가는 아바타)은 2단계 작업이 채운다.
//
// 그런데도 이 파일이 지금 존재하는 이유: `app.json`의 `experiments.typedRoutes`가 켜져
// 있어, 존재하지 않는 라우트로의 `router.push()`는 컴파일 타임에 막힌다(2단계 화면이
// 아직 없다고 해서 1단계의 카드 탭을 타입 에러로 만들 수는 없다). 그래서 1단계가 결정한
// 경로 모양(`/journey/theme/<themeKey>` — 이 저장소의 `/scenario/[id]`·`/quiz/[id]` 관례를
// 따른 것)이 실제로 타입을 통과하도록 자리만 잡아 둔다. 2단계 작업은 이 파일의 내용을
// 통째로 새로 쓰면 된다 — 지금 여기 있는 것은 그 전까지의 자리표시자일 뿐이다.
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';

export default function ThemeScreen() {
  const { themeKey } = useLocalSearchParams<{ themeKey: string }>();
  return (
    <View testID="theme-screen-placeholder" style={{ flex: 1, backgroundColor: nb.cream, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={nbText.hand(15, nb.soft)}>{themeKey}</Text>
    </View>
  );
}
