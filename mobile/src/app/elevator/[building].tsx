// Elevator route: building-entry floor selector. Opened by tapping a campus
// pavilion (or a future in-dept 🛗). Picking a floor rides to that floor's
// interior; floors without a built interior show a "준비 중" notice.
import { Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ElevatorScreen, ELEVATOR_BUILDINGS, type ElevFloor } from '@/map/ElevatorScreen';

export default function ElevatorRoute() {
  const { building } = useLocalSearchParams<{ building: string }>();
  const router = useRouter();

  const onPickFloor = (b: string, floor: ElevFloor) => {
    if (floor.interior) {
      // ride in with the doors still shut; the interior continues the open via
      // DoorReveal (?via=elevator), revealing the map once it loads. `entry`
      // spawns the player at the floor's doorway.
      const wall = ELEVATOR_BUILDINGS[b]?.wall ?? '#E8EAEC';
      const at = floor.entry ? `&ex=${floor.entry.x}&ey=${floor.entry.y}` : '';
      router.replace(`/interior/${floor.interior}?via=elevator&c=${encodeURIComponent(wall)}${at}`);
    } else {
      Alert.alert(`${floor.f} · ${floor.depts[0]}`, '이 층은 곧 공개됩니다. (준비 중)');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ElevatorScreen building={building} onPickFloor={onPickFloor} onClose={() => router.back()} />
    </>
  );
}
