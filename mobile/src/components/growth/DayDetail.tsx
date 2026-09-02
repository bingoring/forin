// What you actually did on one day.
//
// The calendar cell can only carry a colour and a number; this is the answer to
// "그날 어떤 학습을 했는지". Entries arrive ordered by hour, so the day reads
// chronologically — the order it happened, not the order it ranks.
import { Pressable, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { useT } from '@/i18n';
import { BAND_STYLE, bandLabelKey, type Band } from '@/data/shifts';
import type { CalendarDay } from '@/api/client';

export function DayDetail({ day, job, onOpen }: {
  day: CalendarDay;
  job?: string;
  onOpen(scenarioID: string): void;
}) {
  const t = useT();
  const style = BAND_STYLE[day.band as Band];
  return (
    <NbPaper rot={0.4} style={{ marginTop: 12 }}>
      {/* The day's own header, washed in the shift's colour — the same wash the calendar
          cell carries, so the cell and this agree without a legend. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: style.bg, paddingVertical: 9, paddingHorizontal: 12 }}>
        <NbIcon name={style.nbIcon} size={17} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={nbText.hand(17)}>{dayLabel(day.date)}</Text>
          <Text numberOfLines={1} style={nbText.body(10, nb.soft)}>
            {t(bandLabelKey(job, day.band as Band))}
          </Text>
        </View>
        <Text numberOfLines={1} style={nbText.hand(14, nb.soft)}>
          {t('growth.daySummary', { done: day.cleared, total: day.sessions })}
        </Text>
      </View>

      <View style={{ paddingVertical: 8, paddingHorizontal: 12, gap: 2 }}>
        {day.entries.map((e, i) => (
          <Pressable
            key={`${e.scenarioId}-${i}`}
            onPress={() => onOpen(e.scenarioId)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 9,
              paddingVertical: 9,
              borderTopWidth: i > 0 ? 1.3 : 0, borderTopColor: 'rgba(62,54,43,.15)', borderStyle: 'dashed',
            }}
          >
            {/* The hour is printed: it is a timestamp. */}
            <Text numberOfLines={1} style={styles.hour}>{String(e.hour).padStart(2, '0')}:00</Text>
            <Text numberOfLines={2} style={[nbText.hand(16), { flex: 1, minWidth: 0, lineHeight: 19 }]}>
              {e.title}
            </Text>
            {/* Cleared vs merely attempted, because a day of five tries and one clear is a
                different day from five clears — and the calendar cell cannot say so. */}
            {e.cleared
              ? <NbIcon name="check" size={15} color={nb.green} />
              : <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{t('growth.attempted')}</Text>}
          </Pressable>
        ))}
      </View>
    </NbPaper>
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

const styles = {
  hour: { fontFamily: nbFonts.mono, fontSize: 9.5, color: nb.soft, width: 34, flexShrink: 0 } as const,
};
