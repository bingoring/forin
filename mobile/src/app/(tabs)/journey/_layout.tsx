// 일터 탭 안의 스택 — 서가(index) → 부서 간지(dept) → 주제 산책길(theme), 그리고 목표
// 부서를 고르는 화면(pick-dept).
//
// 이 네 화면이 탭 **바깥**이 아니라 탭 **안**에 있는 이유: 하단 탭바는 침범하지 않는
// 영역이다. 간지가 탭 바깥의 푸시 화면이던 동안에는 화면을 통째로 덮어 탭바가 사라졌고,
// 바인더 표지가 날아오는 연출도 탭바 자리까지 칠했다. 핸드오프 v43의 전환 도안도 같은
// 경계를 지킨다 — 날아오는 레이어가 `bottom: 68`에서 멈춰, 아래 서가의 탭바가 그대로
// 비쳐 보인다.
//
// 스택이 탭 안에 있으면 그 경계가 저절로 지켜진다. 각 화면은 탭바 위 영역만 받으므로
// 표지가 화면을 가득 채워도 탭바를 덮지 않고, 간지로 넘어가도 탭바가 그대로 남는다.
//
// 경로는 바뀌지 않는다. `(tabs)`는 그룹이라 URL에 나타나지 않으므로 `/journey`,
// `/journey/dept/<부서>`, `/journey/theme/<주제>`, `/journey/pick-dept` 모두 그대로다.
//
// `BinderExitOverlay`가 `Stack`과 나란히, 이 안에 서 있는 것이 Task J의 핵심이다
// (task-J-brief.md §3). 부서 간지가 표지를 닫고 날아 돌아갈 때(⑤) 그 화면은 이미
// 뜬 뒤다 — 표지를 계속 그릴 무언가가 화면 **바깥**에서 살아 있어야 하고, 그 자리가
// 탭 **바깥**이면 하단 탭바를 도로 덮는다(이미 한 번 고친 문제, 커밋 `5964aab`). 스택
// 형제로 여기 두면 오버레이도 스택의 각 화면과 같은 경계(탭바 위 영역)만 받는다.
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { BinderExitOverlay } from '@/components/journey/BinderExitOverlay';

export default function JourneyStackLayout() {
  // 화면별 전환은 각 화면이 자기 `Stack.Screen options`로 정한다 — 간지는 좌표를 들고
  // 왔는지에 따라 기본 밀기를 끄고 자기 연출을 재생한다(`dept/[dept].tsx`).
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BinderExitOverlay />
    </View>
  );
}
