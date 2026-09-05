// 왼오른 농구 — 인게임 (v38 로직 · v39 디자인).
//
// A break-time basketball game. One hoop is on screen at a time; sink it and the ball keeps
// its spot while the camera pans — the scored hoop slides off its wall and the opposite hoop
// slides in at a NEW height. Untapped, the ball sits still; a tap launches it forward at a set
// speed and hops it up, and it keeps that forward speed until the next basket. The ball is fat
// (~fills the rim), so only a well-centred drop goes in; anything else clips a rim edge and
// bounces, and the net billows when a shot swishes through. Gravity is asymmetric — a floaty
// rise, a snappy fall. A clean swish is 2 points, a rattle/bank 1; two clean in a row light
// the ball on fire for 3, until a bank puts it out. A 6-second shot clock ticks between
// baskets; the last second runs in slow motion, and a shot still in the air when it hits zero
// gets to finish. Only a descent through the rim from ABOVE scores.
//
// The rim is split into a far half (behind the ball) and a near half (in front). Physics is
// sub-stepped so a fast ball never tunnels through the rim. The scoring rule is pure/tested.
import { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { recordBest, useBestScore } from '@/lib/gameScores';
import { useT } from '@/i18n';

// ── tuning ───────────────────────────────────────────────────────────────────
const G_UP = 1800;   // gravity while rising, px/s²
const G_DOWN = 2700; // gravity while falling, px/s² (snappy — hard to time)
const JUMP = 780;    // upward speed a tap sets, px/s (fast, high hop)
const SPEED = 175;   // forward speed a tap sets (unchanged), px/s
const BALL_R = 23;   // fat ball — a tight fit through the rim
const RIM_R = 28;    // half the rim opening
const SCORE_GAP = RIM_R - BALL_R + 6; // a descent within this of centre drops in; rest clips
const BOARD_H = 66;  // backboard collision height up from the rim
const CLOCK = 6.0;
const WALL_IN = 54;
const CAM = 150;
const FLOOR_REST = 0.42;
const RIM_REST = 0.5;
const REST_STOP = 55;
const SLOW = 0.45;

export function pointsFor(clean: boolean, cleanStreak: number): number {
  if (!clean) return 1;
  return cleanStreak >= 2 ? 3 : 2;
}
export function nextStreak(clean: boolean, cleanStreak: number): number {
  return clean ? cleanStreak + 1 : 0;
}

function Ball({ onFire }: { onFire: boolean }) {
  return (
    <Svg width={BALL_R * 2} height={BALL_R * 2} viewBox="0 0 28 28">
      <Defs>
        <RadialGradient id="nbxBall" cx="0.35" cy="0.3" r="0.9">
          <Stop offset="0" stopColor="#F5A94B" />
          <Stop offset="1" stopColor="#D97B23" />
        </RadialGradient>
      </Defs>
      {onFire && (
        <Path d="M14 -2 Q18 3 16 7 Q21 5 20 10 Q14 6 8 10 Q7 5 12 7 Q10 3 14 -2 Z" fill="#E9C45A" stroke={nb.red} strokeWidth={1} />
      )}
      <Circle cx="14" cy="14" r="12.5" fill="url(#nbxBall)" stroke={nb.ink} strokeWidth="1.8" />
      <Path d="M14 1.5 Q10 14 14 26.5 M1.5 14 Q14 10 26.5 14 M4.5 5.5 Q14 13 23.5 5.5 M4.5 22.5 Q14 15 23.5 22.5" fill="none" stroke="#8A4A12" strokeWidth="1.4" />
    </Svg>
  );
}

// Rim centre at local (42,84) in a 136×182 box (content shifted down 28 so the tall
// backboard reaches the collision top and nothing clips). Rendered 112px wide.
const HOOP_W = 112;
const HOOP_VB_W = 136;
const HOOP_VB_H = 182;
const HOOP_SCALE = HOOP_W / HOOP_VB_W;
const RIM_LOCAL_X = 42;
const RIM_LOCAL_Y = 84;   // content is shifted down 28 (see the hoop groups), rim local 56 → 84

function hoopBox(screenX: number, hoopY: number, flip: boolean) {
  const rimLocalX = flip ? HOOP_VB_W - RIM_LOCAL_X : RIM_LOCAL_X;
  return {
    left: screenX - rimLocalX * HOOP_SCALE,
    top: hoopY - RIM_LOCAL_Y * HOOP_SCALE,
    width: HOOP_W,
    height: HOOP_VB_H * HOOP_SCALE,
  };
}

/** Far half of a hoop (behind the ball): pole, big backboard, the rim→board bridge, back rim
 *  arc, back net. Everything is shifted down 28 via the outer group. */
function HoopBack({ screenX, hoopY, dir }: { screenX: number; hoopY: number; dir: number }) {
  const flip = dir < 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', ...hoopBox(screenX, hoopY, flip) }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${HOOP_VB_W} ${HOOP_VB_H}`}>
        <G transform={flip ? `translate(${HOOP_VB_W},28) scale(-1,1)` : 'translate(0,28)'}>
          {/* pole to the wall + vertical post */}
          <Path d="M108 40 H136 V50 H108 Z" fill="#B07F24" stroke={nb.ink} strokeWidth="1.6" />
          <Path d="M108 100 H136 V110 H108 Z" fill="#B07F24" stroke={nb.ink} strokeWidth="1.6" />
          <Rect x="96" y="26" width="12" height="120" fill="#C9922E" stroke={nb.ink} strokeWidth="1.6" />
          {/* backboard — top reaches the collision top (BOARD_H above the rim); the rim mounts
              about a third up from its bottom edge (h120 with the rim at local 56). */}
          <Rect x="84" y="-24" width="18" height="120" fill="#EDE8DC" stroke={nb.ink} strokeWidth="1.8" />
          <Rect x="84" y="-24" width="18" height="26" fill="#FFFdf4" stroke={nb.ink} strokeWidth="1.8" />
          {/* bridge — the rim material carried straight to the board's side edge (x84) */}
          <Path d="M70 56 H84" stroke="#3D7BC4" strokeWidth="6.5" strokeLinecap="round" />
          <Path d="M70 56 H84" stroke={nb.ink} strokeWidth="1.2" opacity="0.4" />
          {/* back rim arc (far — the top of the ellipse) */}
          <Path d="M8 56 A34 10 0 0 1 76 56" fill="none" stroke="#3D7BC4" strokeWidth="7" />
          <Path d="M8 56 A34 10 0 0 1 76 56" fill="none" stroke={nb.ink} strokeWidth="1.2" opacity="0.35" />
          {/* back net strands */}
          <G stroke={nb.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.35">
            <Path d="M18 51 Q22 68 26 80 M32 47 Q34 66 35 80 M52 47 Q50 66 49 80 M66 51 Q62 68 58 80" />
            <Path d="M26 80 L31 90 M35 80 L31 90 M49 80 L53 90 M58 80 L53 90 M31 90 L34 102 M53 90 L50 102" />
          </G>
        </G>
      </Svg>
    </View>
  );
}

/** Near rim arc (in front of the ball). */
function HoopFrontRim({ screenX, hoopY, dir }: { screenX: number; hoopY: number; dir: number }) {
  const flip = dir < 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', ...hoopBox(screenX, hoopY, flip) }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${HOOP_VB_W} ${HOOP_VB_H}`}>
        <G transform={flip ? `translate(${HOOP_VB_W},28) scale(-1,1)` : 'translate(0,28)'}>
          <Path d="M8 56 A34 10 0 0 0 76 56" fill="none" stroke="#3D7BC4" strokeWidth="7" />
          <Path d="M8 56 A34 10 0 0 0 76 56" fill="none" stroke={nb.ink} strokeWidth="1.2" opacity="0.35" />
        </G>
      </Svg>
    </View>
  );
}

