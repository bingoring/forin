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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || t('auth.login.errors.generic');
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
            <Hatto variant="face" size={120} />
            <SpeechBubble style={styles.bubble}>
              {t('auth.login.tagline')}
            </SpeechBubble>
          </View>

          <Text style={[text.display, styles.brand]}>
            {t('auth.login.brand')}
          </Text>

          <View style={styles.form}>
            <TextInput
              label={t('auth.login.emailLabel')}
              placeholder={t('auth.login.emailPlaceholder')}
              iconLeft="chat"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              label={t('auth.login.passwordLabel')}
              placeholder={t('auth.login.passwordPlaceholder')}
              iconLeft="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button full size="lg" onPress={handleLogin} loading={loading}>
              {t('auth.login.submit')}
            </Button>
          </View>

          <Divider label={t('common.or')} style={styles.divider} />

          <Button
            full
            size="lg"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          >
            {t('auth.login.toRegister')}
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
  brand: {
    textAlign: 'center',
    color: color.primary,
  },
  form: {
    gap: sp.s3,
  },
  divider: {
    marginVertical: sp.s3,
  },
});
