// 탭탭 슛 — 인게임 (v38 HoopsGame).
//
// A break-time basketball game (motif: Tap-Tap Shots), redrawn in the 근무 수첩 line. The
// ball travels in one direction at a constant speed; a tap gives it an upward hop, gravity
// arcs it back down, and going off one side wraps it in from the other. Sink it in the far
// hoop and the direction flips — the next target is the hoop on the opposite wall, at a new
// height. A clean swish is 2 points, a bank off the board is 1; two clean shots in a row set
// the ball on fire and every shot after is worth 3, until a bank puts the fire out. A shot
// clock ticks down between baskets — let it hit zero and the game is over.
//
// The ball is moved every frame through an Animated value (no React re-render per frame);
// only the HUD (score, clock, aim guide) re-renders, a few times a second. The scoring rule
// is pulled out as pure functions so it can be unit-tested without the loop.
import { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle, Path, Ellipse, Line, Rect } from 'react-native-svg';
import { NbButton, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { recordBest, useBestScore } from '@/lib/gameScores';
import { useT } from '@/i18n';

// ── tuning ───────────────────────────────────────────────────────────────────
const G = 1650;      // gravity, px/s²
const JUMP = 560;    // upward speed a tap sets, px/s
const SPEED = 195;   // constant horizontal speed, px/s
const BALL_R = 15;
const RIM_R = 33;    // half the rim opening
const BOARD_H = 46;  // backboard height, up from the rim
const CLOCK = 8.0;   // shot-clock seconds, reset on every basket
const WALL_IN = 60;  // how far in from each wall a rim sits

/** Points for one made basket, given whether it was clean and the clean streak SO FAR
 *  (before this basket). Two clean in a row lights the fire; from the next clean on it is 3. */
export function pointsFor(clean: boolean, cleanStreak: number): number {
  if (!clean) return 1;
  return cleanStreak >= 2 ? 3 : 2;
}

/** The streak after a basket: clean extends it, a bank resets it. */
export function nextStreak(clean: boolean, cleanStreak: number): number {
  return clean ? cleanStreak + 1 : 0;
}

type Hoop = { x: number; y: number };

/** A hand-drawn basketball; catches fire on a 3-point streak. */
function Ball({ onFire }: { onFire: boolean }) {
  const d = BALL_R * 2;
  return (
    <Svg width={d} height={d} viewBox="0 0 30 30">
      {onFire && (
        <Path d="M15 1 Q19 5 17 9 Q22 7 21 12 Q15 8 9 12 Q8 7 13 9 Q11 5 15 1 Z"
          fill="#E9C45A" stroke={nb.red} strokeWidth={1} />
      )}
      <Circle cx={15} cy={15} r={13} fill="#E1863B" stroke={nb.ink} strokeWidth={1.8} />
      <Line x1={15} y1={2.5} x2={15} y2={27.5} stroke={nb.ink} strokeWidth={1.4} />
      <Path d="M3 12 Q15 17 27 12 M3 18 Q15 13 27 18" fill="none" stroke={nb.ink} strokeWidth={1.2} />
      <Path d="M6 4 Q13 15 6 26 M24 4 Q17 15 24 26" fill="none" stroke={nb.ink} strokeWidth={1.1} opacity={0.7} />
    </Svg>
  );
}

/** One hoop: backboard on the wall side, rim, net. `dir` says which side the wall is on. */
function HoopMark({ hoop, dir, target }: { hoop: Hoop; dir: number; target: boolean }) {
  const boardX = hoop.x + dir * (RIM_R + 4);
  const netTop = hoop.y;
  const ink = target ? nb.ink : 'rgba(62,54,43,.4)';
  const rimColor = target ? nb.blue : 'rgba(74,111,165,.45)';
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <Svg width="100%" height="100%">
        {/* backboard + pole */}
        <Line x1={boardX} y1={hoop.y - BOARD_H} x2={boardX} y2={hoop.y + 6} stroke={ink} strokeWidth={3} strokeLinecap="round" />
        <Rect x={boardX - (dir > 0 ? 2 : 8)} y={hoop.y - BOARD_H} width={10} height={BOARD_H * 0.7} fill="none" stroke={ink} strokeWidth={1.4} />
        {/* rim */}
        <Ellipse cx={hoop.x} cy={hoop.y} rx={RIM_R} ry={6} fill="none" stroke={rimColor} strokeWidth={2.6} />
        {/* net */}
        <Path d={`M${hoop.x - RIM_R} ${netTop} L${hoop.x - RIM_R * 0.55} ${netTop + 26} M${hoop.x} ${netTop} L${hoop.x} ${netTop + 30} M${hoop.x + RIM_R} ${netTop} L${hoop.x + RIM_R * 0.55} ${netTop + 26} M${hoop.x - RIM_R * 0.7} ${netTop + 8} Q${hoop.x} ${netTop + 14} ${hoop.x + RIM_R * 0.7} ${netTop + 8} M${hoop.x - RIM_R * 0.5} ${netTop + 20} Q${hoop.x} ${netTop + 26} ${hoop.x + RIM_R * 0.5} ${netTop + 20}`}
          fill="none" stroke={ink} strokeWidth={1} opacity={0.7} />
      </Svg>
    </View>
  );
}

