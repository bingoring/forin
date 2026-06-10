import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type as t } from '@/theme/tokens';

// Route shell — full UI in Stage 2-6.
export default function Screen() {
  return (
    <View style={styles.s}>
      <Text style={styles.h}>level</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  s: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  h: { fontFamily: fonts.heading, fontSize: t.screenHeading, color: colors.ink },
});
