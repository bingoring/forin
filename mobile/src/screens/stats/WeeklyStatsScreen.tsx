import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../api';
import { Icon } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { t } from '../../locales';
import type { WeeklyStats, DailyStatEntry } from '../../types/api';

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
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <Text style={typography.body}>{t('stats.empty')}</Text>
      </View>
    );
  }

  const hasActivity = data.stages_completed > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('stats.title')}</Text>

      {/* Headline stats */}
      <View style={styles.grid}>
        <StatCard icon="xp" iconColor={colors.xp} value={`${data.total_xp_earned}`} label={t('stats.totalXP')} />
        <StatCard icon="check" iconColor={colors.success} value={`${data.stages_completed}`} label={t('stats.stagesCompleted')} />
        <StatCard icon="streak" iconColor={colors.streak} value={`${data.current_streak}${t('stats.streakUnit')}`} label={t('stats.streak')} />
        <StatCard icon="heart" iconColor={colors.heart} value={`${data.days_active}/7`} label={t('stats.daysActive')} />
      </View>

      {/* Bar chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>{t('stats.breakdownTitle')}</Text>
        {hasActivity ? (
          <BarChart days={data.daily_breakdown} />
        ) : (
          <Text style={styles.emptyText}>{t('stats.empty')}</Text>
        )}
      </View>

      {/* Secondary stats */}
      <View style={styles.secondaryCard}>
        <SecondaryRow label={t('stats.goalMet')} value={`${data.daily_goals_met}/7`} />
        <SecondaryRow label={t('stats.averageScore')} value={data.average_score > 0 ? `${Math.round(data.average_score)}` : '—'} />
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: 'xp' | 'check' | 'streak' | 'heart';
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Icon name={icon} size={22} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SecondaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.secondaryRow}>
      <Text style={styles.secondaryLabel}>{label}</Text>
      <Text style={styles.secondaryValue}>{value}</Text>
    </View>
  );
}

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - spacing.md * 2 - spacing.md * 2; // outer padding + card padding
const CHART_H = 180;
const CHART_BAR_AREA_H = 130;
const CHART_LABEL_H = 20;

function BarChart({ days }: { days: DailyStatEntry[] }) {
  // Normalize to exactly 7 days ordered by date ascending. The backend
  // returns up to 7 rows; fill missing days with zeroes so the chart
  // shape is stable.
  const sorted = useMemo(() => {
    return [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [days]);

  const maxXP = Math.max(1, ...sorted.map((d) => d.xp_earned));
  const barCount = Math.max(sorted.length, 1);
  const slotW = CHART_W / barCount;
  const barW = Math.min(slotW * 0.6, 32);

  return (
    <Svg width={CHART_W} height={CHART_H}>
      {/* Baseline */}
      <Line
        x1={0}
        y1={CHART_BAR_AREA_H}
        x2={CHART_W}
        y2={CHART_BAR_AREA_H}
        stroke={colors.border}
        strokeWidth={1}
      />
      {sorted.map((d, i) => {
        const h = (d.xp_earned / maxXP) * (CHART_BAR_AREA_H - 16);
        const x = i * slotW + (slotW - barW) / 2;
        const y = CHART_BAR_AREA_H - h;
        const fill = d.goal_met ? colors.accent : colors.primaryLight;
        const weekday = WEEKDAY_SHORT[new Date(d.date).getDay()];
        return (
          <React.Fragment key={d.date}>
            <Rect x={x} y={y} width={barW} height={h} rx={4} fill={fill} />
            {d.xp_earned > 0 ? (
              <SvgText
                x={x + barW / 2}
                y={y - 4}
                fontSize={10}
                fontWeight="600"
                textAnchor="middle"
                fill={colors.textSecondary}
              >
                {d.xp_earned}
              </SvgText>
            ) : null}
            <SvgText
              x={x + barW / 2}
              y={CHART_BAR_AREA_H + CHART_LABEL_H - 4}
              fontSize={11}
              textAnchor="middle"
              fill={colors.textSecondary}
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.xs },
  statLabel: { ...typography.small, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  secondaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  secondaryLabel: { ...typography.body, color: colors.textSecondary },
  secondaryValue: { ...typography.bodyBold, color: colors.textPrimary },
});
