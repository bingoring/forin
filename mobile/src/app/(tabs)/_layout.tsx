import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

// Bottom nav: 캠퍼스 / 상황판 / 리뷰랩 / 나 (1:1 with the handoff ForinBottomNav —
// a pixel emoji icon above the label, active tab on a mint cell).
const icon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarActiveBackgroundColor: colors.mint,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.ink, borderTopWidth: 3 },
        tabBarLabelStyle: { fontFamily: fonts.heading, fontSize: 11 },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen name="campus" options={{ title: '캠퍼스', tabBarIcon: icon('🏥') }} />
      <Tabs.Screen name="board" options={{ title: '상황판', tabBarIcon: icon('📋') }} />
      <Tabs.Screen name="lab" options={{ title: '리뷰랩', tabBarIcon: icon('📓') }} />
      <Tabs.Screen name="me" options={{ title: '나', tabBarIcon: icon('👤') }} />
    </Tabs>
  );
}
