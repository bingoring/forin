import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { SheetOverlayHost } from '@/components/SheetOverlay';
import { t, useLocale, useT } from '@/i18n';

// Bottom nav: 홈 / 일터 / 라운지 / 리뷰랩 / 나. Home is leftmost and the app's default
// entry (handoff v21) — expo-router takes (tabs)/index.tsx as the first tab.
//
// v29 wording: 캠퍼스/커리어 → 일터 (the app is adding professions, and only one of them
// has a campus), 상황판 → 라운지. The tab is now the community feed itself; 오늘의 상황판
// did not go away — it is a route of its own (`/board`), reached from the lounge header
// and from the home screen, because a working feature does not get deleted to make room
// for a new one.
//
// The bar itself is the 근무 수첩 line: a strip of the lighter paper with the notebook's
// own cut edge, doodle icons, and the handwriting face. No mint cell behind the active tab
// — on paper the emphasis is weight and opacity, not a coloured tile.
const ICONS: Record<string, NbIconName> = {
  index: 'home', campus: 'hospital', lounge: 'speech', lab: 'lab', me: 'me',
};
const tabIcon = (route: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    // Colour comes from the icon's own ink, dimmed when unselected: the doodles carry a
    // watercolour fill, and tinting them with the tab bar's colour would flatten it.
    return (
      <View style={{ opacity: focused ? 1 : 0.55 }}>
        <NbIcon name={ICONS[route]} size={21} />
      </View>
    );
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
        tabBarActiveTintColor: nb.ink,
        tabBarInactiveTintColor: 'rgba(62,54,43,.55)',
        tabBarStyle: { backgroundColor: nb.paper, borderTopColor: nb.paperEdge, borderTopWidth: 1.5 },
        tabBarLabelStyle: { fontFamily: nbFonts.hand, fontSize: 13 },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tab.home'), tabBarIcon: tabIcon('index') }}
      />
      <Tabs.Screen name="campus" options={{ title: t('tab.career'), tabBarIcon: tabIcon('campus') }} />
      <Tabs.Screen name="lounge" options={{ title: t('tab.board'), tabBarIcon: tabIcon('lounge') }} />
      <Tabs.Screen name="lab" options={{ title: t('tab.lab'), tabBarIcon: tabIcon('lab') }} />
      <Tabs.Screen name="me" options={{ title: t('tab.me'), tabBarIcon: tabIcon('me') }} />
    </Tabs>
    </SheetOverlayHost>
  );
}
