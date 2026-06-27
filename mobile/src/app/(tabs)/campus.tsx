import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PixelBox } from '@/components/PixelBox';
import { PixelButton } from '@/components/PixelButton';
import { PixelChip } from '@/components/PixelChip';
import { colors, fonts, space, type as t } from '@/theme/tokens';

// Campus hub. The outdoor campus map is 5c; for now this links into the ER
// interior so the explore engine (2-5) is reachable.
export default function Campus() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <Text style={styles.h}>캠퍼스</Text>
      <PixelBox style={styles.card}>
        <Text style={styles.title}>forin 병원</Text>
        <Text style={styles.body}>픽셀 병원을 탐험하며 임상 영어를 연습하세요.</Text>
        <View style={styles.row}>
          <PixelChip label="ER" />
          <PixelChip label="ICU" bg={colors.lilac} />
          <PixelChip label="PEDS" bg={colors.pink} />
        </View>
      </PixelBox>
      <PixelButton label="🗺  캠퍼스 둘러보기" bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => router.push('/interior/CAMPUS-00001')} full />
      <PixelButton label="✈  응급실 입장" onPress={() => router.push('/interior/INT-ER-00001')} full />
      <Text style={[styles.body, { marginTop: space.sm }]}>외래 클리닉</Text>
      <View style={styles.clinics}>
        <PixelButton label="내과" bg={colors.mint} shadowColor={colors.mintShadow} onPress={() => router.push('/interior/CLINIC-IM-00001')} />
        <PixelButton label="외과" bg={colors.blue} shadowColor={colors.text} onPress={() => router.push('/interior/CLINIC-GS-00001')} />
        <PixelButton label="정형외과" bg={colors.peachDeep} shadowColor={colors.peachShadow} onPress={() => router.push('/interior/CLINIC-OS-00001')} />
        <PixelButton label="피부과" bg={colors.pink} shadowColor={colors.text} onPress={() => router.push('/interior/CLINIC-DM-00001')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: space.xl, gap: space.lg, justifyContent: 'center' },
  h: { fontFamily: fonts.heading, fontSize: t.screenHeading, color: colors.ink },
  card: { padding: space.lg, gap: space.sm, width: '100%' },
  title: { fontFamily: fonts.heading, fontSize: t.section, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: t.body, color: colors.text, lineHeight: 22 },
  row: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  clinics: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
