import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../common';
import { NPCAvatar } from '../mascot';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getNPC } from '../../data/npcs';
import { t } from '../../locales';

interface Props {
  npcKey: string | null;
  openerMd: string;
  tensionLevel: string;
  onContinue: () => void;
}

export function SceneOpener({ npcKey, openerMd, tensionLevel, onContinue }: Props) {
  const npc = getNPC(npcKey);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.badge}>{t('scene.openerBadge')}</Text>
        {npc ? (
          <View style={styles.npcRow}>
            <NPCAvatar category={npc.category} displayName={npc.displayName} size={96} />
          </View>
        ) : null}
        <View style={styles.tagsRow}>
          <Text style={styles.tag}>{t('scene.tagTension')}: {tensionLevel}</Text>
        </View>
        <Text style={styles.body}>{openerMd}</Text>
      </ScrollView>
      <Button title={t('scene.continue')} onPress={onContinue} style={styles.btn} />
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
  npcRow: { alignItems: 'center', marginBottom: spacing.md },
  tagsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.md },
  tag: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.accent + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  body: { ...typography.body, color: colors.textPrimary, textAlign: 'center', lineHeight: 26 },
  btn: { marginTop: spacing.lg },
});
