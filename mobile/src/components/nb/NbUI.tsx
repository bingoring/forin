// The 근무 수첩 component kit — the props on the page.
//
// Ported from reference/forin-notebook-ui.jsx (window.NbUI). Same names, same look; three
// things had to be rebuilt rather than translated, because they were CSS the platform
// does not have:
//
//  · the highlighter — a background gradient that starts 55% down the line
//  · the pencil gauge — a repeating diagonal hatch
//  · the ruled page — a repeating background gradient
//
// Each is drawn instead (a band, SVG lines, a run of rules). The reasoning for each is at
// its own component.
//
// Every button and chip presses. In the prototype that is a global stylesheet
// (`.nb-press`, `.nb-chip`, ui.jsx L17–20) with a 0.06s transition; here it is NbPressable
// (below) driven by nbMotion's useNbPress, which means the interaction — and its timing —
// cannot be forgotten by a caller who builds a button out of a View.
//
// v46 (lesson-fidelity T1): the values here were re-checked against ui.jsx line by line —
// hard offset shadows on ink/yellow/danger buttons, the gauge's two-tone hatch, the stamp's
// `3px double`, the highlighter band, the tag's vertical padding, the tape's shadow, the
// ruled line's offset. Each component cites its line.
import { useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent, type NativeSyntheticEvent, type StyleProp, type TextLayoutEventData, type TextLayoutLine, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Ellipse, Line, Path } from 'react-native-svg';
import { NbIcon, type NbIconName } from './NbIcon';
import { NB_CHIP_PRESS, nbPressTransform, useNbPress } from './nbMotion';
import { RULE_COLOR, RULE_H, hardShadow, nb, nbFonts, paperShadow, type HardShadow } from '@/theme/nb';

const deg = (d: number) => [{ rotate: `${d}deg` }] as const;

// ── the page ───────────────────────────────────────────────────────────────

/**
 * The notebook page: cream stock with ruled lines.
 *
 * The rules are a run of 1pt Views rather than a repeating background, which RN has no
 * equivalent of. They are drawn behind the children and never move — the page is the
 * notebook, and cards scroll over it. Drawing them into the scroll content instead would
 * be more literal and worse: the lines would slide under a card that is meant to be lying
 * on the page.
 */
export function NbSheet({ dark, height, style, children }: {
  dark?: boolean;
  /** How tall to rule. Defaults to a screen; pass the measured height when the sheet is
   *  inside something shorter. */
  height?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const h = height ?? 900;
  const lines = dark ? 0 : Math.floor((h + 1) / RULE_H);
  return (
    <View style={[{ flex: 1, backgroundColor: dark ? nb.dark : nb.cream }, style]}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: lines }).map((_, i) => (
          // `repeating-linear-gradient(transparent 0 27px, rule 27px 28px)` (ui.jsx L175): the
          // line is the LAST point of each 28pt band, 27–28, not the first point of the next.
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * RULE_H + RULE_H - 1, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

// ── paper, tape, pins ──────────────────────────────────────────────────────

/** Masking tape — translucent sky blue, stuck on at a slight angle.
 *
 *  ui.jsx L36: `boxShadow: '0 1px 2px rgba(0,0,0,.08)'`. iOS only: an Android elevation
 *  under a see-through strip would draw a grey slab through the tape, which the CSS (a shadow
 *  outside the box only) never does. */
export function NbTape({ left = 120, rot = -4, width = 74 }: { left?: number; rot?: number; width?: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute', top: -10, left, width, height: 20, backgroundColor: nb.tape, transform: deg(rot),
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
      }}
    />
  );
}

/** A pin, seen from the side and slightly above — the lounge's corkboard prop. */
export function NbPin({ left = 150, color = nb.red, dark = '#8E3A32' }: { left?: number; color?: string; dark?: string }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: -11, left, width: 22, height: 24, zIndex: 2 }}>
      <Svg viewBox="0 0 22 24" width={22} height={24}>
        <Ellipse cx="12.5" cy="19.5" rx="4.5" ry="1.6" fill="rgba(62,54,43,.28)" />
        <Path d="M10.5 12.5 L13 17.5" stroke={nb.ink} strokeWidth="1.6" strokeLinecap="round" />
        <Path d="M7.5 9.5 L12.5 12.8 L11 14.6 L6.3 11.6 Z" fill={dark} stroke={nb.ink} strokeWidth="1.4" strokeLinejoin="round" />
        <Ellipse cx="8" cy="7" rx="6.2" ry="4.6" fill={color} stroke={nb.ink} strokeWidth="1.6" transform="rotate(-18 8 7)" />
        <Ellipse cx="6.2" cy="5.6" rx="2" ry="1.2" fill="rgba(255,255,255,.6)" transform="rotate(-18 6.2 5.6)" />
      </Svg>
    </View>
  );
}

