// A month of study, laid out like a roster.
//
// The growth report used to be four counters and a ten-day strip: it said how much, and
// never when or what. For a nurse that is the wrong axis — their week has a shape, and
// the shape is shifts. So the report opens on a calendar where each day carries the
// band it happened in, and tapping a day says what was actually studied.
//
// The band names are per job (data/shifts.ts): a nurse sees 데이/이브닝/나이트, everyone
// else sees the plain time of day. The colours are shared, because they encode the hour
// rather than the profession.
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import { BAND_STYLE, BANDS, bandLabelKey, usesShifts, type Band } from '@/data/shifts';
import type { CalendarDay } from '@/api/client';
import { monthWeeks } from '@/data/monthGrid';


export function ActivityCalendar({ month, days, job, selected, onSelect, onMonth }: {
  /** YYYY-MM the server answered with — not the one requested, so paging is honest. */
  month: string;
  days: CalendarDay[];
  job?: string;
  selected: string | null;
  onSelect(date: string | null): void;
  onMonth(delta: number): void;
}) {
  const t = useT();
  const byDate = useMemo(() => {
    const m: Record<string, CalendarDay> = {};
    for (const d of days) m[d.date] = d;
    return m;
  }, [days]);

  // Cells come from the month itself rather than from the returned days: a month with
  // three active days still needs its other twenty-eight boxes, and an empty month must
  // render a grid instead of nothing.
  const weeks = useMemo(() => monthWeeks(month), [month]);
  const weekdays = useMemo(() => weekdayInitials(), []);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <Pressable onPress={() => onMonth(-1)} hitSlop={10}>
          <NbPaper rot={-1.5} style={arrow}><NbIcon name="chevronLeft" size={14} /></NbPaper>
        </Pressable>
        <Text numberOfLines={1} style={[nbText.hand(19), { flex: 1, textAlign: 'center' }]}>
          {monthLabel(month)}
        </Text>
        <Pressable onPress={() => onMonth(1)} hitSlop={10}>
          <NbPaper rot={1.5} style={arrow}><NbIcon name="chevronRight" size={14} /></NbPaper>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {weekdays.map((w, i) => (
          <Text key={i} numberOfLines={1} style={styles.weekday}>{w}</Text>
        ))}
      </View>

      {/* Rows of seven with flex cells — see data/monthGrid for why this is not one
          wrapping row of percentage widths. */}
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {week.map((date, di) => {
            if (!date) return <View key={`b${di}`} style={{ flex: 1, aspectRatio: 1, padding: 2 }} />;
            const day = byDate[date];
            const on = selected === date;
            const style = day ? BAND_STYLE[day.band as Band] : null;
            return (
              <View key={date} style={{ flex: 1, aspectRatio: 1, padding: 2 }}>
                <Pressable
                  // A day with nothing on it is not tappable: a detail panel that opens
                  // empty is worse than a cell that plainly did not respond.
                  disabled={!day}
                  onPress={() => onSelect(on ? null : date)}
                  style={{
                    flex: 1, alignItems: 'center', justifyContent: 'center',
                    // The chosen day takes the gold ring the app uses for "this is the
                    // one you chose"; a day with nothing on it is a pencilled box.
                    borderWidth: on ? 2 : 1.3,
                    borderColor: on ? '#C99A1E' : day ? nb.paperEdge : 'rgba(62,54,43,.15)',
                    borderStyle: day ? 'solid' : 'dashed',
                    backgroundColor: style ? style.bg : 'transparent',
                    transform: [{ rotate: (wi + di) % 2 ? '0.7deg' : '-0.7deg' }],
                  }}
                >
                  {/* The date is PRINTED — a calendar's numbers are a grid to scan, and
                      handwriting at 10pt in 42 boxes is noise. v29 07 also forbids any
                      mark inside a cell beyond the colour (셀 이모지 금지), which is why
                      the band's icon appears only in the day's detail below. */}
                  <Text style={[styles.date, { color: day ? nb.ink : nb.placeholder }]}>
                    {Number(date.slice(8, 10))}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}

      {/* Legend, named for this job. Without it the colours are decoration. */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 9, flexWrap: 'wrap' }}>
        {BANDS.map((b) => (
          <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 11, height: 11, borderWidth: 1.2, borderColor: nb.ink, backgroundColor: BAND_STYLE[b].bg }} />
            <Text numberOfLines={1} style={nbText.hand(13.5, nb.soft)}>{t(bandLabelKey(job, b))}</Text>
          </View>
        ))}
      </View>
      {usesShifts(job) && (
        <Text style={[nbText.body(9.5, nb.placeholder), { marginTop: 5 }]}>{t('growth.bandHint')}</Text>
      )}
    </View>
  );
}

const arrow = { width: 28, height: 28, alignItems: 'center' as const, justifyContent: 'center' as const };

const styles = {
  weekday: { flex: 1, textAlign: 'center' as const, fontFamily: nbFonts.mono, fontSize: 8.5, color: nb.soft, marginBottom: 5 },
  date: { fontFamily: nbFonts.monoBold, fontSize: 10.5 },
};

function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' }).format(new Date(y, m - 1, 1));
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
