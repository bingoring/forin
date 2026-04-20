import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../stores/authStore';
import { colors, typography, spacing } from '../../theme';
import { t } from '../../locales';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password.length < 8) {
      Alert.alert(t('common.error'), t('auth.register.errors.passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || t('auth.register.errors.generic');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.register.title')}</Text>

        <View style={styles.form}>
          <Input
            label={t('auth.register.displayNameLabel')}
            placeholder={t('auth.register.displayNamePlaceholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label={t('auth.register.emailLabel')}
            placeholder={t('auth.register.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label={t('auth.register.passwordLabel')}
            placeholder={t('auth.register.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title={t('auth.register.submit')} onPress={handleRegister} loading={loading} />
        </View>

        <Button
          title={t('auth.register.toLogin')}
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.loginBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xl },
  form: { gap: spacing.sm },
  loginBtn: { marginTop: spacing.md },
});
