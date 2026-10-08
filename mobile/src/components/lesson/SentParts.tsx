// STEP 2 화면들이 함께 쓰는 틀과 조각 — lesson-fidelity-v46 T4.
//
// 정본(R1), 줄 약칭: SL = design-handoff_v46/reference/forin-notebook-lesson-sent-live.jsx,
// NU = …-nuance.jsx, LS = …-lesson.jsx, UI = forin-notebook-ui.jsx.
//
// STEP 2 화면(릴 C0 · 문장장 · C5 · C6)은 같은 머리를 쓴다(NU:28-45 Frame = SL:186-198):
// "‹ 나가기" 손글씨 칩 · 오른쪽 파란 외곽선 태그(rot 1) + 보조 글자/카운터 · 진행 바 · 손글씨 21 제목.
// 진행 바는 세 가지다 — 릴(지난 장면 파랑), 문장장(지난 장 잉크, 헷갈린 장 빨강), C5·C6(지난 잉크·지금 앰버).
// 프레임 기준 좌표(상태 표시줄 44)는 앱의 TOP_INSET으로 옮긴다: frameTop(v) = TOP_INSET − 44 + v.
import { useState, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbInline, markParts } from '@/components/nb/NbInline';
import { NbDoubleRing, NbTag, nbText } from '@/components/nb/NbUI';
import { NbEnter, useNbColorTransition } from '@/components/nb/nbMotion';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';

/** The handoff frames put the status bar at 44; the app's top inset is TOP_INSET. */
export const frameTop = (v: number) => TOP_INSET - 44 + v;

export const FAINT = 'rgba(62,54,43,.3)';
export const OK_BG = 'rgba(95,141,90,.12)';
export const BAD_BG = 'rgba(199,81,70,.1)';

/** A count in words where the handoff writes one ("다섯 장면", "셋 다"): 1–10 from the catalog, digits past that. */
export function countWord(translate: (k: string) => string, kind: 'counter' | 'noun', n: number): string {
  return n >= 1 && n <= 10 ? translate(`sent.num.${kind}.${n}`) : String(n);
}

// ── 머리 ─────────────────────────────────────────────────────────────────────

/** SL:186-193 · NU:31-38 — exit chip, then the tag and what sits right of it. */
export function Step2Head({ tag, right, onExit, exitLabel }: {
  tag: string;
  right?: ReactNode;
  onExit: () => void;
  exitLabel: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {/* SL:189 `‹ 나가기`: hand 15, 1.5px ink, radius 3, padding 1/8, -1°, nowrap. ‹ is drawn (결정 4). */}
      <Pressable testID="sent-exit" onPress={onExit} hitSlop={8} accessibilityRole="button">
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3,
          paddingVertical: 1, paddingHorizontal: 8, transform: [{ rotate: '-1deg' }],
        }}>
          <NbIcon name="chevronLeft" size={12} />
          <Text numberOfLines={1} style={nbText.hand(15)}>{exitLabel}</Text>
        </View>
      </Pressable>
      <View style={{ flex: 1 }} />
      <NbTag color={nb.blue} rot={1}>{tag}</NbTag>
      {right}
    </View>
  );
}

/** NU:37 — the hand 12.5 soft note right of the tag ("30초", "같은 뜻, 다른 장면"). */
export const HeadSub = ({ children }: { children: string }) => (
  <Text numberOfLines={1} style={[nbText.hand(12.5, nb.soft), { flexShrink: 0 }]}>{children}</Text>
);

/** SL:192 — MONO 12 bold soft "n / N", nowrap. */
export const HeadCount = ({ n, total }: { n: number; total: number }) => (
  <Text testID="sent-count" numberOfLines={1} style={[nbText.monoBold(12, nb.soft), { flexShrink: 0 }]}>{`${n} / ${total}`}</Text>
);

/** SL:197 · NU:40 — hand 21, line 1.25, 12 below the bar; `*…*` is the highlighter. */
export function Step2Title({ text, word }: { text: string; word?: string }) {
  const ts = { ...nbText.hand(21), lineHeight: 26.25 };
  // `{word}` in the C5 title is MONO (NU:139): the screen passes it split out.
  const parts = word === undefined ? markParts(text, null) : text.split('\u0001').flatMap((seg, i) => [
    ...(i > 0 ? [{ text: word, style: { fontFamily: nbFonts.mono } }] : []),
    ...markParts(seg, null),
  ]);
  return <NbInline testID="sent-title" textStyle={ts} parts={parts} style={{ marginTop: 12 }} />;
}

// ── 진행 바 ──────────────────────────────────────────────────────────────────

/** SL:194-196 · NU:74 · NU:140 — one 5-tall cell per step, ±0.7°, `transition: background .3s`. */
export function Step2Bar({ colors, animate = true }: { colors: string[]; animate?: boolean }) {
  return (
    <View testID="sent-bar" style={{ flexDirection: 'row', gap: 4, marginTop: 10 }}>
      {colors.map((c, k) => (animate ? <BarCell key={k} k={k} color={c} /> : <Animated.View key={k} testID="sent-bar-cell" accessibilityLabel={c} style={cell(k, c)} />))}
    </View>
  );
}
const cell = (k: number, backgroundColor: string | Animated.AnimatedInterpolation<string>) => ({
  flex: 1, height: 5, borderRadius: 2, backgroundColor, transform: [{ rotate: `${k % 2 ? 0.7 : -0.7}deg` }],
}) as Animated.WithAnimatedObject<ViewStyle>;
function BarCell({ k, color }: { k: number; color: string }) {
  const bg = useNbColorTransition(color);
  return <Animated.View testID="sent-bar-cell" accessibilityLabel={color} style={cell(k, bg)} />;
}
export const BAR_TODO = 'rgba(62,54,43,.15)';

