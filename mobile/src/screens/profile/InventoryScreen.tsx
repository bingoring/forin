import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../../api';
import { colors, typography, spacing, borderRadius } from '../../theme';

const SLOTS = ['hat', 'outfit', 'accessory', 'background', 'expression'] as const;

const rarityColors: Record<string, string> = {
  common: colors.rarityCommon,
  uncommon: colors.rarityUncommon,
  rare: colors.rarityRare,
  epic: colors.rarityEpic,
  legendary: colors.rarityLegendary,
};

export function InventoryScreen() {
  const [activeSlot, setActiveSlot] = useState<string>('hat');
  const queryClient = useQueryClient();

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data } = await gamificationApi.getInventory();
      return data.data;
    },
  });

  const items = inventory?.items?.filter((i: any) => i.slot === activeSlot) || [];

  const handleEquip = async (itemId: string, isEquipped: boolean) => {
    try {
      await gamificationApi.equipCatItem(activeSlot, isEquipped ? null : itemId);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      Alert.alert('Error', 'Failed to equip item');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.subtitle}>
        {inventory?.total_items || 0} items collected
      </Text>

      {/* Cat preview */}
      <View style={styles.catPreview}>
        <Text style={styles.catEmoji}>🐱</Text>
      </View>

      {/* Slot tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabs}>
          {SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.tab, activeSlot === slot && styles.tabActive]}
              onPress={() => setActiveSlot(slot)}
            >
              <Text style={[styles.tabText, activeSlot === slot && styles.tabTextActive]}>
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Items grid */}
      <View style={styles.grid}>
        {items.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard,
              { borderColor: rarityColors[item.rarity] || colors.border },
              item.is_equipped && styles.itemCardEquipped,
            ]}
            onPress={() => handleEquip(item.id, item.is_equipped)}
          >
            <Text style={styles.itemEmoji}>🎁</Text>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.itemRarity, { color: rarityColors[item.rarity] }]}>
              {item.rarity}
            </Text>
            {item.is_equipped && <Text style={styles.equippedBadge}>Equipped</Text>}
          </TouchableOpacity>
        ))}

        {items.length === 0 && (
          <Text style={styles.emptyText}>No {activeSlot} items yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  catPreview: {
    height: 120,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catEmoji: { fontSize: 64 },
  tabsScroll: { marginBottom: spacing.md },
  tabs: { flexDirection: 'row', gap: spacing.xs },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { ...typography.caption, color: colors.textSecondary },
  tabTextActive: { color: colors.white, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  itemCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    padding: spacing.sm,
    alignItems: 'center',
  },
  itemCardEquipped: { backgroundColor: '#EEF2FF' },
  itemEmoji: { fontSize: 32, marginBottom: spacing.xs },
  itemName: { ...typography.caption, color: colors.textPrimary, fontWeight: '600' },
  itemRarity: { ...typography.small },
  equippedBadge: { ...typography.small, color: colors.primary, fontWeight: '700', marginTop: 2 },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', width: '100%', marginTop: spacing.xl },
});
