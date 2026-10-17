// 휴게실 — the break-time games, moved off the home into the lounge (handoff v48 ·
// lounge.jsx L83~99). It takes the place of the lounge's one-line description.
//
// The handoff draws four game chips and a weekly rank (#4). The app has two playable games
// and no ranking on the server — scores are device-local (lib/gameScores) — so the card
// draws the two real games with the handoff's own icons for them (원 = compass, 농구 =
// trophy) and leaves the rank out rather than print a number nobody earned
// (home-calendar-v47 결정 4).
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbPaper } from '@/components/nb/NbUI';
import { useT } from '@/i18n';
import { nb, nbFonts } from '@/theme/nb';

const GAME_CHIPS: NbIconName[] = ['compass', 'trophy'];

export function RestRoomCard() {
  const t = useT();
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/games')} testID="lounge-restroom"
      accessibilityRole="button" accessibilityLabel={t('lounge.restRoom')} style={{ marginTop: 12 }}>
      <NbPaper rot={-0.6} pinned={64} bg="rgba(169,203,227,.22)"
        style={{ paddingVertical: 11, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        <View style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1.8, borderColor: nb.ink, backgroundColor: nb.paper, alignItems: 'center', justifyContent: 'center' }}>
          <NbIcon name="coffee" size={28} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 19, color: nb.ink, lineHeight: 21 }}>{t('lounge.restRoom')}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            {GAME_CHIPS.map((ic, i) => (
              <View key={ic} style={{ width: 26, height: 26, borderRadius: 5, backgroundColor: nb.paper, borderWidth: 1.2, borderColor: '#E0D6C0', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: i % 2 ? '3deg' : '-3deg' }] }}>
                <NbIcon name={ic} size={17} />
              </View>
            ))}
          </View>
        </View>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 18, color: nb.soft }}>›</Text>
      </NbPaper>
    </Pressable>
  );
}
