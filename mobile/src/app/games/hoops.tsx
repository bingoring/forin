// 왼오른 농구 — 인게임 (v38 로직 · v39 디자인).
//
// A break-time basketball game. One hoop is on screen at a time; sink it and the ball keeps
// going the other way while the camera pans — the scored hoop slides off its wall and the
// opposite hoop slides in at a NEW height (that shifting height is the difficulty). The ball
// travels in one direction at a constant speed; a tap gives it an upward hop, gravity arcs it
// back, and running off one side wraps it in from the other. A clean swish is 2 points, a
// bank off the board is 1; two clean shots in a row set the ball on fire and every shot after
// is worth 3, until a bank puts it out. A shot clock ticks down between baskets — let it hit
// zero and the game is over. The best score is kept on the device.
//
// The aim guide (dashed arc) shows only before the first tap; once play starts it is gone.
// Two layers: the hoops + floor ride a camera that pans on a basket, while the ball lives in
// a fixed layer so a made shot flows straight on instead of snapping back to a start spot.
// The ball moves every frame through an Animated value (no React re-render per frame); the
// HUD re-renders a few times a second. The scoring rule is pure and unit-tested.
import { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { NbIcon } from '@/components/nb/NbIcon';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { recordBest, useBestScore } from '@/lib/gameScores';
import { useT } from '@/i18n';

// ── tuning (frame-rate independent) ──────────────────────────────────────────
const G_ACC = 1050;  // gravity px/s² — light enough that the ball floats
const JUMP = 440;    // upward speed a tap sets, px/s
const SPEED = 150;   // constant horizontal speed, px/s
const BALL_R = 14;
const RIM_R = 28;    // half the rim opening
const BOARD_H = 52;  // backboard height up from the rim
const CLOCK = 8.0;   // shot-clock seconds, reset on every basket
const WALL_IN = 54;  // how far in from a wall a rim sits
// Camera pan on a basket. Less than a viewport, so mid-slide the outgoing hoop is still
// leaving one edge as the incoming one arrives at the other — both are briefly on screen.
const CAM = 150;

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

/** A hand-drawn basketball (v39): orange radial fill, ink outline, curved seams. */
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

// The hoop art is v39's, drawn with the rim centre at local (42,56) in a 128×130 box. The
// container is placed so that centre lands on (screenX, hoopY); the left wall's hoop is
// mirrored. Rendered at 108px wide → scale 108/128.
const HOOP_W = 108;
const HOOP_SCALE = HOOP_W / 128;
const RIM_LOCAL_X = 42;
const RIM_LOCAL_Y = 56;

/** One hoop against a wall. `dir` says which wall (1 = right, -1 = left → mirrored). The
 *  orientation is FIXED per wall, so neither hoop ever renders flipped the wrong way. */
function Hoop({ screenX, hoopY, dir }: { screenX: number; hoopY: number; dir: number }) {
  const flip = dir < 0;
  const rimLocalX = flip ? 128 - RIM_LOCAL_X : RIM_LOCAL_X;
  const left = screenX - rimLocalX * HOOP_SCALE;
  const top = hoopY - RIM_LOCAL_Y * HOOP_SCALE;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left, top, width: HOOP_W, height: 130 * HOOP_SCALE }}>
      <Svg width="100%" height="100%" viewBox="0 0 128 130">
        <G transform={flip ? 'translate(128,0) scale(-1,1)' : undefined}>
          {/* pole + backboard (side panel) */}
          <Path d="M100 40 H128 V50 H100 Z" fill="#B07F24" stroke={nb.ink} strokeWidth="1.6" />
          <Path d="M100 96 H128 V106 H100 Z" fill="#B07F24" stroke={nb.ink} strokeWidth="1.6" />
          <Rect x="88" y="30" width="12" height="100" fill="#C9922E" stroke={nb.ink} strokeWidth="1.6" />
          <Rect x="76" y="0" width="14" height="92" fill="#EDE8DC" stroke={nb.ink} strokeWidth="1.8" />
          <Rect x="76" y="0" width="14" height="20" fill="#FFFdf4" stroke={nb.ink} strokeWidth="1.8" />
          <Rect x="79" y="56" width="8" height="18" fill="#C9C2B2" />
          {/* rim — blue ellipse (seen slightly from below) */}
          <Ellipse cx="42" cy="56" rx="34" ry="10" fill="none" stroke="#3D7BC4" strokeWidth="7" />
          <Ellipse cx="42" cy="56" rx="34" ry="10" fill="none" stroke={nb.ink} strokeWidth="1.2" opacity="0.35" />
          {/* net — back strands (fainter) then front strands, tapering into a diamond lattice */}
          <G stroke={nb.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.35">
            <Path d="M18 51 Q22 68 26 80 M32 47 Q34 66 35 80 M52 47 Q50 66 49 80 M66 51 Q62 68 58 80" />
            <Path d="M26 80 L31 90 M35 80 L31 90 M49 80 L53 90 M58 80 L53 90 M31 90 L34 102 M53 90 L50 102" />
          </G>
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

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const spin = useRef(new Animated.Value(0)).current;   // ball rotation
  const camX = useRef(new Animated.Value(0)).current;   // camera pan on a basket

  const g = useRef({
    bx: 0, by: 0, vy: 0, dir: 1, banked: false,
    score: 0, streak: 0, clock: CLOCK,
    hyL: 0, hyR: 0,
    phase: 'ready' as 'ready' | 'playing' | 'over',
    last: 0, acc: 0, w: 0, h: 0,
  }).current;

  const floorY = () => g.h - 46;
  const rimBand = () => [g.h * 0.22, g.h * 0.52] as const;
  const randY = () => { const [a, b] = rimBand(); return a + Math.random() * (b - a); };
  const targetX = (dir: number) => (dir > 0 ? g.w - WALL_IN : WALL_IN);
  const targetY = (dir: number) => (dir > 0 ? g.hyR : g.hyL);
  const startX = (dir: number) => (dir > 0 ? WALL_IN - 14 : g.w - WALL_IN + 14);

  const layout = useCallback((w: number, h: number) => {
    g.w = w; g.h = h;
    g.dir = 1; g.hyR = h * 0.35; g.hyL = h * 0.35;
    g.bx = w - WALL_IN < 0 ? 40 : WALL_IN - 14; g.by = h - 46 - BALL_R; g.vy = 0; g.banked = false;
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

  const aimGuide = () => {
    let x = g.bx, y = g.by, vy = -JUMP;
    const pts: string[] = [];
    for (let i = 0; i < 18; i++) {
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(0)} ${y.toFixed(0)}`);
      x += g.dir * SPEED * 0.05; y += vy * 0.05; vy += G_ACC * 0.05;
      if (y > floorY() || x < 0 || x > g.w) break;
    }
    return pts.join(' ');
  };

  const reset = () => {
    g.score = 0; g.streak = 0; g.clock = CLOCK; g.banked = false; g.phase = 'ready'; g.dir = 1;
    g.hyR = randY(); g.hyL = randY();
    g.bx = startX(1); g.by = floorY() - BALL_R; g.vy = 0;
    setHoopY({ left: g.hyL, right: g.hyR });
    camX.setValue(0);
    pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
    setHud({ score: 0, clock: CLOCK, fire: false });
    setPhase('ready');
    setGuide(aimGuide());
  };

  const tap = () => {
    if (g.phase === 'over') return;
    if (g.phase === 'ready') { g.phase = 'playing'; setPhase('playing'); setGuide(''); }
    g.vy = -JUMP;
  };

  const scored = (clean: boolean) => {
    g.score += pointsFor(clean, g.streak);
    g.streak = nextStreak(clean, g.streak);
    g.dir = -g.dir;
    g.clock = CLOCK; g.banked = false;
    // the incoming hoop takes a fresh height — the ball is NOT moved; it flows on the other way
    if (g.dir > 0) g.hyR = randY(); else g.hyL = randY();
    setHoopY({ left: g.hyL, right: g.hyR });
    // camera pans to the new wall (steady: right→0, left→CAM), so the scored hoop slides off
    // its side while the next slides in from the other — both share the screen mid-slide.
    Animated.timing(camX, { toValue: g.dir > 0 ? 0 : CAM, duration: 550, easing: Easing.bezier(0.3, 0.7, 0.3, 1), useNativeDriver: true }).start();
    setHud({ score: g.score, clock: CLOCK, fire: g.streak >= 2 });
    if (g.score > (best ?? 0)) recordBest('hoops', g.score);
  };

  const gameOver = () => {
    g.phase = 'over';
    recordBest('hoops', g.score);
    setHud((h) => ({ ...h, score: g.score, clock: 0 }));
    setPhase('over');
  };

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
        const hx = targetX(g.dir);
        const hy = targetY(g.dir);
        g.bx += g.dir * SPEED * dt;
        g.vy += G_ACC * dt;
        g.by += g.vy * dt;
        if (g.by >= floorY()) { g.by = floorY(); g.vy = 0; }
        // backboard: reaching the wall side within the board's height banks it down
        const boardX = hx + g.dir * (RIM_R + 4);
        const atBoard = g.dir > 0 ? g.bx + BALL_R >= boardX : g.bx - BALL_R <= boardX;
        if (atBoard && g.by >= hy - BOARD_H && g.by <= hy + 4) {
          g.bx = hx; g.banked = true; if (g.vy < 0) g.vy = 0;
        }
        // rim crossing (descending, within the opening) = a made basket
        if (prevY < hy && g.by >= hy && g.vy > 0 && Math.abs(g.bx - hx) <= RIM_R) {
          scored(!g.banked && Math.abs(g.bx - hx) <= RIM_R * 0.62);
        }
        // horizontal wrap
        if (g.bx > g.w + BALL_R) { g.bx = -BALL_R; g.banked = false; }
        if (g.bx < -BALL_R) { g.bx = g.w + BALL_R; g.banked = false; }
        pos.setValue({ x: g.bx - BALL_R, y: g.by - BALL_R });
        spin.setValue(g.bx);
        g.acc += dt;
        if (g.acc >= 0.1) {
          g.acc = 0;
          setHud({ score: g.score, clock: Math.max(0, Math.ceil(g.clock)), fire: g.streak >= 2 });
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

      {/* 코트 (뷰포트) */}
      <Pressable
        onPressIn={tap}
        onLayout={onLayout}
        style={{ flex: 1, marginTop: 10, marginHorizontal: 20, marginBottom: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.3)', backgroundColor: 'rgba(255,253,244,.6)', overflow: 'hidden' }}
      >
        {/* 점수 스탬프 */}
        <View pointerEvents="none" style={{ position: 'absolute', right: 12, top: 10, zIndex: 3, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Text style={nbText.hand(13, nb.soft)}>{t('games.hoopsScoreLabel')}</Text>
          <Text style={{ fontFamily: nbFonts.mono, fontSize: 22, fontWeight: '700', color: nb.ink }}>{hud.score}</Text>
        </View>
        {/* 샷클락 */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 12, top: 12, zIndex: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <NbIcon name="bell" size={13} color={hud.clock <= 3 ? nb.red : nb.soft} />
          <Text style={nbText.mono(15, hud.clock <= 3 ? nb.red : nb.ink)}>{hud.clock}</Text>
        </View>

        {/* 골대 레이어 — 카메라가 translateX로 슬라이드 (공은 아래 고정 레이어) */}
        {size.w > 0 && (
          <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: [{ translateX: camX }] }}>
            {/* right hoop at its wall (visible at camX 0); left hoop parked CAM to the left
                (visible at camX CAM). CAM < viewport, so both peek in during the slide. */}
            <Hoop screenX={size.w - WALL_IN} hoopY={hoopY.right} dir={1} />
            <Hoop screenX={WALL_IN - CAM} hoopY={hoopY.left} dir={-1} />
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
            <Animated.View style={{ position: 'absolute', transform: [...pos.getTranslateTransform(), { rotate }] }}>
              <Ball onFire={onFire} />
            </Animated.View>
          </View>
        )}

        {/* prompts */}
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
