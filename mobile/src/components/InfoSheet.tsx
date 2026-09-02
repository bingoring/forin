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
import { NbButton, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { BottomSheet } from '@/components/BottomSheet';
import { useT } from '@/i18n';

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
      <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 36, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          {/* The thing itself, on a slip of paper tilted a degree off square — a tile in
              a collection, picked up and looked at. */}
          <NbPaper rot={-2} bg={data?.iconBg} style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
            {data?.iconNode ?? <Text style={{ fontSize: 34 }}>{data?.icon}</Text>}
          </NbPaper>
          <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
            <Text style={nbText.hand(23)}>{data?.title}</Text>
            {!!data?.status && (
              <View style={{ alignSelf: 'flex-start' }}>
                <NbTag color={data.status.bg} rot={-2}>{data.status.label}</NbTag>
              </View>
            )}
          </View>
        </View>

        {!!data?.what && (
          <View style={{ gap: 2 }}>
            <Text numberOfLines={1} style={styles.label}>{t('info.what')}</Text>
            <Text style={nbText.body(13)}>{data.what}</Text>
          </View>
        )}
        {!!data?.how && (
          <View style={{ gap: 2 }}>
            <Text numberOfLines={1} style={styles.label}>{t('info.how')}</Text>
            <Text style={nbText.body(13)}>{data.how}</Text>
          </View>
        )}

        {/* The action stays — it DOES something. The old 닫기 button is gone: the handle
            and the backdrop are the two ways out, and people already try both. */}
        {!!data?.action && (
          <View style={{ marginTop: 4 }}>
            <NbButton variant="ink" size="lg" full iconColor={nb.paper} onPress={data.action.onPress}>
              {data.action.label}
            </NbButton>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = {
  /** Section labels are printed and small: they name a block rather than speaking. */
  label: { fontFamily: nbFonts.bodyBold, fontSize: 10, color: nb.blue, letterSpacing: 1 } as const,
};
