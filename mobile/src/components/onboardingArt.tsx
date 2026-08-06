// Onboarding pixel art — ports of the design-handoff screens-onboarding decor
// (clouds, sun, airplane), provider glyphs, and pixel flags, plus a banded
// vertical gradient (no native expo-linear-gradient dependency → pure JS Views,
// which also reads as a pleasingly pixelated sky). Shared by splash + login.
import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { colors } from '@/theme/tokens';

const INK = colors.ink;

// ── Banded vertical gradient (top → bottom over N steps) ────────────────────
function hexToRgb(h: string) {
  const s = h.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}
function lerpHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const to = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  return `#${to(ar + (br - ar) * t)}${to(ag + (bg - ag) * t)}${to(ab + (bb - ab) * t)}`;
}
export function VertGradient({ from, to, bands = 14, style }: { from: string; to: string; bands?: number; style?: ViewStyle }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', inset: 0 }, style]}>
      {Array.from({ length: bands }).map((_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: lerpHex(from, to, i / (bands - 1)) }} />
      ))}
    </View>
  );
}

// A gently looping 0→1→0 driver (ease-in-out), shared by the floating art.
function useFloat(durationMs: number) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [v, durationMs]);
  return v;
}

// ── Cloud — stacked pixel lobes; drifts sideways (handoff forinDrift) ────────
export function Cloud({ size = 1, style }: { size?: number; style?: ViewStyle }) {
  const s = 8 * size;
  const t = useFloat(3500 / size); // bigger clouds drift a touch faster (handoff 7/size)
  const drift = useAnimatedStyle(() => ({ transform: [{ translateX: (t.value - 0.5) * 12 }] }));
  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <Animated.View style={drift}>
      <Svg width={s * 9} height={s * 5} viewBox="0 0 36 20">
        <Rect x={10} y={5} width={8} height={4} fill="#fff" />
        <Rect x={6} y={8} width={10} height={4} fill="#fff" />
        <Rect x={16} y={6} width={9} height={3} fill="#fff" />
        <Rect x={4} y={11} width={28} height={4} fill="#fff" />
        <Rect x={22} y={9} width={8} height={5} fill="#fff" />
        <Rect x={14} y={9} width={10} height={2} fill="#fff" />
        <Rect x={6} y={14} width={24} height={1} fill={colors.blue} />
        <Rect x={10} y={15} width={14} height={1} fill={colors.blue} opacity={0.6} />
        <Rect x={11} y={5} width={5} height={1} fill="#fff" />
        <Rect x={4} y={11} width={28} height={1} fill={INK} opacity={0.12} />
      </Svg>
      </Animated.View>
    </View>
  );
}

// ── Pixel sun with a friendly face ──────────────────────────────────────────
export function PixelSun({ size = 72, style }: { size?: number; style?: ViewStyle }) {
  const rays = [
    [17, 0, 2, 5], [17, 31, 2, 5], [0, 17, 5, 2], [31, 17, 5, 2],
    [5, 5, 3, 3], [28, 5, 3, 3], [5, 28, 3, 3], [28, 28, 3, 3],
  ];
  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <Svg width={size} height={size} viewBox="0 0 36 36">
        {rays.map((r, i) => <Rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={colors.yellowDeep} />)}
        <Rect x={10} y={8} width={16} height={20} fill={colors.yellow} />
        <Rect x={8} y={10} width={20} height={16} fill={colors.yellow} />
        <Rect x={11} y={10} width={14} height={16} fill={colors.yellowDeep} />
        <Rect x={10} y={12} width={16} height={12} fill={colors.yellowDeep} />
        <Rect x={12} y={11} width={5} height={3} fill="#FFF7C2" />
        <Rect x={11} y={8} width={14} height={2} fill={INK} />
        <Rect x={11} y={26} width={14} height={2} fill={INK} />
        <Rect x={8} y={11} width={2} height={14} fill={INK} />
        <Rect x={26} y={11} width={2} height={14} fill={INK} />
        <Rect x={14} y={16} width={2} height={3} fill={INK} />
        <Rect x={20} y={16} width={2} height={3} fill={INK} />
        <Rect x={15} y={21} width={6} height={1} fill={INK} />
        <Rect x={13} y={19} width={1} height={1} fill="#F9A8B4" />
        <Rect x={22} y={19} width={1} height={1} fill="#F9A8B4" />
      </Svg>
    </View>
  );
}

