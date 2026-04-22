import type { TextStyle } from 'react-native';
import { color, fontFamily, fontSize } from './tokens';

// Pre-composed text styles. Screens should `import { text } from
// '../../theme'` and spread: `<Text style={text.h1}>...</Text>`. Adding
// a one-off style belongs in the screen's own StyleSheet, not here.

const base: TextStyle = {
  color: color.ink,
};

export const text = {
  display: {
    ...base,
    fontFamily: fontFamily.display,
    fontSize: fontSize.display,
    lineHeight: fontSize.display * 1.15,
  },
  h1: {
    ...base,
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    lineHeight: fontSize.h1 * 1.25,
  },
  h2: {
    ...base,
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    lineHeight: fontSize.h2 * 1.25,
  },
  h3: {
    ...base,
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    lineHeight: fontSize.h3 * 1.35,
  },
  body: {
    ...base,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.5,
  },
  bodyBold: {
    ...base,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body,
    lineHeight: fontSize.body * 1.5,
  },
  caption: {
    ...base,
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    lineHeight: fontSize.caption * 1.4,
    color: color.inkSoft,
  },
  captionBold: {
    ...base,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.caption,
    lineHeight: fontSize.caption * 1.4,
    color: color.inkSoft,
  },
  micro: {
    ...base,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.micro,
    lineHeight: fontSize.micro * 1.4,
    color: color.inkFaint,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  button: {
    ...base,
    fontFamily: fontFamily.heading,
    fontSize: fontSize.body,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;

export type TextVariant = keyof typeof text;
