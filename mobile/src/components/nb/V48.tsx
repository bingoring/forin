// v48 공통 신호 키트 — 홈 v47 풍. 핸드오프 v49 `forin-notebook-v48-kit.jsx` (window.V48) 1:1.
//
// 뜻 하나에 모양 하나 — 글 없이 신호로 말한다.
//   지금 할 것 = 노란 ▶ 원 + 숨 쉬는 후광(Go · GoBar)   진행 중 = 노란 링(Ring)
//   끝냈다 = 초록 이중선 + 체크, 쾅(Done)               아직 못 한다 = 점선 원 + 자물쇠, 흐림(Locked)
//   새로 온 것 = 빨간 숫자 원, 처음 한 번 흔들림(NewDot)   수치 = 알약(Pill) · 아이콘 원(IconDot) · 펼침 ⌄(Chev)
//
// 값(크기·색·테두리·기울기)은 reference 그대로이고, 움직임은 nbMotion의 V48_* 이다.
// 홈의 '이어서' 바(HomeCal ContinueBar)도 이 부품으로 지어서 한 구현으로 합쳤다 — 홈 값과 다른 곳은
// GoBar의 선택 속성(pad·gap·goSize·halo·shadow)으로 열어 두었고 기본값은 reference다.
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbDoubleRing } from '@/components/nb/NbUI';
import {
  CSS_EASE, stampSpec, useNbMotion, useReduceMotion, useV48Loop, useV48Press, V48_BREATHE, V48_GO_SHADOW, V48_MOTION,
} from '@/components/nb/nbMotion';
import { nb, nbFonts } from '@/theme/nb';

/** reference의 `K`. */
export const V48_K = { ink: nb.ink, paper: nb.paper, yellow: nb.marker, green: nb.green, red: nb.red, soft: nb.soft } as const;
const K = V48_K;

// ── ▶ ─────────────────────────────────────────────────────────────────────

/** 잉크 ▶ — viewBox 24, `M8.5 5.5 L18.5 12 L8.5 18.5 Z`, 선 2. */
export function V48Tri({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M8.5 5.5 L18.5 12 L8.5 18.5 Z" fill={K.ink} stroke={K.ink} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

// ── 후광 ──────────────────────────────────────────────────────────────────

/** 원 둘레의 숨 쉬는 후광 — `0 0 0 7px rgba(249,227,123,.55)`가 0 → 7px로 자랐다 돌아온다.
 *  원 뒤에 깔리는 채운 원이라(원이 안쪽을 덮는다) 크기가 (r → r+7)로 커지는 것이 곧 spread다. */
function CircleHalo({ size }: { size: number }) {
  const p = useV48Loop('breathe');
  const s = V48_BREATHE.spread;
  const big = size + 2 * s;
  return (
    <Animated.View pointerEvents="none" testID="v48-halo"
      style={{
        position: 'absolute', left: -s, top: -s, width: big, height: big, borderRadius: big / 2,
        backgroundColor: V48_BREATHE.color, opacity: p,
        transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [size / big, 1] }) }],
      }} />
  );
}

/** 바 둘레의 후광 — 홈 '이어서' 바(home3)는 후광이 바 전체를 두른다. */
function BarHalo({ radius, color }: { radius: number; color: string }) {
  const p = useV48Loop('breathe');
  const s = V48_BREATHE.spread;
  return (
    <Animated.View pointerEvents="none" testID="v48-halo"
      style={{ position: 'absolute', left: -s, right: -s, top: -s, bottom: -s, borderRadius: radius + s, borderWidth: s, borderColor: color, opacity: p }} />
  );
}

// ── Go ────────────────────────────────────────────────────────────────────

/** 지금 할 것 — 노란 ▶ 원 + 숨 쉬는 후광(`.v48-go`). */
export function Go({ size = 44, onPress, style, borderColor = K.ink, halo = true, shadow = true, testID, accessibilityLabel }: {
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** 테두리 색 — 잉크(기본) · GoBar 안에서는 종이색. */
  borderColor?: string;
  halo?: boolean;
  shadow?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}) {
  const press = useV48Press('press');
  const circle = (
    <View style={{ width: size, height: size }}>
      {halo && <CircleHalo size={size} />}
      {shadow && (
        <View pointerEvents="none" style={{ position: 'absolute', left: V48_GO_SHADOW.dx, top: V48_GO_SHADOW.dy, width: size, height: size, borderRadius: size / 2, backgroundColor: V48_GO_SHADOW.color }} />
      )}
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: K.yellow, borderWidth: 2, borderColor, alignItems: 'center', justifyContent: 'center' }}>
        <V48Tri size={size * 0.5} />
      </View>
    </View>
  );
  return (
    <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel} testID={testID ?? 'v48-go'}
      style={[{ flexShrink: 0 }, style]}>
      <Animated.View style={{ transform: press.transform }}>{circle}</Animated.View>
    </Pressable>
  );
}