/**
 * A card cut from a lighter sheet and laid on the page.
 *
 * `rot` is the whole point of the look — every card sits a fraction of a degree off
 * square, and a page of perfectly aligned cards reads as a form rather than a scrapbook.
 * Keep it inside ±0.8°: past that it stops looking laid down and starts looking dropped.
 */
export function NbPaper({ rot = 0, tape, tapeLeft = 120, pinned, pinColor, bg, testID, style, children }: {
  rot?: number;
  tape?: boolean;
  tapeLeft?: number;
  /** true, or the pin's x offset. */
  pinned?: boolean | number;
  pinColor?: string;
  bg?: string;
  /** Passed through so a card can be found by name in a test — the sheet's mission panel
   *  is looked up that way, and wrapping it in another View to carry the id would add a
   *  link to a width chain that has to stay definite (see MissionCluster). */
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View
      testID={testID}
      style={[
        { backgroundColor: bg || nb.paper, borderWidth: 1, borderColor: nb.paperEdge, transform: deg(rot) },
        paperShadow,
        style,
      ]}
    >
      {tape && <NbTape left={tapeLeft} />}
      {pinned !== undefined && pinned !== false && (
        <NbPin left={typeof pinned === 'number' ? pinned : 150} color={pinColor} />
      )}
      {children}
    </View>
  );
}

// ── controls ───────────────────────────────────────────────────────────────

export type NbButtonVariant = 'ink' | 'paper' | 'yellow' | 'dashed' | 'danger';

/** ui.jsx L56–62, variant for variant. `shadow`: a hard offset (no blur) for the printed
 *  variants, the soft paper lift for `paper`, none for `dashed`. */
const BUTTON: Record<NbButtonVariant, { bg: string; fg: string; bd: string; bw: number; dashed?: boolean; shadow: NbPressShadow }> = {
  ink: { bg: nb.ink, fg: nb.paper, bd: nb.ink, bw: 1, shadow: hardShadow.ink },
  paper: { bg: nb.paper, fg: nb.ink, bd: nb.paperEdge, bw: 1, shadow: 'paper' },
  yellow: { bg: 'rgba(249,227,123,.55)', fg: nb.ink, bd: nb.ink, bw: 1.7, shadow: hardShadow.yellow },
  dashed: { bg: 'transparent', fg: nb.soft, bd: nb.soft, bw: 1.5, dashed: true, shadow: null },
  danger: { bg: 'transparent', fg: nb.red, bd: nb.red, bw: 2, shadow: hardShadow.danger },
};

/** What a pressable piece of paper casts: a hard offset, the soft paper lift, or nothing. */
export type NbPressShadow = HardShadow | 'paper' | null;

/**
 * A hard offset shadow — CSS `dx dy 0 color` — drawn as the part of the offset box that lies
 * OUTSIDE the face: a strip down the right side and a strip along the bottom.
 *
 * Why strips rather than an offset block behind the face: CSS clips an outer shadow to
 * outside the border box, so a see-through face (yellow .55, danger transparent) shows the
 * page through it, not the shadow. A block behind would tint them. Why not the platform
 * shadow: Android elevation cannot be offset-only.
 *
 * `q` is how much shadow there is (1 at rest, 0 pressed). The pressed state's `box-shadow:
 * none` is transitioned over 0.06s in CSS, which interpolates the offset AND the colour to
 * zero together — so both strips shrink toward the face's edge (scale about their inner
 * edge, slide by the shrinking offset) and fade, all on transforms the native driver runs.
 * The right strip stops at the face's bottom edge so the corner is not painted twice.
 */