/** Front net (in front of the ball). Kept separate so it can billow on a swish. */
function HoopFrontNet({ screenX, hoopY, dir }: { screenX: number; hoopY: number; dir: number }) {
  const flip = dir < 0;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', ...hoopBox(screenX, hoopY, flip) }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${HOOP_VB_W} ${HOOP_VB_H}`}>
        <G transform={flip ? `translate(${HOOP_VB_W},28) scale(-1,1)` : 'translate(0,28)'}>
          <G stroke={nb.ink} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8">
            <Path d="M10 60 Q14 72 21 82 M22 64 Q25 74 29 84 M34 66 Q35 76 37 85 M48 66 Q47 76 45 85 M60 64 Q57 74 53 84 M74 60 Q68 72 61 82" />
            <Path d="M21 82 L26 93 M29 84 L26 93 M29 84 L33 93 M37 85 L33 93 M37 85 L41 93 M45 85 L41 93 M45 85 L49 93 M53 84 L49 93 M53 84 L56 93 M61 82 L56 93" />
            <Path d="M26 93 L30 104 M33 93 L36 104 M41 93 L41 104 M49 93 L46 104 M56 93 L52 104" />
            <Path d="M30 104 Q41 108 52 104" />
          </G>
        </G>
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
  const [hud, setHud] = useState({ score: 0, clock: CLOCK, fire: false });
  const [hoopY, setHoopY] = useState({ left: 0, right: 0 });
  const [guide, setGuide] = useState('');
  const [pop, setPop] = useState<{ text: string; x: number; y: number; fire: boolean } | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const spin = useRef(new Animated.Value(0)).current;
  const camX = useRef(new Animated.Value(0)).current;
  const jig = useRef(new Animated.Value(0)).current;   // rim rattle
  const netB = useRef(new Animated.Value(0)).current;  // net billow
  const popA = useRef(new Animated.Value(0)).current;  // +N score popup

  const g = useRef({
    bx: 0, by: 0, vx: 0, vy: 0, dir: 1, touchedRim: false,
    score: 0, streak: 0, clock: CLOCK, over2: false, otAcc: 0, lastJig: 0,
    hyL: 0, hyR: 0,
    phase: 'ready' as 'ready' | 'playing' | 'over',
    last: 0, acc: 0, w: 0, h: 0,
  }).current;

  const floorY = () => g.h - 46 - BALL_R;
  const rimBand = () => [g.h * 0.22, g.h * 0.5] as const;
  const randY = () => { const [a, b] = rimBand(); return a + Math.random() * (b - a); };
  const targetX = (dir: number) => (dir > 0 ? g.w - WALL_IN : WALL_IN);
  const targetY = (dir: number) => (dir > 0 ? g.hyR : g.hyL);
  const startX = (dir: number) => (dir > 0 ? WALL_IN - 14 : g.w - WALL_IN + 14);

  const aimGuide = () => {
    let x = g.bx, y = g.by, vy = -JUMP;
    const pts: string[] = [];
    for (let i = 0; i < 18; i++) {
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(0)} ${y.toFixed(0)}`);
      x += g.dir * SPEED * 0.05; y += vy * 0.05; vy += (vy > 0 ? G_DOWN : G_UP) * 0.05;
      if (y > floorY() || x < 0 || x > g.w) break;
    }
    return pts.join(' ');
  };

  const layout = useCallback((w: number, h: number) => {
    g.w = w; g.h = h;
    g.dir = 1; g.hyR = h * 0.35; g.hyL = h * 0.35;
    g.bx = startX(1); g.by = h - 46 - BALL_R; g.vx = 0; g.vy = 0; g.touchedRim = false;
    setHoopY({ left: g.hyL, right: g.hyR });
    camX.setValue(0);
    pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
    if (g.phase === 'ready') setGuide(aimGuide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g, pos, camX]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
    if (width > 0 && height > 0 && g.w === 0) layout(width, height);
  };

  const reset = () => {
    g.score = 0; g.streak = 0; g.clock = CLOCK; g.touchedRim = false; g.phase = 'ready'; g.dir = 1;
    g.over2 = false; g.otAcc = 0;
    g.hyR = randY(); g.hyL = randY();
    g.bx = startX(1); g.by = floorY(); g.vx = 0; g.vy = 0;
    setHoopY({ left: g.hyL, right: g.hyR });
    camX.setValue(0);
    pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
    setHud({ score: 0, clock: CLOCK, fire: false });
    setPhase('ready');
    setGuide(aimGuide());
    trailRef.current = []; setTrail([]); setPop(null);
  };

  const tap = () => {
    if (g.phase === 'over') return;
    if (g.phase === 'ready') { g.phase = 'playing'; setPhase('playing'); setGuide(''); }
    g.vy = -JUMP;
    g.vx = g.dir * SPEED;
  };

  const rattle = (now: number) => {
    if (now - g.lastJig < 130) return;
    g.lastJig = now;
    jig.setValue(0);
    Animated.sequence([
      Animated.timing(jig, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(jig, { toValue: 0, duration: 220, easing: Easing.elastic(2.4), useNativeDriver: true }),
    ]).start();
  };

  const billow = () => {
    netB.setValue(0);
    Animated.sequence([
      Animated.timing(netB, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(netB, { toValue: 0, duration: 360, easing: Easing.elastic(1.5), useNativeDriver: true }),
    ]).start();
  };

  const scored = (clean: boolean) => {
    billow();
    const pts = pointsFor(clean, g.streak);
    // +N floats up from the hoop that was just made (before the direction flips)
    setPop({ text: `+${pts}`, x: targetX(g.dir), y: targetY(g.dir) - 14, fire: g.streak >= 2 });
    popA.setValue(0);
    Animated.timing(popA, { toValue: 1, duration: 760, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    g.score += pts;
    g.streak = nextStreak(clean, g.streak);
    g.dir = -g.dir;
    g.clock = CLOCK; g.touchedRim = false; g.over2 = false; g.otAcc = 0;
    g.vx = 0;
    if (g.dir > 0) g.hyR = randY(); else g.hyL = randY();
    setHoopY({ left: g.hyL, right: g.hyR });
    Animated.timing(camX, { toValue: g.dir > 0 ? 0 : CAM, duration: 550, easing: Easing.bezier(0.3, 0.7, 0.3, 1), useNativeDriver: true }).start();
    setHud({ score: g.score, clock: CLOCK, fire: g.streak >= 2 });
    if (g.score > (best ?? 0)) recordBest('hoops', g.score);
  };

  const gameOver = () => {
    g.phase = 'over'; g.over2 = false;
    recordBest('hoops', g.score);
    setHud((h) => ({ ...h, score: g.score, clock: 0 }));
    setPhase('over');
    trailRef.current = []; setTrail([]);
  };

  useFocusEffect(useCallback(() => {
    let raf = 0;
    g.last = 0;
    const frame = (now: number) => {
      if (!g.last) g.last = now;
      const rawDt = Math.min((now - g.last) / 1000, 0.033);
      g.last = now;
      if (g.phase === 'playing' && g.w > 0) {
        const slow = (g.clock < 1 || g.over2) ? SLOW : 1;
        const dt = rawDt * slow;
        if (!g.over2) {
          g.clock -= dt;
          if (g.clock <= 0) {
            g.clock = 0;
            if (g.by < floorY() - 2 || g.vy < -20) { g.over2 = true; g.otAcc = 0; }
            else { gameOver(); raf = requestAnimationFrame(frame); return; }
          }
        } else {
          g.otAcc += rawDt;
        }

        const hx = targetX(g.dir);
        const hy = targetY(g.dir);
        // sub-step so a fast ball can't tunnel through the rim between frames
        const steps = Math.max(1, Math.ceil((Math.abs(g.vx) + Math.abs(g.vy)) * dt / 5));
        const sdt = dt / steps;
        let made = false;
        for (let s = 0; s < steps; s++) {
          const prevY = g.by;
          g.vy += (g.vy > 0 ? G_DOWN : G_UP) * sdt;
          g.bx += g.vx * sdt;
          g.by += g.vy * sdt;
          if (g.by >= floorY()) { g.by = floorY(); g.vy = g.vy > REST_STOP ? -g.vy * FLOOR_REST : 0; }
          const dxr = g.bx - hx;
          if (prevY < hy && g.by >= hy && g.vy > 0 && Math.abs(dxr) <= SCORE_GAP) {
            // clean = it never touched the RIM (a bank off the board still counts as clean)
            made = true; break;
          } else if (prevY > hy && g.by <= hy && g.vy < 0 && Math.abs(dxr) <= RIM_R) {
            g.by = hy + 3; g.vy = Math.abs(g.vy) * RIM_REST; g.touchedRim = true; rattle(now);
          } else {
            for (const ex of [hx - RIM_R, hx + RIM_R]) {
              const dx = g.bx - ex, dy = g.by - hy;
              const d = Math.hypot(dx, dy) || 0.0001;
              if (d < BALL_R) {
                const nx = dx / d, ny = dy / d;
                const vn = g.vx * nx + g.vy * ny;
                if (vn < 0) {
                  g.vx -= (1 + RIM_REST) * vn * nx;
                  g.vy -= (1 + RIM_REST) * vn * ny;
                  g.bx = ex + nx * BALL_R; g.by = hy + ny * BALL_R;
                  g.touchedRim = true; rattle(now);
                }
              }
            }
            // backboard as a solid rectangle (front face + top face), not just a line:
            // its top has a surface, and nothing can pass to the wall side of the front.
            const bFront = hx + g.dir * (RIM_R + 6); // court-side face
            const bTop = hy - BOARD_H;
            const bBot = hy + 10;
            const overBoard = g.dir > 0 ? g.bx >= bFront - BALL_R : g.bx <= bFront + BALL_R;
            if (g.vy > 0 && overBoard && g.by + BALL_R >= bTop && g.by - BALL_R < bTop) {
              // dropping onto the top face — bounce up (a miss); the board never disqualifies clean
              g.by = bTop - BALL_R; g.vy = -g.vy * RIM_REST; rattle(now);
            } else {
              const reachedFront = g.dir > 0 ? g.bx + BALL_R >= bFront : g.bx - BALL_R <= bFront;
              if (reachedFront && g.by >= bTop && g.by <= bBot) {
                g.bx = bFront - g.dir * BALL_R;
                if (g.dir > 0 ? g.vx > 0 : g.vx < 0) g.vx = -g.vx * RIM_REST;
                rattle(now);
              }
            }
          }
        }
        if (made) scored(!g.touchedRim);

        if (g.bx > g.w + BALL_R) { g.bx = -BALL_R; g.touchedRim = false; }
        if (g.bx < -BALL_R) { g.bx = g.w + BALL_R; g.touchedRim = false; }
        pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
        spin.setValue(g.bx);
        // fire trail: sample the ball's path while on fire, so a flame lingers behind it
        const hot = g.streak >= 2;
        if (hot) { trailRef.current.unshift({ x: g.bx, y: g.by }); if (trailRef.current.length > 12) trailRef.current.pop(); }
        else if (trailRef.current.length) trailRef.current = [];

        if (g.over2) {
          const landed = g.by >= floorY() - 1 && Math.abs(g.vy) < REST_STOP;
          if (landed || g.otAcc > 3.4) { gameOver(); raf = requestAnimationFrame(frame); return; }
        }

        g.acc += rawDt;
        if (g.acc >= 0.1) {
          g.acc = 0;
          setHud({ score: g.score, clock: Math.max(0, Math.ceil(g.clock)), fire: hot });
          setTrail(hot ? trailRef.current.slice() : []);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); if (g.phase === 'playing') { g.phase = 'ready'; setPhase('ready'); } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  const onFire = hud.fire;
  const rotate = spin.interpolate({ inputRange: [0, 120], outputRange: ['0deg', '360deg'] });
  const jigY = jig.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const camTransform = [{ translateX: camX }, { translateY: jigY }];
  const netTransform = [
    { translateX: camX },
    { translateY: Animated.add(jigY, netB.interpolate({ inputRange: [0, 1], outputRange: [0, 7] })) },
    { scaleY: netB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] }) },
    { scaleX: netB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) },
  ];

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: TOP_INSET, paddingHorizontal: 20, gap: 10 }}>
        <Pressable onPress={() => router.back()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3, paddingVertical: 3, paddingHorizontal: 8, transform: [{ rotate: '-1deg' }] }}>
            <NbIcon name="cross" size={11} />
            <Text style={nbText.hand(15)}>{t('games.stop')}</Text>
          </View>
        </Pressable>
        <View style={{ flex: 1 }} />
        {onFire && <NbTag color={nb.red} rot={-3}>{t('games.hoopsFire')}</NbTag>}
        <Text style={nbText.hand(13, nb.soft)}>{t('games.hoopsBestLabel')}</Text>
        <Text style={{ fontFamily: nbFonts.mono, fontSize: 15, fontWeight: '700', color: nb.ink }}>{Math.max(best ?? 0, hud.score)}</Text>
      </View>

      <Pressable
        onPressIn={tap}
        onLayout={onLayout}
        style={{ flex: 1, marginTop: 10, marginHorizontal: 20, marginBottom: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)', backgroundColor: 'rgba(255,253,244,.6)', overflow: 'hidden' }}
      >
        <View pointerEvents="none" style={{ position: 'absolute', right: 12, top: 10, zIndex: 3, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Text style={nbText.hand(13, nb.soft)}>{t('games.hoopsScoreLabel')}</Text>
          <Text style={{ fontFamily: nbFonts.mono, fontSize: 22, fontWeight: '700', color: nb.ink }}>{hud.score}</Text>
        </View>
        <View pointerEvents="none" style={{ position: 'absolute', left: 12, top: 12, zIndex: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <NbIcon name="bell" size={13} color={hud.clock <= 3 ? nb.red : nb.soft} />
          <Text style={nbText.mono(15, hud.clock <= 3 ? nb.red : nb.ink)}>{hud.clock}</Text>
        </View>

        {/* 골대 뒤쪽 */}
        {size.w > 0 && (
          <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: camTransform }}>
            <HoopBack screenX={size.w - WALL_IN} hoopY={hoopY.right} dir={1} />
            <HoopBack screenX={WALL_IN - CAM} hoopY={hoopY.left} dir={-1} />
          </Animated.View>
        )}

        {/* 고정 레이어 — 바닥선, 궤적, 공 */}
        {size.w > 0 && (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: size.h - 46, borderTopWidth: 2, borderTopColor: 'rgba(62,54,43,.5)' }} />
            {phase === 'ready' && !!guide && (
              <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
                <Path d={guide} fill="none" stroke="rgba(62,54,43,.34)" strokeWidth={2} strokeDasharray="4 7" strokeLinecap="round" />
              </Svg>
            )}
            {/* fire trail (on a 3-point streak) — flames linger along the ball's path */}
            {onFire && trail.length > 1 && (
              <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
                {trail.map((p, i) => (
                  <Circle key={i} cx={p.x} cy={p.y} r={BALL_R * (1 - i / trail.length) * 0.85}
                    fill={i % 2 ? '#F5A94B' : '#E9C45A'} opacity={0.5 * (1 - i / trail.length)} />
                ))}
              </Svg>
            )}
            <Animated.View style={{ position: 'absolute', transform: [...pos.getTranslateTransform(), { rotate }] }}>
              <Ball onFire={onFire} />
            </Animated.View>
            {/* +N score popup, floating up from the made hoop */}
            {pop && (
              <Animated.Text
                style={{
                  position: 'absolute', left: pop.x - 30, top: pop.y - 26, width: 60, textAlign: 'center',
                  fontFamily: nbFonts.mono, fontSize: 26, fontWeight: '700',
                  color: pop.fire ? nb.red : nb.ink,
                  opacity: popA.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
                  transform: [{ translateY: popA.interpolate({ inputRange: [0, 1], outputRange: [0, -38] }) }],
                }}
              >
                {pop.text}
              </Animated.Text>
            )}
          </View>
        )}

        {/* 골대 앞쪽 — 가까운 림 + 출렁이는 그물 (공보다 앞) */}
        {size.w > 0 && (
          <>
            <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: camTransform }}>
              <HoopFrontRim screenX={size.w - WALL_IN} hoopY={hoopY.right} dir={1} />
              <HoopFrontRim screenX={WALL_IN - CAM} hoopY={hoopY.left} dir={-1} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: netTransform }}>
              <HoopFrontNet screenX={size.w - WALL_IN} hoopY={hoopY.right} dir={1} />
              <HoopFrontNet screenX={WALL_IN - CAM} hoopY={hoopY.left} dir={-1} />
            </Animated.View>
          </>
        )}

        {phase === 'ready' && (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: '48%', alignItems: 'center' }}>
            <Text style={nbText.hand(23)}>{t('games.hoopsTapStart')}</Text>
            <Text style={[nbText.body(11.5, nb.soft), { marginTop: 4, textAlign: 'center', paddingHorizontal: 30 }]}>{t('games.hoopsTapDunk')}</Text>
          </View>
        )}
        {phase === 'over' && (
          <View style={{ position: 'absolute', left: 0, right: 0, top: '38%', alignItems: 'center', zIndex: 4 }}>
            <Text style={nbText.hand(26)}>{t('games.hoopsOver')}</Text>
            <Text style={{ fontFamily: nbFonts.mono, fontSize: 40, fontWeight: '700', color: nb.ink, marginTop: 6 }}>
              {hud.score}<Text style={{ fontSize: 15, color: nb.soft }}>{t('games.pointUnit')}</Text>
            </Text>
            <Pressable onPress={reset} style={{ marginTop: 14 }}>
              <View style={{ borderWidth: 1.7, borderColor: nb.ink, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 20, backgroundColor: 'rgba(249,227,123,.55)' }}>
                <Text style={nbText.hand(17)}>↺ {t('games.hoopsRetry')}</Text>
              </View>
            </Pressable>
          </View>
        )}
      </Pressable>

      <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
        <View style={{ borderWidth: 1.4, borderStyle: 'dashed', borderColor: nb.blue, borderRadius: 3, backgroundColor: `${nb.blue}10`, paddingVertical: 8, paddingHorizontal: 11, transform: [{ rotate: '-0.3deg' }] }}>
          <Text style={nbText.hand(13.5)}><Text style={{ color: nb.blue }}>{t('games.hoopsRuleLabel')} </Text>{t('games.hoopsRule')}</Text>
        </View>
      </View>
    </NbSheet>
  );
}
