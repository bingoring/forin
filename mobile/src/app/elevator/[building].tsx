// Elevator route: building-entry floor selector. Opened by tapping a campus
// pavilion (or a future in-dept 🛗). Picking a floor rides to that floor's
// interior; floors without a built interior show a "준비 중" notice.
import { Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ElevatorScreen, type ElevFloor } from '@/map/ElevatorScreen';

export default function ElevatorRoute() {
  const { building } = useLocalSearchParams<{ building: string }>();
  const router = useRouter();

  const onPickFloor = (_building: string, floor: ElevFloor) => {
    if (floor.interior) {
      router.replace(`/interior/${floor.interior}`);
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
