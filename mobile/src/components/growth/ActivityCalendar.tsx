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
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useT } from '@/i18n';
import { BAND_STYLE, BANDS, bandLabelKey, usesShifts, type Band } from '@/data/shifts';
import type { CalendarDay } from '@/api/client';
import { monthWeeks } from '@/data/monthGrid';

const C = colors.ink;

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
        <Pressable onPress={() => onMonth(-1)} hitSlop={10} style={arrow}>
          <PixelIcon name="chevron-left" color={C} size={13} sw={2} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', fontFamily: fonts.heading, fontSize: fs(13), color: C }}>
          {monthLabel(month)}
        </Text>
        <Pressable onPress={() => onMonth(1)} hitSlop={10} style={arrow}>
          <PixelIcon name="chevron-right" color={C} size={13} sw={2} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {weekdays.map((w, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft, marginBottom: 4 }}>
            {w}
          </Text>
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
                    borderWidth: on ? 3 : 2, borderColor: day ? C : C + '33',
                    backgroundColor: style ? style.bg : colors.cream,
                  }}
                >
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: day ? C : colors.textFaint }}>
                    {Number(date.slice(8, 10))}
                  </Text>
                  {day && <PixelIcon name={style!.icon} color={C} size={9} sw={1.8} />}
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
            <View style={{ width: 11, height: 11, borderWidth: 2, borderColor: C, backgroundColor: BAND_STYLE[b].bg }} />
            <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.text }}>{t(bandLabelKey(job, b))}</Text>
          </View>
        ))}
      </View>
      {usesShifts(job) && (
        <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textFaint, marginTop: 5 }}>
          {t('growth.bandHint')}
        </Text>
      )}
    </View>
  );
}

const arrow = {
  width: 26, height: 26, borderWidth: 2, borderColor: C,
  backgroundColor: '#fff', alignItems: 'center' as const, justifyContent: 'center' as const,
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