function NbHardShadow({ s, q, h }: { s: HardShadow; q: Animated.AnimatedInterpolation<number>; h: number }) {
  const lin = (to: number) => q.interpolate({ inputRange: [0, 1], outputRange: [0, to] });
  // Right strip: x ∈ [w, w + q·dx], y ∈ [q·dy, h].
  const rightScaleY = h > 0 ? q.interpolate({ inputRange: [0, 1], outputRange: [1, (h - s.dy) / h] }) : 1;
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', left: '100%', top: 0, width: s.dx, height: h || '100%',
          backgroundColor: s.color, borderTopRightRadius: 3, opacity: q,
          transformOrigin: '0% 0%',
          transform: [{ translateY: lin(s.dy) }, { scaleX: q }, { scaleY: rightScaleY }],
        }}
      />
      {/* Bottom strip: x ∈ [q·dx, w + q·dx], y ∈ [h, h + q·dy]. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, top: '100%', width: '100%', height: s.dy,
          backgroundColor: s.color, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, opacity: q,
          transformOrigin: '0% 0%',
          transform: [{ translateX: lin(s.dx) }, { scaleY: q }],
        }}
      />
    </>
  );
}

/**
 * The `.nb-press` interaction, for anything in the notebook that is pressed: down 1.5pt
 * right and 2pt down, straightened to 0°, its shadow gone — over 0.06s `ease` both ways
 * (ui.jsx L17–18). The offsets are small on purpose: a sheet of paper being pressed, not a
 * key travelling.
 *
 * The Pressable is the hit box and the layout box (`style` goes there: flex, margins,
 * alignSelf); the face inside it is what moves (`faceStyle`: background, border, padding).
 * The hit box staying put is what CSS does too — `:active` transforms do not move hit
 * testing in a way a finger notices.
 */
export function NbPressable({ rot = 0, shadow = null, onPress, disabled, style, faceStyle, testID, accessibilityLabel, children }: {
  rot?: number;
  shadow?: NbPressShadow;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
}) {
  const { p, onPressIn, onPressOut } = useNbPress();
  const [h, setH] = useState(0);
  // Android only: elevation cannot fade on the native driver, so it follows the press state.
  const [down, setDown] = useState(false);
  const q = p.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const hard = shadow && shadow !== 'paper' ? shadow : null;
  const lift = shadow === 'paper';
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : () => { setDown(true); onPressIn(); }}
      onPressOut={disabled ? undefined : () => { setDown(false); onPressOut(); }}
      disabled={disabled}
      style={style}
    >
      <Animated.View
        onLayout={hard ? (e: LayoutChangeEvent) => setH(e.nativeEvent.layout.height) : undefined}
        style={{ transform: nbPressTransform(p, rot) }}
      >
        {hard && <NbHardShadow s={hard} q={q} h={h} />}
        {lift && Platform.OS !== 'android' && <NbPaperLift q={q} />}
        <View style={[faceStyle, lift && Platform.OS === 'android' && !down ? { elevation: paperShadow.elevation, shadowColor: paperShadow.shadowColor } : null]}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}

/**
 * The soft paper lift (`0 2px 6px rgba(62,54,43,.14)`) under a pressable paper face, faded
 * with `q` on the native driver.
 *
 * Shadow props cannot ride the native driver and fading the face's own opacity would fade
 * its words too, so the shadow is cast by a plate the size of the face, behind it, in the
 * face's own colour — only its shadow shows, and the plate's opacity carries the transition.
 * iOS only: an Android elevation plate would be drawn ABOVE the face (elevation orders
 * siblings), so there the face itself carries the elevation and drops it on press.
 */
function NbPaperLift({ q }: { q: Animated.AnimatedInterpolation<number> }) {
  const { elevation: _drop, ...ios } = paperShadow;
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: nb.paper, borderRadius: 3, opacity: q }, ios]}
    />
  );
}
/**
 * A polaroid print: a white frame with a wide bottom margin, the subject inside it, and the
 * name written on that margin.
 *
 * Why not just a framed avatar — the wide bottom edge is the whole tell. A square frame
 * with even padding reads as a UI avatar; the off-centre one reads as a photo somebody
 * printed and wrote on, which is what a colleague card is meant to be.
 */
export function NbPolaroid({ name, size = 52, rot = -2, children }: {
  name?: string;
  size?: number;
  rot?: number;
  /** The subject. Defaults to the `me` doodle — a person whose face we do not have. */
  children?: ReactNode;
}) {
  return (
    <View
      style={[
        { backgroundColor: '#fff', borderWidth: 1, borderColor: nb.paperEdge, paddingTop: 4, paddingHorizontal: 4, paddingBottom: name ? 13 : 4, flexShrink: 0, transform: deg(rot) },
        paperShadow,
      ]}
    >
      <View style={{ width: size, height: size, backgroundColor: nb.wash.blue, alignItems: 'center', justifyContent: 'center' }}>
        {children ?? <NbIcon name="me" size={size * 0.62} />}
      </View>
      {!!name && (
        <Text
          numberOfLines={1}
          style={{ position: 'absolute', left: 2, right: 2, bottom: 1, textAlign: 'center', fontFamily: nbFonts.hand, fontSize: 10.5, color: nb.ink }}
        >
          {name}
        </Text>
      )}
    </View>
  );
}