// ── 도장 ─────────────────────────────────────────────────────────────────────

/**
 * GOOD/RETRY — NU:46-51: 56 round, `3px double`, paper, 7.5/800/ls1 over hand 15 (line 1),
 * entering with nb-ok (which ends at -10°). SL:126-127 tilts the stamp itself -10° too, inside
 * the nb-ok wrapper; `tilt` is that.
 */
export function Step2Stamp({ ok, good, retry, tilt = 0, style }: { ok: boolean; good: string; retry: string; tilt?: number; style?: StyleProp<ViewStyle> }) {
  const color = ok ? nb.green : nb.red;
  return (
    <NbEnter kind="ok" style={style} testID={ok ? 'sent-stamp-good' : 'sent-stamp-retry'}>
      <View style={{
        width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: color, backgroundColor: nb.paper,
        alignItems: 'center', justifyContent: 'center', transform: [{ rotate: `${tilt}deg` }], flexShrink: 0,
      }}>
        <NbDoubleRing color={color} radius={28} />
        <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: 7.5, letterSpacing: 1, color }}>{ok ? 'GOOD' : 'RETRY'}</Text>
        <Text style={[nbText.hand(15, color), { lineHeight: 15 }]}>{ok ? good : retry}</Text>
      </View>
    </NbEnter>
  );
}

// ── 메모 ─────────────────────────────────────────────────────────────────────

/** NU:110 · NU:160 · NU:223 — dashed blue memo: bold blue head word, then the note, one paragraph. */
export function NuanceMemo({ head, children, tail, style, testID }: { head: string; children: ReactNode; tail?: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return (
    <View testID={testID} style={[{
      paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1.3, borderStyle: 'dashed', borderColor: nb.blue,
      backgroundColor: 'rgba(74,111,165,.05)',
    }, style]}>
      <Text style={[nbText.hand(13.5), { lineHeight: 19.6 }]}>
        <Text style={{ fontFamily: nbFonts.handBold, color: nb.blue }}>{head}</Text>
        {' '}{children}
      </Text>
      {tail}
    </View>
  );
}

// ── 그린 것 ──────────────────────────────────────────────────────────────────

/** A one-sided dashed rule — iOS draws a one-sided dashed border solid (SheetStack Perforation). */
export function DashRule({ color = FAINT, width = 1.5 }: { color?: string; width?: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: width }}>
      <Svg width="100%" height={width}>
        <Line x1="0" x2="100%" y1={width / 2} y2={width / 2} stroke={color} strokeWidth={width} strokeDasharray={[width * 3, width * 3]} />
      </Svg>
    </View>
  );
}

/** NU:153 — the red hand-written "→" before the fixed line, drawn (결정 4: no glyphs). */
export function HandArrow({ color = nb.red, size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 20 14">
      <Path d="M1.5 7.4 C6 6.6 11 7.2 17.5 7" stroke={color} strokeWidth={1.9} strokeLinecap="round" fill="none" />
      <Path d="M12.6 2.2 L18 7 L12.4 11.8" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/**
 * SL:57 — a used chip's `repeating-linear-gradient(-45deg, rgba(62,54,43,.1) 0 3px, transparent 3px 6px)`:
 * 3-wide bands, 6 apart across the stripes, running bottom-left to top-right.
 */
export function Hatch({ color = 'rgba(62,54,43,.1)' }: { color?: string }) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const step = 6 * Math.SQRT2;
  const n = box.w ? Math.ceil((box.w + box.h) / step) + 1 : 0;
  return (
    <View testID="sent-hatch" pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {n > 0 && (
        <Svg width={box.w} height={box.h}>
          {Array.from({ length: n }).map((_, k) => {
            const c = k * step + 1.5 * Math.SQRT2;
            return <Line key={k} x1={c - box.h} y1={box.h} x2={c} y2={0} stroke={color} strokeWidth={3} />;
          })}
        </Svg>
      )}
    </View>
  );
}

/** SL:57 · NU:207 — a chip's `1px 2px 0 rgba(62,54,43,.2)`, a hard offset behind an opaque face. */
export const ChipShadow = () => (
  <View pointerEvents="none" style={{ position: 'absolute', left: 1, top: 2, right: -1, bottom: -2, backgroundColor: 'rgba(62,54,43,.2)' }} />
);

/** NU:149 · NU:190 — the rounded icon tile (C5 blue 42, C6 amber 40). */
export function IconTile({ icon, size, iconSize, color, wash, rot = 0 }: { icon: string; size: number; iconSize: number; color: string; wash: string; rot?: number }) {
  return (
    <View testID="sent-icon-tile" style={{
      width: size, height: size, borderRadius: 10, backgroundColor: wash, borderWidth: 1.5, borderColor: color,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: [{ rotate: `${rot}deg` }],
    }}>
      <NbIcon name={icon} size={iconSize} />
    </View>
  );
}
