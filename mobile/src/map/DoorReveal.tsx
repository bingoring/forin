// Elevator transition overlay. Arrives CLOSED (continuing the cab doors that
// shut in the elevator), shows a LED floor readout that ticks from → to while
// the destination map loads + fully renders BEHIND it, then slides the cab
// doors apart. Opening is gated on BOTH (a) the map being fully rendered
// (`ready`, driven by InteriorScreen.onReady — not just data-loaded) and (b) a
// minimum travel beat, so you never see the map mid-layout.
import { useEffect, useRef, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const INK = '#2A2522';

const floorNum = (f?: string) => {
  const m = (f ?? '').match(/-?\d+/);
  return m ? parseInt(m[0], 10) : NaN;
};

export function DoorReveal({
  ready,
  wall = '#E8EAEC',
  fromFloor,
  toFloor,
  dept,
  dir,
  onDone,
}: {
  ready: boolean; // destination map fully rendered → allowed to open
  wall?: string;
  fromFloor?: string;
  toFloor?: string;
  dept?: string;
  dir?: 'up' | 'down';
  onDone?: () => void;
}) {
  const { width } = useWindowDimensions();
  const open = useSharedValue(0); // 0 = closed, 1 = fully apart
  const [gone, setGone] = useState(false);

  const fromN = floorNum(fromFloor);
  const toN = floorNum(toFloor);
  const multiFloor = Number.isFinite(fromN) && Number.isFinite(toN) && fromN !== toN;
  const [disp, setDisp] = useState<number>(Number.isFinite(fromN) ? fromN : toN);
  // "travel done" = ticker reached the destination (multi-floor) OR a minimum
  // beat elapsed (same-floor) — gives an elevator feel even lobby→lobby.
  const [travelDone, setTravelDone] = useState(false);

  // Tick the floor number toward the destination (≈one floor / 300ms).
  useEffect(() => {
    if (!multiFloor) {
      const t = setTimeout(() => setTravelDone(true), 700);
      return () => clearTimeout(t);
    }
    const step = fromN < toN ? 1 : -1;
    let n = fromN;
    const iv = setInterval(() => {
      n += step;
      setDisp(n);
      if (n === toN) {
        clearInterval(iv);
        setTimeout(() => setTravelDone(true), 300); // brief "arrived" hold
      }
    }, 300);
    return () => clearInterval(iv);
  }, [multiFloor, fromN, toN]);

  // Open only once the map is fully rendered AND the travel beat is done.
  useEffect(() => {
    if (!(ready && travelDone)) return;
    open.value = withTiming(1, { duration: 640, easing: Easing.inOut(Easing.cubic) }, (fin) => {
      if (fin) runOnJS(setGone)(true);
    });
  }, [ready, travelDone, open]);

  const doneRef = useRef(false);
  useEffect(() => {
    if (gone && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [gone, onDone]);

  const half = width / 2 + 2;
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -open.value * half }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: open.value * half }] }));

  if (gone) return null;
  const arrived = travelDone;
  const arrow = arrived ? '›‹' : dir === 'up' ? '▲' : dir === 'down' ? '▼' : '·';
  const dispLabel = Number.isFinite(disp) ? `${disp}F` : toFloor ?? '';

  return (
    <View pointerEvents={arrived && ready ? 'none' : 'auto'} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      {/* LED floor readout above the seam */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 3 }} pointerEvents="none">
        <View style={{ backgroundColor: '#0F1A24', borderWidth: 3, borderColor: INK, paddingHorizontal: 18, paddingVertical: 10, minWidth: 148, alignItems: 'center', shadowColor: INK, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
          <Text style={{ fontFamily: 'DungGeunMo', fontSize: 9, color: '#64748B', letterSpacing: 2 }}>{arrived ? 'ARRIVED · 도착' : 'RIDING · 이동 중'}</Text>
          <Text style={{ fontFamily: 'DungGeunMo', fontSize: 40, lineHeight: 46, color: arrived ? '#4ADE80' : '#22D3EE' }}>{arrow} {dispLabel}</Text>
          {dept ? <Text style={{ fontFamily: 'DungGeunMo', fontSize: 11, color: '#CBD5E1' }}>{dept}</Text> : null}
        </View>
      </View>

      {/* the two sliding cab doors */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' }}>
        <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: wall, borderRightWidth: 2, borderColor: INK }, leftStyle]}>
          {/* metallic seam highlight + groove lines */}
          <View style={{ position: 'absolute', right: 3, top: 0, bottom: 0, width: 4, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
          <View style={{ position: 'absolute', right: 12, top: 0, bottom: 0, width: 2, backgroundColor: INK, opacity: 0.12 }} />
        </Animated.View>
        <Animated.View style={[{ width: '50%', height: '100%', backgroundColor: wall, borderLeftWidth: 2, borderColor: INK }, rightStyle]}>
          <View style={{ position: 'absolute', left: 3, top: 0, bottom: 0, width: 4, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
          <View style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, backgroundColor: INK, opacity: 0.12 }} />
        </Animated.View>
      </View>
    </View>
  );
}
