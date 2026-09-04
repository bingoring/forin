// 완벽한 원 그리기 — 인게임 (v38 CircleGame).
//
// Draw the dashed target circle in ONE stroke; on release the trajectory is scored by its
// average deviation from that circle (100 = perfect), shown big in the centre. Retries are
// free — only starting the game from the hub counts against the daily limit.
//
// The drawing uses the built-in PanResponder (no extra gesture dep): each touch-down starts
// a fresh stroke, moves append points (thinned by a small distance threshold so the path
// stays cheap), and release scores. Touch points are in canvas pixels and mapped into the
// 360×400 viewBox to compare against the target circle at (180,200) r120.
import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { NbButton, NbMemo, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { recordBest } from '@/lib/gameScores';
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

export default function CircleGame() {
  const t = useT();
  const router = useRouter();

  const [size, setSize] = useState({ w: 1, h: 1 });
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [result, setResult] = useState<{ score: number; err: number } | null>(null);
  // Refs so the PanResponder (created once) always sees the latest values.
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const ptsRef = useRef<{ x: number; y: number }[]>([]);

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
        },
        onPanResponderMove: (e) => {
          const { locationX, locationY } = e.nativeEvent;
          const last = ptsRef.current[ptsRef.current.length - 1];
          if (last && Math.hypot(locationX - last.x, locationY - last.y) < 3) return; // thin
          ptsRef.current = [...ptsRef.current, { x: locationX, y: locationY }];
          setPoints(ptsRef.current);
        },
        onPanResponderRelease: () => {
          const { w, h } = sizeRef.current;
          const pts = ptsRef.current;
          if (pts.length < 10) {
            setResult(null);
            return;
          }
          let sum = 0;
          for (const p of pts) {
            const vx = (p.x / w) * VB_W;
            const vy = (p.y / h) * VB_H;
            sum += Math.abs(Math.hypot(vx - CX, vy - CY) - R);
          }
          const err = sum / pts.length;
          const score = scoreFor(err);
          setResult({ score, err });
          recordBest('circle', score);
        },
      }),
    [],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  // The drawn path, mapped from canvas px into the viewBox.
  const d = points.length
    ? points
        .map((p, i) => {
          const vx = ((p.x / size.w) * VB_W).toFixed(1);
          const vy = ((p.y / size.h) * VB_H).toFixed(1);
          return `${i === 0 ? 'M' : 'L'}${vx} ${vy}`;
        })
        .join(' ')
    : '';

  const retry = () => {
    ptsRef.current = [];
    setPoints([]);
    setResult(null);
  };

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: TOP_INSET, paddingHorizontal: 20 }}>
        <Pressable onPress={() => router.back()}>
          <NbPaper rot={-1} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3, paddingHorizontal: 9 }}>
            <NbIcon name="cross" size={12} />
            <Text style={nbText.hand(14)}>{t('games.stop')}</Text>
          </NbPaper>
        </Pressable>
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
          {!!d && <Path d={d} fill="none" stroke={nb.blue} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />}
          {points.length > 0 && <Circle cx={(points[0].x / size.w) * VB_W} cy={(points[0].y / size.h) * VB_H} r={5} fill={nb.green} stroke={nb.ink} strokeWidth={1.6} />}
        </Svg>

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
