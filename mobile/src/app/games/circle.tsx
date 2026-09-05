// 완벽한 원 그리기 — 인게임 (v38 CircleGame).
//
// Draw the dashed target circle in ONE stroke; on release the trajectory is scored by its
// average deviation from that circle (100 = perfect), shown big in the centre. The stroke is
// then recoloured along its length — green where it hugged the circle, red where it drifted —
// and the smoothest point and the worst 삐끗 are called out. The 삐끗 label shakes into place.
// Retries are free — only starting the game from the hub counts against the daily limit; the
// best score is kept on the device and shown here.
//
// The drawing uses the built-in PanResponder (no extra gesture dep): each touch-down starts
// a fresh stroke, moves append points (thinned by a small distance threshold so the path
// stays cheap), and release scores. Touch points are in canvas pixels and mapped into the
// 360×400 viewBox to compare against the target circle at (180,200) r120.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { NbButton, NbMemo, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { recordBest, useBestScore } from '@/lib/gameScores';
import { useT } from '@/i18n';

const VB_W = 360;
const VB_H = 400;
const CX = 180;
const CY = 200;
const R = 120;

/** meanErr px → 0..100. Calibrated so ~4px error reads ~87, matching the handoff mock. */
function scoreFor(meanErr: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - meanErr * 3.2)));
}

/** Deviation (viewBox px) → a colour from green (on the circle) through amber to red (off).
 *  ~14px off is fully red — the eye reads the wobble long before the number does. */
