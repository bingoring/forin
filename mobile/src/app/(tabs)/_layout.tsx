import { Tabs } from 'expo-router';
import { colors, fonts } from '@/theme/tokens';

// Bottom nav: 캠퍼스 / 상황판 / 리뷰랩 / 나 (handoff IA).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.cream, borderTopColor: colors.ink, borderTopWidth: 2 },
        tabBarLabelStyle: { fontFamily: fonts.heading, fontSize: 11 },
      }}
    >
      <Tabs.Screen name="campus" options={{ title: '캠퍼스' }} />
      <Tabs.Screen name="board" options={{ title: '상황판' }} />
      <Tabs.Screen name="lab" options={{ title: '리뷰랩' }} />
      <Tabs.Screen name="me" options={{ title: '나' }} />
    </Tabs>
  );
}
