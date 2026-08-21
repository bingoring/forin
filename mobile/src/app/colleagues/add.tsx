// 코드로 동료 추가 (handoff v21 ScreenColleagueAdd).
//
// 코드를 입력해도 바로 연결되지 않는다 — 요청이 가고 상대가 수락해야 서로의 학습
// 현황이 열린다. 코드를 아는 것만으로 현황이 공개되면 코드 유출이 곧 프라이버시
// 사고가 되기 때문이다(핸드오프도 "상대가 수락하면"이라고 명시).
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { PixelIcon } from '@/components/PixelIcon';
import { Header, Shadowed } from './index';
import { api, type CodePreview, type InviteCode } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useLocale, useT } from '@/i18n';

const C = colors.ink;

export default function ColleagueAddScreen() {
  const t = useT();
  const router = useRouter();
  const [mine, setMine] = useState<InviteCode | null>(null);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<CodePreview | null>(null);
  const [lookup, setLookup] = useState<'idle' | 'looking' | 'notfound'>('idle');
  const [sending, setSending] = useState(false);

  useEffect(() => { api.inviteCode().then(setMine).catch(() => setMine(null)); }, []);

  // Normalize the same way the server does, so what the user sees is what is sent.
  const normalize = (v: string) => v.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 6);
  const pretty = (v: string) => (v.length > 2 ? `${v.slice(0, 2)}-${v.slice(2)}` : v);

  const onChange = useCallback((v: string) => {
    const n = normalize(v);
    setInput(n);
    setPreview(null);
    setLookup('idle');
    if (n.length === 6) {
      setLookup('looking');
      api.lookupCode(pretty(n))
        .then((p) => { setPreview(p); setLookup('idle'); })
        .catch(() => setLookup('notfound'));
    }
  }, []);

  const send = async () => {
    if (!preview) return;
    setSending(true);
    try {
      const res = await api.addColleague(pretty(input));
      if (res.autoAccepted) Alert.alert(t('colleagueAdd.connected'), t('colleagueAdd.connectedBody'));
      else if (res.alreadyLinked) Alert.alert(t('colleagueAdd.already'));
      else if (res.alreadyRequested) Alert.alert(t('colleagueAdd.alreadySent'), t('colleagueAdd.waiting'));
      else Alert.alert(t('colleagueAdd.sent'), t('colleagueAdd.sentBody'));
      router.back();
    } catch {
      Alert.alert(t('colleagueAdd.failed'), t('colleagueAdd.failedBody'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('colleagueAdd.title')} sub={t('colleagueAdd.sub')} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* 내 코드 */}
        <Shadowed offset={4} shadowColor={colors.mintShadow} style={{ marginBottom: 15 }}>
          <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, paddingVertical: 16, paddingHorizontal: 14, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: C, opacity: 0.8 }}>내 초대 코드</Text>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(30), color: C, letterSpacing: 4, marginTop: 9, marginBottom: 4 }}>
              {mine?.code ?? '· · · ·'}
            </Text>
            {!!mine && (
              <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: C, opacity: 0.7 }}>
                7일간 유효 · 최대 {mine.maxUses}명 (현재 {mine.uses}명)
              </Text>
            )}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, alignSelf: 'stretch' }}>
              <Pressable
                disabled={!mine}
                onPress={async () => { if (mine) { await Clipboard.setStringAsync(mine.code); Alert.alert(t('colleagueAdd.copied'), mine.code); } }}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 9 }}
              >
                <PixelIcon name="copy" color={C} size={14} sw={1.7} />
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>복사</Text>
              </Pressable>
              <Pressable
                disabled={!mine}
                onPress={() => { if (mine) Share.share({ message: t('colleagueAdd.shareBody', { code: mine.code }) }); }}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: C, borderWidth: 2.5, borderColor: C, paddingVertical: 9 }}
              >
                <PixelIcon name="share" color={colors.cream} size={14} sw={1.7} />
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: colors.cream }}>공유</Text>
              </Pressable>
            </View>
          </View>
        </Shadowed>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 }}>
          <View style={{ flex: 1, height: 3, backgroundColor: C + '22' }} />
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft }}>또는</Text>
          <View style={{ flex: 1, height: 3, backgroundColor: C + '22' }} />
        </View>

        {/* 코드 입력 */}
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 8 }}>받은 코드 입력</Text>
        <Shadowed offset={2.5} shadowColor={colors.yellowShadow} style={{ marginBottom: 11 }}>
          <TextInput
            value={pretty(input)}
            onChangeText={onChange}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="XX-XXXX"
            placeholderTextColor={colors.textFaint}
            style={{
              backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 12,
              textAlign: 'center', fontFamily: fonts.heading, fontSize: fs(20), letterSpacing: 3, color: C,
            }}
          />
        </Shadowed>

        {lookup === 'looking' && (
          <View style={{ paddingVertical: 12, alignItems: 'center' }}><ActivityIndicator color={C} /></View>
        )}
        {lookup === 'notfound' && (
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft, textAlign: 'center', paddingVertical: 12 }}>
            코드를 찾을 수 없어요. 만료됐거나 잘못 입력했을 수 있어요.
          </Text>
        )}
        {!!preview && (
          <Shadowed offset={3} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 11, paddingHorizontal: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: colors.cream, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <PixelIcon name="people" color={C} size={22} sw={1.7} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(12.5), color: C }}>{preview.name}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>
                  {[preview.targetLevel && `Lv.${preview.targetLevel}`, preview.destination?.toUpperCase(), preview.streak ? t('colleague.streakDays', { n: preview.streak }) : null]
                    .filter(Boolean).join(' · ')}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.mint, borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>찾음</Text>
              </View>
            </View>
          </Shadowed>
        )}

        <Pressable
          onPress={send}
          disabled={!preview || sending}
          style={{ backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 13, alignItems: 'center', opacity: !preview || sending ? 0.5 : 1 }}
        >
          {sending
            ? <ActivityIndicator color={colors.cream} />
            : <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: colors.cream }}>동료 요청 보내기</Text>}
        </Pressable>

        <View style={{ marginTop: 13, backgroundColor: colors.cream, borderWidth: 2, borderColor: C + '55', paddingVertical: 9, paddingHorizontal: 11 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 17 }}>
            상대가 수락하면 서로의 <Text style={{ color: C }}>학습 현황</Text>과 <Text style={{ color: C }}>응원</Text>을 주고받을 수 있어요.
            공개 범위는 언제든 바꿀 수 있습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