/** 홈 '이어서' 바 — 잉크 바 + 노란 ▶ (화면당 하나). 눌리면 아래 2·3px · -1°(`.v48-press`). */
export function GoBar({
  left, children, onPress, style, testID, accessibilityLabel,
  pad = { v: 10, h: 12 }, gap = 12, goSize = 46, halo = 'go', shadow = false, haloColor = V48_BREATHE.color,
}: {
  left?: ReactNode;
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  /** 바 안쪽 여백 · 칸 사이 · ▶ 원 크기 — reference는 10/12 · 12 · 46, 홈은 14/16 · 14 · 54. */
  pad?: { v: number; h: number };
  gap?: number;
  goSize?: number;
  /** 후광이 어디를 두르나: 'go' = ▶ 원(v48 키트) · 'bar' = 바 전체(홈 v47) · false = 없음. */
  halo?: 'go' | 'bar' | false;
  /** 바의 하드 그림자(홈 `4px 5px rgba(62,54,43,.28)`). 키트 기본은 없음. */
  shadow?: boolean;
  haloColor?: string;
}) {
  const press = useV48Press('press', -0.5);
  return (
    <Pressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel} testID={testID ?? 'v48-gobar'}>
      <Animated.View style={[{ transform: press.transform }, style]}>
        {halo === 'bar' && <BarHalo radius={6} color={haloColor} />}
        {shadow && (
          <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 4, right: -4, top: 5, bottom: -5, borderRadius: 6, backgroundColor: 'rgba(62,54,43,.28)', opacity: press.p.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }} />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap, paddingVertical: pad.v, paddingHorizontal: pad.h, backgroundColor: K.ink, borderRadius: 6 }}>
          {left}
          <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
          <Go size={goSize} borderColor={K.paper} halo={halo === 'go'} shadow={false} testID="v48-gobar-go" />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Ring ──────────────────────────────────────────────────────────────────

/** 진행 중 — 노란 링. reference는 viewBox 50 · r21 · 선 4.5 · 바탕 선 `rgba(62,54,43,.14)`.
 *  `box`·`r`·`width`·`track`을 열어 둔 것은 홈 바(잉크 위, 58 · r25 · 5)가 같은 부품을 쓰게 하려는 것. */
export function Ring({ pct, size = 46, children, stroke = K.yellow, box = 50, r = 21, width = 4.5, track = 'rgba(62,54,43,.14)', trackFill = K.paper, arcTestID = 'v48-ring-arc' }: {
  /** 0..1 */
  pct: number;
  size?: number;
  children?: ReactNode;
  stroke?: string;
  box?: number;
  r?: number;
  width?: number;
  track?: string;
  trackFill?: string;
  arcTestID?: string;
}) {
  const c = box / 2;
  const frac = Math.max(0, Math.min(1, pct));
  return (
    <View testID="v48-ring" style={{ width: size, height: size, flexShrink: 0 }}>
      <Svg viewBox={`0 0 ${box} ${box}`} width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Circle cx={c} cy={c} r={r} fill={trackFill} stroke={track} strokeWidth={width} />
        {frac > 0 && (
          <Circle cx={c} cy={c} r={r} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * r * frac} 999`} transform={`rotate(-90 ${c} ${c})`} testID={arcTestID} />
        )}
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>{children}</View>
    </View>
  );
}

// ── Done · Locked ─────────────────────────────────────────────────────────

/** 끝냈다 — 2.5px 이중선 초록 + 체크, 1.15 → 1 쾅(`.v48-done`, 회전 유지). */
export function Done({ size = 34, rot = -10, icon }: { size?: number; rot?: number; icon?: NbIconName }) {
  const { style } = useNbMotion(stampSpec(rot), { auto: true });
  return (
    <Animated.View testID="v48-done"
      style={[{
        width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: K.green,
        backgroundColor: 'rgba(95,141,90,.08)', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }, style]}>
      {/* 2.5px double = 선 1 · 틈 .5 · 선 1 */}
      <NbDoubleRing color={K.green} radius={size / 2} line={1} gap={0.5} />
      <NbIcon name={icon ?? 'check'} size={size * 0.55} />
      {icon && <View style={{ position: 'absolute', right: -4, bottom: -4 }}><NbIcon name="check" size={size * 0.42} /></View>}
    </Animated.View>
  );
}

/** 아직 못 한다 — 1.6 점선 원 + 자물쇠, 흐림(.55). 글 없음. */
export function Locked({ size = 34, icon }: { size?: number; icon?: NbIconName }) {
  return (
    <View testID="v48-locked"
      style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.6, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.4)', alignItems: 'center', justifyContent: 'center', opacity: 0.55, flexShrink: 0 }}>
      <NbIcon name={icon ?? 'lock'} size={size * 0.5} />
      {icon && <View style={{ position: 'absolute', right: -3, bottom: -3 }}><NbIcon name="lock" size={size * 0.38} /></View>}
    </View>
  );
}

// ── IconDot · NewDot · Pill · Chev ────────────────────────────────────────

/** 아이콘 원 — 1.7 테두리, 귀엽게 ±3~6° 기울임. */
export function IconDot({ name, size = 40, bg = K.paper, rot = -4, border = K.ink, style }: {
  name: NbIconName;
  size?: number;
  bg?: string;
  rot?: number;
  border?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View testID="v48-icondot"
      style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.7, borderColor: border, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${rot}deg` }], flexShrink: 0 }, style]}>
      <NbIcon name={name} size={size * 0.58} />
    </View>
  );
}

