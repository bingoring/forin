// 동료 목록 — the 근무 수첩 line (v30).
//
// A page of photographs. Each colleague is a polaroid print with their name written on the
// bottom margin, and the row beside it says the two things you actually came to check:
// whether they turned up today, and what they are on. The data is unchanged.
//
// 관계 종류(peer/mentor/mentee)는 데이터에 있고 화면은 그대로 렌더한다 — 훗날 현지
// 간호사 멘토가 들어와도 이 화면을 고칠 일이 없게 설계된 부분이다.
//
// Two things in the v30 artboard are NOT drawn, because nothing behind them exists:
//   · 이번 주 함께 목표 (a shared weekly goal with its own gauge) — there is no group
//     goal on the server, and a gauge filled from a number we invented would be the one
//     widget on the page that lies.
//   · 현지 근무중 (a green "working abroad" pill) — Colleague carries no such field. It
//     is also the entry point for the mentor feature, which is why the memo at the bottom
//     says the matching is still being prepared rather than showing a pill that is always
//     off.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbPolaroid, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { CheerSheet } from '@/components/CheerSheet';
import { api, type Colleague, type ColleagueRelation, type ColleagueRequest, type InviteCode } from '@/api/client';
import { useT } from '@/i18n';

// 관계 표시 — mentor/mentee는 지금도 렌더된다(확장 슬롯이 아니라 실제 지원).
// labelKey, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
export const REL: Record<ColleagueRelation, { labelKey: string; nbIcon: NbIconName; color: string }> = {
  peer: { labelKey: 'colleague.relationPeer', nbIcon: 'handshake2', color: nb.green },
  mentor: { labelKey: 'colleague.relationMentor', nbIcon: 'star', color: '#C99A1E' },
  mentee: { labelKey: 'colleague.relationMentee', nbIcon: 'bulb', color: nb.blue },
};

/** Nothing renders when the relation is unknown — see ColleagueDetail.relation. Falling
 *  back to "peer" would state a relationship the server never claimed. */
export function RelTag({ relation }: { relation?: ColleagueRelation }) {
  const t = useT();
  const r = relation ? REL[relation] : undefined;
  if (!r) return null;
  return <NbTag color={r.color} rot={-2}>{t(r.labelKey)}</NbTag>;
}

