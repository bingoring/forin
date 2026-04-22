import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Icon, type IconName } from './Icon';
import { color, fontFamily, fontSize, radius, sp } from '../theme';

// TextInput — the one form field the DS ships.
//
// Focus state drives the border colour (hair → primary → danger); the
// label/hint/error stack lives outside the border box so we don't fight
// padding math. Callers wanting a chromeless field should skip this and
// drop a raw RNTextInput styled with `text.body` — but 99% of fields
// want the chrome, so this is the default.

export interface TextInputProps
  extends Omit<RNTextInputProps, 'style' | 'onChange'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export function TextInput({
  label,
  hint,
  error,
  iconLeft,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? color.danger
    : focused
    ? color.primary
    : color.hairDark;

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.box, { borderColor }, inputStyle]}>
        {iconLeft && <Icon name={iconLeft} size={18} color={color.inkSoft} />}
        <RNTextInput
          style={styles.input}
          placeholderTextColor={color.inkFaint}
          selectionColor={color.primary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {(error || hint) && (
        <Text style={[styles.hint, error && styles.error]}>{error || hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.micro,
    color: color.inkSoft,
    marginBottom: sp.s1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp.s2,
    paddingHorizontal: sp.s3 + 2,
    paddingVertical: sp.s3,
    backgroundColor: color.paper,
    borderWidth: 2,
    borderRadius: radius.r1,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body,
    color: color.ink,
  },
  hint: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.micro + 1,
    color: color.inkSoft,
    marginTop: sp.s1,
  },
  error: {
    color: color.danger,
  },
});
