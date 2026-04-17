import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, fontFamily },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, fontFamily },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24, fontFamily },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, fontFamily },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, fontFamily },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, fontFamily },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, fontFamily },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20, fontFamily },
} as const;