export function NbButton({ variant = 'ink', icon, iconRight, iconColor, rot = 0, size = 'md', full, disabled, onPress, style, children }: {
  variant?: NbButtonVariant;
  icon?: NbIconName;
  /** Drawn AFTER the label — the "next" chevron. A typographic › would render at the
   *  font's weight rather than the icon set's, which is what theme/glyphs.test.ts bans. */
  iconRight?: NbIconName;
  iconColor?: string;
  rot?: number;
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const V = BUTTON[variant];
  const padV = size === 'lg' ? 13 : size === 'sm' ? 5 : 9;
  const padH = size === 'lg' ? 22 : size === 'sm' ? 11 : 15;
  const fs = size === 'lg' ? 18 : size === 'sm' ? 13 : 15.5;
  return (
    <NbPressable
      rot={rot}
      shadow={V.shadow}
      onPress={onPress}
      disabled={disabled}
      style={[{ alignSelf: full ? 'stretch' : 'flex-start', opacity: disabled ? 0.45 : 1 }, style]}
      faceStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // ui.jsx L66: the icon's `marginRight: 5`.
        gap: 5,
        backgroundColor: V.bg,
        borderWidth: V.bw,
        borderColor: V.bd,
        borderStyle: V.dashed ? 'dashed' : 'solid',
        borderRadius: 3,
        paddingVertical: padV,
        paddingHorizontal: padH,
      }}
    >
      {!!icon && <NbIcon name={icon} size={fs} color={iconColor || V.fg} />}
      <Text style={{ fontFamily: nbFonts.hand, fontSize: fs, color: V.fg }} numberOfLines={1}>
        {children}
      </Text>
      {!!iconRight && <NbIcon name={iconRight} size={fs} color={iconColor || V.fg} />}
    </NbPressable>
  );
}

/** A pill. Korean never wraps inside one — see the handoff's 재발 방지 note.
 *
 *  ui.jsx L74: `padding: '0 6px'` — no vertical padding; the line box alone sets the height.
 *  The prototype's `style` reaches the span, so a caller can set the type size there
 *  (the hub's 10.5pt tags); here that is `textStyle`, since `style` is the box. */
export function NbTag({ color = nb.ink, fill, rot = 0, style, textStyle, icon, iconSize = 11, children }: {
  color?: string;
  fill?: boolean;
  rot?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** An icon before the words — lesson.jsx L110 · L122 `<NbIcon size={11}/> ER BAY 2`: the
   *  icon, then the space the JSX leaves, then the words. */
  icon?: NbIconName;
  iconSize?: number;
  children?: ReactNode;
}) {
  return (
    <View style={[{
      alignSelf: 'flex-start',
      flexDirection: icon ? 'row' : undefined,
      alignItems: icon ? 'center' : undefined,
      backgroundColor: fill ? color : 'transparent',
      borderWidth: fill ? 0 : 1.4,
      borderColor: color,
      borderRadius: 2,
      paddingHorizontal: 6,
      paddingVertical: 0,
      transform: deg(rot),
    }, style]}>
      {!!icon && <NbIcon name={icon} size={iconSize} />}
      <Text numberOfLines={1} style={[{ fontFamily: nbFonts.hand, fontSize: 12.5, color: fill ? '#fff' : color }, textStyle]}>
        {/* No icon → the children alone, so a caller's Text keeps its one child. */}
        {icon ? <>{' '}{children}</> : children}
      </Text>
    </View>
  );
}

/** A filter chip. Scales down slightly on press rather than sinking — it is small enough
 *  that a 2pt travel would read as a jump. `.nb-chip` (ui.jsx L19–20): `scale(.94)` over
 *  0.06s `ease`, replacing the chip's own rotation while held (`!important` on transform). */
