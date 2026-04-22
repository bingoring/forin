import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { curriculumApi } from '../../api';
import {
  Badge,
  Button,
  Card,
  Hatto,
  ListRow,
  SectionHeader,
  SpeechBubble,
} from '../../ui';
import { color, sp, text } from '../../theme';
import { t } from '../../locales';
import type { QuestsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<QuestsStackParamList, 'QuestsMain'>;

export function QuestsScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: async () => {
      const { data } = await curriculumApi.getCurriculum();
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={color.primary} size="large" />
      </View>
    );
  }

  const modules = data?.modules ?? [];
  const allStages = modules.flatMap((m) =>
    m.units.flatMap((u) => u.stages.map((s) => ({ module: m, unit: u, stage: s }))),
  );
  const inProgress = allStages.filter(
    (x) => x.stage.progress?.status !== 'completed',
  );
  const recommended = inProgress.slice(0, 5);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Hatto variant="face" size={80} />
          <SpeechBubble style={styles.bubble}>
            {recommended.length === 0
              ? t('quests.allClear')
              : t('quests.hattoHint', { count: recommended.length })}
          </SpeechBubble>
        </View>

        <SectionHeader
          eyebrow={t('quests.eyebrow')}
          title={t('quests.title')}
        />

        {recommended.length === 0 ? (
          <Card variant="mint">
            <Text style={[text.bodyBold, styles.emptyText]}>
              {t('quests.allClear')}
            </Text>
          </Card>
        ) : (
          <Card variant="paper" padding={0} style={styles.list}>
            {recommended.map(({ module, unit, stage }, idx) => (
              <ListRow
                key={stage.id}
                title={stage.title}
                subtitle={`${module.floor_label} · ${unit.title}`}
                trailing={<Badge tone="sun">{t('quests.cta')}</Badge>}
                onPress={() =>
                  navigation.navigate('StageIntro', { stageId: stage.id })
                }
                last={idx === recommended.length - 1}
              />
            ))}
          </Card>
        )}

        {recommended.length > 0 && (
          <Button
            variant="secondary"
            size="md"
            onPress={() =>
              navigation.navigate('StageIntro', {
                stageId: recommended[0].stage.id,
              })
            }
          >
            {t('quests.startTop')}
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.cream,
  },
  content: { padding: sp.s5, gap: sp.s4, paddingBottom: sp.s8 },
  hero: { alignItems: 'center', gap: sp.s3 },
  bubble: { maxWidth: 280 },
  list: {
    overflow: 'hidden',
  },
  emptyText: { textAlign: 'center', color: color.successDeep },
});
