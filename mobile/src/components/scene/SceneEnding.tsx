import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common';
import { Mascot } from '../mascot';
import { colors, typography, spacing } from '../../theme';
import { t } from '../../locales';

interface Props {
  endingMd: string;
  onContinue: () => void;
}

export function SceneEnding({ endingMd, onContinue }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.badge}>{t('scene.endingBadge')}</Text>
        <View style={styles.mascot}>
          <Mascot pose="explain" size={120} />
        </View>
        <Text style={styles.body}>{endingMd}</Text>
      </ScrollView>
      <Button title={t('common.continue')} onPress={onContinue} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'space-between' },
  content: { flexGrow: 1, justifyContent: 'center' },
  badge: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  mascot: { alignItems: 'center', marginBottom: spacing.md },
  body: { ...typography.body, color: colors.textPrimary, textAlign: 'center', lineHeight: 26 },
  btn: { marginTop: spacing.lg },
});