export default function ColleaguesScreen() {
  const t = useT();
  const router = useRouter();
  const [rows, setRows] = useState<Colleague[]>([]);
  const [requests, setRequests] = useState<ColleagueRequest[]>([]);
  const [unread, setUnread] = useState(0);
  const [code, setCode] = useState<InviteCode | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [cheerTo, setCheerTo] = useState<Colleague | null>(null);

  const load = useCallback(async () => {
    const [list, reqs, invite] = await Promise.all([
      api.colleagues(),
      api.colleagueRequests().catch(() => []),
      api.inviteCode().catch(() => null),
    ]);
    setRows(list.colleagues);
    setUnread(list.unreadCheers);
    setRequests(reqs);
    setCode(invite);
    setState('ok');
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      load().catch(() => { if (alive) setState('error'); });
      return () => { alive = false; };
    }, [load]),
  );

  const respond = async (id: string, accept: boolean) => {
    try {
      if (accept) await api.acceptColleagueRequest(id);
      else await api.declineColleagueRequest(id);
      await load();
    } catch {
      Alert.alert(t('colleague.actionFailed'), t('common.retryHint'));
    }
  };

  const here = rows.filter((c) => c.activeToday).length;

  return (
    <NbSheet>
      <Stack.Screen options={{ headerShown: false }} />

      <NbBackTitle
        title={t('colleague.title')}
        onBack={() => router.back()}
        right={state === 'ok' && rows.length > 0
          ? <NbTag color={nb.green} rot={1}>{t('colleague.hereToday', { n: rows.length, here })}</NbTag>
          : undefined}
      />

      {state === 'loading' ? (
        <View style={styles.centre}><ActivityIndicator color={nb.ink} /></View>
      ) : state === 'error' ? (
        <View style={styles.centre}><Text style={nbText.hand(17)}>{t('colleague.loadFailed')}</Text></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* 코드로 동료 맺기. Taped rather than pinned: it is the page's own note, not one
              of the people on it. The code is typed — it exists to be read out. */}
          <NbPaper rot={-0.5} tape tapeLeft={120} style={styles.codeNote}>
            <NbIcon name="handshake2" size={24} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={nbText.hand(16.5)}>{t('colleague.linkByCode')}</Text>
              <Pressable
                onPress={() => { if (code) { void Clipboard.setStringAsync(code.code).then(() => Alert.alert(t('colleagueAdd.copied'), code.code)); } }}
                disabled={!code}
                hitSlop={6}
              >
                <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 1 }]}>
                  {t('me.myCode')} <Text style={styles.codeText}>{code?.code ?? '· · · ·'}</Text>
                  {!!code && ` · ${t('colleagueAdd.copy')}`}
                </Text>
              </Pressable>
            </View>
            <NbButton variant="paper" size="sm" icon="pencil" onPress={() => router.push('/colleagues/add')}>
              {t('colleague.add')}
            </NbButton>
          </NbPaper>

          {/* 받은 요청 — 수락해야 서로의 현황이 열린다. Peach paper: it is the one thing
              on the page waiting on the reader. */}
          {requests.map((q, i) => (
            <NbPaper key={q.id} rot={i % 2 ? 0.5 : -0.5} bg="#FFF0EC" style={styles.request}>
              <Text style={nbText.hand(16)}>{t('colleague.requestFrom', { name: q.name })}</Text>
              <View style={{ flexDirection: 'row', gap: 9, marginTop: 9 }}>
                <View style={{ flex: 1 }}>
                  <NbButton variant="ink" full size="sm" icon="check" iconColor={nb.paper} onPress={() => respond(q.id, true)}>
                    {t('colleague.accept')}
                  </NbButton>
                </View>
                <View style={{ flex: 1 }}>
                  <NbButton variant="paper" full size="sm" onPress={() => respond(q.id, false)}>
                    {t('colleague.decline')}
                  </NbButton>
                </View>
              </View>
            </NbPaper>
          ))}

          {/* 받은 응원 */}
          {unread > 0 && (
            <Pressable onPress={async () => { await api.cheerInbox(true); setUnread(0); }}>
              <NbPaper rot={0.4} bg="rgba(249,227,123,.5)" style={styles.inbox}>
                <NbIcon name="star" size={20} color="#C99A1E" />
                <Text style={[nbText.hand(16.5), { flex: 1, minWidth: 0 }]}>{t('colleague.cheersWaiting', { n: unread })}</Text>
                <NbIcon name="chevronRight" size={14} />
              </NbPaper>
            </Pressable>
          )}

          <SectionRule label={t('colleague.myColleagues')} />

          {rows.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>{t('colleague.emptyNb')}</Text>
            </View>
          ) : rows.map((c, i) => (
            <Pressable key={c.id} onPress={() => router.push(`/colleagues/${c.id}`)}>
              <NbPaper rot={i % 2 ? 0.5 : -0.5} style={styles.row}>
                <NbPolaroid name={c.name} rot={i % 2 ? 2 : -2} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text numberOfLines={1} style={[nbText.hand(18.5), { flexShrink: 1 }]}>{c.name}</Text>
                    <RelTag relation={c.relation} />
                  </View>
                  <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>
                    {c.statusHidden ? t('home.privateProgress') : c.activity || t('colleague.quietDay')}
                  </Text>
                  {/* The band alone. "Lv." collided with the XP level's "LV", and we do
                      not know which language THIS person is learning, so there is no code
                      to prefix it with — A1..C2 identifies itself. */}
                  <Text numberOfLines={1} style={[nbText.hand(13.5, nb.soft), { marginTop: 1 }]}>
                    {[
                      c.targetLevel || '-',
                      c.streak ? t('colleague.streakDays', { n: c.streak }) : null,
                      c.activeToday ? t('colleague.cameToday') : t('colleague.notYetToday'),
                    ].filter(Boolean).join(' · ')}
                  </Text>
                </View>
                {/* Its own target inside the row's: NbButton is itself a Pressable, and
                    the inner responder wins, so cheering does not also open the profile. */}
                <NbButton variant="dashed" size="sm" icon="speech" onPress={() => setCheerTo(c)}>
                  {t('colleague.cheer')}
                </NbButton>
              </NbPaper>
            </Pressable>
          ))}

          <NbMemo color={nb.blue} rot={0.3} style={{ marginTop: 14 }}>
            <Text style={nbText.hand(13.5)}>{t('colleague.mentorSoon')}</Text>
          </NbMemo>
        </ScrollView>
      )}

      <CheerSheet
        visible={!!cheerTo}
        name={cheerTo?.name ?? ''}
        activity={cheerTo?.activity}
        onClose={() => setCheerTo(null)}
        onSend={async (preset, message) => {
          if (!cheerTo) return;
          try {
            await api.sendCheer(cheerTo.id, { preset, message: message || undefined });
          } catch {
            Alert.alert(t('colleague.cheerFailed'), t('colleague.cheerLimit'));
          }
        }}
      />
    </NbSheet>
  );
}

/** A written section heading with the rule drawn, not typed — the pixel line spelled these
 *  out as ━━━ runs, which is a glyph pretending to be a line. */
export function SectionRule({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 18, marginBottom: 2 }}>
      <Text numberOfLines={1} style={nbText.hand(17)}>{label}</Text>
      <View style={{ flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.25)' }} />
    </View>
  );
}

/** The back chip + written title both screens share. */
export function NbBackTitle({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack: () => void }) {
  return (
    <View style={styles.head}>
      <Pressable onPress={onBack} hitSlop={8}>
        <NbPaper rot={-1} style={styles.backChip}><NbIcon name="chevronLeft" size={16} /></NbPaper>
      </Pressable>
      <Text numberOfLines={1} style={[nbText.hand(28), { flex: 1, minWidth: 0 }]}>{title}</Text>
      {right}
    </View>
  );
}

const styles = {
  head: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 10 } as const,
  backChip: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' } as const,
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 } as const,
  scroll: { paddingHorizontal: 20, paddingBottom: 32 } as const,
  codeNote: { marginTop: 14, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 } as const,
  codeText: { fontFamily: nbFonts.monoBold, color: nb.ink } as const,
  request: { marginTop: 11, paddingVertical: 11, paddingHorizontal: 13, borderColor: '#E4B4A6' } as const,
  inbox: { marginTop: 11, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 } as const,
  empty: { paddingVertical: 26 } as const,
  row: { marginTop: 11, paddingVertical: 11, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 12 } as const,
};
