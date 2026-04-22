import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Divider,
  Hatto,
  SpeechBubble,
  TextInput,
} from '../../ui';
import { useAuthStore } from '../../stores/authStore';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  // Mirror of the server-side validation so the error surfaces before
  // we hit the network. Anything more complex (length, symbols) stays
  // server-authoritative.
  const passwordTooShort = password.length > 0 && password.length < 8;

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (passwordTooShort) {
      Alert.alert(
        t('common.error'),
        t('auth.register.errors.passwordTooShort'),
      );
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message || t('auth.register.errors.generic');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Hatto variant="face" size={96} />
            <SpeechBubble style={styles.bubble}>
              {t('auth.register.tagline')}
            </SpeechBubble>
          </View>

          <Text style={[text.h1, styles.title]}>
            {t('auth.register.title')}
          </Text>

          <View style={styles.form}>
            <TextInput
              label={t('auth.register.displayNameLabel')}
              placeholder={t('auth.register.displayNamePlaceholder')}
              iconLeft="person"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <TextInput
              label={t('auth.register.emailLabel')}
              placeholder={t('auth.register.emailPlaceholder')}
              iconLeft="chat"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              label={t('auth.register.passwordLabel')}
              placeholder={t('auth.register.passwordPlaceholder')}
              iconLeft="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={
                passwordTooShort
                  ? t('auth.register.errors.passwordTooShort')
                  : undefined
              }
            />
            <Button full size="lg" onPress={handleRegister} loading={loading}>
              {t('auth.register.submit')}
            </Button>
          </View>

          <Divider label={t('common.or')} style={styles.divider} />

          <Button
            full
            size="lg"
            variant="secondary"
            onPress={() => navigation.goBack()}
          >
            {t('auth.register.toLogin')}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: sp.s5,
    paddingVertical: sp.s7,
    gap: sp.s5,
  },
  hero: {
    alignItems: 'center',
    gap: sp.s3,
  },
  bubble: {
    maxWidth: 280,
  },
  title: {
    textAlign: 'center',
    color: color.ink,
  },
  form: {
    gap: sp.s3,
  },
  divider: {
    marginVertical: sp.s3,
  },
});