export function NbChip({ on, rot = 0, onPress, children }: {
  on?: boolean;
  rot?: number;
  onPress?: () => void;
  children?: ReactNode;
}) {
  const { p, onPressIn, onPressOut } = useNbPress();
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[
        {
          backgroundColor: on ? nb.ink : nb.paper,
          borderWidth: 1,
          borderColor: on ? nb.ink : nb.paperEdge,
          paddingVertical: 4,
          paddingHorizontal: 11,
          transform: [
            { scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, NB_CHIP_PRESS.scale] }) },
            { rotate: p.interpolate({ inputRange: [0, 1], outputRange: [`${rot}deg`, '0deg'] }) },
          ],
        },
        paperShadow,
      ]}>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 14, color: on ? nb.paper : nb.ink }}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/** The floor stamp — ink block, paper letters. */
export function NbInkStamp({ children }: { children?: ReactNode }) {
  return (
    <View style={{ backgroundColor: nb.ink, borderRadius: 2, paddingHorizontal: 7, paddingVertical: 1, flexShrink: 0 }}>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 12, color: nb.paper }}>{children}</Text>
    </View>
  );
}

/** CSS `3px double`: a 1pt line, a 1pt gap, a 1pt line (ui.jsx L87; the lesson's GOOD/RETRY
 *  and DONE stamps, words-live L179 · L291). RN has no `double`, so the two lines are two
 *  rings: the box's own 1pt border, and a 1pt ring inset by 2 (the outer line + the gap). */
export const DOUBLE_RING = { line: 1, gap: 1 } as const;

export function NbDoubleRing({ color, radius }: { color: string; radius: number }) {
  const inset = DOUBLE_RING.line + DOUBLE_RING.gap;
  return (
    // Absolute children are placed inside the parent's border, so the outer line is already
    // behind us: the inset from here is just the gap.
    <View pointerEvents="none" style={{
      position: 'absolute', left: DOUBLE_RING.gap, top: DOUBLE_RING.gap, right: DOUBLE_RING.gap, bottom: DOUBLE_RING.gap,
      borderRadius: Math.max(0, radius - inset), borderWidth: DOUBLE_RING.line, borderColor: color,
    }} />
  );
}

/** A rubber stamp: double ring, rotated, slightly faded — 통과 / 근무중 / 연속출근.
 *
 *  ui.jsx L85–92. The top line is Pretendard 800 in the prototype; the app bundles no
 *  ExtraBold cut, so it is the Bold (700) — see lesson-fidelity-v46 t1-t2-report. The bottom
 *  line is `lineHeight: 1`. */
export function NbStamp({ color = nb.red, rot = -8, size = 54, top, topIcon, bottom }: {
  color?: string;
  rot?: number;
  size?: number;
  top?: string;
  /** A drawn top line in place of a glyph — the hub's done stamp `top="✓"` (lesson.jsx L103;
   *  lesson-fidelity-v46 결정 4). The glyph is set at size·.17; a ✓ inks about .75 of its em
   *  and the icon's tick about 14/24 of its box, so the box is size·.17 × 1.25 to ink alike. */
  topIcon?: NbIconName;
  bottom?: string;
}) {
  // 줄 상자는 링의 두 배 폭에 가운데 — CSS는 링보다 넓은 줄(C'의 92 "PASSED")을 링 밖으로 넘쳐 그리는데,
  // 링 폭 Text는 "PASS…"로 자른다(T8 시뮬레이터 대조). Yoga는 넘치는 자식도 가운데에 둔다.
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, borderWidth: DOUBLE_RING.line, borderColor: color,
      alignItems: 'center', justifyContent: 'center', transform: deg(rot), opacity: 0.9, flexShrink: 0,
    }}>
      <NbDoubleRing color={color} radius={size / 2} />
      {!!top && <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyBold, fontSize: size * 0.17, color, width: size * 2, textAlign: 'center' }}>{top}</Text>}
      {!!topIcon && <NbIcon name={topIcon} size={size * 0.17 * 1.25} color={color} />}
      {!!bottom && <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: size * 0.32, color, lineHeight: size * 0.32, width: size * 2, textAlign: 'center' }}>{bottom}</Text>}
    </View>
  );
}

