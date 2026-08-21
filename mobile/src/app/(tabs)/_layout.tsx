import type { ReactNode } from 'react';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { colors, fonts, fs } from '@/theme/tokens';
import { CampusIcon, BoardIcon, LabIcon, MeIcon } from '@/components/TabIcons';
import { PixelIcon } from '@/components/PixelIcon';
import { SheetOverlayHost } from '@/components/SheetOverlay';
import { t, useLocale, useT } from '@/i18n';

// Bottom nav: 홈 / 커리어 / 상황판 / 리뷰랩 / 프로필. 홈이 최좌측이자 앱의 기본
// 진입 화면이다(handoff v21) — expo-router가 (tabs)/index.tsx를 첫 탭으로 잡는다. Black-line SVG icons (app's ink-outline
// style) above the label, active tab on a mint cell.
type IconCmp = (p: { color: string; size?: number }) => ReactNode;
const tabIcon = (Icon: IconCmp) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Icon color={color as string} size={22} />;
  };

export default function TabsLayout() {
  const t = useT();
  return (
    // Sheets from any tab render inside this host — above the tab bar, and below whatever
    // screen the stack pushes on top of the tabs. See SheetOverlay for why that beats a
    // Modal, which is above both.
    <SheetOverlayHost>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarActiveBackgroundColor: colors.mint,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.ink, borderTopWidth: 3 },
        tabBarLabelStyle: { fontFamily: fonts.heading, fontSize: fs(11) },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tab.home'), tabBarIcon: ({ color }) => <PixelIcon name="home" color={color as string} size={22} sw={1.8} /> }}
      />
      <Tabs.Screen name="campus" options={{ title: t('tab.career'), tabBarIcon: tabIcon(CampusIcon) }} />
      <Tabs.Screen name="board" options={{ title: t('tab.board'), tabBarIcon: tabIcon(BoardIcon) }} />
      <Tabs.Screen name="lab" options={{ title: t('tab.lab'), tabBarIcon: tabIcon(LabIcon) }} />
      <Tabs.Screen name="me" options={{ title: t('tab.me'), tabBarIcon: tabIcon(MeIcon) }} />
    </Tabs>
    </SheetOverlayHost>
  );
}
