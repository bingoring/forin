// InfoSheet — a small pixel-styled bottom modal for showing the detail behind a
// tapped emoji tile (a career badge or a praise sticker): big icon, title, a
// status chip (획득/잠김), and a short "무엇인지 / 어떻게 얻는지" body.
import { Modal, Pressable, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { PixelButton } from '@/components/PixelButton';

const C = colors.ink;

export type InfoSheetData = {
  icon: string;
  title: string;
  status?: { label: string; bg: string };
  what?: string; // 무엇인지
  how?: string; // 어떻게 얻는지 (조건)
  iconBg?: string;
  action?: { label: string; bg?: string; onPress: () => void }; // optional primary action (e.g. 장착)
};

export function InfoSheet({ data, onClose }: { data: InfoSheetData | null; onClose: () => void }) {
  return (
    <Modal visible={!!data} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#0006', justifyContent: 'flex-end' }}>
        {/* stop propagation so taps inside the sheet don't close it */}
        <Pressable onPress={() => {}} style={{ backgroundColor: colors.cream, borderTopWidth: 3, borderColor: C, padding: 20, paddingBottom: 36, gap: 14 }}>
          {/* grabber */}
          <View style={{ alignSelf: 'center', width: 44, height: 5, backgroundColor: C + '33', borderRadius: 3, marginBottom: 2 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 64, height: 64, backgroundColor: data?.iconBg || '#fff', borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 34 }}>{data?.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: C }}>{data?.title}</Text>
              {!!data?.status && (
                <View style={{ alignSelf: 'flex-start', backgroundColor: data.status.bg, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>{data.status.label}</Text>
                </View>
              )}
            </View>
          </View>

          {!!data?.what && (
            <View style={{ gap: 4 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>무엇인가요?</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text, lineHeight: 19 }}>{data.what}</Text>
            </View>
          )}
          {!!data?.how && (
            <View style={{ gap: 4 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>어떻게 얻나요?</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text, lineHeight: 19 }}>{data.how}</Text>
            </View>
          )}

          {!!data?.action && (
            <View style={{ marginTop: 4 }}>
              <PixelButton label={data.action.label} bg={data.action.bg || colors.yellow} shadowColor={C} borderWidth={2} paddingV={11} fontSize={13} onPress={data.action.onPress} full />
            </View>
          )}
          <View style={{ marginTop: data?.action ? 8 : 4 }}>
            <PixelButton label="닫기" bg={data?.action ? '#fff' : colors.mint} shadowColor={data?.action ? C : colors.mintShadow} borderWidth={2} paddingV={10} fontSize={13} onPress={onClose} full />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
