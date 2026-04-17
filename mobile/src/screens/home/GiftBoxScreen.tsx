import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../../api';
import { Button } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import type { HomeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'GiftBox'>;

const rarityColors: Record<string, string> = {
  common: colors.rarityCommon,
  uncommon: colors.rarityUncommon,
  rare: colors.rarityRare,
  epic: colors.rarityEpic,
  legendary: colors.rarityLegendary,
};

const boxEmojis: Record<string, string> = {
  basic: '📦',
  silver: '🪙',
  gold: '✨',
  legendary: '💎',
};

export function GiftBoxScreen({ route, navigation }: Props) {
  const { boxId, boxType } = route.params;
  const [opened, setOpened] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleOpen = async () => {
    setLoading(true);
    try {
      const { data } = await gamificationApi.openGiftBox(boxId);
      setResult(data.data);
      setOpened(true);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      alert('Failed to open gift box');
    } finally {
      setLoading(false);
    }
  };

  if (!opened) {
    return (
      <View style={styles.container}>
        <Text style={styles.boxEmoji}>{boxEmojis[boxType] || '📦'}</Text>
        <Text style={styles.boxType}>{boxType.toUpperCase()} Gift Box</Text>
        <Text style={styles.hint}>Tap to discover what's inside!</Text>
        <Button title="Open" onPress={handleOpen} loading={loading} style={styles.openBtn} />
      </View>
    );
  }

  const item = result.item;
  const rarityColor = rarityColors[item.rarity] || colors.textMuted;

  return (
    <View style={styles.container}>
      <View style={[styles.itemFrame, { borderColor: rarityColor }]}>
        <Text style={styles.itemEmoji}>🎁</Text>
      </View>

      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={[styles.itemRarity, { color: rarityColor }]}>
        {item.rarity.toUpperCase()} - {item.slot}
      </Text>

      {item.description && (
        <Text style={styles.itemDesc}>{item.description}</Text>
      )}

      {result.was_duplicate && (
        <View style={styles.duplicateBanner}>
          <Text style={styles.duplicateText}>
            Already owned! Converted to {result.catnip_earned} Catnip 🌿
          </Text>
        </View>
      )}

      <Button
        title="Continue"
        onPress={() => navigation.goBack()}
        style={styles.continueBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  boxEmoji: { fontSize: 96, marginBottom: spacing.md },
  boxType: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  hint: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  openBtn: { width: '100%' },
  itemFrame: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  itemEmoji: { fontSize: 56 },
  itemName: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  itemRarity: { ...typography.bodyBold, marginBottom: spacing.sm },
  itemDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  duplicateBanner: {
    backgroundColor: colors.catnip + '20',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  duplicateText: { ...typography.bodyBold, color: colors.catnip, textAlign: 'center' },
  continueBtn: { width: '100%', marginTop: spacing.lg },
});