export default function HoopsGame() {
  const t = useT();
  const router = useRouter();
  const best = useBestScore('hoops');

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready');
  const [hud, setHud] = useState({ score: 0, clock: CLOCK, fire: false, dir: 1 });
  const [guide, setGuide] = useState('');
  const [hoops, setHoops] = useState<{ left: Hoop; right: Hoop }>({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // All mutable game state lives in refs so the single rAF loop sees the latest without
  // re-subscribing. React state above is only the parts the screen actually draws.
  const g = useRef({
    bx: 0, by: 0, vy: 0, dir: 1, banked: false,
    score: 0, streak: 0, clock: CLOCK,
    left: { x: 0, y: 0 } as Hoop, right: { x: 0, y: 0 } as Hoop,
    phase: 'ready' as 'ready' | 'playing' | 'over',
    last: 0, acc: 0, w: 0, h: 0,
  }).current;

  const floorY = () => g.h - 46;
  const band = () => [g.h * 0.24, g.h * 0.5] as const;
  const randY = () => { const [a, b] = band(); return a + Math.random() * (b - a); };

  const layout = useCallback((w: number, h: number) => {
    g.w = w; g.h = h;
    g.left = { x: WALL_IN, y: randY() };
    g.right = { x: w - WALL_IN, y: randY() };
    g.bx = WALL_IN + 24; g.by = floorY(); g.vy = 0; g.dir = 1; g.banked = false;
    setHoops({ left: g.left, right: g.right });
    pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
  }, [g, pos]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
    if (width > 0 && height > 0 && g.w === 0) layout(width, height);
  };

  const reset = () => {
    g.score = 0; g.streak = 0; g.clock = CLOCK; g.banked = false; g.phase = 'ready';
    g.left.y = randY(); g.right.y = randY();
    g.bx = WALL_IN + 24; g.by = floorY(); g.vy = 0; g.dir = 1;
    pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
    setHoops({ left: { ...g.left }, right: { ...g.right } });
    setHud({ score: 0, clock: CLOCK, fire: false, dir: 1 });
    setPhase('ready');
    setGuide('');
  };

  const tap = () => {
    if (g.phase === 'over') return;
    if (g.phase === 'ready') { g.phase = 'playing'; setPhase('playing'); }
    g.vy = -JUMP; // each tap sets the upward hop
  };

  const target = () => (g.dir > 0 ? g.right : g.left);

  const scored = (clean: boolean) => {
    g.score += pointsFor(clean, g.streak);
    g.streak = nextStreak(clean, g.streak);
    g.dir = -g.dir;
    g.left.y = randY(); g.right.y = randY();
    g.clock = CLOCK; g.banked = false;
    setHoops({ left: { ...g.left }, right: { ...g.right } });
    setHud({ score: g.score, clock: CLOCK, fire: g.streak >= 2, dir: g.dir });
    if (g.score > (best ?? 0)) recordBest('hoops', g.score);
  };

  const gameOver = () => {
    g.phase = 'over';
    recordBest('hoops', g.score);
    setHud((h) => ({ ...h, score: g.score, clock: 0 }));
    setPhase('over');
  };

  // Project the arc a tap would make from here — the dashed aim guide.
  const aimGuide = () => {
    let x = g.bx, y = g.by, vy = -JUMP;
    const pts: string[] = [];
    for (let i = 0; i < 16; i++) {
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(0)} ${y.toFixed(0)}`);
      x += g.dir * SPEED * 0.05; y += vy * 0.05; vy += G * 0.05;
      if (y > floorY() || x < 0 || x > g.w) break;
    }
    return pts.join(' ');
  };

  // The loop: runs while the screen is focused; steps physics only when playing.
  useFocusEffect(useCallback(() => {
    let raf = 0;
    g.last = 0;
    const frame = (now: number) => {
      if (!g.last) g.last = now;
      const dt = Math.min((now - g.last) / 1000, 0.033);
      g.last = now;
      if (g.phase === 'playing' && g.w > 0) {
        g.clock -= dt;
        if (g.clock <= 0) { gameOver(); raf = requestAnimationFrame(frame); return; }
        const prevY = g.by;
        g.bx += g.dir * SPEED * dt;
        g.vy += G * dt;
        g.by += g.vy * dt;
        if (g.by >= floorY()) { g.by = floorY(); g.vy = 0; }
        // backboard: reaching the wall side within the board's height banks the ball down
        const hoop = target();
        const boardX = hoop.x + g.dir * (RIM_R + 4);
        const atBoard = g.dir > 0 ? g.bx + BALL_R >= boardX : g.bx - BALL_R <= boardX;
        if (atBoard && g.by >= hoop.y - BOARD_H && g.by <= hoop.y + 4) {
          g.bx = hoop.x; g.banked = true; if (g.vy < 0) g.vy = 0;
        }
        // rim crossing (descending, within the opening) = a made basket
        if (prevY < hoop.y && g.by >= hoop.y && g.vy > 0 && Math.abs(g.bx - hoop.x) <= RIM_R) {
          scored(!g.banked && Math.abs(g.bx - hoop.x) <= RIM_R * 0.62);
        }
        // horizontal wrap
        if (g.bx > g.w + BALL_R) { g.bx = -BALL_R; g.banked = false; }
        if (g.bx < -BALL_R) { g.bx = g.w + BALL_R; g.banked = false; }
        pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
        // HUD + guide, a few times a second
        g.acc += dt;
        if (g.acc >= 0.1) {
          g.acc = 0;
          setHud({ score: g.score, clock: Math.max(0, Math.ceil(g.clock)), fire: g.streak >= 2, dir: g.dir });
          setGuide(aimGuide());
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); if (g.phase === 'playing') { g.phase = 'ready'; setPhase('ready'); } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  const onFire = hud.fire;

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
        {onFire && <NbTag color={nb.red} rot={-3}>{t('games.hoopsFire')}</NbTag>}
        <Text style={nbText.mono(12, nb.soft)}>{t('games.hoopsBest', { n: Math.max(best ?? 0, hud.score) })}</Text>
      </View>

      {/* 코트 */}
      <Pressable
        onPressIn={tap}
        onLayout={onLayout}
        style={{ flex: 1, marginTop: 8, marginHorizontal: 14, marginBottom: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.28)', backgroundColor: 'rgba(255,253,244,.55)', overflow: 'hidden' }}
      >
        {/* score, big and centred behind play */}
        <View pointerEvents="none" style={{ position: 'absolute', top: 14, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontFamily: nbFonts.mono, fontSize: 46, fontWeight: '700', color: 'rgba(62,54,43,.16)' }}>{hud.score}</Text>
        </View>

        {/* shot clock */}
        <View pointerEvents="none" style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <NbIcon name="bell" size={13} color={hud.clock <= 3 ? nb.red : nb.soft} />
          <Text style={nbText.mono(15, hud.clock <= 3 ? nb.red : nb.ink)}>{hud.clock}</Text>
        </View>

        {size.w > 0 && (
          <>
            <HoopMark hoop={hoops.right} dir={1} target={hud.dir > 0} />
            <HoopMark hoop={hoops.left} dir={-1} target={hud.dir < 0} />
          </>
        )}

        {/* aim guide */}
        {phase === 'playing' && !!guide && (
          <Svg pointerEvents="none" width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
            <Path d={guide} fill="none" stroke="rgba(62,54,43,.34)" strokeWidth={2} strokeDasharray="4 7" strokeLinecap="round" />
          </Svg>
        )}

        {/* the ball */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', transform: pos.getTranslateTransform() }}>
          <Ball onFire={onFire} />
        </Animated.View>

        {/* prompts */}
        {phase === 'ready' && (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: '42%', alignItems: 'center' }}>
            <Text style={nbText.hand(20)}>{t('games.hoopsTapStart')}</Text>
            <Text style={[nbText.body(11, nb.soft), { marginTop: 4 }]}>{t('games.hoopsTapDunk')}</Text>
          </View>
        )}
        {phase === 'over' && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: '34%', alignItems: 'center' }}>
            <Text style={nbText.hand(26)}>{t('games.hoopsOver')}</Text>
            <Text style={{ fontFamily: nbFonts.mono, fontSize: 40, fontWeight: '700', color: nb.ink, marginTop: 6 }}>
              {hud.score}<Text style={{ fontSize: 15, color: nb.soft }}>{t('games.pointUnit')}</Text>
            </Text>
            <View style={{ marginTop: 14 }}>
              <NbButton variant="yellow" size="lg" icon="star" onPress={reset}>{t('games.hoopsRetry')}</NbButton>
            </View>
          </View>
        )}
      </Pressable>
    </NbSheet>
  );
}
