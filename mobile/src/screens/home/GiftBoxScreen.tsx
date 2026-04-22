import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamificationApi } from '../../api';
import {
  Badge,
  Button,
  Card,
  Hatto,
  Icon,
  SpeechBubble,
  Toast,
} from '../../ui';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';
import { analytics } from '../../analytics';
import type { MapStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MapStackParamList, 'GiftBox'>;

// Box type → card variant. Tone is purely decorative; the rarity of
// the item inside determines the Badge tone in the opened state.
const BOX_VARIANT: Record<string, 'sky' | 'sun' | 'premium'> = {
  silver: 'sky',
  gold: 'sun',
  legendary: 'premium',
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
      const openedResult = data.data;
      setResult(openedResult);
      setOpened(true);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      analytics.track({
        name: 'gift_box_open',
        properties: {
          box_type: boxType,
          item_rarity: openedResult.item?.rarity ?? 'unknown',
          was_duplicate: !!openedResult.was_duplicate,
        },
      });
    } catch {
      Alert.alert(t('common.error'), t('home.gift.openFailed'));
    } finally {
      setLoading(false);
    }
  };

  const boxVariant = BOX_VARIANT[boxType] ?? 'sky';

  if (!opened) {
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Hatto variant="face" size={96} />
            <SpeechBubble style={styles.bubble}>
              {t('home.gift.hint')}
            </SpeechBubble>
          </View>

          <Card variant={boxVariant} style={styles.boxCard}>
            <Icon name="gift" size={96} color={color.ink} />
          </Card>

          <Text style={[text.h1, styles.boxTitle]}>
            {t('home.gift.box', { type: boxType.toUpperCase() })}
          </Text>
        </View>

        <View style={styles.footer}>
          <Button full size="lg" onPress={handleOpen} loading={loading}>
            {t('home.gift.open')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const item = result.item;
  const rarityTone = RARITY_TONE[item.rarity] ?? 'sky';

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="face" size={96} />
          <SpeechBubble tone="coral" style={styles.bubble}>
            {item.name}
          </SpeechBubble>
        </View>

        <Card variant={boxVariant} style={styles.boxCard}>
          <Icon name="gift" size={72} color={color.ink} />
        </Card>

        <View style={styles.info}>
          <Text style={[text.h2, styles.itemName]}>{item.name}</Text>
          <Badge tone={rarityTone}>
            {t('home.gift.rarityLabel', {
              rarity: item.rarity,
              slot: item.slot,
            })}
          </Badge>
          {item.description && (
            <Text style={[text.body, styles.itemDesc]}>
              {item.description}
            </Text>
          )}
        </View>

        {result.was_duplicate && (
          <Toast tone="info">
            {t('home.gift.duplicate', { amount: result.catnip_earned })}
          </Toast>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button full size="lg" onPress={() => navigation.goBack()}>
          {t('home.gift.continue')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  content: {
    flexGrow: 1,
    padding: sp.s5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp.s5,
  },
  hero: { alignItems: 'center', gap: sp.s3 },
  bubble: { maxWidth: 280 },
  boxCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sp.s7,
    width: '100%',
  },
  boxTitle: {
    textAlign: 'center',
    color: color.ink,
  },
  info: {
    alignItems: 'center',
    gap: sp.s2,
    paddingHorizontal: sp.s3,
  },
  itemName: { color: color.ink, textAlign: 'center' },
  itemDesc: { color: color.inkSoft, textAlign: 'center', marginTop: sp.s2 },
  footer: {
    padding: sp.s5,
    borderTopWidth: 1,
    borderTopColor: color.hair,
    backgroundColor: color.cream,
  },
});
