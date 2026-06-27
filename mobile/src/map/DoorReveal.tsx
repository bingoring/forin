// DoorReveal (5f-ii polish) — a full-screen elevator-door overlay that arrives
// CLOSED (continuing the cab doors that shut in the elevator), holds while the
// destination map loads behind it, then slides apart to reveal the map. Used by
// the interior route when entered via the elevator.
import { useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const INK = '#2A2522';

export function DoorReveal({
  ready,
  wall = '#E8EAEC',
  onDone,
}: {
  ready: boolean; // destination map loaded → open the doors
  wall?: string;
  onDone?: () => void;
}) {
  const { width } = useWindowDimensions();
  const open = useSharedValue(0); // 0 = closed, 1 = fully apart
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    open.value = withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }, (fin) => {
      if (fin) runOnJS(setGone)(true);
    });
  }, [ready, open]);

  useEffect(() => {
    if (gone) onDone?.();
  }, [gone, onDone]);

  const half = width / 2 + 2;
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -open.value * half }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: open.value * half }] }));

  if (gone) return null;
  return (
    <View pointerEvents={ready ? 'none' : 'auto'} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' }}>
      <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: wall, borderRightWidth: 2, borderColor: INK }, leftStyle]} />
      <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: wall, borderLeftWidth: 2, borderColor: INK }, rightStyle]} />
      {!ready ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#0F1A24', borderWidth: 2, borderColor: INK, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text style={{ fontFamily: 'DungGeunMo', fontSize: 11, color: '#22D3EE' }}>도착 · 문 여는 중…</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
