import React, { useState } from 'react';
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
import { gamificationApi } from '../../api';
import {
  Badge,
  Card,
  Hatto,
  Icon,
  SectionHeader,
  Tabs,
  type IconName,
} from '../../ui';
import { color, fontFamily, fontSize, sp, text } from '../../theme';
import { t } from '../../locales';

type Slot = 'hat' | 'outfit' | 'accessory' | 'background' | 'expression';

const SLOTS: ReadonlyArray<{ value: Slot; label: string }> = [
  { value: 'hat',        label: 'Hat' },
  { value: 'outfit',     label: 'Outfit' },
  { value: 'accessory',  label: 'Accessory' },
  { value: 'background', label: 'Background' },
  { value: 'expression', label: 'Expression' },
];

// Per-slot glyph from the DS Icon set — no per-item art yet.
const SLOT_ICON: Record<Slot, IconName> = {
  hat: 'star',
  outfit: 'gift',
  accessory: 'gem',
  background: 'home',
  expression: 'heart',
};

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

export function InventoryScreen() {
  const [activeSlot, setActiveSlot] = useState<Slot>('hat');
  const queryClient = useQueryClient();

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data } = await gamificationApi.getInventory();
      return data.data;
    },
  });

  const items = (inventory?.items ?? []).filter((i: any) => i.slot === activeSlot);

  const handleEquip = async (itemId: string, isEquipped: boolean) => {
    try {
      await gamificationApi.equipCatItem(activeSlot, isEquipped ? null : itemId);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      Alert.alert(t('common.error'), t('inventory.equipFailed'));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card variant="cream" style={styles.preview}>
          <Hatto variant="face" size={112} />
          <Text style={[text.captionBold, styles.previewText]}>
            {t('inventory.total', { count: inventory?.total_items ?? 0 })}
          </Text>
        </Card>

        <SectionHeader title={t('inventory.title')} />

        <Tabs<Slot> items={SLOTS} value={activeSlot} onChange={setActiveSlot} />

        <View style={styles.grid}>
          {items.map((item: any) => {
            const tone = RARITY_TONE[item.rarity] ?? 'sky';
            return (
              <Pressable
                key={item.id}
                onPress={() => handleEquip(item.id, item.is_equipped)}
                style={({ pressed }) => [
                  styles.card,
                  item.is_equipped && styles.cardEquipped,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.iconBubble}>
                  <Icon
                    name={SLOT_ICON[activeSlot]}
                    size={28}
                    color={color.ink}
                  />
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Badge tone={tone}>{item.rarity}</Badge>
                {item.is_equipped && (
                  <Text style={styles.equipped}>
                    {t('inventory.equipped')}
                  </Text>
                )}
              </Pressable>
            );
          })}

          {items.length === 0 && (
            <Text style={styles.emptyText}>
              {t('inventory.empty', { slot: activeSlot })}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: { padding: sp.s5, gap: sp.s4, paddingBottom: sp.s8 },
  preview: {
    alignItems: 'center',
    gap: sp.s2,
  },
  previewText: {
    color: color.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
  cardEquipped: {
    borderColor: color.primary,
    borderBottomColor: color.primaryDeep,
    backgroundColor: color.primaryLight,
  },
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
  equipped: {
    fontFamily: fontFamily.display,
    fontSize: 10,
    color: color.primaryDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  emptyText: {
    ...text.body,
    color: color.inkSoft,
    textAlign: 'center',
    width: '100%',
    paddingVertical: sp.s7,
  },
});
