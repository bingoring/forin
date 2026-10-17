// 홈 "달력 한 장 + 버튼 하나" (handoff v47 · forin-notebook-home3.jsx HomeCal).
//
// The home that shows where to press without words: a top row (face · streak · call), the
// work calendar, and one continue button. Every value below is the reference's own —
// sizes, washes, rotations, keyframe timings — so a diff against home3.jsx reads line for
// line.
//
// The calendar is its own drawing rather than the growth report's ActivityCalendar: the
// home cell carries the band's glyph and today's red pen circle (the report's cells are
// colour only, by v29's rule), and the two screens are allowed to differ.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbPaper } from '@/components/nb/NbUI';
import { useReduceMotion } from '@/components/nb/nbMotion';
import { monthWeeks } from '@/data/monthGrid';
import { deptCodeNbIcon } from '@/data/campus';
import type { AvatarSpec } from '@/data/nbAvatar';
import type { CalendarDay } from '@/api/client';
import type { Band } from '@/data/shifts';
import { nb, nbFonts } from '@/theme/nb';

const INK = '#3E362B';
const SOFT = '#9A8F7C';
const PAPER = '#FFFdf4';
const RED = '#C75146';
const GREEN_DASH = 'rgba(95,141,90,.6)';
const YELLOW = '#F9E37B';

/** The three bands' washes and glyph fills — home3 SHIFT. */
export const HOME_SHIFT: Record<Band, { bg: string; col: string }> = {
  day: { bg: 'rgba(249,227,123,.65)', col: '#C9A227' },
  evening: { bg: 'rgba(233,150,100,.38)', col: '#C7743E' },
  night: { bg: 'rgba(195,177,232,.5)', col: '#7A68B0' },
};

/** 해 · 노을 · 달 — home3 ShiftGlyph, 16-unit box. */
export function ShiftGlyph({ band, size = 12 }: { band: Band; size?: number }) {
  const col = HOME_SHIFT[band].col;
  const P = { fill: 'none', stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg viewBox="0 0 16 16" width={size} height={size}>
      {band === 'day' && (
        <G>
          <Circle cx="8" cy="8" r="3.3" {...P} fill={col} />
          <Path d="M8 1.5 V3 M8 13 V14.5 M1.5 8 H3 M13 8 H14.5 M3.4 3.4 L4.4 4.4 M11.6 11.6 L12.6 12.6 M12.6 3.4 L11.6 4.4 M4.4 11.6 L3.4 12.6" {...P} />
        </G>
      )}
      {band === 'evening' && (
        <G>
          <Path d="M3.5 10.5 A4.5 4.5 0 0 1 12.5 10.5 Z" {...P} fill={col} />
          <Path d="M1.5 10.5 H14.5 M4 13 H12" {...P} />
        </G>
      )}
      {band === 'night' && <Path d="M10.8 2.5 A5.6 5.6 0 1 0 13.5 10.4 A4.4 4.4 0 0 1 10.8 2.5 Z" {...P} fill={col} />}
    </Svg>
  );
}

// ── ① 상단 줄 ────────────────────────────────────────────────────────────

export function HomeTopRow({ face, streak, ringing, labels, onFace, onCall }: {
  face: AvatarSpec | null;
  streak: number;
  /** Draw the call badge (an open or accepted, unanswered call). */
  ringing: boolean;
  labels: { face: string; streak: string; call: string };
  onFace(): void;
  onCall(): void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 10, paddingHorizontal: 22 }}>
      <Pressable onPress={onFace} accessibilityRole="button" accessibilityLabel={labels.face} testID="home-face"
        style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: INK, backgroundColor: PAPER }}>
        <NbAvatar spec={face ?? undefined} size={44} />
      </Pressable>
      {streak > 0 && (
        <View accessible accessibilityLabel={labels.streak} testID="home-streak"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 5, paddingLeft: 8, paddingRight: 11, backgroundColor: PAPER, borderWidth: 1.6, borderColor: INK, borderRadius: 99, transform: [{ rotate: '-1.5deg' }] }}>
          <NbIcon name="fire" size={22} />
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 22, color: INK, lineHeight: 24 }}>{streak}</Text>
        </View>
      )}
      <View style={{ flex: 1 }} />
      {ringing && <CallBadge label={labels.call} onPress={onCall} />}
    </View>
  );
}

