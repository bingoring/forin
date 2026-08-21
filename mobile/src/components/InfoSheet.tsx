// InfoSheet — the small detail sheet behind a tapped tile (a career title, a praise
// sticker, a calendar day): big icon, title, a status chip (획득/잠김), and a short
// "what is it / how do you get it" body.
//
// Built on BottomSheet, which is the whole point of this file's history: it used to
// be its own Modal with a hand-drawn 44×5 bar at the top. That bar looked exactly
// like the draggable grabber on every other sheet in the app and had no gesture
// behind it — grabbing it did nothing at all, which is worse than having no handle,
// because the handle is a promise. There is now one sheet implementation and one
// drag, so a handle means the same thing everywhere.
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { colors, fonts, fs } from '@/theme/tokens';
import { PixelButton } from '@/components/PixelButton';
import { BottomSheet } from '@/components/BottomSheet';
import { t, useLocale, useT } from '@/i18n';

const C = colors.ink;

export type InfoSheetData = {
  icon: string;
  iconNode?: ReactNode; // preferred: a line icon (falls back to the `icon` emoji)
  title: string;
  status?: { label: string; bg: string };
  what?: string; // 무엇인지
  how?: string; // 어떻게 얻는지 (조건)
  iconBg?: string;
  action?: { label: string; bg?: string; onPress: () => void }; // optional primary action (e.g. 장착)
};

export function InfoSheet({ data, onClose }: { data: InfoSheetData | null; onClose: () => void }) {
  const t = useT();
  // Re-render when the app language changes; the body strings below are translated.
  return (
    // Content-sized: this sheet says everything it has to say at rest, so opening it at
    // the top would be mostly empty paper.
    <BottomSheet visible={!!data} onClose={onClose}>
      <View style={{ backgroundColor: colors.cream, padding: 20, paddingBottom: 36, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 64, height: 64, backgroundColor: data?.iconBg || '#fff', borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            {data?.iconNode ?? <Text style={{ fontSize: fs(34) }}>{data?.icon}</Text>}
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(17), color: C }}>{data?.title}</Text>
            {!!data?.status && (
              <View style={{ alignSelf: 'flex-start', backgroundColor: data.status.bg, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{data.status.label}</Text>
              </View>
            )}
          </View>
        </View>

        {!!data?.what && (
          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{t('info.what')}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.text, lineHeight: 19 }}>{data.what}</Text>
          </View>
        )}
        {!!data?.how && (
          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>{t('info.how')}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: colors.text, lineHeight: 19 }}>{data.how}</Text>
          </View>
        )}

        {/* The action stays — it DOES something. The old 닫기 button is gone: the
            handle and the backdrop are the two ways out, and people already try both. */}
        {!!data?.action && (
          <View style={{ marginTop: 4 }}>
            <PixelButton label={data.action.label} bg={data.action.bg || colors.yellow} shadowColor={C} borderWidth={2} paddingV={11} fontSize={13} onPress={data.action.onPress} full />
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
