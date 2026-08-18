// 동료 목록 (handoff v21 ScreenColleagues).
//
// 관계 종류(peer/mentor/mentee)는 데이터에 있고 화면은 그대로 렌더한다 — 훗날
// 현지 간호사 멘토가 들어와도 이 화면을 고칠 일이 없게 설계된 부분이다.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { PixelIcon, type IconName } from '@/components/PixelIcon';
import { CheerSheet } from '@/components/CheerSheet';
import { api, type Colleague, type ColleagueRelation, type ColleagueRequest, type InviteCode } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';

const C = colors.ink;

// 관계 표시 — mentor/mentee는 지금도 렌더된다(확장 슬롯이 아니라 실제 지원).
export const REL: Record<ColleagueRelation, { label: string; icon: IconName; bg: string }> = {
  peer: { label: '동료', icon: 'handshake', bg: colors.mint },
  mentor: { label: '멘토', icon: 'star', bg: colors.yellow },
  mentee: { label: '멘티', icon: 'sprout', bg: colors.blue },
};

export function RelTag({ relation }: { relation: ColleagueRelation }) {
  const r = REL[relation] ?? REL.peer;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: r.bg, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
      <PixelIcon name={r.icon} color={C} size={9} sw={1.8} />
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: C }}>{r.label}</Text>
    </View>
  );
}

export default function ColleaguesScreen() {
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
      Alert.alert('처리하지 못했어요', '잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="동료" sub={`함께 준비하는 사람들 · ${rows.length}명`} onBack={() => router.back()} />

      {state === 'loading' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C} /></View>
      ) : state === 'error' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft }}>동료를 불러오지 못했어요.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* 내 초대 코드 */}
          {!!code && (
            <Shadowed offset={3} style={{ marginBottom: 13 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 11, paddingHorizontal: 12 }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.cream, opacity: 0.75 }}>내 초대 코드</Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(19), color: colors.mint, letterSpacing: 2, marginTop: 3 }}>{code.code}</Text>
                </View>
                <Pressable onPress={() => router.push('/colleagues/add')} style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 9 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>+ 추가</Text>
                </Pressable>
              </View>
            </Shadowed>
          )}

          {/* 받은 요청 — 수락해야 서로의 현황이 열린다 */}
          {requests.map((q) => (
            <Shadowed key={q.id} offset={3} shadowColor={colors.peachShadow} style={{ marginBottom: 10 }}>
              <View style={{ backgroundColor: colors.peach, borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 16 }}>
                  <Text style={{ fontFamily: fonts.heading }}>{q.name}</Text>님이 동료 요청을 보냈어요
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
                  <Pressable onPress={() => respond(q.id, true)} style={{ flex: 1, backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 7, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: colors.cream }}>수락</Text>
                  </Pressable>
                  <Pressable onPress={() => respond(q.id, false)} style={{ flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 7, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C }}>거절</Text>
                  </Pressable>
                </View>
              </View>
            </Shadowed>
          ))}

          {/* 응원 인박스 */}
          {unread > 0 && (
            <Shadowed offset={3} style={{ marginBottom: 14 }}>
              <Pressable
                onPress={async () => { await api.cheerInbox(true); setUnread(0); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.yellow, borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 12 }}
              >
                <PixelIcon name="clap" color={C} size={18} sw={1.7} />
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(11), color: C }}>받은 응원 {unread}건</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>확인</Text>
              </Pressable>
            </Shadowed>
          )}

          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 8 }}>━ 내 동료 ━━━━━━━━━</Text>

          {rows.length === 0 ? (
            <View style={{ paddingVertical: 26, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', lineHeight: 18 }}>
                아직 동료가 없어요.{'\n'}코드를 주고받아 연결해보세요.
              </Text>
            </View>
          ) : rows.map((c) => (
            <Shadowed key={c.id} offset={3} style={{ marginBottom: 9 }}>
              <Pressable
                onPress={() => router.push(`/colleagues/${c.id}`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 11 }}
              >
                <View style={{ width: 40, height: 40, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <PixelIcon name="people" color={C} size={22} sw={1.7} />
                  {c.activeToday && (
                    <View style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, backgroundColor: colors.mintShadow, borderWidth: 1.5, borderColor: C }} />
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>{c.name}</Text>
                    <RelTag relation={c.relation} />
                  </View>
                  <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft, lineHeight: 15 }}>
                    {c.statusHidden ? '학습 현황 비공개' : c.activity || '조용한 하루'}
                  </Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginTop: 3 }}>
                    {c.relation === 'mentor' ? (c.targetLevel || '멘토') : `Lv.${c.targetLevel || '-'}`}
                    {c.streak ? ` · 연속 ${c.streak}일` : ''}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setCheerTo(c)}
                  style={{ backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 8 }}
                >
                  <PixelIcon name="clap" color={C} size={16} sw={1.7} />
                </Pressable>
              </Pressable>
            </Shadowed>
          ))}

          <Text style={{ marginTop: 6, textAlign: 'center', fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textFaint, lineHeight: 15 }}>
            현지 간호사 멘토 매칭은 준비 중이에요
          </Text>
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
            Alert.alert('응원을 보내지 못했어요', '하루에 보낼 수 있는 횟수를 넘었을 수 있어요.');
          }
        }}
      />
    </View>
  );
}

export function Header({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <View style={{ backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C, paddingTop: 56, paddingBottom: 11, paddingHorizontal: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        {!!onBack && (
          <Pressable onPress={onBack} style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>‹</Text>
          </Pressable>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C }}>{title}</Text>
          {!!sub && <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{sub}</Text>}
        </View>
      </View>
    </View>
  );
}

export function Shadowed({ children, offset = 3, shadowColor = C, style }: {
  children: React.ReactNode; offset?: number; shadowColor?: string; style?: object;
}) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