/** 새로 온 것 — 빨간 숫자 원, 처음 한 번 흔들림(`.v48-wiggle`: .7s, .4s 지연, 1회). 부모 모서리에 붙는다. */
export function NewDot({ n, style }: { n: number | string; style?: StyleProp<ViewStyle> }) {
  const { style: wiggle } = useNbMotion(V48_MOTION.wiggle, { auto: true });
  return (
    <Animated.View testID="v48-newdot"
      style={[{
        position: 'absolute', right: -7, top: -6, minWidth: 18, height: 18, borderRadius: 99, backgroundColor: K.red,
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: K.paper,
      }, style, wiggle]}>
      <Text style={{ fontFamily: nbFonts.bodyHeavy, fontSize: 10.5, color: '#fff', lineHeight: 12 }}>{n}</Text>
    </Animated.View>
  );
}

/** 알약 — 아이콘 + Gaegu 19 숫자. */
export function Pill({ icon, n, style }: { icon: NbIconName; n: number | string; style?: StyleProp<ViewStyle> }) {
  return (
    <View testID="v48-pill"
      style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, paddingVertical: 4, paddingLeft: 7, paddingRight: 11, backgroundColor: K.paper, borderWidth: 1.6, borderColor: K.ink, borderRadius: 99 }, style]}>
      <NbIcon name={icon} size={19} />
      <Text style={{ fontFamily: nbFonts.hand, fontSize: 19, color: K.ink, lineHeight: 19 }}>{n}</Text>
    </View>
  );
}

/** 펼침 ⌄ — 펼치면 180°(`transition: transform .2s`). */
export function Chev({ open = false }: { open?: boolean }) {
  const reduce = useReduceMotion();
  const p = useRef(new Animated.Value(open ? 1 : 0)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduce) { p.setValue(open ? 1 : 0); return; }
    const a = Animated.timing(p, { toValue: open ? 1 : 0, duration: 200, easing: CSS_EASE.ease, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [open, p, reduce]);
  return (
    <Animated.View testID="v48-chev" style={{ transform: [{ rotate: p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
      <NbIcon name="chevronDown" size={18} color={K.soft} />
    </Animated.View>
  );
}

// ── 펼침 · 손가락 ─────────────────────────────────────────────────────────

/** 아래에서 톡 올라오며 나타남(`.v48-pop`) — 펼친 내용이 쓴다. 다시 보려면 key를 바꿔 다시 마운트. */
export function V48Pop({ style, children, testID }: { style?: StyleProp<ViewStyle>; children?: ReactNode; testID?: string }) {
  const { style: pop } = useNbMotion(V48_MOTION.pop, { auto: true });
  return <Animated.View testID={testID ?? 'v48-pop'} style={[style, pop]}>{children}</Animated.View>;
}

/** 손가락이 톡톡(`.v48-tap` 1s 반복: 5px · .94). 모션 줄이기면 서 있는다. */
export function V48Tap({ style, children, testID }: { style?: StyleProp<ViewStyle>; children?: ReactNode; testID?: string }) {
  const p = useV48Loop('tap');
  return (
    <Animated.View testID={testID ?? 'v48-tap'}
      style={[style, { transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) }, { scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 0.94] }) }] }]}>
      {children}
    </Animated.View>
  );
}

/** 들리는 바인더(`.v48-lift`): 눌리면 위로 3px · -2°. */
export function V48Lift({ onPress, style, children, testID, accessibilityLabel }: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}) {
  const lift = useV48Press('lift');
  return (
    <Pressable onPress={onPress} onPressIn={lift.onPressIn} onPressOut={lift.onPressOut} accessibilityRole="button" accessibilityLabel={accessibilityLabel} testID={testID ?? 'v48-lift'}>
      <Animated.View style={[style, { transform: lift.transform }]}>{children}</Animated.View>
    </Pressable>
  );
}
