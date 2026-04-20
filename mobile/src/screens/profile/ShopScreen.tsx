import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../../api';
import { Icon } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';

const rarityColors: Record<string, string> = {
  common: colors.rarityCommon,
  uncommon: colors.rarityUncommon,
  rare: colors.rarityRare,
  epic: colors.rarityEpic,
  legendary: colors.rarityLegendary,
};

export function ShopScreen() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await (await import('../../api')).userApi.getProfile();
      return data.data;
    },
  });

  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      const { data } = await gamificationApi.getShop();
      return data.data;
    },
  });

  const handlePurchase = async (itemId: string, itemName: string, price: number) => {
    Alert.alert(
      'Purchase',
      `Buy ${itemName} for ${price} Catnip?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            try {
              await gamificationApi.purchaseItem(itemId);
              queryClient.invalidateQueries({ queryKey: ['shop'] });
              queryClient.invalidateQueries({ queryKey: ['inventory'] });
              queryClient.invalidateQueries({ queryKey: ['profile'] });
              Alert.alert('Purchased!', `${itemName} has been added to your inventory.`);
            } catch (err: any) {
              const code = err?.response?.data?.error?.code;
              if (code === 'INSUFFICIENT_CATNIP') {
                Alert.alert('Not enough Catnip', 'Earn more by opening gift boxes!');
              } else {
                Alert.alert('Error', 'Purchase failed');
              }
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Cat Shop</Text>
        <View style={styles.balanceRow}>
          <Icon name="catnip" size={18} color={colors.catnip} />
          <Text style={styles.balance}> {profile?.catnip || 0} Catnip</Text>
        </View>
      </View>

      {/* Featured */}
      {shop?.featured_item && !shop.featured_item.user_owns && (
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => handlePurchase(shop.featured_item!.id, shop.featured_item!.name, shop.featured_item!.shop_price_catnip)}
        >
          <Text style={styles.featuredLabel}>FEATURED</Text>
          <View style={styles.featuredIcon}>
            <Icon name="xp" size={48} color={colors.accent} />
          </View>
          <Text style={styles.featuredName}>{shop.featured_item.name}</Text>
          <Text style={[styles.featuredRarity, { color: rarityColors[shop.featured_item.rarity] }]}>
            {shop.featured_item.rarity} - {shop.featured_item.slot}
          </Text>
          <View style={styles.featuredPriceRow}>
            <Icon name="catnip" size={20} color={colors.catnip} />
            <Text style={styles.featuredPrice}> {shop.featured_item.shop_price_catnip}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* All items */}
      <View style={styles.grid}>
        {shop?.items?.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemCard,
              { borderColor: rarityColors[item.rarity] || colors.border },
              item.user_owns && styles.itemOwned,
            ]}
            onPress={() => {
              if (!item.user_owns) handlePurchase(item.id, item.name, item.shop_price_catnip);
            }}
            disabled={item.user_owns}
          >
            <View style={styles.itemIcon}>
              <Icon
                name={item.user_owns ? 'check' : 'gift'}
                size={28}
                color={item.user_owns ? colors.success : rarityColors[item.rarity] || colors.primary}
              />
            </View>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.itemRarity, { color: rarityColors[item.rarity] }]}>{item.rarity}</Text>
            {item.user_owns ? (
              <Text style={styles.itemOwnedText}>Owned</Text>
            ) : (
              <View style={styles.itemPriceRow}>
                <Icon name="catnip" size={14} color={colors.catnip} />
                <Text style={styles.itemPrice}> {item.shop_price_catnip}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balance: { ...typography.bodyBold, color: colors.catnip },
  featuredCard: {
    backgroundColor: colors.accent + '15',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featuredLabel: { ...typography.small, color: colors.accent, fontWeight: '700', letterSpacing: 2 },
  featuredIcon: { marginVertical: spacing.sm },
  featuredName: { ...typography.h2, color: colors.textPrimary },
  featuredRarity: { ...typography.caption, marginBottom: spacing.xs },
  featuredPriceRow: { flexDirection: 'row', alignItems: 'center' },
  featuredPrice: { ...typography.h3, color: colors.catnip },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  itemCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    padding: spacing.sm,
    alignItems: 'center',
  },
  itemOwned: { opacity: 0.5 },
  itemIcon: { marginBottom: spacing.xs },
  itemName: { ...typography.caption, color: colors.textPrimary, fontWeight: '600' },
  itemRarity: { ...typography.small },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  itemPrice: { ...typography.caption, color: colors.catnip, fontWeight: '600' },
  itemOwnedText: { ...typography.caption, color: colors.success, fontWeight: '600', marginTop: 2 },
});
