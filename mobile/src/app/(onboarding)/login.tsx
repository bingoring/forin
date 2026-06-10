import { StyleSheet, Text, View } from 'react-native';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, space, type as t } from '@/theme/tokens';

// Social one-tap sign-in. Provider buttons are wired to /auth/social in Stage 4b.
export default function Login() {
  return (
    <View style={styles.s}>
      <Text style={styles.logo}>forin</Text>
      <Text style={styles.tag}>해외 이직, 언어로 막막할 때{'\n'}가장 따뜻한 현장 시뮬레이션</Text>
      <View style={styles.btns}>
        <PixelButton label="Google로 계속하기" bg={colors.cream} shadowColor={colors.ink} onPress={() => {}} style={styles.full} />
        <PixelButton label="Apple로 계속하기" bg={colors.ink} textColor={colors.cream} shadowColor={colors.text} onPress={() => {}} style={styles.full} />
        <PixelButton label="카카오로 시작하기" bg={colors.yellow} shadowColor={colors.yellowShadow} onPress={() => {}} style={styles.full} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  s: { flex: 1, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.lg },
  logo: { fontFamily: fonts.heading, fontSize: t.hero, color: colors.ink, letterSpacing: 2 },
  tag: { fontFamily: fonts.body, fontSize: t.body, color: colors.textSoft, textAlign: 'center', lineHeight: 22 },
  btns: { alignSelf: 'stretch', gap: space.md, marginTop: space.xxl },
  full: { width: '100%' },
});
