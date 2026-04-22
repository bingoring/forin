import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api';
import { Card, Icon, SectionHeader } from '../../ui';
import { color, fontFamily, fontSize, sp, text } from '../../theme';
import { t } from '../../locales';
import type { DailyStatEntry } from '../../types/api';

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklyStatsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'weekly'],
    queryFn: async () => {
      const res = await userApi.getWeeklyStats();
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={color.primary} size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <Text style={text.body}>{t('stats.empty')}</Text>
      </View>
    );
  }

  const hasActivity = data.stages_completed > 0;

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title={t('stats.title')} />

        <View style={styles.grid}>
          <StatTile
            icon="trophy"
            tone={color.xp}
            value={`${data.total_xp_earned}`}
            label={t('stats.totalXP')}
          />
          <StatTile
            icon="check"
            tone={color.success}
            value={`${data.stages_completed}`}
            label={t('stats.stagesCompleted')}
          />
          <StatTile
            icon="flame"
            tone={color.accent}
            value={`${data.current_streak}${t('stats.streakUnit')}`}
            label={t('stats.streak')}
          />
          <StatTile
            icon="heart"
            tone={color.danger}
            value={`${data.days_active}/7`}
            label={t('stats.daysActive')}
          />
        </View>

        <Card variant="paper">
          <Text style={[text.h3, styles.cardTitle]}>
            {t('stats.breakdownTitle')}
          </Text>
          {hasActivity ? (
            <BarChart days={data.daily_breakdown} />
          ) : (
            <Text style={styles.emptyText}>{t('stats.empty')}</Text>
          )}
        </Card>

        <Card variant="cream">
          <SecondaryRow label={t('stats.goalMet')} value={`${data.daily_goals_met}/7`} />
          <SecondaryRow
            label={t('stats.averageScore')}
            value={
              data.average_score > 0
                ? `${Math.round(data.average_score)}`
                : '—'
            }
            last
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({
  icon,
  tone,
  value,
  label,
}: {
  icon: 'trophy' | 'check' | 'flame' | 'heart';
  tone: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.tile}>
      <Icon name={icon} size={22} color={tone} />
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function SecondaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.secondaryRow, !last && styles.secondaryBorder]}>
      <Text style={styles.secondaryLabel}>{label}</Text>
      <Text style={styles.secondaryValue}>{value}</Text>
    </View>
  );
}

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - sp.s5 * 2 - sp.s4 * 2; // outer padding + card padding
const CHART_H = 180;
const CHART_BAR_AREA_H = 130;
const CHART_LABEL_H = 20;

function BarChart({ days }: { days: DailyStatEntry[] }) {
  const sorted = useMemo(() => {
    return [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [days]);

  const maxXP = Math.max(1, ...sorted.map((d) => d.xp_earned));
  const barCount = Math.max(sorted.length, 1);
  const slotW = CHART_W / barCount;
  const barW = Math.min(slotW * 0.6, 32);

  return (
    <Svg width={CHART_W} height={CHART_H}>
      <Line
        x1={0}
        y1={CHART_BAR_AREA_H}
        x2={CHART_W}
        y2={CHART_BAR_AREA_H}
        stroke={color.hair}
        strokeWidth={1}
      />
      {sorted.map((d, i) => {
        const h = (d.xp_earned / maxXP) * (CHART_BAR_AREA_H - 16);
        const x = i * slotW + (slotW - barW) / 2;
        const y = CHART_BAR_AREA_H - h;
        const fill = d.goal_met ? color.accent : color.primaryLight;
        const weekday = WEEKDAY_SHORT[new Date(d.date).getDay()];
        return (
          <React.Fragment key={d.date}>
            <Rect x={x} y={y} width={barW} height={h} rx={4} fill={fill} />
            {d.xp_earned > 0 ? (
              <SvgText
                x={x + barW / 2}
                y={y - 4}
                fontSize={10}
                fontWeight="700"
                textAnchor="middle"
                fill={color.inkSoft}
              >
                {d.xp_earned}
              </SvgText>
            ) : null}
            <SvgText
              x={x + barW / 2}
              y={CHART_BAR_AREA_H + CHART_LABEL_H - 4}
              fontSize={11}
              textAnchor="middle"
              fill={color.inkSoft}
            >
              {weekday}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: sp.s3 },
  tile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: color.paper,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.hair,
    borderBottomWidth: 3,
    borderBottomColor: color.hair,
    padding: sp.s3,
    alignItems: 'center',
    gap: 2,
  },
  tileValue: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.h2,
    color: color.ink,
    marginTop: sp.s1,
  },
  tileLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.micro,
    color: color.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  cardTitle: { marginBottom: sp.s2 },
  emptyText: {
    ...text.body,
    color: color.inkSoft,
    textAlign: 'center',
    paddingVertical: sp.s5,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sp.s2,
  },
  secondaryBorder: {
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  secondaryLabel: { ...text.body, color: color.inkSoft },
  secondaryValue: { ...text.bodyBold, color: color.ink },
});