/** The pager rings (±8°, .5s each way) and carries a red dot — home3 `.nbh3-ring`. */
function CallBadge({ label, onPress }: { label: string; onPress(): void }) {
  const reduce = useReduceMotion();
  const swing = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const half = (to: number) => Animated.timing(swing, { toValue: to, duration: 250, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence([half(1), half(-1), half(0)]));
    swing.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [reduce, swing]);
  const rotate = swing.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID="home-call"
      style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(199,81,70,.12)', borderWidth: 1.8, borderColor: RED, alignItems: 'center', justifyContent: 'center' }}>
      {/* transform-origin 50% 20%: swing from near the top, as a pager on a clip would. */}
      <Animated.View style={{ transform: [{ translateY: -7.8 }, { rotate }, { translateY: 7.8 }] }}>
        <NbIcon name="pager" size={26} />
      </Animated.View>
      <View style={{ position: 'absolute', right: -2, top: -2, width: 13, height: 13, borderRadius: 7, backgroundColor: RED, borderWidth: 2, borderColor: nb.cream }} />
    </Pressable>
  );
}

// ── ② 근무 달력 ──────────────────────────────────────────────────────────

export function HomeCalendar({ month, days, today, selected, onSelect, onMonth, dayLabel }: {
  /** YYYY-MM the server answered with. */
  month: string;
  days: CalendarDay[];
  /** YYYY-MM-DD in the learner's timezone — the home read's date. */
  today: string;
  selected: string | null;
  onSelect(date: string | null): void;
  onMonth(delta: number): void;
  dayLabel(day: CalendarDay): string;
}) {
  const byDate = useMemo(() => {
    const m: Record<string, CalendarDay> = {};
    for (const d of days) m[d.date] = d;
    return m;
  }, [days]);
  const weeks = useMemo(() => monthWeeks(month), [month]);
  const weekdays = useMemo(() => weekdayInitials(), []);
  const sel = selected ? byDate[selected] : undefined;

  return (
    <View style={{ paddingTop: 18, paddingHorizontal: 20 }}>
      <NbPaper rot={-0.4} tape tapeLeft={150} style={{ paddingTop: 16, paddingHorizontal: 13, paddingBottom: 13 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => onMonth(-1)} hitSlop={8} testID="home-cal-prev" style={arrowBox}>
            <NbIcon name="chevronLeft" size={15} color={SOFT} />
          </Pressable>
          <Text style={{ flex: 1, textAlign: 'center', fontFamily: nbFonts.hand, fontSize: 24, color: INK }}>{monthLabel(month, today)}</Text>
          <Pressable onPress={() => onMonth(1)} hitSlop={8} testID="home-cal-next" style={arrowBox}>
            <NbIcon name="chevronRight" size={15} color={SOFT} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 8, gap: 5 }}>
          {weekdays.map((w, i) => (
            <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: nbFonts.hand, fontSize: 13, color: i > 4 ? RED : SOFT, opacity: 0.8 }}>{w}</Text>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row', gap: 5, marginTop: 5 }}>
            {week.map((date, di) => {
              if (!date) return <View key={`b${di}`} style={{ flex: 1, height: 44 }} />;
              const info = byDate[date];
              const isToday = date === today;
              const isSel = selected === date;
              const future = date > today;
              return (
                <Pressable
                  key={date}
                  testID={`home-cal-${date}`}
                  disabled={!info}
                  accessibilityRole={info ? 'button' : undefined}
                  accessibilityLabel={info ? dayLabel(info) : undefined}
                  accessibilityState={info ? { selected: isSel } : undefined}
                  onPress={() => onSelect(isSel ? null : date)}
                  style={({ pressed }) => ({
                    flex: 1, height: 44, borderRadius: 6,
                    backgroundColor: info ? HOME_SHIFT[info.band].bg : 'transparent',
                    borderWidth: isSel ? 2 : 1.3,
                    borderColor: isSel ? INK : info ? 'rgba(62,54,43,.18)' : 'rgba(62,54,43,.12)',
                    borderStyle: info || isSel ? 'solid' : 'dashed',
                    alignItems: 'center', justifyContent: 'center', gap: 2,
                    opacity: future ? 0.45 : 1,
                    zIndex: isSel ? 2 : 1,
                    transform: isSel ? [{ rotate: '-2deg' }, { scale: 1.06 }] : pressed ? [{ scale: 0.92 }] : [],
                    ...(isSel ? { shadowColor: INK, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 0, elevation: 2 } : null),
                  })}
                >
                  <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11, color: info ? INK : '#B9AE97', lineHeight: 12 }}>
                    {Number(date.slice(8, 10))}
                  </Text>
                  {info && <ShiftGlyph band={info.band} size={13} />}
                  {isToday && <TodayCircle />}
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* 범례 — glyph chips only. */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 11 }}>
          {(['day', 'evening', 'night'] as Band[]).map((b) => (
            <View key={b} style={{ width: 26, height: 20, borderRadius: 5, backgroundColor: HOME_SHIFT[b].bg, alignItems: 'center', justifyContent: 'center' }}>
              <ShiftGlyph band={b} size={14} />
            </View>
          ))}
        </View>
      </NbPaper>

      {/* The chosen day — stamps only, no words. */}
      <View style={{ minHeight: 64, marginTop: 12 }}>
        {sel && selected && <DayStamps key={selected} day={sel} />}
      </View>
    </View>
  );
}