/**
 * Highlighter over a phrase.
 *
 * The marker follows the GLYPHS, not a box. It used to be a View band behind the text at
 * `top: 45%`, which caught only the LOWER of a two-line phrase — the band was sized to
 * the whole box, so its 45% fell between the two lines. A `Text` with a background instead
 * paints every wrapped line to the width of its own run, so both lines of a phrase are
 * marked, each the width of its text rather than a rectangle around the longest line.
 *
 * The prototype is an inline `<mark>` with `linear-gradient(transparent 55%, #F9E37B 55%)`:
 * the wash starts halfway down each line, so the yellow reads as a highlighter stroke
 * dragged along the LOWER half of the words, not as a filled block behind them. A plain
 * `backgroundColor` on the Text cannot do that — it floods the whole line box — and a
 * single band View behind the whole node caught only the last line of a two-line phrase.
 *
 * So the words are measured. `onTextLayout` hands back one rectangle per WRAPPED line
 * (its x, y, width, height in the Text's own box), and a yellow band is drawn under each,
 * covering only its lower 45% and only as wide as that line's glyphs. Every line gets
 * its stroke, and none of them is a full-height block. The bands sit BEHIND the text, so
 * the ink still reads on top.
 *
 * The values are ui.jsx L94–96 exactly: the band starts at 55% of the line box and runs to
 * its bottom, square-cornered, and the `<mark>`'s `padding: 0 2px` widens it 2pt past the
 * glyphs on each side (and pushes the words in by 2). An inline box's padding sits at its
 * two ENDS — the start of the first line and the end of the last — not at every wrap
 * (`box-decoration-break: slice`), so the middle edges of a wrapped phrase get none.
 */
export const MARK = { from: 0.55, padX: 2 } as const;

