import { StyleSheet, Text, View } from 'react-native';
import { PixelBox } from '@/components/PixelBox';
import { colors, fonts, space, type as t } from '@/theme/tokens';

export default function Me() {
  return (
    <View style={styles.screen}>
      <Text style={styles.h}>나</Text>
      <PixelBox style={styles.card}>
        <Text style={styles.body}>프로필·평판·커리어·뱃지 (Stage 2-6/2-7).</Text>
      </PixelBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: space.xl, gap: space.lg, justifyContent: 'center' },
  h: { fontFamily: fonts.heading, fontSize: t.screenHeading, color: colors.ink },
  card: { padding: space.lg, width: '100%' },
  body: { fontFamily: fonts.body, fontSize: t.body, color: colors.text },
});
