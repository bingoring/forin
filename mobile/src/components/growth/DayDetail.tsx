// What you actually did on one day.
//
// The calendar cell can only carry a colour and a number; this is the answer to
// "그날 어떤 학습을 했는지". Entries arrive ordered by hour, so the day reads
// chronologically — the order it happened, not the order it ranks.
import { Pressable, Text, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useT } from '@/i18n';
import { BAND_STYLE, bandLabelKey, type Band } from '@/data/shifts';
import type { CalendarDay } from '@/api/client';

const C = colors.ink;

export function DayDetail({ day, job, onOpen }: {
  day: CalendarDay;
  job?: string;
  onOpen(scenarioID: string): void;
}) {
  const t = useT();
  const style = BAND_STYLE[day.band as Band];
  return (
    <View style={{ marginTop: 12, borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: style.bg, borderBottomWidth: 3, borderBottomColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
        <PixelIcon name={style.icon} color={C} size={15} sw={1.8} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{dayLabel(day.date)}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: C, opacity: 0.75, marginTop: 1 }}>
            {t(bandLabelKey(job, day.band as Band))}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>
          {t('growth.daySummary', { done: day.cleared, total: day.sessions })}
        </Text>
      </View>

      <View style={{ padding: 10, gap: 6 }}>
        {day.entries.map((e, i) => (
          <Pressable
            key={`${e.scenarioId}-${i}`}
            onPress={() => onOpen(e.scenarioId)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              borderWidth: 2, borderColor: C,
              backgroundColor: e.cleared ? colors.mint : colors.cream,
              paddingVertical: 7, paddingHorizontal: 9,
            }}
          >
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: colors.textSoft, width: 30 }}>
              {String(e.hour).padStart(2, '0')}:00
            </Text>
            <Text numberOfLines={2} style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 15 }}>
              {e.title}
            </Text>
            {/* Cleared vs merely attempted, because a day of five tries and one clear is
                a different day from five clears — and the calendar cell cannot say so. */}
            {e.cleared
              ? <PixelIcon name="check" color={colors.mintShadow} size={13} sw={2.2} />
              : <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft }}>{t('growth.attempted')}</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', weekday: 'short' })
      .format(new Date(y, m - 1, d));
  } catch {
    return date;
  }
}