const arrowBox = { width: 30, height: 30, alignItems: 'center' as const, justifyContent: 'center' as const };

/** Today's red pen circle — home3's path, 5px outside the cell. */
function TodayCircle() {
  return (
    <View pointerEvents="none" testID="home-cal-today" style={{ position: 'absolute', left: -5, right: -5, top: -5, bottom: -5 }}>
      <Svg viewBox="0 0 50 50" width="100%" height="100%" preserveAspectRatio="none">
        <Path d="M25 4 C40 4 46 14 46 25 C46 37 37 46 25 46 C12 46 4 37 4 25 C4 13 12 5 27 6" fill="none" stroke={RED} strokeWidth={2.4} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** The day's cleared scenarios as department stamps, ×n — home3 `.nbh3-pop` (.32s). */
export function DayStamps({ day }: { day: CalendarDay }) {
  const reduce = useReduceMotion();
  const enter = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) return;
    Animated.timing(enter, { toValue: 1, duration: 320, easing: Easing.bezier(0.3, 0.7, 0.3, 1), useNativeDriver: true }).start();
  }, [enter, reduce]);
  const cleared = day.entries.filter((e) => e.cleared);
  return (
    <Animated.View
      testID="home-day-stamps"
      style={{
        opacity: enter,
        transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }, { rotate: '0.4deg' }],
        flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14,
        backgroundColor: PAPER, borderWidth: 1.5, borderColor: INK, borderRadius: 4,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: HOME_SHIFT[day.band].bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 12, color: INK, lineHeight: 13 }}>{Number(day.date.slice(8, 10))}</Text>
        <ShiftGlyph band={day.band} size={13} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {cleared.map((e, i) => (
          <View key={`${e.scenarioId}-${i}`} testID="home-day-stamp"
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderStyle: 'dashed', borderColor: GREEN_DASH, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: i % 2 ? '6deg' : '-6deg' }] }}>
            <NbIcon name={deptCodeNbIcon(e.dept)} size={22} />
            <View style={{ position: 'absolute', right: -4, bottom: -4 }}><NbIcon name="check" size={16} /></View>
          </View>
        ))}
      </View>
      {cleared.length > 0 && (
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 22, color: nb.green }}>×{cleared.length}</Text>
      )}
    </Animated.View>
  );
}

