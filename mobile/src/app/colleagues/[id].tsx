// 동료 프로필 (handoff v21 ScreenColleagueDetail).
//
// 서버는 연결되지 않은 상대에게 404를 준다(403이면 계정 존재가 새어나간다) — 여기서는
// 그냥 "찾을 수 없어요"로 보여주면 된다. 공개 범위를 끈 동료는 해당 블록을 숨긴다.
//
// ⚔ 대결 버튼은 렌더하지 않는다: 규칙·서버가 없는 버튼을 두면 눌렀을 때 아무 일도
// 일어나지 않는다(Build Spec Q4에서 이번 범위 제외로 확정).
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { PixelIcon } from '@/components/PixelIcon';
import { CheerSheet } from '@/components/CheerSheet';
import { Header, RelTag, Shadowed } from './index';
import { api, type ColleagueDetail, type ColleagueRelation } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale } from '@/i18n';

const C = colors.ink;
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
      <View style={{ flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C} />
      </View>
    );
  }
  if (state === 'notfound' || !c) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header title={t('colleague.title')} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft }}>찾을 수 없어요.</Text>
        </View>
      </View>
    );
  }

  // Weekly graph: same Monday-first shape the home streak strip uses.
  const week = weekBlocks(c.activeDates ?? []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title={c.name}
        sub={[c.destination?.toUpperCase(), relLabel(c.relation)].filter(Boolean).join(' · ')}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* 프로필 히어로 */}
        <Shadowed offset={4} style={{ marginBottom: 13 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.cream, borderWidth: 3, borderColor: C, padding: 13 }}>
            <View style={{ width: 62, height: 62, backgroundColor: '#fff', borderWidth: 3, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <PixelIcon name="people" color={C} size={34} sw={1.7} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C }}>{c.name}</Text>
                <RelTag relation={c.relation} />
              </View>
              <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
                <Stat label="Lv." value={c.targetLevel || String(c.level ?? '-')} />
                <Stat label={t('growth.streak')} value={t('colleague.days', { n: c.streak ?? 0 })} />
              </View>
            </View>
          </View>
        </Shadowed>

        {/* 지금 학습 중 */}
        {c.statusHidden ? (
          <Hidden text={t('colleague.progressHidden')} />
        ) : !!c.activity && (
          <Shadowed offset={3} shadowColor={colors.mintShadow} style={{ marginBottom: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.mint, borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}>
              <View style={{ width: 8, height: 8, backgroundColor: colors.mintShadow, borderWidth: 1.5, borderColor: C }} />
              <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 16 }}>
                지금 <Text style={{ fontFamily: fonts.heading }}>{c.activity}</Text> 진행 중
              </Text>
            </View>
          </Shadowed>
        )}

        {/* 주간 학습 */}
        {c.weeklyHidden ? (
          <Hidden text={t('colleague.weekHidden')} />
        ) : (
          <Shadowed offset={3} style={{ marginBottom: 13 }}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 11, paddingHorizontal: 12 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 9 }}>이번 주 학습</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {week.map((d, i) => (
                  <View key={i} style={{
                    flex: 1, height: 30, alignItems: 'center', justifyContent: 'flex-end',
                    backgroundColor: d ? colors.mint : '#fff',
                    borderWidth: 2, borderColor: d ? C : C + '44',
                  }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C, opacity: 0.55, paddingBottom: 2 }}>{days[i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Shadowed>
        )}

        {/* 주고받은 응원 */}
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 8 }}>━ 주고받은 응원 ━━━━━━</Text>
        {c.cheers.length === 0 ? (
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textFaint, paddingVertical: 14, textAlign: 'center' }}>
            아직 주고받은 응원이 없어요.
          </Text>
        ) : c.cheers.map((ch) => {
          const mine = ch.toUserId === c.id; // I sent it to them
          // Sent on the right, received on the left — the DM convention, so
          // position carries the direction. That makes the old 보냄/받음 badge
          // redundant: it was labelling what the layout now says. The colour
          // difference stays as a second, redundant cue.
          return (
            <View key={ch.id} style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <Shadowed offset={2.5} style={{ maxWidth: '82%' }}>
                <View style={{ backgroundColor: mine ? '#fff' : colors.peach, borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 11 }}>
                  {!mine && (
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C, marginBottom: 4 }}>{c.name}</Text>
                  )}
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 17 }}>
                    {[ch.presetText, ch.message].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </Shadowed>
            </View>
          );
        })}

        <Pressable
          onPress={() => setCheering(true)}
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 13, backgroundColor: colors.yellow, borderWidth: 3, borderColor: C, paddingVertical: 12 }}
        >
          <PixelIcon name="clap" color={C} size={17} sw={1.7} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>응원 보내기</Text>
        </Pressable>

        <Pressable
          onPress={() => Alert.alert(t('colleague.removeTitle'), t('colleague.removeBody', { name: c.name }), [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('colleague.remove'), style: 'destructive',
              onPress: async () => { await api.removeColleague(c.id).catch(() => {}); router.back(); },
            },
          ])}
          style={{ marginTop: 10, paddingVertical: 10, alignItems: 'center' }}
        >
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textFaint }}>동료에서 삭제</Text>
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
    </View>
  );
}

/** The relation in the reader's language. A function, so it re-resolves per render. */
function relLabel(rel: ColleagueRelation): string {
  return t(`colleague.relation${rel[0].toUpperCase()}${rel.slice(1)}`);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: colors.textSoft }}>{label}</Text>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function Hidden({ text }: { text: string }) {
  return (
    <View style={{ backgroundColor: colors.cream, borderWidth: 2, borderColor: C + '55', paddingVertical: 10, paddingHorizontal: 12, marginBottom: 13 }}>
      <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft }}>{text}</Text>
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
