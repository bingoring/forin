import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi, userApi } from '../../api';
import {
  Badge,
  Card,
  CoinChip,
  Icon,
  SectionHeader,
  Toast,
} from '../../ui';
import { color, fontFamily, fontSize, sp, text } from '../../theme';
import { t } from '../../locales';

const RARITY_TONE: Record<
  string,
  'sky' | 'mint' | 'coral' | 'lav' | 'sun'
> = {
  common: 'sky',
  uncommon: 'mint',
  rare: 'coral',
  epic: 'lav',
  legendary: 'sun',
};

export function ShopScreen() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
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

  const handlePurchase = async (
    itemId: string,
    itemName: string,
    price: number,
  ) => {
    Alert.alert(
      t('shop.confirmTitle'),
      t('shop.confirmBody', { name: itemName, price }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('shop.buy'),
          onPress: async () => {
            try {
              await gamificationApi.purchaseItem(itemId);
              queryClient.invalidateQueries({ queryKey: ['shop'] });
              queryClient.invalidateQueries({ queryKey: ['inventory'] });
              queryClient.invalidateQueries({ queryKey: ['profile'] });
              Alert.alert(
                t('shop.purchased'),
                t('shop.purchasedBody', { name: itemName }),
              );
            } catch (err: any) {
              const code = err?.response?.data?.error?.code;
              Alert.alert(
                t('common.error'),
                code === 'INSUFFICIENT_CATNIP'
                  ? t('shop.notEnough')
                  : t('shop.purchaseFailed'),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SectionHeader title={t('shop.title')} />
          <CoinChip amount={profile?.catnip ?? 0} tone="heart" />
        </View>

        {shop?.featured_item && !shop.featured_item.user_owns && (
          <Card
            variant="coral"
            onPress={() =>
              handlePurchase(
                shop.featured_item!.id,
                shop.featured_item!.name,
                shop.featured_item!.shop_price_catnip,
              )
            }
          >
            <Badge tone="coral">{t('shop.featured')}</Badge>
            <View style={styles.featuredBody}>
              <View style={styles.featuredIcon}>
                <Icon name="gift" size={56} color={color.accentDeep} />
              </View>
              <Text style={[text.h2, styles.featuredName]}>
                {shop.featured_item.name}
              </Text>
              <Badge
                tone={RARITY_TONE[shop.featured_item.rarity] ?? 'sky'}
              >
                {shop.featured_item.rarity}
              </Badge>
              <View style={{ marginTop: sp.s2 }}>
                <CoinChip
                  amount={shop.featured_item.shop_price_catnip}
                  tone="heart"
                />
              </View>
            </View>
          </Card>
        )}

        {shop?.featured_item?.user_owns && (
          <Toast tone="success">{t('shop.featuredOwned')}</Toast>
        )}

        <View style={styles.grid}>
          {shop?.items?.map((item: any) => {
            const tone = RARITY_TONE[item.rarity] ?? 'sky';
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (!item.user_owns) {
                    handlePurchase(item.id, item.name, item.shop_price_catnip);
                  }
                }}
                disabled={item.user_owns}
                style={({ pressed }) => [
                  styles.card,
                  item.user_owns && styles.owned,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.iconBubble}>
                  <Icon
                    name={item.user_owns ? 'check' : 'gift'}
                    size={28}
                    color={item.user_owns ? color.successDeep : color.ink}
                  />
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Badge tone={tone}>{item.rarity}</Badge>
                {item.user_owns ? (
                  <Text style={styles.ownedText}>{t('shop.ownedShort')}</Text>
                ) : (
                  <CoinChip
                    amount={item.shop_price_catnip}
                    tone="heart"
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: { padding: sp.s5, gap: sp.s4, paddingBottom: sp.s8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredBody: {
    alignItems: 'center',
    gap: sp.s2,
    marginTop: sp.s3,
  },
  featuredIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: color.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredName: { color: color.ink, textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp.s3,
  },
  card: {
    width: '47%',
    backgroundColor: color.paper,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.hair,
    borderBottomWidth: 3,
    borderBottomColor: color.hair,
    padding: sp.s3,
    alignItems: 'center',
    gap: sp.s1,
  },
  owned: { opacity: 0.6 },
  pressed: { opacity: 0.8 },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.s1,
  },
  itemName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.caption,
    color: color.ink,
  },
  ownedText: {
    fontFamily: fontFamily.display,
    fontSize: 10,
    color: color.successDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
