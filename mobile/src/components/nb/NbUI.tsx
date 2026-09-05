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
// (`.nb-press`, `.nb-chip`); here it is Pressable's own pressed state, which means the
// interaction cannot be forgotten by a caller who builds a button out of a View.
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type NativeSyntheticEvent, type StyleProp, type TextLayoutEventData, type TextLayoutLine, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Ellipse, Line, Path } from 'react-native-svg';
import { NbIcon, type NbIconName } from './NbIcon';
import { RULE_COLOR, RULE_H, nb, nbFonts, paperShadow } from '@/theme/nb';

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
  const lines = dark ? 0 : Math.ceil(h / RULE_H);
  return (
    <View style={[{ flex: 1, backgroundColor: dark ? nb.dark : nb.cream }, style]}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
        ))}
      </View>
      {children}
    </View>
  );
}

// ── paper, tape, pins ──────────────────────────────────────────────────────

/** Masking tape — translucent sky blue, stuck on at a slight angle. */
export function NbTape({ left = 120, rot = -4, width = 74 }: { left?: number; rot?: number; width?: number }) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: -10, left, width, height: 20, backgroundColor: nb.tape, transform: deg(rot) }}
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

const BUTTON: Record<NbButtonVariant, { bg: string; fg: string; bd: string; bw: number; dashed?: boolean; shadow?: boolean }> = {
  ink: { bg: nb.ink, fg: nb.paper, bd: nb.ink, bw: 1, shadow: true },
  paper: { bg: nb.paper, fg: nb.ink, bd: nb.paperEdge, bw: 1, shadow: true },
  yellow: { bg: 'rgba(249,227,123,.55)', fg: nb.ink, bd: nb.ink, bw: 1.7, shadow: true },
  dashed: { bg: 'transparent', fg: nb.soft, bd: nb.soft, bw: 1.5, dashed: true },
  danger: { bg: 'transparent', fg: nb.red, bd: nb.red, bw: 2, shadow: true },
};

/**
 * A handwritten button that sinks when pressed.
 *
 * Pressed = down 2pt, right 1.5pt, shadow gone — the paper is pushed into the page. The
 * offsets are the prototype's, and they are small on purpose: this is a sheet of paper
 * being pressed, not a key travelling.
 */
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
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} style={({ pressed }) => [
      {
        alignSelf: full ? 'stretch' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        backgroundColor: V.bg,
        borderWidth: V.bw,
        borderColor: V.bd,
        borderStyle: V.dashed ? 'dashed' : 'solid',
        borderRadius: 3,
        paddingVertical: padV,
        paddingHorizontal: padH,
        opacity: disabled ? 0.45 : 1,
        transform: pressed ? [...deg(0), { translateX: 1.5 }, { translateY: 2 }] : deg(rot),
      },
      V.shadow && !pressed ? paperShadow : null,
      style,
    ]}>
      {!!icon && <NbIcon name={icon} size={fs} color={iconColor || V.fg} />}
      <Text style={{ fontFamily: nbFonts.hand, fontSize: fs, color: V.fg }} numberOfLines={1}>
        {children}
      </Text>
      {!!iconRight && <NbIcon name={iconRight} size={fs} color={iconColor || V.fg} />}
    </Pressable>
  );
}

/** A pill. Korean never wraps inside one — see the handoff's 재발 방지 note. */
export function NbTag({ color = nb.ink, fill, rot = 0, style, children }: {
  color?: string;
  fill?: boolean;
  rot?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View style={[{
      alignSelf: 'flex-start',
      backgroundColor: fill ? color : 'transparent',
      borderWidth: fill ? 0 : 1.4,
      borderColor: color,
      borderRadius: 2,
      paddingHorizontal: 6,
      paddingVertical: 1,
      transform: deg(rot),
    }, style]}>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 12.5, color: fill ? '#fff' : color }}>
        {children}
      </Text>
    </View>
  );
}

/** A filter chip. Scales down slightly on press rather than sinking — it is small enough
 *  that a 2pt travel would read as a jump. */
