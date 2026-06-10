import { StyleSheet, Text, View } from 'react-native';
import { PixelBox } from '@/components/PixelBox';
import { colors, fonts, space, type as t } from '@/theme/tokens';

export default function Board() {
  return (
    <View style={styles.screen}>
      <Text style={styles.h}>오늘의 상황판</Text>
      <PixelBox style={styles.card}>
        <Text style={styles.body}>매일 갱신되는 상황·환자 이벤트 (Stage 2-6).</Text>
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