export function NbMark({ textStyle, children }: {
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}) {
  const [lines, setLines] = useState<TextLayoutLine[]>([]);
  const onLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => setLines(e.nativeEvent.lines);
  const last = lines.length - 1;
  return (
    <View style={{ position: 'relative', maxWidth: '100%', paddingHorizontal: MARK.padX }}>
      {/* The strokes, behind the words: 55%→100% of each line, its own width (+2 at the ends). */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {lines.map((ln, i) => {
          const padL = i === 0 ? MARK.padX : 0;
          const padR = i === last ? MARK.padX : 0;
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                // The Text sits padX in from this layer's left edge.
                left: MARK.padX + ln.x - padL,
                top: ln.y + ln.height * MARK.from,
                width: ln.width + padL + padR,
                height: ln.height * (1 - MARK.from),
                backgroundColor: nb.marker,
              }}
            />
          );
        })}
      </View>
      <Text onTextLayout={onLayout} style={[{ fontFamily: nbFonts.hand, fontSize: 17, color: nb.ink }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

// A marker on a few words inside a longer line is NbInline (./NbInline): a Text background
// would flood the whole line box, where the handoff's `<mark>` paints only its lower 45%.

/** A dashed memo box — tips, rules, warnings. */
export function NbMemo({ color = nb.blue, textColor, rot = -0.3, style, children }: {
  color?: string;
  /** Colour for a bare string/number child. Defaults to ink; set a light colour on a dark
   *  surface (e.g. the night screen) so the wrapped copy is readable. */
  textColor?: string;
  rot?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  // A bare string (or number) child is the common case — the translated copy passed
  // straight in. In a release build a raw string sitting directly in a View is dropped
  // silently (only the dashed box shows), so wrap it in the memo's own hand style here.
  // Element children (a caller passing its own Text for custom styling) pass through.
  const body = (typeof children === 'string' || typeof children === 'number')
    ? <Text style={nbText.hand(13.5, textColor)}>{children}</Text>
    : children;
  return (
    <View style={[{
      paddingVertical: 8, paddingHorizontal: 11, borderWidth: 1.4, borderStyle: 'dashed',
      borderColor: color, borderRadius: 3, backgroundColor: `${color}10`, transform: deg(rot),
    }, style]}>
      {body}
    </View>
  );
}

/**
 * The pencil gauge — a bar filled with a diagonal hatch.
 *
 * ui.jsx L101–107: `repeating-linear-gradient(-45deg, ${color}66 0 5px, ${color}3d 5px 10px)`
 * — two tones and no paper between them: 5pt at 40% (`66`), 5pt at 24% (`3d`), repeating.
 * The 5pt and 10pt are measured ALONG the gradient line, i.e. across the stripes, so the
 * stripes are 10pt apart perpendicular and 10·√2 apart along the bar. Here: the fill is the
 * light tone, and the dark tone is SVG lines 5pt wide at that pitch. The -45° gradient
 * starts at the box's bottom-right corner, so the dark bands are phased from there — which
 * is why the fill's width is measured.
 *
 * `color` must be `#RRGGBB`, as in the prototype: the two tones are that hex with an alpha
 * byte appended.
 */
export const GAUGE = { band: 5, period: 10, dark: '66', light: '3d' } as const;

export function NbGauge({ value, color = nb.green, height = 10 }: { value: number; color?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const [w, setW] = useState(0);
  // The fill's own box: inside the 1.5pt border.
  const h = Math.max(0, height - 3);
  const step = GAUGE.period * Math.SQRT2;
  // Dark band k is centred where x + y = w + h − √2·(10k + 2.5); a line y: h→0 there runs
  // from x = c − h to x = c.
  const span = (w || 600) + 2 * h;
  const n = Math.ceil(span / step) + 1;
  const cOf = (k: number) => (w || 600) + h - Math.SQRT2 * (GAUGE.period * k + GAUGE.band / 2);
  return (
    <View style={{ height, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 2, overflow: 'hidden', backgroundColor: nb.paper }}>
      <View
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        style={{ width: `${pct}%`, height: '100%', overflow: 'hidden', backgroundColor: `${color}${GAUGE.light}` }}
      >
        <Svg width="100%" height={h}>
          {Array.from({ length: n }).map((_, k) => {
            const c = cOf(k);
            return (
              <Line
                key={k}
                x1={c - h} y1={h} x2={c} y2={0}
                stroke={`${color}${GAUGE.dark}`} strokeWidth={GAUGE.band}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

/** A hand-drawn checkbox. The tick overshoots the box, as a pen does. */
export function NbCheck({ done, size = 19 }: { done?: boolean; size?: number }) {
  return (
    <View style={{
      width: size, height: size, borderWidth: 1.7, borderColor: done ? nb.green : nb.soft, borderRadius: 4,
      backgroundColor: done ? 'rgba(95,141,90,.12)' : 'transparent', flexShrink: 0,
    }}>
      {done && (
        <View style={{ position: 'absolute', left: -1, top: -4 }}>
          <Svg viewBox="0 0 24 24" width={size + 3} height={size + 3}>
            <Path d="M5 12 L10 17 L20 5" fill="none" stroke={nb.green} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      )}
    </View>
  );
}

/** Progress as a row of little boxes — n of m, countable at a glance. */
export function NbProgSquares({ done, total, color = nb.green }: { done: number; total: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2.5, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          width: 8, height: 8, borderWidth: 1.3, borderRadius: 1.5,
          borderColor: i < done ? color : nb.soft,
          backgroundColor: i < done ? `${color}59` : 'transparent',
        }} />
      ))}
    </View>
  );
}

/** Progress as a FIXED number of boxes — the same row whatever `total` is.
 *
 *  `NbProgSquares` draws one box per item, which is countable and right when there
 *  are a few. A journey station has twenty-odd courses: the row then runs past
 *  whatever sits beside it (it drew over the bar's Resume pill), and nobody counts
 *  twenty-four boxes by eye anyway — past six or seven they read as "a lot" and the
 *  exact figure has to come from the text next to them.
 *
 *  Both ends are kept honest rather than rounded. One course done out of twenty-four
 *  is 4%, which rounds to no boxes at all and would read as "not started"; so any
 *  progress lights at least one. The reverse matters more: 99% rounds up to a full
 *  row, so only finishing every course fills the last box. */
export function NbProgScale({ done, total, boxes = 10, color = nb.green }: {
  done: number; total: number; boxes?: number; color?: string;
}) {
  const lit = total <= 0 || done <= 0 ? 0
    : done >= total ? boxes
    : Math.min(boxes - 1, Math.max(1, Math.round((done / total) * boxes)));
  return (
    <View style={{ flexDirection: 'row', gap: 2.5, alignItems: 'center' }}>
      {Array.from({ length: boxes }).map((_, i) => (
        <View key={i} style={{
          width: 8, height: 8, borderWidth: 1.3, borderRadius: 1.5,
          borderColor: i < lit ? color : nb.soft,
          backgroundColor: i < lit ? `${color}59` : 'transparent',
        }} />
      ))}
    </View>
  );
}

/** A search field written on a ruled line rather than boxed in. */
export function NbSearchLine({ placeholder, value, onPress, right }: {
  placeholder: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={{
      flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 4,
      borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.45)',
    }}>
      <NbIcon name="magnify" size={16} />
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: nbFonts.hand, fontSize: 15, color: value ? nb.ink : nb.placeholder }}>
        {value || placeholder}
      </Text>
      {right}
    </Pressable>
  );
}

/** The handle on a sheet or a resizable band. */
export function NbGrabber({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ width: 52, height: 5, backgroundColor: 'rgba(62,54,43,.25)', borderRadius: 99, alignSelf: 'center', marginVertical: 7 }, style]} />;
}

