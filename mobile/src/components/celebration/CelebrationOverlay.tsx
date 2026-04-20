import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Mascot } from '../mascot';
import { Button } from '../common';
import { colors, typography, spacing } from '../../theme';
import { t } from '../../locales';

interface Props {
  visible: boolean;
  title: string;
  subtitle: string;
  onDismiss: () => void;
}

export function CelebrationOverlay({ visible, title, subtitle, onDismiss }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onDismiss}>
        <View style={styles.card}>
          <Mascot pose="cheer" size={160} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Button title={t('common.continue')} onPress={onDismiss} style={styles.btn} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(58, 42, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  btn: { marginTop: spacing.lg, width: '100%' },
});