// ── ③ 이어서 버튼 하나 ────────────────────────────────────────────────────

/** How many of the five cells to fill for `done` of `total` — rounded, but never full
 *  before the theme is finished and never empty once something is done (결정 7). */
export function continueCells(done: number, total: number): number {
  if (total <= 0) return 0;
  let n = Math.round((5 * done) / total);
  if (done > 0) n = Math.max(1, n);
  if (done < total) n = Math.min(4, n);
  return Math.max(0, Math.min(5, n));
}

export function ContinueBar({ dept, ring, cells, label, onPress }: {
  dept?: string;
  /** 0..1 — the department track's progress. */
  ring: number;
  /** 0..5 filled cells — the theme's progress. */
  cells: number;
  label: string;
  onPress(): void;
}) {
  const reduce = useReduceMotion();
  const breathe = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const half = (to: number) => Animated.timing(breathe, { toValue: to, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence([half(1), half(0)]));
    loop.start();
    return () => loop.stop();
  }, [breathe, reduce]);
  const R = 25;
  const C = 2 * Math.PI * R;
  const icon: NbIconName = deptCodeNbIcon(dept);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID="home-continue">
      {({ pressed }) => (
        <View style={{ transform: pressed ? [{ translateX: 2 }, { translateY: 3 }, { rotate: '-1deg' }] : [{ rotate: '-0.5deg' }] }}>
          {/* 숨쉬는 노란 후광: 0 0 0 7px rgba(249,227,123,.45), 2.4s. */}
          <Animated.View pointerEvents="none" testID="home-continue-halo"
            style={{ position: 'absolute', left: -7, right: -7, top: -7, bottom: -7, borderRadius: 13, borderWidth: 7, borderColor: 'rgba(249,227,123,.45)', opacity: breathe }} />
          {/* 하드 그림자 4px 5px rgba(62,54,43,.28). */}
          {!pressed && <View pointerEvents="none" style={{ position: 'absolute', left: 4, right: -4, top: 5, bottom: -5, borderRadius: 6, backgroundColor: 'rgba(62,54,43,.28)' }} />}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: INK, borderRadius: 6 }}>
            <View style={{ width: 58, height: 58 }}>
              <Svg viewBox="0 0 58 58" width={58} height={58} style={{ position: 'absolute' }}>
                <Circle cx="29" cy="29" r={R} fill={PAPER} stroke="rgba(255,253,244,.25)" strokeWidth={5} />
                {ring > 0 && (
                  <Circle cx="29" cy="29" r={R} fill="none" stroke={YELLOW} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={`${C * Math.min(1, ring)} 999`} transform="rotate(-90 29 29)" testID="home-continue-ring" />
                )}
              </Svg>
              <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <NbIcon name={icon} size={30} />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} testID={i < cells ? 'home-continue-cell-on' : 'home-continue-cell-off'}
                  style={{ flex: 1, height: 9, borderRadius: 3, backgroundColor: i < cells ? YELLOW : 'rgba(255,253,244,.22)', transform: [{ rotate: i % 2 ? '2deg' : '-2deg' }] }} />
              ))}
            </View>
            <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: YELLOW, borderWidth: 2, borderColor: PAPER, alignItems: 'center', justifyContent: 'center' }}>
              <Svg viewBox="0 0 24 24" width={26} height={26}>
                <Path d="M8.5 5.5 L18.5 12 L8.5 18.5 Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────

/** The month's name; the year joins it only when it is not this year's. */
function monthLabel(month: string, today: string): string {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return month;
  const sameYear = today.slice(0, 4) === month.slice(0, 4);
  try {
    return new Intl.DateTimeFormat(undefined, sameYear ? { month: 'long' } : { year: 'numeric', month: 'long' }).format(new Date(y, m - 1, 1));
  } catch {
    return month;
  }
}

/** Weekday initials, Monday-first, in the reader's language (2026-01-05 is a Monday). */
function weekdayInitials(): string[] {
  try {
    const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2026, 0, 5 + i)));
  } catch {
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  }
}
