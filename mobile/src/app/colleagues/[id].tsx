// 동료 프로필 — the 근무 수첩 line (v30).
//
// 서버는 연결되지 않은 상대에게 404를 준다(403이면 계정 존재가 새어나간다) — 여기서는
// 그냥 "찾을 수 없어요"로 보여주면 된다. 공개 범위를 끈 동료는 해당 블록을 숨긴다.
//
// ⚔ 대결 버튼은 렌더하지 않는다: 규칙·서버가 없는 버튼을 두면 눌렀을 때 아무 일도
// 일어나지 않는다(Build Spec Q4에서 이번 범위 제외로 확정). 같은 이유로 v30 아트보드의
// 멘토 요청 버튼과 '최근 라운지 글' 목록도 그리지 않는다 — 멘토 요청 엔드포인트가 없고,
// 라운지 글은 서버에 글이라는 것 자체가 아직 없다. 대신 준비 중이라고 말한다.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbPolaroid, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { avatarSpecFromSeed, normalizeAvatarSpec } from '@/data/nbAvatar';
import { nb, nbFonts } from '@/theme/nb';
import { CheerSheet } from '@/components/CheerSheet';
import { NbBackTitle, RelTag, SectionRule } from './index';
import { api, type ColleagueDetail, type ColleagueRelation } from '@/api/client';
import { type Translate, useLocale, useT } from '@/i18n';

/** Weekday initials for a Mon-first strip, in the reader's language.
 *
 *  Intl rather than a Korean array: the letters differ per language and a hardcoded
 *  set would stay Korean under every other locale. 2026-01-05 is a Monday, so
 *  adding the index walks Mon → Sun regardless of where the locale's week starts. */
function weekdayInitials(locale: string): string[] {
  try {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2026, 0, 5 + i)));
  } catch {
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  }
}

export default function ColleagueDetailScreen() {
  const t = useT();
  const locale = useLocale();
  const days = weekdayInitials(locale);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [c, setC] = useState<ColleagueDetail | null>(null);
  const [state, setState] = useState<'loading' | 'notfound' | 'ok'>('loading');
  const [cheering, setCheering] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setC(await api.colleague(id));
      setState('ok');
    } catch {
      setState('notfound');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (state === 'loading') {
    return (
      <NbSheet>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.centre}><ActivityIndicator color={nb.ink} /></View>
      </NbSheet>
    );
  }
  if (state === 'notfound' || !c) {
    return (
      <NbSheet>
        <Stack.Screen options={{ headerShown: false }} />
        <NbBackTitle title={t('colleague.title')} onBack={() => router.back()} />
        <View style={styles.centre}><Text style={nbText.hand(17)}>{t('colleague.notFound')}</Text></View>
      </NbSheet>
    );
  }

  // Weekly graph: same Monday-first shape the home streak strip uses.
  const week = weekBlocks(c.activeDates ?? []);

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />
      <NbBackTitle
        title={c.name}
        onBack={() => router.back()}
        right={c.destination ? <NbTag color={nb.soft} rot={1}>{c.destination.toUpperCase()}</NbTag> : undefined}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* The header photograph, taped down. */}
        <NbPaper rot={-0.5} tape tapeLeft={150} style={styles.hero}>
          <NbPolaroid name={c.name} size={74} rot={-3}>
            <NbAvatar size={74} spec={c.avatar ? normalizeAvatarSpec(c.avatar) : avatarSpecFromSeed(c.id)} />
          </NbPolaroid>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Text numberOfLines={1} style={[nbText.hand(24), { flexShrink: 1 }]}>{c.name}</Text>
              <RelTag relation={c.relation} />
            </View>
            <Text numberOfLines={2} style={[nbText.body(11.5, nb.soft), { marginTop: 3 }]}>
              {[c.destination?.toUpperCase(), relLabel(t, c.relation)].filter(Boolean).join(' · ')}
            </Text>
          </View>
        </NbPaper>

        {/* Three stats, dashed apart. Two of them are levels and they are NOT
            interchangeable: this used to be `c.targetLevel || String(c.level ?? '-')`
            under one "Lv." label, so the same row meant "B1" for one colleague and "12"
            for the next. */}
        <NbPaper rot={0.4} style={styles.stats}>
          <Stat label={t('colleague.langLevel')} value={c.targetLevel || '-'} first />
          <Stat label="LV" value={String(c.level ?? '-')} />
          <Stat label={t('growth.streak')} value={t('colleague.days', { n: c.streak ?? 0 })} />
        </NbPaper>

        {/* 지금 학습 중 */}
        {c.statusHidden ? (
          <Hidden text={t('colleague.progressHidden')} />
        ) : !!c.activity && (
          <NbPaper rot={-0.4} bg="rgba(168,217,151,.3)" style={styles.now}>
            <View style={styles.dot} />
            <Text numberOfLines={2} style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>
              {t('colleague.nowDoing', { activity: c.activity })}
            </Text>
          </NbPaper>
        )}

        {/* 이번 주 학습 — the week as boxes you can count, ticked where they came in. */}
        {c.weeklyHidden ? (
          <Hidden text={t('colleague.weekHidden')} />
        ) : (
          <NbPaper rot={0.5} style={styles.week}>
            <Text style={nbText.hand(16)}>{t('colleague.thisWeek')}</Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 9 }}>
              {week.map((d, i) => (
                <View
                  key={i}
                  style={[
                    styles.day,
                    {
                      backgroundColor: d ? 'rgba(168,217,151,.85)' : 'transparent',
                      borderColor: d ? nb.ink : 'rgba(62,54,43,.25)',
                      borderStyle: d ? 'solid' : 'dashed',
                      transform: [{ rotate: i % 2 ? '1.2deg' : '-1.2deg' }],
                    },
                  ]}
                >
                  <Text numberOfLines={1} style={styles.dayLabel}>{days[i]}</Text>
                  {d && <View style={{ marginTop: 1 }}><NbIcon name="check" size={11} color={nb.green} /></View>}
                </View>
              ))}
            </View>
          </NbPaper>
        )}

        {/* 주고받은 응원 */}
        <SectionRule label={t('colleague.cheersExchanged')} />
        {c.cheers.length === 0 ? (
          <Text style={[nbText.hand(15, nb.soft), { textAlign: 'center', paddingVertical: 16 }]}>
            {t('colleague.noCheers')}
          </Text>
        ) : c.cheers.map((ch, i) => {
          const mine = ch.toUserId === c.id; // I sent it to them
          // Sent on the right, received on the left — the DM convention, so position
          // carries the direction. That makes a 보냄/받음 badge redundant: it would label
          // what the layout already says. The paper colour is the second, redundant cue.
          return (
            <View key={ch.id} style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginTop: 9 }}>
              <NbPaper rot={i % 2 ? 0.6 : -0.6} bg={mine ? nb.paper : '#FCEEDC'} style={styles.cheer}>
                {!mine && <Text numberOfLines={1} style={nbText.hand(13, nb.soft)}>{c.name}</Text>}
                <Text style={[nbText.hand(16), { marginTop: mine ? 0 : 2 }]}>
                  {[ch.presetText, ch.message].filter(Boolean).join(' · ')}
                </Text>
              </NbPaper>
            </View>
          );
        })}

        <View style={{ marginTop: 18 }}>
          <NbButton variant="ink" size="lg" full icon="speech" iconColor={nb.paper} onPress={() => setCheering(true)}>
            {t('colleague.sendCheer')}
          </NbButton>
        </View>

        <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 12 }}>
          <Text style={nbText.hand(13.5)}>{t('colleague.mentorSoon')}</Text>
        </NbMemo>

        {/* Quiet, and at the bottom: removing somebody is not one of the two things this
            page is for. */}
        <Pressable
          onPress={() => Alert.alert(t('colleague.removeTitle'), t('colleague.removeBody', { name: c.name }), [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('colleague.remove'), style: 'destructive',
              onPress: async () => { await api.removeColleague(c.id).catch(() => {}); router.back(); },
            },
          ])}
          hitSlop={8}
          style={{ marginTop: 16, paddingVertical: 8, alignItems: 'center' }}
        >
          <Text style={[nbText.hand(14, nb.soft), { textDecorationLine: 'underline' }]}>{t('colleague.removeLink')}</Text>
        </Pressable>
      </ScrollView>

      <CheerSheet
        visible={cheering}
        name={c.name}
        activity={c.activity}
        onClose={() => setCheering(false)}
        onSend={async (preset, message) => {
          try {
            await api.sendCheer(c.id, { preset, message: message || undefined });
            await load();
          } catch {
            Alert.alert(t('colleague.cheerFailed'), t('colleague.cheerLimit'));
          }
        }}
      />
    </NbSheet>
  );
}