// ── Pixel airplane with contrail ────────────────────────────────────────────
export function PixelPlane({ size = 150, style }: { size?: number; style?: ViewStyle }) {
  const t = useFloat(1600); // gentle up/down bob
  const bob = useAnimatedStyle(() => ({ transform: [{ translateY: (t.value - 0.5) * 14 }] }));
  return (
    <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
      <Animated.View style={bob}>
      <Svg width={size} height={(size * 26) / 50} viewBox="0 0 50 26">
        <Rect x={0} y={12} width={3} height={2} fill="#fff" opacity={0.5} />
        <Rect x={4} y={11} width={3} height={3} fill="#fff" opacity={0.7} />
        <Rect x={8} y={4} width={4} height={6} fill={colors.mintShadow} />
        <Rect x={8} y={4} width={4} height={2} fill={colors.mintDeep} />
        <Rect x={9} y={10} width={22} height={5} fill="#fff" />
        <Rect x={31} y={10} width={5} height={5} fill="#fff" />
        <Rect x={36} y={11} width={2} height={3} fill={colors.peachDeep} />
        <Rect x={9} y={14} width={27} height={1} fill={colors.blue} />
        <Rect x={14} y={15} width={13} height={3} fill={colors.mintDeep} />
        <Rect x={14} y={18} width={9} height={2} fill={colors.mintShadow} />
        <Rect x={16} y={7} width={9} height={3} fill={colors.mintDeep} />
        <Rect x={16} y={7} width={9} height={1} fill="#fff" opacity={0.5} />
        {[12, 15, 18, 21, 24, 27].map((wx, i) => <Rect key={i} x={wx} y={11} width={2} height={2} fill={colors.blue} />)}
        <Rect x={32} y={11} width={2} height={2} fill="#3E2E1C" />
      </Svg>
      </Animated.View>
    </View>
  );
}

// ── Provider glyphs ─────────────────────────────────────────────────────────
export function GoogleGlyph({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.3-5.2 3.3-8.8z" />
      <Path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
      <Path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z" />
      <Path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </Svg>
  );
}
export function AppleGlyph({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={(size * 22) / 18} viewBox="0 0 18 22">
      <Path fill={color} d="M14.5 11.6c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.5 2.9 2.4 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.6zM12.3 4.2c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3z" />
    </Svg>
  );
}
export function KakaoGlyph({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#3C1E1E" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
    </Svg>
  );
}

// ── Pixel flags (24×16 field) ───────────────────────────────────────────────
function FlagFrame({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <Svg width={size} height={(size * 2) / 3} viewBox="0 0 24 16">
      <Rect x={0.5} y={0.5} width={23} height={15} fill="#fff" stroke={INK} strokeWidth={1} />
      {children}
    </Svg>
  );
}
export function FlagKR({ size = 44 }: { size?: number }) {
  return (
    <FlagFrame size={size}>
      {/* taegeuk — red over blue */}
      <Path d="M8 8 a4 4 0 0 1 8 0 a2 2 0 0 1 -4 0 a2 2 0 0 0 -4 0 z" fill="#CD2E3A" />
      <Path d="M16 8 a4 4 0 0 1 -8 0 a2 2 0 0 1 4 0 a2 2 0 0 0 4 0 z" fill="#0047A0" />
      {/* trigram bars (simplified, two corners) */}
      <Rect x={3} y={4} width={3} height={0.8} fill={INK} />
      <Rect x={3} y={5.2} width={3} height={0.8} fill={INK} />
      <Rect x={18} y={10} width={3} height={0.8} fill={INK} />
      <Rect x={18} y={11.2} width={3} height={0.8} fill={INK} />
    </FlagFrame>
  );
}
export function FlagJP({ size = 44 }: { size?: number }) {
  return (
    <FlagFrame size={size}>
      <Path d="M12 4 a4 4 0 1 0 0.01 0 z" fill="#BC002D" />
    </FlagFrame>
  );
}
export function FlagUS({ size = 44 }: { size?: number }) {
  return (
    <FlagFrame size={size}>
      {[0, 2, 4, 6, 8, 10, 12, 14].map((y) => (
        <Rect key={y} x={0.5} y={0.5 + y} width={23} height={1} fill={y % 4 === 0 ? '#B22234' : '#fff'} />
      ))}
      <Rect x={0.5} y={0.5} width={10} height={8} fill="#3C3B6E" />
      {[2, 4, 6].map((r) => [2, 4, 6, 8].map((c) => <Rect key={`${r}-${c}`} x={c} y={r} width={0.9} height={0.9} fill="#fff" />))}
    </FlagFrame>
  );
}
export function FlagDE({ size = 44 }: { size?: number }) {
  return (
    <FlagFrame size={size}>
      <Rect x={0.5} y={0.5} width={23} height={5} fill="#000" />
      <Rect x={0.5} y={5.5} width={23} height={5} fill="#DD0000" />
      <Rect x={0.5} y={10.5} width={23} height={5} fill="#FFCE00" />
    </FlagFrame>
  );
}

export const FLAGS: Record<string, (p: { size?: number }) => React.ReactElement> = {
  kr: FlagKR, jp: FlagJP, us: FlagUS, de: FlagDE,
};