function colorForDev(dev: number): string {
  const t = Math.max(0, Math.min(1, dev / 14));
  const stops = t < 0.5
    ? ([[95, 141, 90], [224, 168, 46], t * 2] as const) // green → amber
    : ([[224, 168, 46], [199, 81, 70], (t - 0.5) * 2] as const); // amber → red
  const [a, b, k] = stops;
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

type Pt = { x: number; y: number };
type Result = { score: number; err: number; devs: number[]; bestI: number; worstI: number };

export default function CircleGame() {
  const t = useT();
  const router = useRouter();
  const best = useBestScore('circle');

  const [size, setSize] = useState({ w: 1, h: 1 });
  const [points, setPoints] = useState<Pt[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [remain, setRemain] = useState<number | null>(null); // 5s draw-timer countdown
  // Refs so the PanResponder (created once) always sees the latest values.
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const ptsRef = useRef<Pt[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalizeRef = useRef<(pts: Pt[]) => void>(() => {});

  // Score whatever is drawn (on release OR when the 5s runs out — slow, careful tracing was
  // scoring too easily, so an attempt is capped). Kept in a ref so the once-made PanResponder
  // and the timer both call the latest version.
  finalizeRef.current = (pts: Pt[]) => {
    const { w, h } = sizeRef.current;
    if (pts.length < 10) { setResult(null); return; }
    const devs = pts.map((p) => {
      const vx = (p.x / w) * VB_W;
      const vy = (p.y / h) * VB_H;
      return Math.abs(Math.hypot(vx - CX, vy - CY) - R);
    });
    let bestI = 0, worstI = 0;
    devs.forEach((d, i) => {
      if (d < devs[bestI]) bestI = i;
      if (d > devs[worstI]) worstI = i;
    });
    const err = devs.reduce((s, d) => s + d, 0) / devs.length;
    const score = scoreFor(err);
    setResult({ score, err, devs, bestI, worstI });
    recordBest('circle', score);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setRemain(null);
  };
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // The 삐끗 label shakes in when a result appears.
  const wob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!result) return;
    wob.setValue(0);
    Animated.sequence(
      [1, -0.72, 0.5, -0.32, 0.16, -0.07].map((to, i) =>
        Animated.timing(wob, { toValue: to, duration: i === 0 ? 60 : 70, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ),
    ).start();
  }, [result, wob]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const { locationX, locationY } = e.nativeEvent;
          ptsRef.current = [{ x: locationX, y: locationY }];
          setResult(null);
          setPoints(ptsRef.current);
          // start the 5-second clock for this attempt
          if (timerRef.current) clearInterval(timerRef.current);
          const endAt = Date.now() + 5000;
          setRemain(5);
          timerRef.current = setInterval(() => {
            const r = (endAt - Date.now()) / 1000;
            if (r <= 0) {
              if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
              setRemain(null);
              finalizeRef.current(ptsRef.current); // time's up — score what's there
            } else {
              setRemain(r);
            }
          }, 100);
        },
        onPanResponderMove: (e) => {
          const { locationX, locationY } = e.nativeEvent;
          const last = ptsRef.current[ptsRef.current.length - 1];
          if (last && Math.hypot(locationX - last.x, locationY - last.y) < 3) return; // thin
          ptsRef.current = [...ptsRef.current, { x: locationX, y: locationY }];
          setPoints(ptsRef.current);
        },
        onPanResponderRelease: () => {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
          setRemain(null);
          finalizeRef.current(ptsRef.current);
        },
      }),
    [],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const toVB = (p: Pt) => ({ x: (p.x / size.w) * VB_W, y: (p.y / size.h) * VB_H });

  // The live path while drawing (before a result) is one blue stroke; after release it is
  // recoloured segment-by-segment, so this only builds during the draw.
  const liveD = !result && points.length
    ? points.map((p, i) => { const v = toVB(p); return `${i === 0 ? 'M' : 'L'}${v.x.toFixed(1)} ${v.y.toFixed(1)}`; }).join(' ')
    : '';

  const retry = () => {
    stopTimer();
    ptsRef.current = [];
    setPoints([]);
    setResult(null);
  };

  const bestPt = result ? points[result.bestI] : null;
  const worstPt = result ? points[result.worstI] : null;

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: TOP_INSET, paddingHorizontal: 20, gap: 10 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3, paddingHorizontal: 9 }}>
            <NbIcon name="cross" size={12} />
            <Text style={nbText.hand(14)}>{t('games.stop')}</Text>
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1 }} />
        {remain != null && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <NbIcon name="bell" size={13} color={remain < 2 ? nb.red : nb.soft} />
            <Text style={nbText.mono(14, remain < 2 ? nb.red : nb.ink)}>{remain.toFixed(1)}</Text>
          </View>
        )}
        {best != null && <Text style={nbText.mono(12, nb.soft)}>{t('games.hoopsBest', { n: best })}</Text>}
      </View>

      <Text style={[nbText.hand(19), { textAlign: 'center', marginTop: 10, paddingHorizontal: 20 }]}>{t('games.circleHint')}</Text>

      {/* 캔버스 */}
      <View
        {...pan.panHandlers}
        onLayout={onLayout}
        style={{ height: 400, marginTop: 12, marginHorizontal: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)', backgroundColor: 'rgba(255,253,244,.6)' }}
      >
        <Svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
          <Circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(62,54,43,.35)" strokeWidth={2} strokeDasharray="7 8" />

          {/* live stroke while drawing */}
          {!!liveD && <Path d={liveD} fill="none" stroke={nb.blue} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />}

          {/* scored stroke: each segment coloured by how far off it was */}
          {result && points.slice(1).map((p, i) => {
            const a = toVB(points[i]);
            const b = toVB(p);
            const dev = (result.devs[i] + result.devs[i + 1]) / 2;
            return <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={colorForDev(dev)} strokeWidth={4} strokeLinecap="round" />;
          })}

          {points.length > 0 && !result && (
            <Circle cx={toVB(points[0]).x} cy={toVB(points[0]).y} r={5} fill={nb.green} stroke={nb.ink} strokeWidth={1.6} />
          )}

          {/* best + worst rings */}
          {result && bestPt && <Circle cx={toVB(bestPt).x} cy={toVB(bestPt).y} r={7} fill="none" stroke={nb.green} strokeWidth={2.4} />}
          {result && worstPt && <Circle cx={toVB(worstPt).x} cy={toVB(worstPt).y} r={7} fill="none" stroke={nb.red} strokeWidth={2.4} />}
        </Svg>

        {/* 가장 매끄러운 지점 — a calm little tag */}
        {result && bestPt && (
          <View pointerEvents="none" style={{ position: 'absolute', left: bestPt.x + 8, top: bestPt.y - 26 }}>
            <Text style={nbText.hand(12.5, nb.green)}>{t('games.circleSmooth')}</Text>
          </View>
        )}

        {/* 삐끗 지점 — shakes in, and settles askew */}
        {result && worstPt && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute', left: worstPt.x + 8, top: worstPt.y + 6,
              transform: [
                { translateX: wob.interpolate({ inputRange: [-1, 1], outputRange: [-7, 7] }) },
                { rotate: wob.interpolate({ inputRange: [-1, 1], outputRange: ['-15deg', '15deg'] }) },
              ],
            }}
          >
            <Text style={nbText.hand(14.5, nb.red)}>{t('games.circleWobble')}</Text>
          </Animated.View>
        )}

        {result && (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: '44%', alignItems: 'center' }}>
            <Text style={{ fontFamily: nbFonts.mono, fontSize: 44, fontWeight: '700', color: nb.ink }}>
              {result.score}
              <Text style={{ fontFamily: nbFonts.mono, fontSize: 16, color: nb.soft }}>{t('games.pointUnit')}</Text>
            </Text>
            <Text style={[nbText.hand(13.5, nb.soft), { marginTop: 4 }]}>{t('games.circleAvgError', { px: result.err.toFixed(1) })}</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 13, marginHorizontal: 20 }}>
        <NbButton variant="yellow" size="lg" full icon="pencil" onPress={retry}>{t('games.circleRetry')}</NbButton>
      </View>
      <NbMemo rot={-0.3} color={nb.blue} style={{ marginTop: 12, marginHorizontal: 20 }}>{t('games.circleScoring')}</NbMemo>
    </NbSheet>
  );
}