/**
 * The relation's label, or nothing when there is no relation.
 *
 * `rel[0]` on an absent value is what crashed the colleague screen: the detail endpoint did
 * not send `relation`, the type said it always would, and indexing into undefined threw
 * before anything rendered. An empty string is dropped by the caller's filter(Boolean), so
 * the header simply omits the part it cannot say.
 */
function relLabel(t: Translate, rel?: ColleagueRelation): string {
  if (!rel) return '';
  return t(`colleague.relation${rel[0].toUpperCase()}${rel.slice(1)}`);
}

function Stat({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <View style={[styles.stat, !first && styles.statDivider]}>
      <Text numberOfLines={1} style={nbText.body(10, nb.soft)}>{label}</Text>
      <Text numberOfLines={1} style={[nbText.hand(19), { marginTop: 2 }]}>{value}</Text>
    </View>
  );
}

/** A block the colleague chose not to share. Dashed and empty on purpose: it says the
 *  space exists and is theirs to open, which is different from the block not existing. */
function Hidden({ text }: { text: string }) {
  return (
    <View style={styles.hidden}>
      <NbIcon name="lock" size={15} color={nb.soft} />
      <Text style={[nbText.hand(14.5, nb.soft), { flex: 1, minWidth: 0 }]}>{text}</Text>
    </View>
  );
}

// weekBlocks turns yyyy-mm-dd active dates into Monday-first booleans.
function weekBlocks(activeDates: string[]): boolean[] {
  const set = new Set(activeDates);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return set.has(key);
  });
}

const styles = {
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 } as const,
  scroll: { paddingHorizontal: 20, paddingBottom: 32 } as const,
  hero: { marginTop: 14, paddingVertical: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 14 } as const,
  stats: { marginTop: 12, paddingVertical: 11, paddingHorizontal: 13, flexDirection: 'row' } as const,
  stat: { flex: 1, alignItems: 'center' } as const,
  statDivider: { borderLeftWidth: 1.3, borderStyle: 'dashed', borderLeftColor: 'rgba(62,54,43,.2)' } as const,
  now: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 } as const,
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: nb.green, flexShrink: 0 } as const,
  week: { marginTop: 12, paddingVertical: 11, paddingHorizontal: 13 } as const,
  day: { flex: 1, height: 34, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center' } as const,
  dayLabel: { fontFamily: nbFonts.mono, fontSize: 8.5, color: nb.soft } as const,
  cheer: { maxWidth: '82%', paddingVertical: 9, paddingHorizontal: 12 } as const,
  hidden: {
    marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(62,54,43,.28)',
  } as const,
};
