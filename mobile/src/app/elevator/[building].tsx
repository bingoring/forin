// Elevator route: building-entry floor selector. Opened by tapping a campus
// pavilion (or a future in-dept 🛗). Picking a floor rides to that floor's
// interior; floors without a built interior show a "준비 중" notice.
import { Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ElevatorScreen, ELEVATOR_BUILDINGS, type ElevFloor } from '@/map/ElevatorScreen';
import { t, useLocale, useT } from '@/i18n';

export default function ElevatorRoute() {
  const t = useT();
  const { building } = useLocalSearchParams<{ building: string }>();
  const router = useRouter();

  const onPickFloor = (b: string, floor: ElevFloor, from?: string, dir?: 'up' | 'down') => {
    if (floor.interior) {
      // ride in with the doors still shut; the interior continues the open via
      // DoorReveal (?via=elevator), revealing the map once it FULLY renders.
      // from/to/dept/dir drive the elevator floor ticker on the reveal overlay.
      // Pass the wall color WITHOUT its leading '#': a literal or decoded '#' in
      // a URL starts a fragment and truncates every param after it (breaks the
      // deep-link path entirely). The interior route re-adds the '#'.
      const wall = (ELEVATOR_BUILDINGS[b]?.wall ?? '#E8EAEC').replace(/^#/, '');
      const at = floor.entry ? `&ex=${floor.entry.x}&ey=${floor.entry.y}` : '';
      const trip =
        `&to=${encodeURIComponent(floor.f)}&dept=${encodeURIComponent(floor.depts[0] ?? '')}` +
        (from ? `&from=${encodeURIComponent(from)}` : '') +
        (dir ? `&dir=${dir}` : '');
      router.replace(`/interior/${floor.interior}?via=elevator&c=${encodeURIComponent(wall)}${at}${trip}`);
    } else {
      Alert.alert(`${floor.f} · ${floor.depts[0]}`, t('elevator.comingSoon'));
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ElevatorScreen building={building} onPickFloor={onPickFloor} onClose={() => router.back()} />
    </>
  );
}