/**
 * Index tabs — the review lab's three sections.
 *
 * The inactive tabs are pastel index stickers tucked BEHIND the page, each a degree off
 * square; the active one comes forward in the page's own colour and loses its bottom
 * border so it reads as continuous with the sheet below. That continuity is the whole
 * device: without it they are three buttons in a row, which is what this replaced.
 */
const TAB_COLORS = ['rgba(244,164,155,.75)', 'rgba(143,199,232,.75)', 'rgba(168,217,151,.75)', 'rgba(249,227,123,.75)'];

export function NbIndexTabs({ tabs, active = 0, onSelect }: {
  /** [label, count?] per tab. */
  tabs: [string, number?][];
  active?: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 3, alignItems: 'flex-end', paddingHorizontal: 6 }}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <Pressable
              key={i}
              onPress={() => onSelect?.(i)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                backgroundColor: on ? nb.paper : TAB_COLORS[i % 4],
                borderWidth: 1.4,
                borderColor: on ? nb.ink : 'rgba(62,54,43,.35)',
                // The active tab's bottom edge is the page, not a line.
                borderBottomColor: on ? nb.paper : 'rgba(62,54,43,.35)',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                paddingTop: on ? 8 : 5,
                paddingBottom: on ? 6 : 3,
                marginBottom: on ? -1.4 : 2,
                opacity: on ? 1 : 0.8,
                zIndex: on ? 2 : 1,
                transform: pressed ? [{ scale: 0.94 }] : on ? [] : deg(i % 2 ? 0.8 : -0.8),
              })}
            >
              {/* A scrap of tape holding the active sticker down. */}
              {on && <View pointerEvents="none" style={{ position: 'absolute', top: 4, width: 26, height: 5, backgroundColor: 'rgba(160,200,220,.6)', borderRadius: 1 }} />}
              <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: on ? 16 : 14.5, color: nb.ink }}>
                {t[0]}
                {t[1] != null && <Text style={{ fontSize: 11, opacity: 0.7 }}> {t[1]}</Text>}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ borderTopWidth: 1.4, borderTopColor: nb.ink }} />
    </View>
  );
}

// ── text helpers ───────────────────────────────────────────────────────────
//
// Three named styles rather than repeating the family everywhere. Naming them after the
// JOB (a heading, a sentence, a printed code) keeps the rule from 07: handwriting for
// labels, Pretendard for anything that must be read, mono for what is machine-printed in
// the fiction.

export const nbText = {
  /** Headings and labels — the nurse's own hand. */
  hand: (size = 16, color: string = nb.ink): TextStyle => ({ fontFamily: nbFonts.hand, fontSize: size, color }),
  /** Sentences. Gaegu at body size over three lines is charming and unreadable. */
  body: (size = 13, color: string = nb.ink): TextStyle => ({ fontFamily: nbFonts.body, fontSize: size, color, lineHeight: size * 1.55 }),
  /** Codes, IPA, timestamps — printed, not written.
   *
   *  `tracking` defaults to 1, which is what the screens ported so far were matched to. The
   *  handoff sets letter-spacing per use and most mono in the lesson and dialogue screens has
   *  none (STEP labels, n / N counters, IPA — audits v46), so those pass 0. */
  mono: (size = 11, color: string = nb.soft, tracking = 1): TextStyle => ({ fontFamily: nbFonts.mono, fontSize: size, color, letterSpacing: tracking }),
  /** The handoff's `MONO, fontWeight: 700` — no tracking unless asked. The heaviest bundled
   *  cut is SemiBold (600); see nbFonts.monoBold. */
  monoBold: (size = 11, color: string = nb.soft, tracking = 0): TextStyle => ({ fontFamily: nbFonts.monoBold, fontSize: size, color, letterSpacing: tracking }),
};

/** A scrolling notebook page: ruled background, content over it. */
export function NbScreen({ dark, children, contentStyle }: {
  dark?: boolean;
  children?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <NbSheet dark={dark}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 }, contentStyle]}
      >
        {children}
      </ScrollView>
    </NbSheet>
  );
}
