import type { ReactNode } from 'react';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { colors, fonts } from '@/theme/tokens';
import { CampusIcon, BoardIcon, LabIcon, MeIcon } from '@/components/TabIcons';

// Bottom nav: 캠퍼스 / 상황판 / 리뷰랩 / 나. Black-line SVG icons (app's ink-outline
// style) above the label, active tab on a mint cell.
type IconCmp = (p: { color: string; size?: number }) => ReactNode;
const tabIcon = (Icon: IconCmp) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Icon color={color as string} size={22} />;
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
      <Tabs.Screen name="campus" options={{ title: '캠퍼스', tabBarIcon: tabIcon(CampusIcon) }} />
      <Tabs.Screen name="board" options={{ title: '상황판', tabBarIcon: tabIcon(BoardIcon) }} />
      <Tabs.Screen name="lab" options={{ title: '리뷰랩', tabBarIcon: tabIcon(LabIcon) }} />
      <Tabs.Screen name="me" options={{ title: '나', tabBarIcon: tabIcon(MeIcon) }} />
    </Tabs>
  );
}