export function NbChip({ on, rot = 0, onPress, children }: {
  on?: boolean;
  rot?: number;
  onPress?: () => void;
  children?: ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      {
        backgroundColor: on ? nb.ink : nb.paper,
        borderWidth: 1,
        borderColor: on ? nb.ink : nb.paperEdge,
        paddingVertical: 4,
        paddingHorizontal: 11,
        transform: pressed ? [{ scale: 0.94 }, ...deg(rot)] : deg(rot),
      },
      paperShadow,
    ]}>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: 14, color: on ? nb.paper : nb.ink }}>
        {children}
      </Text>
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

/** A rubber stamp: double ring, rotated, slightly faded — 통과 / 근무중 / 연속출근.
 *
 *  RN has no `border: 3px double`, so the two rings are two Views. */
export function NbStamp({ color = nb.red, rot = -8, size = 54, top, bottom }: {
  color?: string;
  rot?: number;
  size?: number;
  top?: string;
  bottom?: string;
}) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, borderWidth: 1.4, borderColor: color,
      alignItems: 'center', justifyContent: 'center', transform: deg(rot), opacity: 0.9, flexShrink: 0,
    }}>
      <View pointerEvents="none" style={{
        position: 'absolute', left: 2.2, top: 2.2, right: 2.2, bottom: 2.2,
        borderRadius: size / 2, borderWidth: 1.4, borderColor: color,
      }} />
      {!!top && <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyBold, fontSize: size * 0.17, color }}>{top}</Text>}
      {!!bottom && <Text numberOfLines={1} style={{ fontFamily: nbFonts.hand, fontSize: size * 0.32, color, lineHeight: size * 0.34 }}>{bottom}</Text>}
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
 * covering only its lower ~45% and only as wide as that line's glyphs. Every line gets
 * its stroke, and none of them is a full-height block. The bands sit BEHIND the text, so
 * the ink still reads on top.
 */
export function NbMark({ textStyle, children }: {
  textStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}) {
  const [lines, setLines] = useState<TextLayoutLine[]>([]);
  const onLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => setLines(e.nativeEvent.lines);
  return (
    <View style={{ position: 'relative', maxWidth: '100%' }}>
      {/* The strokes, behind the words. Lower ~45% of each line, its own width. */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {lines.map((ln, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: ln.x,
              top: ln.y + ln.height * 0.5,
              width: ln.width,
              height: Math.max(3, ln.height * 0.42),
              backgroundColor: nb.marker,
              borderRadius: 1.5,
            }}
          />
        ))}
      </View>
      <Text onTextLayout={onLayout} style={[{ fontFamily: nbFonts.hand, fontSize: 17, color: nb.ink }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

/** For a marker inside a longer run of mixed text: the same wash as NbMark, weaker so it
 *  does not read as a block when several sit in one paragraph. */
export const markInline: TextStyle = { backgroundColor: 'rgba(249,227,123,.55)' };

/** A dashed memo box — tips, rules, warnings. */
export function NbMemo({ color = nb.blue, rot = -0.3, style, children }: {
  color?: string;
  rot?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  // A bare string (or number) child is the common case — the translated copy passed
  // straight in. In a release build a raw string sitting directly in a View is dropped
  // silently (only the dashed box shows), so wrap it in the memo's own hand style here.
  // Element children (a caller passing its own Text for custom styling) pass through.
  const body = (typeof children === 'string' || typeof children === 'number')
    ? <Text style={nbText.hand(13.5)}>{children}</Text>
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
 * The hatch is a repeating CSS gradient on the web. Here it is SVG lines at -45°, spaced
 * every 10pt, clipped by the fill's width. Drawn rather than approximated with a flat
 * fill because the hatch is what makes it read as pencil rather than a progress bar.
 */
export function NbGauge({ value, color = nb.green, height = 10 }: { value: number; color?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ height, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 2, overflow: 'hidden', backgroundColor: nb.paper }}>
      <View style={{ width: `${pct}%`, height: '100%', overflow: 'hidden' }}>
        <Svg width="100%" height={height}>
          {Array.from({ length: 60 }).map((_, i) => (
            <Line
              key={i}
              x1={i * 10 - height} y1={height} x2={i * 10} y2={0}
              stroke={color} strokeWidth={5} strokeOpacity={0.4}
            />
          ))}
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
  /** Codes, IPA, timestamps — printed, not written. */
  mono: (size = 11, color: string = nb.soft): TextStyle => ({ fontFamily: nbFonts.mono, fontSize: size, color, letterSpacing: 1 }),
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
